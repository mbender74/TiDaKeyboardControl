/*
 * Copyright 2020 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package de.marcbender.keyboardcontrol;

import android.content.Context;
import android.os.Build;
import android.util.AttributeSet;
import android.view.View;
import android.view.WindowInsetsAnimation;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.view.NestedScrollingParent3;
import androidx.core.view.NestedScrollingParentHelper;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import org.appcelerator.kroll.common.Log;

import java.util.Arrays;

import static androidx.core.view.ViewCompat.TYPE_TOUCH;


public final class InsetsAnimationLinearLayout extends LinearLayout implements NestedScrollingParent3 {
    private final NestedScrollingParentHelper nestedScrollingParentHelper = new NestedScrollingParentHelper(this);
    private final SimpleImeAnimationController imeAnimController = new SimpleImeAnimationController();
    private final int[] tempIntArray2 = new int[2];
    private final int[] startViewLocation = new int[2];

    private View currentNestedScrollingChild;
    private int dropNextY;
    private boolean scrollImeOffScreenWhenVisible = true;
    private boolean scrollImeOnScreenWhenNotVisible = true;
    private boolean scrollImeOffScreenWhenVisibleOnFling = false;
    private boolean scrollImeOnScreenWhenNotVisibleOnFling = false;

   public void showOnUp(boolean showOnScrollUp) {
       scrollImeOnScreenWhenNotVisible = showOnScrollUp;
   }



    public InsetsAnimationLinearLayout(final Context context, @Nullable final AttributeSet attrs) {
        super(context, attrs);
    }

    public InsetsAnimationLinearLayout(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    public final boolean getScrollImeOffScreenWhenVisible() {
        return scrollImeOffScreenWhenVisible;
    }

    public final void setScrollImeOffScreenWhenVisible(boolean scrollImeOffScreenWhenVisible) {
        this.scrollImeOffScreenWhenVisible = scrollImeOffScreenWhenVisible;
    }

    public final boolean getScrollImeOnScreenWhenNotVisible() {
        return scrollImeOnScreenWhenNotVisible;
    }

    public final void setScrollImeOnScreenWhenNotVisible(boolean scrollImeOnScreenWhenNotVisible) {
        this.scrollImeOnScreenWhenNotVisible = scrollImeOnScreenWhenNotVisible;
    }

    public boolean getScrollImeOffScreenWhenVisibleOnFling() {
        return scrollImeOffScreenWhenVisibleOnFling;
    }

    public void setScrollImeOffScreenWhenVisibleOnFling(final boolean scrollImeOffScreenWhenVisibleOnFling) {
        this.scrollImeOffScreenWhenVisibleOnFling = scrollImeOffScreenWhenVisibleOnFling;
    }

    public boolean getScrollImeOnScreenWhenNotVisibleOnFling() {
        return scrollImeOnScreenWhenNotVisibleOnFling;
    }

    public void setScrollImeOnScreenWhenNotVisibleOnFling(final boolean scrollImeOnScreenWhenNotVisibleOnFling) {
        this.scrollImeOnScreenWhenNotVisibleOnFling = scrollImeOnScreenWhenNotVisibleOnFling;
    }

    public SimpleImeAnimationController getImeAnimController() {
        return imeAnimController;
    }

    @Override
    public boolean onStartNestedScroll(@NonNull final View child,
                                       @NonNull final View target,
                                       final int axes,
                                       final int type) {

                       //Log.w("InsetsAnimationLinearLayout", "++++++++++++++++++++++++++++++++ onStartNestedScroll ");

        return (axes & SCROLL_AXIS_VERTICAL) != 0 && type == TYPE_TOUCH;
    }

    @Override
    public void onNestedScrollAccepted(@NonNull final View child,
                                       @NonNull final View target,
                                       final int axes,
                                       final int type) {
                               //Log.w("InsetsAnimationLinearLayout", "++++++++++++++++++++++++++++++++ onNestedScrollAccepted ");

        nestedScrollingParentHelper.onNestedScrollAccepted(child, target, axes, type);
        currentNestedScrollingChild = child;
    }

    @Override
    public void onNestedPreScroll(@NonNull final View target,
                                  final int dx,
                                  final int dy,
                                  @NonNull final int[] consumed,
                                  final int type) {

                               //Log.w("InsetsAnimationLinearLayout", "++++++++++++++++++++++++++++++++ onNestedPreScroll ");


        if (imeAnimController.isInsetAnimationRequestPending()) {
             //Log.w("InsetsAnimationLinearLayout", "++++++++++++++++++++++++++++++++ isInsetAnimationRequestPending ");

            consumed[0] = dx;
            consumed[1] = dy;
        } else {
            int deltaY = dy;
            if (dropNextY != 0) {
                consumed[1] = dropNextY;
                deltaY = dy - dropNextY;
                dropNextY = 0;
            }

               //Log.w("InsetsAnimationLinearLayout", "++++++++++++++++++++++++++++++++ else: "+deltaY);


            if (deltaY < 0) {
                     //Log.w("InsetsAnimationLinearLayout", "++++++++++++++++++++++++++++++++ else deltaY < 0: "+deltaY);

                if (imeAnimController.isInsetAnimationInProgress()) {
                      //Log.w("InsetsAnimationLinearLayout", "++++++++++++++++++++++++++++++++ else deltaY < 0 isInsetAnimationInProgress: ");

                    consumed[1] -= imeAnimController.insetBy(-deltaY);
                } else if (scrollImeOffScreenWhenVisible && !imeAnimController.isInsetAnimationRequestPending()) {
                    WindowInsetsCompat rootWindowInsets = ViewCompat.getRootWindowInsets(this);
                                //Log.w("InsetsAnimationLinearLayout", "++++++++++++++++++++++++++++++++ else deltaY < 0 else if: ");

                    if (rootWindowInsets != null) {
                        if (rootWindowInsets.isVisible(WindowInsetsCompat.Type.ime())) {
                            startControlRequest();
                            consumed[1] = deltaY;
                        }
                    }
                }
            }

        }
    }

    @Override
    public void onNestedScroll(@NonNull final View target,
                               final int dxConsumed,
                               final int dyConsumed,
                               final int dxUnconsumed,
                               final int dyUnconsumed,
                               final int type,
                               @NonNull final int[] consumed) {

     //Log.w("InsetsAnimationLinearLayout", "++++++++++++++++++++++++++++++++ onNestedScroll: ");


        if (dyUnconsumed > 0) {
            if (imeAnimController.isInsetAnimationInProgress()) {
                consumed[1] = -imeAnimController.insetBy(-dyUnconsumed);
            } else if (scrollImeOnScreenWhenNotVisible && !imeAnimController.isInsetAnimationRequestPending()) {
                WindowInsetsCompat rootWindowInsets = ViewCompat.getRootWindowInsets(this);
                if (rootWindowInsets != null) {
                    if (!rootWindowInsets.isVisible(WindowInsetsCompat.Type.ime())) {
                        startControlRequest();
                        consumed[1] = dyUnconsumed;
                    }
                }
            }
        }

    }

    @Override
    public boolean onNestedFling(@NonNull final View target,
                                 final float velocityX,
                                 final float velocityY,
                                 final boolean consumed) {
             //Log.w("InsetsAnimationLinearLayout", "++++++++++++++++++++++++++++++++ onNestedFling: ");

        if (imeAnimController.isInsetAnimationInProgress()) {
            imeAnimController.animateToFinish(velocityY);
            return true;
        } else {
            boolean imeVisible = false;
            final WindowInsetsCompat rootWindowInsets = ViewCompat.getRootWindowInsets(this);
            if (rootWindowInsets != null && rootWindowInsets.isVisible(WindowInsetsCompat.Type.ime())) {
                imeVisible = true;
            }
            if (velocityY > 0 && scrollImeOnScreenWhenNotVisibleOnFling && !imeVisible) {
                imeAnimController.startAndFling(this, velocityY);
                return true;
            } else if (velocityY < 0 && scrollImeOffScreenWhenVisibleOnFling && imeVisible) {
                imeAnimController.startAndFling(this, velocityY);
                return true;
            } else {
                return false;
            }
        }
    }

    @Override
    public void onStopNestedScroll(@NonNull final View target, final int type) {
                     //Log.w("InsetsAnimationLinearLayout", "++++++++++++++++++++++++++++++++ onStopNestedScroll: ");

        nestedScrollingParentHelper.onStopNestedScroll(target, type);
        if (imeAnimController.isInsetAnimationInProgress() && !imeAnimController.isInsetAnimationFinishing()) {
            imeAnimController.animateToFinish(null);
        }
        reset();
    }

    @Override
    public void dispatchWindowInsetsAnimationPrepare(@NonNull final WindowInsetsAnimation animation) {
        super.dispatchWindowInsetsAnimationPrepare(animation);
        ViewUtils.suppressLayoutCompat(this, false);
           //Log.w("InsetsAnimationLinearLayout", "++++++++++++++++++++++++++++++++ dispatchWindowInsetsAnimationPrepare: ");

    }

    private void startControlRequest() {
       //Log.w("InsetsAnimationLinearLayout", "++++++++++++++++++++++++++++++++ startControlRequest: ");

        // if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) {
        //            //Log.w("InsetsAnimationLinearLayout", "++++++++++++++++++++++++++++++++ (Build.VERSION.SDK_INT < Build.VERSION_CODES.R): ");

        //     return;
        // }
        ViewUtils.suppressLayoutCompat(this, true);
        if (currentNestedScrollingChild != null) {
          //Log.w("InsetsAnimationLinearLayout", "++++++++++++++++++++++++++++++++ currentNestedScrollingChild != null: ");

            currentNestedScrollingChild.getLocationInWindow(startViewLocation);
        }
        imeAnimController.startControlRequest(this, windowInsetsAnimationControllerCompat -> onControllerReady());
    }

    private void onControllerReady() {
         //Log.w("InsetsAnimationLinearLayout", "++++++++++++++++++++++++++++++++ onControllerReady ");

        if (currentNestedScrollingChild != null) {
            imeAnimController.insetBy(0);
            int[] location = tempIntArray2;
            currentNestedScrollingChild.getLocationInWindow(location);
            dropNextY = location[1] - startViewLocation[1];
           //Log.w("InsetsAnimationLinearLayout", "++++++++++++++++++++++++++++++++ onControllerReady (currentNestedScrollingChild != null)");

        }

    }

    private void reset() {
        dropNextY = 0;
        Arrays.fill(startViewLocation, 0);
        ViewUtils.suppressLayoutCompat(this, false);
    }

    @Override
    public void onNestedScrollAccepted(@NonNull final View child,
                                       @NonNull final View target,
                                       final int axes) {
                   //Log.w("InsetsAnimationLinearLayout", "++++++++++++++++++++++++++++++++ onNestedScrollAccepted");

        onNestedScrollAccepted(child, target, axes, TYPE_TOUCH);
    }

    @Override
    public void onNestedScroll(@NonNull final View target,
                               final int dxConsumed,
                               final int dyConsumed,
                               final int dxUnconsumed,
                               final int dyUnconsumed,
                               final int type) {
                           //Log.w("InsetsAnimationLinearLayout", "++++++++++++++++++++++++++++++++ onNestedScroll");

        onNestedScroll(target, dxConsumed, dyConsumed, dxUnconsumed, dyUnconsumed, type, tempIntArray2);
    }

    @Override
    public void onStopNestedScroll(@NonNull final View target) {
                                   //Log.w("InsetsAnimationLinearLayout", "++++++++++++++++++++++++++++++++ onStopNestedScroll");

        onStopNestedScroll(target, TYPE_TOUCH);
    }
}
