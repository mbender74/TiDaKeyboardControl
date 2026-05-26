/**
 * Copyright (c) 2014 SMC Treviso s.r.l. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 *
 * Appcelerator Titanium is Copyright (c) 2009-2010 by Appcelerator, Inc.
 * and licensed under the Apache Public License (version 2)
 */
#define USE_TI_UISCROLLVIEW // Enable access to the core class
#define USE_TI_UITABLEVIEW // Enable access to the core class
#define USE_TI_UILISTVIEW
#define USE_TI_UITAB

#if TARGET_OS_MACCATALYST
#import <AppKit/AppKit.h>
#endif

#import "TiKeyboardControlViewProxy.h"
#import "TiKeyboardControlViewProxy+Metrics.h"
#import "DeMarcbenderKeyboardcontrolModule.h"
#import "TiUITabGroupProxy.h"
#import "TiUITabGroup.h"

//#import "DAKeyboardControl.h"
#import "TiBase.h"
#import "TiHost.h"
#import "TiComplexValue.h"
#import "TiUIView.h"
#import "TiAnimation.h"
#import "TiUIScrollView.h"
#import "TiUITableView.h"
#import "TiUIListViewProxy.h"
#import "TiUIListView.h"
#import <TitaniumKit/TiUtils.h>
#import <TitaniumKit/TiViewTemplate.h>
#import <TitaniumKit/TiAnimation.h>
#import <TiUtils.h>
#import <objc/runtime.h>


static inline UIViewAnimationOptions AnimationOptionsForCurve(UIViewAnimationCurve curve)
{
    return curve << 16;
}


@implementation TiKeyboardControlScrollDelegateProxy

- (void)scrollViewDidScroll:(UIScrollView *)scrollView {
    if ([self.originalDelegate respondsToSelector:@selector(scrollViewDidScroll:)]) {
        [self.originalDelegate scrollViewDidScroll:scrollView];
    }
    [self.keyboardControlProxy handleScrollViewDidScroll:scrollView];
}

- (void)scrollViewWillBeginDragging:(UIScrollView *)scrollView {
    if ([self.originalDelegate respondsToSelector:@selector(scrollViewWillBeginDragging:)]) {
        [self.originalDelegate scrollViewWillBeginDragging:scrollView];
    }
    [self.keyboardControlProxy handleScrollViewWillBeginDragging:scrollView];
}

- (void)scrollViewDidEndDragging:(UIScrollView *)scrollView willDecelerate:(BOOL)decelerate {
    if ([self.originalDelegate respondsToSelector:@selector(scrollViewDidEndDragging:willDecelerate:)]) {
        [self.originalDelegate scrollViewDidEndDragging:scrollView willDecelerate:decelerate];
    }
    [self.keyboardControlProxy handleScrollViewDidEndDragging:scrollView willDecelerate:decelerate];
}

- (BOOL)respondsToSelector:(SEL)aSelector {
    return [super respondsToSelector:aSelector] || [self.originalDelegate respondsToSelector:aSelector];
}

- (id)forwardingTargetForSelector:(SEL)aSelector {
    if ([self.originalDelegate respondsToSelector:aSelector]) {
        return self.originalDelegate;
    }
    return [super forwardingTargetForSelector:aSelector];
}

@end


@implementation TiKeyboardControlViewProxy


- (id)init
{
    if (self = [super init]) {
        keyboardVisibleInit = false;
        tinavcontroller = false;
        initalScrollingViewHeight = -1;
        autoAdjustBottomPadding = false;
        autoScrollToBottom = false;
        autoScrollToBottomDone = false;
        extendSafeArea = false;
        ignoreExtendSafeArea = false;
        showKeyboardOnScrollUp = false;
        showKeyboardOnScrollUpTriggered = false;
        isDraggingScroll = false;
        scrollDelegateProxy = nil;
        self.manualPanning = false;
        stop = false;
        animationCurve = 7; // Default: UIViewAnimationCurveEaseInOut
        isSwiping = NO;
        toolbarInputViewDiff = 0;
        isNavigationWindowBottomDiff = 0;
        altAddPixel = 0;
        addPixel = 0;
        altAddPixelSet = false;
        addPixelSet = false;
        autoSizeAndKeepScrollingViewAboveToolbar = false;
        cachedKeyWindow = nil;
        cachedStatusBarHeight = 0.0;
        cachedNavigationBarHeight = 0.0;
    }

    return self;
}

- (id)_initWithPageContext:(id<TiEvaluator>)context
{
    viewcontext = context;
    return [super _initWithPageContext:context];
}

- (id)_initWithPageContext:(id<TiEvaluator>)context_ args:(NSArray *)args
{
    keyboardControlView = [[TiKeyboardControlView alloc] init];
    [keyboardControlView initializeState];
    viewcontext = context_;
    return [super _initWithPageContext:context_ args:args];
}

- (void)_configure
{
    [super _configure];
}

-(void)_initWithProperties:(NSDictionary *)properties
{
    [super _initWithProperties:properties];
}

- (void)_destroy
{
  [super _destroy];
}

- (void)dealloc
{

}


- (void)viewDidAttach
{
    [super viewDidAttach];
}

- (void)windowDidOpen
{
    [super windowDidOpen];
    [self initPanning];
}

- (void)windowDidClose
{
    [super windowDidClose];
    [self teardownKeyboardPanning];
}




- (void)initPanning
{
        if ([self viewAttached]) {
            if (keyboardPanningOn)
            {
                [self setupKeyboardPanning];
            }
            else {
                [self teardownKeyboardPanning];
            }
        }
        else {
            [self performSelector:@selector(initPanning) withObject:self afterDelay:0.16f];
        }
}




- (BOOL)findTiNavigationWindow:(UIView *)object {

    NSArray *subviews = [object subviews];

    for (UIView *subview in subviews) {
        if ([NSStringFromClass([subview class]) isEqual: @"TiUINavigationWindowInternal"]){
            ////////NSLog ( @" subview: %@", NSStringFromClass([subview class]) );

            return true;
        }
        else {
            return [self findTiNavigationWindow:subview];
        }
    }
}




- (id)listSubviewsOfView:(UIView *)view {
    NSArray *subviews = [view subviews];

    for (UIView *subview in subviews) {
        if ([subview isKindOfClass:[UITextView class]]){
            UITextView *tv = (UITextView*)subview;
            //             NSLog(@"[TiDAKBC] findTextView | FOUND UITextView: frame={{%f,%f},{%f,%f}}, text=%@, inputAccessory=%@",
            //                   tv.frame.origin.x, tv.frame.origin.y, tv.frame.size.width, tv.frame.size.height,
            //                   tv.text, tv.inputAccessoryView);
            return tv;
        }
        else if ([subview isKindOfClass:[UITextField class]]){
            UITextField *tf = (UITextField*)subview;
            //             NSLog(@"[TiDAKBC] findTextView | FOUND UITextField: frame={{%f,%f},{%f,%f}}, text=%@, inputAccessory=%@",
            //                   tf.frame.origin.x, tf.frame.origin.y, tf.frame.size.width, tf.frame.size.height,
            //                   tf.text, tf.inputAccessoryView);
            return tf;
        }
        else {
            [self listSubviewsOfView:subview];
        }
    }
    //     NSLog(@"[TiDAKBC] findTextView | NO text field found in subviews of %@", view);
    return nil;
}



-(BOOL) findNavigationWindow:(UIView *)object {

    if (object != nil) {
        return [self findTiNavigationWindow:object];
    }
    else {
        return false;
    }
}




-(id) findTextView {
    TiViewProxy * toolbarViewProxy = _textfield;

    if (toolbarViewProxy != nil) {
        UIView * proxyView = [toolbarViewProxy view];
        //         NSLog(@"[TiDAKBC] findTextView | searching in textfield proxy: view=%@, viewClass=%s",
        //               proxyView, NSStringFromClass([proxyView class]).UTF8String);
        id result = [self listSubviewsOfView:proxyView];
        if (result) {
            //             NSLog(@"[TiDAKBC] findTextView | search complete — textfield resolved to %@", NSStringFromClass([result class]));
        }
        return result;
    } else {
        //         NSLog(@"[TiDAKBC] findTextView | _textfield is nil, skipping");
        return nil;
    }
}

