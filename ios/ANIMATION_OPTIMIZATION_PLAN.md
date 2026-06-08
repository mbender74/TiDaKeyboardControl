# Animation Optimization Plan

## Current State Analysis

### iOS Implementation

#### Strengths ✅
1. **CALayer-based animations** - Using `layer.affineTransform` directly for smooth 120Hz animations
2. **Animation curve synchronization** - Keyboard animation curves are now properly passed through (`animationCurve` from notifications)
3. **Performance caching** - Already implemented:
   - Translation cache for KVO path
   - Skip updates if transform unchanged
   - Cached height values to avoid redundant calculations
4. **CATransaction management** - Properly using `setDisableActions:YES` for instant updates

#### Issues & Optimization Opportunities 🔧

##### 1. **Redundant Transform Updates** (High Priority)
**Issue**: Multiple KVO callbacks can trigger the same transform update within a single animation frame.

**Current Code Pattern**:
```objc
// In KVO callback - may fire multiple times per frame
[strongSelf applyToolbarTranslation:trans
                        animated:(settleDuration > 0) 
                        duration:settleDuration
                           curve:strongSelf->animationCurve];
```

**Optimization**:
- Add a flag to track if an animation is already in progress
- Defer updates until the current animation completes
- Use `dispatch_async` to batch rapid callbacks

**Expected Impact**: Reduce CPU usage by 15-20% during keyboard animations

---

##### 2. **Spring Animation Curve Mismatch** (Medium Priority)
**Issue**: Interactive swipe uses spring physics (`UICollisionBehavior`), but toolbar uses linear interpolation from KVO.

**Current Behavior**:
- Keyboard swipe: Spring curve (non-linear, bouncy)
- Toolbar tracking: Linear interpolation from KVO delta

**Optimization**:
- Phase 2 (from ANIMATION_SYNC_PLAN.md) - Use `CALayer.affineTransform` directly for spring tracking
- Apply the same transform to toolbar during swipe interaction
- Only reset to UIView animation when keyboard settles

**Implementation**:
```objc
// In KVO callback during swipe:
if (isInteractiveSwipe) {
    // Direct layer transform for 120Hz smoothness
    [CATransaction begin];
    [CATransaction setDisableActions:YES];
    toolbarview.layer.affineTransform = CGAffineTransformMakeTranslation(0, -deltaY);
    [CATransaction commit];
}
```

---

##### 3. **ContentInset Updates During Animation** (Medium Priority)
**Issue**: `applyScrollViewInset` may be called multiple times with same values.

**Optimization**:
- Cache the last applied inset value
- Only update if the inset has actually changed
- Add threshold check for floating-point comparisons

```objc
// In applyScrollViewInset:
if (fabs(newBottom - cachedContentInsetBottom) < 1.0) {
    return; // Skip redundant updates
}
cachedContentInsetBottom = newBottom;
```

---

##### 4. **AutoScrollToBottom Animation Overlap** (Medium Priority)
**Issue**: Multiple scroll animations can queue up during rapid keyboard show/hide cycles.

**Current Pattern**:
```objc
[UIView animateWithDuration:keyboardTransitionDuration
                      delay:0
                    options:(self->animationCurve << 16) | UIViewAnimationOptionBeginFromCurrentState
                 animations:^{
                     sv.contentOffset = targetOffset;
                 } completion:nil];
```

**Optimization**:
- Cancel any pending scroll animation before starting new one
- Use `UIView.getAnimations()` to check for active animations
- Implement animation queue with max depth of 1

```objc
// Before starting new scroll animation:
[scrollView cancelAnimations]; // or remove all animations from layer
```

---

##### 5. **Memory Leaks in KVO Observers** (Low Priority)
**Issue**: KVO callbacks hold strong references to `self`, potentially creating retain cycles.

**Current Pattern**:
```objc
__weak TiKeyboardControlViewProxy *weakSelf = self;
[observer setBlock:^{
    TiKeyboardControlViewProxy *strongSelf = weakSelf;
    if (!strongSelf) return;
    // ... rest of callback
}];
```

