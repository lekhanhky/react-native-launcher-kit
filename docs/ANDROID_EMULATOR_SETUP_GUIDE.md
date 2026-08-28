# HƯỚNG DẪN KẾT NỐI VÀ CHẠY APP TRÊN THIẾT BỊ ANDROID ẢO (EMULATOR)

> **Dự án:** React Native Launcher Kit  
> **Áp dụng cho:** Android Studio AVD & Các phần mềm giả lập bên thứ ba (LDPlayer, NoxPlayer, BlueStacks, Genymotion)  
> **Hệ điều hành:** Windows (PowerShell)

---

## 1. YÊU CẦU TIÊN QUYẾT (PREREQUISITES)

Trước khi bắt đầu, đảm bảo máy tính đã được cài đặt:
1. **Node.js** (Khuyên dùng v20+ hoặc v22+).
2. **Android SDK & ADB** (Đường dẫn mặc định trên Windows: `C:\Users\<Tên_User>\AppData\Local\Android\Sdk\platform-tools`).
3. **Biến môi trường (Environment Variables)**: Thêm đường dẫn `platform-tools` vào biến hệ thống `Path` để có thể gõ lệnh `adb` ở mọi nơi.

---

## 2. KHỞI ĐỘNG THIẾT BỊ ẢO (VIRTUAL DEVICE)

### Cách 1: Sử dụng Android Studio Virtual Device (AVD - Chuẩn nhất)
1. Mở **Android Studio** ➔ Chọn **Device Manager** (hoặc `Tools` > `Device Manager`).
2. Nhấn **Create Virtual Device** ➔ Chọn mẫu máy (VD: **Pixel 7** hoặc **Pixel 8**).
3. Chọn phiên bản Android: **API 33 (Android 13)** hoặc **API 34 (Android 14)** ➔ Nhấn **Finish**.
4. Nhấn nút **Play (▶️)** để khởi động máy ảo.

### Cách 2: Sử dụng Trình giả lập ngoài (LDPlayer / NoxPlayer / Genymotion)
1. Mở phần mềm giả lập.
2. Vào **Cài đặt (Settings)** của giả lập ➔ Bật **Quyền Root** và **Gỡ lỗi USB (USB Debugging)**.
3. Độ phân giải khuyên dùng: `1080 x 1920` (Điện thoại) hoặc `1200 x 1920` (Máy tính bảng).

---

## 3. QUY TRÌNH KẾT NỐI & CHẠY ỨNG DỤNG CHI TIẾT (TỪNG BƯỚC)

```text
┌─────────────────────────┐       ┌─────────────────────────┐       ┌─────────────────────────┐
│   1. Kết nối thiết bị   │  ──>  │   2. Chuyển tiếp cổng   │  ──>  │   3. Khởi động Metro    │
│      (adb connect)      │       │      (adb reverse)      │       │       (npm start)       │
└─────────────────────────┘       └─────────────────────────┘       └─────────────────────────┘
                                                                                 │
                                                                                 ▼
┌─────────────────────────┐       ┌─────────────────────────┐       ┌─────────────────────────┐
│   6. Hoàn tất & Test    │  <──  │   5. Khởi chạy MainActivity   <──  │   4. Build & Install    │
│   (Chọn Default Home)   │       │   (Starting Intent)     │       │   (npm run android)     │
└─────────────────────────┘       └─────────────────────────┘       └─────────────────────────┘
```

---

### Bước 1: Kết nối thiết bị qua ADB

Mở terminal và thực hiện kết nối:

- **Đối với LDPlayer / Giả lập chạy cổng 5555:**
  ```powershell
  adb connect 127.0.0.1:5555
  ```
- **Đối với NoxPlayer:**
  ```powershell
  adb connect 127.0.0.1:62001
  ```
- **Kiểm tra danh sách thiết bị đã nhận diện:**
  ```powershell
  adb devices
  ```
  *Kết quả hợp lệ sẽ hiển thị trạng thái `device`:*
  ```text
  List of devices attached
  127.0.0.1:5555    device
  ```

---

### Bước 2: Cấu hình Chuyển tiếp cổng kết nối Metro (Reverse Port)