- (void)setupKeyboardPanning
{
    initialLastInputViewFrameHeight = 0;
    initialContentHeight = 0;
    correctingToolbarDiff = 0;
    lastInputAccessoryViewFrame = CGRectZero;
    lastShiftValue = 0;
    lastY = 0;
    insetBottomCorrection = 0;
    lastKeyboardHeight = 0;
    maxKeyBoardHeight = 0;
    minKeyBoardHeight = 0;
    tabgroupHeight = 0;
    inputView = nil;
    inputViewFrame = CGRectZero;
    manualKeyboardResize = false;
    panningSet = false;
    isUItableView = false;
    keyboardVisible = false;
    keyboardwillHide = false;
    keyboardInsetSettled = NO;
    initalToolbarViewFrame = CGRectZero;
    
    // iOS 13+ Multi-Scene: resolveKeyWindow statt self.view.window
    UIWindow *resolvedWindow = [self resolveKeyWindow];
    if (resolvedWindow) {
        windowRect = resolvedWindow.frame;
        cachedKeyWindow = resolvedWindow;
    } else {
        windowRect = self.view.window.frame;
    }
    windowHeight = windowRect.size.height;
    isTabGroup = false;
    isNavigationWindow = false;
    self.alreadyAnimating = false;
    self.manualPanning = false;
    // Safe Area aus dem resolved Key Window lesen (konsistent mit windowRect)
    UIWindow *safeWindow = cachedKeyWindow ? cachedKeyWindow : [UIApplication sharedApplication].windows.firstObject;
    if (@available(iOS 11.0, *)) {
        topPadding = safeWindow.safeAreaInsets.top;
        bottomPadding = safeWindow.safeAreaInsets.bottom;
    } else {
        topPadding = 0;
        bottomPadding = 0;
    }
    safeAreaValue = bottomPadding;

    // Status Bar und Navigation Bar Heights berechnen und cachen
    self->_cachedStatusBarHeight = [self getStatusBarHeight];
    self->_cachedNavigationBarHeight = [self calculateNavigationBarHeight];

    // Orientation Observer registrieren — bei Rotation werden alle Heights neu berechnet
    [self setupOrientationObserver];




    //////////NSLog ( @"++++ self.view:  %f  %f  ",self.view.frame.size.height,self.view.frame.origin.y);




    __weak TiKeyboardControlViewProxy *weakSelf = self;




    toolbarViewProxy = _toolbarView;
    toolbarview  = [toolbarViewProxy view];
    toolbarview.translatesAutoresizingMaskIntoConstraints = false;


    initialBottomValue = [TiUtils floatValue:[toolbarViewProxy valueForUndefinedKey:@"bottom"] def:0];

    initalToolbarViewFrame = toolbarview.frame;
    keyboardTriggerOffset = (initalToolbarViewFrame.size.height);

    
    [self add:_scrollingView];

    [self add:_toolbarView];

    TiViewProxy * proxy = _scrollingView;
    proxyView = [proxy view];
    
    initialKeyboardTriggerOffset = toolbarview.frame.size.height;

    
    //[toolbarview.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor].active = YES;
    // [toolbarview.topAnchor constraintEqualToAnchor:proxyView.bottomAnchor].active = YES;
   // [toolbarview.bottomAnchor constraintEqualToAnchor:self.view.bottomAnchor constant:0].active = YES;
    
    //_toolbarContainerVerticalSpacingConstraint =  [self.view.safeAreaLayoutGuide.topAnchor constraintEqualToAnchor:toolbarview.bottomAnchor];
   // _toolbarContainerVerticalSpacingConstraint.active = YES;
    
    ////////NSLog ( @" setupKeyboardPanning: %f", keyboardTriggerOffset );


    initialScrollingViewBottomValue = [TiUtils floatValue:[proxy valueForUndefinedKey:@"bottom"] def:0];
    ////////NSLog ( @" initialScrollingViewBottomValue: %f", initialScrollingViewBottomValue );



    id tabgroup = [_parentWindow performSelector:@selector(tabGroup)];

    if (tabgroup != nil){
        
        isTabGroup = true;

        BOOL foundNavCon = false;

        foundNavCon = [self findNavigationWindow:[[[[TiApp app] controller] topPresentedController] view]];
        
        if (foundNavCon == true){
            isNavigationWindow = true;
            
            
            //////NSLog ( @" isNavigationWindow ");

            
        }
        else {
            isNavigationWindow = false;
        }

        UITabBar * tabBar = [[[_parentWindow performSelector:@selector(tabGroup)] view] performSelector:@selector(tabbar)];
        

        // tabBarHidden prüfen — wenn Tab Bar versteckt, ist tabgroupHeight = 0
        BOOL tabBarHidden = tabBar && tabBar.isHidden;
        if (tabBarHidden) {
            tabgroupHeight = 0;
        }

        
        if (ignoreExtendSafeArea == true){
            safeAreaValue = 0;
            //tabgroupHeight = bottomPadding;
            if (!tabBarHidden) { tabgroupHeight = [self calculateTabBarHeight]; }
            //////NSLog ( @" tabBar.frame.size.height %f ",tabBar.frame.size.height);
            extendSafeArea = false;
        }
        else {
            safeAreaValue = 0;
            if (!tabBarHidden) { tabgroupHeight = [self calculateTabBarHeight]; }
            //////NSLog ( @" tabBar.frame.size.height %f ",tabBar.frame.size.height);
            extendSafeArea = false;
        }
        
        
        if (isNavigationWindow == true){
            tabgroupHeight = tabgroupHeight + bottomPadding;
        }
        else {
           // tabgroupHeight = bottomPadding;
        }
        
        
        /*
        
        if ([TiUtils boolValue:[_parentWindow valueForUndefinedKey:@"extendSafeArea"] def:NO] == YES){

            ////////NSLog ( @" STANDARD WINDOW extendSafeArea == true");

            if (ignoreExtendSafeArea == true){

                ////////NSLog ( @" STANDARD WINDOW ignoreExtendSafeArea == true");
                // initalToolbarViewFrame.size.height = initalToolbarViewFrame.size.height - bottomPadding;
                // keyboardTriggerOffset = initalToolbarViewFrame.size.height;
                //  initialKeyboardTriggerOffset = initalToolbarViewFrame.size.height;
                safeAreaValue = 0;
                tabgroupHeight = bottomPadding;
                //tabgroupHeight = ceil(initalToolbarViewFrame.size.height + bottomPadding);

                extendSafeArea = true;
            }
            else {
                ////////NSLog ( @" STANDARD WINDOW ignoreExtendSafeArea == false");
                //keyboardTriggerOffset = initalToolbarViewFrame.size.height;
                //initialKeyboardTriggerOffset = initalToolbarViewFrame.size.height;
                //initialKeyboardTriggerOffset = initialKeyboardTriggerOffset + bottomPadding;
                safeAreaValue = 0;
                if (!tabBarHidden) { tabgroupHeight = [self calculateTabBarHeight]; }
                
                //////NSLog ( @" tabBar.frame.size.height %f ",tabBar.frame.size.height);

                
                extendSafeArea = true;
            }
        }
        else {
            ////////NSLog ( @" STANDARD WINDOW extendSafeArea == false");
            //initalToolbarViewFrame.size.height = initalToolbarViewFrame.size.height - bottomPadding;
            //keyboardTriggerOffset = initalToolbarViewFrame.size.height;
            //initialKeyboardTriggerOffset = initalToolbarViewFrame.size.height;
            extendSafeArea = false;
            tabgroupHeight = (safeAreaValue);
        }
        */
        
        
        
    }
    else {
        ////////NSLog ( @" STANDARD WINDOW");

        if ([TiUtils boolValue:[_parentWindow valueForUndefinedKey:@"extendSafeArea"] def:NO] == YES){

            if (ignoreExtendSafeArea == true){
                safeAreaValue = 0;
                tabgroupHeight = bottomPadding;
                //tabgroupHeight = ceil(initalToolbarViewFrame.size.height + bottomPadding);

                extendSafeArea = true;
            }
            else {
                safeAreaValue = 0;
                tabgroupHeight = 0;
                extendSafeArea = true;
            }
        }
        else {
            if (ignoreExtendSafeArea == true){
                safeAreaValue = 0;
                extendSafeArea = false;
                tabgroupHeight = (safeAreaValue);
            }
            else {
                safeAreaValue = 0;
                extendSafeArea = false;
                tabgroupHeight = (safeAreaValue);
            }
        }
    }



    if ([proxyView isKindOfClass:[TiUIListView class]] || [proxyView isKindOfClass:[TiUITableView class]] || [NSStringFromClass([proxyView class])  isEqual: @"TiCollectionviewCollectionView"]) {

        UITableView *sv = nil;

        if ([proxyView isKindOfClass:[TiUITableView class]]){
            object_setClass(sv, [UITableView class]);
            isUItableView = true;

            tiTableView = (TiUITableView*)proxyView;


            sv = (UITableView *)[(TiUITableView*)proxyView tableView];

           table = (UITableView*)sv;
        }
        else if ([proxyView isKindOfClass:[TiUIListView class]]){
            object_setClass(sv, [UITableView class]);
            sv = [(TiUIListView*)proxyView tableView];
        }

        else if ([NSStringFromClass([proxyView class])  isEqual: @"TiCollectionviewCollectionView"]){
            if ([proxyView respondsToSelector:@selector(collectionView)]){
                object_setClass(sv, [UICollectionView class]);
                sv = [proxyView performSelector:@selector(collectionView)];
            }
        }

        if (panningSet == false){
            panningSet = true;
            [(UIScrollView *)sv setKeyboardDismissMode:UIScrollViewKeyboardDismissModeInteractive];
        }
        //initialContentHeight = sv.contentSize.height;
        nativeScrollView = sv;
        [self setupNotifications:(sv)];
    }
    else {
        UIScrollView *sv = nil;
        object_setClass(sv, [TiUIScrollViewImpl class]);
        sv = (UIScrollView *)[(TiUIScrollView*)proxyView scrollView];
        if (panningSet == false){
            panningSet = true;
            [(UIScrollView *)sv setKeyboardDismissMode:UIScrollViewKeyboardDismissModeInteractive];
        }

        //initialContentHeight = sv.contentSize.height;
        nativeScrollView = sv;
        [self setupNotifications:(sv)];
    }

    // Store initial content insets before any keyboard animation modifies them
    initialContentInset = nativeScrollView.contentInset;
    //     NSLog(@"[TiDAKBC] setupKeyboardPanning | initialContentInset={%.0f, %.0f, %.0f, %.0f}",
    //           initialContentInset.top, initialContentInset.left, initialContentInset.bottom, initialContentInset.right);

    // Install scroll delegate proxy for showKeyboardOnScrollUp if property is already set
    if (showKeyboardOnScrollUp) {
        [self installScrollDelegateProxy];
    }

    [toolbarview addObserver:self forKeyPath:@"bounds" options:0 context:NULL];

    [proxyView addObserver:self forKeyPath:@"bounds" options:0 context:NULL];

    [nativeScrollView addObserver:self forKeyPath:@"contentSize" options:0 context:NULL];

    
    if (autoSizeAndKeepScrollingViewAboveToolbar == true){
        autoAdjustBottomPadding = false;

        //[proxyView.bottomAnchor constraintEqualToAnchor:toolbarview.topAnchor].active = YES;

    }

}





