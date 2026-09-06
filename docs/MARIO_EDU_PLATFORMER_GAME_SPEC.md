# ĐẶC TẢ THIẾT KẾ VÀ PHÁT TRIỂN GAME "BÉ MARIO HỌC TẬP" (2D PLATFORMER NATIVE)
*Tài liệu hướng dẫn kỹ thuật dành cho Kids Launcher Ecosystem - Phiên bản 1.0*

---

## 1. TỔNG QUAN DỰ ÁN

### 1.1. Mục tiêu & Định vị
- **Tên trò chơi:** Bé Mario Khám Phá (*Mario Learning Adventure*).
- **Thể loại:** 2D Side-Scrolling Platformer (Đi cảnh cuộn màn hình ngang phong cách Super Mario).
- **Nền tảng:** React Native Native (chạy trực tiếp trong hệ sinh thái launcher, không phụ thuộc trình duyệt bên ngoài hay WebView nặng).
- **Mục tiêu giáo dục:** Biến các thử thách vượt chướng ngại vật kinh điển của Mario thành hành trình học tập bổ ích (nhặt chữ cái ngữ âm, húc hộp bí ẩn `?` để giải đố toán học, vượt cạm bẫy để mở khóa từ vựng tiếng Anh Oxford).

### 1.2. Tại sao chọn Phong cách Native thay vì WebView?
| Tiêu chí | Hướng 1: Native React Native (Được chọn) | Hướng 2: Nhúng WebView HTML5 |
| :--- | :--- | :--- |
| **Tốc độ khởi động** | Tức thì (**< 0.1 giây**) | Trễ 1 - 2.5 giây khởi tạo WebView |
| **Tiêu tốn RAM** | Rất thấp (**~10MB**) | Khá cao (**~40MB - 60MB**) |
| **Khả năng lồng ghép bài học** | Tùy biến 100% (Hiện đố vui toán, từ vựng) | Rất khó can thiệp vào logic game có sẵn |
| **Hệ thống âm thanh** | Dùng trực tiếp `SoundPlayer` và TTS bản ngữ | Dễ bị lỗi âm thanh nền trên Android TV / LDPlayer |
| **Độ mượt (FPS)** | 60 FPS ổn định qua `requestAnimationFrame` | Có thể bị giật lag nếu giả lập yếu |

---

## 2. KIẾN TRÚC HỆ THỐNG & VẬT LÝ GAME (PHYSICS ENGINE)

