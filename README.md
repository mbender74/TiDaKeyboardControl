# TiDaKeyboardControl
## de.marcbender.keyboardcontrol

Titanium module for interactive keyboard dismiss for iOS and Android (from API level 30+ / Android 11).

iOS was mostly rewritten for iOS 16+ compatibility with smooth 120Hz keyboard tracking.

## Platform Parity

| Property | iOS | Android | Notes |
|---|:---:|:---:|---|
| `scrollingView` | :white_check_mark: | :white_check_mark: | Required on both platforms |
| `toolbarView` | :white_check_mark: | :white_check_mark: | Required on both platforms |
| `parentWindow` | :white_check_mark: | — | Required on iOS for coordinate calculations, TabGroup detection, and safe area handling |
| `textfield` | :white_check_mark: | — | Required on iOS for interactive dismiss and first-responder tracking |
| `keyboardPanning` | :white_check_mark: | — | On iOS: enables swipe-to-dismiss. On Android: handled automatically via WindowInsetsAnimation |
| `autoAdjustBottomPadding` | :white_check_mark: | :white_check_mark: | iOS uses `contentInset.bottom`; Android uses RecyclerView bottom padding |
| `autoSizeAndKeepScrollingViewAboveToolbar` | :white_check_mark: | :white_check_mark: | iOS uses `bottom` layout constraint; Android adjusts view bottom property |
| `autoScrollToBottom` | :white_check_mark: | :white_check_mark: | iOS animates in sync with keyboard curve; Android uses `scrollToPosition` or `fullScroll` |
| `ignoreExtendSafeArea` | :white_check_mark: | — | iOS only — Android uses `setDecorFitsSystemWindows(false)` unconditionally |
| `showKeyboardOnScrollUp` | :white_check_mark: | :white_check_mark: | iOS calls `becomeFirstResponder` on overscroll; Android uses `WindowInsetsAnimation` |

## Property Interactions

### Layout Mode Interaction

The two layout properties are mutually exclusive. Setting `autoSizeAndKeepScrollingViewAboveToolbar: true` forces `autoAdjustBottomPadding` to `false` internally.

| `autoAdjustBottomPadding` | `autoSizeAndKeepScrollingViewAboveToolbar` | Result |
|---|---|---|
| `false` (default) | `false` (default) | No layout adjustment. The toolbar overlaps scroll content when the keyboard appears. Use only if you handle layout yourself. |
| `true` | `false` | **ContentInset mode.** Scroll view keeps full height. `contentInset.bottom` is increased so content scrolls behind the translucent toolbar. |
| `false` | `true` | **AutoSize mode.** Scroll view physically resizes via `bottom` constraint. Content never appears behind the toolbar. |
| `true` | `true` | Same as `false`/`true` — `autoSizeAndKeepScrollingViewAboveToolbar` takes priority and forces `autoAdjustBottomPadding` to `false`. |

### `autoScrollToBottom` Interaction with Layout Mode

`autoScrollToBottom` works differently depending on which layout mode is active:

| Layout Mode | Scroll Target Calculation |
|---|---|
| `autoAdjustBottomPadding: true` | `contentSize.height - frame.height + contentInset.bottom + safeAreaInsets.bottom` |
| `autoSizeAndKeepScrollingViewAboveToolbar: true` | `contentSize.height - frame.height + translation + toolbarHeight + safeAreaInsets.bottom` |

### `ignoreExtendSafeArea` Interaction with Window Context

`ignoreExtendSafeArea` only has an effect when the parent window has `extendSafeArea: true`. The module auto-detects the window context:

| Window Context | `extendSafeArea` | `ignoreExtendSafeArea` | Toolbar Behavior |
|---|---|---|---|
| Standalone window | `true` | `false` (default) | Toolbar shifted up by safe area inset (above home indicator) |
| Standalone window | `true` | `true` | Toolbar extends into safe area (home indicator area) |
| Standalone window | `false` | ignored | No safe area adjustment needed |
| TabGroup / NavigationWindow | any | ignored | Module auto-adjusts for tab bar and nav bar offsets |

### Property Dependency Graph

