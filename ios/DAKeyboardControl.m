//
//  DAKeyboardControl.m
//  DAKeyboardControlExample
//
//  Created by Daniel Amitay on 7/14/12.
//  Copyright (c) 2012 Daniel Amitay. All rights reserved.
//
#import "DAKeyboardControl.h"
#import <TitaniumKit/TitaniumKit.h>
#import <objc/runtime.h>
#import "TiBase.h"
#import <TiUtils.h>
#import "TiUIView.h"
#import "TiViewProxy.h"
#import "TiUIScrollView.h"
#import "TiUITableView.h"
#import "TiUILabel.h"
#import "TiUIImageView.h"
#import "TiViewProxy.h"


static inline UIViewAnimationOptions AnimationOptionsForCurve(UIViewAnimationCurve curve)
{
	return curve << 16;
}

static char UIViewKeyboardTriggerOffset;
static char UIViewKeyboardDidMoveFrameBasedBlock;
static char UIViewKeyboardDidMoveConstraintBasedBlock;
static char UIViewKeyboardActiveInput;
static char UIViewKeyboardActiveView;
static char UIViewKeyboardPanRecognizer;
static char UIViewPreviousKeyboardRect;
static char UIViewIsPanning;
static char UIViewKeyboardOpened;
CGFloat keyboardViewHeight;
CGFloat keyboardWindowHeight;

@interface UIView (DAKeyboardControl_Internal) <UIGestureRecognizerDelegate>

@property (nonatomic) DAKeyboardDidMoveBlock frameBasedKeyboardDidMoveBlock;
@property (nonatomic) DAKeyboardDidMoveBlock constraintBasedKeyboardDidMoveBlock;
@property (nonatomic, strong) UIResponder *keyboardActiveInput;
@property (nonatomic, strong) UIView *keyboardActiveView;
@property (nonatomic, strong) UIPanGestureRecognizer *keyboardPanRecognizer;
@property (nonatomic) CGRect previousKeyboardRect;
@property (nonatomic, getter = isPanning) BOOL panning;
@property (nonatomic, getter = isKeyboardOpened) BOOL keyboardOpened;
@end

@implementation UIView (DAKeyboardControl)
@dynamic keyboardTriggerOffset;

+ (void)load
{
    // Swizzle the 'addSubview:' method to ensure that all input fields
    // have a valid inputAccessoryView upon addition to the view heirarchy
    SEL originalSelector = @selector(addSubview:);
    SEL swizzledSelector = @selector(swizzled_addSubview:);
    Method originalMethod = class_getInstanceMethod(self, originalSelector);
    Method swizzledMethod = class_getInstanceMethod(self, swizzledSelector);
    class_addMethod(self,
					originalSelector,
					class_getMethodImplementation(self, originalSelector),
					method_getTypeEncoding(originalMethod));
	class_addMethod(self,
					swizzledSelector,
					class_getMethodImplementation(self, swizzledSelector),
					method_getTypeEncoding(swizzledMethod));
    method_exchangeImplementations(originalMethod, swizzledMethod);
}

#pragma mark - Public Methods

- (void)addKeyboardPanningWithActionHandler:(DAKeyboardDidMoveBlock)actionHandler
{
    [self addKeyboardControl:YES frameBasedActionHandler:actionHandler constraintBasedActionHandler:0];
}

- (void)addKeyboardPanningWithFrameBasedActionHandler:(DAKeyboardDidMoveBlock)didMoveFrameBasesBlock constraintBasedActionHandler:(DAKeyboardDidMoveBlock)didMoveConstraintBasesBlock
{
    [self addKeyboardControl:YES frameBasedActionHandler:didMoveFrameBasesBlock constraintBasedActionHandler:didMoveConstraintBasesBlock];
}

- (void)addKeyboardNonpanningWithActionHandler:(DAKeyboardDidMoveBlock)actionHandler
{
    [self addKeyboardControl:NO frameBasedActionHandler:actionHandler constraintBasedActionHandler:0];
}

- (void)addKeyboardNonpanningWithFrameBasedActionHandler:(DAKeyboardDidMoveBlock)didMoveFrameBasesBlock
                            constraintBasedActionHandler:(DAKeyboardDidMoveBlock)didMoveConstraintBasesBlock
{
    [self addKeyboardControl:NO frameBasedActionHandler:didMoveFrameBasesBlock constraintBasedActionHandler:didMoveConstraintBasesBlock];
}