- (void)setupNotifications:(id)object {

    UIScrollView *contentScrollView = (UIScrollView *)object;
    //     NSLog(@"[TiDAKBC] setupNotifications | START — scrollView=%@, class=%s, _textfield=%p, _toolbarView=%p",
    //           contentScrollView, NSStringFromClass([contentScrollView class]).UTF8String, _textfield, _toolbarView);

    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardDidHide:) name:UIKeyboardDidHideNotification object:nil];

    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardDidShow:) name:UIKeyboardDidShowNotification object:nil];


    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillHide:) name:UIKeyboardWillHideNotification object:nil];

    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillShow:) name:UIKeyboardWillShowNotification object:nil];

    inputView = [[BABFrameObservingInputAccessoryView alloc] initWithFrame:toolbarview.frame];


    inputViewFrame = inputView.frame;
    lastInputViewFrameHeight = inputViewFrame.size.height;
   inputView.userInteractionEnabled = NO;

    id enterview = [self findTextView];

    if ([enterview isKindOfClass:[UITextField class]]){
        textField = (UITextField *)enterview;
        textField.inputAccessoryView = inputView;
    }
    else if ([enterview isKindOfClass:[UITextView class]]){
        textview = (UITextView *)enterview;
        textview.inputAccessoryView = inputView;
    }

    // Store the initial accessory view frame.y for delta calculation during keyboard show/hide
    // At this point, keyboard is hidden — accessory view sits at bottom of screen
    CGRect ivf = inputView.frame;
    if (CGRectIsNull(ivf) || CGRectIsEmpty(ivf)) {
        ivf = toolbarview.superview.frame;
    }
    initialAccessoryViewFrameYWhenHidden = ivf.origin.y;
    //     NSLog(@"[TiDAKBC] setupNotifications | initialAccFrameY=%f, tvSupervH=%f",
    //           initialAccessoryViewFrameYWhenHidden, toolbarview.superview.frame.size.height);
    __weak TiKeyboardControlViewProxy *weakSelf = self;

    inputView.inputAcessoryViewFrameChangedBlock = ^(CGRect inputAccessoryViewFrame){

        __strong TiKeyboardControlViewProxy *strongSelf = weakSelf;
        if (!strongSelf) return;

        strongSelf->lastInputAccessoryViewFrame = inputAccessoryViewFrame;

        CGRect tvf = toolbarview.frame;
        //         NSLog(@"[TiDAKBC] KVO | frame.y=%f, h=%f | vis=%d, hide=%d, settled=%d, initAccIsNull=%d, mResize=%d",
        //               inputAccessoryViewFrame.origin.y, inputAccessoryViewFrame.size.height,
        //               strongSelf->keyboardVisible, strongSelf->keyboardwillHide, strongSelf->hasSettledShift,
        //               CGRectIsNull(strongSelf->initialAccessoryViewFrame), strongSelf->manualKeyboardResize);

       // Skip inset updates during keyboard animation — applyScrollViewInset was already
        // called with the correct value in keyboardWillShow. Updating from KVO during
        // animation causes bottomInset to drift downward (345 -> 182) as accessory frame.y
        // changes, hiding content behind the keyboard. Only update after settled baseline.
        if (strongSelf->keyboardVisible && strongSelf->hasSettledShift &&
            (CGRectIsNull(strongSelf->initialAccessoryViewFrame) || CGRectIsEmpty(strongSelf->initialAccessoryViewFrame))) {
            // Don't set keyboardInsetSettled=YES yet — iOS may still be animating the
            // accessory view position. If frame.y changes, this path won't run again
            // (initialAccessoryViewFrame is now set), so swipe deltas would be wrong.
            // Instead, wait until a KVO callback shows no change from previous -> that's true settle.
            strongSelf->initialAccessoryViewFrame = inputAccessoryViewFrame;
            strongSelf->lastAccessoryViewHeight = inputAccessoryViewFrame.size.height;
            strongSelf->cachedSwipeTransform = CGAffineTransformIdentity;

            CGFloat value = CGRectGetHeight(strongSelf->view.frame) - CGRectGetMinY(inputAccessoryViewFrame);
            CGFloat trans = [strongSelf computeToolbarTranslation:inputAccessoryViewFrame];
            // Use current frame translation (not stale lastShiftValue from keyboardDidShow)
            // so toolbar resizes between keyboardDidShow and first KVO don't get clobbered.
            strongSelf->settledShift = trans;
            //             NSLog(@"[TiDAKBC] KVO SETTLE BASELINE | FIRST post-keyboardShow — accFrame={{%f,%f},{%f,%f}}, settledShift=%f, viewH=%f, value=%f",
            //                   inputAccessoryViewFrame.origin.x, inputAccessoryViewFrame.origin.y,
            //                   inputAccessoryViewFrame.size.width, inputAccessoryViewFrame.size.height,
            //                   strongSelf->settledShift, strongSelf->view.frame.size.height, value);
            //             NSLog(@"[TiDAKBC] KVO SETTLE BASELINE | translation=%f, keyboardTransitionDuration=%f, curve=%ld",
            //                   trans, strongSelf->keyboardTransitionDuration, (long)strongSelf->animationCurve);

            // When keyboard is already visible (keyboard switch / toolbar resize),
            // keyboardWillShow fires with duration=0 for instant transition. But this
            // KVO callback runs first with the stale duration from the previous show.
            // Use duration=0 when keyboardVisible to avoid unwanted animation.
            NSTimeInterval settleDuration = strongSelf->keyboardVisible ? 0 : strongSelf->keyboardTransitionDuration;
            [strongSelf applyToolbarTranslation:trans
                                    animated:(settleDuration > 0) duration:settleDuration
                                       curve:strongSelf->animationCurve];
            // Apply inset once here — this is the only chance before animation drift starts
            [strongSelf applyScrollViewInset:inputAccessoryViewFrame];
            [strongSelf applyAutoSizeBottomConstraintWithTranslation:trans];

            //             NSLog(@"[TiDAKBC] KVO SETTLE BASELINE | DONE — contentInset.bottom=%.0f", strongSelf->nativeScrollView.contentInset.bottom);

            if (!strongSelf->autoScrollToBottomDoneAfterShow && strongSelf->autoScrollToBottom) {
                strongSelf->autoScrollToBottomDoneAfterShow = YES;
                if (strongSelf->keyboardVisible) {
                    // Toolbar resize while keyboard is already visible — keyboardWillShow
                    // skips autoScrollToBottom (!keyboardVisible guard), so handle it here.
                    //                     NSLog(@"[TiDAKBC] KVO SETTLE BASELINE | autoScrollToBottom (toolbar resize, keyboard already visible)");
                    [strongSelf scrollToBottomIfNeeded];
                } else {
                    //                     NSLog(@"[TiDAKBC] KVO SETTLE BASELINE | autoScrollToBottom handled in keyboardWillShow");
                }
            }

            // Don't return — let next KVO callback verify this is truly settled.
            // Fall through to swipe path for further processing.
        }

       // Keyboard hide: CALayer tracks position — MUST be FIRST when hasSettledShift=YES
        if (strongSelf->keyboardwillHide) {
            CGFloat trans = [strongSelf computeToolbarTranslation:inputAccessoryViewFrame];
            //             NSLog(@"[TiDAKBC] KVO HIDE | tv={{%f,%f},{%f,%f}}, translation=%f, inset before=%.0f",
            //                   tvf.origin.x, tvf.origin.y, tvf.size.width, tvf.size.height,
            //                   trans, strongSelf->nativeScrollView.contentInset.bottom);

            [strongSelf applyToolbarTranslation:trans
                                    animated:YES duration:strongSelf->keyboardTransitionDuration
                                       curve:strongSelf->animationCurve];
            [strongSelf applyScrollViewInset:inputAccessoryViewFrame];
            [strongSelf applyAutoSizeBottomConstraintWithTranslation:trans];
            return;
        }

       // Active swipe, true-settle detection, or keyboard hide: direct CALayer for 120Hz smoothness
        if (strongSelf->keyboardVisible && strongSelf->hasSettledShift) {

            // True-settle detection: if keyboardInsetSettled is still NO (iOS still animating),
            // check if frame.y matches baseline. If so, iOS has finished → activate inset updates.
            if (!strongSelf->keyboardInsetSettled && !CGRectIsNull(strongSelf->initialAccessoryViewFrame)) {
                CGFloat settleDeltaY = inputAccessoryViewFrame.origin.y - strongSelf->initialAccessoryViewFrame.origin.y;
                //                 NSLog(@"[TiDAKBC] KVO TRUE-SETTLE CHECK | deltaY=%.2f (accY=%f - initAccY=%f)",
                //                       settleDeltaY, inputAccessoryViewFrame.origin.y, strongSelf->initialAccessoryViewFrame.origin.y);

                if (fabs(settleDeltaY) < 0.5) {
                    //                     NSLog(@"[TiDAKBC] KVO TRUE-SETTLED | frame stable — activating inset updates");
                    strongSelf->keyboardInsetSettled = YES;
                    CGFloat settleTrans = [strongSelf computeToolbarTranslation:inputAccessoryViewFrame];
                    strongSelf->settledShift = settleTrans;
                    //                     NSLog(@"[TiDAKBC] KVO TRUE-SETTLED | settledShift=%f (from actual translation)", settleTrans);

                    // Re-apply insets with confirmed settled position
                    [strongSelf applyScrollViewInset:inputAccessoryViewFrame];
                    [strongSelf applyAutoSizeBottomConstraintWithTranslation:settleTrans];
                    //                     NSLog(@"[TiDAKBC] KVO TRUE-SETTLED | inset=%.0f, settledShift=%f",
                    //                           strongSelf->nativeScrollView.contentInset.bottom, strongSelf->settledShift);
                } else {
                    //                     NSLog(@"[TiDAKBC] KVO NOT YET SETTLED | deltaY=%.2d (still animating)", settleDeltaY);
                }
            }

            CGFloat deltaY = inputAccessoryViewFrame.origin.y - strongSelf->initialAccessoryViewFrame.origin.y;

            //             NSLog(@"[TiDAKBC] KVO SWIPE | deltaY=%f (accY=%f - initAccY=%f), cachedSwipeTransform=(%g,%g), manualResize=%d",
            //                   deltaY, inputAccessoryViewFrame.origin.y, strongSelf->initialAccessoryViewFrame.origin.y,
            //                   strongSelf->cachedSwipeTransform.ty, strongSelf->manualKeyboardResize);

                  // Toolbar resize: iOS moved accessory view due to toolbar height change.
            // Reset all swipe state so future KVO deltas are computed from the new baseline.
            if (strongSelf->manualKeyboardResize && fabs(deltaY) >= 0.5) {
                //                 NSLog(@"[TiDAKBC] KVO TOOLBAR RESIZE DETECTED | deltaY=%f, oldBaseline={{%f,%f},{%f,%f}}, newFrame={{%f,%f},{%f,%f}}",
                //                       deltaY,
                //                       strongSelf->initialAccessoryViewFrame.origin.x, strongSelf->initialAccessoryViewFrame.origin.y,
                //                       strongSelf->initialAccessoryViewFrame.size.width, strongSelf->initialAccessoryViewFrame.size.height,
                //                       inputAccessoryViewFrame.origin.x, inputAccessoryViewFrame.origin.y,
                //                       inputAccessoryViewFrame.size.width, inputAccessoryViewFrame.size.height);

                // Update swipe baseline to the NEW position (where iOS actually moved the accessory view)
                strongSelf->initialAccessoryViewFrame = inputAccessoryViewFrame;

                CGFloat trans = [strongSelf computeToolbarTranslation:inputAccessoryViewFrame];
                strongSelf->settledShift = trans; // sync with actual toolbar translation
                //                 NSLog(@"[TiDAKBC] KVO TOOLBAR RESIZE | newBaseline.y=%f, translation=%f, settledShift=%f",
                //                       inputAccessoryViewFrame.origin.y, trans, strongSelf->settledShift);

                // Apply translation directly to CALayer (TiUIView doesn't handle UIView.transform correctly).
                [CATransaction begin];
                [CATransaction setDisableActions:YES];
                strongSelf->toolbarview.layer.affineTransform = CGAffineTransformMakeTranslation(0, -trans);
                strongSelf->cachedSwipeTransform = CGAffineTransformIdentity;
                [CATransaction commit];

                // NO keyboardInsetSettled=YES here — wait for true-settle or normal settled path to set it
                //                 NSLog(@"[TiDAKBC] KVO TOOLBAR RESIZE | SKIPPED inset (waiting for true-settle), bottom=%.0f", strongSelf->nativeScrollView.contentInset.bottom);
                [strongSelf applyAutoSizeBottomConstraintWithTranslation:trans];

                // Auto-scroll to bottom on toolbar resize
                if (strongSelf->autoScrollToBottom) {
                    [strongSelf scrollToBottomIfNeeded];
                }

            // Normal swipe during settled keyboard — CALayer for 120Hz smoothness
            } else if (!strongSelf->manualKeyboardResize && fabs(deltaY) >= 0.5) {
                CGFloat newTy = -(strongSelf->settledShift) + deltaY;
                if (newTy > 0) newTy = 0;
                CGAffineTransform newTransform = CGAffineTransformMakeTranslation(0, newTy);

                //                 NSLog(@"[TiDAKBC] KVO SWIPE STEP | settledShift=%f, deltaY=%f -> newTy=%f",
                //                       strongSelf->settledShift, deltaY, newTy);

                if (!CGAffineTransformEqualToTransform(newTransform, strongSelf->cachedSwipeTransform)) {
                    CGFloat oldTy = strongSelf->cachedSwipeTransform.ty;
                    //                     NSLog(@"[TiDAKBC] KVO SWIPE APPLY | CALayer transform: ty %f -> %f (NO inset change during swipe)", oldTy, newTy);
                    strongSelf->cachedSwipeTransform = newTransform;
                    [CATransaction begin];
                    [CATransaction setDisableActions:YES];
                    strongSelf->toolbarview.layer.affineTransform = newTransform;
                    [CATransaction commit];

                    // Update autoSize bottom constraint to follow swipe (without animation)
                    [UIView performWithoutAnimation:^{
                        [strongSelf applyAutoSizeBottomConstraintWithTranslation:strongSelf->settledShift - deltaY];
                    }];
                } else {
                    //                     NSLog(@"[TiDAKBC] KVO SWIPE STEP | SKIP transform unchanged (ty=%f)", newTy);
                }
            } else if (fabs(deltaY) < 0.5 && !CGAffineTransformEqualToTransform(strongSelf->cachedSwipeTransform, CGAffineTransformIdentity)) {
                // Spring settled: keep CALayer as rendering surface (TiUIView doesn't handle
                // UIView.transform correctly). Apply translation directly to CALayer,
                // update baseline, reset cached swipe state.
                //                 NSLog(@"[TiDAKBC] KVO SWIPE SPRING SETTLED | deltaY=%f -> keeping CALayer as rendering surface", deltaY);

                CGFloat trans = [strongSelf computeToolbarTranslation:inputAccessoryViewFrame];
                strongSelf->settledShift = trans;
                strongSelf->initialAccessoryViewFrame = inputAccessoryViewFrame;
                //                 NSLog(@"[TiDAKBC] KVO SWIPE SPRING SETTLED | translation=%f, settledShift=%f, newBaseline.y=%f", trans, trans, inputAccessoryViewFrame.origin.y);

                [CATransaction begin];
                [CATransaction setDisableActions:YES];
                strongSelf->toolbarview.layer.affineTransform = CGAffineTransformMakeTranslation(0, -trans);
                strongSelf->cachedSwipeTransform = CGAffineTransformIdentity;
                [CATransaction commit];
                [strongSelf applyAutoSizeBottomConstraintWithTranslation:trans];
                strongSelf->springSettledJustHappened = YES;
            } else if (fabs(deltaY) < 0.5 && CGAffineTransformEqualToTransform(strongSelf->cachedSwipeTransform, CGAffineTransformIdentity)) {
                // Settled state with CALayer already identity — UIView handles toolbar, NO inset change
                //                 NSLog(@"[TiDAKBC] KVO SWIPE SETTLED-IDENTITY | deltaY=%f (no inset during swipe)", deltaY);
            }

  // Normal settled state (no swipe): UIView animation with keyboard
        } else if (strongSelf->keyboardVisible) {
            CGFloat trans = [strongSelf computeToolbarTranslation:inputAccessoryViewFrame];
            //             NSLog(@"[TiDAKBC] KVO SETTLED | tv={{%f,%f},{%f,%f}}, translation=%f, insetSettled=%d, lastShift=%f",
            //                   tvf.origin.x, tvf.origin.y, tvf.size.width, tvf.size.height,
            //                   trans, strongSelf->keyboardInsetSettled, strongSelf->lastShiftValue);

            [strongSelf applyToolbarTranslation:trans
                                    animated:YES duration:strongSelf->keyboardTransitionDuration
                                       curve:strongSelf->animationCurve];
            // Skip inset updates until first KVO callback has settled (prevents animation drift)
            if (strongSelf->keyboardInsetSettled) {
                //                 NSLog(@"[TiDAKBC] KVO SETTLED | applying inset, bottom before=%.0f", strongSelf->nativeScrollView.contentInset.bottom);
                [strongSelf applyScrollViewInset:inputAccessoryViewFrame];
                [strongSelf applyAutoSizeBottomConstraintWithTranslation:trans];

                } else {
                //                 NSLog(@"[TiDAKBC] KVO SETTLED | SKIPPED inset (insetSettled=%d — waiting for first callback post-show)", strongSelf->keyboardInsetSettled);
            }

        // First show (before keyboardVisible set): skip positioning — toolbar stays at default
        } else if (!strongSelf->keyboardVisible) {
            //             NSLog(@"[TiDAKBC] KVO SKIP | !keyboardVisible, frame.y=%f", inputAccessoryViewFrame.origin.y);
            return;

        // Fallback (shouldn't happen): skip
        } else {
            //             NSLog(@"[TiDAKBC] KVO FALLBACK | frame.y=%f, vis=%d", inputAccessoryViewFrame.origin.y, strongSelf->keyboardVisible);
        }

    };



    if ((isNavigationWindow == false && isTabGroup == false) && autoScrollToBottomDone == false && (autoScrollToBottom == true || autoScrollToBottom == false)){

        autoScrollToBottomDone = true;
        //         NSLog(@"[TiDAKBC] INIT autoScrollToBottom | isNav=%d, isTab=%d, autoScrollToBottom=%d, autoScrollToBottomDone=%d",
        //               isNavigationWindow, isTabGroup, autoScrollToBottom, autoScrollToBottomDone);
        //         NSLog(@"[TiDAKBC] INIT autoScrollToBottom | scrollView=%p, contentSize={%f,%f}, boundsSize={%f,%f}, contentOffset.y=%f, contentInset.bottom=%f",
        //               contentScrollView, contentScrollView.contentSize.width, contentScrollView.contentSize.height,
        //               contentScrollView.frame.size.width, contentScrollView.frame.size.height,
        //               contentScrollView.contentOffset.y, contentScrollView.contentInset.bottom);

        CGFloat toolbarDiff = (toolbarResizeDiff + bottomPadding);

        
        
       
        if(extendSafeArea == true){

            CGFloat value = 0;
            if (ignoreExtendSafeArea == false){
                value = safeAreaValue;
            }

            CGAffineTransform transform = CGAffineTransformMakeTranslation(0.0f, -(value));

            //             NSLog(@"[TiDAKBC] extendSafeArea INIT transform: value=%f, safeAreaValue=%f, ignoreExtendSafeArea=%d, bottomPadding=%f",
            //                   value, safeAreaValue, ignoreExtendSafeArea, bottomPadding);

            toolbarview.transform = transform;

        }
        
        if (self->autoAdjustBottomPadding == true && self->autoSizeAndKeepScrollingViewAboveToolbar == false){

            CGFloat svBottomInsets = contentScrollView.contentInset.bottom + toolbarview.frame.size.height;

            if (self->extendSafeArea == true && self->ignoreExtendSafeArea == true){
                svBottomInsets = svBottomInsets - toolbarDiff;
                
                NSLog ( @"+++++++++++++++++++++++++++++ svBottomInsets A %f ",svBottomInsets);

            }
            else if (self->extendSafeArea == true && self->ignoreExtendSafeArea == false){
                svBottomInsets = svBottomInsets - bottomPadding;
//                svBottomInsets = svBottomInsets - toolbarDiff - (toolbarview.frame.size.height - bottomPadding);
                NSLog ( @"+++++++++++++++++++++++++++++ svBottomInsets B %f ",svBottomInsets);

            }

            
            
            [contentScrollView setContentInset:UIEdgeInsetsMake(contentScrollView.contentInset.top, contentScrollView.contentInset.left, svBottomInsets, contentScrollView.contentInset.right)];

            UIEdgeInsets indicatorInsets = contentScrollView.verticalScrollIndicatorInsets;

            indicatorInsets.bottom = svBottomInsets;

            contentScrollView.verticalScrollIndicatorInsets = indicatorInsets;
        }

        else if (self->autoSizeAndKeepScrollingViewAboveToolbar == true){
            
            CGFloat bottomHeight = 0;
            CGSize svContentSize = contentScrollView.contentSize;
            CGSize svBoundSize = contentScrollView.frame.size;
            CGFloat svBottomInsets = contentScrollView.contentInset.bottom;

            bottomHeight = self->toolbarview.frame.size.height + self->initialScrollingViewBottomValue;

            LayoutConstraint* layoutProperties = [(TiViewProxy *)self->_scrollingView layoutProperties];
            layoutProperties->bottom = TiDimensionDip(bottomHeight);
            [(TiViewProxy *)self->_scrollingView refreshView:nil];

            svContentSize = contentScrollView.contentSize;
            svBoundSize = contentScrollView.frame.size;
            svBottomInsets = contentScrollView.contentInset.bottom;
            
            bottomHeight = 0;

            bottomHeight = svContentSize.height - svBoundSize.height + svBottomInsets;
            
            
            NSLog ( @"+++++++++++++++++++++++++++++ bottomHeight %f ",bottomHeight);

        }
        
        
        /*
        if (self->autoScrollToBottom == true){
                [self runAfterDelay:0.01 block:^{

                    CGSize svContentSize = contentScrollView.contentSize;
                    CGSize svBoundSize = contentScrollView.frame.size;
                    CGFloat svBottomInsets = contentScrollView.contentInset.bottom;
                    
                    CGFloat bottomHeight = 0;

                    
                    if (self->autoSizeAndKeepScrollingViewAboveToolbar == true){
                        
                        
                        bottomHeight = self->toolbarview.frame.size.height + self->initialScrollingViewBottomValue;

                        LayoutConstraint* layoutProperties = [(TiViewProxy *)self->_scrollingView layoutProperties];
                        layoutProperties->bottom = TiDimensionDip(bottomHeight);
                        [(TiViewProxy *)self->_scrollingView refreshView:nil];

                        svContentSize = contentScrollView.contentSize;
                        svBoundSize = contentScrollView.frame.size;
                        svBottomInsets = contentScrollView.contentInset.bottom;
                        
                        bottomHeight = 0;

                        bottomHeight = svContentSize.height - svBoundSize.height + svBottomInsets;
                    }
                    else {
                        bottomHeight = svContentSize.height - svBoundSize.height + svBottomInsets + self->toolbarview.frame.size.height;
                    }
                    
                    CGFloat bottomWidth = svContentSize.width - svBoundSize.width;
                    
                    CGPoint newOffset = CGPointMake(bottomWidth, bottomHeight);

                    
                    
                        CGFloat yOffset = newOffset.y;
                        if (yOffset < 0){
                            yOffset = - yOffset;
                        }
                        newOffset.y = yOffset;
                        if (self->ignoreExtendSafeArea == true){
                            
                            newOffset.y = bottomHeight = svContentSize.height - svBoundSize.height + svBottomInsets;
                            
                        }
                        newOffset.y = bottomHeight = svContentSize.height - svBoundSize.height + svBottomInsets;

                        contentScrollView.contentOffset = newOffset;

                     }];

        }
        else {
            if (self->autoSizeAndKeepScrollingViewAboveToolbar == true){
                
                CGFloat bottomHeight = self->toolbarview.frame.size.height + self->initialScrollingViewBottomValue;
                
                LayoutConstraint* layoutProperties = [(TiViewProxy *)self->_scrollingView layoutProperties];
                layoutProperties->bottom = TiDimensionDip(bottomHeight);
                [(TiViewProxy *)self->_scrollingView refreshView:nil];
            }
        }
        */
    }
    
    else if ((isTabGroup == true) && autoScrollToBottomDone == false && (autoScrollToBottom == true || autoScrollToBottom == false)){
        autoScrollToBottomDone = true;
        //         NSLog(@"[TiDAKBC] INIT autoScrollToBottom (TABGROUP) | isTabGroup=%d, autoScrollToBottom=%d, autoScrollToBottomDone=%d",
        //               isTabGroup, autoScrollToBottom, autoScrollToBottomDone);
        
        CGFloat toolbarDiff = (toolbarResizeDiff + bottomPadding);
        
        if (self->autoAdjustBottomPadding == true && self->autoSizeAndKeepScrollingViewAboveToolbar == false){
            CGFloat svBottomInsets = contentScrollView.contentInset.bottom + toolbarview.frame.size.height;
            if (self->extendSafeArea == true && self->ignoreExtendSafeArea == true){
                    svBottomInsets = svBottomInsets - toolbarDiff;
            }
            [contentScrollView setContentInset:UIEdgeInsetsMake(contentScrollView.contentInset.top, contentScrollView.contentInset.left, svBottomInsets, contentScrollView.contentInset.right)];
            UIEdgeInsets indicatorInsets = contentScrollView.verticalScrollIndicatorInsets;
            indicatorInsets.bottom = svBottomInsets;
            contentScrollView.verticalScrollIndicatorInsets = indicatorInsets;
        }
        
        if (self->autoSizeAndKeepScrollingViewAboveToolbar == true && self->autoAdjustBottomPadding == false){
            CGFloat bottomHeight = toolbarview.frame.size.height + initialScrollingViewBottomValue;

            LayoutConstraint* layoutProperties = [(TiViewProxy *)_scrollingView layoutProperties];
            layoutProperties->bottom = TiDimensionDip(bottomHeight);
            [(TiViewProxy *)_scrollingView refreshView:nil];
        }
        
        /*
        if (self->autoScrollToBottom == true){
            [self runAfterDelay:0.01 block:^{
                CGSize svContentSize = contentScrollView.contentSize;
                CGSize svBoundSize = contentScrollView.frame.size;
                CGFloat svBottomInsets = contentScrollView.contentInset.bottom;
                CGFloat bottomHeight = svContentSize.height - svBoundSize.height + svBottomInsets;
                CGFloat bottomWidth = svContentSize.width - svBoundSize.width;
                CGPoint newOffset = CGPointMake(bottomWidth, bottomHeight);
                contentScrollView.contentOffset = newOffset;
            }];
        }
         */
        
    }
}



- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(__unused NSDictionary *)change
                       context:(__unused void *)context
{

   

    
    //     NSLog(@"[TiDAKBC] KVO ENTRY | keyPath=%@, objectClass=%s, keyboardVis=%d",
    //           keyPath ?: @"(null)",
    //           object ? NSStringFromClass([object class]).UTF8String : "(null)",
    //           keyboardVisible);




    if([keyPath isEqualToString:@"bounds"] && object == toolbarview) {
        CGRect toolbarviewFrame = [[object valueForKeyPath:keyPath] CGRectValue];
        CGFloat newHeight = toolbarviewFrame.size.height;

        //         NSLog(@"[TiDAKBC] KVO TOOLBAR BOUNDS | keyPath=%@, oldH=%.0f (initialLast=%f), newH=%.0f, lastInputAccH=%.0f, diff=%.2f",
        //               keyPath, initialLastInputViewFrameHeight, initialLastInputViewFrameHeight,
        //               newHeight, lastInputViewFrameHeight, newHeight - lastInputViewFrameHeight);

        if (initialLastInputViewFrameHeight == 0) {
            initialLastInputViewFrameHeight = newHeight;
            //             NSLog(@"[TiDAKBC] KVO TOOLBAR BOUNDS | init baseline: initialLastInputViewFrameH=%.0f", newHeight);
        }

        if (lastInputViewFrameHeight != newHeight) {
            [self handleToolbarBoundsChangeToHeight:newHeight];
        } else {
            //             NSLog(@"[TiDAKBC] KVO TOOLBAR BOUNDS | SKIPPED: no height change");
        }
    }


    else if([keyPath isEqualToString:@"bounds"] && object == proxyView) {


        if (initalScrollingViewHeight != proxyView.frame.size.height){

            if ((isNavigationWindow == true || isTabGroup == true) && autoScrollToBottomDone == false && autoScrollToBottom == true && initalScrollingViewHeight > 0){
            //             NSLog(@"[TiDAKBC] INIT autoScrollToBottom (NAV/TAB) | isNav=%d, isTab=%d, autoScrollToBottomDone=%d, autoScrollToBottom=%d, initalScrollingViewHeight=%f",
            //                   isNavigationWindow, isTabGroup, autoScrollToBottomDone, autoScrollToBottom, initalScrollingViewHeight);
            }
            initalScrollingViewHeight = proxyView.frame.size.height;
        }
    }
    
    
    else if([keyPath isEqualToString:@"contentSize"] && object == nativeScrollView) {
       // NSLog ( @" contentSize ");

        CGSize contentSize = [[object valueForKeyPath:keyPath] CGSizeValue];

        if (contentSize.height > initialContentHeight && contentHeightSet == false) {
            
           // NSLog ( @" contentSize.height  initialContentHeight  %f  %f ",contentSize.height,initialContentHeight);

            
            contentHeightSet = true;
            
            
           if (self->autoScrollToBottom == true){
                // During keyboard show, contentSize KVO fires synchronously inside
                // applyScrollViewInset — the table view is still laying out, so
                // contentOffset assignments get lost. Let the settle baseline path
                // handle it after the keyboard animation settles.
                if (!keyboardShowing) {
                    CGSize svContentSize = contentSize;
                    CGSize svBoundSize = self->nativeScrollView.frame.size;
                    CGFloat bottomHeight = svContentSize.height - svBoundSize.height + self->nativeScrollView.contentInset.bottom + self->nativeScrollView.safeAreaInsets.bottom;
                    CGFloat bottomWidth = svContentSize.width - svBoundSize.width;
                    CGPoint newOffset = CGPointMake(bottomWidth, bottomHeight);
                    CGFloat currentOffsetY = self->nativeScrollView.contentOffset.y;
                    if (fabs(currentOffsetY - bottomHeight) > 1.0) {
                        //                         NSLog(@"[TiDAKBC] contentSize change autoScrollToBottom | SETTING contentOffset.y from %f to %f (diff=%f)",
                        //                               currentOffsetY, bottomHeight, fabs(currentOffsetY - bottomHeight));
                        self->nativeScrollView.contentOffset = newOffset;
                    }
                } else {
                    //                     NSLog(@"[TiDAKBC] contentSize change autoScrollToBottom | SKIPPED (keyboard show, handled by settle baseline)");
                }
            }
            if (self->proxyView.layer.opacity < 1.0){
                dispatch_async(dispatch_get_main_queue(), ^{
                    [UIView animateWithDuration:0.2f delay:0.f options:(7 << 16)| UIViewAnimationOptionBeginFromCurrentState animations:^{
                        self->proxyView.layer.opacity = 1.0;
                    } completion:^(BOOL finished) {
                    }];
                });
            }

        }
        
    }
}


