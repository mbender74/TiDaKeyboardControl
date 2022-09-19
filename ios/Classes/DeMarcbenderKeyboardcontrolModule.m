/**
 * TiDAKeyboardControl
 *
 * Created by Your Name
 * Copyright (c) 2021 Your Company. All rights reserved.
 */

#import "DeMarcbenderKeyboardcontrolModule.h"
#import "TiKeyboardControlViewProxy.h"

#import "TiBase.h"
#import "TiHost.h"
#import "TiUtils.h"

@implementation DeMarcbenderKeyboardcontrolModule

#pragma mark Internal

// This is generated for your module, please do not change it
- (id)moduleGUID
{
  return @"b828232e-dbf7-4615-9924-39f539a94727";
}

// This is generated for your module, please do not change it
- (NSString *)moduleId
{
  return @"de.marcbender.keyboardcontrol";
}

#pragma mark Lifecycle

- (void)startup
{
  // This method is called when the module is first loaded
  // You *must* call the superclass
  [super startup];
  DebugLog(@"[DEBUG] %@ loaded", self);
}

#pragma mark Public API

- (id)createView:(id)args{
//    return [[TiBottomsheetcontrollerProxy alloc] _initWithPageContext:[self executionContext] args:args];
    return [[TiKeyboardControlViewProxy alloc] _initWithPageContext:[self executionContext] args:args];
}

@end
