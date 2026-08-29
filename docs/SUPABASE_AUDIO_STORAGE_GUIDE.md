# 🎵 HƯỚNG DẪN QUẢN TRỊ & LƯU TRỮ ÂM THANH TRÊN SUPABASE STORAGE BUCKET

---

## 🎯 1. TỔNG QUAN KIẾN TRÚC LƯU TRỮ AUDIO

Hệ thống âm thanh của các trò chơi trẻ em (như **Game 3: Nghe Tiếng Đoán Con Vật**) được xây dựng theo mô hình **Cloud-Powered CDN + Offline-First Cache**:

```
 ┌─────────────────────────────────────────────────────────────┐
 │                  SUPABASE STORAGE BUCKET                    │
 │               (Bucket: kids_audio - Public)                 │
 │                                                             │
 │   /sounds/         /voices_vi/             /voices_en/      │
 │  ├── cat.mp3      ├── cat_vi.mp3          ├── cat_en.mp3    │
 │  ├── dog.mp3      ├── dog_vi.mp3          ├── dog_en.mp3    │
 │  └── ...          └── ...                 └── ...           │
 └──────────────────────────────┬──────────────────────────────┘
                                │ Public URLs
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                SUPABASE DATABASE (POSTGRES)                 │
 │                    Bảng: kids_animals                       │
 │  ├── sound_mp3_url  (Link tiếng kêu con vật)                │
 │  ├── voice_vi_url   (Link giọng đọc Tiếng Việt)             │
 │  └── voice_en_url   (Link giọng đọc Tiếng Anh bản xứ)       │
 └──────────────────────────────┬──────────────────────────────┘
                                │ syncWithCloud()
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                  REACT NATIVE LAUNCHER APP                  │
 │                                                             │
 │  1. animalSoundService.ts  ── Tải bảng & Cache vào MMKV     │
 │  2. SoundPlayer (Preload)  ── Tải trước vào RAM (Phát 0s)   │
 │  3. Offline-Ready          ── Vẫn phát tốt khi mất mạng     │
 └─────────────────────────────────────────────────────────────┘
```

---

## 📁 2. QUY ƯỚC CẤU TRÚC THƯ MỤC & ĐẶT TÊN FILE (NAMING CONVENTION)

Để quản lý hàng trăm con vật và âm thanh khoa học, nên tổ chức cây thư mục trong bucket `kids_audio` như sau:

```
kids_audio/
├── animals/
│   ├── sounds/           # Tiếng kêu tự nhiên của con vật
│   │   ├── cat.mp3       # Tiếng mèo kêu (Meo meo)
│   │   ├── dog.mp3       # Tiếng chó sủa (Gâu gâu)
│   │   ├── cow.mp3       # Tiếng bò kêu (Ùm bò)
│   │   ├── rooster.mp3   # Tiếng gà gáy (Ò ó o)
│   │   ├── lion.mp3      # Tiếng sư tử gầm
│   │   └── dolphin.mp3   # Tiếng cá heo
│   │
│   ├── voices_vi/        # Giọng phát âm chuẩn Tiếng Việt (Miền Nam/Bắc)
│   │   ├── cat.mp3       # "Mèo con"
│   │   ├── dog.mp3       # "Chú cún con"
│   │   ├── cow.mp3       # "Bò sữa"
│   │   └── rooster.mp3   # "Gà trống"
│   │
│   └── voices_en/        # Giọng phát âm chuẩn Bản xứ Tiếng Anh (US/UK)
│       ├── cat.mp3       # "Cat" hoặc "Kitten"
│       ├── dog.mp3       # "Dog" hoặc "Puppy"
│       ├── cow.mp3       # "Cow"
│       └── rooster.mp3   # "Rooster"
│
├── colors/               # Giọng đọc tên màu sắc
│   ├── vi/
│   │   ├── yellow.mp3    # "Màu vàng"
│   │   └── pink.mp3      # "Màu hồng"
│   └── en/
│       ├── yellow.mp3    # "Yellow"
│       └── pink.mp3      # "Pink"
│
└── effects/              # Hiệu ứng âm thanh trò chơi (SFX)
    ├── pop.mp3           # Tiếng bóng nổ
    ├── correct.mp3       # Tiếng chuông chọn đúng
    ├── wrong.mp3         # Tiếng rung chọn sai
    └── victory.mp3       # Tiếng reo hò chiến thắng
```

