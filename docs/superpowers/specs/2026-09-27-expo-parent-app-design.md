# Thiết Kế Kỹ Thuật (Design Spec): Expo React Native Parent Mobile App

**Ngày**: 2026-09-27  
**Dự án**: `parent-app` (Kids Launcher Parent Mobile Client)  
**Nền tảng**: Expo React Native (iOS / Android)  
**Tham chiếu**: Hệ thống Web Portal (`web-portal/src/app/(parent)/parent`) & Tablet Launcher (`example`)

---

## 1. Mục Tiêu & Bối Cảnh

Hệ sinh thái **Kids Launcher Tablet** hiện tại bao gồm:
1. Ứng dụng Launcher chạy trên máy tính bảng của bé (`example/` - React Native CLI).
2. Hệ thống Web Portal quản trị (`web-portal/` - Next.js 14) gồm phân hệ Super Admin và Cổng Phụ Huynh trên trình duyệt.
3. Ứng dụng Quản trị viên `admin-app/` (Expo SDK 52) dành riêng cho Super Admin.

Nhằm mang lại trải nghiệm tiện lợi, trực quan và tức thì cho phụ huynh khi quản lý thiết bị của con trực tiếp trên điện thoại thông minh cá nhân (không cần mở trình duyệt web), dự án **`parent-app`** được thiết kế dưới dạng ứng dụng di động độc lập xây dựng bằng **Expo React Native**.

---

## 2. Kiến Trúc Kỹ Thuật (Architecture & Tech Stack)

- **Framework**: Expo SDK 52 (React Native 0.76+, React 18).
- **Điều hướng (Routing)**: `expo-router` v4 (File-based routing theo thư mục `app/`).
- **Giao diện & Styling**: Bảng màu Family Care hiện đại (Primary: Indigo `#4F46E5`, Teal `#0D9488`, Amber `#F59E0B`, Danger Red `#EF4444`, Background `#0F172A`).
- **Backend & Database**: `@supabase/supabase-js` v2.
- **Xác thực Phụ huynh (Auth)**: Supabase Auth (Email / Password) đồng bộ nhiều máy phụ huynh.
- **Camera & QR Scanner**: `expo-camera` đọc mã QR pairing hiển thị trên tablet bé.
- **Realtime Sync**: Supabase Realtime WebSocket broadcast (kênh `device_pairing:${deviceId}` và `parental_control:${deviceId}`).
- **Quản lý Phiên (Session Storage)**: `@react-native-async-storage/async-storage`.
- **Biểu tượng (Iconography)**: `lucide-react-native` + `react-native-svg`.

---

## 3. Cấu Trúc Thư Mục Dự Án (`parent-app/`)

