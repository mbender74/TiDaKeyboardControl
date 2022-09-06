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
#import "TiViewProxy+KeyboardControl.h"
#import "ItSmcDakeyboardcontrolModule.h"

//#import "DAKeyboardControl.h"
#import "TiBase.h"
#import "TiHost.h"
#import "TiComplexValue.h"
#import "Ti2DMatrix.h"
#import "TiUIView.h"
#import "TiAnimation.h"
#import "TiViewProxy+KeyboardControl.h"
#import "TiUIScrollView.h"
#import "TiUITableView.h"
#import "TiUIListViewProxy.h"
#import "TiUIListView.h"
#import <TitaniumKit/TiUtils.h>
#import <TitaniumKit/TiViewTemplate.h>
#import "BABFrameObservingInputAccessoryView.h"
#import <TitaniumKit/TiAnimation.h>
#import <TiUtils.h>
#import <objc/runtime.h>

@implementation TiViewProxy (KeyboardControl)

DEFINE_DEF_PROP(textfield, nil);
DEFINE_DEF_PROP(lockedViews, nil);
CGPoint initialContentOffset;
BOOL initialContentOffsetValid;
BOOL panningSet;
BOOL manualKeyboardResize;
BOOL keyboardVisible;
BOOL keyboardwillHide;
BOOL keyboardwillShow;
int status;
int lastShiftValue = 0;
float lastY = 0;
int lastKeyboardHeight = 0;
int maxKeyBoardHeight = 0;
int minKeyBoardHeight = 0;
NSLayoutConstraint *toolbarContainerVerticalSpacingConstraint;
BABFrameObservingInputAccessoryView *inputView;
CGRect inputViewFrame;
TiViewProxy * toolbarViewProxy;
TiUIView * toolbarView;
UITextView *textview;
UITextField *textField;
float lastInputViewFrameHeight = 0;
float lastKeyBoardViewFrameHeight = 0;
CGRect lastInputAccessoryViewFrame;
double keyboardTransitionDuration;
float keyboardTriggerOffset;
CGRect initalToolbarViewFrame;
float initialKeyboardTriggerOffset;
float initialBottomValue = 0;
CGRect windowRect;
CGFloat windowHeight;
id safeAreaValue;
BOOL keyboardPanningOn;
static void *ToolbarFrameObservingContext = &ToolbarFrameObservingContext;
UIViewAnimationCurve animationCurve;

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



- (id)listSubviewsOfView:(UIView *)view {
    NSArray *subviews = [view subviews];

    for (UIView *subview in subviews) {
        if ([subview isKindOfClass:[UITextView class]]){
            return (UITextView*)subview;
        }
        else if ([subview isKindOfClass:[UITextField class]]){
            return (UITextField*)subview;
        }
        else {
            [self listSubviewsOfView:subview];
        }
    }
}

-(id) findTextView {
    TiViewProxy * toolbarViewProxy = [self textfield];

    if (toolbarViewProxy != nil) {
        UIView * proxyView = [toolbarViewProxy view];
        return [self listSubviewsOfView:proxyView];
    }
    else {
        return nil;
    }
}

