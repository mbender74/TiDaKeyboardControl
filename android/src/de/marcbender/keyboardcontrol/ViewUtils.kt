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

@file:JvmName("ViewUtils")

package de.marcbender.keyboardcontrol

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.drawable.Drawable
import android.graphics.drawable.GradientDrawable
import android.graphics.drawable.ShapeDrawable
import android.graphics.drawable.shapes.RoundRectShape
import android.os.Build
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.TextView
import androidx.annotation.ColorInt
import androidx.core.content.res.ResourcesCompat
import androidx.core.util.Pair
import androidx.dynamicanimation.animation.FloatPropertyCompat
import androidx.dynamicanimation.animation.SpringAnimation
import kotlin.jvm.internal.Intrinsics
import android.util.DisplayMetrics
import android.content.res.Resources

fun createRoundRectDrawableWithIcon(context: Context, rad: Int, iconRes: Int): Drawable? {
    val defaultDrawable = ShapeDrawable(RoundRectShape(FloatArray(8) { rad.toFloat() }, null, null))
    defaultDrawable.paint.color = -0x1
    val d = ResourcesCompat.getDrawable(context.resources, iconRes, null) ?: return null
    val drawable = d.mutate()
    return CombinedDrawable(defaultDrawable, drawable)
}

fun createRoundRectDrawable(rad: Int, defaultColor: Int): Drawable {
    val defaultDrawable = ShapeDrawable(RoundRectShape(FloatArray(8) { rad.toFloat() }, null, null))
    defaultDrawable.paint.color = defaultColor
    return defaultDrawable
}


   fun convertDpToPx(dp:Float):Int {
        return Math.round((dp * Resources.getSystem().getDisplayMetrics().densityDpi) / DisplayMetrics.DENSITY_DEFAULT)
    }



fun createFrame(
    width: Int,
    height: Float,
    gravity: Int,
    leftMargin: Float,
    topMargin: Float,
    rightMargin: Float,
    bottomMargin: Float
): FrameLayout.LayoutParams {
    val layoutParams = FrameLayout.LayoutParams(getSize(width.toFloat()), getSize(height), gravity)
    layoutParams.setMargins(
        convertDpToPx(leftMargin), convertDpToPx(topMargin), convertDpToPx(rightMargin),
        convertDpToPx(bottomMargin)
    )
    return layoutParams
}

fun createGradientDrawable(
    orientation: GradientDrawable.Orientation?,
    @ColorInt colors: IntArray?
): GradientDrawable {
    val drawable = GradientDrawable(orientation, colors)
    drawable.shape = GradientDrawable.RECTANGLE
    return drawable
}

private fun getSize(size: Float): Int {
    return if (size < 0) size.toInt() else convertDpToPx(size)
}

fun measure(view: View, parent: View): Pair<Int, Int> {
    view.measure(
        View.MeasureSpec.makeMeasureSpec(parent.width, View.MeasureSpec.UNSPECIFIED),
        View.MeasureSpec.makeMeasureSpec(parent.height, View.MeasureSpec.UNSPECIFIED)
    )
    return Pair(view.measuredHeight, view.measuredWidth)
}

fun getTextViewValueWidth(textView: TextView, text: String?): Float {
    return textView.paint.measureText(text)
}

/**
 * Creates [SpringAnimation] for object.
 * If finalPosition is not [Float.NaN] then create [SpringAnimation] with
 * [SpringForce.mFinalPosition].
 *
 * @param object        Object
 * @param property      object's property to be animated.
 * @param finalPosition [SpringForce.mFinalPosition] Final position of spring.
 * @return [SpringAnimation]
 */
fun springAnimationOf(
    `object`: Any?,
    property: FloatPropertyCompat<Any?>?,
    finalPosition: Float?
): SpringAnimation {
    return finalPosition?.let { SpringAnimation(`object`, property, it) } ?: SpringAnimation(`object`, property)
}

fun suppressLayoutCompat(`$this$suppressLayoutCompat`: ViewGroup, suppress: Boolean) {
    Intrinsics.checkNotNullParameter(`$this$suppressLayoutCompat`, "\$this\$suppressLayoutCompat")
    if (Build.VERSION.SDK_INT >= 29) {
        `$this$suppressLayoutCompat`.suppressLayout(suppress)
    } else {
        hiddenSuppressLayout(`$this$suppressLayoutCompat`, suppress)
    }
}

private var tryHiddenSuppressLayout = true

@SuppressLint("NewApi")
private fun hiddenSuppressLayout(group: ViewGroup, suppress: Boolean) {
    if (tryHiddenSuppressLayout) {
        try {
            group.suppressLayout(suppress)
        } catch (var3: NoSuchMethodError) {
            tryHiddenSuppressLayout = false
        }
    }
}