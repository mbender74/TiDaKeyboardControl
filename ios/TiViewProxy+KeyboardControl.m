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

#import "DAKeyboardControl.h"
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

#import <TiUtils.h>
#import <objc/runtime.h>

@implementation TiViewProxy (KeyboardControl)


DEFINE_DEF_PROP(lockedViews, nil);
CGPoint initialContentOffset;
BOOL initialContentOffsetValid;
int status;
int lastShiftValue = 0;
float lastY = 0;
int lastKeyboardHeight = 0;
int maxKeyBoardHeight = 0;
int minKeyBoardHeight = 0;
float nextDirection = 0;

- (void)setKeyboardPanning:(id)args
{
    ENSURE_UI_THREAD(setKeyboardPanning, args);
    
    BOOL oldValue = [self keyboardPanning];
    BOOL newValue = [TiUtils boolValue:args def:NO];
    
    [self replaceValue:[NSNumber numberWithBool:newValue]
                forKey:@"keyboardPanning"
          notification:NO];
    
    if (newValue && !oldValue)
    {
        [self setupKeyboardPanning];
    }
    else if (!newValue && oldValue)
    {
        [self teardownKeyboardPanning];
    }
}


- (BOOL)keyboardPanning
{
    id value = [self valueForUndefinedKey:@"keyboardPanning"];
    
    
    

    if (value == nil || value == [NSNull null] || ![value respondsToSelector:@selector(boolValue)])
    {
        return NO;
    }
    else
    {
        return [value boolValue];
    }
}

- (void)setupKeyboardPanning
{
    
    [self replaceValue:self.view
                forKey:@"keyboardPanningView"
          notification:NO];

    __weak TiViewProxy *weakSelf = self;

//    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillShow:) name:UIKeyboardWillShowNotification object:nil];
//    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillHide:) name:UIKeyboardWillHideNotification object:nil];
    
    [self.view addKeyboardPanningWithActionHandler:^(CGRect keyboardFrameInView, BOOL opening, BOOL closing) {
        [weakSelf fireEventForKeyboardFrameInView:keyboardFrameInView];
        [weakSelf updateKeyboardPanningLockedViews:keyboardFrameInView];
    }];
    
    
//    [self.view addKeyboardPanningWithFrameBasedActionHandler:^(CGRect keyboardFrameInView, BOOL opening, BOOL closing) {
//            /*
//             Try not to call "self" inside this block (retain cycle).
//             But if you do, make sure to remove DAKeyboardControl
//             when you are done with the view controller by calling:
//             [self.view removeKeyboardControl];
//             */
//
////            CGRect toolBarFrame = toolBar.frame;
////            toolBarFrame.origin.y = keyboardFrameInView.origin.y - toolBarFrame.size.height;
////            toolBar.frame = toolBarFrame;
////
////            CGRect tableViewFrame = tableView.frame;
////            tableViewFrame.size.height = toolBarFrame.origin.y;
////            tableView.frame = tableViewFrame;
//
//        [weakSelf fireEventForKeyboardFrameInView:keyboardFrameInView];
//        [weakSelf updateKeyboardPanningLockedViews:keyboardFrameInView];
//
//
//        } constraintBasedActionHandler:nil];
    
    
    
//    [self.view addKeyboardNonpanningWithActionHandler:^(CGRect keyboardFrameInView, BOOL opening, BOOL closing) {
//        [weakSelf fireEventForKeyboardFrameInView:keyboardFrameInView];
//        [weakSelf updateKeyboardPanningLockedViews:keyboardFrameInView];
//    }];
    
}




- (void)teardownKeyboardPanning
{
    TiUIView * panningView = [self valueForKey:@"keyboardPanningView"];
    [panningView removeKeyboardControl];
    
    lastShiftValue = 0;
    lastY = 0;
    lastKeyboardHeight = 0;
    maxKeyBoardHeight = 0;
    minKeyBoardHeight = 0;
    nextDirection = 0;
}




