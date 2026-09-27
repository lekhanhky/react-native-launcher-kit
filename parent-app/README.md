# Kids Launcher Parent App (Expo React Native)

Ứng dụng di động độc lập (**Parent Mobile Client**) dành riêng cho Phụ huynh, kết nối trực tiếp với backend Supabase và hệ thống máy tính bảng của bé (`example/` - Kids Launcher).

---

## 📱 Các Tính Năng Đã Triển Khai (MVP)

1. **Xác thực Phụ Huynh (Supabase Auth)**:
   - Đăng nhập & Đăng ký bằng Email / Mật khẩu.
   - Quản lý phiên làm việc tự động với AsyncStorage persister, hỗ trợ nhiều máy phụ huynh (bố, mẹ) cùng quản lý thiết bị của bé.

2. **Quét Mã QR & Ghép Nối Thiết Bị Bé (`/pair-device`)**:
   - Sử dụng Camera Native (`expo-camera`) quét mã QR kích hoạt hiển thị trên tablet của bé.
   - Tự động nhận diện payload `KIDS_LAUNCHER_PAIRING` và lưu liên kết vào Supabase.
   - Bắn broadcast Realtime WebSocket `DEVICE_PAIRED_SUCCESS` đến máy bé để tự động mở khóa vào màn hình chính.
   - Hỗ trợ nhập mã thiết bị (Device ID) bằng tay dự phòng.

3. **Điều Khiển Từ Xa Khẩn Cấp (Dashboard Hub)**:
   - Nút **"KHÓA MÁY KHẨN CẤP"** cỡ lớn với hiệu ứng trực quan:
     - Gửi cập nhật cơ sở dữ liệu `parental_policies.is_emergency_locked`.
     - Đồng thời phát sự kiện Realtime WebSocket `< 1 giây` tới máy bé qua kênh `parental_control:${deviceId}`.
   - Hiển thị mã PIN phụ huynh dự phòng của máy bé (mặc định: `1234`).
   - Tự động chuyển đổi giữa các bé nếu phụ huynh có nhiều con.

4. **Danh Sách & Quản Lý Thiết Bị Bé (`/children`)**:
   - Quản lý danh sách các tablet đã kết nối.
   - Xem trạng thái tức thì: *Đang Hoạt Động*, *Đang Bị Khóa*, *Chưa Kích Hoạt*.
   - Khóa / Mở khóa nhanh từng máy trực tiếp trên thẻ thiết bị.

5. **Hồ Sơ & Trạng Thái Hệ Thống (`/profile`)**:
   - Xem email tài khoản đang đăng nhập.
   - Kiểm tra trạng thái kết nối Supabase Cloud & WebSocket Realtime.
   - Đăng xuất an toàn khỏi ứng dụng.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Cài đặt Dependencies (nếu cài mới)
```bash
cd parent-app
npm install
```

### 2. Khởi chạy Ứng dụng với Expo
```bash
cd parent-app

# Chạy Expo Metro Bundler
npx expo start

# Chạy trực tiếp trên trình duyệt Web để kiểm thử nhanh
npx expo start --web

# Chạy trên máy ảo Android / thiết bị thật qua Expo Go
npx expo start --android
```

### 3. Chạy Kiểm Thử Tự Động (Unit & E2E Tests)
```bash
cd parent-app
npm test
```
Tất cả 4 test suites:
- `__tests__/types.test.ts`: Kiểm tra bảng màu và các cấu trúc dữ liệu.
- `__tests__/services.test.ts`: Kiểm tra giải mã QR code và validation.
- `__tests__/deviceContext.test.ts`: Kiểm tra logic phân loại trạng thái thiết bị.
- `__tests__/e2e-flow.test.ts`: Mô phỏng luồng ghép nối, khóa khẩn cấp và mở khóa liên hoàn.
