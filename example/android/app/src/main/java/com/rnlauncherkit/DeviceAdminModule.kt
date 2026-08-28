package com.rnlauncherkit

import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class DeviceAdminModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "DeviceAdminModule"

    private val devicePolicyManager: DevicePolicyManager by lazy {
        reactContext.getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
    }

    private val adminComponent: ComponentName by lazy {
        ComponentName(reactContext, AdminReceiver::class.java)
    }

    @ReactMethod
    fun isDeviceAdminActive(promise: Promise) {
        try {
            val isActive = devicePolicyManager.isAdminActive(adminComponent)
            promise.resolve(isActive)
        } catch (e: Exception) {
            promise.reject("ERROR_CHECK_ADMIN", e.message, e)
        }
    }

    @ReactMethod
    fun requestDeviceAdmin(promise: Promise) {
        try {
            if (devicePolicyManager.isAdminActive(adminComponent)) {
                promise.resolve(true)
                return
            }

            val intent = Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN).apply {
                putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, adminComponent)
                putExtra(
                    DevicePolicyManager.EXTRA_ADD_EXPLANATION,
                    "Kích hoạt quyền Quản trị viên để bảo vệ ứng dụng Launcher Trẻ Em không bị gỡ bỏ trái phép."
                )
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            reactContext.startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERROR_REQUEST_ADMIN", e.message, e)
        }
    }
}
