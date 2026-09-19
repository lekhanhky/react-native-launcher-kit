# Kids Launcher Admin App (Expo React Native)

Ứng dụng di động quản trị toàn diện (**Admin Studio Mobile Client**) dành cho Super Admin, kết nối trực tiếp với backend Supabase của hệ sinh thái Kids Launcher Tablet (`react-native-launcher-kit`).

---

## 📱 Các Phân Hệ Quản Trị (7 Features)

1. **Dashboard Hub (Tổng Quan)**:
   - Thống kê chỉ số KPI thực tế từ Supabase (Kho App, Kênh YouTube, Đề toán, Thẻ con vật).
   - Thanh mini-player nghe nhanh âm thanh các con vật.
   - Lưới điều hướng 6 thẻ dẫn vào các phân hệ nghiệp vụ.
2. **Quản Lý Danh Mục & Con Vật (`/categories`)**:
   - Thẻ con vật song ngữ Anh - Việt, biểu tượng Emoji, phát âm tiếng Anh, tiếng kêu MP3.
   - Tìm kiếm, lọc danh mục, thêm mới/chỉnh sửa thông tin con vật.
3. **Quản Lý Âm Thanh MP3 (`/animal-sounds`)**:
   - Quản lý các file âm thanh trong Supabase Storage bucket `kids-media/animals/sounds/`.
   - Nghe thử trực tiếp trên điện thoại bằng `expo-av`.
   - Upload file MP3 mới từ bộ nhớ thiết bị (`expo-document-picker`).
4. **Sinh Đề Toán Tự Động (`/math-generator`)**:
   - Cấu hình phép tính: Cộng (+), Trừ (-), Nhân (×), Chia (÷).
   - Chọn khối lớp (Lớp 1, Lớp 2, Lớp 3-5) và số lượng câu (10, 20, 50).
   - Tự động sinh câu hỏi trắc nghiệm 4 đáp án và lưu đồng bộ vào bảng `math_questions` trên Supabase.
5. **Kho App An Toàn (`/app-catalog`)**:
   - Danh sách whitelist các Android package được phép mở trên máy của bé.
   - Bật/tắt trạng thái hiển thị tức thì.
   - Thêm ứng dụng mới theo package name.
6. **Duyệt YouTube Kids (`/youtube-curator`)**:
   - Quản lý các kênh và video đã qua kiểm duyệt an toàn cho trẻ.
   - Thêm kênh mới theo Channel ID hoặc URL.
   - Bật/tắt trạng thái kích hoạt trên giao diện trẻ em.
7. **Sao Lưu & Phục Hồi Dữ Liệu (`/backup`)**:
   - **Xuất (Export)**: Đóng gói toàn bộ CSDL ra tệp `.json` và chia sẻ/lưu về máy qua `expo-sharing`.
   - **Phục hồi (Import)**: Chọn tệp JSON sao lưu để nạp đồng bộ (upsert) lại dữ liệu vào Supabase.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 1. Cài đặt Dependencies
```bash
cd admin-app
npm install
```

### 2. Cấu hình Môi trường (.env)
File `.env` đã được cấu hình sẵn với URL và Anon Key của Supabase:
```env
EXPO_PUBLIC_SUPABASE_URL=https://jlfemayqttjcfjualfsv.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1Ni...
```

### 3. Khởi động Ứng dụng
```bash
# Chạy Metro Bundler
npx expo start

# Hoặc chạy trên trình duyệt web để kiểm tra nhanh
npx expo start --web

# Chạy trên máy ảo Android
npx expo start --android
```

---

## 🏗️ Cấu Trúc Mã Nguồn

```text
admin-app/
├── app/
│   ├── _layout.tsx                     # Root layout (AuthProvider, SafeAreaProvider, StatusBar)
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   └── login.tsx                   # Màn hình đăng nhập Super Admin
│   └── (dashboard)/
│       ├── _layout.tsx                 # Stack navigator quản lý tiêu đề và nút Back
│       ├── index.tsx                   # Dashboard Hub
│       ├── categories/index.tsx        # 1. Danh mục & Con vật
│       ├── animal-sounds/index.tsx     # 2. Âm thanh MP3 & Storage Bucket
│       ├── math-generator/index.tsx    # 3. Sinh Đề Toán
│       ├── app-catalog/index.tsx       # 4. Kho App An Toàn
│       ├── youtube-curator/index.tsx   # 5. Duyệt YouTube Kids
│       └── backup/index.tsx            # 6 & 7. Sao Lưu & Phục Hồi
├── src/
│   ├── components/                     # Header, StatCard, ModuleHubCard
│   ├── context/AuthContext.tsx         # Quản lý phiên làm việc Supabase Auth
│   ├── hooks/                          # useAudioPlayer, useDashboardMetrics
│   ├── lib/                            # supabase client, math-engine generator
│   ├── styles/theme.ts                 # Màu sắc, bo góc, bóng đổ chuẩn Admin Studio
│   └── types/index.ts                  # TypeScript interfaces cho toàn bộ models
```
