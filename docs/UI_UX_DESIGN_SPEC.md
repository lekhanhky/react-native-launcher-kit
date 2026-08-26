# TÀI LIỆU ĐẶC TẢ GIAO DIỆN (UI/UX DESIGN SPECIFICATION)
## ỨNG DỤNG PARENTAL CONTROL LAUNCHER (GIAI ĐOẠN 1)

> **Mục tiêu:** Mô tả chi tiết cấu trúc giao diện, bố cục (wireframe), bảng màu, các trạng thái tương tác và trải nghiệm người dùng (UX) cho toàn bộ các màn hình trong ứng dụng Launcher.

---

## 1. DESIGN SYSTEM & QUY CHUẨN THIẾT KẾ

### 1.1. Bảng màu chủ đạo (Color Palette)

| Vai trò | Mã màu HEX | Tên màu | Mô tả ứng dụng |
| :--- | :---: | :--- | :--- |
| **Primary** | `#2563EB` | Royal Blue | Nút bấm chính, hành động kích hoạt, điểm nhấn |
| **Success** | `#16A34A` | Emerald Green | Trạng thái kích hoạt thành công, đang trong giờ cho phép |
| **Warning** | `#F59E0B` | Amber Yellow | Cảnh báo sắp hết giờ, cảnh báo bản quyền sắp hết hạn |
| **Danger / Lock** | `#DC2626` | Ruby Red | Màn hình khóa khẩn cấp, báo lỗi nhập sai mã |
| **Background (Light)** | `#F8FAFC` | Slate 50 | Nền màn hình chính của bé (sáng sủa, thân thiện) |
| **Dark Overlay** | `#0F172A` | Slate 900 | Nền màn hình khóa khi ngoài giờ học/ngủ |
| **Text Primary** | `#0F172A` | Dark Slate | Màu chữ tiêu đề chính |
| **Text Secondary** | `#64748B` | Slate 500 | Màu chữ phụ đề, mô tả hướng dẫn |

### 1.2. Kiểu chữ (Typography)
* **Font chữ hệ thống**: Roboto (Android mặc định) / San Francisco (iOS).
* **Cỡ chữ**:
  * **Header / Title lớn**: 22px – 24px (Bold)
  * **Tiêu đề mục**: 16px – 18px (SemiBold)
  * **Body / Nhãn App**: 11px – 13px (Regular / Medium)
  * **Mã PIN / Key**: 20px – 24px (Bold, Monospace)

---

## 2. CHI TIẾT CÁC MÀN HÌNH & WIREFRAME

---

### 2.1. Màn hình Kích hoạt Bản quyền (`LicenseActivationScreen`)

* **Mục đích**: Hiển thị mã `Device ID` phần cứng của máy và yêu cầu nhập `License Key` để kích hoạt trước khi được vào Launcher.

```text
┌────────────────────────────────────────────────────────┐
│                                                        │
│                          🛡️                            │
│             KÍCH HOẠT BẢN QUYỀN LAUNCHER               │
│      Ứng dụng yêu cầu bản quyền để tiếp tục sử dụng    │
│                                                        │
│   ┌────────────────────────────────────────────────┐   │
│   │ Mã định danh thiết bị (Device ID):             │   │
│   │ 8f14b2d3c90a12e5                               │   │
│   │                                                │   │
│   │ [📋 Sao chép Device ID]                         │   │
│   └────────────────────────────────────────────────┘   │
│                                                        │
│   ┌────────────────────────────────────────────────┐   │
│   │ Nhập mã bản quyền (VD: LCK-8899-AABB)          │   │
│   └────────────────────────────────────────────────┘   │
│                                                        │
│   ┌────────────────────────────────────────────────┐   │
│   │              [ KÍCH HOẠT NGAY ]                │   │
│   └────────────────────────────────────────────────┘   │
│                                                        │
│              Liên hệ hỗ trợ: 1900 xxxx                 │
└────────────────────────────────────────────────────────┘
```

#### Chi tiết thành phần:
1. **Logo / Icon**: Biểu tượng khiên bảo vệ 🛡️ tạo cảm giác an tâm, bảo mật.
2. **Device ID Box**:
   * Khung màu xám nhạt (`#E2E8F0`), bo góc 10px.
   * Hiển thị chuỗi Device ID dạng in đậm.
   * Nút **"📋 Sao chép Device ID"** để gửi nhanh qua Zalo/Tin nhắn cho Admin.
3. **Ô nhập License Key**:
   * Tự động viết hoa toàn bộ ký tự (`autoCapitalize="characters"`).
   * Chữ căn giữa, giãn cách rộng (`letterSpacing: 2`) dễ đọc.