```
scrollingView ─────────────────────────┐
toolbarView ────────────────────────────┤ Required inputs
parentWindow (iOS) ─────────────────────┤
textfield (iOS) ────────────────────────┘
        │
        ▼
keyboardPanning (iOS) ──► enables interactive swipe-to-dismiss
showKeyboardOnScrollUp ──► enables show-on-overscroll-at-bottom
        │
        ▼
  ┌─────┴─────────────────────────┐
  │  Layout Mode (pick one):       │
  │  autoAdjustBottomPadding: true  │──► contentInset.bottom approach
  │  OR                            │
  │  autoSizeAndKeepScrollingView  │──► bottom constraint approach
  │  AboveToolbar: true            │    (forces autoAdjustBottomPadding=false)
  └─────┬─────────────────────────┘
        │
        ├──► autoScrollToBottom ──────► scroll target depends on layout mode
        │
        └──► ignoreExtendSafeArea ───► only affects standalone + extendSafeArea windows
```

### What Each Property Affects

| Property | Initial Setup | Keyboard Show | Keyboard Hide | Toolbar Resize | Interactive Swipe |
|---|---|---|---|---|---|
| `autoAdjustBottomPadding` | Sets `contentInset.bottom += toolbarHeight` | Updates `contentInset.bottom = translation + toolbarHeight` | Resets `contentInset.bottom` | Updates `contentInset.bottom` | Updates `contentInset.bottom` via KVO |
| `autoSizeAndKeepScrollingViewAboveToolbar` | Sets `bottom = initialBottom + toolbarHeight` | Sets `bottom = initialBottom + toolbarHeight + translation` | Sets `bottom = initialBottom + toolbarHeight` | Sets `bottom = initialBottom + toolbarHeight + translation` | Sets `bottom` via KVO delta |
| `autoScrollToBottom` | — | Scrolls to bottom (animated in sync with keyboard) | — | Scrolls to bottom (immediate) | Scrolls to bottom on settle |
| `ignoreExtendSafeArea` | Adjusts toolbar transform and `contentInset.bottom` correction | — | — | — | — |
| `keyboardPanning` | Attaches `UIPanGestureRecognizer` and `BABFrameObservingInputAccessoryView` | — | — | — | Drives KVO callbacks for 120Hz toolbar tracking |
| `showKeyboardOnScrollUp` | Installs `UIScrollViewDelegate` proxy | — | — | — | Calls `becomeFirstResponder` on overscroll at bottom |

## Quick Start

```javascript
var keyboardControlModule = require('de.marcbender.keyboardcontrol');

var interactiveKeyboardView = keyboardControlModule.createView({
    // Required properties
    scrollingView: tableView,       // Ti.UI.ListView, Ti.UI.TableView, or Ti.UI.ScrollView
    toolbarView: toolbarContainer,  // Ti.UI.View containing your input bar

    // iOS required
    parentWindow: win,               // The window this view belongs to (iOS only)
    textfield: textArea,            // Ti.UI.TextArea or Ti.UI.TextField (iOS only)
    keyboardPanning: true,          // Enable interactive keyboard dismiss (iOS only)

    // Optional behavior
    showKeyboardOnScrollUp: true,  // Show keyboard on overscroll at bottom (iOS + Android)
    autoAdjustBottomPadding: true,
    // OR
    autoSizeAndKeepScrollingViewAboveToolbar: true,

    // Optional
    autoScrollToBottom: true,
    ignoreExtendSafeArea: false,
    showKeyboardOnScrollUp: true,   // Android only

    top: 0,
    bottom: 0
});
win.add(interactiveKeyboardView);
```

## Properties Reference

### Required Properties

| Property | Type | Platform | Description |
|---|---|---|---|
| `scrollingView` | View | iOS, Android | The scrollable view (ListView, TableView, or ScrollView). Automatically added as a child of the interactiveKeyboardView. |
| `toolbarView` | View | iOS, Android | The toolbar/input bar view. Must be a `Ti.UI.View`. Automatically added as a child. |

### iOS-Only Required Properties

| Property | Type | Description |
|---|---|---|
| `parentWindow` | Window | The window containing the interactiveKeyboardView. Required for correct coordinate calculations, TabGroup detection, and safe area handling. |
| `textfield` | TextArea/TextField | The text input view (`Ti.UI.TextArea` or `Ti.UI.TextField`) inside your toolbar. Required for interactive keyboard dismiss and first-responder tracking. |
| `keyboardPanning` | Boolean | When `true`, enables interactive keyboard dismiss (swipe to dismiss). Default: `false`. |

### `showKeyboardOnScrollUp` (default: `false`, iOS and Android)

When `true`, overscrolling upward at the bottom of the scroll view (pulling content up past the last item) will show the keyboard if it's currently hidden. This provides a "pull-to-refresh at the bottom" style interaction — the user drags up at the bottom and the keyboard slides in.

