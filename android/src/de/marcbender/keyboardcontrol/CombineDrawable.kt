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

package de.marcbender.keyboardcontrol

import android.graphics.Canvas
import android.graphics.ColorFilter
import android.graphics.PixelFormat
import android.graphics.drawable.Drawable

class CombinedDrawable : Drawable, Drawable.Callback {
    val background: Drawable
    val icon: Drawable?
    private var left = 0
    private var top = 0
    private var iconWidth = 0
    private var iconHeight = 0
    private var backWidth = 0
    private var backHeight = 0
    private var offsetX = 0
    private var offsetY = 0
    private var fullSize = false

    constructor(backgroundDrawable: Drawable, iconDrawable: Drawable?, leftOffset: Int, topOffset: Int) {
        background = backgroundDrawable
        icon = iconDrawable
        left = leftOffset
        top = topOffset
        if (iconDrawable != null) {
            iconDrawable.callback = this
        }
    }

    constructor(backgroundDrawable: Drawable, iconDrawable: Drawable?) {
        background = backgroundDrawable
        icon = iconDrawable
        if (iconDrawable != null) {
            iconDrawable.callback = this
        }
    }

    fun setIconSize(width: Int, height: Int) {
        iconWidth = width
        iconHeight = height
    }

    fun setCustomSize(width: Int, height: Int) {
        backWidth = width
        backHeight = height
    }

    fun setIconOffset(x: Int, y: Int) {
        offsetX = x
        offsetY = y
    }

    fun setFullsize(value: Boolean) {
        fullSize = value
    }

    override fun setColorFilter(colorFilter: ColorFilter?) {
        icon?.colorFilter = colorFilter
    }

    override fun isStateful(): Boolean {
        return icon?.isStateful ?: false
    }

    override fun setState(stateSet: IntArray): Boolean {
        icon?.state = stateSet
        return true
    }

    override fun getState(): IntArray {
        return icon?.state ?: super.getState()
    }

    override fun onStateChange(state: IntArray): Boolean {
        return true
    }

    override fun jumpToCurrentState() {
        icon?.jumpToCurrentState()
    }

    override fun getConstantState(): ConstantState? {
        return icon?.constantState
    }

    override fun draw(canvas: Canvas) {
        background.bounds = bounds
        background.draw(canvas)
        if (icon == null) return
        if (fullSize) {
            val bounds = bounds
            if (left != 0) {
                icon.setBounds(bounds.left + left, bounds.top + top, bounds.right - left, bounds.bottom - top)
            } else {
                icon.bounds = bounds
            }
        } else {
            val x: Int
            val y: Int
            if (iconWidth != 0) {
                x = bounds.centerX() - iconWidth / 2 + left + offsetX
                y = bounds.centerY() - iconHeight / 2 + top + offsetY
                icon.setBounds(x, y, x + iconWidth, y + iconHeight)
            } else {
                x = bounds.centerX() - icon.intrinsicWidth / 2 + left
                y = bounds.centerY() - icon.intrinsicHeight / 2 + top
                icon.setBounds(x, y, x + icon.intrinsicWidth, y + icon.intrinsicHeight)
            }
        }
        icon.draw(canvas)
    }

    override fun setAlpha(alpha: Int) {
        icon?.alpha = alpha
        background.alpha = alpha
    }

    override fun getIntrinsicWidth(): Int {
        return if (backWidth != 0) backWidth else background.intrinsicWidth
    }

    override fun getIntrinsicHeight(): Int {
        return if (backHeight != 0) backHeight else background.intrinsicHeight
    }

    override fun getMinimumWidth(): Int {
        return if (backWidth != 0) backWidth else background.minimumWidth
    }

    override fun getMinimumHeight(): Int {
        return if (backHeight != 0) backHeight else background.minimumHeight
    }

    override fun getOpacity(): Int {
        return icon?.opacity ?: PixelFormat.UNKNOWN
    }

    override fun invalidateDrawable(who: Drawable) {
        invalidateSelf()
    }

    override fun scheduleDrawable(who: Drawable, what: Runnable, `when`: Long) {
        scheduleSelf(what, `when`)
    }

    override fun unscheduleDrawable(who: Drawable, what: Runnable) {
        unscheduleSelf(what)
    }
}