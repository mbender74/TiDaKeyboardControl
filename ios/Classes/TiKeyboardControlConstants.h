//
//  TiKeyboardControlConstants.h
//  TiDaKeyboardControl
//
//  Konstanten für das Keyboard-Control-Modul.
//  Zentrale Definition aller Magic Numbers für bessere Wartbarkeit.
//

#import <Foundation/Foundation.h>

#pragma mark - Animation & Timing

/** Retry-Delay beim Warten auf viewReady (Sekunden) */
static const NSTimeInterval kTIDKBCRetryDelay = 0.16;

/** Schwellenwert für "settled" — wenn deltaY < diesem Wert, ist die Toolbar settled */
static const CGFloat kTIDKBCSettleThreshold = 0.5;

/** Schwellenwert für "atBottom" — wenn contentOffset >= bottomOffset - diesem Wert, ist ScrollView am Boden */
static const CGFloat kTIDKBCAtBottomThreshold = 20.0;

#pragma mark - Layout-Grundhöhen

/** Base-Höhe der Tab Bar (iOS Standard) */
static const CGFloat kTIDKBCBaseTabBarHeight = 49.0;

/** Base-Höhe der Navigation Bar (iOS Standard) */
static const CGFloat kTIDKBCBaseNavBarHeight = 44.0;

#pragma mark - Korrektur-Faktoren

/** Faktor für bottomPadding-Korrektur bei extendSafeArea=false */
static const CGFloat kTIDKBCBottomPaddingCorrectionFactor = 0.8;

#pragma mark - Animation Curves

/** Default-Animation-Curve (UIViewAnimationCurveEaseInOut = 7) */
static const NSInteger kTIDKBCDefaultAnimationCurve = 7;