- (void)addKeyboardControl:(BOOL)panning frameBasedActionHandler:(DAKeyboardDidMoveBlock)frameBasedActionHandler constraintBasedActionHandler:(DAKeyboardDidMoveBlock)constraintBasedActionHandler
{
#if (__IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_7_0)

    NSLog(@"");
    NSLog(@"");
    NSLog(@"");

    NSLog(@"++++++++++++++++++++++++++++++");

    NSLog(@"++++++++++++++++++++++++++++++   KeyboardDismissMode");

    if (panning && [self respondsToSelector:@selector(setKeyboardDismissMode:)]) {

//    if (panning) {
        NSLog(@"++++++++++++++++++++++++++++++   setKeyboardDismissMode");

        [(UIScrollView *)self setKeyboardDismissMode:UIScrollViewKeyboardDismissModeInteractive];
    } else {
        NSLog(@"NOT   setKeyboardDismissMode");

        self.panning = panning;
    }
#else
    NSLog(@"NOT setKeyboardDismissMode");

    self.panning = panning;
#endif
    self.frameBasedKeyboardDidMoveBlock = frameBasedActionHandler;
    self.constraintBasedKeyboardDidMoveBlock = constraintBasedActionHandler;
    
//    // Register for text input notifications
//    [[NSNotificationCenter defaultCenter] addObserver:self
//                                             selector:@selector(responderDidBecomeActive:)
//                                                 name:UITextFieldTextDidBeginEditingNotification
//                                               object:nil];
//    [[NSNotificationCenter defaultCenter] addObserver:self
//                                             selector:@selector(responderDidBecomeActive:)
//                                                 name:UITextViewTextDidBeginEditingNotification
//                                               object:nil];
//
    // Register for keyboard notifications
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(inputKeyboardWillShow:)
                                                 name:UIKeyboardWillShowNotification
                                               object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(inputKeyboardDidShow)
                                                 name:UIKeyboardDidShowNotification
                                               object:nil];
    
    // For the sake of 4.X compatibility
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(inputKeyboardWillChangeFrame:)
                                                 name:@"UIKeyboardWillChangeFrameNotification"
                                               object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(inputKeyboardDidChangeFrame)
                                                 name:@"UIKeyboardDidChangeFrameNotification"
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(inputKeyboardWillHide:)
                                                 name:UIKeyboardWillHideNotification
                                               object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(inputKeyboardDidHide)
                                                 name:UIKeyboardDidHideNotification
                                               object:nil];
}

- (CGRect)keyboardFrameInView
{
    if (self.keyboardActiveView)
    {
        CGRect keyboardFrameInView = [self convertRect:self.keyboardActiveView.frame
                                              fromView:self.keyboardActiveView.superview];
        return keyboardFrameInView;
    }
    else
    {
        CGRect keyboardFrameInView = CGRectMake(0.0f,
                                                [[UIScreen mainScreen] bounds].size.height,
                                                0.0f,
                                                0.0f);
        return keyboardFrameInView;
    }
}

- (void)removeKeyboardControl
{
//    // Unregister for text input notifications
//    [[NSNotificationCenter defaultCenter] removeObserver:self
//                                                    name:UITextFieldTextDidBeginEditingNotification
//                                                  object:nil];
//    [[NSNotificationCenter defaultCenter] removeObserver:self
//                                                    name:UITextViewTextDidBeginEditingNotification
//                                                  object:nil];
    
    // Unregister for keyboard notifications
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:UIKeyboardWillShowNotification
                                                  object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:UIKeyboardDidShowNotification
                                                  object:nil];
    
    // For the sake of 4.X compatibility
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:@"UIKeyboardWillChangeFrameNotification"
                                                  object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:@"UIKeyboardDidChangeFrameNotification"
                                                  object:nil];
    
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:UIKeyboardWillHideNotification
                                                  object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:UIKeyboardDidHideNotification
                                                  object:nil];
    
    // Unregister any gesture recognizer
    [self removeGestureRecognizer:self.keyboardPanRecognizer];
    
    // Release a few properties
    self.frameBasedKeyboardDidMoveBlock = nil;
    self.keyboardActiveInput = nil;
    self.keyboardActiveView = nil;
    self.keyboardPanRecognizer = nil;
}

- (void)hideKeyboard
{
    if (self.keyboardActiveView)
    {
        self.keyboardActiveView.hidden = YES;
        self.keyboardActiveView.userInteractionEnabled = NO;
        [self.keyboardActiveInput resignFirstResponder];
    }
}

#pragma mark - Input Notifications

- (void)responderDidBecomeActive:(NSNotification *)notification
{
    // Grab the active input, it will be used to find the keyboard view later on
    
    //NSLog ( @"responderDidBecomeActive");
    
    self.keyboardActiveInput = notification.object;
    if (!self.keyboardActiveInput.inputAccessoryView)
    {
        UITextField *textField = (UITextField *)self.keyboardActiveInput;
        if ([textField respondsToSelector:@selector(setInputAccessoryView:)])
        {
            UIView *nullView = [[UIView alloc] initWithFrame:CGRectZero];
            nullView.backgroundColor = [UIColor clearColor];
            textField.inputAccessoryView = nullView;
        }
        self.keyboardActiveInput = (UIResponder *)textField;
        // Force the keyboard active view reset
        [self inputKeyboardDidShow];
    }
}

