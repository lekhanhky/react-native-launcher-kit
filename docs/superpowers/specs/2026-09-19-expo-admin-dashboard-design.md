# Thiết Kế Kỹ Thuật (Design Spec): Expo React Native Admin Dashboard

**Ngày**: 2026-09-19  
**Dự án**: `admin-app` (Admin Studio Mobile Client)  
**Nền tảng**: Expo React Native (iOS / Android)  
**Tham chiếu**: Hệ thống Web Portal (`web-portal/src/app/(admin)/admin`)

---

## 1. Mục Tiêu & Bối Cảnh

Ứng dụng `web-portal` hiện tại cung cấp bộ công cụ **Admin Studio** (Next.js 14) để quản trị nội dung và thiết bị cho hệ sinh thái Kids Launcher Tablet (`react-native-launcher-kit`). 

Nhằm giúp quản trị viên (Super Admin) có thể theo dõi hệ thống, kiểm duyệt ứng dụng, biên tập nội dung học tập và sao lưu dữ liệu mọi lúc mọi nơi trên thiết bị di động, dự án **`admin-app`** được khởi tạo dưới dạng một ứng dụng di động độc lập xây dựng bằng **Expo React Native**, kế thừa trọn vẹn 7 phân hệ tính năng từ Web Portal và kết nối trực tiếp với backend **Supabase**.

---

## 2. Kiến Trúc Kỹ Thuật (Architecture & Tech Stack)

- **Framework**: Expo SDK 52 (React Native 0.76+, React 18).
- **Điều hướng (Routing)**: `expo-router` v4 (File-based routing theo thư mục `app/`).
- **Styling**: `nativewind` v4 + `tailwindcss` (đồng bộ màu sắc `slate-900`, `indigo-600` và hệ thống token UI với Web Portal).
- **Backend & Database**: `@supabase/supabase-js` v2.
- **Quản lý Phiên (Auth Session)**: `@react-native-async-storage/async-storage`.
- **Icon**: `lucide-react-native` + `react-native-svg`.
- **Audio & Media**: `expo-av` (phát âm thanh con vật MP3 và phát âm tiếng Anh).
- **File & Tệp tin**: `expo-document-picker` (tải MP3), `expo-file-system` & `expo-sharing` (sao lưu/phục hồi JSON).

---

## 3. Cấu Trúc Thư Mục Dự Án (`admin-app/`)

```text
admin-app/
├── app/
│   ├── _layout.tsx                     # Root layout (Auth Provider, Theme, Toast, SafeArea)
│   ├── (auth)/
│   │   ├── _layout.tsx                 # Auth stack
│   │   └── login.tsx                   # Màn hình đăng nhập Supabase Super Admin
│   └── (dashboard)/
│       ├── _layout.tsx                 # Dashboard stack navigation (Header with back button)
│       ├── index.tsx                   # Màn hình chính Dashboard Hub (Overview + 7 Module Grid)
│       ├── categories/
│       │   ├── index.tsx               # Phân hệ 1: Quản lý Danh mục & Thẻ Con vật
│       │   └── edit-modal.tsx          # Modal thêm/sửa con vật & danh mục
│       ├── animal-sounds/
│       │   └── index.tsx               # Phân hệ 2: Quản lý Âm thanh MP3 & Bucket Storage
│       ├── math-generator/
│       │   └── index.tsx               # Phân hệ 3: Sinh Đề Toán Tự Động
│       ├── app-catalog/
│       │   └── index.tsx               # Phân hệ 4: Kho App An Toàn (Whitelist Packages)
│       ├── youtube-curator/
│       │   └── index.tsx               # Phân hệ 5: Duyệt Kênh & Video YouTube Kids
│       └── backup/
│           └── index.tsx               # Phân hệ 6 & 7: Sao Lưu & Phục Hồi Dữ Liệu
├── src/
│   ├── components/
│   │   ├── Header.tsx                  # Topbar hiển thị trạng thái DB, Avatar, Đăng xuất
│   │   ├── StatCard.tsx                # Thẻ thống kê số liệu
│   │   ├── ModuleHubCard.tsx           # Thẻ module trên trang chủ Dashboard Hub
│   │   ├── AudioButton.tsx             # Nút phát/dừng âm thanh MP3
│   │   └── ConfirmDialog.tsx           # Hộp thoại xác nhận xóa/thay đổi
│   ├── context/
│   │   └── AuthContext.tsx             # Quản lý trạng thái Super Admin & Supabase Session
│   ├── hooks/
│   │   ├── useAudioPlayer.ts           # Hook điều khiển âm thanh qua expo-av
│   │   └── useDashboardMetrics.ts      # Hook tải các chỉ số thống kê từ Supabase
│   ├── lib/
│   │   ├── supabase.ts                 # Cấu hình Supabase client kèm AsyncStorage
│   │   └── math-engine.ts              # Thuật toán sinh đề toán ngẫu nhiên theo cấp độ
│   └── types/
│       └── index.ts                    # Kiểu dữ liệu TypeScript cho toàn bộ app
├── app.json
├── tailwind.config.js
├── metro.config.js
├── tsconfig.json
└── package.json
```

