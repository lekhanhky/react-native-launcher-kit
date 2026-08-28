# TÀI LIỆU KỸ THUẬT: GIỚI HẠN THỜI GIAN & KHÓA ỨNG DỤNG BÊN THỨ BA (APP TIME LIMIT & LOCKING SYSTEM)

> **Dự án:** React Native Launcher Kit - Safe Kids Mode  
> **Phiên bản:** 1.0  
> **Phạm vi áp dụng:** Mọi ứng dụng Android cài trên máy (Facebook, TikTok, YouTube gốc, Roblox, Games...)  
> **Mục tiêu:** Cho phép phụ huynh thiết lập hạn mức thời gian dùng theo từng app (VD: Facebook 30 phút/ngày), tự động ngắt và khóa khi hết giờ, ngăn chặn mọi hình thức lách luật của trẻ.

---

## 1. TỔNG QUAN KIẾN TRÚC 2 TẦNG BẢO VỆ (TWO-TIER DEFENSE)

Để đảm bảo bé không thể vượt qua giới hạn thời gian, hệ thống áp dụng kiến trúc **2 tầng phòng thủ**:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        KIẾN TRÚC 2 TẦNG KHÓA ỨNG DỤNG ANDROID                          │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│   [TẦNG 1: CHẶN TẠI MÀN HÌNH LAUNCHER] (Launcher-Level Interception)                   │
│   • Bé bấm vào icon App trên màn hình Launcher                                         │
│   • Kiểm tra: Thời gian đã dùng hôm nay >= Hạn mức cho phép?                           │
│     ├── CHƯA HẾT GIỜ ──> Gọi RNLauncherKitHelper.launchApplication(packageName)        │
│     └── ĐÃ HẾT GIỜ   ──> Chặn mở, rung phản hồi & hiện Modal Nhập PIN Phụ huynh        │
│                                                                                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│   [TẦNG 2: GIÁM SÁT CHẠY NGẦM & KHÓA ĐÈ] (System-Level Background Monitor & Overlay)  │
│   • Áp dụng khi bé mở app từ: Thanh Thông báo, Ứng dụng gần đây, Google Assistant...   │
│   • Dịch vụ ngầm (Foreground Service / Accessibility / UsageStats) quét real-time:     │
│     ├── Phát hiện App đang nổi (Foreground) là com.facebook.katana                    │
│     ├── Kiểm tra thời lượng tích lũy hôm nay                                           │
│     └── Nếu VƯỢT QUÁ GIỚI HẠN ──> Thực hiện 1 trong 2 hành động:                       │
│         ├── Hành động A: Bung Màn hình Khóa đè lên (System Overlay Window)             │
│         └── Hành động B: Kéo máy quay trở về Launcher (Home Intent Clear Top)          │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. CHI TIẾT CÁC CƠ CHẾ KỸ THUẬT TRÊN ANDROID

### 2.1. Đo lường Thời gian Sử dụng (`UsageStatsManager`)
- **Quyền Android:** `android.permission.PACKAGE_USAGE_STATS` (Cần người dùng kích hoạt trong Cài đặt > Quyền truy cập dữ liệu sử dụng).
- **Nguyên lý:** Android OS tự động ghi nhận thời gian từng package ở Foreground. Ứng dụng đọc dữ liệu này để tính tổng số phút bé đã dùng app đó từ `00:00:00` đến thời điểm hiện tại.

### 2.2. Theo dõi Chuyển đổi Ứng dụng Tức thì (`AccessibilityService`)
- **Nguyên lý:** Lắng nghe sự kiện `TYPE_WINDOW_STATE_CHANGED`. Khi bé chuyển sang Facebook, sự kiện được bắt trong vòng **0.05 giây**:
  ```kotlin
  override fun onAccessibilityEvent(event: AccessibilityEvent) {
      if (event.eventType == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
          val currentPackage = event.packageName?.toString() ?: return
          AppLockManager.checkAndEnforceLimit(currentPackage, context)
      }
  }
  ```

### 2.3. Màn hình Khóa đè toàn hệ thống (`SYSTEM_ALERT_WINDOW`)
- **Quyền Android:** `android.permission.SYSTEM_ALERT_WINDOW` ("Xuất hiện trên cùng / Draw over other apps").
- **Hành vi:** Khi Facebook hết 30 phút, một View toàn màn hình của Launcher sẽ nhảy lên đè kín màn hình Facebook, ngăn mọi thao tác chạm vào Facebook phía dưới.

---

## 3. THIẾT KẾ CƠ SỞ DỮ LIỆU (SUPABASE & LOCAL STORAGE)

### 3.1. Bảng `device_app_limits` (Cấu hình giới hạn thời gian từng App)
Lưu trữ trên Supabase và đồng bộ về Local Storage của máy con:

```sql
CREATE TABLE IF NOT EXISTS public.device_app_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT REFERENCES public.devices(device_id) ON DELETE CASCADE,
    package_name TEXT NOT NULL,                         -- VD: 'com.facebook.katana'
    app_name TEXT NOT NULL,                             -- VD: 'Facebook'
    daily_limit_minutes INT DEFAULT 30,                 -- Giới hạn: 30 phút/ngày (0 = Cấm hoàn toàn)
    is_blocked BOOLEAN DEFAULT false,                   -- Khóa tức thì app này
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(device_id, package_name)
);
```

### 3.2. Cấu trúc lưu trữ Offline trên Local Storage (MMKV / Storage)
```typescript
interface AppTimeLimitConfig {
  packageName: string;
  appName: string;
  dailyLimitMinutes: number; // Ví dụ: 30
  usedMinutesToday: number;   // Thời gian thực tế đã dùng hôm nay
  isBlocked: boolean;
  lastUpdatedDate: string;    // 'YYYY-MM-DD' để tự reset mỗi ngày
}
```

