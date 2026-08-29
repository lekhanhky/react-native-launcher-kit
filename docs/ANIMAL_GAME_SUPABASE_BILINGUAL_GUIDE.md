# 🐾 HƯỚNG DẪN NÂNG CẤP GAME 3: ĐỘNG VẬT, MÀU SẮC & NƠI SỐNG SONG NGỮ (VIỆT - ANH) VỚI SUPABASE

---

## 🎯 1. TỔNG QUAN & MỤC TIÊU NÂNG CẤP

Nâng cấp **Game 3: Nghe Tiếng Đoán Con Vật (Animal Sound & Color Explorer)** từ trò chơi đoán âm thanh cơ bản thành **Hệ Sinh Thái Giáo Dục Đa Giác Quan Đám Mây (Cloud-Powered Bilingual Educational App)** với 4 trụ cột kiến thức chính:

1. **🌐 Học Song Ngữ Toàn Diện (Tiếng Việt 🇻🇳 - Tiếng Anh 🇬🇧 - Song Ngữ 🌐)**:
   - Dễ dàng chuyển đổi ngôn ngữ linh hoạt cho bé từ mầm non (2-4 tuổi) đến tiểu học (5-8 tuổi).
   - Tên gọi, phiên âm chuẩn quốc tế (`IPA`), từ vựng mô tả tiếng kêu song ngữ (VD: *Gâu gâu* ↔ *Woof woof*, *Ủn ỉn* ↔ *Oink oink*).
2. **🎨 Bổ Sung Nhận Diện Màu Sắc & Nơi Sống (Colors & Habitats)**:
   - Tích hợp bảng Màu sắc (`kids_colors`) và Môi trường sống (`kids_habitats`).
   - Mở rộng nhiều dạng câu đố thông minh:
     - 🔊 **Đoán Tiếng Kêu (Sound Quiz)**: Nghe âm thanh đoán loài vật.
     - 🎨 **Đoán Màu Sắc (Color Quiz)**: Bé học nhận diện màu lông / màu đặc trưng của các loài động vật.
     - 🏡 **Đoán Nơi Sống (Habitat Quiz)**: Nông trại, Rừng xanh, Đại dương, Bầu trời.
3. **☁️ Quản Trị Dữ Liệu Động Trên Supabase**:
   - Thêm mới, chỉnh sửa hàng trăm con vật, bảng màu, tiếng kêu và sự thật thú vị mà **không cần build lại file APK**.
   - Tự động cache dữ liệu cục bộ (Offline-First) giúp bé chơi mượt mà khi không có mạng Internet.
4. **📊 Theo Dõi & Báo Cáo Tiến Độ Cho Phụ Huynh**:
   - Ghi nhận nhật ký làm bài lên bảng `kids_animal_learning_logs` để phân tích những từ vựng bé đã thành thạo hoặc cần ôn luyện.

---

## ⚙️ 2. CHẾ ĐỘ NGÔN NGỮ & DẠNG CÂU ĐỐ (SETTINGS & MODES)

### 2.1. Ba Chế Độ Ngôn Ngữ
```
[ 🇻🇳 Tiếng Việt ]     [ 🇬🇧 Tiếng Anh ]     [ 🌐 Song Ngữ Toàn Diện ]
```

| Chế độ | Hiển thị tên & Màu sắc | Âm thanh & Mô tả | Mục đích giáo dục |
| :--- | :--- | :--- | :--- |
| **🇻🇳 Tiếng Việt** | "Chú Cún Con", "Màu Vàng", "Nông Trại" | Tiếng sủa "Gâu gâu!" + Lời thoại tiếng Việt | Dành cho bé 2-4 tuổi phát triển ngôn ngữ mẹ đẻ và thế giới quan tự nhiên. |
| **🇬🇧 Tiếng Anh** | "Puppy (Dog)", "Yellow", "Farm" | Tiếng sủa "Woof woof!" + Giọng đọc bản xứ | Dành cho bé 4-8 tuổi làm quen từ vựng tiếng Anh giao tiếp tự nhiên. |
| **🌐 Song Ngữ** | "Chú Cún Con (Puppy)" kèm IPA `/ˈpʌp.i/` | Phát cả 2 ngôn ngữ + Sự thật thú vị song ngữ | Kích thích phát triển tư duy song ngữ kép cho não bộ của trẻ. |