Lệnh này giúp máy ảo kết nối trực tiếp đến máy chủ đóng gói mã nguồn (Metro Server 8081) trên máy tính:

```powershell
adb -s 127.0.0.1:5555 reverse tcp:8081 tcp:8081
```

---

### Bước 3: Khởi động Metro Bundler (Terminal 1)

Mở **Tab Terminal thứ nhất**, di chuyển vào thư mục `example` và khởi chạy server phát triển:

```powershell
cd c:\react-native-launcher-kit\example
npm start
```
*Giữ tab terminal này luôn chạy ngầm trong suốt quá trình phát triển.*

---

### Bước 4: Biên dịch và Cài đặt ứng dụng lên máy ảo (Terminal 2)

Mở **Tab Terminal thứ hai**, chạy lệnh cài đặt ứng dụng nhắm đúng mục tiêu thiết bị:

```powershell
cd c:\react-native-launcher-kit\example
npm run android -- --deviceId 127.0.0.1:5555
```

*Quá trình build thành công sẽ hiển thị:*
```text
info Connecting to the development server...
info Installing the app on the device "127.0.0.1:5555"...
Performing Streamed Install
Success
info Starting the app on "127.0.0.1:5555"...
Starting: Intent { act=android.intent.action.MAIN cat=[android.intent.category.LAUNCHER] cmp=com.rnlauncherkit/.MainActivity }
```

---

### Bước 5: Cấp quyền Launcher trên máy ảo

Khi ứng dụng mở lên lần đầu:
1. Android sẽ hiển thị hộp thoại chọn **Home App**.
2. Chọn **`rnlauncherkit`** và bấm **"Luôn luôn" (Always)**.
3. Giao diện Launcher dành cho trẻ em sẽ xuất hiện và hoạt động đầy đủ chức năng.

---

## 4. CÁC THAO TÁC PHÁT TRIỂN & PHÍM TẮT (DEVELOPER CHEATSHEET)

| Thao tác | Cách thực hiện |
| :--- | :--- |
| **Fast Refresh (Tự động cập nhật)** | Tự động tải lại giao diện ngay khi bạn lưu (`Ctrl + S`) bất kỳ file mã nguồn `.tsx`/`.ts` nào |
| **Reload thủ công** | Nhấn phím `R` 2 lần liên tiếp tại Terminal đang chạy `npm start` |
| **Mở Menu Nhà phát triển (Dev Menu)** | Nhấn `Ctrl + M` trên bàn phím máy ảo |
| **Gửi lệnh mở Dev Menu qua Terminal** | `adb -s 127.0.0.1:5555 shell input keyevent 82` |
| **Gửi phím Home về Launcher** | `adb -s 127.0.0.1:5555 shell input keyevent 3` |
| **Xem Logcat chi tiết** | `npx react-native log-android` |
| **Gỡ cài đặt app cũ khi lỗi cache** | `adb -s 127.0.0.1:5555 uninstall com.rnlauncherkit` |

---

## 5. XỬ LÝ SỰ CỐ THƯỜNG GẶP (TROUBLESHOOTING)

### 1. Lỗi: "Unable to load script. Make sure you're either running Metro..." (Màn hình đỏ)
- **Nguyên nhân:** Máy ảo không thể giao tiếp với cổng 8081 của máy tính.
- **Cách xử lý:** Chạy lại lệnh:
  ```powershell
  adb -s 127.0.0.1:5555 reverse tcp:8081 tcp:8081
  ```
  Sau đó nhấn `Ctrl + M` trên máy ảo ➔ Chọn **Reload**.

### 2. Lỗi: Thiết bị hiển thị `offline` hoặc `unauthorized` trong `adb devices`
- **Cách xử lý:** Khởi động lại dịch vụ ADB Server:
  ```powershell
  adb kill-server
  adb start-server
  adb connect 127.0.0.1:5555
  ```

### 3. Lỗi: Port 8081 bị chiếm dụng bởi tiến trình khác
- **Cách xử lý:** Tìm và tắt tiến trình đang chiếm cổng:
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 8081).OwningProcess | Stop-Process -Force
  ```
  Sau đó khởi động lại `npm start`.
