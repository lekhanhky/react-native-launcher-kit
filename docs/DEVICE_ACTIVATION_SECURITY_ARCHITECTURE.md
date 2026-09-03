# KIẾN TRÚC HỆ THỐNG KÍCH HOẠT THIẾT BỊ BẢO MẬT & QUẢN TRỊ CẤU HÌNH THEO TỪNG THIẾT BỊ
*(Multi-Tenant Device Activation, Cryptographic Pairing & Per-Device Management Architecture)*

---

## 1. TỔNG QUAN HỆ THỐNG (SYSTEM OVERVIEW)

Hệ thống được thiết kế theo mô hình **Multi-Tenant (Đa Khách Hàng) với khả năng cô lập dữ liệu tuyệt đối**, cho phép:
1. Mỗi **Customer (Phụ Huynh / Cha Mẹ)** sở hữu một tài khoản độc lập, quản lý danh sách các con (**Kids Profiles**).
2. Phụ huynh có thể ghép nối và kích hoạt **nhiều thiết bị khác nhau** (máy tính bảng / điện thoại của từng bé) thông qua mã OTP 6 số bảo mật ngắn hạn hoặc mã QR.
3. Trên giao diện **Customer Web Dashboard**, phụ huynh có thể chuyển đổi giữa các thiết bị và **thiết lập chi tiết chương trình cho từng thiết bị**:
   - Giờ chơi hàng ngày (Daily Screen Time Limit) & Giờ giới nghiêm ban đêm (Bedtime Schedule).
   - Danh sách ứng dụng được phép mở (App Allowlist) và các app bị cấm tuyệt đối (Blacklist).
   - Nội dung học tập được duyệt riêng cho máy đó (Cấp độ Toán học, Kênh YouTube Kids được duyệt, Bộ âm thanh con vật).
   - Các lệnh điều khiển khẩn cấp thời gian thực: Khóa máy ngay lập tức, Đồng bộ cấu hình mới, Hủy liên kết máy.

---

## 2. NGUYÊN TẮC BẢO MẬT CỐT LÕI (SECURITY ARCHITECTURE)

| Tiêu Chí | Giải Pháp Triển Khai | Lợi Ích Bảo Mật |
| :--- | :--- | :--- |
| **Cô Lập Khách Hàng (Multi-Tenancy)** | Row Level Security (RLS) trên PostgreSQL | Đảm bảo phụ huynh A tuyệt đối không thể đọc hoặc chỉnh sửa dữ liệu/thiết bị của phụ huynh B ở tầng cơ sở dữ liệu. |
| **Mã Kích Hoạt OTP** | Sinh mã ngẫu nhiên 6 chữ số (`000000 - 999999`), băm `SHA-256`, hạn dùng **15 phút**, dùng 1 lần duy nhất | Chống nghe lén, chống sử dụng lại mã cũ (Replay Attack). |
| **Chống Dò Mã (Anti-Brute Force)** | Rate Limiting: Tối đa 5 lần nhập sai liên tiếp trong 15 phút | Ngăn chặn các cuộc tấn công dò mã tự động. |
| **Định Danh Thiết Bị** | Mỗi thiết bị được cấp cặp `device_id` và `device_secret_token` (JWT ký HMAC-SHA256) | Xác thực danh tính độc lập từng máy khi gọi API lấy cấu hình và gửi log. |
| **Lưu Trữ An Toàn Trên Máy** | Android `EncryptedSharedPreferences` / `KeyStore` | Token và mã PIN phụ huynh không bị lộ ngay cả khi thiết bị rơi vào tay người khác. |
| **Chế Độ Hoạt Động Cục Bộ (Offline Policy Engine)** | Tablet cache toàn bộ chính sách và tự động đếm giờ, khóa máy | Máy tính bảng của bé vẫn tuân thủ giờ giới nghiêm ngay cả khi tắt Wi-Fi hoặc mất mạng Internet. |

---

## 3. THIẾT KẾ CƠ SỞ DỮ LIỆU HOÀN CHỈNH (DATABASE SCHEMA & RLS POLICIES)

### 3.1. DDL Script Tạo Bảng (PostgreSQL / Supabase SQL)

