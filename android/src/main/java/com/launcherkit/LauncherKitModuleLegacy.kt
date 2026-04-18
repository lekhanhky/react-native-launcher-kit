package com.launcherkit

import com.launcherkit.managers.AppEventManager
import com.launcherkit.managers.BatteryEventManager
import com.launcherkit.utils.AppLauncher
import com.launcherkit.utils.LauncherHelper
import com.launcherkit.providers.AppInfoProvider
import com.launcherkit.utils.SystemUtility
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule

/**
 * Legacy bridge implementation of [LauncherKitModule] for the old React Native architecture.
 *
 * Delegates all operations to dedicated utility and manager classes. Used when
 * the new architecture (TurboModules) is not enabled.
 */
@ReactModule(name = LauncherKitModule.NAME)
class LauncherKitModuleLegacy(
  reactContext: ReactApplicationContext
) : LauncherKitModule(reactContext) {

  private val appEventManager = AppEventManager(reactContext)
  private val batteryEventManager = BatteryEventManager(reactContext)
  private val appLauncher = AppLauncher(reactContext)
  private val appInfoProvider = AppInfoProvider(reactContext)
  private val systemUtility = SystemUtility(reactContext)
  private val launcherHelper = LauncherHelper(reactContext)

  override fun getName(): String = NAME

  @ReactMethod
  override fun getApps(includeVersion: Boolean, includeAccentColor: Boolean, promise: Promise) {
    appInfoProvider.getApps(includeVersion, includeAccentColor, promise)
  }

  @ReactMethod
  override fun launchApplication(packageName: String, params: ReadableMap?) {
    appLauncher.launchApplication(packageName, params)
  }

  @ReactMethod
  override fun isPackageInstalled(packageName: String, promise: Promise) {
    promise.resolve(appInfoProvider.isPackageInstalled(packageName))
  }

  @ReactMethod
  override fun getDefaultLauncherPackageName(promise: Promise) {
    appLauncher.getDefaultLauncherPackageName(promise)
  }

  @ReactMethod
  override fun setAsDefaultLauncher() {
    launcherHelper.setAsDefaultLauncher()
  }

  @ReactMethod
  override fun getBatteryStatus(promise: Promise) {
    systemUtility.getBatteryStatus(promise)
  }

  @ReactMethod
  override fun goToSettings() {
    systemUtility.goToSettings()
  }

  @ReactMethod
  override fun openAlarmApp() {
    systemUtility.openAlarmApp()
  }

  @ReactMethod
  override fun openSetDefaultLauncher(promise: Promise) {
    launcherHelper.openSetDefaultLauncher(promise)
  }

  @ReactMethod
  override fun startListeningForAppInstallations() {
    appEventManager.startListeningForAppInstallations()
  }

  @ReactMethod
  override fun stopListeningForAppInstallations() {
    appEventManager.stopListeningForAppInstallations()
  }

  @ReactMethod
  override fun startListeningForAppRemovals() {
    appEventManager.startListeningForAppRemovals()
  }

  @ReactMethod
  override fun stopListeningForAppRemovals() {
    appEventManager.stopListeningForAppRemovals()
  }

  @ReactMethod
  override fun startListeningForBatteryChanges() {
    batteryEventManager.startListening()
  }

  @ReactMethod
  override fun stopListeningForBatteryChanges() {
    batteryEventManager.stopListening()
  }

  @ReactMethod
  override fun requestDefaultLauncher(promise: Promise) {
    launcherHelper.requestDefaultLauncher(promise)
  }
}
