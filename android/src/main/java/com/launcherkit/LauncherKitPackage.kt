package com.launcherkit

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

/**
 * React Native package registration for LauncherKit.
 *
 * Selects the appropriate module implementation based on the current architecture:
 * [LauncherKitModuleNew] for TurboModules or [LauncherKitModuleLegacy] for the old bridge.
 */
class LauncherKitPackage : ReactPackage {
  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    return listOf(
      if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
        LauncherKitModuleNew(reactContext)
      } else {
        LauncherKitModuleLegacy(reactContext)
      }
    )
  }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    return emptyList()
  }
}