- (void)setupKeyboardPanning
{
    lastInputAccessoryViewFrame = CGRectZero;
    lastShiftValue = 0;
    lastY = 0;
    lastKeyboardHeight = 0;
    maxKeyBoardHeight = 0;
    minKeyBoardHeight = 0;
    inputView = nil;
    inputViewFrame = CGRectZero;
    manualKeyboardResize = false;
    panningSet = false;
    keyboardVisible = false;
    keyboardwillHide = false;
    initalToolbarViewFrame = CGRectZero;
    windowRect = self.view.window.frame;
    windowHeight = windowRect.size.height;
    
    safeAreaValue = [self valueForUndefinedKey:@"safeArea"];
    if (safeAreaValue == nil || safeAreaValue == [NSNull null]){
        safeAreaValue = 0;
    }

    __weak TiViewProxy *weakSelf = self;
    
    toolbarViewProxy = [[self lockedViews] objectAtIndex:0];
    toolbarView  = [toolbarViewProxy view];
    initialBottomValue = [TiUtils floatValue:[toolbarViewProxy valueForKey:@"bottom"] def:0];
    
    initalToolbarViewFrame = toolbarView.frame;
    initialKeyboardTriggerOffset = keyboardTriggerOffset;

    
    [toolbarView addObserver:self forKeyPath:@"bounds" options:0 context:ToolbarFrameObservingContext];

    TiViewProxy * proxy = [[self lockedViews] objectAtIndex:1];
    TiUIView * proxyView = [proxy view];
    
    UITableView *sv = nil;
    
    if ([proxyView isKindOfClass:[TiUIListView class]] || [proxyView isKindOfClass:[TiUITableView class]] || [NSStringFromClass([proxyView class])  isEqual: @"TiCollectionviewCollectionView"]) {
        
        if ([proxyView isKindOfClass:[TiUITableView class]]){
            object_setClass(sv, [UITableView class]);
            sv = (UITableView *)[(TiUITableView*)proxyView tableView];
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

        else {
            object_setClass(sv, [TiUIScrollViewImpl class]);
            sv = [(TiUIScrollView*)proxyView scrollView];
        }
        
        
        if (panningSet == false){
            panningSet = true;
            [(UIScrollView *)sv setKeyboardDismissMode:UIScrollViewKeyboardDismissModeInteractive];
           // [(UIScrollView *)sv setContentInsetAdjustmentBehavior:UIScrollViewContentInsetAdjustmentAutomatic];
        }
    }
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardDidHide:) name:UIKeyboardDidHideNotification object:nil];

    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardDidShow:) name:UIKeyboardDidShowNotification object:nil];

    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillHide:) name:UIKeyboardWillHideNotification object:nil];

    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillShow:) name:UIKeyboardWillShowNotification object:nil];

    inputView = [[BABFrameObservingInputAccessoryView alloc] initWithFrame:CGRectMake(0, 0, self.view.frame.size.width, keyboardTriggerOffset)];
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

    inputView.inputAcessoryViewFrameChangedBlock = ^(CGRect inputAccessoryViewFrame){
        
        CGFloat value = CGRectGetHeight(self.view.frame) - CGRectGetMinY(inputAccessoryViewFrame);
            
        [self updateKeyboardPanningViews:inputAccessoryViewFrame withScrollView:(UIScrollView *)sv withBottomValue:value];
            
        lastInputAccessoryViewFrame = inputAccessoryViewFrame;
    };
    
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context {
    
    if (object == toolbarView && ([keyPath isEqualToString:@"bounds"]) && context == ToolbarFrameObservingContext){
        
        float newHeight = initialKeyboardTriggerOffset + (toolbarView.frame.size.height - initalToolbarViewFrame.size.height);

        if (inputViewFrame.size.height != newHeight) {
            manualKeyboardResize = true;
            inputViewFrame.size.height = newHeight;
            inputView.frame = inputViewFrame;
            //NSLog ( @" inputViewFrame.size.height: %f", newHeight );
        }
    }
}


- (void)keyboardDidShow:(NSNotification *)notification
{
    keyboardVisible = true;
    keyboardwillHide = false;
}

- (void)keyboardDidHide:(NSNotification *)notification
{
    keyboardVisible = false;
    keyboardwillHide = false;
}

- (void)keyboardWillShow:(NSNotification *)notification
{
    CGRect keyboardEndFrameWindow;
    [[notification.userInfo valueForKey:UIKeyboardFrameEndUserInfoKey] getValue: &keyboardEndFrameWindow];
    
    keyboardwillHide = false;

    [[notification.userInfo valueForKey:UIKeyboardAnimationCurveUserInfoKey] getValue:&animationCurve];

    [[notification.userInfo valueForKey:UIKeyboardAnimationDurationUserInfoKey] getValue:&keyboardTransitionDuration];
    
    [self fireEventForKeyboardFrameInView:keyboardEndFrameWindow visible:true];

    lastShiftValue = 0;
}