```text
parent-app/
├── app/
│   ├── _layout.tsx                     # Root layout (Auth Provider, Device Provider, SafeArea, StatusBar)
│   ├── (auth)/
│   │   ├── _layout.tsx                 # Stack layout không header
│   │   ├── login.tsx                   # Màn hình đăng nhập Email/Mật khẩu
│   │   └── register.tsx                # Màn hình đăng ký tài khoản Phụ huynh
│   ├── (main)/
│   │   ├── _layout.tsx                 # Bottom Tabs: Dashboard, Thiết bị (Children), Hồ sơ
│   │   ├── index.tsx                   # Tab 1: Dashboard điều khiển khẩn cấp (Khóa / Mở khóa nhanh bé đang chọn)
│   │   ├── children/
│   │   │   └── index.tsx               # Tab 2: Danh sách các bé & thiết bị tablet
│   │   └── profile.tsx                 # Tab 3: Thông tin phụ huynh & Đăng xuất
│   └── pair-device.tsx                 # Modal quét mã QR (expo-camera) & nhập mã PIN/ID bằng tay
├── assets/                             # Icons, splash screen, images
├── src/
│   ├── components/
│   │   ├── EmergencyLockButton.tsx     # Nút gạt/bấm khóa khẩn cấp to, hiển thị trạng thái Realtime
│   │   ├── DeviceStatusBadge.tsx       # Huy hiệu hiển thị Online / Đã khóa / Hoạt động
│   │   ├── ChildCard.tsx               # Thẻ tóm tắt thông tin bé (Tên, Tablet model, Trạng thái)
│   │   └── QrScannerView.tsx           # Component bao bọc expo-camera kèm khung ngắm và nút bật đèn flash
│   ├── context/
│   │   ├── AuthContext.tsx             # Quản lý phiên Supabase Auth (User, Session, Sign In/Out)
│   │   └── DeviceContext.tsx           # Quản lý danh sách thiết bị con, Active Device, Trạng thái khóa
│   ├── services/
│   │   ├── supabase.ts                 # Khởi tạo Supabase Client với AsyncStorage persister
│   │   ├── pairingService.ts           # Giải mã QR, upsert parent_devices và bắn broadcast kích hoạt
│   │   └── remoteControlService.ts     # Broadcast lệnh Khóa/Mở khóa qua kênh parental_control:${deviceId}
│   ├── theme/
│   │   └── colors.ts                   # Token màu sắc và phong cách giao diện
│   └── types/
│       └── index.ts                    # Interfaces: Device, ChildProfile, Policy, RealtimePayload
├── .env                                # Supabase URL & Anon Key
├── app.json                            # Expo config (Camera permissions, bundle ID, splash)
├── package.json                        # Dependencies
└── tsconfig.json                       # Cấu hình TypeScript
```

---

## 4. Mô Hình Dữ Liệu & Supabase Schema

### 4.1. Bảng liên kết Phụ huynh - Thiết bị (`parent_devices`)
```sql
CREATE TABLE IF NOT EXISTS public.parent_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    device_id TEXT REFERENCES public.devices(device_id) ON DELETE CASCADE,
    child_name TEXT DEFAULT 'Bé Yêu',
    child_avatar TEXT DEFAULT '👦',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(parent_id, device_id)
);
```

### 4.2. Tương tác với bảng có sẵn:
- **`devices`**:
  - `device_id`: Mã định danh phần cứng duy nhất của tablet.
  - `device_name`: Tên thiết bị (VD: Samsung Tab A9).
  - `is_paired`: Boolean (true khi đã ghép nối với phụ huynh).
  - `last_seen`: Timestamp cập nhật lần cuối.
- **`parental_policies`**:
  - `device_id`: Khóa ngoại trỏ đến `devices(device_id)`.
  - `is_emergency_locked`: Boolean (true = đang kích hoạt khóa khẩn cấp).
  - `parent_pin`: Mã PIN 4 số của phụ huynh (mặc định `'1234'`).

---

## 5. Chi Tiết Các Phân Hệ Tính Năng (MVP)

### 5.1. Phân hệ Xác thực (Authentication)
- Đăng ký & Đăng nhập bằng Email / Mật khẩu thông qua `supabase.auth.signInWithPassword` và `signUp`.
- Tự động lưu phiên vào `AsyncStorage` để phụ huynh không phải đăng nhập lại mỗi khi mở app.
- Tự động điều hướng: Nếu chưa có session -> chuyển sang màn hình `(auth)/login`; nếu đã có session -> vào thẳng `(main)/`.

### 5.2. Phân hệ Quét mã QR & Ghép nối (`pair-device.tsx`)
- Sử dụng `expo-camera` yêu cầu quyền camera với giao diện quét QR hiện đại.
- Nhận diện định dạng QR code từ màn hình `LicenseActivationScreen` của bé:
  ```json
  {
    "type": "KIDS_LAUNCHER_PAIRING",
    "deviceId": "dev_12345678",
    "deviceName": "Samsung Galaxy Tab",
    "timestamp": 1727440000000
  }
  ```
