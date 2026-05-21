# Fix: contentInset.bottom not updated for keyboard — last items hidden behind keyboard

## Context

When the keyboard appears, `autoScrollToBottom` scrolls to make the last item visible above it. But `contentInset.bottom` stays at ~27 (safe area) instead of being increased for the keyboard height (~379). Items end up hidden behind the keyboard.

**Root cause**: In `keyboardWillShow`, autoScrollToBottom offset is computed using old `contentInset.bottom` (~27, line 1036), then animated (lines 1043-1050). After that, only `applyToolbarTranslation:` is called (line 1059) — it updates toolbar transform but does **NOT** update scroll view insets. The inset update is supposed to come from the KVO block (`inputAcessoryViewFrameChangedBlock`), but no "KVO SETTLED" log appears after keyboardWillShow/keyboardDidShow, meaning either:
- The KVO callbacks don't fire during keyboard animation (iOS uses private containers for accessory view positioning), OR
- They fire with stale accessory view frame data

Result: `contentInset.bottom` stays at ~27 throughout the keyboard animation. We scroll to offset 723 based on old inset, but the visible area has shrunk — items hidden behind keyboard.

## Files to modify

**`ios/Classes/TiKeyboardControlViewProxy.m`**

### Change 1: Apply correct insets in `keyboardWillShow` before computing autoScrollToBottom

In `keyboardWillShow:` (line ~1032), **before** the autoScrollToBottom block, call `applyScrollViewInset:` using the keyboard frame from userInfo. This ensures `contentInset.bottom` is set to keyboard height + toolbar offset BEFORE we compute the scroll position.

The current code at lines 1032-1052:
```objc
// Scroll to bottom BEFORE keyboard animation starts (ANIMATED at same speed as keyboard)
if (self->autoScrollToBottom == true && self->_scrollingView != nil) {
    UIScrollView *scrollView = self->nativeScrollView;
    if (scrollView != nil && scrollView.contentSize.height > scrollView.frame.size.height) {
        CGFloat bottomHeight = scrollView.contentSize.height - scrollView.frame.size.height + scrollView.contentInset.bottom + self->bottomPadding;
```

Fix: Extract the keyboard frame into `lastInputAccessoryViewFrame` so that `applyScrollViewInset:` can compute correct insets from it. The key insight is that `applyScrollViewInset:` calls `computeToolbarTranslation:` which uses `initialAccessoryViewFrameYWhenHidden - inputAccessoryViewFrame.origin.y + bottomPadding`. When the accessory view moves up to cover the keyboard, this delta equals the keyboard height minus the initial Y position offset — giving us the correct inset.

**Approach**: Call `[self applyScrollViewInset:keyboardEndFrameWindow]` directly in `keyboardWillShow:` before computing autoScrollToBottom. This uses the keyboard frame as a proxy for the accessory view frame (they share the same bottom edge). The `computeToolbarTranslation:` method will derive the correct translation/inset from it.

### Change 2: Wrap inset update + scroll in a single animation block

Ensure both the contentInset change and contentOffset animation happen within the SAME UIView animation block with keyboard timing, so they animate together smoothly.

```objc
// In keyboardWillShow:, before autoScrollToBottom:
if (nativeScrollView != nil) {
    [self applyScrollViewInset:keyboardEndFrameWindow];
}

// Then compute and animate autoScrollToBottom using the updated inset
```

### Change 3: Fix `scrollToBottomIfNeeded:` to use keyboard-aware inset

In `scrollToBottomIfNeeded` (line ~1250), the calculation also uses stale `contentInset.bottom`. Since by this point insets should already be correct, add a safety check — if contentInset.bottom is less than expected for current keyboard state, recalculate:

```objc
- (void)scrollToBottomIfNeeded {
    // ...existing guard...

    // Ensure inset accounts for keyboard height
    CGFloat effectiveInset = nativeScrollView.contentInset.bottom;
    if (!keyboardVisible || effectiveInset <= 0) {
        effectiveInset = bottomPadding;
    }

    CGFloat bottomHeight = sv.contentSize.height - sv.frame.size.height + effectiveInset + tabgroupHeight;
```

## Verification

1. Build the iOS module: `ti build -p ios`
2. Test in the example app: focus a text field that requires scrolling, bring up the keyboard
3. Verify last item is fully visible above the keyboard (not hidden behind it)
4. Verify smooth animation — scroll position and inset change together with keyboard animation
5. Test edge cases: multiple text fields at different positions, rapid focus changes
