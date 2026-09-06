# ĐẶC TẢ KIẾN TRÚC & HƯỚNG DẪN: KHÓA THIẾT BỊ TỪ XA THỜI GIAN THỰC (REALTIME REMOTE LOCK)

> **Dự án:** React Native Launcher Kit - Safe Kids Mode  
> **Tính năng:** Khóa khẩn cấp tức thì từ xa (Instant Remote Lock)  
> **Độ trễ:** < 1.0 giây (Realtime qua Supabase WebSocket)  
> **Tài liệu tham chiếu:** `01_parental_control_schema.sql`, `NEXTJS_PORTAL_ARCHITECTURE_AND_SPEC.md`

---

## 1. TỔNG QUAN & MỤC TIÊU
Khi phụ huynh đang ở cơ quan hoặc ở phòng khác, phụ huynh có thể mở **App Phụ Huynh / Web Portal** và gạt nút **"Khóa Khẩn Cấp (Instant Lock)"**. Ngay lập tức:
* Máy tính bảng của bé nhận tín hiệu qua kênh WebSocket trong vòng **dưới 1 giây**.
* Ứng dụng Kids Launcher lập tức bung màn hình khóa [LockOverlay.tsx](file:///c:/react-native-launcher-kit/example/src/components/LockOverlay.tsx) đè kín toàn bộ màn hình.
* Toàn bộ thao tác chạm, bấm phím Home, Back, hoặc cố gắng mở Cài đặt đều bị vô hiệu hóa hoàn toàn.
* Màn hình hiển thị lời nhắn nhủ yêu thương: *"Đã đến giờ ăn cơm / nghỉ ngơi rồi con yêu!"*.

---

## 2. KIẾN TRÚC GIAO TIẾP THỜI GIAN THỰC (REALTIME PROTOCOL)

```mermaid
sequenceDiagram
    autonumber
    actor Parent as 👨‍👩‍👧 Phụ Huynh (App / Web)
    participant SB as ☁️ Supabase Cloud (PostgreSQL + Realtime)
    participant WS as ⚡ WebSocket Channel (Phoenix Protocol)
    participant Kid as 📱 Máy Tính Bảng Của Bé (Kids Launcher)

    Note over Parent,Kid: GIAI ĐOẠN 1: KHỞI TẠO KẾT NỐI REALTIME NGẦM
    Kid->>SB: 1. Đăng ký nhận dạng thiết bị (DeviceId: ANDR-XXXX)
    Kid->>WS: 2. Mở kết nối WebSocket (wss://.../realtime/v1/websocket)
    WS-->>Kid: 3. Kết nối thành công & duy trì Heartbeat ngầm

    Note over Parent,Kid: GIAI ĐOẠN 2: PHỤ HUYNH BẤM KHÓA MÁY TỪ XA
    Parent->>SB: 4. Gạt nút ON: UPDATE parental_policies SET is_emergency_locked = true
    SB->>WS: 5. Phát sự kiện Postgres Changes (UPDATE)
    WS-->>Kid: 6. Bắn payload realtime xuống máy bé (< 500ms)
    Kid->>Kid: 7. Bật cờ isLocked = true & Bung màn hình LockOverlay ngay tức thì!
```

---

## 3. THIẾT KẾ CƠ SỞ DỮ LIỆU (DATABASE SCHEMA)

Cấu trúc bảng `parental_policies` trên Supabase:

```sql
-- 1. Bảng chính sách phụ huynh
CREATE TABLE IF NOT EXISTS public.parental_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT REFERENCES public.devices(device_id) ON DELETE CASCADE UNIQUE,
    policy_mode TEXT DEFAULT 'blacklist' CHECK (policy_mode IN ('whitelist', 'blacklist')),
    package_list JSONB DEFAULT '["com.android.settings"]'::jsonb,
    parent_pin TEXT DEFAULT '1234',
    is_emergency_locked BOOLEAN DEFAULT false,       -- CỜ KHÓA TỨC THÌ TỪ XA
    lock_message TEXT DEFAULT 'Đã đến giờ nghỉ ngơi rồi con yêu! Ba mẹ đã tạm khóa máy.',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. KÍCH HOẠT SUPABASE REALTIME REPLICATION
ALTER PUBLICATION supabase_realtime ADD TABLE public.parental_policies;
```

---

## 4. CHI TIẾT TRIỂN KHAI PHÍA REACT NATIVE MÁY CON

### 4.1. Bộ Dịch Vụ Lắng Nghe `parentalRealtimeService.ts`
* Sử dụng chuẩn **WebSocket API** tích hợp sẵn của React Native (`global.WebSocket`) để kết nối trực tiếp vào Supabase Realtime Server mà không cần cài thêm thư viện cồng kềnh.
* Tự động gửi gói tin nhịp tim (Heartbeat `phx_heartbeat`) mỗi 30 giây để duy trì kết nối luôn sống (Keep-Alive).
* Tự động kết nối lại (Auto-Reconnect) nếu máy bé bị mất Wi-Fi tạm thời hoặc chuyển mạng.
* Hỗ trợ nạp trạng thái ban đầu bằng REST API ngay khi khởi động để đảm bảo nếu máy bị khóa từ trước thì vừa bật máy lên là khóa ngay.

### 4.2. Gắn Vào Màn Hình Chính `KidsLauncherScreen.tsx`
* Đăng ký lắng nghe sự kiện khi Launcher mở:
  ```typescript
  parentalRealtimeService.subscribeToRemoteLock((isLocked, lockMessage) => {
    if (isLocked) {
      setIsLocked(true);
      setLockReason(lockMessage || 'Ba mẹ đã tạm khóa thiết bị từ xa!');
    } else {
      setIsLocked(false);
    }
  });
  ```
* Khi `isLocked === true`, component `<LockOverlay />` sẽ lập tức chiếm quyền hiển thị trên toàn màn hình.

---

## 5. HƯỚNG DẪN KIỂM THỬ (TESTING GUIDE)

### Cách 1: Test trực tiếp từ Supabase Dashboard
1. Truy cập vào **Supabase Dashboard** -> Table Editor -> `parental_policies`.
2. Tìm dòng có `device_id` của máy bé (xem trong màn hình Cài đặt phụ huynh).
3. Đổi giá trị cột `is_emergency_locked` thành **`true`** và bấm Save.
4. Quan sát màn hình LDPlayer: **Màn hình khóa màu tím sẽ bung lên ngay lập tức trong vòng chưa đầy 1 giây!**
5. Đổi lại `is_emergency_locked` thành **`false`** -> Màn hình khóa tự động mở ra ngay.

### Cách 2: Test bằng lệnh cURL / REST API
Phụ huynh có thể gửi lệnh khóa từ bất kỳ đâu qua HTTP Request:
```bash
curl -X PATCH 'https://jlfemayqttjcfjualfsv.supabase.co/rest/v1/parental_policies?device_id=eq.YOUR_DEVICE_ID' \
  -H "apikey: YOUR_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"is_emergency_locked": true, "lock_message": "Đã đến giờ ăn cơm rồi con ơi!"}'
```