```sql
-- 1. BẢNG KHÁCH HÀNG / PHỤ HUYNH (CUSTOMERS)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    parental_pin_hash TEXT NOT NULL DEFAULT '1234', -- Mã PIN bảo vệ cài đặt
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG HỒ SƠ TỪNG BÉ (KIDS_PROFILES)
CREATE TABLE IF NOT EXISTS public.kids_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    child_name TEXT NOT NULL,
    birth_date DATE,
    age INT NOT NULL DEFAULT 5,
    gender TEXT CHECK (gender IN ('BOY', 'GIRL', 'OTHER')),
    avatar_url TEXT DEFAULT '👦',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG THIẾT BỊ ĐÃ GHÉP NỐI (DEVICES)
CREATE TABLE IF NOT EXISTS public.devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kid_profile_id UUID NOT NULL REFERENCES public.kids_profiles(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    device_name TEXT NOT NULL,              -- VD: 'Samsung Galaxy Tab A9 của Bảo'
    device_model TEXT NOT NULL,             -- VD: 'SM-X110'
    android_version TEXT,                   -- VD: 'Android 14'
    device_serial_hash TEXT UNIQUE,         -- Băm duy nhất phần cứng
    device_secret_token TEXT NOT NULL,      -- Secret Key để authenticate API
    fcm_token TEXT,                         -- Token nhận Push Notification Realtime
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PENDING_PAIR', 'LOCKED', 'REVOKED')),
    last_online_at TIMESTAMPTZ,
    battery_level INT DEFAULT 100,
    current_app_package TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BẢNG MÃ KÍCH HOẠT / GHÉP NỐI THIẾT BỊ (ACTIVATION_CODES)
CREATE TABLE IF NOT EXISTS public.activation_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    kid_profile_id UUID NOT NULL REFERENCES public.kids_profiles(id) ON DELETE CASCADE,
    code_hash TEXT NOT NULL,                -- Mã 6 chữ số được băm SHA-256
    attempts_count INT DEFAULT 0,           -- Số lần nhập sai (max 5)
    is_used BOOLEAN DEFAULT FALSE,          -- Trạng thái đã sử dụng
    expires_at TIMESTAMPTZ NOT NULL,        -- Hạn sử dụng: 15 phút
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BẢNG CẤU HÌNH CHI TIẾT TỪNG THIẾT BỊ (DEVICE_CONFIGS)
CREATE TABLE IF NOT EXISTS public.device_configs (
    device_id UUID PRIMARY KEY REFERENCES public.devices(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    -- Giới hạn thời gian tổng trong ngày (Screen Time)
    daily_limit_minutes INT NOT NULL DEFAULT 120,   -- Mặc định 2 giờ
    -- Giờ giới nghiêm ban đêm (Bedtime)
    bedtime_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    bedtime_start TIME NOT NULL DEFAULT '21:00:00',
    bedtime_end TIME NOT NULL DEFAULT '06:30:00',
    -- Lệnh khẩn cấp từ xa
    is_locked_instant BOOLEAN NOT NULL DEFAULT FALSE,
    lock_message TEXT DEFAULT 'Đã hết giờ chơi hôm nay! Ba mẹ hẹn con ngày mai nhé ❤️',
    -- Bảo vệ phần cứng & mắt bé
    blue_light_filter_enabled BOOLEAN DEFAULT TRUE,
    max_audio_volume INT DEFAULT 75,                -- Giới hạn âm lượng 75%
    auto_lock_on_timeout BOOLEAN DEFAULT TRUE,
    -- Mã PIN phụ huynh riêng cho thiết bị
    custom_pin_override TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BẢNG QUY ĐỊNH ỨNG DỤNG CHO TỪNG THIẾT BỊ (DEVICE_APP_RULES)
CREATE TABLE IF NOT EXISTS public.device_app_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    package_name TEXT NOT NULL,                     -- VD: 'com.google.android.apps.youtube.kids'
    app_name TEXT NOT NULL,
    category TEXT DEFAULT 'Giáo dục',
    is_allowed BOOLEAN NOT NULL DEFAULT TRUE,       -- Cho phép mở hay Cấm tuyệt đối
    max_minutes_per_day INT DEFAULT 60,             -- Giới hạn riêng cho app này (phút)
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(device_id, package_name)
);

-- 7. BẢNG QUY ĐỊNH NỘI DUNG GIÁO DỤC TỪNG THIẾT BỊ (DEVICE_CONTENT_RULES)
CREATE TABLE IF NOT EXISTS public.device_content_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    rule_type TEXT NOT NULL CHECK (rule_type IN ('YOUTUBE_CHANNEL', 'MATH_GRADE_LEVEL', 'ANIMAL_CATEGORY')),
    target_value TEXT NOT NULL,                     -- VD: 'KenhTiengAnhTreEm', 'GRADE_1', 'Vật Nuôi'
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. BẢNG NHẬT KÝ SỬ DỤNG (DEVICE_USAGE_LOGS)
CREATE TABLE IF NOT EXISTS public.device_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    package_name TEXT NOT NULL,
    app_name TEXT NOT NULL,
    duration_seconds INT NOT NULL DEFAULT 0,
    session_start TIMESTAMPTZ NOT NULL,
    session_end TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.2. Cấu Hình Row Level Security (RLS) Phân Quyền Bảo Mật

```sql
-- Bật RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kids_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_app_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_content_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_usage_logs ENABLE ROW LEVEL SECURITY;