**iOS behavior:** Uses a `UIScrollViewDelegate` proxy to detect when the user is dragging and has scrolled to or past the bottom. When detected, `becomeFirstResponder` is called on the text field/text view. The proxy transparently forwards all other delegate calls to Titanium's original delegate, so scroll events continue to work normally.

**Android behavior:** Uses `WindowInsetsAnimation` and nested scrolling APIs to progressively reveal the keyboard as the user drags up.

**Conditions for triggering (iOS):**
1. `showKeyboardOnScrollUp` is `true`
2. User is actively dragging (not programmatic scroll)
3. One-shot per drag gesture (resets on next drag start or keyboard hide)
4. Keyboard is not currently visible
5. Content offset is at or past the bottom of scrollable content
6. Content is scrollable (`contentSize.height > frame.size.height`)

## Layout Mode Properties

These two properties control how the scroll view and toolbar relate to each other when the keyboard appears. They are mutually exclusive: if `autoSizeAndKeepScrollingViewAboveToolbar` is set to `true`, `autoAdjustBottomPadding` is forced to `false`.

### `autoAdjustBottomPadding` (default: `false`)

When `true`, the scroll view keeps its full height and its `contentInset.bottom` is increased so content can scroll **behind** the toolbar. The toolbar overlays the scroll content (useful with translucent/blur toolbars where content is visible underneath).

**How it works:**

1. **Initial setup**: Before the keyboard appears, `contentInset.bottom` is set to `currentInset + toolbarHeight`. If `extendSafeArea` is true, a correction is applied to avoid double-counting the safe area.
2. **During keyboard show/hide**: `contentInset.bottom` is dynamically updated to `translation + toolbarHeight`, where `translation` is the toolbar's vertical offset from its resting position. This keeps scroll content accessible above the keyboard.
3. **When keyboard is hidden**: `contentInset.bottom` returns to its initial value (safe area inset only).

Use this mode when you want a translucent or blurred toolbar where the scroll content peeks through underneath.

### `autoSizeAndKeepScrollingViewAboveToolbar` (default: `false`)

When `true`, the scroll view **physically resizes** via its `bottom` layout constraint so it always sits above the toolbar. Content never scrolls behind the toolbar — the scroll view ends where the toolbar begins.

**How it works:**

1. **Initial setup**: The scroll view's `bottom` constraint is set to `initialScrollingViewBottomValue + toolbarHeight`.
2. **During keyboard show/hide**: The `bottom` constraint is updated to `initialScrollingViewBottomValue + toolbarHeight + translation`. The scroll view shrinks as the keyboard appears and grows as it dismisses.
3. **Content inset is NOT modified** — `applyScrollViewInset:` is skipped entirely in this mode.
4. **When keyboard is hidden**: The `bottom` constraint returns to `initialScrollingViewBottomValue + toolbarHeight`.

Use this mode when you want opaque toolbars or need scroll content to never appear behind the input bar.

### Comparison

| Aspect | `autoAdjustBottomPadding: true` | `autoSizeAndKeepScrollingViewAboveToolbar: true` |
|---|---|---|
| Scroll view height | Stays full-screen | Shrinks above toolbar |
| Layout mechanism | `contentInset.bottom` | `bottom` layout constraint |
| Content behind toolbar | Yes (visible through translucent toolbar) | No (scroll view ends above toolbar) |
| Use case | Blur/translucent toolbars | Opaque toolbars, chat-style layouts |
| `autoScrollToBottom` target | Scrolls to bottom of content including inset | Scrolls to bottom of resized scroll view |

## Behavior Properties

### `autoScrollToBottom` (default: `false`)

When `true`, the scroll view automatically scrolls to the bottom when:
- The keyboard appears
- The toolbar resizes (e.g., multi-line text input grows)
- Interactive keyboard dismiss settles

The scroll animation is synchronized with the keyboard animation curve for smooth visual transitions.

**Behavior per layout mode:**
- With `autoAdjustBottomPadding`: scrolls to `contentSize.height - frame.height + contentInset.bottom + safeAreaInsets.bottom`
- With `autoSizeAndKeepScrollingViewAboveToolbar`: scrolls to `contentSize.height - frame.height + translation + toolbarHeight + safeAreaInsets.bottom`

### `ignoreExtendSafeArea` (default: `false`, iOS only)

Only relevant when the parent window has `extendSafeArea: true` and is a standalone window (not contained in a NavigationWindow or TabGroup — the module auto-detects this).