#pragma mark - Keyboard Notifications

- (void)inputKeyboardWillShow:(NSNotification *)notification
{
    CGRect keyboardEndFrameWindow;
    [[notification.userInfo valueForKey:UIKeyboardFrameEndUserInfoKey] getValue: &keyboardEndFrameWindow];
    
    double keyboardTransitionDuration;
    [[notification.userInfo valueForKey:UIKeyboardAnimationDurationUserInfoKey] getValue:&keyboardTransitionDuration];
    
    UIViewAnimationCurve keyboardTransitionAnimationCurve;
    [[notification.userInfo valueForKey:UIKeyboardAnimationCurveUserInfoKey] getValue:&keyboardTransitionAnimationCurve];
    
    self.keyboardActiveView.hidden = NO;
    self.keyboardOpened = YES;
    
    CGRect keyboardEndFrameView = [self convertRect:keyboardEndFrameWindow fromView:nil];
    
    BOOL constraintBasedKeyboardDidMoveBlockCalled = self.constraintBasedKeyboardDidMoveBlock && !CGRectIsNull(keyboardEndFrameView);
    if (constraintBasedKeyboardDidMoveBlockCalled)
        self.constraintBasedKeyboardDidMoveBlock(keyboardEndFrameView, YES, NO);
    
    [UIView animateWithDuration:keyboardTransitionDuration
                          delay:0.0f
                        options:AnimationOptionsForCurve(keyboardTransitionAnimationCurve) | UIViewAnimationOptionBeginFromCurrentState
                     animations:^{
                         if (constraintBasedKeyboardDidMoveBlockCalled)
                             [self layoutIfNeeded];
                         if (self.frameBasedKeyboardDidMoveBlock && !CGRectIsNull(keyboardEndFrameView))
                             self.frameBasedKeyboardDidMoveBlock(keyboardEndFrameView, YES, NO);
                     }
                     completion:^(__unused BOOL finished){
                         if (self.panning && !self.keyboardPanRecognizer)
                         {
                             // Register for gesture recognizer calls
                             self.keyboardPanRecognizer = [[UIPanGestureRecognizer alloc] initWithTarget:self
                                                                                                  action:@selector(panGestureDidChange:)];
                             [self.keyboardPanRecognizer setMinimumNumberOfTouches:1];
                             [self.keyboardPanRecognizer setDelegate:self];
                             [self.keyboardPanRecognizer setCancelsTouchesInView:NO];
                             [self addGestureRecognizer:self.keyboardPanRecognizer];
                         }
                     }];
}

- (void)inputKeyboardDidShow
{
    // Grab the keyboard view
   self.keyboardActiveView = [self findKeyboardView];
    self.keyboardActiveView.hidden = NO;
    
    // If the active keyboard view could not be found (UITextViews...), try again
    if (!self.keyboardActiveView)
    {
        // Find the first responder on subviews and look re-assign first responder to it
        self.keyboardActiveInput = [self recursiveFindFirstResponder:self];
        self.keyboardActiveView = [self findKeyboardView];
        self.keyboardActiveView.hidden = NO;
    }
}

- (void)inputKeyboardWillChangeFrame:(NSNotification *)notification
{
    CGRect keyboardEndFrameWindow;
    [[notification.userInfo valueForKey:UIKeyboardFrameEndUserInfoKey] getValue: &keyboardEndFrameWindow];
    
    double keyboardTransitionDuration;
    [[notification.userInfo valueForKey:UIKeyboardAnimationDurationUserInfoKey] getValue:&keyboardTransitionDuration];
    
    UIViewAnimationCurve keyboardTransitionAnimationCurve;
    [[notification.userInfo valueForKey:UIKeyboardAnimationCurveUserInfoKey] getValue:&keyboardTransitionAnimationCurve];
    
    CGRect keyboardEndFrameView = [self convertRect:keyboardEndFrameWindow fromView:nil];
    
    
    keyboardViewHeight = keyboardEndFrameView.size.height;
    keyboardWindowHeight = keyboardEndFrameWindow.size.height;

    NSLog ( @"keyboardEndFrameWindow: %f", keyboardEndFrameWindow.size.height );
    NSLog ( @"keyboardEndFrameView: %f", keyboardEndFrameView.size.height );

    
    
    BOOL constraintBasedKeyboardDidMoveBlockCalled = self.constraintBasedKeyboardDidMoveBlock && !CGRectIsNull(keyboardEndFrameView);
    if (constraintBasedKeyboardDidMoveBlockCalled)
        self.constraintBasedKeyboardDidMoveBlock(keyboardEndFrameView, NO, NO);
    
    [UIView animateWithDuration:keyboardTransitionDuration
                          delay:0.0f
                        options:AnimationOptionsForCurve(keyboardTransitionAnimationCurve) | UIViewAnimationOptionBeginFromCurrentState
                     animations:^{
                         if (constraintBasedKeyboardDidMoveBlockCalled)
                             [self layoutIfNeeded];
                         
                         if (self.frameBasedKeyboardDidMoveBlock && !CGRectIsNull(keyboardEndFrameView))
                             self.frameBasedKeyboardDidMoveBlock(keyboardEndFrameView, NO, NO);
                     }
                     completion:nil];
}