- (void)keyboardDidShow:(NSNotification *)notification
{
    if (![self isOwnFirstResponder]) {
        //         NSLog(@"[TiDAKBC] keyboardDidShow | SKIPPED — text field is not first responder");
        return;
    }
    keyboardVisible = true;
    keyboardwillHide = false;
    //     NSLog(@"[TiDAKBC] === keyboardDidShow ===");

   // Store settled shift value (NOT toolbarview.transform which may be stale)
    // IMPORTANT: Do NOT set initialAccessoryViewFrame here — let the first KVO callback do it
    // so we get a fresh baseline after keyboardDidShow and insets are properly applied.
    self->lastAccessoryViewHeight = self->lastInputAccessoryViewFrame.size.height;

   // Guard against overwriting settledShift during an active toolbar resize + iOS animation cycle:
    // If initialAcc is CGRectNull (fresh show) → always set it.
    // If it's already been touched by KVO TOOLBAR RESIZE DETECTED or settle baseline of a prior pass,
    // and we're mid-animation (keyboardTransitionDuration still active), skip — let the next cycle handle it.
    BOOL isFreshShow = CGRectIsNull(self->initialAccessoryViewFrame);

   // Only overwrite settledShift on fresh keyboard show OR if current value was 0 (from didHide reset)
    if (!isFreshShow && self->settledShift != 0) {
        //         NSLog(@"[TiDAKBC] keyboardDidShow | SKIPPED overwriting settledShift=%f during active cycle",
        //               self->settledShift);
    } else {
        self->settledShift = self->lastShiftValue;
    }

    self->hasSettledShift = YES;
    self->cachedSwipeTransform = CGAffineTransformIdentity;

    //     NSLog(@"[TiDAKBC] keyboardDidShow | settledShift=%f lastShiftValue=%f lastAccH=%.0f accFrame={{%f,%f},{%f,%f}} contentInset.bottom=%.0f keyboardInsetSettled=%d",
    //           self->settledShift, self->lastShiftValue, self->lastAccessoryViewHeight,
    //           self->lastInputAccessoryViewFrame.origin.x, self->lastInputAccessoryViewFrame.origin.y,
    //           self->lastInputAccessoryViewFrame.size.width, self->lastInputAccessoryViewFrame.size.height,
    //           nativeScrollView ? nativeScrollView.contentInset.bottom : -1, keyboardInsetSettled);

    // Note: autoScrollToBottom is now handled in the first KVO callback after insets are set,
    // so we don't need to scroll here with stale contentInset.bottom values.
    self->keyboardShowing = NO;
}

- (void)keyboardWillHide:(NSNotification *)notification
{
    if (![self isOwnFirstResponder]) {
        //         NSLog(@"[TiDAKBC] keyboardWillHide | SKIPPED — text field is not first responder");
        return;
    }
    keyboardwillHide = true;

    // ProMotion: Stop CALayer swipe updates (keyboardwillHide=YES blocks KVO swipe section)
    // DO NOT reset to Identity - toolbar would jump to bottom while keyboard bounces back

    CGRect keyboardEndFrameWindow;
    [[notification.userInfo valueForKey:UIKeyboardFrameEndUserInfoKey] getValue: &keyboardEndFrameWindow];

    self->animationCurve = [[notification.userInfo valueForKey:UIKeyboardAnimationCurveUserInfoKey] integerValue];
    [[notification.userInfo valueForKey:UIKeyboardAnimationDurationUserInfoKey] getValue:&keyboardTransitionDuration];

    //     NSLog(@"[TiDAKBC] === keyboardWillHide | curve=%ld, duration=%f, keyboardFrame={{%f,%f},{%f,%f}}, scrollView.bottom=%.0f, lastShiftValue=%f, toolbarH=%.0f, keyboardVis=%d ===",
    //           (long)self->animationCurve, keyboardTransitionDuration,
    //           keyboardEndFrameWindow.origin.x, keyboardEndFrameWindow.origin.y,
    //           keyboardEndFrameWindow.size.width, keyboardEndFrameWindow.size.height,
    //           nativeScrollView ? nativeScrollView.contentInset.bottom : -1, lastShiftValue,
    //           toolbarview.frame.size.height, keyboardVisible);

    [self fireEventForKeyboardFrameInView:keyboardEndFrameWindow visible:false];

}

- (void)keyboardDidHide:(NSNotification *)notification
{
    // Guard: keyboardDidHide fires for ALL proxy instances, but only the one
    // that was showing the keyboard (keyboardVisible=YES) should reset state.
    // By the time this fires, the text field has resigned first responder,
    // so we check keyboardVisible which was set to YES in keyboardDidShow.
    if (!keyboardVisible && !keyboardwillHide) {
        //         NSLog(@"[TiDAKBC] keyboardDidHide | SKIPPED — this proxy was not showing the keyboard");
        return;
    }

    keyboardVisible = false;
    keyboardwillHide = false;
    //     NSLog(@"[TiDAKBC] === keyboardDidHide | scrollView.bottom=%.0f, lastShiftValue=%f, toolbarH=%.0f, accFrame={{%f,%f},{%f,%f}} ===",
    //           nativeScrollView ? nativeScrollView.contentInset.bottom : -1, lastShiftValue,
    //           toolbarview.frame.size.height,
    //           lastInputAccessoryViewFrame.origin.x, lastInputAccessoryViewFrame.origin.y,
    //           lastInputAccessoryViewFrame.size.width, lastInputAccessoryViewFrame.size.height);

    // ProMotion: Reset CALayer from frozen position for next keyboard show
    [CATransaction begin];
    [CATransaction setDisableActions:YES];
    self->toolbarview.layer.affineTransform = CGAffineTransformIdentity;
    self->cachedSwipeTransform = CGAffineTransformIdentity;
    [CATransaction commit];

   // Reset for next keyboard show
    self->initialAccessoryViewFrame = CGRectNull;
    self->lastInputAccessoryViewFrame = CGRectZero;
    self->autoScrollToBottomDoneAfterShow = NO;
    self->hasSettledShift = NO;
    self->keyboardInsetSettled = NO;

    // Reset autoSize bottom constraint — only needed if this proxy had keyboard translation active
    BOOL wasInKeyboardMode = (self->settledShift != 0);
    self->settledShift = 0;

    if (wasInKeyboardMode) {
        // Reset autoSize bottom constraint to toolbar-only (no keyboard translation)
        [self applyAutoSizeBottomConstraintWithTranslation:0];
    }

    // Reset scroll-up trigger so the next drag can re-trigger showKeyboardOnScrollUp
    showKeyboardOnScrollUpTriggered = NO;

    //     NSLog(@"[TiDAKBC] === keyboardDidHide | RESET complete: initialAcc=NULL, hasSettled=NO, insetSettled=NO, settledShift=0 ===");
}

- (BOOL)isOwnFirstResponder
{
    BOOL textviewIsFirst = (textview != nil && textview.isFirstResponder);
    BOOL textFieldIsFirst = (textField != nil && textField.isFirstResponder);
    return textviewIsFirst || textFieldIsFirst;
}

