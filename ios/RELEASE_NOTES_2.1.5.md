# Release Notes v2.1.5

## Animation Performance Improvements

### Spring Physics Animation
- Toolbar now uses spring physics animation (`usingSpringWithDamping`) to perfectly sync with iOS keyboard animation
- **Damping:** 1.0 (smooth settle, no overshoot)
- **Delay:** Toolbar starts animating when keyboard reaches toolbar level (26% of distance ratio)
- **Duration:** Automatically adjusted to ensure toolbar and keyboard finish simultaneously

### What's Fixed
- ✅ Toolbar no longer jumps/snaps when keyboard animates with spring physics (swipe completion)
- ✅ Toolbar animation timing matches keyboard - starts later, finishes together
- ✅ Smooth, natural animation without overshoot or visual glitches

### Technical Details
- Keyboard frame tracking via `UIKeyboardFrameBeginUserInfoKey` and `UIKeyboardFrameEndUserInfoKey`
- Delay calculation: `delay = keyboardDuration × (keyboardDistance - toolbarDistance) / keyboardDistance × 0.26`
- Toolbar duration: `keyboardDuration - delay`
- Spring animation with `UIViewAnimationOptionBeginFromCurrentState` for seamless transition from current position

### Logging (available but commented out)
- `[KEYBOARD]` - Keyboard frame info (start/end/duration/curve)
- `[INTERP-LINEAR]` - Linear interpolation frames (60fps)
- `[INTERP-SPRING]` - Spring interpolation frames with overshoot simulation
- `[TOOLBAR]` - Toolbar animation params (distance/delay/duration/damping)

---
**Build:** 2.1.5  
**Date:** 2026-06-08  
**Branch:** feature/optimizations
