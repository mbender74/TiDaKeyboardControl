# Scroll Indicator Analysis - Swipe-to-Dismiss Issue

## Problem Statement

When `autoAdjustBottomPadding: true` and the keyboard is up, **swiping down** should grow the scroll indicator as content becomes accessible again. However, the scroll indicator only resizes correctly when the keyboard is hidden, not during the swipe gesture itself.

## Root Cause Analysis

### The Issue Flow

1. **Keyboard appears**: `keyboardWillShow` calls `applyScrollViewInset` which sets `contentInset.bottom = translation + toolbarHeight`
2. **User swipes down**: KVO callbacks track the accessory view movement
3. **Problem**: The scroll indicator (`verticalScrollIndicatorInsets`) is set but iOS doesn't update it during the swipe animation

### Key Code Path

**In `applyScrollViewInset` (line 1646-1683)**:
```objc
- (void)applyScrollViewInset:(CGRect)inputAccessoryFrame translation:(CGFloat)translation {
    // ...
    UIEdgeInsets newInsets = UIEdgeInsetsMake(
        nativeScrollView.contentInset.top, 0, bottomInset, 0
    );
    [nativeScrollView setContentInset:newInsets];
    nativeScrollView.scrollIndicatorInsets = newInsets;  // ← This is set
}
```

**In the KVO block (line 781-794)**:
```objc
// Normal swipe during settled keyboard — CALayer für 120Hz smoothness
} else if (!strongSelf->manualKeyboardResize && fabs(deltaY) >= kTIDKBCSettleThreshold) {
    // Toolbar translation via CALayer (120Hz)
    [CATransaction begin];
    [CATransaction setDisableActions:YES];
    strongSelf->toolbarview.layer.affineTransform = newTransform;
    [CATransaction commit];

    // Update autoSize bottom constraint to follow swipe (without animation)
    [UIView performWithoutAnimation:^{
        [strongSelf applyAutoSizeBottomConstraintWithTranslation:strongSelf->settledShift - deltaY];
    }];
    // ❌ PROBLEM: applyScrollViewInset is NOT called here!
}
```

### Why It Fails During Swipe

1. **The KVO swipe path doesn't call `applyScrollViewInset`**: When swiping, the code only updates:
   - `toolbarview.layer.affineTransform` (CALayer for 120Hz smoothness)
   - `autoSize` bottom constraint
   - But NOT `contentInset.bottom` or `scrollIndicatorInsets`

2. **Only settled state updates insets**: The `applyScrollViewInset` is only called in:
   - `keyboardWillShow` (initial show)
   - "SETTLE BASELINE" path (first KVO callback after show)
   - "TRUE-SETTLED" path (when `keyboardInsetSettled = YES`)
   - **NOT during active swipe**

3. **iOS scroll indicator behavior**: The scroll indicator size is derived from:
   ```
   visibleScrollRange = contentSize - (contentInset.top + contentInset.bottom)
   indicatorSize = visibleScrollRange * (frame.height / contentSize.height)
   ```
   
   When `contentInset.bottom` isn't updated during swipe, the visible range doesn't reflect the keyboard height reduction.

### The "SETTLE" Logic

The code has a `keyboardInsetSettled` flag that prevents inset updates during animation to avoid drift:

```objc
// Skip inset updates until first KVO callback has settled
if (strongSelf->keyboardInsetSettled) {
    [strongSelf applyScrollViewInset:inputAccessoryViewFrame translation:cachedTrans];
} else {
    // SKIPPED inset (waiting for first callback post-show)
}
```

This was added to prevent `contentInset.bottom` from drifting during the keyboard animation, but it also blocks the scroll indicator from updating during swipe.

## The Fix

### Option 1: Update Insets During Swipe (Recommended)

Add `applyScrollViewInset` calls in the swipe path:

```objc
// Normal swipe during settled keyboard — CALayer für 120Hz smoothness
} else if (!strongSelf->manualKeyboardResize && fabs(deltaY) >= kTIDKBCSettleThreshold) {
    CGFloat newTy = -(strongSelf->settledShift) + deltaY;
    if (newTy > 0) newTy = 0;
    CGAffineTransform newTransform = CGAffineTransformMakeTranslation(0, newTy);

    [CATransaction begin];
    [CATransaction setDisableActions:YES];
    strongSelf->toolbarview.layer.affineTransform = newTransform;
    [CATransaction commit];

    // Update autoSize bottom constraint to follow swipe (without animation)
    [UIView performWithoutAnimation:^{
        [strongSelf applyAutoSizeBottomConstraintWithTranslation:strongSelf->settledShift - deltaY];
    }];
    
    // FIX: Also update contentInset.bottom for scroll indicator
    [strongSelf applyScrollViewInset:inputAccessoryViewFrame translation:cachedTrans];
}
```

### Option 2: Use a Separate Scroll Indicator Update

Create a dedicated method that only updates `scrollIndicatorInsets` without modifying the inset calculation logic:

```objc
- (void)updateScrollIndicatorInsets:(CGFloat)translation {
    if (autoSizeAndKeepScrollingViewAboveToolbar) return;
    
    CGRect toolbarFrame = toolbarview.frame;
    CGFloat bottomInset = translation + toolbarFrame.size.height;
    
    if (extendSafeArea) {
        bottomInset -= bottomPadding;
    }
    
    UIEdgeInsets newInsets = UIEdgeInsetsMake(
        nativeScrollView.contentInset.top, 0, bottomInset, 0
    );
    nativeScrollView.scrollIndicatorInsets = newInsets;
}
```

Then call this in the swipe path instead of full `applyScrollViewInset`.

## Verification Steps

1. **Test Case**: 
   - Create a long list with `autoAdjustBottomPadding: true`
   - Tap text field to show keyboard
   - Swipe down on toolbar
   - Observe scroll indicator should grow as swipe progresses

2. **Expected Behavior**:
   - Scroll indicator size should increase proportionally with swipe distance
   - When keyboard fully hidden, `contentInset.bottom` returns to safe area value
   - Scroll indicator returns to normal size

3. **Current Bug**:
   - Scroll indicator stays small during swipe
   - Only updates when keyboard fully hidden (`keyboardDidHide`)

## Related Code Paths

### Where Insets Are Updated (Working)
- `keyboardWillShow`: Sets initial inset via `applyScrollViewInset(keyboardEndFrameWindow)`
- "SETTLE BASELINE" KVO: First callback after show, sets `initialAccessoryViewFrame`
- "TRUE-SETTLED" KVO: When `fabs(deltaY) < threshold`, sets `keyboardInsetSettled = YES`

### Where Insets Are NOT Updated (Bug)
- Swipe path: Only updates CALayer transform and autoSize constraint
- Toolbar resize path: Updates CALayer and autoSize, but not insets

## Impact Assessment

**Low Risk**: The fix only affects the swipe-to-dismiss behavior when `autoAdjustBottomPadding: true`. The existing logic already handles inset updates for non-swipe scenarios.

**Testing Required**:
- Swipe to dismiss with `autoAdjustBottomPadding: true`
- Swipe to dismiss with `autoSizeAndKeepScrollingViewAboveToolbar: true` (should be no-op)
- Normal keyboard show/hide without swipe
- Toolbar resize during keyboard visible