4. **Nút "KÍCH HOẠT NGAY"**:
   * Nền màu xanh Primary (`#2563EB`), chữ trắng in hoa đậm.
   * Khi nhấn: Hiện hiệu ứng xoay tải (`ActivityIndicator`) và vô hiệu hóa nút bấm tạm thời.

---

### 2.2. Màn hình Chính của Bé (`KidsLauncherScreen`)

* **Mục đích**: Màn hình trang chủ Launcher hiển thị các ứng dụng được phụ huynh cho phép, giao diện tối giản, trực quan cho trẻ.

```text
┌────────────────────────────────────────────────────────┐
│  👋 Chào bé yêu!              [ ⚙️ Phụ huynh ]          │
│  Thứ Tư, 26 tháng 8 • 15:30                            │
├────────────────────────────────────────────────────────┤
│                                                        │
│     ┌────┐       ┌────┐       ┌────┐       ┌────┐      │
│     │ 📘 │       │ 🎨 │       │ 🧮 │       │ 🎵 │      │
│     └────┘       └────┘       └────┘       └────┘      │
│     Học Tập      Vẽ Tranh     Toán Học     Âm Nhạc     │
│                                                        │
│     ┌────┐       ┌────┐       ┌────┐       ┌────┐      │
│     │ 📞 │       │ 💬 │       │ 📷 │       │ 🧩 │      │
│     └────┘       └────┘       └────┘       └────┘      │
│    Gọi Điện      Tin Nhắn     Máy Ảnh      Xếp Hình    │
│                                                        │
│                                                        │
└────────────────────────────────────────────────────────┘
```

#### Chi tiết thành phần:
1. **Thanh Header trên cùng**:
   * Lời chào thân thiện + Thời gian thực (Ngày, giờ).
   * Nút **"⚙️ Phụ huynh"** ở góc phải: Bo góc tròn, màu xám nhạt tinh tế để trẻ ít chú ý, bấm vào sẽ yêu cầu mã PIN.
2. **Lưới ứng dụng (App Grid)**:
   * Hiển thị theo dạng lưới **4 cột**.
   * **Icon App**: Kích thước `52x52px`, bo góc nhẹ `12px` chuẩn phong cách Android.
   * **Tên App**: Tối đa 1 dòng (`numberOfLines={1}`), nếu quá dài sẽ hiển thị `...`.
   * **Hiệu ứng chạm (Active Opacity)**: Mờ nhẹ 0.7 khi bé chạm ngón tay vào để khởi chạy.

---

### 2.3. Màn hình Khóa Ngoài Khung Giờ (`LockOverlay`)

* **Mục đích**: Tự động kích hoạt đè lên toàn bộ màn hình khi thiết bị vượt quá giờ đi ngủ (`bedtime`) hoặc giờ học bài.

```text
┌────────────────────────────────────────────────────────┐
│                                                        │
│                          🔒                            │
│                                                        │
│                        21:45                           │
│                                                        │
│                THIẾT BỊ ĐANG TẠM KHÓA                  │
│       Đã đến giờ đi ngủ! Bé hãy nghỉ ngơi nhé.         │
│                                                        │
│                                                        │
│          ┌──────────────────────────────────┐          │
│          │    [ Mở khóa bằng mã PIN ]       │          │
│          └──────────────────────────────────┘          │
│                                                        │
│               [ 📞 Cuộc gọi khẩn cấp ]                 │
└────────────────────────────────────────────────────────┘
```

#### Chi tiết thành phần:
1. **Nền phủ (Overlay)**: Màu tối sâu (`rgba(15, 23, 42, 0.96)`) phủ kín 100% màn hình, che toàn bộ icon app bên dưới.
2. **Đồng hồ lớn**: Hiển thị giờ hiện tại to rõ (36px, Bold, Màu trắng).
3. **Thông điệp khóa**: Tiêu đề và lý do khóa (Ví dụ: *"Chỉ được phép sử dụng từ 07:00 đến 21:00"*).
4. **Nút "Mở khóa bằng mã PIN"**: Dành riêng cho phụ huynh khi cần mở máy gấp cho con.
5. **Nút "Cuộc gọi khẩn cấp"**: Cho phép bé gọi điện đến số điện thoại của Bố/Mẹ kể cả khi máy đang bị khóa.

---

### 2.4. Modal Nhập Mã PIN Phụ huynh (`ParentPinModal`)

* **Mục đích**: Bảo vệ quyền truy cập màn hình Cài đặt hoặc Mở khóa khẩn cấp.

```text
┌────────────────────────────────────────────────────────┐
│                                                        │
│         ┌────────────────────────────────────┐         │
│         │        Nhập mã PIN Phụ huynh       │         │
│         │                                    │         │
│         │           ●  ●  ●  ●               │         │
│         │         [    1234    ]             │         │
│         │                                    │         │
│         │     ┌──────────┐  ┌──────────┐     │         │
│         │     │   Hủy    │  │ Xác nhận │     │         │
│         │     └──────────┘  └──────────┘     │         │
│         └────────────────────────────────────┘         │
│                                                        │
└────────────────────────────────────────────────────────┘
```