- (void)inputKeyboardDidChangeFrame
{
    // Nothing to see here
}

- (void)inputKeyboardWillHide:(NSNotification *)notification
{
    CGRect keyboardEndFrameWindow;
    [[notification.userInfo valueForKey:UIKeyboardFrameEndUserInfoKey] getValue: &keyboardEndFrameWindow];
    
    double keyboardTransitionDuration;
    [[notification.userInfo valueForKey:UIKeyboardAnimationDurationUserInfoKey] getValue:&keyboardTransitionDuration];
    
    UIViewAnimationCurve keyboardTransitionAnimationCurve;
    [[notification.userInfo valueForKey:UIKeyboardAnimationCurveUserInfoKey] getValue:&keyboardTransitionAnimationCurve];
    
    CGRect keyboardEndFrameView = [self convertRect:keyboardEndFrameWindow fromView:nil];
    
    BOOL constraintBasedKeyboardDidMoveBlockCalled = self.constraintBasedKeyboardDidMoveBlock && !CGRectIsNull(keyboardEndFrameView);
    if (constraintBasedKeyboardDidMoveBlockCalled)
        self.constraintBasedKeyboardDidMoveBlock(keyboardEndFrameView, NO, YES);
    
    [UIView animateWithDuration:keyboardTransitionDuration
                          delay:0.0f
                        options:AnimationOptionsForCurve(keyboardTransitionAnimationCurve) | UIViewAnimationOptionBeginFromCurrentState
                     animations:^{
                         if (constraintBasedKeyboardDidMoveBlockCalled)
                             [self layoutIfNeeded];
                         
                         if (self.frameBasedKeyboardDidMoveBlock && !CGRectIsNull(keyboardEndFrameView))
                             self.frameBasedKeyboardDidMoveBlock(keyboardEndFrameView, NO, YES);
                     }
                     completion:^(__unused BOOL finished){
                         // Remove gesture recognizer when keyboard is not showing
                         [self removeGestureRecognizer:self.keyboardPanRecognizer];
                         self.keyboardPanRecognizer = nil;
                     }];
}

- (void)inputKeyboardDidHide
{
    self.keyboardActiveView.hidden = NO;
    self.keyboardActiveView.userInteractionEnabled = YES;
    self.keyboardActiveView = nil;
    self.keyboardActiveInput = nil;
    self.keyboardOpened = NO;
}

- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(__unused NSDictionary *)change
                       context:(__unused void *)context
{
    if([keyPath isEqualToString:@"frame"] && object == self.keyboardActiveView)
    {
        CGRect keyboardEndFrameWindow = [[object valueForKeyPath:keyPath] CGRectValue];
        CGRect keyboardEndFrameView = [self convertRect:keyboardEndFrameWindow fromView:self.keyboardActiveView.superview];
        
        if (CGRectEqualToRect(keyboardEndFrameView, self.previousKeyboardRect)) return;
        
        if (!self.keyboardActiveView.hidden && !CGRectIsNull(keyboardEndFrameView))
        {
            if (self.frameBasedKeyboardDidMoveBlock)
                self.frameBasedKeyboardDidMoveBlock(keyboardEndFrameView, NO, NO);
            if (self.constraintBasedKeyboardDidMoveBlock)
            {
                self.constraintBasedKeyboardDidMoveBlock(keyboardEndFrameView, NO, NO);
                [self layoutIfNeeded];
            }
        }
        
        self.previousKeyboardRect = keyboardEndFrameView;
    }
}

