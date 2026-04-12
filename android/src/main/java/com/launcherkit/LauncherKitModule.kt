package com.launcherkit

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReadableMap

/**
 * Abstract base class defining the contract for the LauncherKit native module.
 *
 * Declares all React Native bridge methods for app management, launcher configuration,
 * battery monitoring, and system utilities. Concrete implementations exist for both
 * the legacy bridge architecture ([LauncherKitModuleLegacy]) and the new TurboModule
 * architecture ([LauncherKitModuleNew]).
 */
abstract class LauncherKitModule(
  reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {
  abstract fun getApps(includeVersion: Boolean, includeAccentColor: Boolean, promise: Promise)
  abstract fun launchApplication(packageName: String, params: ReadableMap?)
  abstract fun isPackageInstalled(packageName: String, promise: Promise)
  abstract fun getDefaultLauncherPackageName(promise: Promise)
  abstract fun setAsDefaultLauncher()
  abstract fun getBatteryStatus(promise: Promise)
  abstract fun goToSettings()
  abstract fun openAlarmApp()
  abstract fun openSetDefaultLauncher(promise: Promise)
  abstract fun startListeningForAppInstallations()
  abstract fun stopListeningForAppInstallations()
  abstract fun startListeningForAppRemovals()
  abstract fun stopListeningForAppRemovals()
  abstract fun startListeningForBatteryChanges()
  abstract fun stopListeningForBatteryChanges()
  abstract fun requestDefaultLauncher(promise: Promise)

  companion object {
    const val NAME = "LauncherKit"
  }
}