**Status**: Already using weak reference pattern ✅

---

##### 6. **Unnecessary Animation Duration Zero Checks** (Low Priority)
**Issue**: Checking `duration > 0` on every update.

**Optimization**:
- Cache animation state as boolean flag
- Set flag once when keyboard state changes
- Check flag instead of recalculating duration

```objc
// In initPanning or keyboard state change:
usesZeroDuration = (keyboardVisible || manualKeyboardResize);
```

---

### Android Implementation

#### Strengths ✅
1. **WindowInsetsAnimationController** - Modern API for IME animation control
2. **SpringAnimation for fling** - Uses `SpringForce` with proper damping
3. **Nested scrolling support** - Properly integrates with CoordinatorLayout

#### Issues & Optimization Opportunities 🔧

##### 1. **LinearInterpolator Limitation** (Medium Priority)
**Issue**: Always uses `LinearInterpolator`, can't customize animation curve.

**Current Code**:
```java
private final LinearInterpolator linearInterpolator = new LinearInterpolator();
```

**Optimization**:
- Make interpolator configurable via module property
- Support common curves: EaseInOut, EaseIn, EaseOut, Overshoot
- Map Titanium animation curves to Android interpolators

```java
// Add to module properties:
public static final int ANIMATION_CURVE_EASE_IN_OUT = 0;
public static final int ANIMATION_CURVE_EASE_IN = 1;
public static final int ANIMATION_CURVE_EASE_OUT = 2;

// Map to Android interpolators:
switch (animationCurve) {
    case ANIMATION_CURVE_EASE_IN_OUT:
        interpolator = new AccelerateDecelerateInterpolator();
        break;
    case ANIMATION_CURVE_EASE_IN:
        interpolator = new AccelerateInterpolator();
        break;
    case ANIMATION_CURVE_EASE_OUT:
        interpolator = new DecelerateInterpolator();
        break;
}
```

---

##### 2. **Spring Animation Stiffness Hardcoded** (Low Priority)
**Issue**: Uses `STIFFNESS_MEDIUM` which may not be optimal for all devices.

**Current Code**:
```java
.setStiffness(SpringForce.STIFFNESS_MEDIUM)
```

**Optimization**:
- Make stiffness configurable via module property
- Adjust for device characteristics (high refresh rate displays need higher stiffness)
- Provide presets: Smooth, Responsive, Bouncy

---

##### 3. **Multiple Callback Registration** (Medium Priority)
**Issue**: Both `toolbarCallback` and `scrollviewCallback` may process same inset changes.

**Current Code**:
```java
TranslateDeferringInsetsAnimationCallback toolbarCallback = new TranslateDeferringInsetsAnimationCallback(...);
TranslateDeferringInsetsAnimationCallback scrollviewCallback = new TranslateDeferringInsetsAnimationCallback(...);
ViewCompat.setWindowInsetsAnimationCallback(toolbarview, toolbarCallback);
ViewCompat.setWindowInsetsAnimationCallback(scrollingView, scrollviewCallback);
```

**Optimization**:
- Use single callback on root container
- Distribute inset changes via event bus or direct method calls
- Avoid duplicate layout passes

---

### Cross-Platform Optimizations

#### 1. **Animation Synchronization** (High Priority)
**Issue**: Toolbar and scroll view animations may desynchronize on slower devices.

**Optimization**:
- Use shared animation timing source
- Implement animation frame callback synchronization
- Add visual debugging overlay to verify sync

```objc
// iOS: Use CADisplayLink for synchronized updates
CADisplayLink *displayLink = [CADisplayLink displayLinkWithTarget:self 
                                                           selector:@selector(synchronizedUpdate)];
displayLink.frameInterval = 1; // 60Hz or 120Hz depending on device
displayLink.paused = NO;
```

---

#### 2. **Memory Optimization During Animation** (Medium Priority)
**Issue**: Large bitmap allocations during animation can cause GC pauses.

**Optimization**:
- Reuse animation buffers
- Pre-allocate transform matrices
- Avoid object allocation in animation loops

---

## Implementation Priority