> **Tiêu chuẩn file âm thanh khuyến nghị:**
> - Định dạng: `.mp3` (hoặc `.m4a` / `.aac`).
> - Tần số lấy mẫu: `44.1 kHz` hoặc `22.05 kHz`.
> - Bitrate: `64 kbps` – `128 kbps` (vừa đủ độ trong trẻo, dung lượng cực nhẹ chỉ ~20KB - 80KB mỗi file, tải siêu nhanh).

---

## 🛠️ 3. HƯỚNG DẪN TẠO STORAGE BUCKET TRÊN SUPABASE

### Bước 1: Tạo Bucket
1. Mở trang quản trị **Supabase Dashboard** của dự án:
   `https://supabase.com/dashboard/project/jlfemayqttjcfjualfsv`
2. Chọn menu **Storage** ở thanh bên trái.
3. Nhấp nút **New Bucket**.
4. Điền thông tin:
   - **Name of bucket**: `kids_audio`
   - **Public bucket**: **BẬT (ON)** *(Bắt buộc bật để ứng dụng client có thể đọc link audio trực tiếp không cần token)*.
5. Nhấp **Save bucket**.

---

### Bước 2: Thiết lập Quyền Truy Cập (Storage Policies)

Mặc định khi bật **Public bucket**, bất kỳ ai cũng có thể đọc (READ) file. Để bảo mật quyền upload/chỉnh sửa, cấu hình Policy như sau (SQL Editor):

```sql
-- 1. Cho phép tất cả người dùng (Anonymous & Client App) ĐỌC âm thanh công khai
CREATE POLICY "Public Read Access for kids_audio"
ON storage.objects FOR SELECT
USING (bucket_id = 'kids_audio');

-- 2. Chỉ cho phép Service Role / Admin tải file lên bucket
CREATE POLICY "Admin Upload Access for kids_audio"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'kids_audio' AND auth.role() = 'service_role');
```

---

## 🌐 4. CẤU TRÚC ĐƯỜNG DẪN CÔNG KHAI (PUBLIC URL)

Sau khi upload file lên bucket, URL công khai để ứng dụng phát trực tiếp có cú pháp:

```text
https://[PROJECT_ID].supabase.co/storage/v1/object/public/[BUCKET_NAME]/[ĐƯỜNG_DẪN_FILE]
```

### Ví dụ thực tế với Project Supabase hiện tại:
* Tiếng kêu con mèo:
  `https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids_audio/animals/sounds/cat.mp3`
* Giọng đọc tiếng Việt:
  `https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids_audio/animals/voices_vi/cat.mp3`
* Giọng đọc tiếng Anh:
  `https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids_audio/animals/voices_en/cat.mp3`

---

## 💾 5. CẬP NHẬT DỮ LIỆU VÀO DATABASE `kids_animals`

Khi đã có đường link file trên Supabase Bucket, bạn cập nhật bảng `kids_animals` thông qua **SQL Editor** trên Supabase:

```sql
-- Cập nhật đường link âm thanh từ Supabase Bucket cho các con vật Nông Trại
UPDATE kids_animals
SET 
  sound_mp3_url = 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids_audio/animals/sounds/cat.mp3',
  voice_vi_url  = 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids_audio/animals/voices_vi/cat.mp3',
  voice_en_url  = 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids_audio/animals/voices_en/cat.mp3'
WHERE id = 'cat';

UPDATE kids_animals
SET 
  sound_mp3_url = 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids_audio/animals/sounds/dog.mp3',
  voice_vi_url  = 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids_audio/animals/voices_vi/dog.mp3',
  voice_en_url  = 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids_audio/animals/voices_en/dog.mp3'
WHERE id = 'dog';

UPDATE kids_animals
SET 
  sound_mp3_url = 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids_audio/animals/sounds/pig.mp3',
  voice_vi_url  = 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids_audio/animals/voices_vi/pig.mp3',
  voice_en_url  = 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids_audio/animals/voices_en/pig.mp3'
WHERE id = 'pig';

UPDATE kids_animals
SET 
  sound_mp3_url = 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids_audio/animals/sounds/rooster.mp3',
  voice_vi_url  = 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids_audio/animals/voices_vi/rooster.mp3',
  voice_en_url  = 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids_audio/animals/voices_en/rooster.mp3'
WHERE id = 'rooster';

UPDATE kids_animals
SET 
  sound_mp3_url = 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids_audio/animals/sounds/cow.mp3',
  voice_vi_url  = 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids_audio/animals/voices_vi/cow.mp3',
  voice_en_url  = 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids_audio/animals/voices_en/cow.mp3'
WHERE id = 'cow';
```

