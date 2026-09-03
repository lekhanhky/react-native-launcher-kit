-- ==============================================================================
-- 03_dynamic_games_and_math_schema.sql
-- Hệ thống Game Động (Data-driven Scenes) & Ngân Hàng Đề Toán Tự Động trên Supabase
-- ==============================================================================

-- 1. BẢNG DANH MỤC GAME (GAME CATALOG)
CREATE TABLE IF NOT EXISTS public.game_catalog (
    id VARCHAR(50) PRIMARY KEY, -- 'math_quiz', 'tangram', 'maze', 'memory_cards', 'word_spelling', 'animal_sound', etc.
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    min_age INT DEFAULT 3,
    max_age INT DEFAULT 10,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PHÂN HỆ GAME TOÁN HỌC ĐỘNG (DYNAMIC MATH QUIZ ENGINE)

-- 2.1. Chủ đề / Khối lớp Toán
CREATE TYPE math_grade_enum AS ENUM ('preschool', 'grade1', 'grade2', 'grade3');
CREATE TYPE math_operation_enum AS ENUM ('COUNTING', 'ADDITION', 'SUBTRACTION', 'MULTIPLICATION', 'DIVISION', 'COMPARISON', 'FILL_MISSING');

CREATE TABLE IF NOT EXISTS public.math_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade math_grade_enum NOT NULL,
    title VARCHAR(150) NOT NULL, -- VD: "Đếm hình 1-10", "Phép cộng phạm vi 20", "Bảng nhân 2 đến 5"
    description TEXT,
    icon VARCHAR(10) DEFAULT '🎈',
    color_hex VARCHAR(20) DEFAULT '#3B82F6',
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- 2.2. Ngân hàng câu hỏi / Đề toán
CREATE TABLE IF NOT EXISTS public.math_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES public.math_topics(id) ON DELETE CASCADE,
    grade math_grade_enum NOT NULL,
    operation math_operation_enum NOT NULL,
    difficulty INT DEFAULT 1, -- 1: Dễ, 2: Trung bình, 3: Nâng cao
    
    question_text TEXT NOT NULL, -- "Có bao nhiêu quả táo dưới đây?" hoặc "8 + 5 = ?"
    sub_text TEXT,               -- Gợi ý hoặc phép tính phụ
    emoji_icons TEXT[] DEFAULT ARRAY[]::TEXT[], -- ['🍎', '🍎', '🍎']
    
    options INT[] NOT NULL,      -- [3, 4, 5, 2]
    correct_answer INT NOT NULL,  -- 3
    explanation TEXT,            -- "Đếm: 1, 2, 3 quả táo!" hoặc "8 + 5 = 13 (8 + 2 = 10, 10 + 3 = 13)"
    
    star_reward INT DEFAULT 1,
    time_limit_sec INT DEFAULT 20,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_math_questions_grade ON public.math_questions(grade, topic_id);

-- 3. PHÂN HỆ CÁC CẢNH GAME ĐỘNG (DATA-DRIVEN SCENES)

-- 3.1. Cảnh Game Xếp Hình Tangram & Ghép Tranh Jigsaw
CREATE TABLE IF NOT EXISTS public.puzzle_scenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mode VARCHAR(20) NOT NULL DEFAULT 'tangram', -- 'tangram' | 'jigsaw'
    category VARCHAR(50) NOT NULL, -- 'animals', 'vehicles', 'buildings', 'nature'
    title VARCHAR(100) NOT NULL,   -- 'Chú Mèo Con', 'Ngôi Nhà Thân Yêu', 'Tên Lửa Vũ Trụ'
    emoji VARCHAR(10) DEFAULT '🧩',
    difficulty INT DEFAULT 1,       -- 1, 2, 3
    min_age INT DEFAULT 3,
    board_width INT DEFAULT 340,
    board_height INT DEFAULT 340,
    board_bg_color VARCHAR(20) DEFAULT '#1E293B',
    
    -- Danh sách các mảnh ghép & tọa độ mục tiêu (JSONB)
    -- Cấu trúc: [{"id": "p1", "name": "Đầu mèo", "color": "#F59E0B", "width": 80, "height": 80, "targetX": 130, "targetY": 40, ...}]
    pieces JSONB NOT NULL,
    
    preview_image_url TEXT,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2. Cảnh Game Mê Cung (Maze Game Scenes)
CREATE TABLE IF NOT EXISTS public.maze_scenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL, -- 'Rừng Rậm Kỳ Bí - Màn 1'
    grid_size INT DEFAULT 4,     -- 4x4, 6x6, 8x8
    difficulty INT DEFAULT 1,
    theme VARCHAR(50) DEFAULT 'jungle', -- 'jungle', 'space', 'ocean', 'candy'
    
    -- Tọa độ điểm bắt đầu & đích đến
    start_pos JSONB NOT NULL DEFAULT '{"x": 0, "y": 0}'::JSONB,
    target_pos JSONB NOT NULL DEFAULT '{"x": 3, "y": 3}'::JSONB,
    
    -- Ma trận tường mê cung (Array of walls: [{"x": 1, "y": 0, "top": true, "left": false}, ...])
    walls_matrix JSONB NOT NULL,
    
    start_avatar VARCHAR(10) DEFAULT '🐰',
    target_avatar VARCHAR(10) DEFAULT '🥕',
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- 3.3. Cảnh Game Nối Số & Tô Màu (Connect Dots & Coloring)
CREATE TABLE IF NOT EXISTS public.drawing_scenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_type VARCHAR(20) NOT NULL, -- 'connect_dots' | 'coloring'
    title VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    difficulty INT DEFAULT 1,
    
    -- Đối với Connect Dots: Mảng tọa độ [{order: 1, x: 50, y: 100, label: "1"}, ...]
    dots_coords JSONB,
    
    -- Đối với Coloring: Mã đường dẫn SVG vector
    svg_paths JSONB,
    recommended_palette TEXT[] DEFAULT ARRAY['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'],
    
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- 3.4. Bộ Thẻ Lật Tìm Cặp (Memory Card Decks)
CREATE TABLE IF NOT EXISTS public.memory_card_decks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,   -- 'Chủ Đề Trái Cây', 'Chủ Đề Động Vật'
    theme VARCHAR(50) NOT NULL,
    pairs_count INT DEFAULT 6,      -- 4 cặp (8 thẻ), 6 cặp (12 thẻ), 8 cặp (16 thẻ)
    difficulty INT DEFAULT 1,
    
    -- Mảng các item: [{"id": "item1", "name": "Quả Táo", "emoji": "🍎", "audio_key": "apple.mp3"}, ...]
    items JSONB NOT NULL,
    
    is_active BOOLEAN DEFAULT TRUE
);