| `ignoreExtendSafeArea` | Behavior |
|---|---|
| `false` (default) | The toolbar is shifted up by the safe area bottom inset so it sits above the home indicator area. Content inset accounts for this. |
| `true` | The toolbar extends into the safe area (home indicator area). Content inset is not reduced by the safe area padding. |

**Note:** The module auto-detects whether the window is inside a NavigationWindow or TabGroup. If the window is inside a TabGroup, `extendSafeArea` handling is adjusted automatically regardless of this property.

## Window Context Detection

The module automatically detects the window hierarchy:

| Context | Detected as | Behavior |
|---|---|---|
| Standalone window | Neither TabGroup nor NavigationWindow | Standard safe area handling |
| Inside TabGroup | `isTabGroup = true` | Toolbar position accounts for tab bar height |
| Inside NavigationWindow | `isNavigationWindow = true` | Adjusts for navigation bar and safe area offsets |

The detected context affects:
- Toolbar translation calculation (TabGroup windows have a tab bar offset)
- Safe area handling (NavigationWindow manages safe area differently)
- Content inset corrections

## Cross-Tab Safety

When using TabGroups with multiple tabs, each containing its own `keyboardControlModule.createView()`, the module correctly isolates state per proxy instance:

- Keyboard notification handlers (`keyboardWillShow`, `keyboardDidShow`, `keyboardWillHide`, `keyboardDidHide`) check whether this proxy's text field is the first responder before applying changes
- `keyboardDidHide` guards against resetting an inactive tab's scroll view
- KVO callbacks are per-instance (each text field has its own input accessory view)

This prevents switching tabs from corrupting the inactive tab's scroll view layout.

## Examples

### TabGroup with Two Layout Modes

This example shows both `autoAdjustBottomPadding` and `autoSizeAndKeepScrollingViewAboveToolbar` in separate tabs:

```javascript
var ANDROID = (Ti.Platform.osname === 'android');
var keyboardControlModule = require('de.marcbender.keyboardcontrol');

var tabGroup = Ti.UI.createTabGroup();
tabGroup.addTab(createTab('AutoAdjustBottomPadding', '', 'assets/images/tab1.png'));
tabGroup.addTab(createTab('KeepScrollingViewAbove', '', 'assets/images/tab2.png'));

// For NavigationWindow wrapper:
var navigationWindow = Ti.UI.createNavigationWindow({ window: tabGroup });
navigationWindow.open();

// Or open TabGroup directly:
// tabGroup.open();

function createTab(title, message, icon) {
    var win = Ti.UI.createWindow({
        title: 'Test',
        barColor: '#365b85',
        backgroundColor: '#fff',
        extendSafeArea: false,
        sustainedPerformanceMode: true
    });

    var tableView = Ti.UI.createTableView({
        data: [/* your data */],
        top: 0,
        bottom: 0,
        width: Ti.UI.FILL,
        height: Ti.UI.FILL
    });

    var toolbarContainer = Ti.UI.createView({
        backgroundColor: '#aa2f53c3',
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        bottom: 0
    });

    var toolbarView = Ti.UI.createView({
        backgroundColor: (title === 'KeepScrollingViewAbove') ? 'blue' : 'red',
        layout: 'horizontal',
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        bottom: 5,
        top: 5
    });
    toolbarContainer.add(toolbarView);

    var textArea = Ti.UI.createTextArea({
        top: 8, bottom: 8, left: 15, right: 8,
        autocorrect: false,
        editable: true,
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 16,
        color: '#000',
        backgroundColor: '#fff',
        font: { fontSize: 16, fontWeight: 'bold' },
        textAlign: 'left',
        value: '',
        width: '70%',
        height: Ti.UI.SIZE,
        suppressReturn: false
    });

    var sendButton = Ti.UI.createButton({
        title: 'Send',
        style: Ti.UI.BUTTON_STYLE_FILLED,
        backgroundColor: 'blue',
        tintColor: '#fff',
        borderRadius: 12,
        width: Ti.UI.FILL,
        right: 10,
        bottom: ANDROID ? 5 : 10
    });

    toolbarView.add(textArea);
    toolbarView.add(sendButton);

    if (ANDROID) {
        var interactiveKeyboardView = keyboardControlModule.createView({
            showKeyboardOnScrollUp: true,
            autoAdjustBottomPadding: (title !== 'KeepScrollingViewAbove'),
            autoScrollToBottom: true,
            autoSizeAndKeepScrollingViewAboveToolbar: (title === 'KeepScrollingViewAbove'),
            scrollingView: tableView,
            toolbarView: toolbarContainer,
            backgroundColor: '#fefefe',
            top: 0,
            bottom: 0
        });
        win.add(interactiveKeyboardView);
    } else {
        var interactiveKeyboardView = keyboardControlModule.createView({
            parentWindow: win,
            autoAdjustBottomPadding: (title !== 'KeepScrollingViewAbove'),
            autoScrollToBottom: true,
            autoSizeAndKeepScrollingViewAboveToolbar: (title === 'KeepScrollingViewAbove'),
            ignoreExtendSafeArea: false,
            scrollingView: tableView,
            toolbarView: toolbarContainer,
            textfield: textArea,
            keyboardPanning: true,
            backgroundColor: '#fefefe',
            top: 0,
            bottom: 0
        });
        win.add(interactiveKeyboardView);
    }

    return Ti.UI.createTab({ title: title, icon: icon, window: win });
}
```

