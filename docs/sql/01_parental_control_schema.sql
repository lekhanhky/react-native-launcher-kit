-- ==============================================================================
-- SUPABASE DATABASE SCHEMA: PARENTAL CONTROL & DEVICE LICENSING
-- ==============================================================================

-- 1. ENUM: Trạng thái bản quyền của thiết bị
DO $$ BEGIN
    CREATE TYPE license_status_enum AS ENUM ('pending', 'active', 'expired', 'blocked');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. BẢNG: Quản lý Thiết bị & Khóa Bản quyền (devices)
CREATE TABLE IF NOT EXISTS public.devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT UNIQUE NOT NULL,                  -- Mã Android ID phần cứng duy nhất
    device_name TEXT DEFAULT 'Thiết bị của con',    -- Tên gợi nhớ
    device_model TEXT,                               -- Model thiết bị (VD: Samsung Tab A9)
    license_key TEXT UNIQUE NOT NULL,                -- Mã bản quyền kích hoạt (VD: LCK-XXXX-YYYY)
    license_status license_status_enum DEFAULT 'pending',
    activated_at TIMESTAMP WITH TIME ZONE,
    expired_at TIMESTAMP WITH TIME ZONE,             -- Hạn dùng (NULL = Vĩnh viễn)
    last_sync_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. BẢNG: Chính sách kiểm soát Ứng dụng & Mã PIN Phụ huynh (parental_policies)
CREATE TABLE IF NOT EXISTS public.parental_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT REFERENCES public.devices(device_id) ON DELETE CASCADE UNIQUE,
    policy_mode TEXT DEFAULT 'blacklist' CHECK (policy_mode IN ('whitelist', 'blacklist')),
    package_list JSONB DEFAULT '["com.android.settings", "com.google.android.youtube"]'::jsonb,
    parent_pin TEXT DEFAULT '1234',                  -- Mã PIN phụ huynh (4-6 số)
    is_emergency_locked BOOLEAN DEFAULT false,       -- Nút khóa tức thì từ xa
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. BẢNG: Bộ lập lịch Khung giờ học / Giờ ngủ (time_schedules)
CREATE TABLE IF NOT EXISTS public.time_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT REFERENCES public.devices(device_id) ON DELETE CASCADE UNIQUE,
    is_enabled BOOLEAN DEFAULT true,
    allowed_start_time TIME DEFAULT '07:00:00',
    allowed_end_time TIME DEFAULT '21:00:00',
    days_of_week INT[] DEFAULT '{1,2,3,4,5,6,7}',     -- 1: Thứ 2 -> 7: Chủ Nhật
    lock_message TEXT DEFAULT 'Đã đến giờ đi ngủ hoặc học tập! Bé hãy nghỉ ngơi nhé.',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. BẬT SUPABASE REALTIME ĐỂ ĐỒNG BỘ TỨC THÌ
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.devices;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.parental_policies;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.time_schedules;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 6. TẠO INDEX TĂNG TỐC ĐỘ TRUY VẤN
CREATE INDEX IF NOT EXISTS idx_devices_device_id ON public.devices(device_id);
CREATE INDEX IF NOT EXISTS idx_devices_license_key ON public.devices(license_key);
CREATE INDEX IF NOT EXISTS idx_parental_policies_device_id ON public.parental_policies(device_id);
CREATE INDEX IF NOT EXISTS idx_time_schedules_device_id ON public.time_schedules(device_id);