- Dự phòng (Fallback): Hỗ trợ nhập mã thiết bị (Device ID) 6-12 ký tự bằng tay nếu camera bị lỗi hoặc ánh sáng kém.
- Khi xác nhận ghép nối thành công:
  1. Ghi liên kết vào `parent_devices` với `parent_id = auth.uid()`.
  2. Bắn sự kiện Realtime broadcast `DEVICE_PAIRED_SUCCESS` đến kênh `device_pairing:${deviceId}`.
  3. Màn hình tablet của bé lập tức tự động vào giao diện chính.
  4. Đóng modal và tự động đặt thiết bị mới làm `Active Device`.

### 5.3. Phân hệ Điều Khiển Từ Xa Khẩn Cấp (Dashboard Hub)
- **Chọn con (Active Child Switcher)**: Cho phép chuyển đổi nhanh giữa các con nếu phụ huynh có nhiều bé.
- **Nút Khóa Khẩn Cấp (Emergency Lock Toggle)**:
  - Khi bật:
    - Gửi cập nhật DB: `parental_policies.is_emergency_locked = true`.
    - Bắn broadcast Realtime WebSocket < 1s vào kênh `parental_control:${deviceId}`:
      ```json
      {
        "type": "EMERGENCY_LOCK",
        "isLocked": true,
        "reason": "Khóa tức thì từ Phụ huynh",
        "timestamp": 1727440000000
      }
      ```
    - Tablet của bé ngay lập tức phủ màn hình khóa `LockOverlay.tsx`.
  - Khi mở khóa:
    - Gửi `is_emergency_locked = false` và broadcast `isLocked: false` -> Màn hình khóa trên tablet bé tự động hạ xuống.

### 5.4. Phân hệ Quản lý Thiết Bị (`children/index.tsx`)
- Danh sách trực quan các máy tính bảng đã kết nối:
  - Tên bé, avatar emoji (👦, 👧, 🧒).
  - Tên máy (Samsung Tab, iPad, v.v.).
  - Trạng thái: Đang hoạt động / Đang khóa / Chưa kết nối.
- Nút "Thêm Thiết Bị Mới" dẫn tới modal quét QR `pair-device.tsx`.

---

## 6. Xử Lý Ngoại Lệ & Độ Tin Cậy (Reliability & Edge Cases)

1. **Mất kết nối Internet**:
   - Nếu phụ huynh bấm nút khóa khi mất mạng: Thông báo lỗi *"Không thể kết nối máy chủ Supabase. Vui lòng kiểm tra Wifi/4G"*.
2. **Quét mã QR ngẫu nhiên không đúng chuẩn**:
   - Kiểm tra trường `payload.type === 'KIDS_LAUNCHER_PAIRING'` và `payload.deviceId`.
   - Nếu không khớp: Hiển thị cảnh báo *"Mã QR không hợp lệ. Vui lòng quét mã trên màn hình của bé."*
3. **Đồng bộ hai chiều (Two-Way Sync)**:
   - Nếu bé nhập mã PIN phụ huynh trực tiếp trên máy tính bảng để mở khóa cục bộ, tablet sẽ cập nhật `is_emergency_locked: false` lên Supabase.
   - App Phụ Huynh đăng ký lắng nghe Supabase Realtime postgres_changes trên bảng `parental_policies` để tự động đổi trạng thái nút bấm trên điện thoại của phụ huynh.

---

## 7. Tiêu Chuẩn Kiểm Thử & Nghiệm Thu (Verification Criteria)

1. **Khởi chạy độc lập**: Ứng dụng chạy mượt mà trên Expo (hỗ trợ cả Expo Go, Android Emulator, và Web bundler để test nhanh).
2. **Đăng nhập & Phiên**: Đăng nhập/đăng ký tài khoản phụ huynh thành công, tự động lưu session.
3. **Quét QR ghép nối**: Camera nhận diện mã QR của tablet và kích hoạt tablet mở khóa launcher.
4. **Độ trễ khóa từ xa**: Khi phụ huynh gạt nút khóa trên app, màn hình tablet bé chuyển sang khóa khẩn cấp trong vòng dưới 1 giây.