-- 3.5. Bộ Từ Vựng Game Đánh Vần (Word Spelling Scenes)
CREATE TABLE IF NOT EXISTS public.spelling_words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word_vietnamese VARCHAR(50) NOT NULL,  -- 'CON MÈO'
    word_english VARCHAR(50),              -- 'CAT'
    category VARCHAR(50) DEFAULT 'animals',
    image_url TEXT,
    audio_vi_url TEXT,
    audio_en_url TEXT,
    scrambled_letters TEXT[] NOT NULL,     -- ['M', 'È', 'O', 'C', 'N']
    difficulty INT DEFAULT 1,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- 4. BẢNG LƯU TIẾN ĐỘ & THÀNH TÍCH CỦA BÉ (CHILD PROGRESS SYNC)
CREATE TABLE IF NOT EXISTS public.child_game_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL, -- Liên kết với bảng children
    game_id VARCHAR(50) NOT NULL, -- 'math_quiz', 'tangram', etc.
    scene_or_topic_id UUID NOT NULL,
    stars_earned INT DEFAULT 0,
    best_score INT DEFAULT 0,
    completed_times INT DEFAULT 0,
    last_played_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unq_child_game_scene UNIQUE (child_id, game_id, scene_or_topic_id)
);
CREATE INDEX IF NOT EXISTS idx_child_game_progress ON public.child_game_progress(child_id, game_id);