#### Chi tiết thành phần:
1. **Backdrop**: Màn tối mờ 50% (`rgba(0, 0, 0, 0.5)`).
2. **Hộp thoại (Card Modal)**: Nền trắng, rộng 280px, bo góc 14px, đổ bóng nhẹ.
3. **Ô nhập PIN**:
   * Chế độ ẩn mật khẩu (`secureTextEntry={true}`).
   * Bàn phím số tự động bật (`keyboardType="numeric"`).
   * Giới hạn tối đa 4 - 6 ký tự (`maxLength={6}`).
4. **Nút bấm**:
   * Nút **Hủy**: Nền xám nhạt, đóng modal.
   * Nút **Xác nhận**: Nền xanh Primary, kiểm tra mã PIN.

---

### 2.5. Màn hình Cài đặt của Phụ huynh (`ParentSettingsScreen`)

* **Mục đích**: Mở ra sau khi nhập đúng mã PIN để phụ huynh tùy chỉnh chính sách ngay trên máy của con.

```text
┌────────────────────────────────────────────────────────┐
│  ← Quay lại          CÀI ĐẶT PHỤ HUYNH                 │
├────────────────────────────────────────────────────────┤
│  ⏰ KHUNG GIỜ CHO PHÉP SỬ DỤNG                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Bật giới hạn giờ                           ( ON) │  │
│  │ Giờ bắt đầu:  [ 07:00 ]   Giờ kết thúc: [ 21:00 ]│  │
│  │ Các ngày áp dụng:  [T2] [T3] [T4] [T5] [T6] [T7] │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  📱 DANH SÁCH ỨNG DỤNG CHO PHÉP (4/12)                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 📘 Học Tiếng Anh                           ( ON) │  │
│  │ 🎨 Vẽ Tranh                                ( ON) │  │
│  │ 🎬 YouTube                                 (OFF) │  │
│  │ ⚙️ Cài đặt hệ thống                         (OFF) │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  🔒 BẢO MẬT & HỆ THỐNG                                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │ • Đổi mã PIN phụ huynh                           │  │
│  │ • Đặt làm Màn hình chính mặc định                │  │
│  │ • Thông tin bản quyền: Vĩnh viễn                 │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

#### Chi tiết thành phần:
1. **Nhóm Khung giờ (Time Schedule Group)**:
   * Công tắc Bật/Tắt chế độ giới hạn giờ.
   * Nút chọn giờ bắt đầu và kết thúc (`TimePicker`).
   * Hàng nút chọn các ngày trong tuần (T2 - CN).
2. **Nhóm Quản lý App (App Management Group)**:
   * Danh sách toàn bộ ứng dụng cài trên máy.
   * Mỗi hàng gồm: Icon App, Tên App, Switch bật/tắt (Gạt xanh = Cho phép bé thấy; Gạt xám = Ẩn khỏi màn hình).
3. **Nhóm Bảo mật**:
   * Đổi mã PIN 4 số.
   * Trạng thái bản quyền và Device ID.

---

## 3. TRẢI NGHIỆM NGƯỜI DÙNG (UX FLOW)

```text
[Bé mở máy]
     │
     ├──> Ngoài giờ học/ngủ ──> Hiện Màn hình Khóa 🔒
     │                              │
     │                              └──> Ba mẹ bấm "Nhập PIN" ──> Mở tạm thời
     │
     └──> Trong giờ cho phép ──> Vào Màn hình chính Launcher
                                    │
                                    ├──> Bé chạm vào Icon App ──> Khởi chạy ứng dụng
                                    │
                                    └──> Bé bấm nút Home ───────> Luôn giữ ở Màn hình chính
```

---

## 4. TỔNG KẾT DANH MỤC THÀNH PHẦN GIAO DIỆN (UI COMPONENTS LIST)

| Component Name | File Path | Mục đích |
| :--- | :--- | :--- |
| **`LicenseActivationScreen`** | `src/screens/LicenseActivationScreen.tsx` | Nhập License Key và xem Device ID |
| **`KidsLauncherScreen`** | `src/screens/KidsLauncherScreen.tsx` | Màn hình chính hiển thị app của bé |
| **`LockOverlay`** | `src/components/LockOverlay.tsx` | Lớp phủ tối khóa máy khi hết giờ |
| **`ParentPinModal`** | `src/components/ParentPinModal.tsx` | Hộp thoại nhập mã PIN bảo vệ |
| **`ParentSettingsScreen`** | `src/screens/ParentSettingsScreen.tsx` | Màn hình quản lý app và giờ của cha mẹ |