- (void)keyboardWillShow:(NSNotification *)notification
{
    CGRect keyboardEndFrameWindow;
    [[notification.userInfo valueForKey:UIKeyboardFrameEndUserInfoKey] getValue: &keyboardEndFrameWindow];

    // Guard: UIKeyboard notifications are global — all proxy instances receive them.
    // Only the proxy whose text field is the first responder should apply changes.
    if (![self isOwnFirstResponder]) {
        //         NSLog(@"[TiDAKBC] keyboardWillShow | SKIPPED — text field is not first responder");
        return;
    }

    keyboardwillHide = false;

    self->animationCurve = [[notification.userInfo valueForKey:UIKeyboardAnimationCurveUserInfoKey] integerValue];
    [[notification.userInfo valueForKey:UIKeyboardAnimationDurationUserInfoKey] getValue:&keyboardTransitionDuration];

    //     NSLog(@"[TiDAKBC] === keyboardWillShow | curve=%ld, duration=%f, keyboardFrame={{%f,%f},{%f,%f}} ===",
    //           (long)self->animationCurve, keyboardTransitionDuration,
    //           keyboardEndFrameWindow.origin.x, keyboardEndFrameWindow.origin.y,
    //           keyboardEndFrameWindow.size.width, keyboardEndFrameWindow.size.height);
    self->keyboardShowing = YES;
    // Reset so the settle baseline KVO callback can handle the scroll on this keyboard show cycle
    self->autoScrollToBottomDoneAfterShow = NO;

   // Reset cached swipe transform and actual CALayer transform
    // When swiping is active, CALayer may have a swipe transform that conflicts with
    // the UIView transform keyboardWillShow is about to apply.
    // Only do this on initial keyboard show — during toolbar resize the KVO path
    // already reset the CALayer, and resetting here would cause a visual snap-back.
    // Also skip after spring-settled: CALayer has the swipe transform, resetting it
    // would make the toolbar disappear (UIView transform not synced until spring-settled).
    if (!keyboardVisible && !self->springSettledJustHappened) {
        [CATransaction begin];
        [CATransaction setDisableActions:YES];
        toolbarview.layer.affineTransform = CGAffineTransformIdentity;
        [CATransaction commit];
        self->cachedSwipeTransform = CGAffineTransformIdentity;
    }

    // After a toolbar resize, iOS re-adjusts the keyboard — allow UIView animation to apply the transform
    if (self->manualKeyboardResize) {
        self->manualKeyboardResize = false;
        //         NSLog(@"[TiDAKBC] keyboardWillShow resetting manualKeyboardResize (toolbar resize) | toolbarResizeDiff=%f",
        //               self->toolbarResizeDiff);
    }

    [self fireEventForKeyboardFrameInView:keyboardEndFrameWindow visible:true];

    // Capture fresh accessory view position from KVO before computing translation.
    // TiUIWindowProxy applies different layout constraints for extendSafeArea=false,
    // so the initialAccFrameY captured at startup may not match where iOS actually
    // positions the accessory view when the keyboard appears. This causes deltaY to
    // be wrong and the toolbar to sit behind the keyboard.
    if (!keyboardVisible && CGRectIsNull(lastInputAccessoryViewFrame)) {
        // First keyboard show — use actual iOS-computed accessory frame.y as baseline
        // This ensures deltaY is computed from what iOS actually rendered, not a stale value
        CGFloat actualAccY = lastInputAccessoryViewFrame.origin.y;
        CGFloat deltaFromKeyboard = keyboardEndFrameWindow.origin.y - actualAccY;
        // initialAccFrameY = actualAccY + deltaFromKeyboard = keyboardEndFrameWindow.origin.y
        // This way deltaY = initialAccFrameY - curY will use iOS's actual positions
        initialAccessoryViewFrameYWhenHidden = keyboardEndFrameWindow.origin.y;
        //         NSLog(@"[TiDAKBC] keyboardWillShow | FRESH baseline: initialAccFrameY=%f (from keyboardY=%.0f, actualAccY=%.0f)",
        //               initialAccessoryViewFrameYWhenHidden, keyboardEndFrameWindow.origin.y, actualAccY);
    }

 // Update scroll view insets for keyboard BEFORE computing autoScrollToBottom offset.
    // Without this, contentInset.bottom stays at safe-area value (~27) and the computed
    // scroll position is too large — items end up hidden behind the keyboard.
    if (nativeScrollView != nil) {
        //         NSLog(@"[TiDAKBC] keyboardWillShow | BEFORE applyScrollViewInset: contentInset.bottom=%.0f", nativeScrollView.contentInset.bottom);
        [self applyScrollViewInset:keyboardEndFrameWindow];
        // Compute translation for autoSize bottom constraint
        if (!CGRectIsEmpty(lastInputAccessoryViewFrame)) {
            CGFloat trans = [self computeToolbarTranslation:lastInputAccessoryViewFrame];
            [self applyAutoSizeBottomConstraintWithTranslation:trans];
        }
        //         NSLog(@"[TiDAKBC] keyboardWillShow | AFTER applyScrollViewInset: contentInset.bottom=%.0f", nativeScrollView.contentInset.bottom);

        // Animate scroll-to-bottom in sync with the keyboard.
        // contentInset.bottom was already set above by applyScrollViewInset,
        // so the target accounts for the keyboard height and toolbar.
        // In autoSize mode, contentInset.bottom is NOT updated, so use translation + toolbarH instead.
        if (self->autoScrollToBottom) {
            UIScrollView *sv = nativeScrollView;
            if (sv.contentSize.height > sv.frame.size.height) {
                CGFloat bottomHeight;
                if (autoSizeAndKeepScrollingViewAboveToolbar) {
                    CGFloat trans = CGRectIsEmpty(lastInputAccessoryViewFrame) ? 0 : [self computeToolbarTranslation:lastInputAccessoryViewFrame];
                    bottomHeight = sv.contentSize.height - sv.frame.size.height + trans + toolbarview.frame.size.height + sv.safeAreaInsets.bottom;
                } else {
                    bottomHeight = sv.contentSize.height - sv.frame.size.height + sv.contentInset.bottom + sv.safeAreaInsets.bottom;
                }
                if (!keyboardVisible) {
                    // Initial keyboard show — animate in sync with keyboard
                    CGPoint targetOffset = CGPointMake(0, bottomHeight);
                    CGFloat currentY = sv.contentOffset.y;
                    //                     NSLog(@"[TiDAKBC] keyboardWillShow | animated autoScrollToBottom: contentOffset.y=%f -> target=%.0f (contentInset.bottom=%.0f, safeAreaInsets.bottom=%.0f)",
                    //                           currentY, bottomHeight, sv.contentInset.bottom, sv.safeAreaInsets.bottom);
                    if (fabs(currentY - bottomHeight) > 1.0) {
                        [UIView animateWithDuration:keyboardTransitionDuration
                                              delay:0
                                            options:(self->animationCurve << 16) | UIViewAnimationOptionBeginFromCurrentState
                                         animations:^{
                            sv.contentOffset = targetOffset;
                        } completion:nil];
                        //                         NSLog(@"[TiDAKBC] keyboardWillShow | animated autoScrollToBottom to y=%.0f", bottomHeight);
                    }
                } else if (fabs(sv.contentOffset.y - bottomHeight) > 1.0) {
                    // Toolbar resize while keyboard visible — inset changed, scroll to new bottom
                    //                     NSLog(@"[TiDAKBC] keyboardWillShow | toolbar resize autoScrollToBottom: contentOffset.y=%f -> target=%.0f (contentInset.bottom=%.0f, safeAreaInsets.bottom=%.0f)",
                    //                           sv.contentOffset.y, bottomHeight, sv.contentInset.bottom, sv.safeAreaInsets.bottom);
                    sv.contentOffset = CGPointMake(0, bottomHeight);
                }
            }
        }
    }

   // Re-apply toolbar position when keyboard will show with correct animation.
    // On fresh shows (keyboard not yet visible) reset swipe state so the animation
    // starts from the base position. On re-shows (keyboard already visible) just
    // apply the translation directly without resetting state.
    if (!CGRectIsEmpty(lastInputAccessoryViewFrame) && nativeScrollView != nil) {
        CGFloat trans = [self computeToolbarTranslation:lastInputAccessoryViewFrame];
        if (!keyboardVisible && !self->springSettledJustHappened) {
            lastShiftValue = 0;
            isSwiping = NO;
        }
        //         NSLog(@"[TiDAKBC] keyboardWillShow | apply translation=%f, lastAcc={{%f,%f},{%f,%f}}",
        //               trans, lastInputAccessoryViewFrame.origin.x, lastInputAccessoryViewFrame.origin.y,
        //               lastInputAccessoryViewFrame.size.width, lastInputAccessoryViewFrame.size.height);
        [self applyToolbarTranslation:trans
                                animated:YES duration:keyboardTransitionDuration
                                   curve:self->animationCurve];
        self->settledShift = trans;
        self->lastShiftValue = trans;
    }
    // When switching keyboards (keyboard already visible), the KVO swipe baseline
    // (initialAccessoryViewFrame) still points to the previous keyboard's position.
    // Update it to the new position so swipe deltas are computed correctly.
    if (keyboardVisible && !CGRectIsEmpty(lastInputAccessoryViewFrame)) {
        self->initialAccessoryViewFrame = lastInputAccessoryViewFrame;
        //         NSLog(@"[TiDAKBC] keyboardWillShow | keyboard switch: updated initialAccessoryViewFrame to {{%f,%f},{%f,%f}}",
        //               lastInputAccessoryViewFrame.origin.x, lastInputAccessoryViewFrame.origin.y,
        //               lastInputAccessoryViewFrame.size.width, lastInputAccessoryViewFrame.size.height);
    }

    // Clear the flag at the end of keyboardWillShow regardless of which path was taken
    self->springSettledJustHappened = NO;
}

- (void)teardownKeyboardPanning
{
    panningSet = false;
    [toolbarview removeObserver:self forKeyPath:@"bounds" context:NULL];
    [proxyView removeObserver:self forKeyPath:@"bounds" context:NULL];
    [nativeScrollView removeObserver:self forKeyPath:@"contentSize" context:NULL];

    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIKeyboardWillHideNotification object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIKeyboardWillShowNotification object:nil];

    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIKeyboardDidHideNotification object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIKeyboardDidShowNotification object:nil];
    safeAreaValue = 0;
    keyboardVisible = false;
    lastShiftValue = 0;
    lastY = 0;
    lastKeyboardHeight = 0;
    maxKeyBoardHeight = 0;
    minKeyBoardHeight = 0;
    inputView = nil;
    inputViewFrame = CGRectZero;
    [self uninstallScrollDelegateProxy];
}




- (void)fireEventForKeyboardFrameInView:(CGRect)keyboardFrameInView visible:(BOOL)status
{
    if (![self _hasListeners:@"keyboardchange"]) {
        return;
    }

    NSNumber * keyboardWidth = [NSNumber numberWithFloat:keyboardFrameInView.size.width];
    NSNumber * keyboardHeight = [NSNumber numberWithFloat:keyboardFrameInView.size.height-inputViewFrame.size.height];
    NSNumber * keyboardX = [NSNumber numberWithFloat:keyboardFrameInView.origin.x];
    NSNumber * keyboardY = [NSNumber numberWithFloat:keyboardFrameInView.origin.y-inputViewFrame.size.height];

    NSMutableDictionary * event = [NSMutableDictionary dictionary];

    [event setValue:[NSNumber numberWithBool:status]
             forKey:@"visible"];

    [event setValue:keyboardHeight
             forKey:@"height"];

    [event setValue:keyboardWidth
             forKey:@"width"];

    [event setValue:keyboardX
             forKey:@"x"];

    [event setValue:keyboardY
             forKey:@"y"];

    [self fireEvent:@"keyboardchange" withObject:event];

}



-(void)runBlock:(void (^)(void))block
{
    block();
}
-(void)runAfterDelay:(CGFloat)delay block:(void (^)(void))block
{
    void (^block_)(void) = [block copy];
    [self performSelector:@selector(runBlock:) withObject:block_ afterDelay:delay];
}





- (void)updateKeyboardPanningViews:(CGRect)keyboardFrameInView withScrollView:(UIScrollView*)scrollView withBottomValue:(CGFloat)bottomvalue
{
    CGFloat t = [self computeToolbarTranslation:keyboardFrameInView];
    BOOL isTabGroup_ = isTabGroup;
    BOOL isNavWindow = isNavigationWindow;
    BOOL extendSafeArea_ = extendSafeArea;

    // Apply toolbar transform (CALayer for swipe, UIView animation for rest)
    if (!isSwiping && !manualKeyboardResize && !self.manualPanning) {
        [self applyToolbarTranslation:t animated:YES duration:keyboardTransitionDuration curve:animationCurve];
    } else if (isSwiping || keyboardwillHide) {
        // CALayer already handles swipe; just update insets and scroll-to-bottom here
    }

    // Apply contentInset
    [self applyScrollViewInset:keyboardFrameInView];

    // Auto-scroll to bottom
    [self scrollToBottomIfNeeded];

    lastKeyboardHeight = (int)(keyboardFrameInView.size.height - inputViewFrame.size.height);
}


#pragma mark - Clean Methods

- (CGFloat)computeToolbarTranslation:(CGRect)inputAccessoryFrame
{
    // Delta approach: how far has the accessory view moved up from its hidden position?
    CGFloat deltaY = initialAccessoryViewFrameYWhenHidden - inputAccessoryFrame.origin.y;

    //     NSLog(@"[TiDAKBC] computeToolbarTranslation | acc={{%f,%f},{%f,%f}} delta=%f (initY=%f, curY=%f) safeArea=%.0f bottomPadding=%.0f toolbarResizeDiff=%f extendSafeArea=%d isTabGroup=%d",
    //           inputAccessoryFrame.origin.x, inputAccessoryFrame.origin.y,
    //           inputAccessoryFrame.size.width, inputAccessoryFrame.size.height,
    //           deltaY, initialAccessoryViewFrameYWhenHidden, inputAccessoryFrame.origin.y,
    //           safeAreaValue, bottomPadding, toolbarResizeDiff, extendSafeArea, isTabGroup);

    // Dynamically re-evaluate tabBarHidden when computing translation.
    // The tabBar may have been hidden/shown after setupKeyboardPanning: ran
    // (e.g. user switched from a tab with visible tabBar to one with tabBarHidden:true).
    if (isTabGroup && _parentWindow) {
        id tabgroup = [_parentWindow performSelector:@selector(tabGroup)];
        if (tabgroup != nil) {
            UITabBar *tabBar = [[tabgroup view] performSelector:@selector(tabbar)];
            if (tabBar && tabBar.isHidden) {
                tabgroupHeight = 0;
            } else {
                tabgroupHeight = [self calculateTabBarHeight];
            }
        }
    }

    // Config adjustments as flat variables (same logic as original code)
    CGFloat translation = deltaY + bottomPadding;
    if (isTabGroup && !isNavigationWindow) {
        // In a TabGroup (no nav window), the toolbarView sits above the tab bar
        // in the window's content area. The initialAccessoryViewFrameYWhenHidden
        // is measured in screen coordinates (bottom of screen), but the toolbar
        // actually starts tabgroupHeight pixels higher (bottom of content area).
        // Apply the same offset as extendSafeArea:true (toolbarResizeDiff + bottomPadding)
        // plus the tabgroupHeight offset between screen-bottom and content-area-bottom.
        translation -= tabgroupHeight + toolbarResizeDiff + bottomPadding;
        // When tabBar is hidden, the toolbar sits within the safe-area and Titanium's
        // layout system applies an extra bottomPadding shift. Compensate by reducing
        // translation so the toolbar lands at keyboard top for both layout modes.
        if (tabgroupHeight == 0) {
            translation -= bottomPadding;
        }
        //         NSLog(@"[TiDAKBC] computeToolbarTranslation | TAB_GROUP(no nav): raw=%f -= (%f + %.0f + %.0f)", translation, tabgroupHeight, toolbarResizeDiff, bottomPadding);
    } else if (isTabGroup && isNavigationWindow) {
        if (autoSizeAndKeepScrollingViewAboveToolbar) {
            // autoSize mode: tabgroupHeight includes bottomPadding, but in NavWindow+TabGroup
            // the toolbar sits within the content area which already respects safeArea.
            // Subtract bottomPadding from tabgroupHeight to avoid double-counting.
            CGFloat effectiveTabgroupHeight = (tabgroupHeight > 0) ? (tabgroupHeight - bottomPadding) : 0;
            translation -= effectiveTabgroupHeight + toolbarResizeDiff + bottomPadding;
            //             NSLog(@"[TiDAKBC] computeToolbarTranslation | TAB_GROUP(nav autoSize): raw=%f -= (%.0f + %.0f + %.0f)", translation, effectiveTabgroupHeight, toolbarResizeDiff, bottomPadding);
        } else {
            // autoAdjustBottomPadding mode: use full tabgroupHeight because the
            // contentInset approach handles the safe-area offset differently.
            translation -= tabgroupHeight + toolbarResizeDiff + bottomPadding;
            //             NSLog(@"[TiDAKBC] computeToolbarTranslation | TAB_GROUP(nav inset): raw=%f -= (%.0f + %.0f + %.0f)", translation, tabgroupHeight, toolbarResizeDiff, bottomPadding);
        }
        if (tabgroupHeight == 0) {
            translation -= bottomPadding;
        }
    } else if (!isTabGroup) {
        // Non-tab windows with extendSafeArea=false sit inside Titanium's safeAreaViewProxy
        // which constrains content within the home indicator zone. iOS inputAccessoryView is NOT
       // constrained by this — it sits above where keyboard would appear (below home indicator).
        // So toolbarview starts ~bottomPadding lower than expected, requiring extra upward offset.
        if (!extendSafeArea) {
          // Extra upward offset for no-extend mode: Titanium's safeAreaViewProxy positions views lower than iOS inputAccessoryView anchor point.
            float correction = floorf(bottomPadding * 0.8) + 1;
            translation -= toolbarResizeDiff - (int)correction;
        } else {
            translation -= toolbarResizeDiff + bottomPadding;
            //             NSLog(@"[TiDAKBC] computeToolbarTranslation | NON_TAB(extend): raw=%f -= (%.0f + %.0f)", translation, toolbarResizeDiff, bottomPadding);
        }
    }

    CGFloat result = fmax(translation, safeAreaValue);
    //     NSLog(@"[TiDAKBC] computeToolbarTranslation | RESULT: raw=%f -> clamped=%.4f (safeArea=%.0f)", result, result, translation, safeAreaValue);
    return result;
}

