//
//  TiKeyboardControlViewProxy+Metrics.m
//  TiDaKeyboardControl
//
//  iOS height/metric calculation improvements.
//  Exports robust height calculations inspired by Ti.iOS.Metrics.
//

#import "TiKeyboardControlViewProxy+Metrics.h"
#import "TiKeyboardControlConstants.h"

#pragma mark - Key Window Resolution

@implementation TiKeyboardControlViewProxy (Metrics)

- (UIWindow *)resolveKeyWindow
{
    UIWindow *keyWindow = nil;

    // Schritt 1: iOS 13+ connectedScenes
    if (@available(iOS 13.0, *)) {
        UISceneActivationState foregroundStates =
            UISceneActivationStateForegroundActive |
            UISceneActivationStateForegroundInactive;

        for (UIScene *scene in [UIApplication sharedApplication].connectedScenes) {
            if ([scene isKindOfClass:[UIWindowScene class]]) {
                UIWindowScene *ws = (UIWindowScene *)scene;
                if ((NSUInteger)ws.activationState & (NSUInteger)foregroundStates) {
                    for (UIWindow *window in ws.windows) {
                        if (window.isKeyWindow) {
                            keyWindow = window;
                            break;
                        }
                    }
                    if (keyWindow) break;
                }
            }
        }
    }

    // Schritt 2: Fallback auf deprecated keyWindow
    if (!keyWindow) {
        keyWindow = [UIApplication sharedApplication].keyWindow;
    }

    // Schritt 3: Letzter Fallback — isKeyWindow in windows-Array
    if (!keyWindow) {
        for (UIWindow *window in [UIApplication sharedApplication].windows) {
            if (window.isKeyWindow) {
                keyWindow = window;
                break;
            }
        }
    }

    // Schritt 4: Absolute Not — erstes Fenster überhaupt
    if (!keyWindow) {
        NSArray<UIWindow *> *allWindows = [UIApplication sharedApplication].windows;
        if (allWindows.count > 0) {
            keyWindow = allWindows.firstObject;
        }
    }

    return keyWindow;
}

#pragma mark - Tab Bar Height

- (CGFloat)calculateTabBarHeight
{
    CGFloat baseTabBarHeight = kTIDKBCBaseTabBarHeight;
    CGFloat safeAreaBottom = 0.0;

    if (@available(iOS 11.0, *)) {
        UIWindow *keyWindow = [self resolveKeyWindow];
        if (keyWindow) {
            safeAreaBottom = keyWindow.safeAreaInsets.bottom;
        }
    }

    return baseTabBarHeight + safeAreaBottom;
}

#pragma mark - Status Bar Height

- (CGFloat)getStatusBarHeight
{
    if (@available(iOS 13.0, *)) {
        UIWindowScene *scene = nil;
        for (UIScene *s in [UIApplication sharedApplication].connectedScenes) {
            if ([s isKindOfClass:[UIWindowScene class]]) {
                UIWindowScene *ws = (UIWindowScene *)s;
                if ((NSUInteger)ws.activationState & (NSUInteger)UISceneActivationStateForegroundActive) {
                    scene = ws;
                    break;
                }
            }
        }
        if (scene) {
            return scene.statusBarManager.statusBarFrame.size.height;
        }
    }

    // Fallback
    return [UIApplication sharedApplication].statusBarFrame.size.height;
}

#pragma mark - Navigation Bar Height

- (CGFloat)calculateNavigationBarHeight
{
    CGFloat fallbackHeight = kTIDKBCBaseNavBarHeight;

    if (@available(iOS 11.0, *)) {
        UIWindow *keyWindow = [self resolveKeyWindow];
        if (keyWindow) {
            fallbackHeight += keyWindow.safeAreaInsets.top;
        }
    }

    // Versuche, UINavigationController in Hierarchie zu finden
    UIWindow *keyWindow = [self resolveKeyWindow];
    if (!keyWindow || !keyWindow.rootViewController) {
        return fallbackHeight;
    }

    UINavigationController *navController = [self findNavigationControllerInHierarchy:keyWindow.rootViewController];
    if (navController && !navController.navigationBar.isHidden) {
        // Layout erzwingen, falls Frame noch nicht berechnet
        [navController.navigationBar.superview layoutIfNeeded];
        CGFloat navHeight = navController.navigationBar.frame.size.height;
        if (navHeight > 0) {
            return navHeight;
        }
    }

    return fallbackHeight;
}

- (UINavigationController *)findNavigationControllerInHierarchy:(UIViewController *)controller
{
    if ([controller isKindOfClass:[UINavigationController class]]) {
        return (UINavigationController *)controller;
    }

    if ([controller isKindOfClass:[UITabBarController class]]) {
        UITabBarController *tabController = (UITabBarController *)controller;
        if (tabController.selectedViewController) {
            return [self findNavigationControllerInHierarchy:tabController.selectedViewController];
        }
    }

    if (controller.navigationController) {
        return controller.navigationController;
    }

    for (UIViewController *child in controller.childViewControllers) {
        UINavigationController *found = [self findNavigationControllerInHierarchy:child];
        if (found) return found;
    }

    return nil;
}

#pragma mark - Orientation Handling

- (void)setupOrientationObserver
{
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(handleOrientationChange)
                                                 name:UIDeviceOrientationDidChangeNotification
                                               object:nil];
}

- (void)handleOrientationChange
{
    // Cached Werte neu berechnen (Property-Zugriff)
    self.cachedStatusBarHeight = [self getStatusBarHeight];
    self.cachedNavigationBarHeight = [self calculateNavigationBarHeight];

    // TabGroup? → Tab Bar Height neu berechnen (Ivar-Zugriff über forward)
    if ([self respondsToSelector:@selector(setIsTabGroup:)]) {
        BOOL isTg = [self valueForKey:@"isTabGroup"];
        if (isTg) {
            tabgroupHeight = [self calculateTabBarHeight];
        }
    }

    // Safe Area neu lesen
    UIWindow *keyWindow = [self resolveKeyWindow];
    if (keyWindow && @available(iOS 11.0, *)) {
        topPadding = keyWindow.safeAreaInsets.top;
        bottomPadding = keyWindow.safeAreaInsets.bottom;
        safeAreaValue = bottomPadding;
    }

    // Bestehende Layout-Logik neu anstoßen
    [self applyScrollViewInset:initialAccessoryViewFrame];
    [self scrollToBottomIfNeeded];
}

#pragma mark - JavaScript-Expose

- (NSDictionary *)getHeightsForJavaScript
{
    // Sicherstellen, dass alles aktuell ist (Property-Zugriff)
    self.cachedStatusBarHeight = [self getStatusBarHeight];
    self.cachedNavigationBarHeight = [self calculateNavigationBarHeight];
    CGFloat tabBarHeight = [self calculateTabBarHeight];

    // Safe Area aus resolved Key Window
    CGFloat safeAreaTop = 0.0;
    CGFloat safeAreaBottom = 0.0;
    if (@available(iOS 11.0, *)) {
        UIWindow *keyWindow = [self resolveKeyWindow];
        if (keyWindow) {
            safeAreaTop = keyWindow.safeAreaInsets.top;
            safeAreaBottom = keyWindow.safeAreaInsets.bottom;
        }
    }

    return @{
        @"statusBarHeight": @(self.cachedStatusBarHeight),
        @"navigationBarHeight": @(self.cachedNavigationBarHeight),
        @"tabBarHeight": @(tabBarHeight),
        @"safeAreaTop": @(safeAreaTop),
        @"safeAreaBottom": @(safeAreaBottom)
    };
}

@end
