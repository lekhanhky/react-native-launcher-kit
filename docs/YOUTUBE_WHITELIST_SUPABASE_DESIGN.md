# KẾ HOẠCH THIẾT KẾ & VIẾT LẠI DANH SÁCH KÊNH / PLAYLIST YOUTUBE CHO PHÉP (TÍCH HỢP SUPABASE)

> **Dự án:** React Native Launcher Kit - Safe Kids Mode  
> **Phiên bản tài liệu:** 2.0  
> **Trạng thái:** Sẵn sàng triển khai (Ready for Implementation)  
> **Mục tiêu:** Chuyển đổi toàn bộ cơ chế quản lý kênh/video YouTube từ hardcode/local cache sang hệ thống **Cloud-First & Offline-First** linh hoạt thông qua **Supabase Backend & Realtime Sync**.

---

## 1. TỔNG QUAN & BỐI CẢNH

### 1.1. Hiện trạng hệ thống cũ
- **Hardcode dữ liệu**: Danh sách kênh (`PRESET_CHANNELS`), playlist và danh sách video mẫu được khai báo tĩnh bên trong file `youtubeService.ts` (hơn 1,200 dòng mã kết hợp cả logic dữ liệu lẫn preset tĩnh).
- **Hạn chế mở rộng**: Khi muốn bổ sung kênh an toàn mới, cập nhật video hoặc thêm danh sách phát giáo dục, lập trình viên buộc phải cập nhật mã nguồn ứng dụng và phát hành phiên bản mới.
- **Thiếu tính cá nhân hóa cho phụ huynh**: Phụ huynh không thể bật/tắt linh hoạt từng kênh cụ thể cho từng thiết bị của con từ xa, không thể theo dõi nhật ký xem video trực quan trên đám mây.

### 1.2. Mục tiêu thiết kế mới
1. **Quản trị tập trung trên Supabase**: Toàn bộ Kênh (`Channels`), Danh sách phát (`Playlists`) và Video (`Videos`) được lưu trữ trên cơ sở dữ liệu Supabase PostgreSQL.
2. **Kiểm soát đa thiết bị theo `device_id`**: Mỗi thiết bị con được gán một cấu hình riêng (`device_youtube_settings`) bao gồm: danh sách kênh được bật, giới hạn thời gian xem hàng ngày, quyền tìm kiếm, khóa khẩn cấp.
3. **Kiến trúc Offline-First**: Khi không có mạng, ứng dụng vẫn tải mượt mà từ bộ nhớ đệm nội bộ (Local Cache/MMKV/Storage). Khi có mạng, tự động đồng bộ ngầm và lắng nghe cập nhật tức thì qua **Supabase Realtime**.
4. **Cơ chế An toàn Tuyệt đối (Strict Whitelist)**: Trẻ em chỉ được xem video thuộc các Kênh hoặc Playlist đã được phê duyệt. Không hiển thị video đề xuất ngẫu nhiên từ thuật toán YouTube bên ngoài.

---

## 2. KIẾN TRÚC TỔNG THỂ & LUỒNG HOẠT ĐỘNG

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   SUPABASE CLOUD                                       │
│                                                                                        │
│   ┌─────────────────────┐   ┌──────────────────────┐   ┌───────────────────────────┐   │
│   │  youtube_catalogs   │   │    youtube_videos    │   │  device_youtube_settings  │   │
│   │ (Kênh & Playlists)  │──>│ (Video an toàn con)  │   │  (Whitelist & Giới hạn)   │   │
│   └─────────────────────┘   └──────────────────────┘   └─────────────┬─────────────┘   │
│                                                                      │                 │
│   ┌────────────────────────────────┐                                 │ (Realtime Sync) │
│   │  device_youtube_watch_logs     │<────────────────────────────────┼─────────┐       │
│   │  (Nhật ký thời lượng xem)      │                                 │         │       │
│   └────────────────────────────────┘                                 │         │       │
└───────────────────────────────────────┬──────────────────────────────┼─────────┼───────┘
                                        │ (Tải Catalog & Sync)         │         │ (Gửi Log)
                                        ▼                              ▼         │