-- 1. Phụ huynh chỉ được xem/sửa hồ sơ con của mình
CREATE POLICY "Customers can manage their own kids" 
ON public.kids_profiles FOR ALL 
USING (auth.uid() = customer_id);

-- 2. Phụ huynh chỉ được xem/sửa các thiết bị thuộc quyền quản lý của mình
CREATE POLICY "Customers can manage their own devices" 
ON public.devices FOR ALL 
USING (auth.uid() = customer_id);

-- 3. Phụ huynh chỉ được cấu hình thiết bị của mình
CREATE POLICY "Customers can update their own device configs" 
ON public.device_configs FOR ALL 
USING (auth.uid() = customer_id);

-- 4. Phụ huynh chỉ được quản lý App Rules của thiết bị mình
CREATE POLICY "Customers can manage app rules" 
ON public.device_app_rules FOR ALL 
USING (device_id IN (SELECT id FROM public.devices WHERE customer_id = auth.uid()));
```

---

## 4. QUY TRÌNH KÍCH HOẠT THIẾT BỊ CHI TIẾT (ACTIVATION & PAIRING FLOW)

1. **Phụ huynh trên Web Dashboard**:
   - Chọn hồ sơ bé (VD: Bé Gia Bảo).
   - Nhấn **"Ghép Nối Thiết Bị Mới"** $\rightarrow$ Hệ thống sinh mã OTP 6 số (VD: `849201`) có hạn 15 phút.
2. **Trên Máy Tính Bảng Bé (Launcher App)**:
   - Mở màn hình Cài đặt Phụ Huynh $\rightarrow$ Nhập mã 6 số `849201`.
   - App gửi request `POST /api/v1/device/pair`.
3. **Cloud API Gateway**:
   - Xác thực mã băm, kiểm tra hạn dùng, kiểm tra số lần sai.
   - Nếu hợp lệ: Cấp phát `device_id` & `device_secret_token` kèm cấu hình ban đầu.
4. **Thiết Bị Lưu Trữ & Đồng Bộ**:
   - Lưu an toàn `device_secret_token` vào Android KeyStore.
   - Bắt đầu chu kỳ gửi Heartbeat định kỳ 60s/lần.
   - Giao diện Dashboard của phụ huynh lập tức cập nhật trạng thái "🟢 Đang Online - 86% Pin".

---

## 5. THIẾT KẾ GIAO DIỆN QUẢN TRỊ THEO TỪNG THIẾT BỊ (DASHBOARD UI LAYOUT)

Khi phụ huynh truy cập vào **Dashboard**, trên đầu trang sẽ có thanh chọn thiết bị (**Device Selector Dropdown**):

```
+-----------------------------------------------------------------------------------+
|  [📱 Bé Gia Bảo - Galaxy Tab A9 v]   [Trạng Thái: 🟢 Online - 86% Pin]           |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [⚡ KHÓA MÁY KHẨN CẤP]          [⏰ ĐỒNG BỘ CONFIG MỚI]      [🗑️ HỦY LIÊN KẾT]   |
|                                                                                   |
|  Tab 1: 🕒 GIỚI HẠN THỜI GIAN & GIỜ NGỦ                                          |
|  - Tổng thời gian chơi mỗi ngày: [ Slider: 2 giờ 00 phút (120 min) ]              |
|  - Khóa giờ đi ngủ: [ BẬT ]                                                      |
|    + Bắt đầu khóa lúc: [ 21:00 ] tối                                              |
|    + Mở khóa lại lúc:  [ 06:30 ] sáng                                             |
|                                                                                   |
|  Tab 2: 🛡️ QUẢN LÝ TỪNG ỨNG DỤNG (APP ALLOWLIST & LIMITS)                         |
|  +-----------------------------------------------------------------------------+  |
|  | Ứng Dụng                     | Thể Loại    | Giới Hạn / Ngày | Quyền Mở     |  |
|  +------------------------------+-------------+-----------------+--------------+  |
|  | 🧮 Bé Vui Học Toán           | Giáo dục    | 60 phút         | [✅ Cho phép] |  |
|  | 📺 Kids YouTube An Toàn      | Giải trí    | 30 phút         | [✅ Cho phép] |  |
|  | 🎨 Tô Màu Sáng Tạo           | Sáng tạo    | 45 phút         | [✅ Cho phép] |  |
|  | 🌐 Google Chrome             | Trình duyệt | 0 phút          | [⛔ CẤM TUYỆT ĐỐI]|
|  | ⚙️ Cài Đặt Hệ Thống Android | Hệ thống    | 0 phút          | [⛔ CẤM TUYỆT ĐỐI]|
|  +-----------------------------------------------------------------------------+  |
|                                                                                   |
|  Tab 3: 📚 NỘI DUNG HỌC TẬP ĐƯỢC DUYỆT TRÊN MÁY NÀY                              |
|  - Trình độ Toán Học: [ Lớp 1 - Phép Cộng Trừ Phạm Vi 20 v ]                     |
|  - Danh mục Âm thanh Con Vật: [ x Vật Nuôi ] [ x Động Vật Hoang Dã ]              |
|  - Danh sách Kênh YouTube: [ x Tiếng Anh Mầm Non ] [ x Khám Phá Khoa Học Nhí ]    |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

