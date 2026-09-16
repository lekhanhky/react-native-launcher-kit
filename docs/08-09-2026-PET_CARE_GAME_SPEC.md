# 🐾 ĐẶC TẢ GAME: BÉ VÀ BẠN THÚ CƯNG (MY PET FRIENDS)

> **Tài liệu đặc tả thiết kế, luật chơi và kiến trúc kỹ thuật** của trò chơi **"Thú Cưng Của Bé"** — Game chăm sóc thú cưng ảo dành cho trẻ mầm non.
>
> *Phiên bản: 1.0.0*
> *Ngày tạo: 08/09/2026*
> *Định danh Launcher: `internal.game.petcare`*

---

## 📑 MỤC LỤC

1. [Tổng Quan & Mục Tiêu Giáo Dục](#1-tổng-quan--mục-tiêu-giáo-dục)
2. [Đối Tượng & Độ Tuổi](#2-đối-tượng--độ-tuổi)
3. [Danh Sách 6 Nhân Vật Thú Cưng](#3-danh-sách-6-nhân-vật-thú-cưng)
4. [4 Hành Động Chăm Sóc](#4-bốn-hành-động-chăm-sóc)
5. [Hệ Thống Cảm Xúc (Mood System)](#5-hệ-thống-cảm-xúc-mood-system)
6. [Hệ Thống Ngôi Sao & Mở Khóa (Gamification)](#6-hệ-thống-ngôi-sao--mở-khóa-gamification)
7. [Thiết Kế Giao Diện (UI Layout)](#7-thiết-kế-giao-diện-ui-layout)
8. [Bảng Màu Pastel Cho Trẻ Em](#8-bảng-màu-pastel-cho-trẻ-em)
9. [Hệ Thống Animation & Hiệu Ứng](#9-hệ-thống-animation--hiệu-ứng)
10. [Âm Thanh & Giọng Đọc (Audio)](#10-âm-thanh--giọng-đọc-audio)
11. [Kiến Trúc Kỹ Thuật & Cấu Trúc Code](#11-kiến-trúc-kỹ-thuật--cấu-trúc-code)
12. [Nguyên Tắc An Toàn Cho Trẻ Em](#12-nguyên-tắc-an-toàn-cho-trẻ-em)
13. [Kế Hoạch Mở Rộng Tương Lai](#13-kế-hoạch-mở-rộng-tương-lai)

---

## 1. TỔNG QUAN & MỤC TIÊU GIÁO DỤC

### 🎯 Mô Tả Game

**"Thú Cưng Của Bé"** là trò chơi chăm sóc thú cưng ảo được thiết kế đặc biệt cho trẻ mầm non. Bé sẽ chọn một bạn thú cưng dễ thương và thực hiện các hoạt động chăm sóc hàng ngày: cho ăn, tắm rửa, chơi bóng và vuốt ve. Mỗi tương tác đều tạo ra hiệu ứng animation sinh động, âm thanh vui nhộn và phản hồi tích cực bằng giọng đọc tiếng Việt.

### 📚 Lợi Ích Giáo Dục

| Kỹ năng | Cách rèn luyện |
| :--- | :--- |
| **Lòng yêu thương động vật** | Bé học cách quan tâm, chăm sóc và yêu quý bạn thú cưng qua từng hành động |
| **Trách nhiệm & Tự lập** | Bé hiểu rằng thú cưng cần được cho ăn, tắm rửa và chơi đùa mỗi ngày |
| **Nhận biết cảm xúc (EQ)** | Hệ thống Mood giúp bé nhận ra rằng hành động của mình ảnh hưởng đến cảm xúc của bạn |
| **Phối hợp tay-mắt** | Chạm vào các nút lớn, kéo thanh chọn pet — rèn luyện sự khéo léo |
| **Nhận biết con vật** | Làm quen với 6 loài động vật quen thuộc và sự thật thú vị về chúng |
| **Ngôn ngữ tiếng Việt** | Giọng đọc TTS phát lời khen, tên con vật, fun fact bằng tiếng Việt chuẩn |

---

## 2. ĐỐI TƯỢNG & ĐỘ TUỔI

| Tiêu chí | Chi tiết |
| :--- | :--- |
| **Độ tuổi chính** | **2 – 6 tuổi** (Mầm non & Mẫu giáo) |
| **Nền tảng** | Android (React Native) — Tích hợp trong Kids Launcher |
| **Thời gian chơi tối ưu** | 5 – 15 phút mỗi lần (phù hợp attention span của trẻ nhỏ) |
| **Ngôn ngữ** | 🇻🇳 Tiếng Việt (Giọng đọc TTS) |
| **Yêu cầu đọc chữ** | ❌ Không — Hoàn toàn dựa vào hình ảnh, emoji và giọng nói |

---

## 3. DANH SÁCH 6 NHÂN VẬT THÚ CƯNG

| # | Emoji | Tên Tiếng Việt | Tiếng Kêu | Sự Thật Thú Vị | Màu Nền | Yêu Cầu Mở Khóa |
| :---: | :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | 🐶 | **Cún Bông** | *Gâu gâu! Gâu gâu!* | Cún có thính giác tốt gấp 4 lần con người! | 🟡 Vàng Mật Ong `#FDE68A` | Mặc định |
| 2 | 🐱 | **Mèo Miu** | *Meo meo! Meo meo!* | Mèo có thể nhảy cao gấp 6 lần chiều dài cơ thể! | 🩷 Hồng Sen `#FBCFE8` | Mặc định |
| 3 | 🐰 | **Thỏ Trắng** | *Nhảy nhảy! Sột soạt!* | Thỏ có thể xoay tai 180 độ để nghe mọi hướng! | 🟢 Xanh Bạc Hà `#A7F3D0` | ⭐ 3 Sao |
| 4 | 🐹 | **Chuột Hamster** | *Chít chít! Chít chít!* | Hamster có thể nhét thức ăn đầy 2 bên má! | 🟣 Tím Lavender `#E9D5FF` | ⭐ 6 Sao |
| 5 | 🐻 | **Gấu Nâu** | *Gầm gừ! Gừm gừm!* | Gấu rất thích mật ong và có thể ngửi mật từ xa! | 🟠 Cam Đào `#FED7AA` | ⭐ 10 Sao |
| 6 | 🐧 | **Cánh Cụt** | *Quác quác! Quác quác!* | Cánh cụt có thể nhịn thở dưới nước tới 20 phút! | 🔵 Xanh Trời `#BAE6FD` | ⭐ 15 Sao |

> 💡 **Thiết kế nhân vật**: Sử dụng **Emoji Unicode** kích thước khổng lồ `120dp` thay vì ảnh bitmap. Đảm bảo render tức thì (0ms loading), không cần download và hiển thị sắc nét trên mọi thiết bị.

---

## 4. BỐN HÀNH ĐỘNG CHĂM SÓC

Mỗi hành động được thiết kế dưới dạng **nút bấm to** (≥ 80dp) nằm ở thanh ngang phía dưới màn hình, dễ chạm cho bé:

| # | Emoji | Tên Hành Động | Màu Nền | Viền | Phản Hồi Giọng Đọc | Emoji Bay Lên |
| :---: | :---: | :--- | :--- | :--- | :--- | :--- |
| 1 | 🍖 | **Cho Ăn** | `#FEE2E2` Hồng nhạt | `#DC2626` Đỏ | *"Ngon quá! Cảm ơn bé!"* | 😋 🍗 🥩 🍎 ⭐ |
| 2 | 🛁 | **Tắm Rửa** | `#DBEAFE` Xanh nhạt | `#2563EB` Xanh dương | *"Sạch bóng mát mẻ rồi!"* | 🫧 💧 🧼 🚿 ✨ |
| 3 | ⚽ | **Chơi Bóng** | `#DCFCE7` Xanh lá nhạt | `#16A34A` Xanh lá | *"Vui quá! Chơi nữa đi bé!"* | 🎾 🏐 🎈 🎉 ⭐ |
| 4 | 💕 | **Vuốt Ve** | `#FCE7F3` Hồng phấn | `#DB2777` Hồng đậm | *"Dễ chịu quá! Bé dịu dàng lắm!"* | 💖 💗 💝 🥰 😍 |

**Cơ chế tương tác:**
1. Bé chạm vào 1 trong 4 nút hành động
2. Thú cưng **nhảy nẩy** (bounce) + **lắc lư** (wiggle) vui vẻ
3. Emoji phản hồi **bay tỏa lên** 360 độ từ vị trí ngẫu nhiên
4. Tim **💖 nổi lên** bên cạnh thú cưng
5. Nhãn **+1 ⭐** pop-up rồi bay lên
6. Giọng đọc tiếng Việt phát lời khen
7. Thanh Mood tăng tiến độ
8. Tổng sao ⭐ tăng lên trên header

---

## 5. HỆ THỐNG CẢM XÚC (MOOD SYSTEM)

Mỗi thú cưng có một **thanh cảm xúc riêng** (Mood Bar) phản ánh mức độ hạnh phúc dựa trên số lần bé chăm sóc:

| Mức | Emoji | Trạng Thái | Màu | Điểm Mood |
| :---: | :---: | :--- | :--- | :---: |
| 1 | 😿 | **Đang đói** | 🔴 `#EF4444` | 0 |
| 2 | 😊 | **Vui vẻ** | 🟡 `#F59E0B` | 1 – 2 |
| 3 | 🥰 | **Rất vui** | 🟢 `#10B981` | 3 – 5 |
| 4 | 🤩 | **Siêu vui** | 🟣 `#8B5CF6` | 6 – 8 |

**Mood Bar**: Thanh ngang hiển thị trực quan tỷ lệ `moodValue / 8` (100%) kèm emoji biểu cảm và nhãn chữ.

> 💡 **Triết lý giáo dục**: Bé nhận thấy rằng càng chăm sóc nhiều, bạn thú cưng càng vui — dạy bé về **sự quan tâm và trách nhiệm**.

---

## 6. HỆ THỐNG NGÔI SAO & MỞ KHÓA (GAMIFICATION)

### ⭐ Thu Thập Ngôi Sao

- Mỗi lần thực hiện 1 hành động chăm sóc = **+1 ⭐**
- Tổng sao hiển thị ở **header** luôn luôn nhìn thấy
- Cứ **20 lần chăm sóc** → Xuất hiện **Màn Hình Chúc Mừng Chiến Thắng** (Victory Overlay)

### 🔓 Hệ Thống Mở Khóa Thú Cưng

```
🐶 Cún Bông     → Mặc định (Miễn phí)
🐱 Mèo Miu      → Mặc định (Miễn phí)
🐰 Thỏ Trắng    → Cần ⭐ 3 Sao
🐹 Hamster       → Cần ⭐ 6 Sao
🐻 Gấu Nâu      → Cần ⭐ 10 Sao
🐧 Cánh Cụt     → Cần ⭐ 15 Sao
```

- Pet chưa mở khóa hiển thị icon **🔒** thay vì emoji con vật
- Bé chạm vào pet bị khóa → Giọng đọc nhắc nhở: *"Bé cần X ngôi sao để mở khóa [Tên]. Hãy chăm sóc thêm nhé!"*
- Khi đủ sao → Pet tự động mở khóa → Thông báo khi đạt Victory

### 🏆 Màn Hình Chiến Thắng (Victory Overlay)

Khi bé chăm sóc đủ **20 lần liên tiếp**, màn hình tối đi và hiển thị:
- Emoji lớn: 🎉 🐾 ⭐
- Tiêu đề vàng rực: **"BÉ GIỎI QUÁ!"**
- Thông báo số sao hiện có
- Nếu mở khóa pet mới → Dòng chữ xanh: **"🔓 Thú cưng mới đã được mở khóa!"**
- Nút tiếp tục: **"🐾 Tiếp Tục Chăm Sóc"**

---

## 7. THIẾT KẾ GIAO DIỆN (UI LAYOUT)

### Bố Cục Màn Hình Chính

```
┌────────────────────────────────────────────┐
│  [✕]    🐾 Bé Và Bạn Thú Cưng    [🔊]   │ ← HEADER
│              ⭐ 12 Sao                     │
├────────────────────────────────────────────┤
│  [🐶 Cún] [🐱 Mèo] [🐰 Thỏ] [🔒] [🔒]  │ ← PET SELECTOR
├────────────────────────────────────────────┤
│  ┌──────────────────────────────────────┐  │
│  │  🥰 Rất vui ████████░░░░            │  │ ← MOOD BADGE
│  │                                      │  │
│  │  💡 Cún có thính giác tốt gấp 4...  │  │ ← FUN FACT BUBBLE
│  │                                      │  │
│  │              💖                      │  │ ← HEART REACTION
│  │         +1⭐                         │  │ ← STAR POPUP
│  │                                      │  │
│  │           🐶                         │  │ ← PET EMOJI (120dp)
│  │        (Cún Bông)                    │  │ ← PET NAME
│  │                                      │  │
│  │     😋  🍗  🥩  🍎  ⭐              │  │ ← FLOATING EMOJIS
│  └──────────────────────────────────────┘  │ ← PET ROOM
├────────────────────────────────────────────┤
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐          │
│  │ 🍖 │  │ 🛁 │  │ ⚽ │  │ 💕 │          │ ← 4 NÚT HÀNH ĐỘNG
│  │Cho  │  │Tắm │  │Chơi│  │Vuốt│          │   (NÚT TO, DỄ CHẠM)
│  │ Ăn  │  │Rửa │  │Bóng│  │ Ve │          │
│  └────┘  └────┘  └────┘  └────┘          │
├────────────────────────────────────────────┤
│  🐾 Bé đã chăm sóc 12 lần! Tiếp tục!    │ ← TIP BAR
└────────────────────────────────────────────┘
```

### Tiêu Chuẩn Thiết Kế Cho Trẻ Em

| Tiêu chuẩn | Giá trị áp dụng |
| :--- | :--- |
| **Emoji nhân vật chính** | `fontSize: 120dp` — To rõ, trẻ nhìn thấy ngay |
| **Nút hành động (Touch Target)** | `paddingVertical: 14dp` × `flex: 1` — Chiếm đều 25% chiều ngang |
| **Emoji trên nút** | `fontSize: 32dp` — To, rõ ràng |
| **Nút đóng / Âm thanh** | `42 × 42 dp` bo tròn — Dễ chạm cho ngón tay nhỏ |
| **Font chữ tiêu đề** | `fontSize: 20dp`, `fontWeight: 900` — Đậm, nổi bật |
| **Bo góc card** | `borderRadius: 28dp` (Pet Room), `18dp` (Nút), `14dp` (Selector) |

---

## 8. BẢNG MÀU PASTEL CHO TRẺ EM

### Màu Nền Cho Từng Thú Cưng

Mỗi thú cưng có **2 tông màu pastel** riêng (nền chính + nền phòng) để tạo cảm giác ấm áp:

| Thú Cưng | Nền Chính (Start) | Nền Phòng (End) | Màu Header Text |
| :--- | :--- | :--- | :--- |
| 🐶 Cún Bông | `#FDE68A` Vàng Mật Ong | `#FEF3C7` Vàng Kem | `#92400E` Nâu Đất |
| 🐱 Mèo Miu | `#FBCFE8` Hồng Sen | `#FDF2F8` Hồng Sữa | `#9D174D` Hồng Đậm |
| 🐰 Thỏ Trắng | `#A7F3D0` Xanh Bạc Hà | `#ECFDF5` Xanh Sương | `#065F46` Xanh Rừng |
| 🐹 Hamster | `#E9D5FF` Tím Lavender | `#FAF5FF` Tím Sương | `#6B21A8` Tím Đậm |
| 🐻 Gấu Nâu | `#FED7AA` Cam Đào | `#FFF7ED` Cam Sữa | `#9A3412` Cam Đất |
| 🐧 Cánh Cụt | `#BAE6FD` Xanh Trời | `#F0F9FF` Xanh Sương | `#0C4A6E` Xanh Biển |

### Màu Cho Các Nút Hành Động

| Hành Động | Nền Nút | Viền Nút | Text |
| :--- | :--- | :--- | :--- |
| 🍖 Cho Ăn | `#FEE2E2` | `#DC2626` | `#DC2626` |
| 🛁 Tắm Rửa | `#DBEAFE` | `#2563EB` | `#2563EB` |
| ⚽ Chơi Bóng | `#DCFCE7` | `#16A34A` | `#16A34A` |
| 💕 Vuốt Ve | `#FCE7F3` | `#DB2777` | `#DB2777` |

---

## 9. HỆ THỐNG ANIMATION & HIỆU ỨNG

### 9.1. Animation Nhân Vật (Pet Animations)

| Animation | Mô Tả | Kỹ Thuật | Thời Gian |
| :--- | :--- | :--- | :--- |
| **Idle Breathing** | Thú cưng nhẹ nhàng nâng lên hạ xuống liên tục | `Animated.loop` + `translateY: 0 ↔ -8px` | 3000ms/chu kỳ |
| **Bounce** | Nhảy nẩy khi bé chạm nút chăm sóc | `Animated.spring` + `scale: 1 → 1.2 → 1` | ~400ms |
| **Wiggle** | Lắc lư sang trái phải vui vẻ | `rotate: -8° → 8° → -8° → 0°` | 400ms |

### 9.2. Animation Phản Hồi (Feedback Animations)

| Animation | Mô Tả | Kỹ Thuật |
| :--- | :--- | :--- |
| **Heart Pop** 💖 | Tim nổi lên cạnh nhân vật rồi biến mất | `scale: 0 → 1.3 → 1 → 0` + `opacity` |
| **Star Popup** ⭐ | Nhãn "+1 ⭐" pop lên phía trên rồi mờ dần | `scale: 0 → 1` + `translateY: 20 → -10` |
| **Floating Emojis** | 5 emoji bay tỏa lên từ vị trí ngẫu nhiên | `translateY: 0 → -180` + `scale: 0.5 → 1.2 → 0.3` + `opacity` |

### 9.3. Tối Ưu Hiệu Năng

- ✅ Toàn bộ animation dùng **`useNativeDriver: true`** → Chạy trên **UI Thread**, không block JS Thread
- ✅ Tối đa **5 floating emojis** mỗi lần chạm → Không quá tải bộ nhớ
- ✅ Floating emojis tự **xóa khỏi state** sau 1500ms → Không memory leak
- ✅ Sử dụng `useCallback` cho handler → Tránh re-create hàm mỗi render
- ✅ Emoji Unicode thay vì ảnh bitmap → **0ms loading time**

---

## 10. ÂM THANH & GIỌNG ĐỌC (AUDIO)

### Danh Sách Phát Giọng Đọc (Text-to-Speech)

| Sự Kiện | Nội Dung Giọng Đọc | Ngôn Ngữ |
| :--- | :--- | :---: |
| **Mở game** | *"Chào bé! Hãy chăm sóc các bạn thú cưng dễ thương nhé! Chạm vào nút bên dưới để bắt đầu!"* | 🇻🇳 |
| **Chọn pet** | *"[Tiếng kêu]! Xin chào! Mình là [Tên]! Hãy chăm sóc mình nhé!"* | 🇻🇳 |
| **Cho ăn** | *"[Tên] nói: Ngon quá! Cảm ơn bé!"* | 🇻🇳 |
| **Tắm rửa** | *"[Tên] nói: Sạch bóng mát mẻ rồi!"* | 🇻🇳 |
| **Chơi bóng** | *"[Tên] nói: Vui quá! Chơi nữa đi bé!"* | 🇻🇳 |
| **Vuốt ve** | *"[Tên] nói: Dễ chịu quá! Bé dịu dàng lắm!"* | 🇻🇳 |
| **Nút 🔊** | *"Đây là bạn [Tên]! [Fun Fact]"* | 🇻🇳 |
| **Pet bị khóa** | *"Bé cần X ngôi sao để mở khóa [Tên]. Hãy chăm sóc thêm nhé!"* | 🇻🇳 |
| **Victory** | *"Hoan hô! Bé chăm sóc thú cưng thật giỏi! Bé nhận được nhiều ngôi sao!"* | 🇻🇳 |

> **Công nghệ**: Sử dụng `react-native-tts` (Text-to-Speech) thông qua module `soundManager` trong `SoundPlayer.tsx`.

---

## 11. KIẾN TRÚC KỸ THUẬT & CẤU TRÚC CODE

### 11.1. Tệp Triển Khai

| Tệp | Vai Trò | Dung Lượng |
| :--- | :--- | :---: |
| [PetCareGameScreen.tsx](file:///c:/react-native-launcher-kit/example/src/screens/PetCareGameScreen.tsx) | **Màn hình game chính** — Toàn bộ logic, data, UI, animation | ~977 dòng |
| [KidsLauncherScreen.tsx](file:///c:/react-native-launcher-kit/example/src/screens/KidsLauncherScreen.tsx) | **Đăng ký game** — Import, state, routing, icon launcher | 10 điểm sửa |
| [SoundPlayer.tsx](file:///c:/react-native-launcher-kit/example/src/components/SoundPlayer.tsx) | **Module âm thanh** — Phát giọng đọc TTS tiếng Việt | Tái sử dụng |

### 11.2. Định Danh Trong Launcher

```typescript
// Package name nội bộ
'internal.game.petcare'

// Icon trên launcher grid
Emoji: 🐾
Nền ngoài: #92400E (Nâu đất)
Nền trong: #FDE68A (Vàng mật ong)
```

### 11.3. Cấu Trúc Props & Interface

```typescript
// Props component chính
interface Props {
  onClose: () => void;  // Callback đóng game, quay về Launcher
}

// Data nhân vật
interface Pet {
  id: string;              // 'puppy', 'kitty', 'bunny'...
  nameVi: string;          // 'Cún Bông'
  emoji: string;           // '🐶'
  bgGradientStart: string; // '#FDE68A' — Màu nền chính
  bgGradientEnd: string;   // '#FEF3C7' — Màu nền phòng
  headerColor: string;     // '#92400E' — Màu chữ header
  soundText: string;       // 'Gâu gâu! Gâu gâu!'
  funFact: string;         // 'Cún có thính giác tốt gấp 4 lần...'
  unlockStars: number;     // 0 = miễn phí, 3/6/10/15 = cần sao
}

// Data hành động chăm sóc
interface CareAction {
  id: string;              // 'feed', 'bath', 'play', 'pet'
  label: string;           // 'Cho Ăn'
  emoji: string;           // '🍖'
  color: string;           // '#DC2626' — Màu viền nút
  bgColor: string;         // '#FEE2E2' — Màu nền nút
  reactionEmojis: string[];// ['😋', '🍗', '🥩', '🍎', '⭐']
  soundPhrase: string;     // 'Ngon quá! Cảm ơn bé!'
  starsReward: number;     // 1
}

// Trạng thái cảm xúc
interface MoodState {
  emoji: string;           // '🥰'
  label: string;           // 'Rất vui'
  color: string;           // '#10B981'
}
```

### 11.4. Tech Stack Sử Dụng

| Thành Phần | Công Nghệ | Ghi Chú |
| :--- | :--- | :--- |
| **UI Framework** | React Native | Component-based, cross-platform |
| **Animation** | `Animated` API (built-in) | `useNativeDriver: true` cho mọi animation |
| **Âm thanh** | `soundManager` (TTS) | Giọng đọc tiếng Việt tự nhiên |
| **State Management** | React `useState` + `useRef` | Không cần Redux, đủ nhẹ |
| **Tối ưu** | `useCallback`, `useRef` cho animation values | Tránh re-render thừa |
| **Hình ảnh** | Emoji Unicode | 0ms loading, 0 bandwidth |

---

## 12. NGUYÊN TẮC AN TOÀN CHO TRẺ EM

| Nguyên Tắc | Cách Thực Hiện |
| :--- | :--- |
| ✅ **Không quảng cáo** | Game hoàn toàn offline, không có bất kỳ quảng cáo nào |
| ✅ **Không phạt** | Không có tiếng còi phạt, không mất mạng, không game over |
| ✅ **Phản hồi 100% tích cực** | Mọi tương tác đều được khen ngợi, khích lệ |
| ✅ **Không yêu cầu đọc chữ** | Toàn bộ dựa vào emoji, hình ảnh và giọng nói |
| ✅ **Vùng chạm lớn** | Nút tối thiểu 60dp, đảm bảo ngón tay nhỏ chạm chính xác |
| ✅ **Giới hạn thời gian** | Tích hợp với Daily Timer của Kids Launcher (Parental Control) |
| ✅ **Không có nội dung bạo lực** | Chỉ có chăm sóc, yêu thương, vui vẻ |
| ✅ **Không thu thập dữ liệu** | Không gửi bất kỳ thông tin cá nhân nào lên server |

---

## 13. KẾ HOẠCH MỞ RỘNG TƯƠNG LAI

### Giai Đoạn 2 (Đề Xuất)

| Tính Năng | Mô Tả |
| :--- | :--- |
| 🏠 **Trang Trí Phòng** | Bé dùng sao mua nội thất, đổi nền phòng cho thú cưng |
| 👕 **Mặc Trang Phục** | Kéo thả mũ, áo, kính cho thú cưng mặc |
| 🍰 **Nấu Ăn Cho Pet** | Mini-game trộn nguyên liệu để nấu món ăn yêu thích |
| 🌙 **Chu Kỳ Ngày/Đêm** | Pet buồn ngủ vào tối, bé cần cho pet đi ngủ → dạy thói quen sinh hoạt |
| 🏥 **Bác Sĩ Thú Y** | Pet bị ốm nhẹ, bé dùng ống nghe, nhiệt kế để chữa bệnh |

### Giai Đoạn 3 (Đề Xuất)

| Tính Năng | Mô Tả |
| :--- | :--- |
| ☁️ **Đồng Bộ Supabase** | Lưu tiến độ, sao, pet đã mở khóa lên đám mây |
| 📊 **Báo Cáo Phụ Huynh** | Thống kê thời gian chơi, loại hành động yêu thích |
| 🌐 **Song Ngữ Việt - Anh** | Thêm tên tiếng Anh, phiên âm IPA cho tất cả con vật |
| 🎵 **Nhạc Nền** | Giai điệu nhẹ nhàng vui vẻ khi chơi game |

---

> 💡 **Tài liệu tham khảo liên quan:**
> - [Hướng dẫn 10 Mini Game cho bé](file:///c:/react-native-launcher-kit/docs/KIDS_GAMES_GUIDE.md)
> - [Đặc tả 10 Trò chơi giáo dục mới](file:///c:/react-native-launcher-kit/docs/NEW_EDUCATIONAL_GAMES_SPEC.md)
> - [Game Động Vật Song Ngữ Supabase](file:///c:/react-native-launcher-kit/docs/ANIMAL_GAME_SUPABASE_BILINGUAL_GUIDE.md)
> - [Source code PetCareGameScreen.tsx](file:///c:/react-native-launcher-kit/example/src/screens/PetCareGameScreen.tsx)