- (void)applyToolbarTranslation:(CGFloat)translation animated:(BOOL)animated duration:(NSTimeInterval)duration curve:(NSInteger)curve
{
    //     NSLog(@"[TiDAKBC] applyToolbarTranslation | translation=%f animated=%d duration=%f curve=%ld path=%s (swiping=%d willHide=%d)",
    //           translation, animated, duration, (long)curve,
    //           (isSwiping || keyboardwillHide) ? "CALayer" : "UIView",
    //           isSwiping, keyboardwillHide);

    if (isSwiping || keyboardwillHide) {
        // CALayer for 120Hz smoothness during swipe/hide
        CGAffineTransform transform = CGAffineTransformMakeTranslation(0, -translation);
        //         NSLog(@"[TiDAKBC] applyToolbarTranslation | CALAYER: ty=%-10f cached=(%g,%g)", -translation, cachedSwipeTransform.ty, transform.ty);
        [CATransaction begin];
        [CATransaction setDisableActions:YES];
        toolbarview.layer.affineTransform = transform;
        cachedSwipeTransform = transform;
        [CATransaction commit];
    } else if (!animated || duration <= 0) {
        // Instant (no animation) — remove any in-flight UIView animation on transform
        // and set directly via CALayer to avoid coalescing with the keyboard animation.
        CGAffineTransform transform = CGAffineTransformMakeTranslation(0, -translation);
        //         NSLog(@"[TiDAKBC] applyToolbarTranslation | INSTANT: ty=%f", -translation);
        [toolbarview.layer removeAllAnimations];
        toolbarview.transform = transform;
        [CATransaction begin];
        [CATransaction setDisableActions:YES];
        toolbarview.layer.affineTransform = transform;
        cachedSwipeTransform = transform;
        [CATransaction commit];
    } else {
        // UIView animation for smooth keyboard-aligned transitions
        CGAffineTransform transform = CGAffineTransformMakeTranslation(0, -translation);
        NSTimeInterval animDuration = _manualPanning ? 0 : duration;
        //         NSLog(@"[TiDAKBC] applyToolbarTranslation | UIView: translation=%-10f duration=%.4f curve=%ld", -translation, animDuration, (long)curve);
        [UIView animateWithDuration:animDuration
                              delay:0
                            options:(curve << 16) | UIViewAnimationOptionBeginFromCurrentState
                         animations:^{
            toolbarview.transform = transform;
        } completion:nil];
    }

    lastShiftValue = translation;
}

- (void)applyAutoSizeBottomConstraintWithTranslation:(CGFloat)translation
{
    if (!autoSizeAndKeepScrollingViewAboveToolbar) return;
    CGFloat bottomValue = initialScrollingViewBottomValue + toolbarview.frame.size.height + translation;
    LayoutConstraint* lp = [_scrollingView layoutProperties];
    lp->bottom = TiDimensionDip(bottomValue);
    [_scrollingView refreshView:nil];
    //     NSLog(@"[TiDAKBC] applyAutoSizeBottom | bottom=%.2f (initialBottom=%.2f + toolbarH=%.0f + translation=%.2f)", bottomValue, initialScrollingViewBottomValue, toolbarview.frame.size.height, translation);
}

- (void)applyScrollViewInset:(CGRect)inputAccessoryFrame
{
    CGFloat translation = [self computeToolbarTranslation:inputAccessoryFrame];
    CGRect toolbarFrame = toolbarview.frame;
    CGFloat bottomInset = translation + toolbarFrame.size.height;

    // Config adjustments for inset
    if (autoSizeAndKeepScrollingViewAboveToolbar) {
        // autoSize mode manages layout via bottom constraint, not contentInset
        //         NSLog(@"[TiDAKBC] applyScrollViewInset | SKIPPED (autoSize mode, managing via constraints)");
        return;
    } else if (extendSafeArea) {
        // translation already has bottomPadding subtracted in computeToolbarTranslation,
        // so translation + toolbarHeight double-subtracts it. Cancel the double-subtraction.
        // For ignoreExtendSafeArea=true: also keep inset responsive to toolbar resize.
        bottomInset -= bottomPadding;
    }

    CGFloat oldBottom = nativeScrollView.contentInset.bottom;
    //     NSLog(@"[TiDAKBC] applyScrollViewInset | REASON=inset-update accFrame={{%f,%f},{%f,%f}} translation=%f toolbarH=%f keyboardVis=%d hasSettled=%d manualResize=%d extendSafeArea=%d ignoreExtend=%d oldBottom=%.0f newBottom=%.0f delta=%.0f",
    //           inputAccessoryFrame.origin.x, inputAccessoryFrame.origin.y,
    //           inputAccessoryFrame.size.width, inputAccessoryFrame.size.height,
    //           translation, toolbarFrame.size.height,
    //           keyboardVisible, hasSettledShift, manualKeyboardResize, extendSafeArea, ignoreExtendSafeArea,
    //           oldBottom, bottomInset, bottomInset - oldBottom);

    UIEdgeInsets newInsets = UIEdgeInsetsMake(
        nativeScrollView.contentInset.top, 0, bottomInset, 0
    );
    [nativeScrollView setContentInset:newInsets];
    nativeScrollView.scrollIndicatorInsets = newInsets;

    //     NSLog(@"[TiDAKBC] applyScrollViewInset | APPLIED contentInset={{%.0f,%.0f,%.0f,%.0f}}",
    //           nativeScrollView.contentInset.top, nativeScrollView.contentInset.left,
    //           nativeScrollView.contentInset.bottom, nativeScrollView.contentInset.right);
}

- (void)scrollToBottomIfNeeded
{
    if (!autoScrollToBottom || !_scrollingView || !nativeScrollView) {
        //         NSLog(@"[TiDAKBC] scrollToBottom | SKIPPED: autoScrollToBottom=%d, _scrollingView=%p, nativeScrollView=%p",
        //               autoScrollToBottom, _scrollingView, nativeScrollView);
        return;
    }

    UIScrollView *sv = nativeScrollView;
    if (sv.contentSize.height <= sv.frame.size.height) {
        //         NSLog(@"[TiDAKBC] scrollToBottom | SKIPPED: contentSizeH=%.0f <= boundsH=%.0f",
        //               sv.contentSize.height, sv.frame.size.height);
        return;
    }

    CGFloat bottomHeight = sv.contentSize.height - sv.frame.size.height + sv.contentInset.bottom + sv.safeAreaInsets.bottom;

    //     NSLog(@"[TiDAKBC] scrollToBottom | context: contentSize={%.0f,%.0f}, boundsSize={%.0f,%.0f}, offsetBefore={{%f,%f}}, contentInset={%.0f,%.0f,%.0f,%.0f}, tabgroupHeight=%.0f, bottomHeight=%.0f",
    //           sv.contentSize.width, sv.contentSize.height,
    //           sv.frame.size.width, sv.frame.size.height,
    //           sv.contentOffset.x, sv.contentOffset.y,
    //           sv.contentInset.top, sv.contentInset.left, sv.contentInset.bottom, sv.contentInset.right,
    //           tabgroupHeight, bottomHeight);

    // Adjust for autoSizeAndKeepScrollingViewAboveToolbar
    // In autoSize mode, contentInset.bottom is not updated (applyScrollViewInset returns early),
    // so use the toolbar translation + toolbar height for the scroll target.
    if (autoSizeAndKeepScrollingViewAboveToolbar) {
        // Use current translation (from settledShift or 0 if keyboard hidden)
        CGFloat autoSizeTrans = settledShift > 0 ? settledShift : 0;
        bottomHeight = sv.contentSize.height - sv.frame.size.height + autoSizeTrans + toolbarview.frame.size.height + sv.safeAreaInsets.bottom;
        [self applyAutoSizeBottomConstraintWithTranslation:autoSizeTrans];
    }

    CGPoint newOffset = CGPointMake(0, bottomHeight);
    if (fabs(sv.contentOffset.y - bottomHeight) > 1.0) {
        //         NSLog(@"[TiDAKBC] scrollToBottom | APPLIED offset {{%f,%f}} -> {{%f,%.0f}}", sv.contentOffset.x, sv.contentOffset.y, newOffset.x, newOffset.y);
        sv.contentOffset = newOffset;
    } else {
        //         NSLog(@"[TiDAKBC] scrollToBottom | SKIPPED (already at %.0f, target=%.0f, diff=%.2f)", sv.contentOffset.y, bottomHeight, fabs(sv.contentOffset.y - bottomHeight));
    }
}

- (void)handleToolbarBoundsChangeToHeight:(CGFloat)newHeight
{
    CGFloat oldHeight = toolbarview.frame.size.height;
    CGFloat delta = newHeight - oldHeight;
    manualKeyboardResize = true;
    toolbarResizeDiff = (oldHeight - initialKeyboardTriggerOffset);

    //     NSLog(@"[TiDAKBC] handleToolbarBoundsChangeToHeight | OLD_H=%f NEW_H=%f DELTA=%f initialKeyboardTriggerOffset=%f toolbarResizeDiff=%f",
    //           oldHeight, newHeight, delta, initialKeyboardTriggerOffset, toolbarResizeDiff);

    // Reset CALayer swipe transform on real resize
    if (!CGAffineTransformEqualToTransform(cachedSwipeTransform, CGAffineTransformIdentity)) {
        //         NSLog(@"[TiDAKBC] handleToolbarBoundsChangeToHeight | resetting CALayer swipe transform (ty=%f)", cachedSwipeTransform.ty);
        [CATransaction begin];
        [CATransaction setDisableActions:YES];
        toolbarview.layer.affineTransform = CGAffineTransformIdentity;
        cachedSwipeTransform = CGAffineTransformIdentity;
        [CATransaction commit];
    }

    // Update swipe baseline to new toolbar frame.
    // NOTE: Do NOT set initialAccessoryViewFrame here — iOS may still be animating the accessory view position.
    // Using a stale frame.y would cause settle baseline (which runs on first KVO after didHide) or
    // subsequent calculations to use wrong values, breaking swipe positioning.
    // Instead we only update height tracking; KVO TOOLBAR RESIZE DETECTED handles initialAccessoryViewFrame
    // and settledShift once iOS finishes animating the new position.
    lastInputViewFrameHeight = newHeight;

   // Update input view frame to match toolbar size (needed for accessory positioning)
    inputViewFrame.size.height = newHeight;
    inputView.frame = inputViewFrame;

    // Update autoSize bottom constraint for new toolbar height
    if (keyboardVisible && !CGRectIsEmpty(lastInputAccessoryViewFrame)) {
        CGFloat trans = [self computeToolbarTranslation:lastInputAccessoryViewFrame];
        [self applyAutoSizeBottomConstraintWithTranslation:trans];
    } else {
        [self applyAutoSizeBottomConstraintWithTranslation:0];
    }

    //     NSLog(@"[TiDAKBC] handleToolbarBoundsChangeToHeight | DONE — inputView frame={{%f,%f},{%f,%f}}",
    //           inputView.frame.origin.x, inputView.frame.origin.y, inputView.frame.size.width, inputView.frame.size.height);
}