### Standalone Window with AutoAdjustBottomPadding

Use this for a translucent/blur toolbar where content scrolls underneath:

```javascript
var win = Ti.UI.createWindow({
    backgroundColor: '#fff',
    extendSafeArea: false
});

var tableView = Ti.UI.createTableView({
    data: [/* your data */],
    top: 0, bottom: 0,
    width: Ti.UI.FILL, height: Ti.UI.FILL
});

var toolbarContainer = Ti.UI.createView({
    backgroundColor: '#aa2f53c3', // translucent
    width: Ti.UI.FILL, height: Ti.UI.SIZE, bottom: 0
});

var textArea = Ti.UI.createTextArea({
    top: 8, bottom: 8, left: 15, right: 8,
    width: '70%', height: Ti.UI.SIZE
});

var sendButton = Ti.UI.createButton({ title: 'Send', width: Ti.UI.FILL, right: 10 });

var toolbarInner = Ti.UI.createView({ layout: 'horizontal', width: Ti.UI.FILL, height: Ti.UI.SIZE });
toolbarInner.add(textArea);
toolbarInner.add(sendButton);
toolbarContainer.add(toolbarInner);

var interactiveKeyboardView = keyboardControlModule.createView({
    parentWindow: win,
    autoAdjustBottomPadding: true,          // contentInset mode
    autoSizeAndKeepScrollingViewAboveToolbar: false,
    autoScrollToBottom: true,
    scrollingView: tableView,
    toolbarView: toolbarContainer,
    textfield: textArea,
    keyboardPanning: true,
    top: 0, bottom: 0
});

win.add(interactiveKeyboardView);
win.open();
```

### Standalone Window with AutoSize (Opaque Toolbar)

Use this for a chat-style layout where the scroll view sits above the toolbar:

```javascript
var win = Ti.UI.createWindow({
    backgroundColor: '#fff',
    extendSafeArea: false
});

var tableView = Ti.UI.createTableView({
    data: [/* your data */],
    top: 0, bottom: 0,  // bottom:0 — the module will resize via bottom constraint
    width: Ti.UI.FILL, height: Ti.UI.FILL
});

var toolbarContainer = Ti.UI.createView({
    backgroundColor: '#ffffff', // opaque
    width: Ti.UI.FILL, height: Ti.UI.SIZE, bottom: 0
});

var textArea = Ti.UI.createTextArea({
    top: 8, bottom: 8, left: 15, right: 8,
    width: '70%', height: Ti.UI.SIZE
});

var sendButton = Ti.UI.createButton({ title: 'Send', width: Ti.UI.FILL, right: 10 });

var toolbarInner = Ti.UI.createView({ layout: 'horizontal', width: Ti.UI.FILL, height: Ti.UI.SIZE });
toolbarInner.add(textArea);
toolbarInner.add(sendButton);
toolbarContainer.add(toolbarInner);

var interactiveKeyboardView = keyboardControlModule.createView({
    parentWindow: win,
    autoAdjustBottomPadding: false,             // must be false when autoSize is true
    autoSizeAndKeepScrollingViewAboveToolbar: true,  // bottom constraint mode
    autoScrollToBottom: true,
    scrollingView: tableView,
    toolbarView: toolbarContainer,
    textfield: textArea,
    keyboardPanning: true,
    top: 0, bottom: 0
});

win.add(interactiveKeyboardView);
win.open();
```

## iOS Demo

<img src="./keyboardcontrol-ios.gif" width="320" alt="Example iOS" />