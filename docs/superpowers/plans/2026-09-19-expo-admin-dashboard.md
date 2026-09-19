# Expo React Native Admin Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng ứng dụng mobile `admin-app` bằng Expo React Native (Expo Router + NativeWind) hỗ trợ trọn bộ 7 phân hệ quản trị Admin Studio từ Web Portal, kết nối backend Supabase và xác thực Super Admin.

**Architecture:** Ứng dụng độc lập đặt tại thư mục `admin-app/` sử dụng Expo Router file-based navigation, NativeWind v4 cho Tailwind styling đồng bộ với web, Supabase JS + AsyncStorage để duy trì phiên làm việc, Expo AV cho audio phát âm / tiếng kêu con vật và Expo FileSystem/Sharing cho sao lưu dữ liệu.

**Tech Stack:** Expo SDK 52, React Native 0.76+, Expo Router v4, NativeWind v4, TailwindCSS, @supabase/supabase-js, @react-native-async-storage/async-storage, expo-av, expo-document-picker, expo-file-system, expo-sharing, lucide-react-native.

**Spec:** [docs/superpowers/specs/2026-09-19-expo-admin-dashboard-design.md](file:///c:/react-native-launcher-kit/docs/superpowers/specs/2026-09-19-expo-admin-dashboard-design.md)

## Global Constraints

- Thư mục ứng dụng: `admin-app/` nằm ngay trong root repository.
- Supabase Project URL: `https://jlfemayqttjcfjualfsv.supabase.co`
- Supabase Anon Key và Service Role Key đọc từ `.env` (kế thừa từ `web-portal/.env.local`).
- Luồng Auth: Supabase Auth Email & Password, lưu session qua `@react-native-async-storage/async-storage`.
- Styling: Nhất quán với bảng màu Web Portal (`bg-slate-900`, `bg-slate-950`, `text-indigo-400`, `bg-indigo-600`, bo góc `rounded-2xl`).

---

### Task 1: Khởi tạo và cấu hình nền tảng `admin-app/`

**Files:**
- Create: `admin-app/package.json`
- Create: `admin-app/app.json`
- Create: `admin-app/tsconfig.json`
- Create: `admin-app/metro.config.js`
- Create: `admin-app/tailwind.config.js`
- Create: `admin-app/global.css`
- Create: `admin-app/.env`

**Interfaces:**
- Consumes: Node.js, npm/yarn
- Produces: Project Expo có thể chạy lệnh `npx expo start` và hỗ trợ Tailwind CSS qua NativeWind.

- [x] **Step 1: Tạo thư mục `admin-app` và khởi tạo file cấu hình package.json & app.json**
- [x] **Step 2: Cài đặt dependencies (Expo, Expo Router, NativeWind, Supabase, AsyncStorage, Lucide, Expo AV)**
- [x] **Step 3: Cấu hình Metro và Tailwind cho NativeWind v4**
- [x] **Step 4: Cấu hình TypeScript và tạo `.env` với các Supabase keys**
- [x] **Step 5: Kiểm tra `npx tsc --noEmit` và xác nhận môi trường sẵn sàng**

---

### Task 2: Thiết lập Types, Supabase Client & AuthContext

**Files:**
- Create: `admin-app/src/types/index.ts`
- Create: `admin-app/src/lib/supabase.ts`
- Create: `admin-app/src/context/AuthContext.tsx`
- Create: `admin-app/app/_layout.tsx`

**Interfaces:**
- Consumes: `@supabase/supabase-js`, `@react-native-async-storage/async-storage`
- Produces: `useAuth()` hook cung cấp `user`, `session`, `isLoading`, `signOut()`; `supabase` client cấu hình AsyncStorage.

- [x] **Step 1: Định nghĩa types trong `src/types/index.ts` (AnimalItem, CategoryItem, MathQuestion, AppCatalogItem, YouTubeChannel, DashboardMetrics)**
- [x] **Step 2: Viết `src/lib/supabase.ts` kết nối Supabase kèm cấu hình AsyncStorage**
- [x] **Step 3: Viết `src/context/AuthContext.tsx` quản lý phiên đăng nhập và phân quyền Super Admin**
- [x] **Step 4: Viết `app/_layout.tsx` bọc `AuthProvider` và thiết lập theme / SafeAreaProvider**
- [x] **Step 5: Kiểm tra type check với `npx tsc --noEmit`**

---

### Task 3: Màn hình Đăng nhập Quản trị (`(auth)/login.tsx`)

**Files:**
- Create: `admin-app/app/(auth)/_layout.tsx`
- Create: `admin-app/app/(auth)/login.tsx`

**Interfaces:**
- Consumes: `useAuth()`, `supabase.auth.signInWithPassword`
- Produces: Giao diện đăng nhập Super Admin, kiểm tra tài khoản và tự động chuyển hướng vào `(dashboard)/index` khi thành công.

- [x] **Step 1: Tạo layout `app/(auth)/_layout.tsx`**
- [x] **Step 2: Xây dựng màn hình `app/(auth)/login.tsx` với logo Admin Studio 🛠️, ô nhập Email, Mật khẩu, hiển thị thông báo lỗi thân thiện**
- [x] **Step 3: Thêm nút đăng nhập nhanh cho tài khoản test Super Admin nếu ở chế độ dev**
- [x] **Step 4: Xác minh luồng login và redirect tự động khi trạng thái session thay đổi**

---

### Task 4: Dashboard Hub & Các Component dùng chung

**Files:**
- Create: `admin-app/src/components/Header.tsx`
- Create: `admin-app/src/components/StatCard.tsx`
- Create: `admin-app/src/components/ModuleHubCard.tsx`
- Create: `admin-app/src/hooks/useDashboardMetrics.ts`
- Create: `admin-app/app/(dashboard)/_layout.tsx`
- Create: `admin-app/app/(dashboard)/index.tsx`

**Interfaces:**
- Consumes: `useAuth()`, `supabase`
- Produces: Dashboard Hub với 4 thẻ KPI số liệu thực tế, thanh nghe nhanh MP3, và lưới 6 thẻ dẫn vào 6 phân hệ con.

- [x] **Step 1: Xây dựng các component UI nền tảng (`Header.tsx`, `StatCard.tsx`, `ModuleHubCard.tsx`)**
- [x] **Step 2: Viết hook `useDashboardMetrics.ts` tải số lượng thống kê từ các bảng Supabase**
- [x] **Step 3: Xây dựng `app/(dashboard)/_layout.tsx` thiết lập stack navigation có nút Back chuẩn Native**
- [x] **Step 4: Hoàn thiện `app/(dashboard)/index.tsx` tích hợp KPI, Lưới Hub 6 module và Quick Animal Sound Player**
- [x] **Step 5: Kiểm tra hiển thị và type check**

---

### Task 5: Phân hệ Quản lý Danh mục & Thẻ Con vật (`categories`)

**Files:**
- Create: `admin-app/app/(dashboard)/categories/index.tsx`
- Create: `admin-app/app/(dashboard)/categories/edit-modal.tsx`

**Interfaces:**
- Consumes: bảng `kids_animals` và danh mục từ Supabase
- Produces: Màn hình duyệt thẻ con vật (Tên Anh/Việt, emoji, âm thanh), chuyển tab danh mục, thêm mới/sửa thẻ con vật.

- [x] **Step 1: Xây dựng giao diện danh sách thẻ con vật dạng card kèm search bar và tab chuyển đổi**
- [x] **Step 2: Tích hợp nút nghe phát âm tiếng Anh và tiếng kêu MP3 của từng con vật**
- [x] **Step 3: Xây dựng modal thêm mới / chỉnh sửa thông tin con vật (`edit-modal.tsx`)**
- [x] **Step 4: Tích hợp mutation thêm, sửa, xóa dữ liệu trên Supabase**
- [x] **Step 5: Kiểm tra xác thực CRUD con vật**

---

### Task 6: Phân hệ Quản lý Âm thanh MP3 Con vật (`animal-sounds`)

**Files:**
- Create: `admin-app/src/hooks/useAudioPlayer.ts`
- Create: `admin-app/app/(dashboard)/animal-sounds/index.tsx`

**Interfaces:**
- Consumes: `expo-av`, `expo-document-picker`, Supabase Storage bucket `kids-media`
- Produces: Quản lý danh sách file MP3 trong bucket, phát âm thanh tức thì và upload file MP3 từ điện thoại.

- [x] **Step 1: Viết hook `useAudioPlayer.ts` quản lý state phát âm thanh với `expo-av` (tự ngắt âm thanh cũ khi phát âm mới)**
- [x] **Step 2: Xây dựng giao diện danh sách file MP3 trong bucket `kids-media/animals/sounds/`**
- [x] **Step 3: Tích hợp nút upload file MP3 từ điện thoại qua `expo-document-picker` và đẩy lên Supabase Storage**
- [x] **Step 4: Tích hợp xóa và sao chép URL công khai của file âm thanh**
- [x] **Step 5: Kiểm tra hoạt động phát âm thanh và upload**

---

### Task 7: Phân hệ Sinh Đề Toán Tự Động (`math-generator`)

**Files:**
- Create: `admin-app/src/lib/math-engine.ts`
- Create: `admin-app/app/(dashboard)/math-generator/index.tsx`

**Interfaces:**
- Consumes: Bảng `math_questions` trên Supabase
- Produces: Thuật toán sinh đề toán ngẫu nhiên theo cấp độ và giao diện điều khiển sinh đề, lưu trực tiếp vào CSDL.

- [x] **Step 1: Viết `src/lib/math-engine.ts` sinh các biểu thức toán học (+, -, ×, ÷), tạo 4 lựa chọn trắc nghiệm và đánh dấu đáp án đúng**
- [x] **Step 2: Xây dựng UI cấu hình: Chọn phép tính, cấp độ lớp, số lượng câu (10, 20, 50 câu)**
- [x] **Step 3: Viết logic sinh đề hàng loạt và bulk insert vào bảng `math_questions` trên Supabase**
- [x] **Step 4: Hiển thị danh sách các câu hỏi đang có trong hệ thống và nút xóa câu hỏi cũ**
- [x] **Step 5: Kiểm thử thuật toán sinh đề đảm bảo không sinh đáp án trùng lặp**

---

### Task 8: Phân hệ Kho App An Toàn & Duyệt YouTube Kids

**Files:**
- Create: `admin-app/app/(dashboard)/app-catalog/index.tsx`
- Create: `admin-app/app/(dashboard)/youtube-curator/index.tsx`

**Interfaces:**
- Consumes: Bảng `app_catalog` và `kids_youtube_channels` trên Supabase
- Produces: Quản lý whitelist các package Android và các kênh/video YouTube Kids được duyệt.

- [x] **Step 1: Xây dựng màn hình `app-catalog/index.tsx` hiển thị danh sách app, icon, package name và switch bật/tắt**
- [x] **Step 2: Tích hợp form thêm package app mới với danh sách gợi ý app trẻ em thông dụng (YouTube Kids, ScratchJr, Duolingo ABC)**
- [x] **Step 3: Xây dựng màn hình `youtube-curator/index.tsx` hiển thị danh sách kênh/video được duyệt**
- [x] **Step 4: Tích hợp tính năng thêm kênh YouTube mới và toggle trạng thái kích hoạt**
- [x] **Step 5: Kiểm tra tính năng toggle cập nhật ngay trên CSDL Supabase**

---

### Task 9: Phân hệ Sao Lưu & Phục Hồi Dữ Liệu (`backup`)

**Files:**
- Create: `admin-app/app/(dashboard)/backup/index.tsx`

**Interfaces:**
- Consumes: `expo-file-system`, `expo-sharing`, Supabase client
- Produces: Xuất file JSON chứa toàn bộ dữ liệu hệ thống và nạp lại dữ liệu từ file backup JSON.

- [x] **Step 1: Xây dựng hàm export gộp dữ liệu từ các bảng `kids_animals`, `math_questions`, `kids_youtube_channels` thành JSON**
- [x] **Step 2: Tích hợp `expo-file-system` ghi file và `expo-sharing` để chia sẻ/lưu file backup ra máy**
- [x] **Step 3: Xây dựng tính năng Import: chọn file JSON qua `expo-document-picker`, parse và upsert dữ liệu vào Supabase**
- [x] **Step 4: Thêm giao diện thông báo tiến trình và cảnh báo an toàn trước khi khôi phục**
- [x] **Step 5: Kiểm thử quy trình Export $\rightarrow$ Import**

---

### Task 10: Tinh Chỉnh, Kiểm Thử Tổng Thể & Xác Minh Hoàn Tất

**Files:**
- Modify: `admin-app/app.json`
- Modify: `admin-app/package.json`

**Interfaces:**
- Consumes: Toàn bộ codebase `admin-app/`
- Produces: Ứng dụng hoàn thiện, không lỗi TypeScript, sẵn sàng chạy thử nghiệm trên Expo Go hoặc build APK.

- [x] **Step 1: Chạy kiểm tra Type toàn bộ dự án: `cd admin-app; npx tsc --noEmit`**
- [x] **Step 2: Chạy thử bundler Metro `npx expo start` và kiểm tra load routes**
- [x] **Step 3: Kiểm tra giao diện trên cả chế độ sáng (Light) và tối (Dark)**
- [x] **Step 4: Cập nhật tài liệu hướng dẫn khởi chạy trong `admin-app/README.md`**
- [x] **Step 5: Commit toàn bộ mã nguồn hoàn chỉnh vào git**
