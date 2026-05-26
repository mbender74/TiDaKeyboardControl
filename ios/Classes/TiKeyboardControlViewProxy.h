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

#import <TitaniumKit/TitaniumKit.h>
#import "DeMarcbenderKeyboardcontrolModule.h"
#import "TiUIScrollViewProxy.h"
#import "TiUITableViewProxy.h"
#import "TiUIListViewProxy.h"
#import "TiViewProxy.h"
#import "TiWindowProxy+Addons.h"
#import "BABFrameObservingInputAccessoryView.h"
#import "TiUIView.h"
#import "TiUITableView.h"


@class TiKeyboardControlViewProxy;

@interface TiKeyboardControlScrollDelegateProxy : NSObject <UIScrollViewDelegate>
@property (nonatomic, weak) id<UIScrollViewDelegate> originalDelegate;
@property (nonatomic, weak) TiKeyboardControlViewProxy *keyboardControlProxy;
@end

@interface TiKeyboardControlView: TiUIView <UIGestureRecognizerDelegate> {
}
@property (nonatomic, strong) UIPanGestureRecognizer *keyboardPanRecognizer;

@end



@interface TiKeyboardControlViewProxy : TiViewProxy {
    CGPoint initialContentOffset;
    BOOL initialContentOffsetValid;
    BOOL isTabGroup;
    BOOL isNavigationWindow;
    BOOL panningSet;
    BOOL manualKeyboardResize;
    BOOL keyboardVisible;
    BOOL keyboardwillHide;
    BOOL keyboardwillShow;
    BOOL keyboardShowing; // YES during keyboardWillShow through keyboardDidShow

    BOOL keyboardVisibleInit;
    BOOL altAddPixelSet;
    BOOL addPixelSet;
    CGFloat isNavigationWindowBottomDiff;
    CGFloat addPixel;
    CGFloat altAddPixel;
    int status;
    CGFloat insetBottomCorrection;
    CGFloat lastShiftValue;
    CGFloat lastY;
    CGFloat initialContentHeight;
    BOOL contentHeightSet;

    int lastKeyboardHeight;
    int maxKeyBoardHeight;
    int minKeyBoardHeight;
    BABFrameObservingInputAccessoryView *inputView;
    CGRect inputViewFrame;
    TiViewProxy * toolbarViewProxy;
    TiUIView * toolbarview;
    UIView * toolbarviewNative;
    UIScrollView * nativeScrollView;

    UITextView *textview;
    UITextField *textField;
    CGFloat lastInputViewFrameHeight;
    CGFloat initialLastInputViewFrameHeight;

    CGFloat lastKeyBoardViewFrameHeight;
    CGRect lastInputAccessoryViewFrame;
    double keyboardTransitionDuration;
    CGFloat keyboardTriggerOffset;
    CGRect initalToolbarViewFrame;
    CGFloat initialKeyboardTriggerOffset;
    CGFloat initialBottomValue;
    CGFloat initialScrollingViewBottomValue;
    CGFloat toolbarInputViewDiff;
    CGFloat toolbarResizeDiff;
    CGFloat lastStopValue;
    CGFloat correctingToolbarDiff;
    CGRect windowRect;
    CGFloat windowHeight;
    CGFloat safeAreaValue;
    BOOL keyboardPanningOn;
    NSInteger animationCurve; // stored as value, not pointer (default: 7 = EaseInOut)
    CGRect initialAccessoryViewFrame; // baseline after keyboardDidShow
    CGFloat initialAccessoryViewFrameYWhenHidden; // accessory view y when keyboard is hidden
    CGFloat lastAccessoryViewHeight; // previous KVO callback height (for resize detection)
    CGFloat settledShift; // shift at last keyboardDidShow (for absolute transform calc)
    BOOL hasSettledShift; // YES once settledShift is valid
    CGFloat tabgroupHeight;
    TiWindowProxy *parentController;
    TiKeyboardControlView *keyboardControlView;
    id<TiEvaluator> viewcontext;
    BOOL isUItableView;
    TiUITableView *tiTableView;
    UITableView *table;
    BOOL stop;
    BOOL autoAdjustBottomPadding;
    BOOL autoScrollToBottom;
    BOOL tinavcontroller;
    BOOL autoScrollToBottomDone;
    BOOL autoScrollToBottomDoneAfterShow; // tracks if we already scrolled after this keyboard show cycle
    BOOL keyboardInsetSettled; // YES after first KVO callback post-keyboard-show; prevents inset drift during animation
    BOOL extendSafeArea;
    BOOL ignoreExtendSafeArea;
    TiUIView * proxyView;
    CGFloat initalScrollingViewHeight;
    CGFloat topPadding;
    CGFloat bottomPadding;
    BOOL autoSizeAndKeepScrollingViewAboveToolbar;
    UIEdgeInsets initialContentInset;
    BOOL showKeyboardOnScrollUp;
    BOOL showKeyboardOnScrollUpTriggered;
    BOOL isDraggingScroll;
    TiKeyboardControlScrollDelegateProxy *scrollDelegateProxy;
    UIWindow *cachedKeyWindow;
    CGFloat cachedStatusBarHeight;
    CGFloat cachedNavigationBarHeight;
}