### 2.1. Sơ đồ kiến trúc Module
```
┌──────────────────────────────────────────────────────────────────┐
│                   KidsLauncherScreen (Menu Game)                 │
└─────────────────────────────────┬────────────────────────────────┘
                                  │ (Mở game)
                                  ▼
┌──────────────────────────────────────────────────────────────────┐
│                      MarioEduGameScreen.tsx                      │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │  HUD: Tim máu ❤️ | Điểm ⭐ | Tiền xu 🪙 | Chữ cái nhặt được 🔤│ │
│ ├──────────────────────────────────────────────────────────────┤ │
│ │                  VÙNG CAMERA GAMEPLAY 60 FPS                 │ │
│ │   [Camera Offset X] cuộn theo vị trí Mario                   │ │
│ │   - Render Tiles: Đất, Gạch, Ống nước, Hộp [ ? ]             │ │
│ │   - Render Entities: Mario, Quái nấm Goomba, Ngôi sao        │ │
│ ├──────────────────────────────────────────────────────────────┤ │
│ │                 CỤM PHÍM ĐIỀU KHIỂN CẢM ỨNG                  │ │
│ │   [ ◀ ] [ ▶ ] (D-Pad Trái / Phải)     [ ⚡ B ]  [ ⬆ A ] (Nhảy)│ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                 │                                │
│         ┌───────────────────────┴────────────────────────┐       │
│         ▼                                                ▼       │
│ ┌──────────────────────┐                     ┌─────────────────┐ │
│ │   marioPhysics.ts    │                     │  marioLevels.ts │ │
│ │ - Game Loop (Tick)   │                     │ - Tilemaps      │ │
│ │ - AABB Collision     │                     │ - Vị trí quái   │ │
│ │ - Trọng lực & Ma sát │                     │ - Câu đố trí tuệ│ │
│ └──────────────────────┘                     └─────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. CƠ CHẾ VẬT LÝ & VA CHẠM (CORE MECHANICS)

### 3.1. Hằng số vật lý (Physics Constants)
```typescript
export const MARIO_PHYSICS = {
  GRAVITY: 0.58,              // Gia tốc trọng trường kéo Mario rơi xuống
  MAX_FALL_SPEED: 12.0,       // Vận tốc rơi tối đa (terminal velocity)
  MOVE_SPEED: 4.2,            // Tốc độ di chuyển đi bộ thông thường
  RUN_SPEED: 6.8,             // Tốc độ khi giữ nút [B] (chạy nhanh)
  ACCELERATION: 0.35,         // Độ tăng tốc mượt mà
  FRICTION: 0.82,             // Ma sát khi dừng lại (không bị khựng đột ngột)
  JUMP_FORCE: -13.2,          // Lực bật nhảy ban đầu
  BOUNCE_FORCE: -8.5,         // Lực nảy lên khi dẫm đạp trúng đầu quái
  TILE_SIZE: 40,              // Kích thước mỗi ô vuông bản đồ (px)
};
```

### 3.2. Thuật toán phát hiện va chạm AABB (Axis-Aligned Bounding Box)
Mỗi đối tượng (Mario, khối gạch, quái) được định nghĩa bởi một hộp chữ nhật:
$$\text{Box} = \{x, y, \text{width}, \text{height}\}$$

#### A. Va chạm mặt đất (Ground Collision)
Khi Mario rơi xuống:
- Nếu chân Mario chạm vào đỉnh khối đất:
  - Cập nhật `mario.y = tile.top - mario.height`.
  - Đặt `mario.vy = 0` và `isGrounded = true`.

#### B. Va chạm húc đầu khối gạch / hộp bí ẩn `?` (Ceiling / Block Bump)
- Khi `mario.vy < 0` (đang nhảy lên) và đỉnh đầu Mario va vào đáy của khối `[ ? ]`:
  - Khối `?` nảy nhẹ lên trên 6px rồi rơi lại vị trí cũ.
  - Chuyển trạng thái khối `?` thành `[ Empty ]` (khối rỗng màu nâu).
  - Kích hoạt sự kiện: Bắn ra 1 đồng xu hoặc mở ra một **Câu hỏi thử thách học tập**.

#### C. Tương tác với quái nấm Goomba
- **Trường hợp 1 (Đạp bẹp quái):**
  - Điều kiện: Đáy Mario va vào nửa trên của quái nấm khi Mario đang rơi (`mario.vy > 0`).
  - Kết quả: Quái nấm bị xẹp (hiển thị sprite dẹp 300ms rồi biến mất), Mario nảy bật lên trên (`mario.vy = BOUNCE_FORCE`), cộng +100 điểm.
- **Trường hợp 2 (Va vào thân quái):**
  - Điều kiện: Mario chạm vào hông hoặc chân quái khi không ở tư thế dẫm từ trên xuống.
  - Kết quả: Mario bị giật lùi lại, mất 1 tim ❤️, chớp nháy bất tử trong 1.5 giây.

---

## 4. TÍCH HỢP TÍNH NĂNG GIÁO DỤC CHO BÉ (LEARNING ADVENTURE)

Không chỉ là một game giải trí đơn thuần, trò chơi được thiết kế nhằm kích thích trí não của trẻ nhỏ qua 3 hình thức:

### 4.1. Hộp Bí Ẩn Câu Đố (Math & Vocab Mystery Box)
- Khi Mario húc vào hộp có dấu hỏi chấm vàng `❓`:
  - Game tạm dừng vật lý nhẹ trong tích tắc.
  - Một popup hoạt hình mini xuất hiện:
    - **Chế độ Toán học:** Hiển thị phép tính trực quan: `"2 + 3 = ?"` kèm 3 quả nấm mang số `4`, `5`, `6`. Bé chạm vào số đúng để nhận Ngôi Sao Bất Tử (Invincible Star) chạy băng băng qua mọi kẻ địch trong 8 giây!
    - **Chế độ Từ vựng:** Hiển thị hình ảnh con vật (ví dụ: quả táo `🍎`) và hỏi: `"Apple nghĩa là gì?"`. Bé chọn đúng sẽ được thưởng 5 đồng xu vàng!

### 4.2. Thu thập chữ cái vần (Spelling Coins)
- Dọc đường đi, các chữ cái nổi (A, B, C, D, ...) được treo lơ lửng trên không.
- Khi Mario nhảy ăn từng chữ cái, giọng đọc chuẩn của Oxford sẽ phát âm to rõ chữ đó (ví dụ: *"A - Apple!"*). Thu thập đủ chữ cái trong từ mục tiêu sẽ được thưởng Cúp Chiến Thắng ở cuối màn.

---

## 5. THIẾT KẾ MÀN CHƠI MẪU (LEVEL DESIGN)

Bản đồ được biểu diễn dưới dạng mảng 2 chiều trực quan, dễ dàng mở rộng thêm màn mới:

```typescript
// Ký hiệu Tile:
// '.' = Không khí (Air)
// 'G' = Mặt đất (Ground)
// 'B' = Khối gạch nâu (Brick)
// '?' = Khối dấu chấm hỏi bí ẩn (Question Block)
// 'P' = Ống nước xanh (Pipe)
// 'E' = Quái nấm (Enemy Goomba)
// 'C' = Chữ cái tiếng Anh (Letter Coin)
// 'F' = Cột cờ đích đến (Finish Flagpole)