#pragma mark - Touches Management

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldRecognizeSimultaneouslyWithGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer
{
    if (gestureRecognizer == self.keyboardPanRecognizer || otherGestureRecognizer == self.keyboardPanRecognizer)
    {
        return YES;
    }
    else
    {
        return NO;
    }
}

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldReceiveTouch:(UITouch *)touch
{
    if (gestureRecognizer == self.keyboardPanRecognizer)
    {
        
        NSLog(@"TOUCH VIEW: %@",touch.view);
        NSLog(@"SELF VIEW: %@",self);
        NSLog(@"SELF isEqal touch.view: %@",[self isEqual:touch.view]);

        
        if ((![touch.view isFirstResponder])){
            
            
            
//            CGFloat keyboardViewHeight = self.keyboardActiveView.bounds.size.height;
//            CGFloat keyboardWindowHeight = self.keyboardActiveView.superview.bounds.size.height;

            CGPoint touchLocationInKeyboardWindow = [touch locationInView:self.keyboardActiveView.superview];
            //CGPoint touchLocationInKeyboardWindow = [gesture locationInView:self.keyboardActiveView.window];

            
             NSLog ( @"\n\nkeyboardViewHeight: %f", keyboardViewHeight );
             NSLog ( @"keyboardWindowHeight: %f", keyboardWindowHeight );
            NSLog ( @"touchLocationInKeyboardWindow.y: %f", touchLocationInKeyboardWindow.y );
            NSLog ( @"keyboardWindowHeight - keyboardViewHeight - self.keyboardTriggerOffset: %f", (keyboardWindowHeight - keyboardViewHeight - self.keyboardTriggerOffset) );

            
            // If touch is inside trigger offset, then disable keyboard input
            if (touchLocationInKeyboardWindow.y > keyboardWindowHeight - keyboardViewHeight - self.keyboardTriggerOffset)
            {
                NSLog ( @"userInteractionEnabled: NO" );

                return NO;
            }
            else
            {
   
                    if ([self isKindOfClass:[UITextView class]] && [self isEqual:touch.view]){
                        NSLog ( @"TextView:");
                        return NO;
                    }

                    else if ([touch.view isKindOfClass:[UIButton class]]){
                        NSLog ( @"BUTTON :");
                        return NO;
                    }
                    else if ([touch.view isKindOfClass:[UIVisualEffectView class]]){
                        NSLog ( @"Toolbar :");
                        return NO;
                    }
                    else if ([touch.view isKindOfClass:[UILabel class]]){

                        NSLog ( @"UILabel TOUCH:");
                        return NO;

                    }
                    else if ([touch.view isKindOfClass:[UITextView class]]){

                        NSLog ( @"UITextView TOUCH:");
                        return NO;

                    }

                    else if ([touch.view isKindOfClass:[UIImageView class]]){

                       NSLog ( @"UIImageView TOUCH:");
                        return NO;

                    }
                    else {
                        NSLog ( @"ELSE YES ");

                        return YES;
                    }
            }


        }
        else {
            NSLog ( @"ELSE not gesture Recognizer ");

            return NO;
        }
        
        
//        NSString *strClass = NSStringFromClass([touch.view class]);
//
//        if ([strClass  isEqual: @"TiUITableView"]){
//            NSLog ( @"TiUITableView :");
//            return YES;
//        }
        
        
        // Don't allow panning if inside the active input (unless SELF is a UITextView and the receiving view)
//        return (![touch.view isFirstResponder] || ([self isKindOfClass:[UITextView class]] && [self isEqual:touch.view]));
    }
    else
    {

        return YES;
    }
}

/*
NSDictionary *userInfo = notification.userInfo;

CGFloat animationDuration = [userInfo[UIKeyboardAnimationDurationUserInfoKey] doubleValue];
CGRect keyboardEndFrame = [userInfo[UIKeyboardFrameEndUserInfoKey] CGRectValue];
CGRect convertedKeyboardEndFrame = [self.tableView convertRect:keyboardEndFrame fromView:self.window];
NSUInteger rawAnimationCurve = [userInfo[UIKeyboardAnimationCurveUserInfoKey] unsignedIntegerValue];
UIViewAnimationOptions animationCurve = (UIViewAnimationOptions)rawAnimationCurve << 16;

[UIView animateWithDuration:animationDuration delay:0.0 options:UIViewAnimationOptionBeginFromCurrentState | animationCurve animations:^{
self.tableView.y -= CGRectGetMaxY(self.tableView.bounds) – CGRectGetMinY(convertedKeyboardEndFrame);
} completion:nil];
*/

