# 🌍 ĐẶC TẢ THIẾT KẾ & PHÁT TRIỂN GAME "BÉ KHÁM PHÁ THẾ GIỚI" (EXPLORER WORLD ADVENTURE)
*Tài liệu kỹ thuật chi tiết dành cho Kids Launcher Ecosystem — Phiên bản 1.0*

---

## 📑 MỤC LỤC

1. [Tổng Quan Dự Án](#1-tổng-quan-dự-án)
2. [Kiến Trúc Hệ Thống & Engine](#2-kiến-trúc-hệ-thống--engine)
3. [Cơ Chế Vật Lý & Va Chạm](#3-cơ-chế-vật-lý--va-chạm)
4. [Hệ Thống Nhân Vật & Trang Phục](#4-hệ-thống-nhân-vật--trang-phục)
5. [Thiết Kế 6 Thế Giới (World Design)](#5-thiết-kế-6-thế-giới-world-design)
6. [Chi Tiết 5 Màn Chơi — Khu Rừng Xanh (Đã Triển Khai)](#6-chi-tiết-5-màn-chơi--khu-rừng-xanh-đã-triển-khai)
7. [Hệ Thống Giáo Dục Tích Hợp](#7-hệ-thống-giáo-dục-tích-hợp)
8. [Ngân Hàng Câu Hỏi](#8-ngân-hàng-câu-hỏi)
9. [Giao Diện & Trải Nghiệm Người Dùng](#9-giao-diện--trải-nghiệm-người-dùng)
10. [Đồ Họa Pixel Art HD & Parallax](#10-đồ-họa-pixel-art-hd--parallax)
11. [Cấu Trúc Code & Hướng Dẫn Mở Rộng](#11-cấu-trúc-code--hướng-dẫn-mở-rộng)
12. [Lộ Trình Triển Khai (Roadmap)](#12-lộ-trình-triển-khai-roadmap)

---

## 1. TỔNG QUAN DỰ ÁN

### 1.1. Mục Tiêu & Định Vị

| Thuộc tính | Chi tiết |
|:---|:---|
| **Tên trò chơi** | Bé Khám Phá Thế Giới (*Explorer World Adventure*) |
| **Thể loại** | 2D Adventure-Platformer xuyên suốt nhiều thế giới |
| **Nền tảng** | React Native Native (chạy trực tiếp trong Kids Launcher) |
| **Đối tượng** | Trẻ em từ 3 – 10 tuổi |
| **Mục tiêu giáo dục** | Toán học, Tiếng Anh Oxford, Khoa học STEM, Tư duy Logic |
| **Thời lượng** | 30 màn chơi (6 thế giới × 5 màn), mỗi màn 2-5 phút |
| **RAM tiêu thụ** | ~10-15MB (nhẹ, tối ưu cho thiết bị yếu) |
| **FPS** | 60 FPS ổn định qua `requestAnimationFrame` |

### 1.2. Triết Lý Thiết Kế

```
┌─────────────────────────────────────────────────────────────────────┐
│                     "HỌC MÀ CHƠI, CHƠI MÀ HỌC"                    │
│                                                                     │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐      │
│  │ 🎮 VUI   │ +  │ 📚 HỌC  │ +  │ 🏆 THƯỞNG│ +  │ 🔄 TIẾN  │      │
│  │  CHƠI    │    │  TẬP     │    │  PHẦN    │    │  TRÌNH   │      │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘      │
│                                                                     │
│  Nguyên tắc:                                                       │
│  • Không bạo lực — Quái vật dễ thương, bị "xẹp" khi dẫm            │
│  • Không gây nghiện — Tích hợp Parental Control giới hạn thời gian │
│  • Phản hồi tích cực — "Giỏi lắm!", không trừng phạt khi sai      │
│  • Adaptive Difficulty — Tự điều chỉnh độ khó theo năng lực bé     │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.3. Tại Sao Chọn Native React Native?

| Tiêu chí | Native RN (Đã chọn ✅) | WebView HTML5 | Standalone APK |
|:---|:---|:---|:---|
| **Khởi động** | < 0.1 giây | 1-2.5 giây | 2-5 giây |
| **RAM** | ~10-15MB | ~40-60MB | ~50-80MB |
| **Tùy biến giáo dục** | 100% | Rất khó | Trung bình |
| **Âm thanh** | Native SoundPlayer + TTS | Hay lỗi trên Android TV | Tốt |
| **Tích hợp Launcher** | Trực tiếp, liền mạch | Qua bridge | Cần intent |
| **Parental Control** | Đồng bộ 100% | Khó kiểm soát | Cần API riêng |

---

## 2. KIẾN TRÚC HỆ THỐNG & ENGINE

### 2.1. Sơ Đồ Kiến Trúc Module

```
┌──────────────────────────────────────────────────────────────────────┐
│                   KidsLauncherScreen (Danh sách App)                 │
│                          packageName: 'internal.game.explorer'       │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │ setShowExplorerGame(true)
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    ExplorerGameScreen.tsx (MAIN)                      │
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │                    PHASE STATE MACHINE                           │ │
│ │  world_map → character_select → level_intro → playing →         │ │
│ │  quiz / boss_fight → level_complete / game_over → world_map     │ │
│ ├──────────────────────────────────────────────────────────────────┤ │
│ │                                                                  │ │
│ │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐        │ │
│ │  │ PHYSICS     │  │ CAMERA       │  │ RENDERER          │        │ │
│ │  │ • Gravity   │  │ • Follow     │  │ • Parallax 4-layer│        │ │
│ │  │ • AABB      │  │ • Smooth     │  │ • Tile culling    │        │ │
│ │  │ • Bounce    │  │ • Clamp      │  │ • Particle VFX    │        │ │
│ │  │ • Friction  │  │              │  │ • Screen shake    │        │ │
│ │  └─────────────┘  └──────────────┘  └──────────────────┘        │ │
│ │                                                                  │ │
│ │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐        │ │
│ │  │ LEVEL DATA  │  │ EDUCATION    │  │ CHARACTER SYSTEM  │        │ │
│ │  │ • 5 levels  │  │ • Math Quiz  │  │ • 6 characters    │        │ │
│ │  │ • Tilemaps  │  │ • Spelling   │  │ • Abilities       │        │ │
│ │  │ • Enemies   │  │ • Science    │  │ • Unlock progress │        │ │
│ │  │ • Items     │  │ • Hints      │  │ • Costumes        │        │ │
│ │  └─────────────┘  └──────────────┘  └──────────────────┘        │ │
│ │                                                                  │ │
│ │  ┌─────────────────────────────────────────────────────┐        │ │
│ │  │               TOUCH CONTROLS                        │        │ │
│ │  │  [ ◀ ] [ ▶ ] (D-Pad)      [ ⬆ NHẢY ]  [ ⚡ CHẠY ] │        │ │
│ │  └─────────────────────────────────────────────────────┘        │ │
│ └──────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

### 2.2. Game Loop Flow (60 FPS)

```
requestAnimationFrame(gameLoop)
        │
        ▼
  ┌─────────────┐
  │ updatePhysics│──→ Di chuyển ngang (vx) ──→ Gravity (vy) ──→ Collision AABB
  └──────┬──────┘     ↓                         ↓                 ↓
         │       Friction/Accel          Max Fall Speed      Ground/Ceiling/Wall
         ▼                                                        ↓
  ┌─────────────┐                                          Question Block?
  │ checkItems  │──→ Coins (+10) / Letters (TTS) / Stars (+50)    ↓ Yes
  └──────┬──────┘    / Hearts (+1 HP) / Gems (+250)         Open Quiz Overlay
         ▼
  ┌─────────────┐
  │ checkEnemies│──→ Stomp (bounce) vs Hit (knockback + invincible)
  └──────┬──────┘
         ▼
  ┌─────────────┐
  │ updateCamera│──→ Smooth follow (lerp 0.1) + World clamp
  └──────┬──────┘
         ▼
  ┌─────────────┐
  │ setRenderTick│──→ Trigger React re-render (visible tiles/items/enemies only)
  └─────────────┘
```

---

## 3. CƠ CHẾ VẬT LÝ & VA CHẠM

### 3.1. Hằng Số Vật Lý

```typescript
const PHYSICS = {
  GRAVITY: 0.55,          // Gia tốc trọng trường
  MAX_FALL: 11,           // Vận tốc rơi tối đa
  MOVE_SPEED: 3.8,        // Tốc độ đi bộ
  RUN_SPEED: 5.5,         // Tốc độ chạy nhanh (giữ nút ⚡)
  ACCEL: 0.32,            // Gia tốc tăng dần (smooth start)
  FRICTION: 0.8,          // Ma sát khi dừng (không khựng đột ngột)
  JUMP_FORCE: -11.5,      // Lực nhảy ban đầu (âm = lên trên)
  BOUNCE_FORCE: -8,       // Lực nảy khi dẫm quái
  TILE: 36,               // Kích thước 1 ô bản đồ (px)
  INVINCIBLE_TIME: 90,    // Số frame bất tử sau khi bị hit (~1.5 giây)
};
```

### 3.2. Thuật Toán Va Chạm AABB

```
Hộp Mario:  {x, y, w, h}
Hộp Tile:   {col*TILE, row*TILE, TILE, TILE}

Điều kiện va chạm:
  mario.x + mario.w > tile.x  AND
  mario.x < tile.x + TILE     AND
  mario.y + mario.h > tile.y  AND
  mario.y < tile.y + TILE
```

#### A. Va Chạm Mặt Đất (Landing)
- Khi `player.vy > 0` (đang rơi) và chân player chạm đỉnh tile:
  - `player.y = tile.top - player.h`
  - `player.vy = 0`, `isGrounded = true`

#### B. Va Chạm Trần (Head Bump)
- Khi `player.vy < 0` (đang nhảy lên) và đầu player chạm đáy tile:
  - `player.y = tile.bottom`, `player.vy = 1` (đẩy xuống nhẹ)
  - Nếu tile là **Question Block** chưa kích hoạt → Trigger Quiz hoặc +5 coins

#### C. Va Chạm Hông (Wall)
- Khi player di chuyển ngang va vào tile solid:
  - `player.x = tile.left - player.w` (va phải) hoặc `player.x = tile.right` (va trái)
  - `player.vx = 0`

#### D. Tương Tác Kẻ Địch

| Tình Huống | Điều Kiện | Kết Quả |
|:---|:---|:---|
| **Dẫm bẹp** | `player.vy > 0` + chân player < 60% chiều cao quái | Quái xẹp (20 frames), player nảy lên, +100 điểm |
| **Va hông** | Player chạm quái khi không dẫm từ trên | Player bật ngược, mất 1 ❤️, bất tử 1.5s |
| **Boss stomp** | Dẫm lên Boss Owl | Boss -1 HP, screen shake, nếu HP=0 trigger quiz battle |

---

## 4. HỆ THỐNG NHÂN VẬT & TRANG PHỤC

### 4.1. Bảng Nhân Vật

| # | Emoji | Tên | Màu Sắc | Khả Năng Đặc Biệt | Điều Kiện Mở Khóa |
|:---:|:---:|:---|:---|:---|:---|
| 1 | 🐱 | **Miu** (Mèo) | `#FF9800` | Cân bằng tốt (mặc định) | Mặc định |
| 2 | 🐶 | **Gâu** (Cún) | `#795548` | Chạy nhanh hơn 15% | Hoàn thành World 1 Level 2 |
| 3 | 🐰 | **Thỏ Bông** | `#E91E63` | Nhảy đôi (Double Jump) | Hoàn thành World 1 Level 3 |
| 4 | 🦊 | **Cáo Thông Minh** | `#FF5722` | Gợi ý đáp án (1 lần/màn) | Hoàn thành World 1 Level 4 |
| 5 | 🐼 | **Gấu Trúc** | `#607D8B` | Shield chống mất điểm 1 lần | Thu thập 100 ngôi sao |
| 6 | 🦁 | **Sư Tử Vua** | `#FFC107` | Tất cả ability cộng lại | Hoàn thành toàn bộ game |

### 4.2. Sprite Animation States

Mỗi nhân vật có 5 trạng thái hoạt ảnh:

```typescript
sprites: {
  idle:  '🐱',   // Đứng yên
  walk1: '🐱',   // Bước chân 1 (xen kẽ mỗi 8 frames)
  walk2: '🐈',   // Bước chân 2
  jump:  '😺',   // Đang nhảy / rơi
  hurt:  '🙀',   // Bị va quái (invincible state)
}
```

### 4.3. Trang Phục Thu Thập (Dự Kiến)

Mỗi thế giới có 3 trang phục ẩn:
- 🎩 **Mũ** — Ẩn ở vị trí khó nhảy tới
- 👕 **Áo** — Thưởng khi trả lời đúng 100% quiz trong 1 màn
- 🎀 **Phụ kiện** — Thu thập đủ 100% coins trong 1 màn

---

## 5. THIẾT KẾ 6 THẾ GIỚI (WORLD DESIGN)

### 5.1. Tổng Quan Bản Đồ Thế Giới

```
              🌍 BẢN ĐỒ THẾ GIỚI
              
   🌳 ──── 🌊 ──── 🌋 ──── 🍬 ──── 🚀 ──── 🏛️
  RỪNG     BIỂN    NÚI LỬA   KẸO    VŨ TRỤ   ĐỀN
  (5 màn)  (5 màn)  (5 màn)  (5 màn) (5 màn)  (5 màn)
  ═══════════════════════════════════════════════════
  ✅ Đã TK   📋 Kế hoạch  ────────────────────────→
```

### 5.2. Chi Tiết Từng Thế Giới

| # | Thế Giới | Bảng Màu | Mood | Kiến Thức Trọng Tâm | Trạng Thái |
|:---:|:---|:---|:---|:---|:---:|
| 1 | 🌳 **Khu Rừng Xanh** | `#2D5A27` `#8BC34A` `#FFD700` | Tươi mát, yên bình | Toán cơ bản + Từ vựng A-Z | ✅ Đã triển khai |
| 2 | 🌊 **Đại Dương Sâu** | `#0277BD` `#4FC3F7` `#E0F7FA` | Mát mẻ, bí ẩn | Ghép vần + Sinh vật biển | 📋 Kế hoạch |
| 3 | 🌋 **Núi Lửa Cổ Đại** | `#BF360C` `#FF6F00` `#FDD835` | Nóng bỏng, hào hùng | Bảng cửu chương + Hóa thạch | 📋 Kế hoạch |
| 4 | 🍬 **Vương Quốc Kẹo** | `#E91E63` `#CE93D8` `#FFF59D` | Ngọt ngào, vui tươi | Đo lường + Hình học | 📋 Kế hoạch |
| 5 | 🚀 **Không Gian Vũ Trụ** | `#1A237E` `#7C4DFF` `#00E5FF` | Huyền bí, phiêu lưu | Hệ Mặt Trời + Coding logic | 📋 Kế hoạch |
| 6 | 🏛️ **Đền Tri Thức** | `#F9A825` `#FFD600` `#FFFFFF` | Trang nghiêm, vinh quang | Tổng hợp tất cả | 📋 Kế hoạch |

---

## 6. CHI TIẾT 5 MÀN CHƠI — KHU RỪNG XANH (ĐÃ TRIỂN KHAI)

### Màn 1-1: 🌱 Bước Chân Đầu Tiên

| Thuộc tính | Chi tiết |
|:---|:---|
| **Kích thước bản đồ** | 80 tiles rộng × 14 tiles cao (2880 × 504 px) |
| **Mục tiêu** | Nhặt chữ cái T-R-E-E để ghép từ "TREE" |
| **Gameplay** | Platformer cơ bản: nhảy, chạy, né quái, húc hộp bí ẩn |
| **Kẻ địch** | 5 quái (3 nấm 🍄, 2 ốc sên 🐌) tuần tra trái-phải |
| **Thu thập** | 4 chữ cái, 14 xu vàng, 3 ngôi sao |
| **Hộp bí ẩn** | 7 hộp ❓ (mở quiz hoặc thưởng +5 xu) |
| **Chướng ngại** | 3 hố sâu, 4 ống nước, bậc thang gạch |
| **Story** | *"Miu bắt đầu hành trình khám phá Khu Rừng Xanh! Hãy nhặt các chữ cái T-R-E-E!"* |

```
Bản đồ thu nhỏ (ký hiệu):
.......................................................................
.............C.........C...........................................
...........[?].[B].[?]...[?].......................................
.......................................................................
.................................[P].................................
......................E..........[P]............E.................🚩
GGGGGGGGGGGGGGGGGGGGG___GGGGGGGGGGGGGGGG___GGGGGGG___GGGGGGGGGGGGGGG

C = Chữ cái    [?] = Hộp bí ẩn    [B] = Gạch    [P] = Ống nước
E = Quái nấm   G = Đất            ___ = Hố sâu   🚩 = Đích
```

---

### Màn 1-2: 🔐 Cổng Rừng Bí Ẩn

| Thuộc tính | Chi tiết |
|:---|:---|
| **Kích thước** | 90 × 14 tiles |
| **Mục tiêu** | Ghép từ "FROG" + vượt qua hố sâu & cầu treo |
| **Đặc trưng** | Bậc thang leo cao, cầu gỗ qua hố, nhiều quiz hơn |
| **Kẻ địch** | 6 quái (3 nấm 🍄, 3 sóc 🐿️) |
| **Hộp bí ẩn** | 7 hộp — trigger 5 quiz liên tiếp |
| **Story** | *"Cổng rừng đã bị khóa! Giải các câu đố ở hộp bí ẩn để mở đường!"* |

---

### Màn 1-3: 🌊 Sông Suối Trong Veo

| Thuộc tính | Chi tiết |
|:---|:---|
| **Kích thước** | 100 × 14 tiles |
| **Mục tiêu** | Ghép từ "FISH" + nhảy qua sông trên cầu gỗ nổi |
| **Đặc trưng** | 2 đoạn sông lớn (18 và 20 tiles), cầu gỗ nổi 2-tile |
| **Kẻ địch** | 5 bướm 🦋 bay tuần tra |
| **Nguy hiểm** | Rơi xuống nước = mất mạng |
| **Hộp bí ẩn** | 8 hộp với quiz khoa học |
| **Story** | *"Một con sông lớn chắn ngang! Nhảy qua cầu gỗ nổi, cẩn thận rơi nước!"* |

---

### Màn 1-4: 💎 Kho Báu Ẩn Giấu

| Thuộc tính | Chi tiết |
|:---|:---|
| **Kích thước** | 95 × 14 tiles |
| **Mục tiêu** | Ghép từ "BIRD" + tìm 6 viên đá quý 💎 ẩn |
| **Đặc trưng** | Mê cung platform dày đặc, nhiều tầng, nhiều hộp bí ẩn nhất |
| **Kẻ địch** | 7 quái (sóc, nấm, ốc sên xen kẽ, tốc độ tăng dần) |
| **Đặc biệt** | 6 viên đá quý 💎 (+250 điểm/viên), 12 hộp ❓ |
| **Thu thập** | 25 xu, 6 gem, 4 chữ cái |
| **Story** | *"Trong rừng có kho báu bí ẩn! Tìm tất cả đá quý 💎 ẩn giấu!"* |

---

### Màn 1-5: ⭐ BOSS — Cú Mèo Thông Thái 🦉

| Thuộc tính | Chi tiết |
|:---|:---|
| **Kích thước** | 60 × 14 tiles (arena nhỏ gọn) |
| **Mục tiêu** | Đánh bại Boss Cú Mèo (5 HP) bằng cách dẫm + trả lời quiz |
| **Boss Cú Mèo** | Kích thước 2.2× tile, di chuyển qua lại, 5 HP |
| **Cơ chế Boss** | Dẫm lên đầu → -1 HP + screen shake → Khi HP = 0 → Quiz Battle |
| **Quân lính** | 3 quái nấm 🍄 hỗ trợ boss |
| **Hồi máu** | 2 trái tim ❤️ ẩn trên platform cao |
| **Quiz Battle** | 5 câu hỏi tổng hợp (Toán + Anh + Khoa Học) |
| **Story** | *"🦉 Cú Mèo Thông Thái canh giữ lối ra! Trả lời đúng 5 câu đố để vượt qua!"* |

```
Arena Boss thu nhỏ:
                    [B][B][B][B][B]
        [B][B][B][B][B]         [B][B][B][B][B]
                         🦉
  [B][B][B][B][B][B][B][B][B][B]   [B][B][B][B][B][B][B][B][B][B]
                    
  🐱        🍄              🍄              🍄             🚩
  GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
```

---

## 7. HỆ THỐNG GIÁO DỤC TÍCH HỢP

### 7.1. Cơ Chế Kích Hoạt Bài Học

```
┌─────────────────┐
│ Player húc vào  │
│ hộp ❓ từ dưới  │───→ 70% xác suất ───→ MỞ QUIZ OVERLAY
│                 │         │              (game tạm dừng)
└─────────────────┘         │
                    30% xác suất ───→ THƯỞNG +5 XU
                                      (hiệu ứng coin bay)
```

### 7.2. Giao Diện Quiz

```
┌──────────────────────────────────────────┐
│          🧮 TOÁN HỌC                     │
│                                          │
│         2 + 3 = ?                        │
│                                          │
│  ┌──────────────────────────────┐        │
│  │  🍄  4                       │        │
│  └──────────────────────────────┘        │
│  ┌──────────────────────────────┐        │
│  │  ⭐  5  ← ĐÚNG              │        │
│  └──────────────────────────────┘        │
│  ┌──────────────────────────────┐        │
│  │  🍄  6                       │        │
│  └──────────────────────────────┘        │
│                                          │
│          💡 Gợi ý                        │
│                                          │
│  ┌──────────────────────────────┐        │
│  │  🎉 ĐÚNG RỒI! +200 điểm!   │        │
│  └──────────────────────────────┘        │
└──────────────────────────────────────────┘
```

### 7.3. Hệ Thống Thu Thập Chữ Cái (Spelling Coins)

- Mỗi màn có 1 **từ mục tiêu** (TREE, FROG, FISH, BIRD, OWL)
- Chữ cái nổi lơ lửng trên không, có hiệu ứng float sine wave
- Khi nhặt: giọng đọc Oxford phát âm chữ cái (`soundManager.speak(letter, 'en')`)
- Thu thập đủ → hoàn thành bonus mục tiêu

### 7.4. Phần Thưởng 3 Tầng

```
Tầng 1: Phần Thưởng Tức Thì (mỗi câu đúng / mỗi item)
   → +10 xu (coin), +100 (letter), +50 (star), +250 (gem)
   → Hiệu ứng particle, giọng khen "Giỏi lắm!"
   → HUD coin pulse animation

Tầng 2: Phần Thưởng Hoàn Thành Màn
   → 1-3 sao ⭐ dựa trên % thu thập
   → Bảng thống kê: xu, quiz đúng/tổng, tổng điểm
   → > 90% items = 3 sao, > 60% = 2 sao, còn lại = 1 sao

Tầng 3: Phần Thưởng Thế Giới (sau mỗi 5 màn)
   → Mở khóa nhân vật mới
   → Story cutscene (kế hoạch)
   → Huy hiệu thành tựu
```

### 7.5. Adaptive Difficulty (Dự Kiến Mở Rộng)

```typescript
const adaptDifficulty = (history: AnswerHistory) => {
  const accuracy = getAccuracy(history.last(10));
  if (accuracy > 0.85) return { level: currentLevel + 1 };      // Bé giỏi → khó hơn
  if (accuracy < 0.50) return { level: currentLevel - 1, showHint: true }; // Bé khó → dễ hơn + gợi ý
  return { level: currentLevel };                                 // Vừa phải → giữ nguyên
};
```

---

## 8. NGÂN HÀNG CÂU HỎI

### 8.1. Toán Học (8 câu — 3 cấp độ)

| ID | Câu hỏi | Đáp án | Cấp độ | Gợi ý |
|:---|:---|:---:|:---:|:---|
| m1 | 2 + 3 = ? | 5 | ⭐ | Đếm ngón tay nhé! |
| m2 | 7 - 4 = ? | 3 | ⭐ | Có 7 quả táo, cho bạn 4 |
| m3 | 4 + 5 = ? | 9 | ⭐ | Đếm thêm từ 4 lên 5 |
| m4 | 6 + 6 = ? | 12 | ⭐⭐ | Hai tay mỗi tay 6 ngón! |
| m5 | 10 - 7 = ? | 3 | ⭐⭐ | Từ 10 đếm ngược 7 bước |
| m6 | 3 × 4 = ? | 12 | ⭐⭐⭐ | 3 nhóm, mỗi nhóm 4 bạn |
| m7 | 8 + 7 = ? | 15 | ⭐⭐ | 8+2=10, còn thêm 5! |
| m8 | 5+5+5 = ? | 15 | ⭐⭐ | Ba nhóm 5! |

### 8.2. Tiếng Anh — Từ Vựng Oxford (7 câu)

| ID | Hình | Câu hỏi | Đáp án | Gợi ý |
|:---|:---:|:---|:---|:---|
| s1 | 🍎 | Đây là gì? | Apple | Bắt đầu bằng A |
| s2 | 🐶 | Đây là gì? | Dog | Bắt đầu bằng D |
| s3 | 🌳 | Đây là gì? | Tree | Bắt đầu bằng T |
| s4 | 🌈 | Đây là gì? | Rainbow | Rain + Bow |
| s5 | 🦋 | Đây là gì? | Butterfly | Butter + Fly |
| s6 | 🐸 | Đây là gì? | Frog | Bắt đầu bằng Fr |
| s7 | 🌻 | Đây là gì? | Sunflower | Sun + Flower |

### 8.3. Khoa Học STEM (5 câu)

| ID | Câu hỏi | Đáp án | Gợi ý |
|:---|:---|:---|:---|
| sc1 | Cây cần gì để sống? | Ánh sáng & Nước ☀️ | Cây uống nước, tắm nắng! |
| sc2 | Con nào biết bay? | Chim 🐦 | Con này có cánh! |
| sc3 | Mặt Trời là gì? | Ngôi sao ⭐ | Nó phát ra ánh sáng rất nóng! |
| sc4 | Trước khi thành bướm? | Sâu 🐛 | Nó bò trên lá! |
| sc5 | Nước nóng quá thành? | Hơi nước 💨 | Mẹ đun nước sôi thấy gì? |

---

## 9. GIAO DIỆN & TRẢI NGHIỆM NGƯỜI DÙNG

### 9.1. Các Màn Hình Chính

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  🗺️ WORLD MAP │ ──→ │ 👤 CHARACTER │ ──→ │ 📖 LEVEL     │
│  Chọn thế giới│     │    SELECT    │     │    INTRO     │
│  5 node level │     │  6 nhân vật  │     │ Story + Goal │
│  ⭐ tiến trình │     │  Lock/Unlock │     │ 3s countdown │
└──────┬───────┘     └──────────────┘     └──────┬───────┘
       │                                         │
       │         ┌──────────────┐                 │
       │         │  ⏸️ PAUSE    │                 │
       │         │  Tiếp tục   │                 │
       │         │  Chơi lại   │                 │
       │         │  Về bản đồ  │                 │
       │         └──────┬───────┘                 │
       │                │                         ▼
       │         ┌──────┴───────┐         ┌──────────────┐
       │         │  🎮 GAMEPLAY │ ←─────→ │  ❓ QUIZ     │
       │         │  60 FPS      │         │  Toán/Anh/   │
       │         │  Physics     │         │  Khoa Học    │
       │         │  Platformer  │         │  + Gợi ý    │
       │         └──────┬───────┘         └──────────────┘
       │                │
       ▼                ▼
┌──────────────┐  ┌──────────────┐
│  😢 GAME OVER│  │ 🎉 LEVEL     │
│  Chơi lại    │  │   COMPLETE   │
│  Về bản đồ   │  │ ⭐⭐⭐ Stars  │
│              │  │ Stats + Next │
└──────────────┘  └──────────────┘
```

### 9.2. HUD (Heads-Up Display)

```
┌──────────────────────────────────────────────────────────────────┐
│  ❤️❤️❤️       🪙 15       ⭐ 1240        [⏸]                     │
├──────────────────────────────────────────────────────────────────┤
│                    🔤 [T] [R] [?] [?]                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    [GAME VIEWPORT 65%]                            │
│                    Parallax 4 lớp                                │
│                    Tile rendering                                │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────┐ ┌─────┐                        ┌─────┐ ┌─────┐       │
│   │  ◀  │ │  ▶  │                        │ ⬆   │ │  ⚡  │       │
│   │     │ │     │                        │NHẢY │ │ CHẠY│       │
│   └─────┘ └─────┘                        └─────┘ └─────┘       │
│   (D-Pad 64×64px)                        (Action 64×64px)       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 9.3. Touch Controls Chi Tiết

| Nút | Kích thước | Vị trí | Hành vi |
|:---|:---|:---|:---|
| ◀ (Trái) | 64×64 dp | Góc trái dưới | `onPressIn` → di chuyển liên tục, `onPressOut` → dừng |
| ▶ (Phải) | 64×64 dp | Cạnh nút Trái | Tương tự |
| ⬆ NHẢY | 64×64 dp | Góc phải dưới | Chỉ kích hoạt 1 lần mỗi press (chống giữ nhảy liên tục) |
| ⚡ CHẠY | 64×64 dp | Cạnh nút Nhảy | Giữ để tăng tốc `RUN_SPEED` thay vì `MOVE_SPEED` |

---

## 10. ĐỒ HỌA PIXEL ART HD & PARALLAX

### 10.1. Parallax Multi-Layer Background

```
Lớp 1 (xa nhất):  Bầu trời gradient    — tốc độ cuộn: 0%  (tĩnh)
Lớp 2:            Dãy núi ⛰️🏔️           — tốc độ cuộn: 10% camera
Lớp 3:            Hàng cây 🌲🌳🌿        — tốc độ cuộn: 25% camera
Lớp 4:            Mây ☁️ trôi nhẹ        — tốc độ cuộn: 5% + auto drift
Lớp 5 (gần nhất): GAME TILES + ENTITIES  — tốc độ cuộn: 100% camera
```

### 10.2. Bảng Màu Pixel Art Forest

```
Trời:    #87CEEB  #B8E4FA  #E8F6FF   (gradient xanh nhạt)
Cỏ:     #5CD96A  #4A7C39  #3D6B2E   (xanh lá đậm → nhạt)
Đất:    #8B6914  #6B4F0A            (nâu đất)
Gạch:   #C17A3A  #9B5E28            (cam nâu)
Hộp ❓:  #FFD700  #E5A800            (vàng gold lấp lánh)
Ống:    #3CB043  #2D8B34  #5CD96A   (xanh lá ống nước)
Nước:   #4FC3F7  #0288D1            (xanh dương trong)
```

### 10.3. Tile Rendering Chi Tiết

| Tile Type | Background | Border | Hiệu ứng Đặc Biệt |
|:---|:---|:---|:---|
| `ground` | `#4A7C39` | `#3D6B2E` | Viền cỏ xanh `#5CD96A` ở đỉnh (4px) + dirt pattern |
| `brick` | `#C17A3A` | `#9B5E28` | 2 đường gạch ngang/dọc tạo pattern 4 viên gạch |
| `question` | `#FFD700` | `#E5A800` | Emoji ❓ ở giữa, bounce animation khi bị húc |
| `question` (empty) | `#8B6914` | `#5A4510` | Border pattern trống, không có ❓ |
| `pipe_top` | `#3CB043` | `#2D8B34` | Highlight strip `#5CD96A` bên trái (4px) |
| `water` | `#4FC3F7` | `#0288D1` | Opacity 0.7, ký tự `~` wave |
| `bridge` | `#8B6914` | `#6B4F0A` | Thanh gỗ ngang `#A0733D` ở giữa |
| `tree_top` | `#2D8B34` | `#5CD96A` | Emoji 🌿 |
| `bush` | `#3CB043` | `#66D96A` | Emoji 🌿 |

### 10.4. Particle Effects

| Sự kiện | Số hạt | Màu | Emoji | Hiệu ứng |
|:---|:---:|:---|:---|:---|
| Nhặt coin | 4 | `#FFD700` | 🪙 | Bay tán xạ + rơi |
| Nhặt letter | 8 | `#FF6B35` | Chữ cái | Bay + TTS phát âm |
| Nhặt star | 10 | `#FFD700` | ⭐ | Nổ lấp lánh |
| Nhặt gem | 12 | `#7C3AED` | 💎 | Nổ tím rực rỡ |
| Dẫm quái | 6 | `#FFD700` | 💫 | Nảy lên |
| Đánh boss | 10 | `#FF4757` | 💥 | Screen shake |
| Boss chết | 20 | `#FFD700` | 🏆 | Pháo hoa chiến thắng |
| Quiz đúng | 15 | `#FFD700` | ⭐ | Pháo hoa giữa màn hình |

---

## 11. CẤU TRÚC CODE & HƯỚNG DẪN MỞ RỘNG

### 11.1. File Chính

```
example/src/screens/
├── ExplorerGameScreen.tsx    ← GAME CHÍNH (~1600 dòng, self-contained)
└── KidsLauncherScreen.tsx    ← Tích hợp: import + state + handler + icon
```

### 11.2. Cấu Trúc Bên Trong ExplorerGameScreen.tsx

```typescript
// ─── TYPES & INTERFACES ─── (dòng 1-110)
//   PlayerState, TileEntity, Collectible, Enemy, QuizQuestion,
//   Particle, CharacterInfo, LevelData

// ─── PHYSICS CONSTANTS ─── (dòng 112-125)
//   PHYSICS = { GRAVITY, MAX_FALL, MOVE_SPEED, ... }

// ─── COLOR PALETTES ─── (dòng 127-170)
//   FOREST_PALETTE = { sky, ground, brick, pipe, ... }

// ─── SPRITE DATA ─── (dòng 172-210)
//   SPRITES = { cat, dog, bunny, ... }

// ─── CHARACTERS ─── (dòng 212-255)
//   CHARACTERS[] = 6 nhân vật

// ─── QUIZ QUESTION BANKS ─── (dòng 257-340)
//   MATH_QUESTIONS[], SPELLING_QUESTIONS[], SCIENCE_QUESTIONS[]

// ─── LEVEL GENERATOR ─── (dòng 342-600)
//   generateForestLevel(levelNum) → LevelData

// ─── TILE RENDERER ─── (dòng 602-620)
//   renderTile(), isSolidTile()

// ─── MAIN COMPONENT ─── (dòng 622-1600)
//   ExplorerGameScreen
//   ├── State management (phase, score, lives, ...)
//   ├── Physics update loop
//   ├── Collision detection
//   ├── Quiz handlers
//   ├── Level complete / Game over
//   └── Render functions
//       ├── World Map
//       ├── Character Select
//       ├── Level Intro
//       ├── Gameplay (viewport + controls)
//       ├── Quiz Overlay
//       ├── Level Complete
//       ├── Game Over
//       └── Pause Menu
```

### 11.3. Hướng Dẫn Thêm Màn Mới

**Bước 1:** Mở `ExplorerGameScreen.tsx`, tìm hàm `generateForestLevel()`

**Bước 2:** Thêm case mới trong object `levels`:

```typescript
6: () => {
  const W = 85; const H = 14;
  const tiles: TileEntity[] = [];
  const collectibles: Collectible[] = [];
  const enemies: Enemy[] = [];

  // 1. Tạo ground
  for (let c = 0; c < W; c++) {
    for (let r = H - 2; r < H; r++) tiles.push({ type: 'ground', col: c, row: r });
  }

  // 2. Tạo platforms, pipes, question blocks...
  // 3. Tạo collectibles (coins, letters, stars, gems)
  // 4. Tạo enemies

  return {
    id: '1-6', name: 'Tên Màn Mới',
    subtitle: 'Mô tả ngắn',
    worldWidth: W * T,
    tiles, collectibles, enemies,
    spawnPoint: { x: 2 * T, y: (H - 4) * T },
    exitPoint: { x: (W - 3) * T, y: (H - 3) * T },
    targetWord: 'LEAF',
    quizzes: [MATH_QUESTIONS[0], SPELLING_QUESTIONS[0]],
    bgLayers: [], isBossLevel: false,
    storyText: 'Câu chuyện dẫn dắt...',
  };
},
```

**Bước 3:** Cập nhật World Map render — thêm level node mới

### 11.4. Hướng Dẫn Thêm Thế Giới Mới

```typescript
// 1. Tạo hàm generator mới:
function generateOceanLevel(levelNum: number): LevelData { ... }

// 2. Tạo OCEAN_PALETTE:
const OCEAN_PALETTE = { sky: '#0277BD', water: '#4FC3F7', ... };

// 3. Thêm World selector trong World Map UI

// 4. Switch trong initLevel:
const data = currentWorld === 'forest'
  ? generateForestLevel(levelNum)
  : generateOceanLevel(levelNum);
```

### 11.5. Hướng Dẫn Thêm Câu Hỏi

```typescript
// Thêm vào mảng tương ứng ở đầu file:
MATH_QUESTIONS.push({
  id: 'm9', type: 'math',
  question: '20 - 13 = ?',
  options: [
    { label: '6', value: '6', emoji: '🍃' },
    { label: '7', value: '7', emoji: '⭐' },
    { label: '8', value: '8', emoji: '🍃' },
  ],
  correctAnswer: '7',
  hint: 'Đếm ngược từ 20!',
  difficulty: 2,
});
```

### 11.6. Hướng Dẫn Thêm Nhân Vật

```typescript
// Thêm vào mảng CHARACTERS:
{
  id: 'penguin', name: 'Chim Cánh Cụt', emoji: '🐧', color: '#37474F',
  description: 'Bạn cánh cụt trượt băng siêu nhanh',
  ability: 'Trượt nhanh trên mặt phẳng',
  unlocked: false,
  sprites: { idle: '🐧', walk1: '🐧', walk2: '🐧', jump: '🐧', hurt: '😿' },
},
```

---

## 12. LỘ TRÌNH TRIỂN KHAI (ROADMAP)

### Phase 1: Khu Rừng Xanh ✅ (Đã Hoàn Thành)
- [x] Physics Engine (gravity, AABB collision, friction, bounce)
- [x] Game Loop 60 FPS (`requestAnimationFrame`)
- [x] Camera system (smooth follow + world clamp)
- [x] Parallax 4-layer background
- [x] 5 Level Data với tilemap, enemies, collectibles
- [x] 6 Characters với unlock progression
- [x] Education Module (20 câu: Math + English + Science)
- [x] Quiz Overlay + Hint system
- [x] Boss Fight (Cú Mèo 🦉, 5HP, quiz battle)
- [x] Touch Controls (D-Pad + Jump + Run)
- [x] HUD (hearts, coins, score, target word)
- [x] World Map + Character Select + Level Intro
- [x] Level Complete (3 sao) + Game Over
- [x] Tích hợp vào KidsLauncherScreen (icon 🌍)

### Phase 2: Đại Dương Sâu Thẳm 🌊 (Kế Hoạch)
- [ ] `generateOceanLevel()` — 5 màn swimming platformer
- [ ] OCEAN_PALETTE — Bảng màu xanh dương
- [ ] Kẻ địch mới: Cá mập 🦈, Sứa 🪼, Cua 🦀
- [ ] Boss: Bạch Tuộc 🐙 (quiz nhanh)
- [ ] Cơ chế bơi (gravity giảm, di chuyển 4 hướng)
- [ ] Thêm 15 câu hỏi giáo dục mới

### Phase 3: Núi Lửa Cổ Đại 🌋 (Kế Hoạch)
- [ ] `generateVolcanoLevel()` — vertical platformer
- [ ] Cơ chế dung nham (instant death zone)
- [ ] Boss: Rồng Lửa 🐉 (bảng cửu chương)
- [ ] Puzzle jigsaw hóa thạch khủng long 🦕

### Phase 4: Vương Quốc Kẹo 🍬 (Kế Hoạch)
- [ ] Match-3 mini game + platformer hybrid
- [ ] Boss: Phù Thủy Kẹo 🧙 (phép trừ)
- [ ] Nấu ăn theo công thức (đo lường)

### Phase 5: Không Gian Vũ Trụ 🚀 (Kế Hoạch)
- [ ] Zero gravity mechanics
- [ ] Boss: Ngoài Hành Tinh 👽 (Tiếng Anh nâng cao)
- [ ] Coding blocks (Scratch Jr style)

### Phase 6: Đền Tri Thức 🏛️ (Kế Hoạch)
- [ ] Tổng hợp tất cả kiến thức
- [ ] Final Boss: Thần Tri Thức 🧠
- [ ] Vương Miện 👑 cho người hoàn thành

### Phase 7: Tính Năng Bổ Sung (Kế Hoạch)
- [ ] Cutscene hoạt hình giữa các màn
- [ ] Daily Quest & Streak system
- [ ] Pet đồng hành (ong 🐝, bướm 🦋, chim 🐦)
- [ ] Phòng Học Ảo (Knowledge Hall) — xem lại từ vựng đã học
- [ ] Đồng bộ tiến trình lên Supabase
- [ ] Báo cáo học tập cho phụ huynh qua Web Portal

---

## PHỤ LỤC

### A. Ký Hiệu Tilemap

| Ký hiệu | Loại Tile | Solid? | Emoji |
|:---:|:---|:---:|:---:|
| `ground` | Mặt đất | ✅ | — |
| `brick` | Khối gạch | ✅ | — |
| `question` | Hộp bí ẩn | ✅ | ❓ |
| `pipe_*` | Ống nước | ✅ | — |
| `bridge` | Cầu gỗ | ✅ | — |
| `water` | Mặt nước | ❌ | ~ |
| `tree_*` | Cây (trang trí) | ❌ | 🌿 |
| `bush` | Bụi cây | ❌ | 🌿 |

### B. Tile Type → Render Style

| Tile | BG Color | Border Color | Highlight |
|:---|:---|:---|:---|
| ground | `#4A7C39` | `#3D6B2E` | `#5CD96A` (cỏ) |
| brick | `#C17A3A` | `#9B5E28` | — |
| question | `#FFD700` | `#E5A800` | ❓ emoji |
| pipe | `#3CB043` | `#2D8B34` | `#5CD96A` |
| water | `#4FC3F7` | `#0288D1` | 70% opacity |
| bridge | `#8B6914` | `#6B4F0A` | `#A0733D` |

### C. So Sánh Với Các App Giáo Dục

| Tiêu chí | Khan Academy Kids | Duolingo ABC | **Bé Khám Phá TG** |
|:---|:---|:---|:---|
| Thể loại | Mini-game rời rạc | Quiz thuần text | **Adventure xuyên suốt** ✅ |
| Đồ họa | 2D vector đơn giản | 2D flat | **Pixel Art HD + Parallax** ✅ |
| Tính liên tục | Không cốt truyện | Streak system | **6 TG, 30 màn, cốt truyện** ✅ |
| Gameplay | Trung bình | Thấp | **7+ thể loại** ✅ |
| Offline | Có | Không | **Có (state local)** ✅ |
| Parental | Cơ bản | Cơ bản | **Sâu (thời gian, báo cáo)** ✅ |
| Ngôn ngữ | Anh | Anh | **Việt + Anh** ✅ |