### Phase 1: Quick Wins (1-2 days) ✅ DONE
1. ✅ Animation curve synchronization (bereits vorher gemacht)
2. ✅ Transform update deduplication (`_isAnimatingToolbar` flag in `applyToolbarTranslation:`)
3. ✅ Cache last applied inset values (`_cachedContentInsetBottom` in `applyScrollViewInset:`)
4. ✅ Cancel pending scroll animations ([sv.layer removeAllAnimations] in `scrollToBottomIfNeeded`)

### Phase 2: Medium Effort (3-5 days)
1. ✅ Android interpolator konfigurierbar machen (`setAnimationCurve()` mit EASE_IN_OUT/EASE_IN/EASE_OUT/LINEAR)
2. Direct CALayer tracking during swipe (Phase 2 from ANIMATION_SYNC_PLAN.md) — **nicht implementiert**
3. Single callback registration for Android — **nicht implementiert**
4. Animation frame synchronization — **nicht implementiert**

### Phase 3: Advanced Optimizations (5-7 days)
1. CADisplayLink-based synchronized updates — **nicht implementiert**
2. Memory optimization in animation loops — **nicht implementiert**
3. Performance testing and profiling — **nicht implementiert**
4. Visual debugging tools — **nicht implementiert**

---

## Testing Strategy

### Performance Metrics
- **Frame time**: Target < 16.6ms (60fps) or < 8.3ms (120fps)
- **CPU usage**: < 15% during keyboard animation
- **Memory delta**: < 5MB during animation
- **Jank count**: Zero visible janks in 100 animation cycles

### Test Scenarios
1. Rapid keyboard show/hide (10x in 5 seconds)
2. Swipe to dismiss followed by programmatic show
3. Tab navigation during keyboard animation
4. Complex layouts with nested scroll views
5. Low-memory conditions

---

## Success Criteria

- [x] iOS: Transform deduplication implemented (redundant updates skipped)
- [x] iOS: Content inset caching implemented (skips < 1.0 threshold changes)
- [x] Android: Interpolator configurable via `setAnimationCurve()`
- [ ] All animations run at 60fps minimum on iPhone 8 / Android API 21
- [ ] CPU usage < 15% during keyboard animations
- [ ] Zero visible janks in test scenarios
- [ ] Animation curve matches keyboard curve exactly
- [ ] Memory usage stable across 1000 animation cycles

---

## References

- [iOS Animation Performance](https://developer.apple.com/documentation/uikit/animations)
- [Android WindowInsetsAnimation](https://developer.android.com/reference/android/view/WindowInsetsAnimation)
- [CADisplayLink Documentation](https://developer.apple.com/documentation/quartzcore/cadisplaylink)
- [SpringAnimation Guide](https://developer.android.com/reference/androidx/dynamicanimation.animation.SpringAnimation)

---

## Validation Summary (2025-06-08)

### Implemented & Verified ✅
| Optimierung | iOS | Android | Status |
|-------------|-----|---------|--------|
| Transform deduplication | `_isAnimatingToolbar` flag | — | ✅ Compiliert, getestet |
| Content inset caching | `_cachedContentInsetBottom` (< 1.0 threshold) | — | ✅ Compiliert, getestet |
| Scroll animation cancellation | `[sv.layer removeAllAnimations]` | — | ✅ Compiliert, getestet |
| Configurable interpolator | — | `setAnimationCurve()` mit 4 curves | ✅ Implementiert |

### Noch offen 🔧
| Optimierung | Priorität | Aufwand |
|-------------|-----------|----------|
| Direct CALayer swipe tracking | Medium | 1-2 Tage |
| Single callback registration (Android) | Medium | 1 Tag |
| Animation frame synchronization | High | 2-3 Tage |
| CADisplayLink updates | Low | 1 Tag |
| Performance testing & profiling | High | 2-3 Tage |

### Kompilierung ✅
- iOS Module: `de.marcbender.keyboardcontrol-iphone-2.1.4.zip` erfolgreich gebaut
- Alle 3 Targets (iPhone OS, Simulator, Mac Catalyst) ohne Errors/Warnings kompiliert
