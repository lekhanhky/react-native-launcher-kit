-- ==============================================================================
-- 04_nature_explorer_schema.sql
-- HỆ THỐNG CƠ SỞ DỮ LIỆU GAME "BIỆT ĐỘI KHÁM PHÁ NHÍ" (NATURE EXPLORER)
-- Đối tượng: Bé Tom & Bé MiMi đồng hành khám phá (Chuẩn Google Veo 3D)
-- Hỗ trợ: Động vật, Thực vật, Màn, Cảnh, Câu đố trắc nghiệm & Bách khoa toàn thư
-- ==============================================================================

-- 1. BẢNG MÀN LỚN / THẾ GIỚI (WORLDS)
CREATE TABLE IF NOT EXISTS explorer_worlds (
    id VARCHAR(50) PRIMARY KEY,                         -- 'rainforest', 'savanna', 'desert', 'botanical'
    title_vi VARCHAR(100) NOT NULL,                     -- 'Khu Rừng Mưa Nhiệt Đới'
    title_en VARCHAR(100),                              -- 'Tropical Rainforest'
    description_vi TEXT,                                -- Tóm tắt lời dẫn của Bé Tom & Bé MiMi
    bg_map_url TEXT,                                    -- Ảnh bìa bản đồ
    theme_color VARCHAR(10) DEFAULT '#4CAF50',          -- Màu nhận diện
    display_order INT DEFAULT 0,                        -- Thứ tự sắp xếp
    is_active BOOLEAN DEFAULT true,                     -- Đang mở hay khóa
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. BẢNG CẢNH TRONG MỖI MÀN (SCENES)
CREATE TABLE IF NOT EXISTS explorer_scenes (
    id VARCHAR(50) PRIMARY KEY,                         -- 'rainforest_scene_1'
    world_id VARCHAR(50) REFERENCES explorer_worlds(id) ON DELETE CASCADE,
    title_vi VARCHAR(100) NOT NULL,                     -- 'Bìa Rừng Ẩm Ướt'
    bg_image_url TEXT NOT NULL,                         -- Ảnh nền toàn cảnh (Panorama)
    ambient_sound_url TEXT,                             -- Âm thanh suối chảy, chim hót
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. BẢNG THỰC THỂ SINH VẬT (ENTITIES: CON VẬT & CÂY CỐI)
CREATE TABLE IF NOT EXISTS explorer_entities (
    id VARCHAR(50) PRIMARY KEY,                         -- 'pitcher_plant', 'chameleon', 'elephant'
    scene_id VARCHAR(50) REFERENCES explorer_scenes(id) ON DELETE CASCADE,
    name_vi VARCHAR(100) NOT NULL,                      -- 'Cây Nắp Ấm'
    name_en VARCHAR(100),                               -- 'Pitcher Plant'
    category VARCHAR(20) NOT NULL CHECK (category IN ('ANIMAL', 'PLANT')),
    sprite_image_url TEXT NOT NULL,                     -- Ảnh PNG tách nền
    pos_x_percent NUMERIC(5,2) NOT NULL,                -- Tọa độ X (0.00% -> 100.00%)
    pos_y_percent NUMERIC(5,2) NOT NULL,                -- Tọa độ Y (0.00% -> 100.00%)
    size_scale NUMERIC(3,2) DEFAULT 1.0,                -- Tỉ lệ phóng to/thu nhỏ
    sound_fx_url TEXT,                                  -- Tiếng kêu con vật hoặc hiệu ứng
    fun_fact_vi TEXT NOT NULL,                          -- Sự thật khoa học nổi bật
    fun_fact_voice_url TEXT,                            -- Giọng đọc sự thật thú vị của Bé Tom
    badge_icon_url TEXT,                                -- Huy hiệu nhận được khi hoàn thành
    youtube_video_id VARCHAR(50),                       -- ID Video YouTube (vd: 'womW1y-b_1E')
    youtube_video_title VARCHAR(150),                   -- Tiêu đề thước phim thực tế
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. BẢNG THỬ THÁCH TƯƠNG TÁC & CÂU HỎI (CHALLENGES / QUIZZES)
CREATE TABLE IF NOT EXISTS explorer_quizzes (
    id VARCHAR(50) PRIMARY KEY,                         -- 'quiz_pitcher_01'
    entity_id VARCHAR(50) REFERENCES explorer_entities(id) ON DELETE CASCADE,
    interaction_type VARCHAR(50) DEFAULT 'MCQ' CHECK (interaction_type IN (
        'MCQ',          -- Trắc nghiệm hình ảnh & âm thanh truyền thống
        'MAGNIFIER',    -- Kính lúp soi chi tiết ẩn & Đèn pin đêm
        'FEEDING',      -- Kéo thả thức ăn vào miệng / chọn nguồn sống
        'SCRATCH',      -- Cào lá / bới cát / lau sương mù
        'LIFE_CYCLE',   -- Thanh trượt tua thời gian vòng đời sinh trưởng
        'BREATH_MIC',   -- Thổi micro làm bay hạt giống / hoa
        'SNAPSHOT',     -- Bấm máy ảnh bắt khoảnh khắc
        'SILHOUETTE'    -- Nối bóng sinh vật / ghép bộ phận khuyết
    )),
    interaction_config JSONB DEFAULT '{}'::jsonb,       -- Tham số động cho từng loại mini-game
    question_vi TEXT NOT NULL,                          -- Lời dẫn / Thử thách của Bé Tom & MiMi
    question_en TEXT,
    question_audio_url TEXT,                            -- Giọng đọc câu hỏi của Bé MiMi / Bé Tom
    explanation_vi TEXT NOT NULL,                       -- Lời khen & giải thích khoa học
    explanation_audio_url TEXT,
    points INT DEFAULT 10,                              -- Sao thưởng
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. BẢNG LỰA CHỌN TRẢ LỜI (QUIZ OPTIONS)
CREATE TABLE IF NOT EXISTS explorer_quiz_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id VARCHAR(50) REFERENCES explorer_quizzes(id) ON DELETE CASCADE,
    option_text_vi VARCHAR(255) NOT NULL,               -- Nội dung lựa chọn
    option_image_url TEXT,                              -- Ảnh minh họa (cho bé chưa biết đọc chữ)
    is_correct BOOLEAN DEFAULT false,                   -- Đáp án chính xác
    feedback_audio_url TEXT,
    display_order INT DEFAULT 0
);

-- 6. BẢNG TIẾN ĐỘ & SỔ TAY BÁCH KHOA CỦA BÉ (PROGRESS & FIELD GUIDE)
CREATE TABLE IF NOT EXISTS explorer_user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id VARCHAR(100) NOT NULL,                    -- Mã máy hoặc User ID
    entity_id VARCHAR(50) REFERENCES explorer_entities(id) ON DELETE CASCADE,
    is_unlocked BOOLEAN DEFAULT true,                   -- Đã thu thập vào sổ tay
    stars_earned INT DEFAULT 3,                         -- Số sao đạt được
    discovered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(device_id, entity_id)
);

-- 7. CHỈ MỤC TĂNG TỐC TRUY VẤN (INDEXES)
CREATE INDEX IF NOT EXISTS idx_explorer_scenes_world ON explorer_scenes(world_id);
CREATE INDEX IF NOT EXISTS idx_explorer_entities_scene ON explorer_entities(scene_id);
CREATE INDEX IF NOT EXISTS idx_explorer_quizzes_entity ON explorer_quizzes(entity_id);
CREATE INDEX IF NOT EXISTS idx_explorer_options_quiz ON explorer_quiz_options(quiz_id);
CREATE INDEX IF NOT EXISTS idx_explorer_progress_device ON explorer_user_progress(device_id);

-- 8. KÍCH HOẠT ROW LEVEL SECURITY (RLS)
ALTER TABLE explorer_worlds ENABLE ROW LEVEL SECURITY;
ALTER TABLE explorer_scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE explorer_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE explorer_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE explorer_quiz_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE explorer_user_progress ENABLE ROW LEVEL SECURITY;

-- Cho phép đọc công khai nội dung game
CREATE POLICY "Public read explorer worlds" ON explorer_worlds FOR SELECT USING (true);
CREATE POLICY "Public read explorer scenes" ON explorer_scenes FOR SELECT USING (true);
CREATE POLICY "Public read explorer entities" ON explorer_entities FOR SELECT USING (true);
CREATE POLICY "Public read explorer quizzes" ON explorer_quizzes FOR SELECT USING (true);
CREATE POLICY "Public read explorer options" ON explorer_quiz_options FOR SELECT USING (true);

-- Cho phép đọc và ghi tiến độ của thiết bị
CREATE POLICY "Device progress access" ON explorer_user_progress 
FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- DỮ LIỆU MẪU BAN ĐẦU (SEED DATA ĐA DẠNG: ĐỘNG VẬT & CÂY CỐI)
-- ==============================================================================

-- --- MÀN 1: RỪNG MƯA NHIỆT ĐỚI ---
INSERT INTO explorer_worlds (id, title_vi, title_en, description_vi, theme_color, display_order)
VALUES 
('rainforest', 'Khu Rừng Mưa Nhiệt Đới', 'Tropical Rainforest', 'Nơi có những tán cây khổng lồ và vô vàn bí ẩn sinh thái kỳ diệu.', '#2E7D32', 1),
('savanna', 'Thảo Nguyên Hoang Dã', 'African Savanna', 'Vùng đất của những loài thú khổng lồ và cây bao-báp ngàn năm tuổi.', '#F57C00', 2),
('desert_oasis', 'Sa Mạc & Ốc Đảo', 'Desert & Oasis', 'Nơi các loài sinh vật có tài sinh tồn siêu đẳng dưới cái nắng chói chang.', '#FFA000', 3)
ON CONFLICT (id) DO NOTHING;

-- --- CẢNH 1: BÌA RỪNG ẨM ƯỚT ---
INSERT INTO explorer_scenes (id, world_id, title_vi, bg_image_url, display_order)
VALUES 
('rainforest_scene_1', 'rainforest', 'Thảm Rừng Ẩm Ướt', 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1200&q=80', 1),
('savanna_scene_1', 'savanna', 'Đầm Nước Bình Minh', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80', 1)
ON CONFLICT (id) DO NOTHING;

-- --- THỰC THỂ TƯƠNG TÁC (CÂY & CON VẬT) ---
INSERT INTO explorer_entities (id, scene_id, name_vi, name_en, category, sprite_image_url, pos_x_percent, pos_y_percent, fun_fact_vi)
VALUES 
(
    'pitcher_plant', 
    'rainforest_scene_1', 
    'Cây Nắp Ấm', 
    'Pitcher Plant', 
    'PLANT', 
    'https://cdn-icons-png.flaticon.com/512/628/628283.png', 
    28.00, 
    62.00, 
    'Cây nắp ấm có chiếc bình chứa chất lỏng thơm ngọt để dụ kiến và côn trùng rơi vào bẫy.'
),
(
    'chameleon', 
    'rainforest_scene_1', 
    'Tắc Kè Hoa', 
    'Chameleon', 
    'ANIMAL', 
    'https://cdn-icons-png.flaticon.com/512/3069/3069172.png', 
    68.00, 
    45.00, 
    'Tắc kè hoa có thể đổi màu sắc da để hòa mình vào lá cây xung quanh giúp ngụy trang.'
),
(
    'elephant', 
    'savanna_scene_1', 
    'Chú Voi Khổng Lồ', 
    'Elephant', 
    'ANIMAL', 
    'https://cdn-icons-png.flaticon.com/512/375/375110.png', 
    45.00, 
    55.00, 
    'Chiếc vòi của voi rất đa năng: vừa để uống nước, ngửi mùi từ xa, vừa cầm nắm như bàn tay.'
)
ON CONFLICT (id) DO NOTHING;

-- --- CÁC THỬ THÁCH TƯƠNG TÁC ĐA DẠNG (FEEDING, MAGNIFIER, SILHOUETTE, MCQ) ---
INSERT INTO explorer_quizzes (id, entity_id, interaction_type, interaction_config, question_vi, explanation_vi, points)
VALUES 
(
    'quiz_pitcher_01', 
    'pitcher_plant', 
    'FEEDING',
    '{
        "target_snap_area": {"x": 50, "y": 60, "radius": 40},
        "draggable_items": [
            {"id": "fly", "name": "Chú Ruồi Mắt To", "image": "https://cdn-icons-png.flaticon.com/512/375/375045.png", "is_correct": true},
            {"id": "stone", "name": "Viên Sỏi Nhỏ", "image": "https://cdn-icons-png.flaticon.com/512/2619/2619277.png", "is_correct": false},
            {"id": "leaf", "name": "Mẩu Gỗ Khô", "image": "https://cdn-icons-png.flaticon.com/512/628/628324.png", "is_correct": false}
        ],
        "success_sound": "bite_crunch.mp3",
        "feedback_correct_vi": "Giỏi quá! Cây nắp ấm đậy nắp và măm măm chú ruồi ngon lành!"
    }'::jsonb,
    'Bé MiMi: "Cây nắp ấm đang mở nắp chờ mồi kìa bé ơi! Bé kéo món ăn thích hợp thả vào miệng ấm nhé!"', 
    'Chính xác! Cây dùng chiếc bình trơn trượt có hương thơm để bắt côn trùng bổ sung chất đạm cần thiết.', 
    10
),
(
    'quiz_chameleon_01', 
    'chameleon', 
    'MAGNIFIER',
    '{
        "hidden_target": {"x": 68.0, "y": 45.0, "radius": 50},
        "lens_scale": 2.0,
        "lens_diameter_dp": 130,
        "hint_bubble_vi": "Bé Tom: Anh nghe tiếng lá xào xạc ở phía cành cây bên phải kìa!",
        "unhide_on_hover_ms": 600
    }'::jsonb,
    'Bé Tom: "Bạn Tắc Kè Hoa đang ngụy trang trốn trên cành lá. Bé hãy di chuyển chiếc kính lúp để tìm bạn ấy nào!"', 
    'Hoan hô bé! Bạn ấy đổi màu để ngụy trang hòa vào lá cây giúp kẻ thù không thể phát hiện!', 
    10
),
(
    'quiz_elephant_01', 
    'elephant', 
    'SILHOUETTE',
    '{
        "missing_part_name": "Chiếc Vòi Dài",
        "drop_zone": {"x": 42.0, "y": 58.0, "tolerance": 35},
        "draggable_parts": [
            {"id": "trunk", "image": "elephant_trunk.png", "is_correct": true},
            {"id": "horn", "image": "rhino_horn.png", "is_correct": false},
            {"id": "wing", "image": "bird_wing.png", "is_correct": false}
        ]
    }'::jsonb,
    'Bé MiMi: "Ôi bạn Voi bị thất lạc chiếc vòi thần kỳ rồi! Bé hãy tìm chiếc vòi và gắn lại vào mặt cho bạn Voi nhé!"', 
    'Tuyệt vời! Vòi voi vừa hút nước phun mưa tắm mát, vừa cầm lá cây bỏ vào miệng như một bàn tay khéo léo.', 
    10
)
ON CONFLICT (id) DO NOTHING;

-- --- CÁC PHƯƠNG ÁN BỔ TRỢ CHO CÂU HỎI TRẮC NGHIỆM TRUYỀN THỐNG (NẾU CÓ DÙNG MCQ) ---
INSERT INTO explorer_quiz_options (quiz_id, option_text_vi, is_correct, display_order)
VALUES 
-- Lựa chọn dự phòng cho Cây Nắp Ấm
('quiz_pitcher_01', 'Dùng bình trơn để bẫy côn trùng nhỏ', true, 1),
('quiz_pitcher_01', 'Dùng làm bình chứa nước cho muông thú', false, 2),

-- Lựa chọn dự phòng cho Tắc Kè Hoa
('quiz_chameleon_01', 'Để ngụy trang hòa mình vào cây cối, tránh kẻ thù', true, 1),
('quiz_chameleon_01', 'Để khoe màu áo sặc sỡ với các bạn khác', false, 2),

-- Lựa chọn dự phòng cho Chú Voi
('quiz_elephant_01', 'Hút nước tắm mát và cầm nắm thức ăn như bàn tay', true, 1),
('quiz_elephant_01', 'Dùng làm chiếc kèn thổi nhạc khi đi dạo', false, 2);
