# KẾ HOẠCH TRIỂN KHAI: XÂY DỰNG ỨNG DỤNG PARENTAL CONTROL LAUNCHER (GIAI ĐOẠN 1)

Kế hoạch này hướng dẫn từng bước lập trình để xây dựng hoàn chỉnh ứng dụng **Kids Launcher & Parental Control** theo đặc tả tại [PHASE_1_PARENTAL_CONTROL_GUIDE.md](file:///c:/react-native-launcher-kit/docs/PHASE_1_PARENTAL_CONTROL_GUIDE.md).

---

## 1. TỔNG QUAN & MỤC TIÊU

Xây dựng ứng dụng Launcher kiểm soát trẻ em kết hợp quản lý bản quyền phần cứng và đồng bộ đám mây:
1. **Kích hoạt bản quyền**: Ràng buộc mã License Key theo `Device Unique ID` (Android ID).
2. **Ẩn / Cho phép App**: Bộ lọc danh sách app (Whitelist/Blacklist) bằng `react-native-launcher-kit`.
3. **Màn hình chính mặc định**: Khóa nút Home, luôn đưa về giao diện launcher.
4. **Lập lịch giờ học / giờ ngủ**: Khóa màn hình ngoài khung giờ cho phép.
5. **Mã PIN Phụ huynh**: Bảo vệ cài đặt và mở khóa khẩn cấp.
6. **Mô hình Local-First**: Hoạt động mượt mà khi Offline bằng `MMKV`, tự động đồng bộ khi có mạng qua `Supabase`.

---

## 2. CÁC THÀNH PHẦN VÀ FILE CẦN TRIỂN KHAI

### Thành phần 1: Cấu hình Backend & Supabase Database
Tạo script migration SQL để khởi tạo toàn bộ CSDL trên Supabase.

* **File:** `docs/sql/01_parental_control_schema.sql`
  * Enum `license_status_enum` (`pending`, `active`, `expired`, `blocked`).
  * Bảng `devices` (Device Unique ID, License Key, hạn dùng).
  * Bảng `parental_policies` (Blacklist/Whitelist packages, mã PIN phụ huynh).
  * Bảng `time_schedules` (Khung giờ cho phép sử dụng theo ngày trong tuần).
  * Kích hoạt Supabase Realtime cho các bảng.

---

### Thành phần 2: Tầng Dịch vụ & Local Cache (Services)
Xây dựng các module xử lý logic nền tảng.

* **`src/services/storage.ts`**:
  * Khởi tạo `MMKV` để lưu trữ cache tốc độ cao.
  * Khởi tạo `supabase` client.
  * Định nghĩa các hằng số `STORAGE_KEYS`.

* **`src/services/licenseService.ts`**:
  * Đọc `Device Unique ID` qua `react-native-device-info`.
  * Kiểm tra trạng thái bản quyền offline trong `MMKV`.
  * Gửi xác thực và kích hoạt License Key lên Supabase.
  * Xử lý ràng buộc: chống dùng 1 key cho 2 máy, kiểm tra hết hạn (`expired_at`).

* **`src/services/timeScheduler.ts`**:
  * Hàm `checkIsOutsideAllowedHours()` kiểm tra thời gian hiện tại với cấu hình cho phép.
  * Hỗ trợ thiết lập linh hoạt theo từng ngày trong tuần (T2 - CN).

* **`src/services/launcherHelper.ts`**:
  * Hàm `setupDefaultLauncher()` kiểm tra và yêu cầu người dùng đặt app làm Default Launcher.

---

### Thành phần 3: Giao diện Người dùng (Screens & UI Components)

* **`src/screens/LicenseActivationScreen.tsx`**:
  * Giao diện nhập License Key.
  * Hiển thị `Device ID` và nút **"📋 Sao chép Device ID"** gửi Admin.
  * Xử lý trạng thái đang kích hoạt, báo lỗi hoặc thành công.

* **`src/screens/KidsLauncherScreen.tsx`**:
  * Hiển thị lưới ứng dụng (`FlatList`).
  * Lọc ẩn các app cấm (`react-native-launcher-kit`).
  * Tự động hiển thị `Lock Overlay` khi ngoài giờ học/ngủ.
  * Modal nhập **Mã PIN Phụ huynh** để mở khóa tạm thời hoặc vào Cài đặt.
  * Tự động cập nhật giao diện khi có app mới cài đặt/gỡ bỏ.

* **`src/services/themes.ts`**:
  * Định nghĩa cấu trúc `ThemeConfig` và 5 theme phong cách trẻ em (Vũ trụ, Kẹo ngọt, Safari, Đại dương, Siêu anh hùng).
  * Quản lý lưu và đọc Theme được chọn qua `MMKV` (`STORAGE_KEYS.CURRENT_THEME`).

* **`src/services/youtubeService.ts`**:
  * Quản lý danh sách video/kênh YouTube chọn lọc an toàn cho bé (BabyBus, Tiếng Anh Thiếu Nhi, Phim hoạt hình giáo dục, v.v.).
  * Lưu trữ cấu hình: Bật/Tắt YouTube cho bé, Giới hạn thời gian xem hàng ngày (Daily Time Limit).
  * Bộ đếm thời gian xem video tự động nhắc nhở/ngắt khi hết thời lượng cho phép.

* **`src/screens/KidsYouTubeScreen.tsx`**:
  * Màn hình trình phát video YouTube an toàn tích hợp trực tiếp (không cần cài app YouTube ngoài).
  * Trình phát video qua iframe sạch (`react-native-webview`), chặn Shorts, chặn bình luận và chặn chuyển hướng ra ngoài.
  * Bộ lọc danh mục video (Học tập, Ca nhạc, Hoạt hình, Kể chuyện).

* **`App.tsx`**:
  * Entry point điều phối luồng: Kiểm tra bản quyền -> Chưa kích hoạt mở `LicenseActivationScreen` -> Đã kích hoạt mở `KidsLauncherScreen`.

---

## 3. KẾ HOẠCH KIỂM THỬ (VERIFICATION PLAN)

### 3.1. Kiểm tra Bản quyền & Device ID
- [ ] Mở app lần đầu: Hiện màn hình kích hoạt và hiển thị đúng Device ID.
- [ ] Nhập sai Key hoặc Key của máy khác: Báo lỗi từ chối.
- [ ] Nhập đúng Key: Kích hoạt thành công, lưu vào MMKV và chuyển vào Launcher.

### 3.2. Kiểm tra Launcher & Ẩn App
- [ ] Bấm nút Home: Android giữ người dùng ở Launcher của app.
- [ ] Danh sách app: Các app trong Blacklist (như Cài đặt hệ thống) bị ẩn hoàn toàn.

### 3.3. Kiểm tra Khung giờ & Mã PIN
- [ ] Chỉnh giờ hệ thống ngoài khung giờ cho phép: Màn hình khóa màu tối lập tức hiển thị.
- [ ] Nhập đúng mã PIN phụ huynh: Mở khóa thành công.

### 3.4. Kiểm tra Hệ thống Giao diện Trẻ em (Kids Themes)
- [ ] Bấm nút **"🎨 Giao diện"**: Mở Modal hiển thị 5 giao diện.
- [ ] Chọn từng giao diện (Vũ trụ, Kẹo ngọt, Safari, Đại dương, Siêu anh hùng): Toàn bộ màu nền, thanh tiêu đề, thẻ app và icon đổi phong cách tức thì.
- [ ] Đóng và mở lại app: Theme đã chọn vẫn được duy trì qua MMKV.

### 3.5. Kiểm tra Tích hợp YouTube An Toàn Cho Bé (Kids YouTube Hub)
- [ ] Chạm vào thẻ **"📺 YouTube Bé Yêu"** trên Launcher: Mở trực tiếp màn hình YouTube an toàn ngay trong app.
- [ ] Phát video: Video chạy mượt mà qua trình phát nhúng không quảng cáo.
- [ ] Chặn truy cập ngoài: Không có tính năng xem Shorts, không có bình luận, không thể mở sang ứng dụng hoặc trang web khác.
- [ ] Giới hạn thời gian xem: Đếm giờ xem video và hiển thị thông báo nghỉ ngơi khi hết hạn mức ngày.

### 3.6. Kiểm tra Chế độ Ngoại tuyến (Offline Test)
- [ ] Tắt toàn bộ Wi-Fi / 4G (Chế độ máy bay): Mở lại app -> Mở ngay tức thì không bị treo, toàn bộ chính sách, theme và bản quyền vẫn hoạt động chuẩn xác.