@property(nonatomic, strong, readwrite) TiViewProxy *textfield;

@property(nonatomic, readwrite) BOOL alreadyAnimating;
@property(nonatomic, readwrite) BOOL manualPanning;
@property(nonatomic, strong, readwrite) TiViewProxy *scrollingView;
@property(nonatomic, strong, readwrite) TiViewProxy *toolbarView;
@property(nonatomic, strong, readwrite) TiViewProxy *parentWindow;
@property (weak, nonatomic) NSLayoutConstraint *toolbarContainerVerticalSpacingConstraint;

/* iOS 13+ Multi-Scene Key Window Resolution — ivars (delegiert an TiKeyboardControlViewProxy+Metrics) */
@property (nonatomic, weak) UIWindow *cachedKeyWindow;
@property (nonatomic, assign) CGFloat cachedStatusBarHeight;
@property (nonatomic, assign) CGFloat cachedNavigationBarHeight;

/* Helper-Methoden (implementiert in TiKeyboardControlViewProxy+Metrics) */
- (UIWindow *)resolveKeyWindow;
- (CGFloat)calculateTabBarHeight;
- (CGFloat)getStatusBarHeight;
- (CGFloat)calculateNavigationBarHeight;

- (void)setKeyboardPanning:(id)args;

/* JavaScript-exposed height queries */
- (void)getHeights:(id)args;
- (void)getStatusBarHeight:(id)args;
- (void)getNavigationBarHeight:(id)args;
- (void)getTabBarHeight:(id)args;

- (TiKeyboardControlView *)getTiKeyboardControlView;
- (void)putTiKeyboardControlView:(TiKeyboardControlView *)view;

/* Internal helpers */
- (BOOL)isOwnFirstResponder;
- (CGFloat)computeToolbarTranslation:(CGRect)inputAccessoryFrame;
- (void)applyToolbarTranslation:(CGFloat)translation animated:(BOOL)animated duration:(NSTimeInterval)duration curve:(NSInteger)curve;
- (void)applyScrollViewInset:(CGRect)inputAccessoryFrame;
- (void)scrollToBottomIfNeeded;
- (void)handleToolbarBoundsChangeToHeight:(CGFloat)newHeight;
- (void)applyAutoSizeBottomConstraintWithTranslation:(CGFloat)translation;
- (void)setShowKeyboardOnScrollUp:(id)args;
- (void)installScrollDelegateProxy;
- (void)uninstallScrollDelegateProxy;
- (void)handleScrollViewWillBeginDragging:(UIScrollView *)scrollView;
- (void)handleScrollViewDidScroll:(UIScrollView *)scrollView;
- (void)handleScrollViewDidEndDragging:(UIScrollView *)scrollView willDecelerate:(BOOL)decelerate;

@end
