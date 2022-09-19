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
    UIViewAnimationCurve *animationCurve;
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
    BOOL extendSafeArea;
    BOOL ignoreExtendSafeArea;
    TiUIView * proxyView;
    CGFloat initalScrollingViewHeight;
    CGFloat topPadding;
    CGFloat bottomPadding;
    BOOL autoSizeAndKeepScrollingViewAboveToolbar;
}

@property(nonatomic, strong, readwrite) TiViewProxy *textfield;

@property(nonatomic, readwrite) BOOL alreadyAnimating;
@property(nonatomic, readwrite) BOOL manualPanning;
@property(nonatomic, strong, readwrite) TiViewProxy *scrollingView;
@property(nonatomic, strong, readwrite) TiViewProxy *toolbarView;
@property(nonatomic, strong, readwrite) TiViewProxy *parentWindow;
@property (weak, nonatomic) NSLayoutConstraint *toolbarContainerVerticalSpacingConstraint;

- (void)setKeyboardPanning:(id)args;
- (TiKeyboardControlView *)getTiKeyboardControlView;
- (void)putTiKeyboardControlView:(TiKeyboardControlView *)view;

@end