---

## 4. LUỒNG XỬ LÝ LOGIC TRONG ỨNG DỤNG (FLOWCHART)

### 4.1. Luồng Bé Nhấn Mở App từ Launcher
```text
[Bé bấm Icon Facebook] 
       │
       ▼
[Đọc config giới hạn của Facebook]
       │
       ├── Chưa đặt giới hạn ──────> [Mở Facebook bình thường]
       │
       └── Đã đặt giới hạn (30 phút):
              │
              ├── Đã dùng < 30 phút  ──> [Mở Facebook] & [Bắt đầu tính giờ ngầm]
              │
              └── Đã dùng >= 30 phút ──> [CHẶN KHÔNG MỞ]
                                               │
                                               ▼
                                      [Hiện Dialog Cảnh Báo]
                                      "Facebook đã hết 30 phút hôm nay!"
                                               │
                                               ▼
                                      [Nút: Nhập PIN Phụ Huynh Mở Thêm]
```

### 4.2. Luồng Bé Đang Trong App Facebook và Hết Giờ (Active Timeout)
```text
[Bé đang lướt Facebook đến phút thứ 30]
       │
       ▼
[Timer nền kích hoạt Timeout]
       │
       ▼
[Thực thi khóa ngay lập tức]:
 1. Bung Cửa sổ Khóa đè (Lock Overlay) che kín màn hình Facebook
 2. Phát âm thanh / Rung thông báo hết giờ
 3. Tùy chọn:
    ├── Bé bấm "Về màn hình chính" ──> Đưa Launcher lên Foreground
    └── Phụ huynh bấm "Cấp thêm giờ" ──> Nhập mã PIN (1234) ──> Chọn +15p / +30p
```

---

## 5. MÃ NGUỒN MẪU TÍCH HỢP (KOTLIN NATIVE & REACT NATIVE)

### 5.1. Module Native Android: Hàm Kéo về Launcher khi hết giờ
```kotlin
package com.rnlauncherkit

import android.content.Context
import android.content.Intent

object AppLockHelper {
    // Kéo máy về Launcher ngay lập tức khi app bị khóa
    fun bringLauncherToFront(context: Context) {
        val intent = Intent(Intent.ACTION_MAIN).apply {
            addCategory(Intent.CATEGORY_HOME)
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        context.startActivity(intent)
    }
}
```

### 5.2. React Native Logic: Kiểm tra trước khi mở App (`KidsLauncherScreen.tsx`)
```typescript
import { Alert } from 'react-native';
import { RNLauncherKitHelper } from 'react-native-launcher-kit';
import { appLimitService } from '../services/appLimitService';

const handleLaunchApp = (packageName: string, appName: string) => {
  // 1. Kiểm tra chính sách giới hạn thời gian
  const status = appLimitService.checkAppStatus(packageName);

  if (status.isBlocked || status.remainingMinutes <= 0) {
    Alert.alert(
      'Hết thời gian sử dụng',
      `${appName} đã dùng hết ${status.limitMinutes} phút cho phép hôm nay!`,
      [
        { text: 'Đóng', style: 'cancel' },
        { 
          text: 'Phụ huynh mở thêm', 
          onPress: () => openParentAuthForApp(packageName) 
        }
      ]
    );
    return;
  }

  // 2. Mở ứng dụng nếu còn thời gian
  RNLauncherKitHelper.launchApplication(packageName);
};
```

---

## 6. GIAO DIỆN CÀI ĐẶT DÀNH CHO PHỤ HUYNH (PARENT APP TIME MANAGER)

Trên màn hình **Cài đặt Phụ huynh (ParentSettingsScreen)**, thêm mục:
- **Danh sách toàn bộ ứng dụng cài trên máy** kèm Icon, Tên App và Package Name.
- Mỗi ứng dụng có:
  - Công tắc **Bật / Tắt giới hạn**.
  - Thanh chọn thời lượng: `15 phút`, `30 phút`, `45 phút`, `1 giờ`, `2 giờ`, `Không giới hạn`.
  - Nút **Khóa ngay lập tức (Block Now)**.
  - Biểu đồ hiển thị: *Bé đã dùng bao nhiêu phút hôm nay (VD: 24/30 phút)*.

---

## 7. CÁC QUYỀN ANDROID CẦN KHAI BÁO (`AndroidManifest.xml`)

```xml
<!-- 1. Quyền vẽ màn hình khóa đè lên app khác -->
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />

<!-- 2. Quyền đọc dữ liệu thống kê thời gian sử dụng -->
<uses-permission 
    android:name="android.permission.PACKAGE_USAGE_STATS" 
    tools:ignore="ProtectedPermissions" />

<!-- 3. Quyền dịch vụ chạy ngầm giám sát -->
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
```

---

## 8. KẾT LUẬN & ĐÁNH GIÁ TÍNH KHẢ THI

- **Khả thi 100%:** Hoàn toàn khóa được mọi app thật của bên thứ ba như Facebook, YouTube, TikTok, Game.
- **Trải nghiệm mượt mà:** Chặn ngay từ nút bấm ở màn hình Launcher giúp ứng dụng chạy nhẹ, không tốn pin; kết hợp tầng 2 Overlay để chống lách luật khi mở từ thanh thông báo.
- **Đồng bộ đám mây:** Phụ huynh có thể thay đổi số phút giới hạn từ xa trên Supabase, máy con sẽ cập nhật tức thì qua Realtime Sync.
