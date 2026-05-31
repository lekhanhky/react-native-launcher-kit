package com.launcherkit.managers

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule

/**
 * Manages real-time battery status monitoring via a BroadcastReceiver.
 *
 * Emits `"onBatteryStatusChanged"` events to the JS layer only when the battery level
 * or charging state actually changes, preventing redundant updates. The event payload
 * is a map containing:
 * - `"level"` (Int) — battery percentage (0-100)
 * - `"isCharging"` (Boolean) — whether the device is currently charging or full
 *
 * State is reset when [stopListening] is called so a fresh baseline is established
 * on the next [startListening] call.
 */
class BatteryEventManager(private val reactContext: ReactContext) {
  private var batteryReceiver: BroadcastReceiver? = null
  private var lastLevel: Int = -1
  private var lastIsCharging: Boolean? = null

  /**
   * Begins monitoring battery changes. If already listening, this is a no-op.
   * Registers a receiver for [Intent.ACTION_BATTERY_CHANGED].
   */
  fun startListening() {
    if (batteryReceiver != null) return

    batteryReceiver = object : BroadcastReceiver() {
      override fun onReceive(context: Context, intent: Intent) {
        val level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1)
        val scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1)
        val status = intent.getIntExtra(BatteryManager.EXTRA_STATUS, -1)

        val isCharging = status == BatteryManager.BATTERY_STATUS_CHARGING ||
          status == BatteryManager.BATTERY_STATUS_FULL

        val batteryLevel = when {
          level == -1 || scale == -1 -> 0
          else -> ((level.toFloat() / scale.toFloat()) * 100f).toInt()
        }

        // Only emit if value actually changed
        if (batteryLevel != lastLevel || isCharging != lastIsCharging) {
          lastLevel = batteryLevel
          lastIsCharging = isCharging
          emitBatteryChange(batteryLevel, isCharging)
        }
      }
    }

    IntentFilter(Intent.ACTION_BATTERY_CHANGED).let { filter ->
      batteryReceiver?.let { receiver ->
        reactContext.registerReceiver(receiver, filter)
      }
    }
  }

  /**
   * Stops monitoring battery changes and resets internal state.
   * Safe to call even if not currently listening.
   */
  fun stopListening() {
    try {
      batteryReceiver?.let { receiver ->
        reactContext.unregisterReceiver(receiver)
      }
    } catch (e: IllegalArgumentException) {
      Log.e(TAG, "Battery receiver was not registered", e)
    }
    batteryReceiver = null
    lastLevel = -1
    lastIsCharging = null
  }

  private fun emitBatteryChange(level: Int, isCharging: Boolean) {
    if (!reactContext.hasActiveReactInstance()) return
    try {
      val batteryData = Arguments.createMap().apply {
        putInt("level", level)
        putBoolean("isCharging", isCharging)
      }
      reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit("onBatteryStatusChanged", batteryData)
    } catch (e: Exception) {
      Log.e(TAG, "Failed to emit battery change event", e)
    }
  }

  companion object {
    private const val TAG = "BatteryEventManager"
  }
}
