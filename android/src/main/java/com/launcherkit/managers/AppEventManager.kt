package com.launcherkit.managers

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.util.Log
import android.content.pm.PackageManager
import android.content.pm.ResolveInfo
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.launcherkit.models.AppDetail
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

/**
 * Manages real-time app installation and removal monitoring via BroadcastReceivers.
 *
 * Emits the following events to the JS layer:
 * - `"onAppInstalled"` — when a new launchable app is installed; payload is a JSON string of [AppDetail].
 * - `"onAppRemoved"` — when an app is uninstalled; payload is the removed package name.
 *
 * Receivers are registered/unregistered on demand to avoid unnecessary background processing.
 * Event emission is performed on [Dispatchers.IO] to avoid blocking the main thread during
 * package manager queries.
 */
class AppEventManager(private val reactContext: ReactContext) {
  private var appInstallReceiver: BroadcastReceiver? = null
  private var appRemovalReceiver: BroadcastReceiver? = null
  private val scope = CoroutineScope(Dispatchers.IO)

  init {
    initializeReceivers()
  }

  private fun initializeReceivers() {
    appInstallReceiver = createAppInstallReceiver()
    appRemovalReceiver = createAppRemovalReceiver()
  }

  private fun createAppInstallReceiver() = object : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
      scope.launch {
        intent.data?.schemeSpecificPart?.let { packageName ->
          try {
            val pManager = context.packageManager
            pManager.getLaunchIntentForPackage(packageName)?.let { launchIntent ->
              pManager.resolveActivity(launchIntent, 0)?.let { resolveInfo ->
                val newApp = AppDetail(
                  ri = resolveInfo,
                  pManager = pManager,
                  context = reactContext,
                  includeVersion = true,
                  includeAccentColor = true
                )
                emitAppInstalled(newApp.toString())
              }
            }
          } catch (e: Exception) {
            e.printStackTrace()
          }
        }
      }
    }
  }

  private fun createAppRemovalReceiver() = object : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
      scope.launch {
        intent.data?.schemeSpecificPart?.let { packageName ->
          emitAppRemoved(packageName)
        }
      }
    }
  }

  private fun emitAppInstalled(appDetails: String) {
    if (!reactContext.hasActiveReactInstance()) return
    try {
      reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit("onAppInstalled", appDetails)
    } catch (e: Exception) {
      Log.e(TAG, "Failed to emit onAppInstalled event", e)
    }
  }

  private fun emitAppRemoved(packageName: String) {
    if (!reactContext.hasActiveReactInstance()) return
    try {
      reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit("onAppRemoved", packageName)
    } catch (e: Exception) {
      Log.e(TAG, "Failed to emit onAppRemoved event", e)
    }
  }

  /**
   * Registers a BroadcastReceiver for [Intent.ACTION_PACKAGE_ADDED] events.
   * Must be balanced with a call to [stopListeningForAppInstallations].
   */
  fun startListeningForAppInstallations() {
    IntentFilter(Intent.ACTION_PACKAGE_ADDED).apply {
      addDataScheme("package")
      appInstallReceiver?.let { receiver ->
        reactContext.registerReceiver(receiver, this)
      }
    }
  }

  /**
   * Unregisters the app installation BroadcastReceiver.
   * Safe to call even if the receiver was never registered.
   */
  fun stopListeningForAppInstallations() {
    try {
      appInstallReceiver?.let { receiver ->
        reactContext.unregisterReceiver(receiver)
      }
    } catch (e: IllegalArgumentException) {
      e.printStackTrace()
    }
  }

  /**
   * Registers a BroadcastReceiver for [Intent.ACTION_PACKAGE_REMOVED] events.
   * Must be balanced with a call to [stopListeningForAppRemovals].
   */
  fun startListeningForAppRemovals() {
    IntentFilter(Intent.ACTION_PACKAGE_REMOVED).apply {
      addDataScheme("package")
      appRemovalReceiver?.let { receiver ->
        reactContext.registerReceiver(receiver, this)
      }
    }
  }

  /**
   * Unregisters the app removal BroadcastReceiver.
   * Safe to call even if the receiver was never registered.
   */
  fun stopListeningForAppRemovals() {
    try {
      appRemovalReceiver?.let { receiver ->
        reactContext.unregisterReceiver(receiver)
      }
    } catch (e: IllegalArgumentException) {
      e.printStackTrace()
    }
  }

  companion object {
    private const val TAG = "AppEventManager"
  }
}