---

## 4. Chi Tiết 7 Phân Hệ Chức Năng (Features Specification)

### 4.1. Màn hình chính: Dashboard Hub (`(dashboard)/index.tsx`)
- **Header**: Logo Admin Studio 🛠️, nhãn "Super Admin", nút Đăng xuất, Badge trạng thái `Supabase: Connected`.
- **Thống kê nhanh (KPI Metrics)**: 
  - Tổng số App trong Whitelist (`app_catalog`).
  - Tổng số Kênh/Video YouTube Kids (`kids_youtube_channels`).
  - Tổng số Câu hỏi Toán (`math_questions`).
  - Tổng số Thẻ Con vật (`kids_animals`).
- **Lưới Module Hub (2 cột)**: 6 thẻ điều hướng lớn kèm icon nổi bật và badge trạng thái:
  1. `Quản Lý Danh Mục & Con Vật` [Mới]
  2. `Âm Thanh MP3 Con Vật` [Bucket]
  3. `Sinh Đề Toán Tự Động` [Hot]
  4. `Kho App An Toàn` [Whitelist]
  5. `Duyệt YouTube Kids` [Curator]
  6. `Sao Lưu & Phục Hồi` [Backup]
- **Thanh nghe nhanh (Quick Animal Sound Bar)**: Hàng ngang các con vật tiêu biểu kèm nút Play/Pause nghe thử tức thì.

### 4.2. Quản lý Danh mục & Con vật (`categories/index.tsx`)
- **Tabs chuyển đổi**:
  - `Thẻ Con Vật`: Danh sách các loài vật gồm Emoji, Tên tiếng Việt, Tên tiếng Anh, Nhóm (Vật nuôi, Rừng rậm, Đại dương, Chim muông), nút nghe phát âm tiếng Anh, nút nghe tiếng kêu MP3, câu đố vui bổ sung.
  - `Danh Mục Con Vật`: Danh sách các nhóm sinh thái kèm màu sắc và số lượng loài.
  - `Danh Mục Khác`: Nhóm cho App và Nhóm cho YouTube.
- **Thao tác**: Tìm kiếm theo tên/mã, thêm mới, sửa đổi thông tin và xóa dữ liệu có xác nhận.

### 4.3. Quản lý Âm thanh Con vật MP3 (`animal-sounds/index.tsx`)
- Tương tác với Supabase Storage bucket `kids-media/animals/sounds/`.
- Danh sách file âm thanh kèm kích thước, thời gian tải lên và URL công khai.
- Tích hợp trình phát âm thanh `expo-av` chạy mượt mà trên thiết bị.
- Nút "Tải lên MP3": Mở bộ chọn tệp `expo-document-picker` để upload file mới vào bucket.

