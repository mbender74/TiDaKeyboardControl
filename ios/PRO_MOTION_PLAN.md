# ProMotion 120Hz Optimierung

## Problem

Aktuell nutzt der Code `Ti2DMatrix` für alle Transform-Animationen. Das Titanium-Internalsystem läuft nicht an die Display-Refresh-Rate gebunden → auf 120Hz Displays gibt es Jank.

| Pfad | Aktueller Code | Problem |
|------|---------------|---------|
| Programmatic | Ti2DMatrix + keyboardTransitionDuration | Nicht an Display gebunden |
| Swipe | Ti2DMatrix + duration=0 | Titanium-Overhead pro Frame |

## Ziel

Auf 120Hz Displays butterweiche Animationen, auf 60Hz unverändert.

---

## Phase 1: Swipe → direkter CALayer Transform

**Problem:** `Ti2DMatrix` + `setTransform_` geht durch Titanium-Animation-System (Main Thread, nicht frame-synced).

**Lösung:** Direkt `toolbarview.layer.affineTransform` setzen mit `CATransaction setDisableActions:YES`.

**Änderungen:**
- `updateKeyboardPanningViews`: Wenn `isSwiping=YES` → `CALayer.affineTransform` statt Ti2DMatrix
- `initialAccessoryViewFrame` + `cachedTransform` wieder als IVars

**Datei:** `TiKeyboardControlViewProxy.m`, `TiKeyboardControlViewProxy.h`

**Status:** 🟡 Pending

---

## Phase 2: Programmatic → UIViewPropertyAnimator

**Problem:** `keyboardTransitionDuration` ist auf 60/120Hz identisch (~0.25s), aber Ti2DMatrix rendert nicht frame-perfect.

**Lösung:** `UIViewPropertyAnimator` mit exakter iOS-Curve → nativ an Display gebunden.

**Änderungen:**
- `UIViewPropertyAnimator` mit `keyboardTransitionDuration` + `animationCurve`
- Auf 120Hz: iOS gibt mehr Frames → gleiche Duration, butterweicher
- Fallback: `UIScreen.maximumFramesPerSecond` prüfen, nur auf 120Hz aktivieren

**Datei:** `TiKeyboardControlViewProxy.m`

**Status:** 🟡 Pending

---

## Testing

- [ ] 60Hz Display: gleiche Animation wie jetzt
- [ ] 120Hz Display (iPhone 13/14 Pro): butterweiche Animation
- [ ] Swipe: pixel-perfekt synchron zum Keyboard
- [ ] Programmatisch: gleiche Curve + Duration wie Keyboard
