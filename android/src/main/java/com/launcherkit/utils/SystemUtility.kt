package com.launcherkit.utils

import android.content.ActivityNotFoundException
import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import android.provider.AlarmClock
import android.provider.Settings
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments

/**
 * Provides system-level utilities for battery status, settings, and alarm access.
 *
 * Battery status is read via a sticky broadcast intent. The alarm app is opened using
 * [AlarmClock.ACTION_SHOW_ALARMS] with a fallback chain for devices where that action
 * is unsupported (e.g., Xiaomi MIUI, Samsung, Google clocks).
 */
class SystemUtility(private val reactContext: ReactContext) {

  /**
   * Reads the current battery level and charging state via a sticky broadcast.
   *
   * @param promise Resolved with a map containing `"level"` (Int, 0-100) and `"isCharging"` (Boolean),
   *               or rejected if the battery intent is unavailable.
   */
  fun getBatteryStatus(promise: Promise) {
    reactContext.registerReceiver(null, IntentFilter(Intent.ACTION_BATTERY_CHANGED))?.let { batteryIntent ->
      val level = batteryIntent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1)
      val scale = batteryIntent.getIntExtra(BatteryManager.EXTRA_SCALE, -1)
      val status = batteryIntent.getIntExtra(BatteryManager.EXTRA_STATUS, -1)

      val isCharging = status == BatteryManager.BATTERY_STATUS_CHARGING ||
        status == BatteryManager.BATTERY_STATUS_FULL

      val batteryLevel = when {
        level == -1 || scale == -1 -> 0f
        else -> (level.toFloat() / scale.toFloat()) * 100f
      }

      val batteryData: WritableMap = Arguments.createMap().apply {
        putInt("level", batteryLevel.toInt())
        putBoolean("isCharging", isCharging)
      }

      promise.resolve(batteryData)
    } ?: run {
      Log.e(TAG, "Failed to get battery intent")
      promise.reject("ERROR", "Failed to get battery intent")
    }
  }

  /** Opens the device's main system settings screen. */
  fun goToSettings() {
    Intent(Settings.ACTION_SETTINGS).apply {
      addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      reactContext.startActivity(this)
    }
  }

  /**
   * Opens the system alarm/clock application.
   *
   * Tries [AlarmClock.ACTION_SHOW_ALARMS] first, then falls back to known clock app
   * packages (AOSP, Google, Samsung, Xiaomi) if the standard action is not handled.
   */
  fun openAlarmApp() {
    try {
      Intent(AlarmClock.ACTION_SHOW_ALARMS).apply {
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        reactContext.startActivity(this)
      }
    } catch (e: Exception) {
      // Fallback for devices that don't handle ACTION_SHOW_ALARMS (e.g. Xiaomi MIUI)
      try {
        openAlarmFallback()
      } catch (e2: Exception) {
        Log.e(TAG, "Failed to open alarm app", e2)
      }
    }
  }

  private fun openAlarmFallback() {
    val fallbackPackages = listOf(
      "com.android.deskclock" to "com.android.deskclock.AlarmsActivity",
      "com.android.deskclock" to "com.android.deskclock.AlarmClock",
      "com.google.android.deskclock" to "com.android.deskclock.AlarmClock",
      "com.sec.android.app.clockpackage" to "com.sec.android.app.clockpackage.ClockPackage",
      "com.miui.clock" to "",
    )

    for ((pkg, cls) in fallbackPackages) {
      try {
        val intent = if (cls.isEmpty()) {
          reactContext.packageManager.getLaunchIntentForPackage(pkg)
        } else {
          Intent().setClassName(pkg, cls)
        }
        intent?.apply {
          addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
          reactContext.startActivity(this)
          return
        }
      } catch (_: Exception) {
        continue
      }
    }
    Log.e(TAG, "No alarm app found on this device")
  }

  companion object {
    private const val TAG = "SystemUtility"
  }
}