### 4.4. Sinh Đề Toán Tự Động (`math-generator/index.tsx`)
- Form thiết lập cấu hình:
  - Phép tính: Cộng (+), Trừ (-), Nhân (×), Chia (÷), Hỗn hợp.
  - Phạm vi số: Lớp 1 (1 - 20), Lớp 2 (1 - 100), Lớp 3 - 5 (Nhân chia bảng cửu chương).
  - Số lượng câu: 10, 20, 50 câu.
- Bộ máy sinh đề (`math-engine.ts`): Tạo câu hỏi trắc nghiệm tự động (1 đáp án đúng, 3 đáp án nhiễu hợp lý).
- Ghi dữ liệu hàng loạt (bulk insert) vào bảng `math_questions` trên Supabase.
- Danh sách xem trước và quản lý các câu hỏi đang có trong ngân hàng đề.

### 4.5. Kho App An Toàn (`app-catalog/index.tsx`)
- Quản lý các ứng dụng Android cho phép cài đặt/hiển thị trên giao diện launcher của bé.
- Danh sách hiển thị: Tên App, Package Name (ví dụ: `com.google.android.youtube.kids`), Icon, Nhóm tuổi khuyên dùng.
- Công tắc (Switch): Bật/Tắt trạng thái hoạt động tức thì.
- Form thêm ứng dụng mới với tính năng tự động gợi ý các package an toàn phổ biến.

### 4.6. Duyệt Kênh & Video YouTube Kids (`youtube-curator/index.tsx`)
- Quản lý danh sách các Kênh YouTube được kiểm duyệt.
- Hiển thị: Thumbnail kênh, Tên kênh, Số lượng video, Trạng thái hoạt động.
- Thao tác thêm kênh qua Channel ID hoặc URL.
- Cho phép toggle ẩn/hiển thị kênh trên launcher máy bé.

### 4.7. Sao Lưu & Phục Hồi Dữ Liệu (`backup/index.tsx`)
- **Sao lưu (Export)**: Đọc toàn bộ dữ liệu các bảng nghiệp vụ, đóng gói thành cấu trúc JSON chuẩn hóa (có timestamp), lưu vào thư mục cache và gọi hộp thoại chia sẻ (`expo-sharing`) để lưu về bộ nhớ máy hoặc gửi qua ứng dụng khác.
- **Phục hồi (Import)**: Mở bộ chọn tệp JSON, kiểm tra tính hợp lệ của cấu trúc dữ liệu, và thực hiện nạp đồng bộ (upsert) vào Supabase.

---

## 5. Quy Trình Xác Thực & Bảo Mật (Auth & Security)

1. **Supabase Auth**: Sử dụng phương thức `supabase.auth.signInWithPassword({ email, password })`.
2. **Kiểm tra quyền Quản trị**: Sau khi có token, kiểm tra role `super_admin` trong user metadata hoặc bảng `profiles` để chặn các tài khoản không có thẩm quyền.
3. **Quản lý Token**: Lưu trữ an toàn trong AsyncStorage của React Native, tự động làm mới session (refresh token).

---

## 6. Kế Hoạch Xác Minh & Kiểm Thử (Verification Plan)

- **Biên dịch & Type Check**: Chạy `npx tsc --noEmit` đạt 0 lỗi.
- **Khởi động Expo Metro Bundler**: Kiểm tra khởi động thành công với `npx expo start`.
- **Kiểm thử Luồng Dữ liệu**:
  - Tải dữ liệu thành công từ Supabase tables.
  - Phát âm thanh audio MP3 bình thường, không giật lag, tự ngắt âm thanh cũ khi chọn âm thanh mới.
  - Sinh đề toán chính xác, các đáp án trắc nghiệm không bị trùng lặp.
  - Export và Import JSON hoạt động toàn vẹn.
