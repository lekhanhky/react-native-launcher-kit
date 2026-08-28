package com.rnlauncherkit

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "rnlauncherkit"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  /**
   * Vô hiệu hóa hành vi thoát Activity mặc định khi bấm nút Back/ESC
   * Đảm bảo Kids Launcher luôn chạy như màn hình chính Kiosk không thể thoát ra.
   */
  override fun invokeDefaultOnBackPressed() {
    // Không làm gì để giữ Launcher luôn hiển thị ở màn hình chính
  }
}
