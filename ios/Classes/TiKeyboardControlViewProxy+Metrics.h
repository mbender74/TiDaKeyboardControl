//
//  TiKeyboardControlViewProxy+Metrics.h
//  TiDaKeyboardControl
//
//  Created for iOS height/metric calculation improvements.
//  Exposes robust height calculations inspired by Ti.iOS.Metrics.
//

#import "TiKeyboardControlViewProxy.h"

/**
 * Kategorien-Methoden für iOS 13+ Multi-Scene-aware Height-Berechnungen.
 * Alle Methoden nutzen resolveKeyWindow für konsistente Window-Resolution.
 */
@interface TiKeyboardControlViewProxy (Metrics)

#pragma mark - Key Window Resolution

/**
 * Löst das aktuelle Key Window auf — iOS 13+ Multi-Scene aware.
 * Vier-Stufen-Fallback:
 *   1. Foreground-active/inactive UIWindowScene → isKeyWindow
 *   2. UIApplication.keyWindow (deprecated, iOS 13+)
 *   3. UIApplication.windows mit isKeyWindow
 *   4. Erstes Fenster in UIApplication.windows
 */
- (UIWindow *)resolveKeyWindow;

#pragma mark - Tab Bar Height

/**
 * Berechnet die Tab Bar Height deterministisch.
 * iOS 11+: 49.0 (standard) + safeArea.bottom (Home Indicator)
 * iOS <11: 49.0
 */
- (CGFloat)calculateTabBarHeight;

#pragma mark - Status Bar Height

/**
 * Liefert die Status Bar Height in points.
 * iOS 13+: windowScene.statusBarManager.statusBarFrame
 * iOS <13: UIApplication.statusBarFrame (deprecated)
 * Returns 0 if status bar is hidden.
 */
- (CGFloat)getStatusBarHeight;

#pragma mark - Navigation Bar Height

/**
 * Sucht einen UINavigationController in der View Controller Hierarchie
 * und liefert dessen Navigation Bar Height.
 * Fallback: 44.0 (standard iOS nav bar height) + safeArea.top (notch/Dynamic Island)
 */
- (CGFloat)calculateNavigationBarHeight;

/**
 * Rekursive Suche nach UINavigationController.
 * Sucht: direkt, über selectedViewController (TabBar), über navigationController prop, child VCs.
 */
- (UINavigationController *)findNavigationControllerInHierarchy:(UIViewController *)controller;

#pragma mark - Orientation Handling

/**
 * Registriert Observer für Bildschirm-Rotation und Layout-Changes.
 */
- (void)setupOrientationObserver;

/**
 * Wird bei Rotation aufgerufen — invalidiert alle cached Heights und
 * stößt Layout-Neuberechnung an.
 */
- (void)handleOrientationChange;

#pragma mark - JavaScript-Expose

/**
 * Liefert alle gecachten Heights als NSDictionary — analog zu Ti.iOS.Metrics getHeights().
 * Keys: statusBarHeight, navigationBarHeight, tabBarHeight, safeAreaTop, safeAreaBottom
 */
- (NSDictionary *)getHeightsForJavaScript;

@end
