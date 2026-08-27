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

### 1.3. Hệ thống 5 Bộ Theme Trẻ em (Kids Theme Presets)

Ứng dụng hỗ trợ thay đổi toàn bộ phong cách hình ảnh theo 5 chủ đề độc đáo:

| Theme ID | Tên Chủ Đề | Màu Nền (`background`) | Màu Thẻ App (`cardBg`) | Màu Chữ (`textColor`) | Điểm Nhấn (`accent`) | Phong Cách Trực Quan |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| `space` | 🚀 **Vũ trụ Huyền bí** | `#0F172A` | `#1E293B` | `#F8FAFC` | `#38BDF8` | Nền tối kỳ ảo, viền Neon Cyan, icon bo tròn công nghệ |
| `candy` | 🌈 **Kẹo Ngọt Cầu vồng** | `#FFF1F2` | `#FFFFFF` | `#881337` | `#F43F5E` | Hồng pastel ngọt ngào, thẻ bo tròn mềm mại (Bubbly) |
| `safari` | 🦁 **Rừng Xanh Safari** | `#F0FDF4` | `#FFFFFF` | `#14532D` | `#16A34A` | Xanh lá thiên nhiên, viền ấm áp, biểu tượng rừng xanh |
| `ocean` | 🌊 **Đại dương Kỳ thú** | `#F0F9FF` | `#FFFFFF` | `#0C4A6E` | `#0284C7` | Xanh ngọc biển sâu, cảm giác mát mẻ, dịu mắt cho bé |
| `superhero` | ⚡ **Siêu Anh Hùng** | `#FEF9C3` | `#FFFFFF` | `#7F1D1D` | `#DC2626` | Vàng Comic & Đỏ năng lượng, viền đậm phong cách truyện tranh |

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
│  👋 Chào bé yêu!        [ 🎨 Giao diện ] [ ⚙️ Phụ huynh ]│
│  Thứ Năm, 27 tháng 8 • 08:55                           │
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
   * Lời chào thân thiện + Thông tin màn hình an toàn cho trẻ.
   * Nút **"🎨 Giao diện"**: Mở modal chọn 5 bộ chủ đề sinh động tức thì.
   * Nút **"⚙️ Phụ huynh"**: Yêu cầu mã PIN trước khi mở màn hình cấu hình.
2. **Lưới ứng dụng (App Grid)**:
   * Hiển thị theo dạng lưới **4 cột**.
   * **Icon App**: Kích thước `54x54px`, hỗ trợ bo góc, màu viền và đổ bóng linh hoạt theo theme đã chọn.
   * **Tên App**: Tối đa 1 dòng (`numberOfLines={1}`), tự đổi màu chữ theo theme.
   * **Hiệu ứng chạm (Active Opacity)**: Phản hồi chạm mượt mà.

---

### 2.2.1. Hộp thoại Chọn Giao diện Trẻ em (`ThemeSelectorModal`)

* **Mục đích**: Hiển thị danh sách 5 theme dưới dạng các thẻ trực quan có màu sắc preview và icon đại diện sinh động.

```text
┌────────────────────────────────────────────────────────┐
│               🎨 CHỌN GIAO DIỆN YÊU THÍCH               │
│         Bé hãy chọn thế giới màu sắc mà bé thích nhé!  │
├────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐  │
│  │ 🚀  Vũ trụ Huyền bí          [ ĐANG DÙNG ✔️ ]    │  │
│  │     Màu tím huyền bí, các vì sao và phi thuyền   │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 🌈  Kẹo Ngọt Cầu vồng        [ CHỌN ]            │  │
│  │     Màu hồng phấn ngọt ngào, kẹo ngọt & cầu vồng │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 🦁  Rừng Xanh Safari         [ CHỌN ]            │  │
│  │     Xanh lá thiên nhiên, muông thú hoang dã      │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 🌊  Đại dương Kỳ thú         [ CHỌN ]            │  │
│  │     Xanh biển sâu mát mẻ, thế giới sinh vật biển │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ ⚡  Siêu Anh Hùng            [ CHỌN ]            │  │
│  │     Vàng & Đỏ rực rỡ, phong cách truyện tranh    │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│                    [ ĐÓNG LẠI ]                        │
└────────────────────────────────────────────────────────┘
```

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

