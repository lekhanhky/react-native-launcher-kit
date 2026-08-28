-- ==============================================================================
-- SUPABASE DATABASE SCHEMA: YOUTUBE WHITELIST & KIDS CONTENT MANAGEMENT
-- ==============================================================================

-- 1. ENUM: Thể loại nội dung và Loại danh mục
DO $$ BEGIN
    CREATE TYPE youtube_item_type_enum AS ENUM ('channel', 'playlist');
    CREATE TYPE content_category_enum AS ENUM ('music', 'english', 'cartoon', 'story', 'science', 'general');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. BẢNG: Danh mục Kênh & Playlist YouTube được kiểm duyệt (youtube_catalogs)
-- Lưu danh sách kênh/playlist chuẩn của hệ thống hoặc kênh tùy chỉnh do phụ huynh thêm
CREATE TABLE IF NOT EXISTS public.youtube_catalogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    youtube_id TEXT UNIQUE NOT NULL,                 -- YouTube Channel ID (UCxxx) hoặc Playlist ID (PLxxx)
    item_type youtube_item_type_enum DEFAULT 'channel',
    title TEXT NOT NULL,                             -- Tên Kênh hoặc Tên Playlist
    description TEXT,                                -- Mô tả nội dung
    avatar_url TEXT,                                 -- Link ảnh đại diện/thumbnail
    banner_url TEXT,                                 -- Link ảnh bìa
    category content_category_enum DEFAULT 'cartoon',
    emoji TEXT DEFAULT '🎬',
    theme_color TEXT DEFAULT '#4F46E5',
    subscribers_count TEXT,                          -- VD: '1.2M người đăng ký'
    video_count INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT true,                -- Đã qua kiểm duyệt nội dung an toàn
    is_system_preset BOOLEAN DEFAULT false,          -- Kênh mặc định sẵn của hệ thống
    created_by_device TEXT,                          -- Device ID đã thêm kênh này (nếu là custom)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. BẢNG: Danh sách Video được kiểm duyệt trong Kênh/Playlist (youtube_videos)
CREATE TABLE IF NOT EXISTS public.youtube_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id TEXT UNIQUE NOT NULL,                   -- YouTube Video ID (11 ký tự)
    catalog_youtube_id TEXT REFERENCES public.youtube_catalogs(youtube_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT NOT NULL,
    duration TEXT,                                   -- VD: '04:15'
    duration_seconds INT DEFAULT 0,
    views_count TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    category content_category_enum DEFAULT 'cartoon',
    is_safe BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. BẢNG: Cấu hình YouTube cho từng Thiết bị (device_youtube_settings)
CREATE TABLE IF NOT EXISTS public.device_youtube_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT REFERENCES public.devices(device_id) ON DELETE CASCADE UNIQUE,
    is_youtube_enabled BOOLEAN DEFAULT true,         -- Bật/tắt hoàn toàn tính năng YouTube cho bé
    allowed_catalog_ids TEXT[] DEFAULT '{}',         -- Danh sách youtube_id (Channel/Playlist) được phép xem
    daily_limit_minutes INT DEFAULT 60,              -- Giới hạn thời gian xem mỗi ngày (phút)
    allow_search BOOLEAN DEFAULT false,              -- Cho phép tìm kiếm (chỉ trong kênh whitelist)
    allow_autoplay BOOLEAN DEFAULT true,             -- Tự động chuyển bài tiếp theo trong whitelist
    max_video_duration_minutes INT DEFAULT 30,       -- Giới hạn độ dài video tối đa
    emergency_lock_youtube BOOLEAN DEFAULT false,    -- Khóa YouTube ngay lập tức từ xa
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. BẢNG: Nhật ký Thời lượng & Lịch sử Xem Video của Bé (device_youtube_watch_logs)
CREATE TABLE IF NOT EXISTS public.device_youtube_watch_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT REFERENCES public.devices(device_id) ON DELETE CASCADE,
    video_id TEXT NOT NULL,
    video_title TEXT,
    channel_title TEXT,
    watched_seconds INT DEFAULT 0,
    watched_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. BẬT SUPABASE REALTIME ĐỂ ĐỒNG BỘ TỨC THÌ
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.youtube_catalogs;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.youtube_videos;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.device_youtube_settings;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 7. TẠO INDEX TĂNG TỐC ĐỘ TRUY VẤN
CREATE INDEX IF NOT EXISTS idx_youtube_catalogs_youtube_id ON public.youtube_catalogs(youtube_id);
CREATE INDEX IF NOT EXISTS idx_youtube_catalogs_category ON public.youtube_catalogs(category);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_catalog_id ON public.youtube_videos(catalog_youtube_id);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_video_id ON public.youtube_videos(video_id);
CREATE INDEX IF NOT EXISTS idx_device_youtube_settings_device_id ON public.device_youtube_settings(device_id);
CREATE INDEX IF NOT EXISTS idx_device_youtube_watch_logs_device_date ON public.device_youtube_watch_logs(device_id, watched_date);