### 2.2. Ba Dạng Câu Đố Trong Game (Quiz Sub-Types)
1. 🔊 **Tiếng Kêu (Sound Quiz)**: Ứng dụng phát âm thanh đặc trưng $\rightarrow$ Bé chọn 1 trong 4 con vật tương ứng.
2. 🎨 **Màu Sắc (Color Quiz)**: Câu hỏi nhận diện màu sắc của con vật (VD: *"Chú Heo con màu gì?"* $\rightarrow$ Bé chọn thẻ *Màu Hồng / Pink*).
3. 🏡 **Nơi Sống (Habitat Quiz)**: Câu hỏi về môi trường sinh sống (VD: *"Cá Heo sống ở đâu?"* $\rightarrow$ Bé chọn *Đại Dương / Ocean*).

---

## 🗄️ 3. THIẾT KẾ CẤU TRÚC DATABASE SUPABASE (SQL SCHEMA)

### 3.1. Bảng Danh Mục Màu Sắc (`kids_colors`)
```sql
CREATE TABLE IF NOT EXISTS kids_colors (
    id VARCHAR(30) PRIMARY KEY,                  -- 'yellow', 'pink', 'red', 'blue', 'green', 'orange', 'purple', 'brown', 'gray', 'white'
    name_vi VARCHAR(50) NOT NULL,                -- 'Màu Vàng'
    name_en VARCHAR(50) NOT NULL,                -- 'Yellow'
    phonetic_en VARCHAR(50),                     -- '/ˈjel.oʊ/'
    hex_code VARCHAR(10) NOT NULL,               -- '#FDE047'
    text_color VARCHAR(10) DEFAULT '#FFFFFF',    -- Màu chữ tương phản trên nền
    example_item_vi VARCHAR(100),                -- 'Vàng như quả chuối chín'
    example_item_en VARCHAR(100),                -- 'Yellow like a sweet banana'
    voice_vi_url TEXT,                           -- Giọng đọc tên màu tiếng Việt
    voice_en_url TEXT,                           -- Giọng đọc chuẩn bản xứ tiếng Anh
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3.2. Bảng Môi Trường Sống (`kids_habitats`)
```sql
CREATE TABLE IF NOT EXISTS kids_habitats (
    id VARCHAR(30) PRIMARY KEY,                  -- 'farm', 'wild', 'ocean', 'birds'
    emoji VARCHAR(10) NOT NULL,                  -- '🚜', '🌲', '🌊', '☁️'
    name_vi VARCHAR(50) NOT NULL,                -- 'Nông Trại'
    name_en VARCHAR(50) NOT NULL,                -- 'Farm'
    bg_gradient TEXT[],                          -- ARRAY['#FEF08A', '#FDE047']
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);
```

### 3.3. Bảng Danh Mục Động Vật Song Ngữ (`kids_animals`)
```sql
CREATE TABLE IF NOT EXISTS kids_animals (
    id VARCHAR(50) PRIMARY KEY,                  -- 'dog', 'cat', 'pig', 'lion', 'dolphin'
    emoji VARCHAR(10) NOT NULL,                  -- '🐶', '🐱', '🐷', '🦁'
    category VARCHAR(30) NOT NULL DEFAULT 'farm',-- 'farm', 'wild', 'ocean', 'birds'
    primary_color_id VARCHAR(30) REFERENCES kids_colors(id) ON DELETE SET NULL,
    habitat_id VARCHAR(30) REFERENCES kids_habitats(id) ON DELETE SET NULL,
    
    -- Dữ liệu Tiếng Việt
    name_vi VARCHAR(100) NOT NULL,               -- 'Chú Cún Con'
    sound_text_vi VARCHAR(100) NOT NULL,         -- 'Gâu gâu! Gâu gâu!'
    sound_desc_vi TEXT,                          -- 'Tiếng cún con sủa mừng khi chủ về'
    fun_fact_vi TEXT,                            -- 'Cún cưng có thính giác tốt gấp 4 lần con người!'
    favorite_food_vi VARCHAR(100),               -- 'Khúc xương & Thức ăn hạt'
    
    -- Dữ liệu Tiếng Anh
    name_en VARCHAR(100) NOT NULL,               -- 'Puppy (Dog)'
    phonetic_en VARCHAR(100),                    -- '/ˈpʌp.i/' (Phiên âm quốc tế IPA)
    sound_text_en VARCHAR(100) NOT NULL,         -- 'Woof! Woof! Bark!'
    sound_desc_en TEXT,                          -- 'Happy barking sound of a puppy'
    fun_fact_en TEXT,                            -- 'Dogs can understand up to 250 words and gestures!'
    favorite_food_en VARCHAR(100),               -- 'Bones & Dog treats'
    
    -- Media URLs (Supabase Storage Bucket: kids-media)
    sound_mp3_url TEXT,                          -- Âm thanh tiếng kêu thực tế
    voice_vi_url TEXT,                           -- Giọng đọc tiếng Việt
    voice_en_url TEXT,                           -- Giọng đọc tiếng Anh
    image_url TEXT,                              -- Ảnh minh họa vector độ phân giải cao
    
    -- Cấu hình hiển thị
    difficulty INT DEFAULT 1,                    -- 1: Mầm non, 2: Nâng cao
    color_hex VARCHAR(20) DEFAULT '#FDE68A',     -- Màu thẻ hiển thị
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3.4. Bảng Nhật Ký & Tiến Độ Học Tập (`kids_animal_learning_logs`)
```sql
CREATE TABLE IF NOT EXISTS kids_animal_learning_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id VARCHAR(100) NOT NULL,             -- Mã thiết bị
    profile_name VARCHAR(50) DEFAULT 'Bé Yêu',   -- Tên bé
    language_mode VARCHAR(20) NOT NULL,          -- 'vi', 'en', 'bilingual'
    quiz_type VARCHAR(20) NOT NULL DEFAULT 'sound', -- 'sound', 'color', 'habitat'
    game_mode VARCHAR(20) NOT NULL DEFAULT 'quiz',  -- 'quiz' hoặc 'explorer'
    score INT NOT NULL,                          -- Điểm đạt được
    total_questions INT NOT NULL,                -- Tổng số câu hỏi
    correct_animals JSONB DEFAULT '[]'::jsonb,   -- Danh sách ID con vật đoán đúng
    wrong_animals JSONB DEFAULT '[]'::jsonb,     -- Câu đoán sai: [{"target": "lion", "chosen": "tiger"}]
    duration_seconds INT DEFAULT 0,              -- Thời gian hoàn thành (giây)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 📦 4. DỮ LIỆU MẪU BAN ĐẦU (SEED DATA)

```sql
-- 1. NẠP DỮ LIỆU MÀU SẮC
INSERT INTO kids_colors (id, name_vi, name_en, phonetic_en, hex_code, text_color, example_item_vi, example_item_en, display_order)
VALUES
('yellow', 'Màu Vàng', 'Yellow', '/ˈjel.oʊ/', '#FDE047', '#854D0E', 'Vàng như quả chuối', 'Yellow like a banana', 1),
('pink', 'Màu Hồng', 'Pink', '/pɪŋk/', '#F472B6', '#831843', 'Hồng như cánh sen', 'Pink like a lotus', 2),
('red', 'Màu Đỏ', 'Red', '/red/', '#EF4444', '#FFFFFF', 'Đỏ như quả táo', 'Red like an apple', 3),
('blue', 'Màu Xanh Dương', 'Blue', '/bluː/', '#38BDF8', '#075985', 'Xanh như bầu trời', 'Blue like the sky', 4),
('green', 'Màu Xanh Lá', 'Green', '/ɡriːn/', '#4ADE80', '#14532D', 'Xanh như chiếc lá', 'Green like a leaf', 5),
('orange', 'Màu Cam', 'Orange', '/ˈɔːr.ɪndʒ/', '#FB923C', '#7C2D12', 'Cam như quả cam', 'Orange like an orange', 6),
('purple', 'Màu Tím', 'Purple', '/ˈpɝː.pəl/', '#C084FC', '#581C87', 'Tím như quả cà', 'Purple like grapes', 7),
('white', 'Màu Trắng', 'White', '/waɪt/', '#F8FAFC', '#334155', 'Trắng như đám mây', 'White like clouds', 8),
('brown', 'Màu Nâu', 'Brown', '/braʊn/', '#B45309', '#FFFFFF', 'Nâu như hạt dẻ', 'Brown like chestnut', 9),
('gray', 'Màu Xám', 'Gray', '/ɡreɪ/', '#94A3B8', '#0F172A', 'Xám như chú voi', 'Gray like an elephant', 10)
ON CONFLICT (id) DO NOTHING;

-- 2. NẠP DỮ LIỆU MÔI TRƯỜNG SỐNG
INSERT INTO kids_habitats (id, emoji, name_vi, name_en, display_order)
VALUES
('farm', '🚜', 'Nông Trại', 'Farm', 1),
('wild', '🌲', 'Rừng Xanh', 'Wild Jungle', 2),
('ocean', '🌊', 'Đại Dương', 'Deep Ocean', 3),
('birds', '☁️', 'Bầu Trời', 'Sky & Trees', 4)
ON CONFLICT (id) DO NOTHING;

-- 3. NẠP DỮ LIỆU ĐỘNG VẬT SONG NGỮ
INSERT INTO kids_animals 
(id, emoji, category, primary_color_id, habitat_id, name_vi, sound_text_vi, sound_desc_vi, fun_fact_vi, favorite_food_vi, name_en, phonetic_en, sound_text_en, sound_desc_en, fun_fact_en, favorite_food_en, color_hex, difficulty)
VALUES
(
  'dog', '🐶', 'farm', 'yellow', 'farm',
  'Chú Cún Con', 'Gâu gâu! Gâu gâu!', 'Tiếng cún con sủa vui mừng vẫy đuôi', 'Cún cưng luôn trung thành và có thính giác tốt gấp 4 lần con người!', 'Khúc xương & Thức ăn hạt',
  'Puppy (Dog)', '/ˈpʌp.i/', 'Woof! Woof! Bark!', 'A cheerful dog barking happily', 'Dogs can understand up to 250 words and gestures!', 'Bones & Dog treats',
  '#FDE68A', 1
),
(
  'cat', '🐱', 'farm', 'orange', 'farm',
  'Mèo Con', 'Meo meo! Meo meo!', 'Tiếng mèo con kêu nũng nịu đòi ăn', 'Mèo có thể nhảy cao gấp 6 lần chiều dài cơ thể.', 'Cá tươi & Sữa thơm',
  'Kitten (Cat)', '/ˈkɪt.ən/', 'Meow! Meow! Purr!', 'A cute kitten meowing softly', 'Cats sleep for around 70% of their lives!', 'Fish & Milk',
  '#FED7AA', 1
),
(
  'pig', '🐷', 'farm', 'pink', 'farm',
  'Heo Con', 'Ủn ỉn! Ủn ỉn!', 'Tiếng heo con đòi ăn cám ngon', 'Heo rất thông minh và thích tắm bùn để giữ mát cơ thể.', 'Cám bắp & Rau muống',
  'Piglet (Pig)', '/ˈpɪɡ.lət/', 'Oink! Oink!', 'A friendly piglet oinking happily', 'Pigs are very clean animals and love to dream!', 'Corn & Fresh veggies',
  '#FBCFE8', 1
),
(
  'rooster', '🐔', 'farm', 'red', 'farm',
  'Gà Trống', 'Ò ó o o!', 'Tiếng gà trống gáy vang đón bình minh', 'Tiếng gáy của gà trống giúp đánh thức cả làng quê thức dậy.', 'Thóc lúa & Bắp vàng',
  'Rooster', '/ˈruː.stɚ/', 'Cock-a-doodle-doo!', 'A proud rooster crowing in the morning', 'Roosters crow to announce their territory to other birds.', 'Grains & Corn',
  '#FECDD3', 1
),
(
  'duck', '🦆', 'farm', 'yellow', 'farm',
  'Vịt Con', 'Cạp cạp! Cạp cạp!', 'Tiếng vịt con tung tăng bơi lội dưới ao', 'Lông vịt không bao giờ bị ướt vì có lớp dầu tự nhiên bảo vệ.', 'Rong rêu & Tép nhỏ',
  'Duckling (Duck)', '/ˈdʌk.lɪŋ/', 'Quack! Quack!', 'A duck quacking happily in the pond', 'Duck feathers are completely waterproof!', 'Aquatic plants & Small fish',
  '#FEF08A', 1
),
(
  'cow', '🐮', 'farm', 'white', 'farm',
  'Bò Sữa', 'Ùm bòoo! Ùm bòoo!', 'Tiếng bò sữa thong thả gặm cỏ non', 'Bò sữa cho chúng ta nguồn sữa thơm ngon giàu canxi mỗi ngày.', 'Cỏ voi & Rơm khô',
  'Cow', '/kaʊ/', 'Moo! Mooo!', 'A gentle cow mooing on the green pasture', 'Cows have best friends and get stressed when separated!', 'Fresh grass & Hay',
  '#E9D5FF', 1
),
(
  'frog', '🐸', 'wild', 'green', 'wild',
  'Chú Ếch Xanh', 'Ộp ộp! Ộp ộp!', 'Tiếng ếch kêu rộn ràng bên bờ ao sau mưa', 'Ếch có thể thở bằng cả da và phổi đấy bé!', 'Côn trùng & Muỗi',
  'Frog', '/frɑːɡ/', 'Ribbit! Croak!', 'A green frog croaking by the pond', 'Frogs can absorb water through their skin so they never need to drink!', 'Flies & Bugs',
  '#BBF7D0', 1
),
(
  'lion', '🦁', 'wild', 'orange', 'wild',
  'Sư Tử', 'Gaooo! Gầm gừ!', 'Tiếng sư tử chúa sơn lâm dũng mãnh', 'Sư tử đực có chiếc bờm dày dũng mãnh để bảo vệ bầy đàn.', 'Thịt tươi',
  'Lion', '/ˈlaɪ.ən/', 'Roar! Roaaar!', 'A mighty lion roaring across the savanna', 'A lion’s roar can be heard from 8 kilometers away!', 'Meat',
  '#FED7AA', 2
),
(
  'elephant', '🐘', 'wild', 'gray', 'wild',
  'Chú Voi Khổng Lồ', 'Éc éc! Rống vang!', 'Tiếng voi huơ vòi gọi các bạn voi', 'Chiếc vòi voi có hơn 40.000 bó cơ bắp vô cùng khéo léo.', 'Mía ngọt & Chuối chín',
  'Elephant', '/ˈel.ə.fənt/', 'Pawoo! Trumpet!', 'An elephant trumpeting through its long trunk', 'Elephants are the only land animals that cannot jump!', 'Sugarcane & Bananas',
  '#CFFAFE', 2
),
(
  'dolphin', '🐬', 'ocean', 'blue', 'ocean',
  'Cá Heo', 'Chít chít! Tách tách!', 'Tiếng cá heo phát sóng âm trò chuyện dưới biển', 'Cá heo là một trong những loài vật thông minh và thân thiện nhất với con người.', 'Cá trích & Mực nhỏ',
  'Dolphin', '/ˈdɑːl.fɪn/', 'Click! Whistle!', 'Dolphin clicking and whistling underwater', 'Dolphins sleep with one eye open to stay alert!', 'Herring & Squid',
  '#BAE6FD', 2
)
ON CONFLICT (id) DO UPDATE SET
  name_vi = EXCLUDED.name_vi,
  name_en = EXCLUDED.name_en,
  primary_color_id = EXCLUDED.primary_color_id,
  habitat_id = EXCLUDED.habitat_id,
  sound_text_vi = EXCLUDED.sound_text_vi,
  sound_text_en = EXCLUDED.sound_text_en,
  fun_fact_vi = EXCLUDED.fun_fact_vi,
  fun_fact_en = EXCLUDED.fun_fact_en;
```

---

## 🏗️ 5. CẤU TRÚC CODE TRIỂN KHAI TRONG REACT NATIVE

### 5.1. File `example/src/services/animalSoundService.ts`
- **Quản lý dữ liệu & Offline Cache**: Lưu trữ danh mục con vật, màu sắc và môi trường sống trên bộ nhớ cache cục bộ.
- **Đồng bộ tự động đám mây**: Gọi hàm `syncWithCloud()` kết nối bảng `kids_animals`, `kids_colors`, `kids_habitats` trên Supabase.
- **Lưu trữ lịch sử học tập**: Tự động lưu tiến độ vào `kids_animal_learning_logs`.

### 5.2. File `example/src/screens/AnimalSoundGameScreen.tsx`
- **Thanh chuyển đổi ngôn ngữ**: `🇻🇳 Tiếng Việt`, `🇬🇧 English`, `🌐 Song Ngữ`.
- **Thanh chọn dạng câu đố**: `🔊 Tiếng Kêu`, `🎨 Màu Sắc`, `🏡 Nơi Sống`.
- **Chế độ Bách Khoa Khám Phá**:
  - Lọc theo môi trường sống (Nông trại, Rừng xanh, Đại dương, Bầu trời).
  - Bấm vào con vật để nghe phát âm, xem phiên âm IPA và mở **Flashcard chi tiết** (Màu chủ đạo, Thức ăn yêu thích, Sự thật thú vị song ngữ).
- **Gamification & Thưởng Sao**: Hiệu ứng rung động, nảy cẫng khi trả lời đúng, trao cúp vàng 🏆 và cộng điểm sao ⭐.

---

> 💡 **Tài liệu tham khảo liên quan:**
> - [animalSoundService.ts](file:///c:/react-native-launcher-kit/example/src/services/animalSoundService.ts)
> - [AnimalSoundGameScreen.tsx](file:///c:/react-native-launcher-kit/example/src/screens/AnimalSoundGameScreen.tsx)
> - [supabaseClient.ts](file:///c:/react-native-launcher-kit/example/src/services/supabaseClient.ts)
> - [KIDS_GAMES_GUIDE.md](file:///c:/react-native-launcher-kit/docs/KIDS_GAMES_GUIDE.md)
