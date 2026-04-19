package com.launcherkit.models

import android.content.Context
import android.content.pm.PackageManager
import android.content.pm.ResolveInfo
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.util.Log
import androidx.palette.graphics.Palette
import java.io.File
import java.io.FileOutputStream
import java.io.IOException

/**
 * Represents the details of an installed launchable application.
 *
 * Extracts label, package name, icon (persisted to cache as a PNG file), optional version name,
 * and optional dominant accent color from the app icon using the AndroidX Palette API.
 *
 * The [toString] method produces a JSON string suitable for passing across the React Native bridge.
 *
 * @param ri The [ResolveInfo] for the app's launcher activity.
 * @param pManager The system [PackageManager] used to query app metadata.
 * @param context Android context for file I/O and resource access.
 * @param includeVersion Whether to include the app's version name in the output.
 * @param includeAccentColor Whether to compute and include the dominant icon color.
 */
class AppDetail(
  ri: ResolveInfo,
  pManager: PackageManager,
  context: Context,
  includeVersion: Boolean,
  includeAccentColor: Boolean
) {
  private val label: CharSequence = ri.loadLabel(pManager)
  private val packageName: CharSequence = ri.activityInfo.packageName
  private val icon: Drawable = ri.loadIcon(pManager)
  private val iconPath: String?
  private val version: String?
  private val accentColor: String?

  companion object {
    private const val TAG = "AppDetail"
    private const val DEFAULT_COLOR = "#000000"
  }

  init {
    val iconBitmap = icon.toBitmap()
    iconPath = iconBitmap?.let { bitmap ->
      saveIconToFile(bitmap, packageName.toString(), context)
    }

    version = if (includeVersion) {
      try {
        pManager.getPackageInfo(packageName.toString(), 0).versionName
      } catch (e: PackageManager.NameNotFoundException) {
        Log.e(TAG, "Package not found", e)
        "Unknown"
      }
    } else null

    accentColor = if (includeAccentColor && iconBitmap != null) {
      getAccentColor(iconBitmap)
    } else null
  }

  /**
   * Converts a Drawable to a Bitmap
   */
  private fun Drawable.toBitmap(): Bitmap? = when (this) {
    is BitmapDrawable -> bitmap
    else -> {
      val width = maxOf(intrinsicWidth, 1)
      val height = maxOf(intrinsicHeight, 1)
      try {
        Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888).also { bitmap ->
          Canvas(bitmap).also { canvas ->
            setBounds(0, 0, width, height)
            draw(canvas)
          }
        }
      } catch (e: OutOfMemoryError) {
        Log.e(TAG, "Out of memory while converting drawable to bitmap", e)
        null
      }
    }
  }

  /**
   * Saves the icon bitmap to a file in the cache directory
   */
  private fun saveIconToFile(iconBitmap: Bitmap, fileName: String, context: Context): String? {
    val cacheDir = File(context.cacheDir, "icons").apply {
      if (!exists() && !mkdirs()) {
        Log.e(TAG, "Failed to create directory for icons")
        return null
      }
    }

    return try {
      File(cacheDir, "$fileName.png").also { iconFile ->
        FileOutputStream(iconFile).use { fos ->
          iconBitmap.compress(Bitmap.CompressFormat.PNG, 100, fos)
          fos.flush()
        }
      }.absolutePath
    } catch (e: IOException) {
      Log.e(TAG, "Error saving icon to file", e)
      null
    }
  }

  /**
   * Extracts the dominant color from the bitmap using Palette API
   */
  private fun getAccentColor(bitmap: Bitmap): String =
    Palette.from(bitmap)
      .maximumColorCount(100)
      .generate()
      .dominantSwatch
      ?.let { swatch ->
        String.format("#%06X", 0xFFFFFF and swatch.rgb)
      } ?: DEFAULT_COLOR

  /**
   * Returns a JSON representation of the app details
   */
  override fun toString(): String = buildString {
    append("""
            {
                "label": "$label",
                "packageName": "$packageName",
                "icon": "file://$iconPath",
                "version": ${version?.let { "\"$it\"" } ?: "null"},
                "accentColor": ${accentColor?.let { "\"$it\"" } ?: "null"}
            }
        """.trimIndent())
  }
}