---

## ⚡ 6. CƠ CHẾ ĐỒNG BỘ & PHÁT ÂM THANH TRONG CODE

### 6.1. Tự động đồng bộ khi mở Game (`AnimalSoundGameScreen.tsx`)
Khi trẻ mở game, ứng dụng thực hiện các bước:
1. Đọc dữ liệu cache từ bộ nhớ nhanh (`MMKV`).
2. Gọi nền hàm `animalSoundService.syncWithCloud()` để tải danh sách mới nhất từ bảng `kids_animals` trên Supabase.
3. Kích hoạt tính năng **Preload** toàn bộ URL âm thanh:
   ```ts
   // Tải trước (Preload) toàn bộ âm thanh vào RAM để bấm là phát tức thì 0s
   const urlsToPreload: string[] = [];
   initialAnimals.forEach((a) => {
     if (a.sound_mp3_url) urlsToPreload.push(a.sound_mp3_url);
     if (a.voice_en_url) urlsToPreload.push(a.voice_en_url);
     if (a.voice_vi_url) urlsToPreload.push(a.voice_vi_url);
   });
   soundManager.preloadBatch(urlsToPreload);
   ```

### 6.2. Phát âm thanh không độ trễ
Khi trẻ chọn con vật hoặc bấm nút loa 🔊:
```ts
animalSoundService.playSound(animal.sound_mp3_url, animal.sound_text_vi);
```
- Nếu đã nạp cache/preload: Phát ngay lập tức qua `SoundPlayer`.
- Nếu đang offline: Hệ thống fallback tự động sang Text-To-Speech (TTS) hoặc âm thanh đã lưu sẵn trong máy.

---

## 🎁 7. NGUỒN TẢI TIẾNG KÊU & GIỌNG ĐỌC MIỄN PHÍ DÀNH CHO BÉ

| Nguồn | Loại âm thanh | Giấy phép | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Mixkit SFX** (`mixkit.co/free-sound-effects/animal/`) | Tiếng kêu động vật chất lượng cao | Miễn phí thương mại | File sạch, không lẫn tạp âm |
| **Freesound.org** | Đa dạng tiếng kêu chim, thú rừng, biển | Creative Commons 0 (CC0) | Nhiều hiệu ứng tự nhiên |
| **Google Cloud TTS / Voice Maker** | Giọng đọc phát âm Tiếng Việt / Tiếng Anh | Chuẩn giáo dục | Giọng trẻ em hoặc cô giáo ấm áp |
| **Pixabay Sound Effects** | Âm thanh hoạt hình, tiếng bong bóng nổ | Miễn phí 100% | Rất thích hợp làm game thiếu nhi |

---

## 🌟 8. TỔNG KẾT LỢI ÍCH

- ✅ **OTA (Over-The-Air) Content**: Thêm 50 con vật mới hoặc thay đổi tiếng kêu hay hơn bất kỳ lúc nào chỉ bằng việc tải file lên Supabase Storage mà **không cần release lại app lên CH Play**.
- ✅ **Phân phối CDN toàn cầu**: Tốc độ tải âm thanh cực nhanh, ổn định.
- ✅ **Trải nghiệm mượt mà cho bé**: Kết hợp preloading giúp bé chạm là nghe tiếng kêu ngay lập tức, không bị gián đoạn hay phải chờ đợi tải.
