package com.rnlauncherkit

import android.app.Activity
import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.provider.Settings
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.BaseActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class DeviceAdminModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        private const val REQUEST_CODE_DEVICE_ADMIN = 9999
    }

    private var adminPromise: Promise? = null

    override fun getName(): String = "DeviceAdminModule"

    private val devicePolicyManager: DevicePolicyManager by lazy {
        reactContext.getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
    }

    private val adminComponent: ComponentName by lazy {
        ComponentName(reactContext, AdminReceiver::class.java)
    }

    private val activityEventListener: ActivityEventListener = object : BaseActivityEventListener() {
        override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
            if (requestCode == REQUEST_CODE_DEVICE_ADMIN) {
                val promise = adminPromise
                adminPromise = null
                if (promise != null) {
                    val isActive = devicePolicyManager.isAdminActive(adminComponent)
                    promise.resolve(isActive)
                }
            }
        }
    }

    init {
        reactContext.addActivityEventListener(activityEventListener)
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
            }

            val activity = reactContext.currentActivity
            if (activity != null) {
                adminPromise = promise
                activity.startActivityForResult(intent, REQUEST_CODE_DEVICE_ADMIN)
            } else {
                // Fallback: mở bằng context nếu không có activity
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                reactContext.startActivity(intent)
                promise.resolve(true)
            }
        } catch (e: Exception) {
            // Fallback: mở màn hình Bảo mật
            try {
                val fallbackIntent = Intent(Settings.ACTION_SECURITY_SETTINGS).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                reactContext.startActivity(fallbackIntent)
                promise.resolve(true)
            } catch (err: Exception) {
                promise.reject("ERROR_REQUEST_ADMIN", err.message, err)
            }
        }
    }
}

