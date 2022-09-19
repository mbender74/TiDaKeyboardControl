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

#import "TiKeyboardControlViewProxy.h"
#import "DeMarcbenderKeyboardcontrolModule.h"
#import "TiUITabGroupProxy.h"
#import "TiUITabGroup.h"

//#import "DAKeyboardControl.h"
#import "TiBase.h"
#import "TiHost.h"
#import "TiComplexValue.h"
#import "Ti2DMatrix.h"
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
        self.manualPanning = false;
        stop = false;
        toolbarInputViewDiff = 0;
        isNavigationWindowBottomDiff = 0;
        altAddPixel = 0;
        addPixel = 0;
        altAddPixelSet = false;
        addPixelSet = false;
        autoSizeAndKeepScrollingViewAboveToolbar = false;
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
        return [self listSubviewsOfView:proxyView];
    }
    else {
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
    initalToolbarViewFrame = CGRectZero;
    windowRect = self.view.window.frame;
    windowHeight = windowRect.size.height;
    isTabGroup = false;
    isNavigationWindow = false;
    self.alreadyAnimating = false;
    self.manualPanning = false;
    UIWindow *window = UIApplication.sharedApplication.windows.firstObject;
    topPadding = window.safeAreaInsets.top;
    bottomPadding = window.safeAreaInsets.bottom;
    safeAreaValue = bottomPadding;




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
        
        
        if (ignoreExtendSafeArea == true){
            safeAreaValue = 0;
            //tabgroupHeight = bottomPadding;
            tabgroupHeight = (tabBar.frame.size.height);
            //////NSLog ( @" tabBar.frame.size.height %f ",tabBar.frame.size.height);
            extendSafeArea = false;
        }
        else {
            safeAreaValue = 0;
            tabgroupHeight = (tabBar.frame.size.height);
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
                tabgroupHeight = (tabBar.frame.size.height);
                
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
    __weak TiKeyboardControlViewProxy *weakSelf = self;

    inputView.inputAcessoryViewFrameChangedBlock = ^(CGRect inputAccessoryViewFrame){

        
       // CGFloat value = CGRectGetHeight(weakSelf.view.frame) - CGRectGetMinY(inputAccessoryViewFrame) - CGRectGetHeight(weakSelf.textField.inputAccessoryView.frame);
        
        
        

        CGFloat value = (CGRectGetHeight(weakSelf.view.frame) - CGRectGetMinY(inputAccessoryViewFrame));

        
       // weakSelf.toolbarContainerVerticalSpacingConstraint.constant = MAX(0, value);
        
       // [weakSelf.view layoutIfNeeded];

        
            self->lastInputAccessoryViewFrame = inputAccessoryViewFrame;

            [weakSelf updateKeyboardPanningViews:inputAccessoryViewFrame withScrollView:contentScrollView withBottomValue:value];

    };



    if ((isNavigationWindow == false && isTabGroup == false) && autoScrollToBottomDone == false && (autoScrollToBottom == true || autoScrollToBottom == false)){

        autoScrollToBottomDone = true;

        CGFloat toolbarDiff = (toolbarResizeDiff + bottomPadding);

        
        
       
        if(extendSafeArea == true){

            CGFloat value = 0;
            if (ignoreExtendSafeArea == false){
                value = safeAreaValue;
            }

            CGAffineTransform transform = CGAffineTransformMakeTranslation(0.0f, -(value));
            Ti2DMatrix * matrix = [[Ti2DMatrix alloc] initWithMatrix:transform];

            [toolbarViewProxy replaceValue:[NSNumber numberWithInt:(7 << 16)] forKey:@"curve" notification:YES];
            [toolbarViewProxy replaceValue:[NSNumber numberWithFloat:1] forKey:@"duration" notification:YES];
            [toolbarViewProxy replaceValue:matrix forKey:@"transform" notification:YES];
            [toolbarview setTransform_:matrix];

        }
        
        if (self->autoAdjustBottomPadding == true && self->autoSizeAndKeepScrollingViewAboveToolbar == false){

            CGFloat svBottomInsets = contentScrollView.contentInset.bottom + toolbarview.frame.size.height;

            if (self->extendSafeArea == true && self->ignoreExtendSafeArea == true){
                svBottomInsets = svBottomInsets - toolbarDiff;
            }
            else if (self->extendSafeArea == true && self->ignoreExtendSafeArea == false){
                svBottomInsets = svBottomInsets - bottomPadding;
//                svBottomInsets = svBottomInsets - toolbarDiff - (toolbarview.frame.size.height - bottomPadding);

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

   

    
    
    if([keyPath isEqualToString:@"bounds"] && object == toolbarview) {
        CGRect toolbarviewFrame = [[object valueForKeyPath:keyPath] CGRectValue];
        //CGFloat newHeight = (initialKeyboardTriggerOffset + (toolbarviewFrame.size.height - initalToolbarViewFrame.size.height));
        
        CGFloat newHeight = toolbarviewFrame.size.height;

        if (initialLastInputViewFrameHeight == 0){
            initialLastInputViewFrameHeight = newHeight;
        }
        
        if (isTabGroup == false){
            if (extendSafeArea == true && ignoreExtendSafeArea == true){
                    newHeight = newHeight - bottomPadding;
            }
        }
        
        if (lastInputViewFrameHeight != newHeight) {
            manualKeyboardResize = true;

            toolbarResizeDiff = (toolbarviewFrame.size.height - initialKeyboardTriggerOffset);

            lastInputViewFrameHeight = newHeight;
            inputViewFrame.size.height = newHeight;

            inputView.frame = inputViewFrame;
        }
    }


    else if([keyPath isEqualToString:@"bounds"] && object == proxyView) {


        if (initalScrollingViewHeight != proxyView.frame.size.height){

            if ((isNavigationWindow == true || isTabGroup == true) && autoScrollToBottomDone == false && autoScrollToBottom == true && initalScrollingViewHeight > 0){
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
                
                //[self runAfterDelay:0.1 block:^{
              //  dispatch_async(dispatch_get_main_queue(), ^{
                    CGSize svContentSize = contentSize;
                    CGSize svBoundSize = self->nativeScrollView.frame.size;
                    CGFloat svBottomInsets = self->nativeScrollView.contentInset.bottom;
                    CGFloat bottomHeight = svContentSize.height - svBoundSize.height + svBottomInsets + self->bottomPadding;
                    CGFloat bottomWidth = svContentSize.width - svBoundSize.width;
                    CGPoint newOffset = CGPointMake(bottomWidth, bottomHeight);
                    self->nativeScrollView.contentOffset = newOffset;
              //  });
                
               // }];
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

    if (isNavigationWindow == false){
//        lastShiftValue = 0;
    }
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
    CGFloat keyboardHeight = (keyboardFrameInView.size.height - inputViewFrame.size.height);
    CGRect toolbarViewFrame = toolbarview.frame;
    CGFloat keyboardY = (keyboardFrameInView.origin.y + inputViewFrame.size.height);
    CGFloat toolbarDiff = (toolbarResizeDiff + bottomPadding);
    CGFloat innerLastKeyboardHeight = lastKeyboardHeight;
    CGFloat diff = inputView.frame.size.height - toolbarview.frame.size.height;
    CGFloat superframe = [inputView inputAcesssorySuperviewFrame].size.height;
    CGFloat diff2 = superframe - toolbarview.frame.size.height;
    CGFloat stopValue = -1;
    CGFloat correctedShift = 0;
    BOOL animationC = false;
    CGFloat substract = (diff2 - bottomvalue - safeAreaValue);
    
    CGFloat height = 0;
    height = self.view.frame.size.height;

    if (addPixelSet == false){
        addPixelSet = true;
        addPixel =  (bottomPadding - (tabgroupHeight-bottomPadding)) -  (tabgroupHeight-bottomPadding);
        if (isNavigationWindow == true){
            isNavigationWindowBottomDiff =  ((tabgroupHeight + addPixel) -  ( (tabgroupHeight-bottomPadding) - bottomPadding)) + 1;
        }
    }
    
    
    if (keyboardVisible == false){
        manualKeyboardResize = false;
    }


    if (manualKeyboardResize == false){

        if (toolbarInputViewDiff == 0 && bottomvalue > 0){
            toolbarInputViewDiff = substract;
            insetBottomCorrection = toolbarInputViewDiff + toolbarResizeDiff;
        }
        CGFloat shift = bottomvalue + bottomPadding;
        
        //////NSLog ( @"++++ INIT bottomvalue shift  (height - keyboardY) + toolbarInputViewDiff: %f  %f  %f ",bottomvalue,shift,(height - keyboardY) + toolbarInputViewDiff);

        
        ////NSLog ( @"++++ tabgroupHeight: %f ",tabgroupHeight);
        ////NSLog ( @"++++ (tabgroupHeight-bottomPadding): %f ",(tabgroupHeight-bottomPadding));

        
        
        if (tabgroupHeight > 0){

            if (isNavigationWindow == true){
                shift = (shift + tabgroupHeight);
            }
        }
        
       // NSLog ( @"++++ AFTER INIT bottomvalue shift: %f  %f ",bottomvalue,shift);

        
       
        
        if (altAddPixelSet == false && isTabGroup == false){
            if (((shift - keyboardHeight) - (toolbarview.frame.size.height - self->initialKeyboardTriggerOffset)) > 0){
                altAddPixelSet = true;
                altAddPixel = ((shift - keyboardHeight) - (toolbarview.frame.size.height - self->initialKeyboardTriggerOffset));
                
              //  NSLog ( @"++++ altAddPixel   initialLastInputViewFrameHeight  : %f  %f ",altAddPixel,self->initialLastInputViewFrameHeight);

                
                if (altAddPixel > (self->initialLastInputViewFrameHeight+1)) {
                 //   NSLog ( @"++++ altAddPixe > ");

                    altAddPixel = 0;
                }
            }
        }
        
        
        
      //  NSLog ( @"++++ altAddPixel: %f ",altAddPixel);

        
        

        //NSLog ( @"++++ addPixel: %f ",addPixel);
        //NSLog ( @"++++ isNavigationWindowBottomDiff: %f ",isNavigationWindowBottomDiff);

            
        //if (extendSafeArea == true && ignoreExtendSafeArea == false){
        if (isTabGroup == true) {
            
            if (isNavigationWindow == true){

                
                //////NSLog ( @"++++ bottomvalue tabgroupHeight (toolbarview.frame.size.height - initialKeyboardTriggerOffset) shift: %f  %f  %f  %f ",bottomvalue,tabgroupHeight,(toolbarview.frame.size.height - self->initialKeyboardTriggerOffset),shift);

               // shift = bottomvalue + tabgroupHeight - (toolbarview.frame.size.height - self->initialKeyboardTriggerOffset);

                
                
                
                
                    shift = bottomvalue + tabgroupHeight - (toolbarview.frame.size.height - self->initialKeyboardTriggerOffset) - bottomPadding - (((tabgroupHeight-bottomPadding) - bottomPadding) - bottomPadding) + isNavigationWindowBottomDiff;
                
                //////NSLog ( @"++++ AFTER bottomvalue tabgroupHeight (toolbarview.frame.size.height - initialKeyboardTriggerOffset) shift: %f  %f  %f  %f ",bottomvalue,tabgroupHeight,(toolbarview.frame.size.height-self->initialKeyboardTriggerOffset),shift);

            }
            else {
                
                //////NSLog ( @"++++ bottomvalue tabgroupHeight (toolbarview.frame.size.height - initialKeyboardTriggerOffset) shift: %f  %f  %f  %f ",bottomvalue,tabgroupHeight,(toolbarview.frame.size.height - self->initialKeyboardTriggerOffset),shift);

                
                
                //////NSLog ( @"++++ addPixel: %f ",addPixel);

                
                shift = bottomvalue + tabgroupHeight - (toolbarview.frame.size.height - self->initialKeyboardTriggerOffset) - (tabgroupHeight-bottomPadding) - addPixel;

                
                
                
                //////NSLog ( @"++++ AFTER bottomvalue tabgroupHeight (toolbarview.frame.size.height - initialKeyboardTriggerOffset) shift: %f  %f  %f  %f ",bottomvalue,tabgroupHeight,(toolbarview.frame.size.height-self->initialKeyboardTriggerOffset),shift);

                
               // shift = bottomvalue + tabgroupHeight - (tabgroupHeight-bottomPadding) - toolbarResizeDiff + correctingToolbarDiff;
            }
        }
        else {
          //  NSLog ( @"++++ toolbarResizeDiff (toolbarview.frame.size.height - self->initialKeyboardTriggerOffset): %f %f",toolbarResizeDiff, (toolbarview.frame.size.height - self->initialKeyboardTriggerOffset));

            if (extendSafeArea == true && ignoreExtendSafeArea == true){
                shift = bottomvalue - toolbarResizeDiff;
            }
            else if (extendSafeArea == true && ignoreExtendSafeArea == false){
                shift = bottomvalue - toolbarResizeDiff + bottomPadding;
            }
            else {
                shift = bottomvalue - toolbarResizeDiff;
            }
            
            
            
            
            if (altAddPixel > 0){
                shift = shift - altAddPixel;
            }
            
          //
           // NSLog ( @"++++ altAddPixel: %f ",altAddPixel);
            
          //  NSLog ( @"++++ AFTER altAddPixel shift: %f ",shift);

            
        }



       // NSLog ( @"++++ updateKeyboardPanningViews lastShiftValue shift: %f %f",lastShiftValue, shift);



        if (minKeyBoardHeight == 0){
            minKeyBoardHeight =  (int)(keyboardHeight);
        }

        CGFloat frameOriginY = toolbarViewFrame.origin.y;
        // ////////NSLog ( @"++++ frameOriginY: %f ",frameOriginY);



        CGFloat SizeY = self.view.frame.size.height - toolbarViewFrame.size.height;
        if (lastY == 0){
            lastY = frameOriginY;
        }

        //////////////NSLog ( @"++++ frameOriginY  height  safeAreaValue  self.view.frame.origin.y: %f  %f  %f  %f ",frameOriginY, height, safeAreaValue,self.view.frame.origin.y);



        if (lastShiftValue < shift){


            if ((shift > safeAreaValue) && (shift > (shift - safeAreaValue)) ){

            }

            else if ((shift > safeAreaValue) && (shift <= (shift - safeAreaValue)) ){

            }

            else {
                if (shift > safeAreaValue) {

                }
                else {
                    shift = safeAreaValue;

                }
            }
            shift = (shift);
        }

        else {
            if ((shift > safeAreaValue) && (shift > (shift - safeAreaValue)) ){

            }

            else if ((shift > safeAreaValue) && (shift <= (shift - safeAreaValue)) ){

            }

            else {
                if (shift > safeAreaValue) {

                }
                else {
                    shift = safeAreaValue;

                }
            }
            shift = (shift);
        }

        if (lastShiftValue != shift){


            //////////NSLog ( @" **********************  lastShiftValue != shift  %f   %f:",lastShiftValue,shift);


            shift = (shift);


            if ((shift >= safeAreaValue) && (frameOriginY < height)){


              //  NSLog ( @"+++++++++++++++++++++++++++++ AA ");


                ////////NSLog ( @"+++++++++++++++++++++++ (shift >= 0) && (frameOriginY < height)");


                initialContentOffset = scrollView.contentOffset;

                if (keyboardHeight > minKeyBoardHeight){
                    maxKeyBoardHeight = (int)keyboardHeight;
                }

                if (keyboardHeight == minKeyBoardHeight && lastKeyboardHeight > 0 && lastKeyboardHeight == maxKeyBoardHeight && maxKeyBoardHeight > 0){
                     //[UIView setAnimationsEnabled:NO];
                }
                else if (keyboardHeight == maxKeyBoardHeight && lastKeyboardHeight > 0 && maxKeyBoardHeight > minKeyBoardHeight && lastKeyboardHeight == minKeyBoardHeight){
                     //[UIView setAnimationsEnabled:NO];
                }

                CGFloat bottomInset = shift + toolbarViewFrame.size.height;
                //CGFloat bottomInset = shift + keyboardHeight + inputViewFrame.size.height - tabgroupHeight;


                ////////NSLog ( @"+++++++++++++++++++++++++++++ AA bottomInset %f: ",bottomInset);



                if (self->extendSafeArea == true && self->ignoreExtendSafeArea == true){
                        bottomInset = bottomInset - toolbarDiff;
                }
                
                /*
                else {
                    if (isTabGroup == true) {
                      //  bottomInset = bottomInset + tabgroupHeight;
                        
                        
                       ////////NSLog ( @"+++++++++++++++++++++++++++++ bottomInset %f: ",bottomInset);

                        
                    }
                    else {
                        if (self->ignoreExtendSafeArea == false) {
                            bottomInset = bottomInset - bottomPadding;
                        }
                    }
                }
                 */


                if (manualKeyboardResize == false && self.manualPanning == false) {
                    CGAffineTransform transform = CGAffineTransformMakeTranslation(0.0f, -(shift));
                    Ti2DMatrix * matrix = [[Ti2DMatrix alloc] initWithMatrix:transform];

                    [toolbarViewProxy replaceValue:[NSNumber numberWithInt:(7 << 16)] forKey:@"curve" notification:YES];
                    [toolbarViewProxy replaceValue:[NSNumber numberWithDouble:keyboardTransitionDuration]  forKey:@"duration" notification:YES];
                    [toolbarViewProxy replaceValue:matrix forKey:@"transform" notification:YES];
                    [toolbarview setTransform_:matrix];
                }
                else if (manualKeyboardResize == false && self.manualPanning == true) {

                    CGAffineTransform transform = CGAffineTransformMakeTranslation(0.0f, -(shift));
                    Ti2DMatrix * matrix = [[Ti2DMatrix alloc] initWithMatrix:transform];

                    [toolbarViewProxy replaceValue:[NSNumber numberWithInt:(7 << 16)] forKey:@"curve" notification:YES];
                    [toolbarViewProxy replaceValue:[NSNumber numberWithInt:0] forKey:@"duration" notification:YES];
                    [toolbarViewProxy replaceValue:matrix forKey:@"transform" notification:YES];
                    [toolbarview setTransform_:matrix];
                }
                else {

                }


                if (keyboardVisible == true){

                    if (autoAdjustBottomPadding == true && autoSizeAndKeepScrollingViewAboveToolbar == false){
                        if (self->extendSafeArea == true && self->ignoreExtendSafeArea == true){
                            [scrollView setContentInset:UIEdgeInsetsMake(scrollView.contentInset.top, 0, (bottomInset + toolbarDiff - self->bottomPadding), 0)];
                            scrollView.scrollIndicatorInsets = scrollView.contentInset;
                        }

                        else if (self->extendSafeArea == true && self->ignoreExtendSafeArea == false){
                            
                            //////NSLog ( @"+++++++++++++++++++++++++++++ extendSafeArea == true  ignoreExtendSafeArea == false %f ",bottomInset);
                            //////NSLog ( @"+++++++++++++++++++++++++++++ AFTER extendSafeArea == true  ignoreExtendSafeArea == false %f ",(bottomInset-self->bottomPadding));

                            
                            [scrollView setContentInset:UIEdgeInsetsMake(scrollView.contentInset.top, 0, (bottomInset - self->bottomPadding), 0)];
                            scrollView.scrollIndicatorInsets = scrollView.contentInset;
                        }



                        else {
                            
                            if (isTabGroup == true) {
                                
                                if (isNavigationWindow == false){
                                    [scrollView setContentInset:UIEdgeInsetsMake(scrollView.contentInset.top, 0, bottomInset, 0)];
                                }
                                else {
                                    [scrollView setContentInset:UIEdgeInsetsMake(scrollView.contentInset.top, 0, bottomInset, 0)];
                                }
                                scrollView.scrollIndicatorInsets = scrollView.contentInset;
                            }
                            else {
                                if (self->ignoreExtendSafeArea == false){
                                    //////NSLog ( @"+++++++++++++++++++++++++++++ ignoreExtendSafeArea == false %f ",bottomInset);

                                    
                                    //////NSLog ( @"+++++++++++++++++++++++++++++ toolbarDiff %f ",toolbarDiff);

                                    
                                    [scrollView setContentInset:UIEdgeInsetsMake(scrollView.contentInset.top, 0, (bottomInset), 0)];
                                    scrollView.scrollIndicatorInsets = scrollView.contentInset;
                                    
                                    //////NSLog ( @"+++++++++++++++++++++++++++++ AFTER ignoreExtendSafeArea == false %f ",(bottomInset + (toolbarDiff - self->bottomPadding)));

                                }
                                else {
                                    //////NSLog ( @"+++++++++++++++++++++++++++++ ignoreExtendSafeArea == true %f ",bottomInset);

                                    
                                    [scrollView setContentInset:UIEdgeInsetsMake(scrollView.contentInset.top, 0, (bottomInset), 0)];
                                    scrollView.scrollIndicatorInsets = scrollView.contentInset;

                                    //////NSLog ( @"+++++++++++++++++++++++++++++ AFTER ignoreExtendSafeArea == true %f ",(bottomInset + (toolbarDiff - self->bottomPadding)));

                                    
                                }

                            }
                            
                        }
                    }
                    
                    if (self.manualPanning == false){
                        
                        if (autoScrollToBottom == true){
                            
                            CGSize svContentSize = scrollView.contentSize;
                            CGSize svBoundSize = scrollView.frame.size;
                            CGFloat svBottomInsets = scrollView.contentInset.bottom;
                            
                            CGFloat bottomHeight = 0;
                            
                            if (autoSizeAndKeepScrollingViewAboveToolbar == true){
                                
                                /*
                                CGRect tableViewFrame = self->proxyView.frame;

                                tableViewFrame.size.height = (keyboardFrameInView.origin.y - self->toolbarInputViewDiff - self->initialKeyboardTriggerOffset);

                                //////NSLog ( @"  ################### tableViewFrame.size.height  ###################  %f ",tableViewFrame.size.height);

                                
                                self->proxyView.frame = tableViewFrame;
                                
                                */
                                
                                
                                    
                                    LayoutConstraint* layoutProperties = [(TiViewProxy *)self->_scrollingView layoutProperties];
                                    layoutProperties->bottom = TiDimensionDip(self->initialScrollingViewBottomValue+self->toolbarview.frame.size.height+ shift);
                                    [(TiViewProxy *)self->_scrollingView refreshView:nil];
                                    
                                    //NSLog ( @"  ################### keyboardvisible manualpanning autoScrollToBottom self->initialScrollingViewBottomValue+self->toolbarview.frame.size.height + shift ###################  %f ",self->initialScrollingViewBottomValue+self->toolbarview.frame.size.height+ shift);
                                
                                
                                
                                svContentSize = scrollView.contentSize;
                                svBoundSize = scrollView.frame.size;
                                svBottomInsets = scrollView.contentInset.bottom;
                                
                                bottomHeight = 0;

                                
                                    bottomHeight = svContentSize.height - svBoundSize.height + svBottomInsets;
                            }
                            else {
                                    bottomHeight = svContentSize.height - svBoundSize.height + svBottomInsets + tabgroupHeight;
                            }
                            
                            CGFloat bottomWidth = (svContentSize.width - svBoundSize.width);
                            bottomHeight = (bottomHeight);
                            
                            
                            if (self->extendSafeArea == true && self->ignoreExtendSafeArea == true){
                                //bottomHeight = bottomHeight + toolbarDiff;
                            }
                            
                            ////NSLog ( @"+++++++++++++++++++++++++++++ contentOffset ");

                            //CGPoint newOffset = CGPointMake(bottomWidth, bottomHeight);
                            
                            //scrollView.contentOffset = newOffset;
                            
                        }
                        else {
                            if (autoSizeAndKeepScrollingViewAboveToolbar == true){
                                
                                CGSize svContentSize = scrollView.contentSize;
                                CGSize svBoundSize = scrollView.frame.size;
                                CGFloat svBottomInsets = scrollView.contentInset.bottom;
                                
                                CGFloat bottomHeight = 0;

                                /*
                                CGRect tableViewFrame = self->proxyView.frame;

                                tableViewFrame.size.height = (keyboardFrameInView.origin.y - self->toolbarInputViewDiff - self->initialKeyboardTriggerOffset);

                                //NSLog ( @"  ################### keyboardVisible tableViewFrame.size.height  ###################  %f ",tableViewFrame.size.height);

                                
                                self->proxyView.frame = tableViewFrame;
                                */
                                
                                
                                LayoutConstraint* layoutProperties = [(TiViewProxy *)self->_scrollingView layoutProperties];
                                layoutProperties->bottom = TiDimensionDip(self->initialScrollingViewBottomValue+self->toolbarview.frame.size.height);
                                [(TiViewProxy *)self->_scrollingView refreshView:nil];

                                //NSLog ( @"  ################### keyboardvisible self->initialScrollingViewBottomValue+self->toolbarview.frame.size.height  ###################  %f ",self->initialScrollingViewBottomValue+self->toolbarview.frame.size.height);

                                
                                svContentSize = scrollView.contentSize;
                                svBoundSize = scrollView.frame.size;
                                svBottomInsets = scrollView.contentInset.bottom;
                                
                                bottomHeight = 0;

                                
                                    bottomHeight = svContentSize.height - svBoundSize.height + svBottomInsets;
                            }
                        }
                    }
                    else {
                        if (autoSizeAndKeepScrollingViewAboveToolbar == true){
                            [UIView performWithoutAnimation:^{
                                
                                LayoutConstraint* layoutProperties = [(TiViewProxy *)self->_scrollingView layoutProperties];
                                layoutProperties->bottom = TiDimensionDip(self->initialScrollingViewBottomValue+self->toolbarview.frame.size.height+ shift);
                                [(TiViewProxy *)self->_scrollingView refreshView:nil];
                                
                                //NSLog ( @"  ################### keyboardvisible manualpanning self->initialScrollingViewBottomValue+self->toolbarview.frame.size.height + shift ###################  %f ",self->initialScrollingViewBottomValue+self->toolbarview.frame.size.height+ shift);
                            }];
                        }
                    }
                    
                    
                    
                    
                    

                }
                else {
                    if (self.manualPanning == true){
                      if (autoAdjustBottomPadding == true && autoSizeAndKeepScrollingViewAboveToolbar == false){
                        [scrollView setContentInset:UIEdgeInsetsMake(scrollView.contentInset.top, 0, bottomInset, 0)];
                        scrollView.scrollIndicatorInsets = scrollView.contentInset;
                      }
                    }
                    else {

                       // dispatch_async(dispatch_get_main_queue(), ^{
                            CGPoint offset = CGPointMake(0, scrollView.contentOffset.y + shift);

                            if (self->extendSafeArea == true && self->ignoreExtendSafeArea == true){
                               // offset.y = offset.y + toolbarDiff;
                                bottomInset = bottomInset + toolbarDiff - self->bottomPadding;

                            }
                        
                            else if (self->extendSafeArea == true && self->ignoreExtendSafeArea == false){
                                
                                bottomInset = bottomInset - self->bottomPadding;
                            }

                        
                        
                            else {
                                if (isTabGroup == true && isNavigationWindow == false) {
                                    bottomInset = bottomInset;
                                }
                                else {
                                    if (self->ignoreExtendSafeArea == false){
                                        bottomInset = keyboardHeight + inputViewFrame.size.height - tabgroupHeight - insetBottomCorrection - altAddPixel;

                                    }
                                    else {
    //                                    bottomInset = keyboardHeight + inputViewFrame.size.height - tabgroupHeight - insetBottomCorrection;

                                    }

                                }

                            }
                        
                        
                        if (autoSizeAndKeepScrollingViewAboveToolbar == true){
                            

                            /*
                            CGRect tableViewFrame = self->proxyView.frame;

                            tableViewFrame.size.height = (keyboardFrameInView.origin.y - self->toolbarInputViewDiff - self->initialKeyboardTriggerOffset);


                            
                            self->proxyView.frame = tableViewFrame;
                            */
                            
                            if (isNavigationWindow == true){
                                LayoutConstraint* layoutProperties = [(TiViewProxy *)self->_scrollingView layoutProperties];
                                layoutProperties->bottom = TiDimensionDip(self->initialScrollingViewBottomValue+self->toolbarview.frame.size.height+keyboardHeight-tabgroupHeight);
                                [(TiViewProxy *)self->_scrollingView refreshView:nil];
                            }
                            else {
                                LayoutConstraint* layoutProperties = [(TiViewProxy *)self->_scrollingView layoutProperties];
                                layoutProperties->bottom = TiDimensionDip(self->initialScrollingViewBottomValue+self->toolbarview.frame.size.height+keyboardHeight-tabgroupHeight-bottomPadding);
                                [(TiViewProxy *)self->_scrollingView refreshView:nil];
                            }
                            //NSLog ( @"  ################### keyboardVisible FALSE self->initialScrollingViewBottomValue+self->toolbarview.frame.size.height + keyboardHeight ###################  %f ",self->initialScrollingViewBottomValue+self->toolbarview.frame.size.height+keyboardHeight-tabgroupHeight-bottomPadding);

                            
                            
                        }
                        
                        
                        
                        
                            UIEdgeInsets newInsets = UIEdgeInsetsMake(scrollView.contentInset.top, 0, bottomInset, 0);

                            [UIView animateWithDuration:self->keyboardTransitionDuration delay:0.f options:(7 << 16)| UIViewAnimationOptionBeginFromCurrentState animations:^{

                                [scrollView setContentOffset:offset animated:NO];
                                if (self->autoAdjustBottomPadding == true && self->autoSizeAndKeepScrollingViewAboveToolbar == false){
                                  [scrollView setContentInset:newInsets];
                                  [scrollView setVerticalScrollIndicatorInsets:newInsets];
                                }
                                [scrollView layoutIfNeeded];
                            } completion:^(BOOL finished) {
                              if ([self->_scrollingView _hasListeners:@"scrollend"]) {
                                  [self->_scrollingView fireEvent:@"scrollend" withObject:[self eventObjectForScrollView:scrollView]];
                              }
                            }];
                      //  });
                    }
                }
                manualKeyboardResize = false;
                //[UIView setAnimationsEnabled:YES];
            }

            if (shift >= safeAreaValue){
                lastShiftValue = (shift);
            }
            else {
                lastShiftValue = safeAreaValue;
            }
            //////////NSLog ( @"+++++++++++++++++++++++++++++ SET LastShiftValue: %f",lastShiftValue);

          //NSLog ( @"+++++++++++++++++++++++++++++ LastShiftValue  Shift: %f   %f",lastShiftValue,shift);

        }
        else {
          lastShiftValue = (shift);

          //NSLog ( @"+++++++++++++++++++++++++++++ ELSE LastShiftValue  Shift: %f   %f",lastShiftValue,shift);

            //[UIView setAnimationsEnabled:YES];
        }
    }
    else {
        ////NSLog ( @"+++++++++++++++++++++++++++++ MANUAL KEYBOARD  %f : ",lastShiftValue);
        [UIView performWithoutAnimation:^{

          CGFloat bottomInset = 0;
          CGFloat bottomValueScroll = 0;

          if (keyboardHeight <= 0){

              bottomInset = scrollView.contentInset.bottom + toolbarview.frame.size.height;
              bottomValueScroll = toolbarview.frame.size.height + initialScrollingViewBottomValue;

              bottomInset = (bottomInset);
              bottomValueScroll = (bottomValueScroll);

              ////////NSLog ( @" OFFSET D %f:",bottomInset);

          }
          else {
              
              ////NSLog ( @"+++++++++++++++++++++++++++++ BEFORE MANUAL KEYBOARD %f ",bottomInset);


              if (isTabGroup == true) {
                  
                  if (isNavigationWindow == true){
                      //bottomInset = keyboardHeight + inputViewFrame.size.height - insetBottomCorrection + tabgroupHeight - isNavigationWindowBottomDiff;

                      bottomInset = lastShiftValue + toolbarViewFrame.size.height;

                      
                      ////NSLog ( @"+++++++++++++++++++++++++++++ MANUAL KEYBOARD %f ",bottomInset);

                  }
                  else {
                      bottomInset = keyboardHeight + inputViewFrame.size.height - insetBottomCorrection + tabgroupHeight - (tabgroupHeight-bottomPadding) - addPixel;
                  }
              }
              else {
                  
                  
                  if (self->extendSafeArea == true && self->ignoreExtendSafeArea == true){
                      bottomInset = keyboardHeight + inputViewFrame.size.height - tabgroupHeight - insetBottomCorrection - altAddPixel;

                  }
                  else if (self->extendSafeArea == true && self->ignoreExtendSafeArea == false){
                      bottomInset = keyboardHeight + inputViewFrame.size.height - tabgroupHeight - insetBottomCorrection - altAddPixel;
                  }
                  else {
                      bottomInset = keyboardHeight + inputViewFrame.size.height - tabgroupHeight - insetBottomCorrection - altAddPixel;
                  }
                  
              }

              
              
              bottomValueScroll = keyboardHeight + toolbarview.frame.size.height + initialScrollingViewBottomValue - tabgroupHeight;

              
              /*
              if (autoSizeAndKeepScrollingViewAboveToolbar == true && autoAdjustBottomPadding == false){

                  CGRect tableViewFrame = self->proxyView.frame;
                //    tableViewFrame.size.height = keyboardY - self->toolbarview.frame.size.height - initialKeyboardTriggerOffset;
                    
                    
                    
                    //tableViewFrame.size.height = self->inputView.frame.origin.y + self->toolbarInputViewDiff;

                    tableViewFrame.size.height = (keyboardFrameInView.origin.y - self->toolbarInputViewDiff - self->initialKeyboardTriggerOffset) + self->toolbarview.frame.size.height;

                    //NSLog ( @"  ################### tableViewFrame.size.height  ###################  %f ",tableViewFrame.size.height);

                    
                    self->proxyView.frame = tableViewFrame;

              }
              */

              if (autoSizeAndKeepScrollingViewAboveToolbar == true && autoAdjustBottomPadding == false){
                  
                  /*
                  CGRect tableViewFrame = self->proxyView.frame;

                  
                  //NSLog ( @"  ################### tableViewFrame.size.height  ###################  %f ",tableViewFrame.size.height);

                  
//                  tableViewFrame.size.height = (keyboardFrameInView.origin.y - self->toolbarInputViewDiff - self->initialKeyboardTriggerOffset) + self->toolbarview.frame.size.height;

                  
                  tableViewFrame.size.height = tableViewFrame.size.height - self->toolbarview.frame.size.height;

                  
                  //NSLog ( @"  ################### AFTER tableViewFrame.size.height  ###################  %f ",tableViewFrame.size.height);

                  
                  self->proxyView.frame = tableViewFrame;
                    */
                  
                  
                  
                  
                  
                   
                  bottomValueScroll = keyboardHeight + toolbarview.frame.size.height + initialScrollingViewBottomValue - tabgroupHeight;
                  
                  
                  bottomValueScroll = bottomValueScroll - initialKeyboardTriggerOffset;
                  
                  //NSLog ( @"  ################### manual toolbarview.frame.origin.y  ###################  %f ",toolbarview.frame.origin.y);

                  
                  if (isNavigationWindow == true){
                      LayoutConstraint* layoutProperties = [(TiViewProxy *)_scrollingView layoutProperties];
                      layoutProperties->bottom = TiDimensionDip(self->initialScrollingViewBottomValue+self->toolbarview.frame.size.height+keyboardHeight-tabgroupHeight);
                      [(TiViewProxy *)_scrollingView refreshView:nil];
                  }
                  else {
                      LayoutConstraint* layoutProperties = [(TiViewProxy *)_scrollingView layoutProperties];
                      layoutProperties->bottom = TiDimensionDip(self->initialScrollingViewBottomValue+self->toolbarview.frame.size.height+keyboardHeight-tabgroupHeight-bottomPadding);
                      [(TiViewProxy *)_scrollingView refreshView:nil];
                  }
                  
                  
                  //NSLog ( @"  ################### manual tableViewFrame.size.height  ###################  %f ",self->initialScrollingViewBottomValue+self->toolbarview.frame.size.height+keyboardHeight-tabgroupHeight-bottomPadding);


                  
              }
              bottomInset = (bottomInset);
              bottomValueScroll = (bottomValueScroll);

              ////////NSLog ( @" OFFSET E AFTER %f:",bottomInset);
              ////////NSLog ( @" OFFSET E AFTER %f:",bottomValueScroll);

          }


          if (autoAdjustBottomPadding == true && autoSizeAndKeepScrollingViewAboveToolbar == false){

              if (self->extendSafeArea == true && self->ignoreExtendSafeArea == true){
                  //bottomInset = bottomInset - bottomPadding;
              }
              ////NSLog ( @"+++++++++++++++++++++++++++++ MANUAL autoAdjustBottomPadding %f ",bottomInset);


              [scrollView setContentInset:UIEdgeInsetsMake(scrollView.contentInset.top, scrollView.contentInset.left, bottomInset, scrollView.contentInset.right)];


              UIEdgeInsets indicatorInsets = scrollView.verticalScrollIndicatorInsets;

              indicatorInsets.bottom = (bottomInset);

              scrollView.verticalScrollIndicatorInsets = indicatorInsets;
          }


        
          
         



          if (autoScrollToBottom == true){
              ////NSLog ( @"+++++++++++++++++++++++++++++ MANUAL autoScrollToBottom");

              CGSize svContentSize = scrollView.contentSize;
              CGSize svBoundSize = scrollView.frame.size;
              CGFloat svBottomInsets = scrollView.contentInset.bottom;

              CGFloat bottomHeight = 0;

              if (autoSizeAndKeepScrollingViewAboveToolbar == true){
                  if (keyboardHeight <= 0){
                      bottomHeight = svContentSize.height - svBoundSize.height + svBottomInsets;
                  }
                  else {
                      bottomHeight = svContentSize.height - svBoundSize.height + svBottomInsets;

                  }
                  
                  /*
                  CGRect tableViewFrame = self->proxyView.frame;

                  tableViewFrame.size.height = (keyboardFrameInView.origin.y - self->toolbarInputViewDiff - self->initialKeyboardTriggerOffset);

                  //////NSLog ( @"  ################### tableViewFrame.size.height  ###################  %f ",tableViewFrame.size.height);

                  
                  self->proxyView.frame = tableViewFrame;
                   */
                  

              }
              else {
                  if (keyboardHeight <= 0){
                      bottomHeight = svContentSize.height - svBoundSize.height + svBottomInsets + toolbarview.frame.size.height;
                  }
                  else {
                      bottomHeight = svContentSize.height - svBoundSize.height + svBottomInsets + tabgroupHeight;

                  }

              }

              CGFloat bottomWidth = (svContentSize.width - svBoundSize.width);
              bottomHeight = (bottomHeight);


              if (self->extendSafeArea == true && self->ignoreExtendSafeArea == false){
                  bottomHeight = bottomHeight + bottomPadding;
              }


              CGPoint newOffset = CGPointMake(bottomWidth, bottomHeight);

              scrollView.contentOffset = newOffset;
              initialContentOffset = scrollView.contentOffset;

              /*
              if (self->keyboardwillHide == true){

                  if (self->isUItableView == true){
                      [UIView performWithoutAnimation:^{
                          [self->table reloadRowsAtIndexPaths:[self->table  indexPathsForVisibleRows] withRowAnimation:UITableViewRowAnimationNone];
                      }];
                  }


              }
              */
              if ([self->_scrollingView _hasListeners:@"scrollend"]) {
                  [self->_scrollingView fireEvent:@"scrollend" withObject:[self eventObjectForScrollView:scrollView]];
              }

          }





          else {

              ////NSLog ( @"+++++++++++++++++++++++++++++ MANUAL autoScrollToBottom FALSE");


              CGFloat bottomInset = 0;
              CGFloat bottomValueScroll = 0;

              if (keyboardHeight <= 0){

                  bottomInset = scrollView.contentInset.bottom + toolbarview.frame.size.height;
                  bottomValueScroll = toolbarview.frame.size.height + initialScrollingViewBottomValue;

                  bottomInset = (bottomInset);
                  bottomValueScroll = (bottomValueScroll);

              }
              else {

                  bottomInset = keyboardHeight + inputViewFrame.size.height - tabgroupHeight - insetBottomCorrection;
                  bottomValueScroll = keyboardHeight + toolbarview.frame.size.height + initialScrollingViewBottomValue - tabgroupHeight;

                  bottomInset = (bottomInset);
                  bottomValueScroll = (bottomValueScroll);

              }



              if (self->extendSafeArea == true && self->ignoreExtendSafeArea == true){
                  //bottomInset = bottomInset - bottomPadding;
              }


              [scrollView setContentInset:UIEdgeInsetsMake(scrollView.contentInset.top, scrollView.contentInset.left, bottomInset, scrollView.contentInset.right)];


              UIEdgeInsets indicatorInsets = scrollView.verticalScrollIndicatorInsets;

              indicatorInsets.bottom = (bottomInset);

              scrollView.verticalScrollIndicatorInsets = indicatorInsets;




              CGSize svContentSize = scrollView.contentSize;
              CGSize svBoundSize = scrollView.frame.size;
              CGFloat svBottomInsets = scrollView.contentInset.bottom;

              CGFloat bottomHeight = 0;

              if (keyboardHeight <= 0){
                  bottomHeight = svContentSize.height - svBoundSize.height + svBottomInsets + toolbarview.frame.size.height;
              }
              else {
                  bottomHeight = svContentSize.height - svBoundSize.height + svBottomInsets + tabgroupHeight;

              }
              CGFloat bottomWidth = (svContentSize.width - svBoundSize.width);
              bottomHeight = (bottomHeight);


              if (self->extendSafeArea == true && self->ignoreExtendSafeArea == true){
                  //bottomHeight = bottomHeight + toolbarDiff;
              }


              CGPoint newOffset = CGPointMake(bottomWidth, bottomHeight);

              scrollView.contentOffset = newOffset;
              initialContentOffset = scrollView.contentOffset;
              if ([self->_scrollingView _hasListeners:@"scrollend"]) {
                  [self->_scrollingView fireEvent:@"scrollend" withObject:[self eventObjectForScrollView:scrollView]];
              }


          }

      }];

        manualKeyboardResize = false;
    }
    lastKeyboardHeight = (int)(keyboardHeight);
}



- (void)initPaddings
{
    if ([_scrollingView viewReady]) {
        ////////NSLog ( @" initPaddings inputView doConfig " );
        manualKeyboardResize = true;

        [inputView doConfig];
    }
    else {
        //////////////NSLog ( @" initPaddings delayed " );

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