┌────────────────────────────────────────────────────────────────────────────────┴───────┐
│                           MÁY CON (REACT NATIVE LAUNCHER)                              │
│                                                                                        │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │                       Local Cache Engine (MMKV / Storage)                      │   │
│   │  • Lưu bản sao Offline của Catalogs, Videos, Whitelist & Trạng thái hôm nay    │   │
│   └───────────────────────────────────────┬────────────────────────────────────────┘   │
│                                           │                                            │
│                                           ▼                                            │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │                        Safe YouTube Kids Screen (UI/UX)                        │   │
│   │  • Tabs Kênh / Thể loại (Ca nhạc, Tiếng Anh, Hoạt hình, Kể chuyện...)          │   │
│   │  • Trình phát Video An toàn (Chặn quảng cáo, Chặn gợi ý ngoài)                 │   │
│   │  • Bộ đếm Giờ xem & Màn hình khóa khi chạm ngưỡng (Daily Limit Screen)         │   │
│   │  • Modal Quản lý Kênh dành cho Phụ huynh (Bảo vệ bằng mã PIN)                  │   │
│   └────────────────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. THIẾT KẾ CƠ SỞ DỮ LIỆU SUPABASE (SCHEMA & SQL)

File SQL Schema hoàn chỉnh đã được đặt tại: [`docs/sql/02_youtube_whitelist_schema.sql`](file:///c:/react-native-launcher-kit/docs/sql/02_youtube_whitelist_schema.sql).

### 3.1. Bảng `youtube_catalogs` (Danh mục Kênh & Playlist)
Quản lý danh sách các Kênh và Danh sách phát chuẩn của hệ thống hoặc do phụ huynh tự thêm vào.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | PRIMARY KEY | ID định danh bản ghi |
| `youtube_id` | `TEXT` | UNIQUE, NOT NULL | Channel ID (`UC...`) hoặc Playlist ID (`PL...`) |
| `item_type` | `ENUM` | `channel`, `playlist` | Phân loại Kênh hay Danh sách phát |
| `title` | `TEXT` | NOT NULL | Tên hiển thị của kênh / danh sách |
| `description` | `TEXT` | | Tóm tắt nội dung kênh |
| `avatar_url` | `TEXT` | | Link ảnh đại diện kênh / thumbnail playlist |
| `banner_url` | `TEXT` | | Link ảnh bìa kênh |
| `category` | `ENUM` | `music`, `english`, `cartoon`, `story`, `science`, `general` | Thể loại phân loại nội dung |
| `emoji` | `TEXT` | DEFAULT `'🎬'` | Biểu tượng đại diện trên giao diện bé |
| `theme_color` | `TEXT` | DEFAULT `'#4F46E5'` | Màu chủ đạo khi render thẻ Kênh |
| `subscribers_count` | `TEXT` | | Số lượng người đăng ký hiển thị |
| `video_count` | `INT` | DEFAULT `0` | Tổng số video có trong danh mục |
| `is_verified` | `BOOLEAN` | DEFAULT `true` | Trạng thái đã kiểm duyệt nội dung an toàn |
| `is_system_preset` | `BOOLEAN` | DEFAULT `false` | Là kênh mẫu mặc định của hệ thống |
| `created_by_device` | `TEXT` | NULLABLE | Thiết bị phụ huynh đã thêm kênh tùy chỉnh này |

### 3.2. Bảng `youtube_videos` (Danh sách Video kiểm duyệt)
Lưu trữ metadata các video thuộc về Kênh hoặc Playlist.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | PRIMARY KEY | ID định danh bản ghi |
| `video_id` | `TEXT` | UNIQUE, NOT NULL | YouTube Video ID 11 ký tự (VD: `71_hD4v25xo`) |
| `catalog_youtube_id` | `TEXT` | FK -> `youtube_catalogs` | Thuộc kênh hoặc playlist nào |
| `title` | `TEXT` | NOT NULL | Tiêu đề video |
| `description` | `TEXT` | | Mô tả video |
| `thumbnail_url` | `TEXT` | NOT NULL | Ảnh bìa chất lượng cao (`hqdefault` / `maxresdefault`) |
| `duration` | `TEXT` | | Độ dài hiển thị (VD: `'04:15'`) |
| `duration_seconds` | `INT` | DEFAULT `0` | Thời lượng video tính bằng giây |
| `views_count` | `TEXT` | | Số lượt xem hiển thị |
| `published_at` | `TIMESTAMPTZ` | | Thời điểm phát hành video |
| `category` | `ENUM` | DEFAULT `'cartoon'` | Thể loại video |
| `is_safe` | `BOOLEAN` | DEFAULT `true` | Xác nhận độ an toàn cho trẻ em |

### 3.3. Bảng `device_youtube_settings` (Cấu hình Whitelist theo thiết bị)
Lưu cấu hình riêng biệt cho từng thiết bị (`device_id`).

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | PRIMARY KEY | ID định danh |
| `device_id` | `TEXT` | UNIQUE, FK -> `devices` | Mã phần cứng duy nhất của máy con |
| `is_youtube_enabled` | `BOOLEAN` | DEFAULT `true` | Bật/tắt tính năng YouTube cho bé |
| `allowed_catalog_ids` | `TEXT[]` | DEFAULT `'{...}'` | Mảng chứa các `youtube_id` được phép xem |
| `daily_limit_minutes` | `INT` | DEFAULT `60` | Giới hạn xem mỗi ngày (phút) |
| `allow_search` | `BOOLEAN` | DEFAULT `false` | Cho phép tìm kiếm (trong phạm vi whitelist) |
| `allow_autoplay` | `BOOLEAN` | DEFAULT `true` | Tự động phát video tiếp theo trong whitelist |
| `max_video_duration_minutes` | `INT` | DEFAULT `30` | Lọc bỏ video quá dài |
| `emergency_lock_youtube` | `BOOLEAN` | DEFAULT `false` | Khóa tức thì tính năng YouTube từ xa |

### 3.4. Bảng `device_youtube_watch_logs` (Nhật ký thời lượng xem)
Ghi nhận lịch sử và thời lượng trẻ xem hàng ngày để phụ huynh thống kê.

| Cột | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `id` | `UUID` | ID định danh log |
| `device_id` | `TEXT` | Thiết bị đã xem |
| `video_id` | `TEXT` | Video ID đã xem |
| `video_title` | `TEXT` | Tiêu đề video |
| `channel_title` | `TEXT` | Tên kênh |
| `watched_seconds` | `INT` | Thời lượng xem thực tế (giây) |
| `watched_date` | `DATE` | Ngày xem (`CURRENT_DATE`) |

---

## 4. CHI TIẾT TÁI CẤU TRÚC CODEBASE (FRONTEND SERVICE)

Hiện tại `example/src/services/youtubeService.ts` chứa quá nhiều trách nhiệm (kho dữ liệu tĩnh, logic cache, sync Supabase, tracker thời gian). Cần tái cấu trúc thành các module độc lập:

```text
example/src/services/
├── youtube/
│   ├── types.ts                      # Toàn bộ Interface & Type Definitions
│   ├── youtubePresets.ts             # Dữ liệu Offline Fallback (Seeding sẵn)
│   ├── youtubeSupabaseService.ts     # Giao tiếp API & Supabase Client & Realtime
│   ├── youtubeCacheService.ts        # Quản lý Local Cache & Storage
│   ├── youtubeTimeTracker.ts         # Quản lý Đếm giờ, Reset ngày mới & Hạn mức
│   └── index.ts                      # Facade Service (youtubeService hợp nhất)
```

### 4.1. Chi tiết phân chia nhiệm vụ
1. **`youtube/types.ts`**:
   - `YouTubeCatalogItem`: Kênh hoặc Playlist.
   - `YouTubeVideoItem`: Thông tin chi tiết video.
   - `DeviceYouTubeConfig`: Cấu hình Whitelist & giới hạn thời gian.
   - `WatchLogEntry`: Dữ liệu nhật ký xem.
2. **`youtube/youtubePresets.ts`**:
   - Chứa danh sách 10+ kênh trẻ em nổi tiếng chất lượng cao (Cocomelon, Super Simple Songs, BabyBus, Wolfoo, Numberblocks...) làm dữ liệu dự phòng khi máy khởi động lần đầu hoặc hoàn toàn mất kết nối mạng.
3. **`youtube/youtubeSupabaseService.ts`**:
   - `fetchRemoteCatalogs()`: Tải toàn bộ danh mục kênh/playlist trên Supabase.
   - `fetchDeviceYouTubeSettings(deviceId)`: Tải cấu hình whitelist và thời gian của máy con.
   - `updateDeviceAllowedCatalogs(deviceId, catalogIds)`: Cập nhật danh sách kênh phụ huynh cho phép.
   - `subscribeToSettingsChanges(deviceId, callback)`: Lắng nghe qua Supabase Realtime khi phụ huynh thay đổi cài đặt từ xa.
   - `sendWatchLogBatch(deviceId, logs)`: Đẩy nhật ký xem lên đám mây.
4. **`youtube/youtubeCacheService.ts`**:
   - Lưu trữ bản sao offline của danh mục kênh, danh sách video và cấu hình thiết bị.
   - Hỗ trợ cơ chế đọc ngay lập tức (Instant UI Render) không cần chờ phản hồi mạng.
5. **`youtube/youtubeTimeTracker.ts`**:
   - Tự động nhận diện ngày mới để reset bộ đếm giờ xem về 0.
   - Quản lý đồng hồ đếm thời gian xem tích lũy khi video đang phát.

---

## 5. THIẾT KẾ GIAO DIỆN & TƯƠNG TÁC (UI/UX)

### 5.1. Màn hình Trẻ Em (`KidsYouTubeScreen.tsx`)
- **Giao diện Hero Video Player**:
  - Tự động tối ưu tỉ lệ 16:9 ở cả màn hình dọc (Portrait) và ngang (Landscape / Tablet).
  - Tích hợp `react-native-youtube-iframe` với tham số bảo vệ:
    - `rel=0` (không gợi ý video ngoài).
    - `controls=1`, `modestbranding=1`, `playsinline=1`.
  - Nút chuyển nhanh: **Video Trước**, **Tạm dừng/Tiếp tục**, **Video Tiếp theo**, **Yêu thích (Like)**.
- **Thanh Chọn Kênh & Thể Loại (Category / Channel Bar)**:
  - Thẻ kênh tròn/bo góc lớn kèm avatar, emoji và màu chủ đạo sắc nét.
  - Phân loại rõ ràng: *Tất cả*, *Ca nhạc*, *Tiếng Anh*, *Hoạt hình*, *Cổ tích*.
- **Màn hình Khóa khi Chạm Giới Hạn Giờ Xem (Time Limit Lock Overlay)**:
  - Khi `watchedMinutes >= dailyLimitMinutes`: Ngay lập tức dừng phát video và hiển thị màn hình chúc ngủ ngon / giải lao thân thiện.
  - Cung cấp nút *"Phụ huynh mở thêm giờ"* yêu cầu nhập mã PIN hợp lệ.

### 5.2. Màn hình Quản Lý Kênh Dành Cho Phụ Huynh (`ParentYouTubeManagerModal.tsx`)
- Mở thông qua nút Cài đặt bảo vệ bằng mã PIN phụ huynh.
- Danh sách công tắc (Switch) Bật / Tắt từng Kênh / Playlist cho phép con xem.
- Nút **"Thêm Kênh YouTube Mới"**: Phụ huynh chỉ cần dán link YouTube (Kênh hoặc Danh sách phát), hệ thống tự động nhận diện và thêm vào Whitelist.
- Thanh trượt điều chỉnh **Giới hạn thời gian xem hàng ngày** (15 phút, 30 phút, 60 phút, 120 phút...).

---

## 6. LỘ TRÌNH TRIỂN KHAI TỪNG BƯỚC (ROADMAP)

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                LỘ TRÌNH THỰC HIỆN 5 BƯỚC                               │
├────────────┬──────────────────────────────────────────┬────────────────────────────────┤
│ Giai đoạn  │ Nhiệm vụ trọng tâm                       │ Kết quả đầu ra                 │
├────────────┼──────────────────────────────────────────┼────────────────────────────────┤
│ Phase 1    │ Tạo Database Schema & Seed Data trên     │ 4 bảng Supabase & Dữ liệu mẫu  │
│            │ Supabase PostgreSQL                      │ Kênh thiếu nhi an toàn         │
├────────────┼──────────────────────────────────────────┼────────────────────────────────┤
│ Phase 2    │ Tái cấu trúc Module `youtubeService`     │ Kiến trúc thư mục `youtube/`   │
│            │ tích hợp Supabase Client + Local Cache   │ Code sạch, modular, có sync    │
├────────────┼──────────────────────────────────────────┼────────────────────────────────┤
│ Phase 3    │ Nâng cấp `KidsYouTubeScreen.tsx` và      │ Giao diện xem phim mượt mà,    │
│            │ thêm `ParentYouTubeManagerModal.tsx`     │ phụ huynh tự do cấu hình kênh  │
├────────────┼──────────────────────────────────────────┼────────────────────────────────┤
│ Phase 4    │ Tích hợp Supabase Realtime & Offline     │ Cập nhật tức thì khi đổi kênh, │
│            │ Fallback Engine                          │ hoạt động mượt khi mất mạng    │
├────────────┼──────────────────────────────────────────┼────────────────────────────────┤
│ Phase 5    │ Kiểm thử thực tế, Kiểm tra giới hạn giờ  │ Ứng dụng ổn định, bảo vệ bé    │
│            │ xem & Tối ưu hiệu năng render            │ toàn diện                      │
└────────────┴──────────────────────────────────────────┴────────────────────────────────┘
```

---

## 7. MẪU DỮ LIỆU KHỞI TẠO BAN ĐẦU (SEED DATA SQL)

Chạy đoạn script sau trên Supabase để nạp sẵn danh sách kênh an toàn cho hệ thống:

```sql
-- Nạp danh sách kênh mẫu tiêu chuẩn
INSERT INTO public.youtube_catalogs 
(youtube_id, item_type, title, description, avatar_url, category, emoji, theme_color, subscribers_count, is_verified, is_system_preset)
VALUES
('cocomelon', 'channel', 'Cocomelon Tiếng Anh', 'Bài hát 3D vui nhộn cho trẻ mầm non', 'https://img.youtube.com/vi/yCjJyiqpAuU/hqdefault.jpg', 'music', '🍉', '#16A34A', '175M người đăng ký', true, true),
('super_simple_songs', 'channel', 'Super Simple Songs', 'Ca nhạc tiếng Anh phát âm chuẩn bản xứ', 'https://img.youtube.com/vi/71_hD4v25xo/hqdefault.jpg', 'music', '🎶', '#0284C7', '42.5M người đăng ký', true, true),
('numberblocks', 'channel', 'Numberblocks Official', 'Học toán, đếm số và logic thông minh', 'https://img.youtube.com/vi/pZw9veQ76fo/hqdefault.jpg', 'english', '🔢', '#EA580C', '7.8M người đăng ký', true, true),
('babybus_vn', 'channel', 'BabyBus Tiếng Việt', 'Kỹ năng sống và cứu hộ an toàn cho bé', 'https://img.youtube.com/vi/5Bw4_zV25pM/hqdefault.jpg', 'cartoon', '🐼', '#E11D48', '11.2M người đăng ký', true, true),
('wolfoo_vn', 'channel', 'Wolfoo Tiếng Việt', 'Thói quen tốt và câu chuyện gia đình Wolfoo', 'https://img.youtube.com/vi/Y5yL4xPqYyo/hqdefault.jpg', 'cartoon', '🐺', '#7C3AED', '3.5M người đăng ký', true, true),
('giai_dieu_chill', 'channel', 'Giai Điệu Chill', 'Giai điệu âm nhạc thư giãn, lofi nhẹ nhàng', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150', 'music', '🎧', '#1E1B4B', '1.2M người đăng ký', true, true)
ON CONFLICT (youtube_id) DO NOTHING;

-- Nạp video mẫu khởi tạo
INSERT INTO public.youtube_videos 
(video_id, catalog_youtube_id, title, thumbnail_url, duration, category)
VALUES
('71_hD4v25xo', 'super_simple_songs', 'Twinkle Twinkle Little Star - Bài Hát Ru Bé Ngủ', 'https://img.youtube.com/vi/71_hD4v25xo/hqdefault.jpg', '03:15', 'music'),
('yCjJyiqpAuU', 'cocomelon', 'Wheels on the Bus | Xe Buýt Vui Nhộn', 'https://img.youtube.com/vi/yCjJyiqpAuU/hqdefault.jpg', '04:02', 'music'),
('pZw9veQ76fo', 'numberblocks', 'Khám Phá Các Con Số Từ 1 Đến 10', 'https://img.youtube.com/vi/pZw9veQ76fo/hqdefault.jpg', '05:30', 'english'),
('5Bw4_zV25pM', 'babybus_vn', 'Đội Cứu Hộ Ô Tô Cứu Hỏa Của Kiki', 'https://img.youtube.com/vi/5Bw4_zV25pM/hqdefault.jpg', '04:45', 'cartoon'),
('Y5yL4xPqYyo', 'wolfoo_vn', 'Wolfoo Học Cách Ăn Nhiều Rau Củ Quả', 'https://img.youtube.com/vi/Y5yL4xPqYyo/hqdefault.jpg', '03:50', 'cartoon')
ON CONFLICT (video_id) DO NOTHING;
```

---

## 8. KẾT LUẬN & HƯỚNG DẪN BẮT ĐẦU

Tài liệu này cung cấp nền tảng toàn diện để phát triển tính năng **YouTube Trẻ Em An Toàn**. Các bước tiếp theo:
1. Chạy mã SQL tại [`docs/sql/02_youtube_whitelist_schema.sql`](file:///c:/react-native-launcher-kit/docs/sql/02_youtube_whitelist_schema.sql) trên Supabase SQL Editor.
2. Thực hiện tách và tái cấu trúc mã nguồn `youtubeService` theo cấu trúc thư mục module hóa.
3. Cập nhật giao diện `KidsYouTubeScreen` và kiểm tra đồng bộ Realtime.