- (void)panGestureDidChange:(UIPanGestureRecognizer *)gesture
{
    if(!self.keyboardActiveView || !self.keyboardActiveInput || self.keyboardActiveView.hidden)
    {
        self.keyboardActiveInput = [self recursiveFindFirstResponder:self];
        self.keyboardActiveView = self.keyboardActiveView = [self findKeyboardView];
        self.keyboardActiveView.hidden = NO;
    }
    else
    {
        self.keyboardActiveView.hidden = NO;
    }
    
    CGFloat keyboardViewHeight = self.keyboardActiveView.bounds.size.height;
    CGFloat keyboardWindowHeight = self.keyboardActiveView.superview.bounds.size.height;
    CGPoint touchLocationInKeyboardWindow = [gesture locationInView:self.keyboardActiveView.superview];
    //CGPoint touchLocationInKeyboardWindow = [gesture locationInView:self.keyboardActiveView.window];

    
//     NSLog ( @"\n\nkeyboardViewHeight: %f", keyboardViewHeight );
//     NSLog ( @"keyboardWindowHeight: %f", keyboardWindowHeight );
//    NSLog ( @"touchLocationInKeyboardWindow.y: %f", touchLocationInKeyboardWindow.y );
//    NSLog ( @"keyboardWindowHeight - keyboardViewHeight - self.keyboardTriggerOffset: %f", (keyboardWindowHeight - keyboardViewHeight - self.keyboardTriggerOffset) );

    
    // If touch is inside trigger offset, then disable keyboard input
    if (touchLocationInKeyboardWindow.y > keyboardWindowHeight - keyboardViewHeight - self.keyboardTriggerOffset)
    {
        NSLog ( @"userInteractionEnabled: NO" );

        self.keyboardActiveView.userInteractionEnabled = NO;
    }
    else
    {
        NSLog ( @"userInteractionEnabled: YES" );

        self.keyboardActiveView.userInteractionEnabled = YES;
    }
    
    switch (gesture.state)
    {
        case UIGestureRecognizerStateBegan:
        {
            // For the duration of this gesture, do not recognize more touches than
            // it started with
            gesture.maximumNumberOfTouches = gesture.numberOfTouches;
        }
            break;
        case UIGestureRecognizerStateChanged:
        {
            CGRect newKeyboardViewFrame = self.keyboardActiveView.frame;
            newKeyboardViewFrame.origin.y = touchLocationInKeyboardWindow.y + self.keyboardTriggerOffset;
            // Bound the keyboard to the bottom of the screen
            newKeyboardViewFrame.origin.y = MIN(newKeyboardViewFrame.origin.y, keyboardWindowHeight);
            newKeyboardViewFrame.origin.y = MAX(newKeyboardViewFrame.origin.y, keyboardWindowHeight - keyboardViewHeight);
            
            // Only update if the frame has actually changed
            if (newKeyboardViewFrame.origin.y != self.keyboardActiveView.frame.origin.y)
            {
                [UIView animateWithDuration:0.0f
                                      delay:0.0f
                                    options:UIViewAnimationOptionTransitionNone | UIViewAnimationOptionBeginFromCurrentState
                                 animations:^{
                                     [self.keyboardActiveView setFrame:newKeyboardViewFrame];
                                     /* Unnecessary now, due to KVO on self.keyboardActiveView
                                      CGRect newKeyboardViewFrameInView = [self convertRect:newKeyboardViewFrame
                                      fromView:self.keyboardActiveView.window];
                                      if (self.frameBasedKeyboardDidMoveBlock)
                                      self.frameBasedKeyboardDidMoveBlock(newKeyboardViewFrameInView);
                                      */
                                 }
                                 completion:nil];
            }
        }
            break;
        case UIGestureRecognizerStateEnded:
        case UIGestureRecognizerStateCancelled:
        {
            CGFloat thresholdHeight = keyboardWindowHeight - keyboardViewHeight - self.keyboardTriggerOffset + 44.0f;
            CGPoint velocity = [gesture velocityInView:self.keyboardActiveView];
            BOOL shouldRecede;
            
            if (touchLocationInKeyboardWindow.y < thresholdHeight || velocity.y < 0)
                shouldRecede = NO;
            else
                shouldRecede = YES;
            
            // If the keyboard has only been pushed down 44 pixels or has been
            // panned upwards let it pop back up; otherwise, let it drop down
            CGRect newKeyboardViewFrame = self.keyboardActiveView.frame;
            newKeyboardViewFrame.origin.y = (!shouldRecede ? keyboardWindowHeight - keyboardViewHeight : keyboardWindowHeight);
            
            [UIView animateWithDuration:0.25f
                                  delay:0.0f
                                options:UIViewAnimationOptionCurveEaseOut | UIViewAnimationOptionBeginFromCurrentState
                             animations:^{
                                 [self.keyboardActiveView setFrame:newKeyboardViewFrame];
                                 /* Unnecessary now, due to KVO on self.keyboardActiveView
                                  CGRect newKeyboardViewFrameInView = [self convertRect:newKeyboardViewFrame
                                  fromView:self.keyboardActiveView.window];
                                  if (self.frameBasedKeyboardDidMoveBlock)
                                  self.frameBasedKeyboardDidMoveBlock(newKeyboardViewFrameInView);
                                  */
                             }
                             completion:^(__unused BOOL finished){
                                 [[self keyboardActiveView] setUserInteractionEnabled:!shouldRecede];
                                 if (shouldRecede)
                                 {
                                     [self hideKeyboard];
                                 }
                             }];
            
            // Set the max number of touches back to the default
            gesture.maximumNumberOfTouches = NSUIntegerMax;
        }
            break;
        default:
            break;
    }
}

#pragma mark - Internal Methods