- (void)keyboardWillHide:(NSNotification *)notification
{
    keyboardwillHide = true;
    CGRect keyboardEndFrameWindow;
    [[notification.userInfo valueForKey:UIKeyboardFrameEndUserInfoKey] getValue: &keyboardEndFrameWindow];

    [[notification.userInfo valueForKey:UIKeyboardAnimationCurveUserInfoKey] getValue:&animationCurve];

    [[notification.userInfo valueForKey:UIKeyboardAnimationDurationUserInfoKey] getValue:&keyboardTransitionDuration];
    
    [self fireEventForKeyboardFrameInView:keyboardEndFrameWindow visible:false];

}



- (void)teardownKeyboardPanning
{
    panningSet = false;
    [toolbarView removeObserver:self forKeyPath:@"bounds" context:ToolbarFrameObservingContext];

    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIKeyboardWillHideNotification object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIKeyboardWillShowNotification object:nil];

    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIKeyboardDidHideNotification object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIKeyboardDidShowNotification object:nil];
    safeAreaValue = nil;
    keyboardVisible = false;
    lastShiftValue = 0;
    lastY = 0;
    lastKeyboardHeight = 0;
    maxKeyBoardHeight = 0;
    minKeyBoardHeight = 0;
    inputView = nil;
    inputViewFrame = CGRectZero;
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