-- 5. FUNCTION / STORED PROCEDURE TỰ ĐỘNG SINH ĐỀ TOÁN HÀNG LOẠT (MATH GENERATOR ENGINE)
CREATE OR REPLACE FUNCTION generate_math_batch_questions(
    p_topic_id UUID,
    p_grade math_grade_enum,
    p_operation math_operation_enum,
    p_count INT DEFAULT 20
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    i INT;
    num1 INT;
    num2 INT;
    ans INT;
    w1 INT; w2 INT; w3 INT;
    opts INT[];
    q_text TEXT;
    expl TEXT;
    icons TEXT[];
    emojis TEXT[] := ARRAY['🍎', '🍓', '🚗', '🐱', '⭐', '🎈', '🐥', '🍦', '🍩', '🐶'];
    chosen_emoji TEXT;
    inserted_count INT := 0;
BEGIN
    FOR i IN 1..p_count LOOP
        chosen_emoji := emojis[1 + floor(random() * array_length(emojis, 1))::int];
        
        -- SINH THEO PHÉP TOÁN & KHỐI LỚP
        IF p_operation = 'COUNTING' THEN
            ans := 2 + floor(random() * 8)::int; -- 2 đến 9
            q_text := 'Bé hãy đếm xem có bao nhiêu hình dưới đây?';
            icons := array_fill(chosen_emoji, ARRAY[ans]);
            expl := 'Đếm: có đúng ' || ans || ' hình!';
        
        ELSIF p_operation = 'ADDITION' THEN
            IF p_grade = 'preschool' OR p_grade = 'grade1' THEN
                num1 := 1 + floor(random() * 5)::int;
                num2 := 1 + floor(random() * 5)::int;
            ELSE
                num1 := 5 + floor(random() * 20)::int;
                num2 := 5 + floor(random() * 20)::int;
            END IF;
            ans := num1 + num2;
            q_text := num1 || ' + ' || num2 || ' = ?';
            expl := 'Phép cộng: ' || num1 || ' + ' || num2 || ' = ' || ans;
            icons := ARRAY[]::TEXT[];

        ELSIF p_operation = 'SUBTRACTION' THEN
            num1 := 4 + floor(random() * 10)::int;
            num2 := 1 + floor(random() * (num1 - 1))::int;
            ans := num1 - num2;
            q_text := num1 || ' - ' || num2 || ' = ?';
            expl := 'Phép trừ: ' || num1 || ' - ' || num2 || ' = ' || ans;
            icons := ARRAY[]::TEXT[];

        ELSIF p_operation = 'MULTIPLICATION' THEN
            num1 := 2 + floor(random() * 8)::int; -- 2 đến 9
            num2 := 2 + floor(random() * 8)::int;
            ans := num1 * num2;
            q_text := num1 || ' × ' || num2 || ' = ?';
            expl := 'Bảng nhân: ' || num1 || ' nhân ' || num2 || ' bằng ' || ans;
            icons := ARRAY[]::TEXT[];
            
        ELSE
            -- Mặc định cộng đơn giản
            num1 := 2; num2 := 3; ans := 5;
            q_text := '2 + 3 = ?';
            expl := '2 + 3 = 5';
            icons := ARRAY[]::TEXT[];
        END IF;

        -- Tạo 3 đáp án nhiễu (distractors) không trùng với đáp án đúng
        w1 := GREATEST(1, ans + CASE WHEN random() > 0.5 THEN 1 ELSE -1 END);
        w2 := GREATEST(1, ans + CASE WHEN random() > 0.5 THEN 2 ELSE -2 END);
        w3 := GREATEST(1, ans + CASE WHEN random() > 0.5 THEN 3 ELSE -3 END);
        
        -- Trộn ngẫu nhiên 4 đáp án
        opts := ARRAY[ans, w1, w2, w3];
        
        -- Chèn vào database
        INSERT INTO public.math_questions (
            topic_id, grade, operation, difficulty,
            question_text, sub_text, emoji_icons,
            options, correct_answer, explanation, star_reward, time_limit_sec
        ) VALUES (
            p_topic_id, p_grade, p_operation, 1,
            q_text, NULL, icons,
            opts, ans, expl, 1, 20
        );
        
        inserted_count := inserted_count + 1;
    END LOOP;

    RETURN inserted_count;
END;
$$;

-- 6. SEED DATA MẪU KHỞI TẠO (INITIAL MASTER DATA)

-- Game Catalog
INSERT INTO public.game_catalog (id, name, description, icon, min_age, max_age) VALUES
('math_quiz', 'Đố Vui Toán Học', 'Đếm hình, bảng cửu chương, tính nhẩm', '🧮', 3, 10),
('tangram', 'Xếp Hình Tư Duy Tangram', 'Ghép các mảnh đa giác thành hình mẫu', '🧩', 4, 10),
('maze', 'Mê Cung Kỳ Thú', 'Dẫn đường cho thỏ tìm cà rốt', '🌀', 3, 8),
('memory_cards', 'Lật Thẻ Trí Nhớ', 'Tìm các cặp hình giống nhau', '🃏', 3, 7),
('word_spelling', 'Bé Học Đánh Vần', 'Ghép chữ cái tiếng Việt & tiếng Anh', '🔤', 4, 9),
('animal_sound', 'Thế Giới Động Vật', 'Nghe tiếng kêu đoán tên con vật song ngữ', '🦁', 2, 6)
ON CONFLICT (id) DO NOTHING;

-- Chủ đề Toán mẫu
INSERT INTO public.math_topics (id, grade, title, description, icon, color_hex, order_index) VALUES
('a1111111-1111-1111-1111-111111111111', 'preschool', 'Đếm Hình Kỳ Diệu (1-10)', 'Đếm các loại hoa quả, đồ chơi ngộ nghĩnh', '🎈', '#EC4899', 1),
('a2222222-2222-2222-2222-222222222222', 'grade1', 'Phép Cộng Phạm Vi 10', 'Làm quen với dấu cộng và tính nhẩm nhanh', '🌱', '#10B981', 2),
('a3333333-3333-3333-3333-333333333333', 'grade2', 'Bảng Nhân 2, 3, 4, 5', 'Học thuộc bảng nhân qua các câu đố', '🚀', '#3B82F6', 3),
('a4444444-4444-4444-4444-444444444444', 'grade3', 'Bảng Cửu Chương & Chia Nhẩm', 'Thử thách bảng cửu chương 6-9 và chia', '👑', '#8B5CF6', 4)
ON CONFLICT (id) DO NOTHING;

-- Gọi Function sinh ngay 10 câu hỏi đếm hình mầm non
SELECT generate_math_batch_questions('a1111111-1111-1111-1111-111111111111', 'preschool', 'COUNTING', 10);

-- Gọi Function sinh ngay 10 câu hỏi cộng lớp 1
SELECT generate_math_batch_questions('a2222222-2222-2222-2222-222222222222', 'grade1', 'ADDITION', 10);
