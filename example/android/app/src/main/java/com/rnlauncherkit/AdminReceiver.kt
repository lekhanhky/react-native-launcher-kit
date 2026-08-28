package com.rnlauncherkit

import android.app.admin.DeviceAdminReceiver
import android.content.Context
import android.content.Intent
import android.widget.Toast

class AdminReceiver : DeviceAdminReceiver() {
    override fun onEnabled(context: Context, intent: Intent) {
        super.onEnabled(context, intent)
        Toast.makeText(context, "Đã kích hoạt Quản trị viên thiết bị (Bảo vệ chống gỡ app)", Toast.LENGTH_SHORT).show()
    }

    override fun onDisabled(context: Context, intent: Intent) {
        super.onDisabled(context, intent)
        Toast.makeText(context, "Đã hủy quyền Quản trị viên thiết bị", Toast.LENGTH_SHORT).show()
    }
}