---

### 2.5. Màn hình YouTube An Toàn Cho Bé (`KidsYouTubeScreen`)

* **Mục đích**: Màn hình xem video giáo dục/giải trí chọn lọc, tích hợp phát trực tiếp không quảng cáo, không Shorts, bảo vệ an toàn cho trẻ.

```text
┌────────────────────────────────────────────────────────┐
│  ← Quay lại          📺 YOUTUBE CHO BÉ        ⏱️ 25/45p│
├────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐  │
│  │                                                  │  │
│  │            [ 🎬 TRÌNH PHÁT VIDEO NHÚNG ]         │  │
│  │                (Iframe Clean Player)             │  │
│  │                                                  │  │
│  └──────────────────────────────────────────────────┘  │
│  ⭐ Bài hát Tiếng Anh Vui Nhộn Cho Bé - ABC Song       │
│  Kênh: Super Simple Songs • Thời lượng: 03:45          │
├────────────────────────────────────────────────────────┤
│  DANH MỤC: [ Tất cả ] [ 🎵 Ca nhạc ] [ 📚 Học tập ]    │
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ 🖼️ Thumbnail │  │ 🖼️ Thumbnail │  │ 🖼️ Thumbnail │  │
│  │ BabyBus Cứu Hộ│  │ Bé Học Đếm Số│  │ Kể Chuyện Cổ Tích│
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────────────────────────────────────────┘
```

#### Chi tiết thành phần:
1. **Thanh Header**: Nút quay lại màn hình chính, tiêu đề chủ đề, đồng hồ đếm thời lượng xem còn lại trong ngày (`⏱️ 25/45p`).
2. **Khung phát Video nhúng (Clean Player)**:
   * Phát trực tiếp video YouTube qua webview iframe sạch.
   * Chặn hoàn toàn video đề xuất bên ngoài, chặn bình luận và link dẫn sang web khác.
3. **Thanh danh mục lọc video**: Bé có thể chạm chọn các chủ đề yêu thích (Ca nhạc thiếu nhi, Học tiếng Anh, Hoạt hình giáo dục, Kể chuyện cổ tích).
4. **Lưới video chọn lọc**: Các video đã được phân loại theo danh sách an toàn.

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
                                    ├──> Bé chạm vào Icon App thường ──> Khởi chạy ứng dụng
                                    │
                                    ├──> Bé chạm "📺 YouTube Cho Bé" ──> Mở Màn hình YouTube An Toàn
                                    │                                        │
                                    │                                        └──> Hết hạn mức ⏱️ ──> Tự động nhắc nhở nghỉ ngơi
                                    │
                                    └──> Bé bấm nút Home ──────────────> Luôn giữ ở Màn hình chính
```

---

## 4. TỔNG KẾT DANH MỤC THÀNH PHẦN GIAO DIỆN (UI COMPONENTS LIST)

| Component Name | File Path | Mục đích |
| :--- | :--- | :--- |
| **`LicenseActivationScreen`** | `src/screens/LicenseActivationScreen.tsx` | Nhập License Key và xem Device ID |
| **`KidsLauncherScreen`** | `src/screens/KidsLauncherScreen.tsx` | Màn hình chính hiển thị app của bé |
| **`ThemeSelectorModal`** | `src/components/ThemeSelectorModal.tsx` | Hộp thoại chọn 5 bộ chủ đề giao diện |
| **`KidsYouTubeScreen`** | `src/screens/KidsYouTubeScreen.tsx` | Màn hình xem video YouTube an toàn cho trẻ |
| **`LockOverlay`** | `src/components/LockOverlay.tsx` | Lớp phủ tối khóa máy khi hết giờ |
| **`ParentPinModal`** | `src/components/ParentPinModal.tsx` | Hộp thoại nhập mã PIN bảo vệ |
| **`ParentSettingsScreen`** | `src/screens/ParentSettingsScreen.tsx` | Màn hình quản lý app, giờ và video YouTube |