- (void)fireEventForKeyboardFrameInView:(CGRect)keyboardFrameInView
{
    if (![self _hasListeners:@"keyboardchange"]) {
        return;
    }
    
    NSNumber * keyboardWidth = [NSNumber numberWithFloat:keyboardFrameInView.size.width];
    NSNumber * keyboardHeight = [NSNumber numberWithFloat:keyboardFrameInView.size.height];
    NSNumber * keyboardX = [NSNumber numberWithFloat:keyboardFrameInView.origin.x];
    NSNumber * keyboardY = [NSNumber numberWithFloat:keyboardFrameInView.origin.y];
    
    NSMutableDictionary * event = [NSMutableDictionary dictionary];
    
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



- (void)updateKeyboardPanningLockedViews:(CGRect)keyboardFrameInView
{
    ENSURE_UI_THREAD(updateKeyboardPanningLockedViews, keyboardFrameInView);
    
    NSArray * lockedViews = [self lockedViews];
    
    ENSURE_TYPE_OR_NIL(lockedViews, NSArray);
    
    if (lockedViews == nil || [lockedViews count] == 0)
    {
        return;
    }
    
  //  float keyboardHeight = keyboardFrameInView.size.height;
    float keyboardY = keyboardFrameInView.origin.y;
    float height = self.view.frame.size.height;

    float shift = (height - keyboardY);
    float keyboardHeight = shift;
 
    CGPoint initialContentOffset;
    

    if (minKeyBoardHeight == 0){
        minKeyBoardHeight = (int)keyboardHeight;
    }

    
    id toolbarHeight = [self valueForUndefinedKey:@"toolBarHeight"];
    if (toolbarHeight == nil || toolbarHeight == [NSNull null]){
        toolbarHeight = 0;
    }
    
    id value = [self valueForUndefinedKey:@"safeArea"];
    if (value == nil || value == [NSNull null]){
        value = 0;
    }
  //  NSLog ( @"VALUE: %f", value);

    
//    float shift = keyboardHeight <= 0 ? 0 : (height - keyboardY);
    int counter = 0;
    
    
    
    CGPoint scrollPoint = CGPointZero;
    
//    NSLog ( @" keyboardSize native: %f\n\n", thiskeyboardSize.height);

    
    for (TiViewProxy * proxy in lockedViews) {
        
        
        
        if (proxy != nil)
        {
            
            if (counter == 1) {
//                NSLog ( @" \n\n keyboardHeight  keyboardY  native: %f  %f", keyboardHeight, keyboardY);

                TiUIView * proxyView = [proxy view];
                
             //   if ([proxyView isKindOfClass:[TiUIScrollView class]]) {

                //    NSLog ( @"proxyView: %@", proxyView);

                UITableView *sv = nil;
                
                if ([proxyView isKindOfClass:[TiUIListView class]] || [proxyView isKindOfClass:[TiUITableView class]] || [NSStringFromClass([proxyView class])  isEqual: @"TiCollectionviewCollectionView"]) {
                    
                    TiViewProxy * toolbarViewProxy = [lockedViews objectAtIndex:0];
                    TiUIView * toolbarView  = [toolbarViewProxy view];
                    CGRect toolbarViewFrame = toolbarView.frame;


                  //  tableDateLength = [[self valueForUndefinedKey:@"tableDateLength"] integerValue] - 1;
                    
                    if ([proxyView isKindOfClass:[TiUITableView class]]){
                        object_setClass(sv, [UITableView class]);
                        sv = (UITableView *)[(TiUITableView*)proxyView tableView];
                    }
                    else if ([proxyView isKindOfClass:[TiUIListView class]]){
                        object_setClass(sv, [UITableView class]);
                        sv = [(TiUIListView*)proxyView tableView];
                    }
                    
                    
                    //        NSString *strClass = NSStringFromClass([proxyView class]);
                    //
                    //        if ([NSStringFromClass([proxyView class])  isEqual: @"TiCollectionviewCollectionView"]){
                    //            NSLog ( @"TiUITableView :");
                    //            return YES;
                    //        }
                    
                    
                  //  TiUIScrollViewImpl* sv = [(TiUIScrollView*)proxyView scrollView];
                    else if ([NSStringFromClass([proxyView class])  isEqual: @"TiCollectionviewCollectionView"]){
                        NSLog ( @"TiCollectionviewCollectionView :");
                        if ([proxyView respondsToSelector:@selector(collectionView)]){
                            object_setClass(sv, [UICollectionView class]);

                            sv = [proxyView performSelector:@selector(collectionView)];
                            NSLog ( @"TiCollectionviewCollectionView Object : %@",sv);

                        }
                    }
   
                    else {
                        object_setClass(sv, [TiUIScrollViewImpl class]);
                        sv = [(TiUIScrollView*)proxyView scrollView];
                    }
                    
                    
                  //    NSLog ( @"safeArea: %f", [value floatValue]);
                  //     NSLog ( @"Shift - safeArea: %f", (shift - [value floatValue]));
                    
                   //  NSLog ( @"- ORG Shift: %f", -shift);
                    nextDirection = shift;
                  //  sv.contentInset = UIEdgeInsetsMake(0, 0, shift + toolbarViewFrame.size.height, 0);
                    

                    

                    
                 //   if (shift > [value floatValue]){


                    
                         //  CGRect rect = [toolbarView frame];
//                            rect.origin.x = toolbarViewFrame.origin.x;
//                            rect.origin.y = 642 - shift;
//                            [toolbarView setFrame:rect];

                    
                    float frameOriginY = toolbarViewFrame.origin.y;
                    float SizeY = self.view.frame.size.height - toolbarViewFrame.size.height;
                    if (lastY == 0){
                        lastY = frameOriginY;
                    }



                    
                  //  if (frameOriginY < SizeY){

                        
                        
                            if (lastShiftValue < shift){
                            //    NSLog ( @"lastShiftValue < shift");



                                if ((shift > [value floatValue]) && (shift > (shift - [value floatValue])) ){
                                    shift = (shift - [value floatValue]);
                                //    NSLog ( @"***** YOYO shift: %i", shift);

                                }

                                else if ((shift > [value intValue]) && (shift <= (shift - [value floatValue])) ){
                                    shift = [value floatValue];
                                 //   NSLog ( @"#### FINAL shift - value: %i", (shift - [value floatValue]));
                                  //  NSLog ( @"++++ FINAL shift: %i", shift);
                                }

                                else {
                                    shift = 0.0;
                                 //   NSLog ( @"++++ ELSE shift: %i", shift);
                                }


                               // lastShiftValue = shift;

                            }

                            else {

                              //  NSLog ( @"lastShiftValue > shift");


                                if (shift > [value floatValue]){
                                    shift = (shift - [value floatValue]);
                                }

                                //shift = (shift + [value floatValue]);
                                //lastShiftValue = shift;
                            }

                        
                         //   NSLog ( @"- FRAME ORIGIN Y: %i", frameOriginY);

                    
//                    if (lastShiftValue == shift){
//                       // NSLog ( @"\n lastShiftValue  shift: %f  %f",lastShiftValue,shift);
//                        int newBottom;
//                        if (shift > 0){
//                            newBottom = (int)(keyboardHeight - [value floatValue]);
//                        }
//                        else {
//                            newBottom = 0;
//                        }
//                        toolbarViewProxy.bottom = [NSNumber numberWithInt:newBottom];
//                    }


                    if (lastShiftValue != shift){
                                                            
                    
                            if ((shift >= 0) && (frameOriginY < height)){
                                 initialContentOffset = sv.contentOffset;
                                    NSLog ( @"\n initialContentOffset %f", initialContentOffset.y);

                                if (keyboardHeight > minKeyBoardHeight){
                                    maxKeyBoardHeight = (int)keyboardHeight;
                                }
                                if (keyboardHeight == minKeyBoardHeight && lastKeyboardHeight > 0 && lastKeyboardHeight == maxKeyBoardHeight && maxKeyBoardHeight > 0){
                                    [UIView setAnimationsEnabled:NO];
                                //    NSLog ( @"\nsmall keyboardsize %f", keyboardHeight);
                                   // initialContentOffset.y =  initialContentOffset.y - [value floatValue];

                                }
                                else if (keyboardHeight == maxKeyBoardHeight && lastKeyboardHeight > 0 && maxKeyBoardHeight > minKeyBoardHeight && lastKeyboardHeight == minKeyBoardHeight){
                                    [UIView setAnimationsEnabled:NO];
                                //    NSLog ( @"\nhughe keyboardsize %f", keyboardHeight);
                               }
                                
                                
                                [sv setContentInset:UIEdgeInsetsMake(sv.contentInset.top, 0, shift + toolbarViewFrame.size.height - [value floatValue], 0)];
                                sv.scrollIndicatorInsets = sv.contentInset;
                                //                                    [sv setContentInset:UIEdgeInsetsMake(sv.contentInset.top, 0, shift + toolbarViewFrame.size.height - [value floatValue], 0)];

                                
                                id bottomInset = [NSNumber numberWithDouble: (shift + toolbarViewFrame.size.height - [value floatValue])];
                                                               
                                [self replaceValue:bottomInset
                                            forKey:@"lastInsetBottom"
                                      notification:NO];
                                NSLog ( @"\n bottomInset %i", bottomInset);

                                
                                CGAffineTransform transform = CGAffineTransformMakeTranslation(0.0f, -shift);
                                Ti2DMatrix * matrix = [[Ti2DMatrix alloc] initWithMatrix:transform];

                                [toolbarViewProxy replaceValue:0 forKey:@"duration" notification:YES];
                                [toolbarViewProxy replaceValue:matrix forKey:@"transform" notification:YES];
                                [toolbarView setTransform_:matrix];


                                
                                CGFloat y = keyboardFrameInView.origin.y;
                                CGFloat tabBarY = toolbarViewFrame.origin.y;
                             //   NSLog ( @"\n\n y  tabBarY: %f  %f", y, (tabBarY + toolbarViewFrame.size.height - [value floatValue]));
                                if (y < (tabBarY + toolbarViewFrame.size.height - [value floatValue])) {
                                    CGFloat offsetY = (tabBarY - y - [value floatValue]);
                                  //  CGPoint offset = CGPointMake(0, initialContentOffset.y);
                                    CGPoint offset = CGPointMake(0, initialContentOffset.y + offsetY+toolbarViewFrame.size.height);
                                [self replaceValue:[NSNumber numberWithFloat:initialContentOffset.y + offsetY+toolbarViewFrame.size.height]
                                            forKey:@"lastOffset"
                                      notification:NO];

                                    sv.contentOffset = offset;
                                    [UIView setAnimationsEnabled:YES];

                                //     NSLog ( @"y < tabBarY: %f", offsetY);

                                }
                              //  else {
//                                    CGFloat offsetY = (tabBarY - y - [value floatValue]);
//                                    CGPoint offset = CGPointMake(0, initialContentOffset.y + offsetY+toolbarViewFrame.size.height);
//
//                                    sv.contentOffset = offset;

                                    //NSLog ( @"y > tabBarY: %f", offsetY);
                             //   }
                                
                                lastShiftValue = shift;
                                lastKeyboardHeight = (int)keyboardHeight;

                                //if (keyboardHeight > minKeyBoardHeight){
                                 //   maxKeyBoardHeight = keyboardHeight;
                               // }
                                
                                
//                                if (keyboardHeight == minKeyBoardHeight && lastKeyboardHeight > 0){
//                                    [UIView setAnimationsEnabled:NO];
//                                    int newBottom = (int)(keyboardHeight - [value floatValue]);
//
//                                    [sv setContentInset:UIEdgeInsetsMake(sv.contentInset.top, 0, shift + toolbarViewFrame.size.height - [value floatValue], 0)];
//                                    sv.scrollIndicatorInsets = sv.contentInset;
//
//
//                                    toolbarViewProxy.bottom = [NSNumber numberWithInt:newBottom];
//                                    NSLog ( @"\n KEyboard up and Hight is greater Y: %i",newBottom);
//
//                                    toolbarView  = [toolbarViewProxy view];
//                                    toolbarViewFrame = toolbarView.frame;
//
//                                    initialContentOffset = sv.contentOffset;
//
//
//
//
//                                    CGSize svContentSize = sv.contentSize;
//                                    CGSize svBoundSize = sv.bounds.size;
//                                    CGFloat svBottomInsets = sv.contentInset.bottom;
//                                    CGFloat bottomHeight = svContentSize.height - svBoundSize.height + svBottomInsets + [value floatValue];
//                                    CGFloat bottomWidth = svContentSize.width - svBoundSize.width;
//
//                                    CGPoint newOffset = CGPointMake(bottomWidth, bottomHeight);
//
//                                   // [sv setContentOffset:newOffset];
//                                    [sv setContentOffset:newOffset animated:NO];
//
//
//                                    lastY = toolbarViewFrame.origin.y;
//
//                                    lastKeyboardHeight = (int)keyboardHeight;
//                                }
//
//
                                
                                
                                
                                
                                
                                
                                
                                
                                
//                                else if (keyboardHeight == maxKeyBoardHeight && lastKeyboardHeight > 0 && maxKeyBoardHeight > minKeyBoardHeight){
//                                    [UIView setAnimationsEnabled:NO];
//                                    int newBottom = (int)(keyboardHeight - [value floatValue]);
//
//                                    [sv setContentInset:UIEdgeInsetsMake(sv.contentInset.top, 0, shift + toolbarViewFrame.size.height - [value floatValue], 0)];
//                                    sv.scrollIndicatorInsets = sv.contentInset;
//
//
//                                    toolbarViewProxy.bottom = [NSNumber numberWithInt:newBottom];
//                                    NSLog ( @"\n lastKeyboardHeight == maxKeyBoardHeight Y: %i",newBottom);
//
//                                    toolbarView  = [toolbarViewProxy view];
//                                    toolbarViewFrame = toolbarView.frame;
//
//                                    initialContentOffset = sv.contentOffset;
//
//
//
//                                    CGSize svContentSize = sv.contentSize;
//                                    CGSize svBoundSize = sv.bounds.size;
//                                    CGFloat svBottomInsets = sv.contentInset.bottom;
//                                    CGFloat bottomHeight = svContentSize.height - svBoundSize.height + svBottomInsets + [value floatValue];
//                                    CGFloat bottomWidth = svContentSize.width - svBoundSize.width;
//
//                                    CGPoint newOffset = CGPointMake(bottomWidth, bottomHeight);
//
//                                   // [sv setContentOffset:newOffset];
//                                    [sv setContentOffset:newOffset animated:NO];
//
//
//                                    lastY = toolbarViewFrame.origin.y;
//
//                                    lastKeyboardHeight = (int)keyboardHeight;
//                                }
//
//                                else {
//                                    if (lastKeyboardHeight == 0 || keyboardHeight < minKeyBoardHeight ){
//
//
//
//                                        [UIView setAnimationsEnabled:YES];
//
//                                        CGFloat y = keyboardFrameInView.origin.y;
//                                        CGFloat tabBarY = toolbarViewFrame.origin.y;
//
//
//
//                                        if (keyboardHeight >= 0 && tabBarY <= SizeY && lastKeyboardHeight != 0) {
//
//                                            [sv setContentInset:UIEdgeInsetsMake(sv.contentInset.top, 0, shift + toolbarViewFrame.size.height - [value floatValue], 0)];
//                                            sv.scrollIndicatorInsets = sv.contentInset;
//
//                                            toolbarViewFrame.origin.y = SizeY - shift;
//                                            toolbarView.frame = toolbarViewFrame;
//                                            initialContentOffset = sv.contentOffset;
//
//
//                                            toolbarView  = [toolbarViewProxy view];
//                                            toolbarViewFrame = toolbarView.frame;
//
//                                            CGFloat offsetY = (toolbarViewFrame.origin.y - y - [value floatValue]);
//                                          //  CGPoint offset = CGPointMake(0, initialContentOffset.y);
//                                            CGPoint offset = CGPointMake(0, initialContentOffset.y + offsetY+toolbarViewFrame.size.height);
//
//                                            sv.contentOffset = offset;
//
//                                            [self replaceValue:[NSNumber numberWithFloat:initialContentOffset.y + offsetY+toolbarViewFrame.size.height]
//                                                        forKey:@"lastOffset"
//                                                  notification:NO];
//                                             NSLog ( @"y < tabBarY: %f", offsetY);
//                                            lastShiftValue = shift;
//                                            lastKeyboardHeight = (int)keyboardHeight;
//                                        }
//                                        else {
//                                           // if (tabBarY == SizeY){
//                                                NSLog ( @"ELSE");
//
//                                            [sv setContentInset:UIEdgeInsetsMake(sv.contentInset.top, 0, shift + toolbarViewFrame.size.height - [value floatValue], 0)];
//                                            sv.scrollIndicatorInsets = sv.contentInset;
//
//                                            toolbarViewFrame.origin.y = SizeY - shift;
//                                            toolbarView.frame = toolbarViewFrame;
//                                            initialContentOffset = sv.contentOffset;
//
//
//                                            toolbarView  = [toolbarViewProxy view];
//                                            toolbarViewFrame = toolbarView.frame;
//
//
//                                                CGSize svContentSize = sv.contentSize;
//                                                CGSize svBoundSize = sv.bounds.size;
//                                                CGFloat svBottomInsets = sv.contentInset.bottom;
//                                                CGFloat bottomHeight = svContentSize.height - svBoundSize.height + svBottomInsets + [value floatValue];
//                                                CGFloat bottomWidth = svContentSize.width - svBoundSize.width;
//
//                                                CGPoint newOffset = CGPointMake(bottomWidth, bottomHeight);
//
//                                               // [sv setContentOffset:newOffset];
//                                                [sv setContentOffset:newOffset animated:NO];
//
//                                         //   }
//
//                                            lastShiftValue = shift;
//                                            lastKeyboardHeight = (int)keyboardHeight;
//
//                                        }
//
//                                        lastY = toolbarViewFrame.origin.y;
//                                        NSLog ( @"\n smooth ");
//
//
//
//                                    }
//
//                                }

                                       

                                
                            }



                     //       }
                        

                        
                    }
//                    else {
//
//
//                        lastShiftValue = 0;
//                    }
                    
                    
                }
           
            }
            
            else {
              //  NSLog ( @"UPDATE TooLBAR");

              //  [self updateKeyboardPanningLockedView:proxy with:shift];
            }
            
            counter ++;
        }
    }
}






- (void)updateKeyboardPanningLockedView:(TiViewProxy *)proxy with:(float)shift
{
    TiUIView * proxyView = [proxy view];

    id value = [self valueForUndefinedKey:@"safeArea"];
    if (value == nil || value == [NSNull null]){
        value = 0;
    }


    
    
    //shift = (shift - [value floatValue]);
    
  //  NSLog ( @"safeArea: %f", [value floatValue]);
 //   NSLog ( @"Shift - safeArea: %f", (shift - [value floatValue]));

   // NSLog ( @"- Shift: %f", -shift);

    if (lastShiftValue < shift){
        shift = (shift - [value floatValue]);
        lastShiftValue = shift;
    }
    else{
        //shift = (shift + [value floatValue]);
        if (lastShiftValue > shift){
            lastShiftValue = shift;
        }
        else {
            lastShiftValue = shift;
        }
    }
    


    CGAffineTransform transform = CGAffineTransformMakeTranslation(0.0f, -shift);

    Ti2DMatrix * matrix = [[Ti2DMatrix alloc] initWithMatrix:transform];

    [proxy replaceValue:matrix forKey:@"transform" notification:YES];
    [proxyView setTransform_:matrix];
}


- (void)setKeyboardTriggerOffset:(id)args
{
    float offset = [TiUtils floatValue:args def:0.0f];
    self.view.keyboardTriggerOffset = offset;
}



@end
