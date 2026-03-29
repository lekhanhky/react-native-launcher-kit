package com.launcherkit.providers

import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactContext
import com.launcherkit.models.AppDetail
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

/**
 * Provides information about installed applications on the device.
 *
 * Queries the system [PackageManager] for launchable apps, filters duplicates,
 * and constructs [AppDetail] instances. Heavy operations (icon extraction, palette
 * generation) run on [Dispatchers.IO] to keep the main thread responsive.
 */
class AppInfoProvider(private val reactContext: ReactContext) {
  private val scope = CoroutineScope(Dispatchers.IO)
  private val packageManager: PackageManager
    get() = reactContext.packageManager

  /**
   * Retrieves all launchable apps asynchronously and resolves the promise with a JSON array string.
   *
   * @param includeVersion Whether to include version names in the result.
   * @param includeAccentColor Whether to compute dominant icon colors.
   * @param promise Resolved with a JSON string on success, or rejected on failure.
   */
  fun getApps(includeVersion: Boolean, includeAccentColor: Boolean, promise: Promise) {
    scope.launch {
      try {
        val apps = getAppsList(includeVersion, includeAccentColor)
        promise.resolve(apps.toString())
      } catch (e: Exception) {
        promise.reject("ERROR", "Failed to get apps list", e)
      }
    }
  }

  private fun getAppsList(includeVersion: Boolean, includeAccentColor: Boolean): List<AppDetail> {
    val addedPackages = mutableSetOf<String>()
    val pManager = reactContext.packageManager

    return Intent(Intent.ACTION_MAIN).apply {
      addCategory(Intent.CATEGORY_LAUNCHER)
    }.let { intent ->
      pManager.queryIntentActivities(intent, 0)
    }.mapNotNull { resolveInfo ->
      resolveInfo.activityInfo.packageName.takeUnless {
        addedPackages.contains(it)
      }?.let { packageName ->
        addedPackages.add(packageName)
        AppDetail(
          ri = resolveInfo,
          pManager = pManager,
          context = reactContext,
          includeVersion = includeVersion,
          includeAccentColor = includeAccentColor
        )
      }
    }
  }

  /**
   * Returns the package names of all installed packages (including system apps).
   */
  fun getAllApps(): List<String> =
    packageManager.getInstalledPackages(0).map { it.packageName }

  /**
   * Returns the package names of installed non-system (user-installed) packages.
   */
  fun getNonSystemApps(): List<String> =
    packageManager.getInstalledPackages(0)
      .filter { (it.applicationInfo?.flags?.and(ApplicationInfo.FLAG_SYSTEM) ?: 0) == 0 }
      .map { it.packageName }

  /**
   * Checks whether a specific package is installed on the device.
   *
   * @param packageName The package name to check.
   * @return `true` if the package is installed, `false` otherwise.
   */
  fun isPackageInstalled(packageName: String): Boolean {
    return try {
      packageManager.getPackageInfo(packageName, PackageManager.GET_ACTIVITIES)
      true
    } catch (e: Exception) {
      false
    }
  }

  companion object {
    private const val TAG = "AppInfoProvider"
  }
}