- (UIView *)recursiveFindFirstResponder:(UIView *)view
{
    if ([view isFirstResponder])
    {
        return view;
    }
    UIView *found = nil;
    for (UIView *v in view.subviews)
    {
        found = [self recursiveFindFirstResponder:v];
        if (found)
        {
            break;
        }
    }
    return found;
}



- (UIView *)findKeyboardView {
    for (UIWindow *window in UIApplication.sharedApplication.windows) {
        UIView *view = [self getKeyboardViewFromWindow:window];
        if (view) {
            NSLog ( @"keyboardView found" );

            return view;
        }
    }
    NSLog ( @"keyboardView NOT found" );

    return nil;
}

- (UIView *)getKeyboardViewFromWindow:(UIWindow *)window {
    
    if (!window) return nil;
    
    NSString *windowName = NSStringFromClass(window.class);
    if (![windowName isEqualToString:@"UIRemoteKeyboardWindow"]) {
        return nil;
    }
    
    for (UIView *view in window.subviews) {
        NSString *viewName = NSStringFromClass(view.class);
        if (![viewName isEqualToString:@"UIInputSetContainerView"]) {
            continue;
        }
        for (UIView *subView in view.subviews) {
            NSString *subViewName = NSStringFromClass(subView.class);
            if (![subViewName isEqualToString:@"UIInputSetHostView"]) {
                continue;
            }
            return subView;
        }
    }
    
    return nil;
}






-(UIView*) findInputSetHostView {
    if([[[UIDevice currentDevice] systemVersion] floatValue] >= 9.0) {
        for(UIWindow* window in [[UIApplication sharedApplication] windows])
            if([window isKindOfClass:NSClassFromString(@"UIRemoteKeyboardWindow")])
                for(UIView* subView in window.subviews)
                    if([subView isKindOfClass:NSClassFromString(@"UIInputSetHostView")])
                        for(UIView* subsubView in subView.subviews)
                            if([subsubView isKindOfClass:NSClassFromString(@"UIInputSetHostView")])
                                return subsubView;
    } else
        return self.keyboardActiveInput.inputAccessoryView.superview;
    return nil;
}



- (void)swizzled_addSubview:(UIView *)subview
{
    if (!subview.inputAccessoryView)
    {
        if ([subview isKindOfClass:[UITextField class]])
        {
            UITextField *textField = (UITextField *)subview;
            if ([textField respondsToSelector:@selector(setInputAccessoryView:)])
            {
                UIView *nullView = [[UIView alloc] initWithFrame:CGRectZero];
                nullView.backgroundColor = [UIColor clearColor];
                textField.inputAccessoryView = nullView;
            }
        }
        else if ([subview isKindOfClass:[UITextView class]]) {
            UITextView *textView = (UITextView *)subview;
            if ([textView respondsToSelector:@selector(setInputAccessoryView:)] && [textView respondsToSelector:@selector(isEditable)] && textView.isEditable)
            {
                UIView *nullView = [[UIView alloc] initWithFrame:CGRectZero];
                nullView.backgroundColor = [UIColor clearColor];
                textView.inputAccessoryView = nullView;
            }
        }
    }
    [self swizzled_addSubview:subview];
}

#pragma mark - Property Methods

-(CGRect)previousKeyboardRect {
    id previousRectValue = objc_getAssociatedObject(self, &UIViewPreviousKeyboardRect);
    if (previousRectValue)
        return [previousRectValue CGRectValue];
    
    return CGRectZero;
}