- (void)initPaddings
{
    if ([_scrollingView viewReady]) {
        //         NSLog(@"[TiDAKBC] initPaddings | viewReady=YES, calling inputView doConfig");
        manualKeyboardResize = true;

        [inputView doConfig];
        //         NSLog(@"[TiDAKBC] initPaddings | DONE — inputView doConfig called");
    }
    else {
        //         NSLog(@"[TiDAKBC] initPaddings | viewReady=NO, retrying in 0.16s (_scrollingView=%p)", _scrollingView);

        [self performSelector:@selector(initPaddings) withObject:self afterDelay:0.16f];
    }
}



- (NSDictionary *)eventObjectForScrollView:(UIScrollView *)scrollView
{
  return [NSDictionary dictionaryWithObjectsAndKeys:
                       [TiUtils pointToDictionary:scrollView.contentOffset], @"contentOffset",
                       [TiUtils sizeToDictionary:scrollView.contentSize], @"contentSize",
                       [TiUtils sizeToDictionary:scrollView.bounds.size], @"size",
                       @"true", @"fromKeyboardControl",
                       nil];
}




- (void)scrollToBottom:(UIScrollView *)scrollingview
{
    if ([(TiWindowProxy *)_parentWindow opening]) {

    }

    CGPoint bottomOffset = CGPointMake(0, scrollingview.contentSize.height - scrollingview.bounds.size.height + scrollingview.contentInset.bottom);
    [scrollingview setContentOffset:bottomOffset animated:NO];

    //////////////NSLog ( @" autoScrollToBottom End " );

    /*
    CGSize svContentSize = contentScrollView.contentSize;
    CGSize svBoundSize = contentScrollView.bounds.size;
    CGFloat svBottomInsets = contentScrollView.contentInset.bottom;


    //////////////NSLog ( @" svContentSize.height   svBoundSize.height  svBottomInsets  %f   %f   %f: ",svContentSize.height, svBoundSize.height, svBottomInsets);



    //////////////NSLog ( @" bottomHeight %f: ",(svContentSize.height - svBoundSize.height + svBottomInsets));


    CGFloat bottomHeight = svContentSize.height - svBoundSize.height + svBottomInsets + toolbarview.frame.size.height + tabgroupHeight + safeAreaValue + toolbarview.frame.size.height;

    //////////////NSLog ( @" bottomHeight AFTER %f: ",bottomHeight);


    CGFloat bottomWidth = svContentSize.width - svBoundSize.width;

    CGPoint newOffset = CGPointMake(bottomWidth, bottomHeight);

    contentScrollView.contentOffset = newOffset;
     */
}


- (void)setKeyboardTriggerOffset:(id)args
{
   CGFloat offset = [TiUtils floatValue:args def:0.0f];
   keyboardTriggerOffset = offset;
   manualKeyboardResize = true;
}

- (void)setKeyboardPanning:(id)args
{
    ENSURE_UI_THREAD(setKeyboardPanning, args);

    keyboardPanningOn = [TiUtils boolValue:args def:NO];

    [self replaceValue:[NSNumber numberWithBool:keyboardPanningOn]
                forKey:@"keyboardPanning"
          notification:NO];
}



- (void)setAutoSizeAndKeepScrollingViewAboveToolbar:(id)args
{
    ENSURE_UI_THREAD(setAutoSizeAndKeepScrollingViewAboveToolbar, args);
    autoSizeAndKeepScrollingViewAboveToolbar = [TiUtils boolValue:args def:NO];
   // autoSizeAndKeepScrollingViewAboveToolbar = false;

}



- (void)setAutoAdjustBottomPadding:(id)args
{
    ENSURE_UI_THREAD(setAutoAdjustBottomPadding, args);
    autoAdjustBottomPadding = [TiUtils boolValue:args def:NO];
}

- (void)setIgnoreExtendSafeArea:(id)args
{
    ENSURE_UI_THREAD(setIgnoreExtendSafeArea, args);
    ignoreExtendSafeArea = [TiUtils boolValue:args def:NO];
}

- (void)setAutoScrollToBottom:(id)args
{
    ENSURE_UI_THREAD(setAutoScrollToBottom, args);
    autoScrollToBottom = [TiUtils boolValue:args def:NO];
}

- (void)setShowKeyboardOnScrollUp:(id)args
{
    ENSURE_UI_THREAD(setShowKeyboardOnScrollUp, args);
    showKeyboardOnScrollUp = [TiUtils boolValue:args def:NO];

    if (nativeScrollView) {
        if (showKeyboardOnScrollUp) {
            [self installScrollDelegateProxy];
        } else {
            [self uninstallScrollDelegateProxy];
        }
    }
}

- (void)installScrollDelegateProxy
{
    if (!nativeScrollView || !showKeyboardOnScrollUp) return;

    id<UIScrollViewDelegate> existingDelegate = nativeScrollView.delegate;

    // Don't reinstall if already installed
    if ([existingDelegate isKindOfClass:[TiKeyboardControlScrollDelegateProxy class]]) {
        return;
    }

    scrollDelegateProxy = [[TiKeyboardControlScrollDelegateProxy alloc] init];
    scrollDelegateProxy.originalDelegate = existingDelegate;
    scrollDelegateProxy.keyboardControlProxy = self;
    nativeScrollView.delegate = scrollDelegateProxy;

    //     NSLog(@"[TiDAKBC] installScrollDelegateProxy | installed, originalDelegate=%@", existingDelegate);
}

- (void)uninstallScrollDelegateProxy
{
    if (!nativeScrollView) return;

    if ([nativeScrollView.delegate isKindOfClass:[TiKeyboardControlScrollDelegateProxy class]]) {
        TiKeyboardControlScrollDelegateProxy *proxy = (TiKeyboardControlScrollDelegateProxy *)nativeScrollView.delegate;
        nativeScrollView.delegate = proxy.originalDelegate;
    }
    scrollDelegateProxy = nil;

    //     NSLog(@"[TiDAKBC] uninstallScrollDelegateProxy | restored original delegate");
}

- (void)handleScrollViewWillBeginDragging:(UIScrollView *)scrollView
{
    isDraggingScroll = YES;
    showKeyboardOnScrollUpTriggered = NO;
}

- (void)handleScrollViewDidScroll:(UIScrollView *)scrollView
{
    if (!showKeyboardOnScrollUp) return;
    if (!isDraggingScroll) return;
    if (showKeyboardOnScrollUpTriggered) return;
    if (keyboardVisible) return;
    if (keyboardwillHide) return;

    CGFloat contentHeight = scrollView.contentSize.height;
    CGFloat visibleHeight = scrollView.frame.size.height;
    CGFloat contentInsetBottom = scrollView.contentInset.bottom;
    CGFloat currentOffsetY = scrollView.contentOffset.y;

    // Maximum normal scroll position (bottom of content)
    CGFloat bottomOffset = contentHeight - visibleHeight + contentInsetBottom;

    // Trigger when scrolled to bottom (with 20pt threshold for bounce detection)
    CGFloat atBottomThreshold = 20.0;
    BOOL isAtOrPastBottom = (currentOffsetY >= bottomOffset - atBottomThreshold);

    if (isAtOrPastBottom && contentHeight > visibleHeight) {
        showKeyboardOnScrollUpTriggered = YES;

        if (textview != nil && ![textview isFirstResponder]) {
            //             NSLog(@"[TiDAKBC] showKeyboardOnScrollUp | becomeFirstResponder on textview at offsetY=%.0f", currentOffsetY);
            [textview becomeFirstResponder];
        } else if (textField != nil && ![textField isFirstResponder]) {
            //             NSLog(@"[TiDAKBC] showKeyboardOnScrollUp | becomeFirstResponder on textField at offsetY=%.0f", currentOffsetY);
            [textField becomeFirstResponder];
        }
    }
}

- (void)handleScrollViewDidEndDragging:(UIScrollView *)scrollView willDecelerate:(BOOL)decelerate
{
    isDraggingScroll = NO;
}


-(void)putTiKeyboardControlView:(TiKeyboardControlView *)view {
    keyboardControlView = view;
}


- (TiKeyboardControlView *)getTiKeyboardControlView
{
    return keyboardControlView;
}

-(void)manuallPanning:(BOOL)panning {
    self.manualPanning = panning;
}



#pragma mark - JavaScript-Exposed Height Queries

- (void)getHeights:(id)args
{
    CGFloat statusBarH = [self getStatusBarHeight];
    CGFloat navBarH = [self calculateNavigationBarHeight];
    CGFloat tabBarH = [self calculateTabBarHeight];
    CGFloat safeAreaTop = 0.0, safeAreaBottom = 0.0;
    if (@available(iOS 11.0, *)) {
        UIWindow *kw = [self resolveKeyWindow];
        if (kw) { safeAreaTop = kw.safeAreaInsets.top; safeAreaBottom = kw.safeAreaInsets.bottom; }
    }
    NSDictionary *heights = @{
        @"statusBarHeight": @(statusBarH),
        @"navigationBarHeight": @(navBarH),
        @"tabBarHeight": @(tabBarH),
        @"safeAreaTop": @(safeAreaTop),
        @"safeAreaBottom": @(safeAreaBottom)
    };
    [self fireEvent:@"heightResult" withObject:@{@"result": heights}];
}

- (void)getStatusBarHeight:(id)args
{
    CGFloat height = [self getStatusBarHeight];
    [self fireEvent:@"heightResult" withObject:@{@"result": @(height)}];
}

- (void)getNavigationBarHeight:(id)args
{
    CGFloat height = [self calculateNavigationBarHeight];
    [self fireEvent:@"heightResult" withObject:@{@"result": @(height)}];
}

- (void)getTabBarHeight:(id)args
{
    CGFloat height = [self calculateTabBarHeight];
    [self fireEvent:@"heightResult" withObject:@{@"result": @(height)}];
}
@end




@implementation TiKeyboardControlView

- (id)init
{
  self = [super init];

    if (self != nil) {

        self.keyboardPanRecognizer = [[UIPanGestureRecognizer alloc] initWithTarget:self
                                                                             action:@selector(panGestureDidChange:)];
        [self.keyboardPanRecognizer setMinimumNumberOfTouches:1];
        [self.keyboardPanRecognizer setDelegate:self];
        [self.keyboardPanRecognizer setCancelsTouchesInView:NO];


        [self addGestureRecognizer:self.keyboardPanRecognizer];

    }
  return self;
}


- (void)initializeState
{
  // Creates and keeps a reference to the view upon initialization
  [super initializeState];
  [(TiKeyboardControlViewProxy *)[self proxy] putTiKeyboardControlView:self];
}

- (void)frameSizeChanged:(CGRect)frame bounds:(CGRect)bounds
{
  // Sets the size and position of the view
//  [TiUtils setView:square positionRect:bounds];
    [super frameSizeChanged:frame bounds:bounds];


    ////////NSLog ( @"+++++++++++++++++++++++++++++ frameSizeChanged ");


}

- (void)setColor_:(id)color
{
  // Assigns the view's background color
//  square.backgroundColor = [[TiUtils colorValue:color] _color];
}


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
        // Don't allow panning if inside the active input (unless SELF is a UITextView and the receiving view)
        return (![touch.view isFirstResponder] || ([self isKindOfClass:[UITextView class]] && [self isEqual:touch.view]));
    }
    else
    {
        return YES;
    }
}


- (void)panGestureDidChange:(UIPanGestureRecognizer *)gesture
{
    switch (gesture.state)
    {
        case UIGestureRecognizerStateBegan:
        {
            // For the duration of this gesture, do not recognize more touches than
            // it started with
            [(TiKeyboardControlViewProxy *)[self proxy] manuallPanning:true];
            ////////NSLog ( @" panGestureDidChange manuall dragging TRUE" );

            gesture.maximumNumberOfTouches = gesture.numberOfTouches;
        }
            break;
        case UIGestureRecognizerStateChanged:
        {

        }
            break;
        case UIGestureRecognizerStateEnded:
        {
            [(TiKeyboardControlViewProxy *)[self proxy] manuallPanning:false];
            ////////NSLog ( @" panGestureDidChange manuall dragging FALSE" );

        }
            break;

        case UIGestureRecognizerStateCancelled:
        {
            ////////NSLog ( @" panGestureDidChange manuall dragging FALSE" );

            [(TiKeyboardControlViewProxy *)[self proxy] manuallPanning:false];

            // Set the max number of touches back to the default
            gesture.maximumNumberOfTouches = NSUIntegerMax;
        }
            break;
        default:
            break;
    }
}


@end
