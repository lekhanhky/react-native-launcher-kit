package com.launcherkit.utils

import android.app.ActivityOptions
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReadableMap
import com.launcherkit.R

/**
 * Utility class for launching applications and handling Android intents.
 *
 * Supports launching apps with custom actions, data URIs (geo, file, web), extras,
 * and categories. Launches are performed with a slide-up animation. Falls back gracefully
 * when a launch intent cannot be resolved.
 */
class AppLauncher(private val reactContext: ReactContext) {

  companion object {
    private const val TAG = "AppLauncher"
  }

  /**
   * Launches an application with specified parameters
   *
   * @param packageName Package name of the application to launch
   * @param params Additional parameters for launching the application
   */
  fun launchApplication(packageName: String, params: ReadableMap?) {
    try {
      val launchIntent = createLaunchIntent(packageName, params)
      if (launchIntent != null) {
        launchActivityWithAnimation(launchIntent)
      } else {
        Log.e(TAG, "Failed to create launch intent for package: $packageName")
      }
    } catch (e: Exception) {
      Log.e(TAG, "Error launching application: ${e.message}", e)
    }
  }

  /**
   * Gets the package name of the default launcher
   *
   * @param promise Promise to resolve with the default launcher package name
   */
  fun getDefaultLauncherPackageName(promise: Promise) {
    try {
      val pm = reactContext.packageManager
      val intent = Intent(Intent.ACTION_MAIN).apply {
        addCategory(Intent.CATEGORY_HOME)
      }

      val resolveInfo = pm.resolveActivity(intent, PackageManager.MATCH_DEFAULT_ONLY)
      if (resolveInfo?.activityInfo != null) {
        promise.resolve(resolveInfo.activityInfo.packageName)
      } else {
        promise.reject("ERROR", "No default launcher found")
      }
    } catch (e: Exception) {
      promise.reject("ERROR", "Failed to get default launcher: ${e.message}", e)
    }
  }

  /**
   * Creates an intent for launching the application
   */
  private fun createLaunchIntent(packageName: String, params: ReadableMap?): Intent? {
    val packageManager = reactContext.packageManager
    val launchIntent = if (params != null) {
      val action = if (params.hasKey("action")) params.getString("action") else Intent.ACTION_MAIN
      Intent(action).setPackage(packageName).apply {
        if (params.hasKey("data")) {
          handleIntentData(this, params)
        }
        if (params.hasKey("extras")) {
          addIntentExtras(this, params.getMap("extras")!!)
        }
        if (params.hasKey("category")) {
          addCategory(params.getString("category"))
        }
      }
    } else {
      packageManager.getLaunchIntentForPackage(packageName)
    }

    return launchIntent
  }

  /**
   * Handles the data URI for the intent
   */
  private fun handleIntentData(intent: Intent, params: ReadableMap) {
    val data = params.getString("data") ?: return

    when {
      data.startsWith("geo:") -> handleGeoIntent(intent, data)
      data.startsWith("file://") -> handleFileIntent(intent, data, params)
      isWebUrl(data) -> handleWebIntent(intent, data)
      else -> intent.data = Uri.parse(data)
    }
  }

  private fun handleGeoIntent(intent: Intent, data: String) {
    val geoIntent = Intent(Intent.ACTION_VIEW, Uri.parse(data)).apply {
      setPackage(intent.`package`)
    }
    intent.action = geoIntent.action
    intent.data = geoIntent.data
  }

  private fun handleFileIntent(intent: Intent, data: String, params: ReadableMap) {
    intent.setDataAndType(
      Uri.parse(data),
      if (params.hasKey("type")) params.getString("type") else "*/*"
    )
    intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
  }

  private fun handleWebIntent(intent: Intent, data: String) {
    val webIntent = Intent(Intent.ACTION_VIEW, Uri.parse(data)).apply {
      setPackage(intent.`package`)
    }
    intent.action = webIntent.action
    intent.data = webIntent.data
  }

  private fun isWebUrl(url: String): Boolean {
    return url.startsWith("http://") || url.startsWith("https://")
  }

  /**
   * Adds extra parameters to the intent
   */
  private fun addIntentExtras(intent: Intent, extras: ReadableMap) {
    val iterator = extras.keySetIterator()
    while (iterator.hasNextKey()) {
      val key = iterator.nextKey()
      val value = extras.getString(key)
      intent.putExtra(key, value)
    }
  }

  /**
   * Launches the activity with a custom animation
   */
  private fun launchActivityWithAnimation(intent: Intent) {
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    val animBundle = ActivityOptions.makeCustomAnimation(
      reactContext,
      R.anim.slide_up,
      0
    ).toBundle()
    reactContext.startActivity(intent, animBundle)
  }
}