-(void)setPreviousKeyboardRect:(CGRect)previousKeyboardRect {
    [self willChangeValueForKey:@"previousKeyboardRect"];
    objc_setAssociatedObject(self,
                             &UIViewPreviousKeyboardRect,
                             [NSValue valueWithCGRect:previousKeyboardRect],
                             OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    [self didChangeValueForKey:@"previousKeyboardRect"];
}

- (DAKeyboardDidMoveBlock)frameBasedKeyboardDidMoveBlock
{
    return objc_getAssociatedObject(self,
                                    &UIViewKeyboardDidMoveFrameBasedBlock);
}

- (void)setFrameBasedKeyboardDidMoveBlock:(DAKeyboardDidMoveBlock)frameBasedKeyboardDidMoveBlock
{
    [self willChangeValueForKey:@"frameBasedKeyboardDidMoveBlock"];
    objc_setAssociatedObject(self,
                             &UIViewKeyboardDidMoveFrameBasedBlock,
                             frameBasedKeyboardDidMoveBlock,
                             OBJC_ASSOCIATION_COPY);
    [self didChangeValueForKey:@"frameBasedKeyboardDidMoveBlock"];
}

- (DAKeyboardDidMoveBlock)constraintBasedKeyboardDidMoveBlock
{
    return objc_getAssociatedObject(self,
                                    &UIViewKeyboardDidMoveConstraintBasedBlock);
}

- (void)setConstraintBasedKeyboardDidMoveBlock:(DAKeyboardDidMoveBlock)constraintBasedKeyboardDidMoveBlock
{
    [self willChangeValueForKey:@"constraintBasedKeyboardDidMoveBlock"];
    objc_setAssociatedObject(self,
                             &UIViewKeyboardDidMoveConstraintBasedBlock,
                             constraintBasedKeyboardDidMoveBlock,
                             OBJC_ASSOCIATION_COPY);
    [self didChangeValueForKey:@"constraintBasedKeyboardDidMoveBlock"];
}

- (CGFloat)keyboardTriggerOffset
{
    NSNumber *keyboardTriggerOffsetNumber = objc_getAssociatedObject(self,
                                                                     &UIViewKeyboardTriggerOffset);
    return [keyboardTriggerOffsetNumber floatValue];
}

- (void)setKeyboardTriggerOffset:(CGFloat)keyboardTriggerOffset
{
    [self willChangeValueForKey:@"keyboardTriggerOffset"];
    objc_setAssociatedObject(self,
                             &UIViewKeyboardTriggerOffset,
                             [NSNumber numberWithFloat:keyboardTriggerOffset],
                             OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    [self didChangeValueForKey:@"keyboardTriggerOffset"];
}

- (BOOL)isPanning
{
    NSNumber *isPanningNumber = objc_getAssociatedObject(self,
                                                         &UIViewIsPanning);
    return [isPanningNumber boolValue];
}

- (void)setPanning:(BOOL)panning
{
    [self willChangeValueForKey:@"panning"];
    objc_setAssociatedObject(self,
                             &UIViewIsPanning,
                             @(panning),
                             OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    [self didChangeValueForKey:@"panning"];
}

- (UIResponder *)keyboardActiveInput
{
    return objc_getAssociatedObject(self,
                                    &UIViewKeyboardActiveInput);
}

- (void)setKeyboardActiveInput:(UIResponder *)keyboardActiveInput
{
    [self willChangeValueForKey:@"keyboardActiveInput"];
    objc_setAssociatedObject(self,
                             &UIViewKeyboardActiveInput,
                             keyboardActiveInput,
                             OBJC_ASSOCIATION_RETAIN);
    [self didChangeValueForKey:@"keyboardActiveInput"];
}

- (UIView *)keyboardActiveView
{
    return objc_getAssociatedObject(self,
                                    &UIViewKeyboardActiveView);
}

- (void)setKeyboardActiveView:(UIView *)keyboardActiveView
{
    [self willChangeValueForKey:@"keyboardActiveView"];
    [self.keyboardActiveView removeObserver:self
                                 forKeyPath:@"frame"];
    if (keyboardActiveView)
    {
        [keyboardActiveView addObserver:self
                             forKeyPath:@"frame"
                                options:0
                                context:NULL];
    }
    objc_setAssociatedObject(self,
                             &UIViewKeyboardActiveView,
                             keyboardActiveView,
                             OBJC_ASSOCIATION_RETAIN);
    [self didChangeValueForKey:@"keyboardActiveView"];
}

- (UIPanGestureRecognizer *)keyboardPanRecognizer
{
    return objc_getAssociatedObject(self,
                                    &UIViewKeyboardPanRecognizer);
}

- (void)setkeyboardPanRecognizer:(UIPanGestureRecognizer *)keyboardPanRecognizer
{
    [self willChangeValueForKey:@"keyboardPanRecognizer"];
    objc_setAssociatedObject(self,
                             &UIViewKeyboardPanRecognizer,
                             keyboardPanRecognizer,
                             OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    [self didChangeValueForKey:@"keyboardPanRecognizer"];
}

- (BOOL)isKeyboardOpened
{
    return [objc_getAssociatedObject(self,
                                     &UIViewKeyboardOpened) boolValue];
}

- (void)setKeyboardOpened:(BOOL)keyboardOpened
{
    [self willChangeValueForKey:@"keyboardOpened"];
    objc_setAssociatedObject(self,
                             &UIViewKeyboardOpened,
                             @(keyboardOpened),
                             OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    [self didChangeValueForKey:@"keyboardOpened"];
}

- (BOOL)keyboardWillRecede
{
    CGFloat keyboardViewHeight = self.keyboardActiveView.bounds.size.height;
    CGFloat keyboardWindowHeight = self.keyboardActiveView.superview.bounds.size.height;
    CGPoint touchLocationInKeyboardWindow = [self.keyboardPanRecognizer locationInView:self.keyboardActiveView.superview];
    
    CGFloat thresholdHeight = keyboardWindowHeight - keyboardViewHeight - self.keyboardTriggerOffset + 44.0f;
    CGPoint velocity = [self.keyboardPanRecognizer velocityInView:self.keyboardActiveView];
    
    return touchLocationInKeyboardWindow.y >= thresholdHeight && velocity.y >= 0;
}

@end
