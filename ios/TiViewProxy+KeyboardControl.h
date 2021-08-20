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

#import <TitaniumKit/TitaniumKit.h>
#import "ItSmcDakeyboardcontrolModule.h"
#import "TiUIScrollViewProxy.h"
#import "TiUITableViewProxy.h"
#import "TiUIListViewProxy.h"
#import "TiViewProxy.h"


@interface TiViewProxy (KeyboardControl)


- (void)setKeyboardPanning:(id)args;


@end