export const LEVEL_1_TILES = [
  "....................................................................",
  "....................................................................",
  "...................C.........C......................................",
  "..............[?].[B].[?]...[?].....................................",
  "....................................................................",
  ".................................[P]................................",
  "......................E..........[P]............E.................F.",
  "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
  "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG"
];
```

---

## 6. GIAO DIỆN & TRẢI NGHIỆM ĐIỀU KHIỂN (TOUCH CONTROLS)

Để trẻ nhỏ từ 3 - 10 tuổi chơi một cách tự nhiên nhất trên máy tính bảng hoặc điện thoại:

```
┌──────────────────────────────────────────────────────────────────┐
│  ❤️ x 3       🪙 15       ⭐ 240       Màn: 1-1       [ ⏸ Tạm dừng ]│
│                                                                  │
│                                                                  │
│                        [GAME VIEWPORT]                           │
│                                                                  │
│                                                                  │
│                                                                  │
│   ┌───────┐                                          ┌─────────┐ │
│   │ ◀   ▶ │                                          │  ( A )  │ │
│   │ D-PAD │                                          │  NHẢY   │ │
│   └───────┘                                          └─────────┘ │
│  (Đi Trái / Phải)                                    ┌─────────┐ │
│                                                      │  ( B )  │ │
│                                                      │  TĂNG TỐC│ │
│                                                      └─────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

1. **D-Pad trái/phải lớn, bo tròn:** Cảm ứng nhạy (`onPressIn` / `onPressOut`), bé có thể giữ ngón tay để Mario chạy liên tục.
2. **Nút Nhảy (A) to rõ:** Đặt ở vị trí ngón cái tay phải, có độ đàn hồi haptic nhẹ.
3. **Nút Tăng tốc / Tương tác (B):** Giúp Mario chạy nhanh hơn hoặc bắn đạn lửa khi ăn được hoa lửa.

---

## 7. CẤU TRÚC CODE THỰC THI (IMPLEMENTATION SKELETON)

