# Kế Hoạch Triển Khai MVP: Khóa Máy Khẩn Cấp Realtime (Parent-Child Remote Lock)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hiện thực hóa tính năng khóa/mở khóa máy tức thì từ Cổng Phụ Huynh Web Portal (`http://localhost:3001/parent/dashboard`) truyền lệnh thời gian thực (< 1 giây) qua Supabase Realtime WebSocket tới ứng dụng Kids Launcher trên thiết bị của bé.

**Architecture:** 
- Phụ huynh nhấn nút "Khóa Máy Khẩn Cấp" trên Web Dashboard ➔ Supabase nhận lệnh `upsert` trên bảng `parental_policies`.
- Supabase Realtime phát broadcast sự kiện `postgres_changes` qua WebSocket Phoenix Channel tới mọi client đang kết nối.
- Ứng dụng Kids Launcher trên máy bé nhận payload ngay lập tức và render `LockOverlay` toàn màn hình. Khi bé/phụ huynh mở khóa bằng mã PIN trên máy, trạng thái tự động đồng bộ ngược lại Web Portal.

**Tech Stack:** Next.js 14, React 18, React Native, Supabase Realtime (WebSocket), PostgreSQL, Tailwind CSS, Lucide Icons.

---

## Danh Sách Tệp Can Thiệp
- **Modify:** `web-portal/src/app/(parent)/parent/dashboard/page.tsx` (Kết nối Supabase Realtime, Device Selector, Instant Lock button)
- **Modify:** `example/src/services/parentalRealtimeService.ts` (Tối ưu hóa lắng nghe WebSocket, tự động tạo bản ghi device, đồng bộ 2 chiều)
- **Modify:** `example/src/screens/KidsLauncherScreen.tsx` (Đồng bộ mở khóa PIN về Supabase)
- **Modify:** `example/src/screens/ParentSettingsScreen.tsx` (Hiển thị Device ID nổi bật, nút sao chép mã)

---

## Chi Tiết Các Nhiệm Vụ

### Task 1: Nâng Cấp `parentalRealtimeService.ts` Trên Ứng Dụng Bé (Child App)
**Files:**
- Modify: `example/src/services/parentalRealtimeService.ts`

- [ ] **Step 1:** Bổ sung phương thức tự động khởi tạo (seed/upsert) bản ghi `parental_policies` nếu thiết bị lần đầu kết nối.
- [ ] **Step 2:** Thêm phương thức `unlockLocally()` để khi mở khóa bằng PIN trên máy, tự động cập nhật `is_emergency_locked = false` lên Supabase nhằm đồng bộ trạng thái realtime về Web Portal.
- [ ] **Step 3:** Đảm bảo `joinParentalPoliciesChannel` nhận được cả sự kiện `INSERT` và `UPDATE`.

### Task 2: Kết Nối Cổng Phụ Huynh Web Dashboard với Supabase Realtime
**Files:**
- Modify: `web-portal/src/app/(parent)/parent/dashboard/page.tsx`

- [ ] **Step 1:** Import `supabase` từ `@/lib/supabase`.
- [ ] **Step 2:** Thêm state quản lý `deviceId` (lấy từ `localStorage` hoặc danh sách thiết bị có sẵn).
- [ ] **Step 3:** Thêm `useEffect` để tải trạng thái khóa ban đầu từ `parental_policies` và đăng ký Supabase Realtime channel lắng nghe `postgres_changes`.
- [ ] **Step 4:** Triển khai hàm `toggleInstantLock()` thực hiện upsert lên `parental_policies` kèm trạng thái loading spinner và hiển thị độ trễ phản hồi (< 1s).
- [ ] **Step 5:** Thêm widget chọn/nhập Device ID kèm hiển thị trạng thái kết nối Realtime (Connected / Syncing).

### Task 3: Đồng Bộ Chiều Ngược Lại Tại `KidsLauncherScreen.tsx` & `ParentSettingsScreen.tsx`
**Files:**
- Modify: `example/src/screens/KidsLauncherScreen.tsx`
- Modify: `example/src/screens/ParentSettingsScreen.tsx`

- [ ] **Step 1:** Trong `KidsLauncherScreen.tsx` tại `handlePinSuccess`: Nếu đang ở trạng thái khóa khẩn cấp, gọi `parentalRealtimeService.unlockLocally()` để gửi tín hiệu mở khóa lên Supabase.
- [ ] **Step 2:** Trong `ParentSettingsScreen.tsx`: Bổ sung nút sao chép Device ID và hiển thị hướng dẫn kết nối với Web Portal.

### Task 4: Kiểm Thử & Xác Nhận Toàn Diện (End-to-End Verification)
**Files:**
- Test script: `web-portal/test_e2e_realtime.js`

- [ ] **Step 1:** Build Web Portal (`npm run build` trong `web-portal`) đảm bảo không có lỗi TypeScript hay cú pháp.
- [ ] **Step 2:** Viết kịch bản test tự động mô phỏng Web Portal khóa máy và nhận tín hiệu tại client trong < 1000ms.
- [ ] **Step 3:** Chạy thử nghiệm và xác nhận kết quả.