- (void)updateKeyboardPanningViews:(CGRect)keyboardFrameInView withScrollView:(UIScrollView*)scrollView withBottomValue:(CGFloat)bottomvalue
{
    float keyboardHeight = keyboardFrameInView.size.height - inputViewFrame.size.height;
    CGRect toolbarViewFrame = toolbarView.frame;
    float keyboardY = keyboardFrameInView.origin.y + inputViewFrame.size.height;

    if (manualKeyboardResize == false){
        
        float height = self.view.frame.size.height;
        
        float shift = (height - keyboardY);
        
        CGPoint initialContentOffset;
        
        if (minKeyBoardHeight == 0){
            minKeyBoardHeight =  (int)keyboardHeight;
        }
                       
        float frameOriginY = toolbarViewFrame.origin.y;
        float SizeY = self.view.frame.size.height - toolbarViewFrame.size.height;
        if (lastY == 0){
            lastY = frameOriginY;
        }
        
        if (lastShiftValue < shift){
            
            if ((shift > [safeAreaValue floatValue]) && (shift > (shift - [safeAreaValue floatValue])) ){
                shift = (shift + initialKeyboardTriggerOffset);
                
            }
            
            else if ((shift > [safeAreaValue intValue]) && (shift <= (shift - [safeAreaValue floatValue])) ){
                //shift = [value floatValue];
                //   NSLog ( @"#### FINAL shift - value: %i", (shift - [value floatValue]));
                //NSLog ( @"++++ FINAL shift: %f", shift);
            }
            
            else {
                if (shift > 0.0){
                    //                                    if (shift > [value intValue]){
                    
                }
                else {
                    shift = 0.0;
                }
            }
            
            
            // lastShiftValue = shift;
            
        }
        
        else {
            
            if (shift > [safeAreaValue floatValue]){
                
               
                shift = (shift + initialKeyboardTriggerOffset);

                // shift = (shift - [value floatValue]);
            }
            else {
                if (shift > 0.0){
                    shift = (shift + initialKeyboardTriggerOffset);
                }
                else {
                    shift = (initialKeyboardTriggerOffset + shift);
                    //shift = 0.0;
                    //keyboardwillHide = true;
                }
            }
        }
        
        if (lastShiftValue != shift){

            if ((shift >= 0) && (frameOriginY < height)){
                
                initialContentOffset = scrollView.contentOffset;
                
                if (keyboardHeight > minKeyBoardHeight){
                    maxKeyBoardHeight = (int)keyboardHeight;
                }
                
                if (keyboardHeight == minKeyBoardHeight && lastKeyboardHeight > 0 && lastKeyboardHeight == maxKeyBoardHeight && maxKeyBoardHeight > 0){
                    [UIView setAnimationsEnabled:NO];
                }
                else if (keyboardHeight == maxKeyBoardHeight && lastKeyboardHeight > 0 && maxKeyBoardHeight > minKeyBoardHeight && lastKeyboardHeight == minKeyBoardHeight){
                    [UIView setAnimationsEnabled:NO];
                }
                
                float bottomInset = shift + toolbarViewFrame.size.height - [safeAreaValue floatValue];
                
                [scrollView setContentInset:UIEdgeInsetsMake(scrollView.contentInset.top, 0, bottomInset, 0)];
                
                UIEdgeInsets indicatorInsets = scrollView.verticalScrollIndicatorInsets;
                
                indicatorInsets.bottom = bottomInset;
                
                scrollView.verticalScrollIndicatorInsets = indicatorInsets;
                
                [self replaceValue:[NSNumber numberWithFloat:bottomInset]
                            forKey:@"lastInsetBottom"
                      notification:NO];
                
                if (manualKeyboardResize == false){
                    
                   
                    CGAffineTransform transform = CGAffineTransformMakeTranslation(0.0f, -(shift));
                    Ti2DMatrix * matrix = [[Ti2DMatrix alloc] initWithMatrix:transform];
                    
                    if (keyboardVisible == false){
                        [toolbarViewProxy replaceValue:[NSNumber numberWithInt:(7 << 16)] forKey:@"curve" notification:YES];
                        [toolbarViewProxy replaceValue:[NSNumber numberWithFloat:250] forKey:@"duration" notification:YES];
                        [toolbarViewProxy replaceValue:matrix forKey:@"transform" notification:YES];
                        [toolbarView setTransform_:matrix];

                        keyboardVisible = true;
                    }
                    else {
                        if (keyboardwillHide == true){
                            [toolbarViewProxy replaceValue:[NSNumber numberWithInt:(7 << 16)] forKey:@"curve" notification:YES];

                            [toolbarViewProxy replaceValue:[NSNumber numberWithDouble:keyboardTransitionDuration] forKey:@"duration" notification:YES];
                            [toolbarViewProxy replaceValue:matrix forKey:@"transform" notification:YES];
                            [toolbarView setTransform_:matrix];

                        }
                        else {
                                                       
                            [toolbarViewProxy replaceValue:[NSNumber numberWithInt:(3 << 16)] forKey:@"curve" notification:YES];
                             [toolbarViewProxy replaceValue:0 forKey:@"duration" notification:YES];
                             [toolbarViewProxy replaceValue:matrix forKey:@"transform" notification:YES];
                             [toolbarView setTransform_:matrix];
                        }
                    }
                }
                else {
                    manualKeyboardResize = false;
                    [UIView setAnimationsEnabled:YES];
                }
                
                CGFloat tabBarY = toolbarViewFrame.origin.y;
               
                if (keyboardY < (tabBarY + toolbarViewFrame.size.height - [safeAreaValue floatValue])) {
                    
                    CGFloat offsetY = (tabBarY - keyboardY);
                    
                    CGPoint offset = CGPointMake(0, initialContentOffset.y + offsetY+toolbarViewFrame.size.height+keyboardTriggerOffset);
                    
                    [self replaceValue:[NSNumber numberWithFloat:initialContentOffset.y + offsetY+toolbarViewFrame.size.height+keyboardTriggerOffset]
                                forKey:@"lastOffset"
                          notification:NO];
                    
                    scrollView.contentOffset = offset;
                    [UIView setAnimationsEnabled:YES];
                    //NSLog ( @"contentOffset %f: ",offset.y);
                }
                else {
                    if (lastKeyboardHeight != keyboardHeight){
                        CGFloat offsetY = (tabBarY - keyboardY);
                        
                        CGPoint offset = CGPointMake(0, initialContentOffset.y + offsetY+toolbarViewFrame.size.height+keyboardTriggerOffset);
                        
                        [self replaceValue:[NSNumber numberWithFloat:initialContentOffset.y + offsetY+toolbarViewFrame.size.height+keyboardTriggerOffset]
                                    forKey:@"lastOffset"
                              notification:NO];
                        
                        scrollView.contentOffset = offset;
                        [UIView setAnimationsEnabled:YES];
                        //NSLog ( @"contentOffset %f: ",offset.y);
                    }
                    else {
                        [UIView setAnimationsEnabled:YES];
                    }
                }
                
                lastShiftValue = shift;
            }
            else {
                               
                keyboardVisible = false;
                initialContentOffset = scrollView.contentOffset;
                
                CGAffineTransform transform = CGAffineTransformMakeTranslation(0.0f, -(initialBottomValue));
                Ti2DMatrix * matrix = [[Ti2DMatrix alloc] initWithMatrix:transform];
                [toolbarViewProxy replaceValue:[NSNumber numberWithInt:(7 << 16)] forKey:@"curve" notification:YES];
                [toolbarViewProxy replaceValue:[NSNumber numberWithDouble:keyboardTransitionDuration] forKey:@"duration" notification:YES];
                [toolbarViewProxy replaceValue:matrix forKey:@"transform" notification:YES];
                [toolbarView setTransform_:matrix];
                
                float bottomInset = initialBottomValue + toolbarViewFrame.size.height - [safeAreaValue floatValue];
               
                [scrollView setContentInset:UIEdgeInsetsMake(scrollView.contentInset.top, 0, bottomInset, 0)];
                
                UIEdgeInsets indicatorInsets = scrollView.verticalScrollIndicatorInsets;
                
                indicatorInsets.bottom = bottomInset;
                
                scrollView.verticalScrollIndicatorInsets = indicatorInsets;
                
                [self replaceValue:[NSNumber numberWithFloat:bottomInset]
                            forKey:@"lastInsetBottom"
                      notification:NO];
                CGFloat tabBarY = toolbarViewFrame.origin.y;

                if (keyboardY < (tabBarY + toolbarViewFrame.size.height - [safeAreaValue floatValue])) {
                    CGFloat offsetY = (tabBarY - keyboardY);
                    CGPoint offset = CGPointMake(0, initialContentOffset.y + offsetY+toolbarViewFrame.size.height+keyboardTriggerOffset);
                    
                    [self replaceValue:[NSNumber numberWithFloat:initialContentOffset.y + offsetY+toolbarViewFrame.size.height+keyboardTriggerOffset]
                                forKey:@"lastOffset"
                          notification:NO];
                    
                    scrollView.contentOffset = offset;
                    [UIView setAnimationsEnabled:YES];
                }
            }
        }
        else {
            [UIView setAnimationsEnabled:YES];
        }
    }
    else {
        
       
        initialContentOffset = scrollView.contentOffset;

        float bottomInset = keyboardHeight + inputViewFrame.size.height - [safeAreaValue floatValue];
       
        [scrollView setContentInset:UIEdgeInsetsMake(scrollView.contentInset.top, 0, bottomInset, 0)];
        
        UIEdgeInsets indicatorInsets = scrollView.verticalScrollIndicatorInsets;
        
        indicatorInsets.bottom = bottomInset;
        
        scrollView.verticalScrollIndicatorInsets = indicatorInsets;
        
        [self replaceValue:[NSNumber numberWithFloat:bottomInset]
                    forKey:@"lastInsetBottom"
              notification:NO];
        
        
        CGSize svContentSize = scrollView.contentSize;
        CGSize svBoundSize = scrollView.bounds.size;
        CGFloat svBottomInsets = scrollView.contentInset.bottom;
        CGFloat bottomHeight = svContentSize.height - svBoundSize.height + svBottomInsets + [safeAreaValue floatValue];
        CGFloat bottomWidth = svContentSize.width - svBoundSize.width;

        CGPoint newOffset = CGPointMake(bottomWidth, bottomHeight);

        scrollView.contentOffset = newOffset;

        [self replaceValue:[NSNumber numberWithFloat:newOffset.y]
                    forKey:@"lastOffset"
              notification:NO];
        
        [UIView setAnimationsEnabled:YES];
        manualKeyboardResize = false;
    }
    lastKeyboardHeight = (int)keyboardHeight;
}


- (void)setKeyboardTriggerOffset:(id)args
{
   float offset = [TiUtils floatValue:args def:0.0f];
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
    if (keyboardPanningOn == NO){
        [self teardownKeyboardPanning];
    }
    else {
        [self initPanning];
    }
}


@end