## 6. ĐẶC TẢ CHI TIẾT CÁC ENDPOINT API (RESTFUL API SPECIFICATION)

### 6.1. Endpoint Kích Hoạt Thiết Bị (`POST /api/v1/device/pair`)
- **Request Body**:
```json
{
  "pairing_code": "849201",
  "device_name": "Samsung Galaxy Tab A9 của Bảo",
  "device_model": "SM-X110",
  "android_version": "Android 14",
  "hardware_serial": "R52N10ABCDE",
  "fcm_token": "fcm_token_sample_string_12345"
}
```
- **Response Body (200 OK)**:
```json
{
  "success": true,
  "message": "Ghép nối và kích hoạt thiết bị thành công!",
  "data": {
    "device_id": "8c4244b7-9599-4d6c-8430-67c4613271bc",
    "device_secret_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "child_info": {
      "name": "Bé Gia Bảo",
      "age": 6,
      "avatar": "👦"
    },
    "config": {
      "daily_limit_minutes": 120,
      "bedtime_enabled": true,
      "bedtime_start": "21:00",
      "bedtime_end": "06:30",
      "is_locked_instant": false,
      "lock_message": "Đã hết giờ chơi hôm nay!",
      "blocked_packages": [
        "com.android.chrome",
        "com.android.settings",
        "com.facebook.katana",
        "com.zhiliaoapp.musically"
      ],
      "allowed_apps": [
        { "package": "com.duolingo.abc", "name": "Duolingo ABC", "max_minutes": 45 },
        { "package": "com.google.android.apps.youtube.kids", "name": "YouTube Kids", "max_minutes": 30 }
      ]
    }
  }
}
```

### 6.2. Endpoint Lấy Cấu Hình Cập Nhật (`GET /api/v1/device/config`)
- **Headers**:
  - `Authorization: Bearer <device_secret_token>`
  - `X-Device-ID: 8c4244b7-9599-4d6c-8430-67c4613271bc`
- **Response**: Trả về toàn bộ `device_configs`, `device_app_rules` và `device_content_rules` mới nhất.

### 6.3. Endpoint Gửi Heartbeat Online (`POST /api/v1/device/heartbeat`)
- **Headers**: `Authorization: Bearer <device_secret_token>`
- **Request Body**:
```json
{
  "battery_level": 86,
  "is_charging": true,
  "screen_on": true,
  "current_package": "com.duolingo.abc",
  "today_used_minutes": 45
}
```
