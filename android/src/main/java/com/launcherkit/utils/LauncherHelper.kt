package com.launcherkit.utils

import android.app.role.RoleManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.provider.Settings
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactContext

/**
 * Provides utilities for setting the app as the device's default home launcher.
 *
 * Handles multiple API levels:
 * - Android 10+ (API 29): Uses [RoleManager] to request the HOME role via `startActivityForResult`.
 * - Pre-Android 10: Triggers the system home chooser dialog.
 * - Falls back to opening system home settings if the activity is unavailable or the role request fails.
 */
class LauncherHelper(private val reactContext: ReactContext) {

  /**
   * Opens the system default apps settings screen where the user can choose a default launcher.
   */
  fun setAsDefaultLauncher() {
    openDefaultLauncherSettings()
  }

  private fun openDefaultLauncherSettings(): Boolean {
    // 1. Try Settings.ACTION_HOME_SETTINGS directly
    try {
      val intent = Intent(Settings.ACTION_HOME_SETTINGS).apply {
        addFlags(
          Intent.FLAG_ACTIVITY_NEW_TASK or
          Intent.FLAG_ACTIVITY_CLEAR_TASK or
          Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS
        )
      }
      if (intent.resolveActivity(reactContext.packageManager) != null) {
        reactContext.startActivity(intent)
        return true
      }
    } catch (e: Exception) {
      Log.w(TAG, "ACTION_HOME_SETTINGS failed", e)
    }

    // 2. Fallback to ACTION_MANAGE_DEFAULT_APPS_SETTINGS
    try {
      val intent = Intent(Settings.ACTION_MANAGE_DEFAULT_APPS_SETTINGS).apply {
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      if (intent.resolveActivity(reactContext.packageManager) != null) {
        reactContext.startActivity(intent)
        return true
      }
    } catch (e: Exception) {
      Log.w(TAG, "ACTION_MANAGE_DEFAULT_APPS_SETTINGS failed", e)
    }

    // 3. Fallback to general system settings
    try {
      val intent = Intent(Settings.ACTION_SETTINGS).apply {
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      reactContext.startActivity(intent)
      return true
    } catch (e: Exception) {
      Log.e(TAG, "Failed to open settings", e)
      return false
    }
  }

  /**
   * Opens the system home settings screen directly.
   *
   * @param promise Resolved with `true` on success, or rejected if the intent cannot be started.
   */
  fun openSetDefaultLauncher(promise: Promise) {
    if (openDefaultLauncherSettings()) {
      promise.resolve(true)
    } else {
      promise.reject("SETTINGS_ERROR", "Could not open home settings")
    }
  }

  /**
   * Requests that this app be set as the default launcher using the most appropriate system API.
   *
   * On Android 10+, uses [RoleManager.ROLE_HOME]. If the role is already held, resolves immediately.
   * If the current activity is unavailable or the request fails, falls back to [openSetDefaultLauncher].
   *
   * @param promise Resolved with `true` when the request is initiated or already satisfied.
   */
  fun requestDefaultLauncher(promise: Promise) {
    try {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        val activity = reactContext.currentActivity
        val roleManager = reactContext.getSystemService(Context.ROLE_SERVICE) as? RoleManager
        if (activity != null && roleManager != null && roleManager.isRoleAvailable(RoleManager.ROLE_HOME)) {
          if (roleManager.isRoleHeld(RoleManager.ROLE_HOME)) {
            promise.resolve(true)
            return
          }

          val intent = roleManager.createRequestRoleIntent(RoleManager.ROLE_HOME)
          // Do NOT add FLAG_ACTIVITY_NEW_TASK — it breaks startActivityForResult
          activity.startActivityForResult(intent, REQUEST_CODE_DEFAULT_LAUNCHER)
          promise.resolve(true)
          return
        }
      }

      // Pre-Android 10 or devices without RoleManager (like LDPlayer / custom emulators):
      // Open home settings directly so user can choose launcher
      openSetDefaultLauncher(promise)
    } catch (e: Exception) {
      Log.e(TAG, "Failed to request default launcher, falling back to settings", e)
      openSetDefaultLauncher(promise)
    }
  }

  companion object {
    private const val TAG = "LauncherHelper"
    private const val REQUEST_CODE_DEFAULT_LAUNCHER = 1001
  }
}
