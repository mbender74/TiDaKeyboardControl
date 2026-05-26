# iOS: Robustere Höhenberechnung via Ti.iOS.Metrics-Ansatz

## Kontext

TiDaKeyboardControl berechnet TabGroup-Höhe, Safe Area Insets und Window-Frames über Titanium-eigene APIs (`Ti.UI.TabGroup`, `parentWindow.extendSafeArea`, `self.view.window.frame`). Diese Ansätze sind auf iPad Split View, macOS Catalyst und iOS 13+ Multi-Scene unzuverlässig.

Ti.iOS.Metrics ([`/Users/marcbender/Titanium-Modules/Ti.iOS.Metrics`](file:///Users/marcbender/Titanium-Modules/Ti.iOS.Metrics)) nutzt einen robusteren 3-Stufen-Ansatz für Key Window Resolution, `UIWindowScene`-basierte Status Bar Erkennung und die Formel `49.0 + safeArea.bottom` für Tab Bar Height.

## Ziele

1. **Tab Bar Height** deterministischer berechnen (Formel statt Titanium-API)
2. **Key Window** auf iOS 13+ Multi-Scene Devices korrekt finden
3. **Status Bar Height** explizit verfügbar machen (für Toolbar-Positionierung)
4. **Navigation Bar Height** berechnen (für NavigationWindow-Kontext)
5. **Orientation-aware** Height-Berechnungen (landscape vs portrait)

---

## Phase 1: Key Window Resolution (iOS 13+ Multi-Scene)

### Problem
Aktuell: `self.view.window` — funktioniert nicht zuverlässig auf:
- iPad Split View (zwei UIWindowScene-Instanzen)
- macOS Catalyst
- External Display

### Lösung: `_resolveKeyWindow` Helper-Methode

In `TiKeyboardControlViewProxy.m` eine neue private Methode:

```objc
/**
 * Löst das aktuelle Key Window auf — iOS 13+ Multi-Scene aware.
 * Drei-Stufen-Fallback:
 *   1. Foreground-active/inactive UIWindowScene → isKeyWindow
 *   2. UIApplication.keyWindow (deprecated, iOS 13+)
 *   3. UIApplication.windows[0]
 */
- (UIWindow *)resolveKeyWindow
{
    UIWindow *keyWindow = nil;
    
    // Schritt 1: iOS 13+ connectedScenes
    if (@available(iOS 13.0, *)) {
        UIWindowSceneActivationState foregroundStates =
            UIWindowSceneActivationStateForegroundActive |
            UIWindowSceneActivationStateForegroundInactive;
        
        for (UIScene *scene in [UIApplication sharedApplication].connectedScenes) {
            if ([scene isKindOfClass:[UIWindowScene class]] &&
                ((UIWindowScene *)scene).activationState & foregroundStates) {
                
                for (UIWindow *window in ((UIWindowScene *)scene).windows) {
                    if (window.isKeyWindow) {
                        keyWindow = window;
                        break;
                    }
                }
                if (keyWindow) break;
            }
        }
    }
    
    // Schritt 2: Fallback auf deprecated keyWindow
    if (!keyWindow) {
        keyWindow = [UIApplication sharedApplication].keyWindow;
    }
    
    // Schritt 3: Letzter Fallback — erstes Fenster in windows-Array
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
```

### Änderungspunkt in `_setup`

Aktuell (Zeile ~299):
```objc
windowRect = self.view.window.frame;
```

Neu:
```objc
UIWindow *resolvedWindow = [self resolveKeyWindow];
if (resolvedWindow) {
    windowRect = resolvedWindow.frame;
    // Cache für spätere Nutzung
    self->_cachedKeyWindow = resolvedWindow;
} else {
    windowRect = self.view.window.frame;
}
```

### Neue ivar-Property
```objc
@property (nonatomic, weak) UIWindow *cachedKeyWindow;
```

---

## Phase 2: Tab Bar Height — Formel statt Titanium-API

### Problem
Aktuell (Zeile ~387, 393, 420, 431, 466):
```objc
tabgroupHeight = (tabBar.frame.size.height);
// oder
tabgroupHeight = (safeAreaValue);
// oder
tabgroupHeight = 0;
```
Abhängig von Titanium's `tabBar`-Objekt, das bei Split View oder Custom TabGroups unzuverlässig sein kann.

### Lösung: Deterministische Formel

```objc
/**
 * Berechnet die Tab Bar Height deterministisch.
 * iOS 11+: 49.0 (standard) + safeArea.bottom (Home Indicator)
 * iOS <11: 49.0
 */
- (CGFloat)calculateTabBarHeight
{
    CGFloat baseTabBarHeight = 49.0;
    CGFloat safeAreaBottom = 0.0;
    
    if (@available(iOS 11.0, *)) {
        UIWindow *keyWindow = [self resolveKeyWindow];
        if (keyWindow) {
            safeAreaBottom = keyWindow.safeAreaInsets.bottom;
        }
    }
    
    return baseTabBarHeight + safeAreaBottom;
}
```

### Änderungen in `_setup`

Stelle alle `tabgroupHeight = (tabBar.frame.size.height)` Zuweisungen um auf:

```objc
// Alt:
tabgroupHeight = (tabBar.frame.size.height);

// Neu:
tabgroupHeight = [self calculateTabBarHeight];
```

### Änderungspunkte (alle Vorkommen in `_setup`)

| Zeile (ungefähr) | Alt | Neu |
|---|---|---|
| ~387 | `tabgroupHeight = (tabBar.frame.size.height)` | `tabgroupHeight = [self calculateTabBarHeight]` |
| ~393 | `tabgroupHeight = (tabBar.frame.size.height)` | `tabgroupHeight = [self calculateTabBarHeight]` |
| ~420 | `tabgroupHeight = bottomPadding` | Behalten (extendSafeArea:true, ignoreExtendSafeArea:true — hier ist Tab Bar irrelevant) |
| ~431 | `tabgroupHeight = (tabBar.frame.size.height)` | `tabgroupHeight = [self calculateTabBarHeight]` |
| ~445 | `tabgroupHeight = (safeAreaValue)` | Behalten (standard window, extendSafeArea:false — keine Tab Bar) |
| ~459 | `tabgroupHeight = bottomPadding` | Behalten |
| ~466 | `tabgroupHeight = 0` | Behalten (standard window, extendSafeArea:false) |
| ~474 | `tabgroupHeight = (safeAreaValue)` | Behalten |
| ~479 | `tabgroupHeight = (safeAreaValue)` | Behalten |

---

## Phase 3: Status Bar Height — explizit berechnen

### Problem
Status Bar Height ist implizit in Safe Area Insets enthalten, aber nicht separat verfügbar. Für die Toolbar-Positionierungsformel wäre eine explizite Höhe nützlich.

### Lösung: `_getStatusBarHeight` Helper

```objc
/**
 * Liefert die Status Bar Height in points.
 * iOS 13+: windowScene.statusBarManager.statusBarFrame
 * iOS <13: UIApplication.statusBarFrame (deprecated)
 * Returns 0 if status bar is hidden.
 */
- (CGFloat)getStatusBarHeight
{
    // Versteckte Status Bar?
    if (@available(iOS 13.0, *)) {
        UIWindowScene *scene = nil;
        for (UIScene *s in [UIApplication sharedApplication].connectedScenes) {
            if ([s isKindOfClass:[UIWindowScene class]]) {
                UIWindowScene *ws = (UIWindowScene *)s;
                if (ws.activationState & UIWindowSceneActivationStateForegroundActive) {
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
```

### Neue ivar-Property
```objc
@property (nonatomic, assign) CGFloat cachedStatusBarHeight;
```

### Verwendung in `_setup`
```objc
self->_cachedStatusBarHeight = [self getStatusBarHeight];
```

---

## Phase 4: Navigation Bar Height — berechnen

### Problem
TiDaKeyboardControl erkennt NavigationWindow-Kontext (`isNavigationWindow`), kennt aber nicht die explizite Navigation Bar Height. Für präzise Toolbar-Positionierung in NavigationWindow-Layouts wäre das relevant.

### Lösung: `_findAndCalculateNavigationBarHeight`

```objc
/**
 * Sucht einen UINavigationController in der View Controller Hierarchie
 * und liefert dessen Navigation Bar Height.
 * Fallback: 44.0 (standard iOS nav bar height) + safeArea.top (notch/Dynamic Island)
 */
- (CGFloat)calculateNavigationBarHeight
{
    CGFloat fallbackHeight = 44.0;
    
    if (@available(iOS 11.0, *)) {
        UIWindow *keyWindow = [self resolveKeyWindow];
        if (keyWindow) {
            fallbackHeight += keyWindow.safeAreaInsets.top;
        }
    }
    
    // Versuche, UINavigationController in Hierarchie zu finden
    UIViewController *rootVC = keyWindow.rootViewController;
    if (!rootVC) return fallbackHeight;
    
    UINavigationController *navController = [self findNavigationControllerInHierarchy:rootVC];
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

/**
 * Rekursive Suche nach UINavigationController.
 * Sucht: direkt, über selectedViewController (TabBar), über navigationController prop, child VCs.
 */
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
```

### Neue ivar-Property
```objc
@property (nonatomic, assign) CGFloat cachedNavigationBarHeight;
```

---

## Phase 5: Orientation-aware Height-Berechnungen

### Problem
Alle Height-Berechnungen sind portrait-orientiert. Bei Landscape-rotation könnten sich Tab Bar / Safe Area Werte ändern.

### Lösung: Rotation-Observer

```objc
- (void)setupOrientationObserver
{
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(handleOrientationChange)
                                                 name:UIApplicationDidChangeScreenBoundsNotification
                                               object:nil];
}

- (void)handleOrientationChange
{
    // Cached Werte invalidieren und neu berechnen
    self->_cachedStatusBarHeight = [self getStatusBarHeight];
    self->_cachedNavigationBarHeight = [self calculateNavigationBarHeight];
    
    // TabGroup? → Tab Bar Height neu berechnen
    if (isTabGroup) {
        tabgroupHeight = [self calculateTabBarHeight];
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
```

---

## Zusammenfassung der neuen Helper-Methoden

| Methode | Rückgabetyp | Quelle bei Ti.iOS.Metrics | Zweck |
|---|---|---|---|
| `resolveKeyWindow` | `UIWindow *` | `_getKeyWindow` | iOS 13+ Multi-Scene Key Window |
| `calculateTabBarHeight` | `CGFloat` | `_getTabBarHeightRobust` | `49.0 + safeArea.bottom` |
| `getStatusBarHeight` | `CGFloat` | `_getStatusBarHeight` | `windowScene.statusBarManager` |
| `calculateNavigationBarHeight` | `CGFloat` | `_getNavigationBarHeightRobust` | VC-Hierarchie + Layout-Pass |
| `findNavigationControllerInHierarchy:` | `UINavigationController *` | `_findNavigationControllerInHierarchy` | Rekursive VC-Suche |
| `handleOrientationChange` | `void` | — | Rotation → cached values invalidieren |

---

## Abhängigkeiten zwischen Phasen

```
Phase 1 (resolveKeyWindow)
    ├── Phase 2 (calculateTabBarHeight)    — benötigt resolveKeyWindow
    ├── Phase 3 (getStatusBarHeight)       — benötigt resolveKeyWindow
    └── Phase 4 (calculateNavigationBarHeight) — benötigt resolveKeyWindow, findNavigationControllerInHierarchy:

Phase 5 (handleOrientationChange)         — benötigt alle oben
```

## Risikobewertung

| Phase | Risiko | Begründung |
|---|---|---|
| 1 | Niedrig | Reine Window-Resolution, keine Layout-Änderung |
| 2 | Mittel | Ändert `tabgroupHeight`-Berechnung — muss mit extendSafeArea=true/false Tests abgedeckt werden |
| 3 | Niedrig | Nur lesend, keine Layout-Auswirkung |
| 4 | Niedrig | Nur lesend, Navigation Bar Height wird aktuell nicht aktiv genutzt |
| 5 | Mittel | Rotation löst Layout-Neuberechnung aus — muss mit Keyboard-Animation synchron sein |

## Testplan

1. **iPad Split View** — Key Window Resolution auf zwei parallelen Szenen
2. **TabGroup, extendSafeArea=true** — Tab Bar Height korrekt über Home Indicator
3. **TabGroup, extendSafeArea=false** — Toolbar sitzt korrekt über Tab Bar
4. **Standalone Window** — keine Tab Bar, extendSafeArea true/false
5. **NavigationWindow** — Nav Bar Height korrekt, Toolbar unter Nav Bar
6. **Landscape Rotation** — alle Heights werden neu berechnet, Keyboard bleibt synchron
7. **macOS Catalyst** — Key Window Resolution auf Catalyst Window

## Offene Fragen

1. Sollte `calculateTabBarHeight` den `ignoreExtendSafeArea`-Flag berücksichtigen? Bei `ignoreExtendSafeArea=true` wird die Tab Bar in die Safe Area extendet — die Höhe ändert sich nicht, aber die Position.
2. Ist die Navigation Bar Height für TiDaKeyboardControl überhaupt relevant? Das Modul positioniert die Toolbar relativ zum Keyboard, nicht zur Nav Bar. Wenn `isNavigationWindow` gesetzt ist, könnte die Nav Bar Height aber für die `isNavigationWindowBottomDiff`-Berechnung nützlich sein.
3. Sollen die Helper-Methoden als eigene Datei (`TiKeyboardControlViewProxy+Metrics.h/.m`) ausgelagert werden oder bleiben sie in `TiKeyboardControlViewProxy.m`? Empfehlung: Erst in `TiKeyboardControlViewProxy.m` belassen, bei Wachstum auslagern.