### 7.1. Cấu trúc Game Loop 60 FPS trong React Native
```typescript
import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const MarioEduGameScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  // Trạng thái Mario
  const marioRef = useRef({
    x: 80,
    y: 200,
    vx: 0,
    vy: 0,
    width: 36,
    height: 48,
    isGrounded: false,
    facing: 'right' as 'left' | 'right',
  });

  // Camera Offset
  const cameraX = useRef(0);

  // Phím điều khiển
  const inputRef = useRef({ left: false, right: false, jump: false, run: false });
  const animFrameId = useRef<number | null>(null);

  // Vòng lặp chính 60 FPS
  useEffect(() => {
    let lastTime = performance.now();

    const gameLoop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      updatePhysics(dt);
      updateCamera();
      renderFrame();

      animFrameId.current = requestAnimationFrame(gameLoop);
    };

    animFrameId.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  const updatePhysics = (dt: number) => {
    const m = marioRef.current;
    const inp = inputRef.current;

    // 1. Di chuyển ngang
    if (inp.left) {
      m.vx = inp.run ? -MARIO_PHYSICS.RUN_SPEED : -MARIO_PHYSICS.MOVE_SPEED;
      m.facing = 'left';
    } else if (inp.right) {
      m.vx = inp.run ? MARIO_PHYSICS.RUN_SPEED : MARIO_PHYSICS.MOVE_SPEED;
      m.facing = 'right';
    } else {
      m.vx *= MARIO_PHYSICS.FRICTION;
      if (Math.abs(m.vx) < 0.1) m.vx = 0;
    }

    // 2. Nhảy
    if (inp.jump && m.isGrounded) {
      m.vy = MARIO_PHYSICS.JUMP_FORCE;
      m.isGrounded = false;
    }

    // 3. Trọng lực
    m.vy += MARIO_PHYSICS.GRAVITY;
    if (m.vy > MARIO_PHYSICS.MAX_FALL_SPEED) m.vy = MARIO_PHYSICS.MAX_FALL_SPEED;

    m.x += m.vx;
    m.y += m.vy;

    // 4. Kiểm tra va chạm sàn tạm thời (giả định mặt đất ở y = 280)
    const groundY = 280;
    if (m.y >= groundY) {
      m.y = groundY;
      m.vy = 0;
      m.isGrounded = true;
    }
  };

  const updateCamera = () => {
    // Camera bám theo Mario khi Mario đi quá 40% màn hình
    const targetCamX = marioRef.current.x - SCREEN_WIDTH * 0.4;
    if (targetCamX > cameraX.current) {
      cameraX.current = targetCamX;
    }
  };

  // ... (Giao diện và phím điều khiển)
};
```

---

## 8. LỘ TRÌNH TRIỂN KHAI (ROADMAP)

- [ ] **Giai đoạn 1: Engine Cốt Lõi**
  - Xây dựng file `MarioEduGameScreen.tsx`.
  - Cài đặt Game Loop 60 FPS qua `requestAnimationFrame`.
  - Hệ thống va chạm AABB chuẩn cho Mario với nền đất và ống nước.
- [ ] **Giai đoạn 2: Tương tác Khối Gạch & Kẻ Địch**
  - Xử lý húc gạch `?` nảy đồng xu.
  - Quái nấm Goomba đi tuần tra trái phải, dẫm bẹp quái.
- [ ] **Giai đoạn 3: Tích hợp Giáo Dục (EdTech Modules)**
  - Popup câu đố Toán học và Từ vựng khi húc trúng khối đặc biệt.
  - Tích hợp giọng phát âm chuẩn qua `soundManager`.
- [ ] **Giai đoạn 4: Đăng ký vào Kids Launcher**
  - Thêm icon "Bé Mario Khám Phá" vào danh sách ứng dụng trong `KidsLauncherScreen.tsx`.
  - Tối ưu bộ nhớ và kiểm thử trên giả lập LDPlayer.
