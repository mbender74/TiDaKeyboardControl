# Animation Sync Plan: Toolbar synchron zur Keyboard-Animation

## Problem

Die Toolbar nutzt eine **hardcoded** Animation-Curve (EaseInOut), während das Keyboard je nach Aktivierungsmodus verschiedene Curves verwendet:

| Modus | Keyboard Animation |
|-------|-------------------|
| Programmatisch | `UIViewAnimationCurve` (EaseInOut/EaseIn/EaseOut/Linear) |
| Interaktiver Swipe | **Spring** (`UICollisionBehavior` + `UIDynamicItemBehavior`) |

Die Toolbar-Animation ist daher nicht identisch zur Keyboard-Animation.

## Aktueller Code

```objc
// Hardcoded Curve 7 (EaseInOut) - unabhängig von iOS Keyboard Curve
[toolbarViewProxy replaceValue:[NSNumber numberWithInt:(7 << 16)] forKey:@"curve" ...];
```

`animationCurve` aus `keyboardWillShow/WillHide` wird **nicht** weiterverwendet.

---

## Phase 1: Programmatische Animation synchronisieren

**Ziel:** `animationCurve` aus der Notification korrekt an die Toolbar-Animation weitergeben.

**Änderung:**
- In `updateKeyboardPanningViews` Zeile ~1236: `(7 << 16)` → `(self->animationCurve << 16)`
- Gleicher Fix in Zeile ~1246 (manualPanning Pfad)

**Datei:** `ios/Classes/TiKeyboardControlViewProxy.m`

**Status:** ✅ Done

---

## Phase 2: Interaktives Swipe synchronisieren

**Ziel:** Bei Swipe-Geste die exakte Y-Position des `inputAccessoryView` auf die Toolbar kopieren (Spring-Curve).

**Ansatz:**
- KVO-Callback in `setupNotifications` (Zeile ~542) bereits existiert
- Aktuell nur `lastInputAccessoryViewFrame` gespeichert
- Erweitern: `initialAccessoryViewFrame` beim ersten Callback speichern
- Bei jedem weiteren Callback: `deltaY = frame.origin.y - initialFrame.origin.y` berechnen
- Direkten `CALayer.affineTransform` setzen (kein Ti2DMatrix-Overhead)

**Datei:** `ios/Classes/TiKeyboardControlViewProxy.m`

**Status:** 🟡 Pending

---

## Phase 3: Cleanup & Transition

**Ziel:** Sauberer Übergang zwischen Swipe (Transform) und programmatisch (ContentInset).

**Änderungen:**
- `keyboardDidShow`: Transform zurücksetzen → Identity
- `keyboardDidHide`: Transform zurücksetzen → Identity
- `initialAccessoryViewFrame` auf `CGRectNull` invalidieren

**Status:** 🟡 Pending

---

## Testing

- [ ] Programmatisch (TextField Focus) → gleiche Curve wie Keyboard
- [ ] Interaktiver Swipe (nach oben/unten) → pixel-perfekt synchron
- [ ] Transition Show → Hide → Show (kein Sprung)
- [ ] TabGroup + NavigationWindow Kombinationen
- [ ] extendSafeArea + ignoreExtendSafeArea
