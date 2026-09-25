# 🎡✨ TÀI LIỆU ĐẶC TẢ THIẾT KẾ LẠI MÀN HÌNH HOME: KIDS WONDER PARK (KIDS LAUNCHER 3.0)

> **Dự án:** Kids Launcher & Educational Platform  
> **Nền tảng:** React Native (Android Launcher Home Screen)  
> **File triển khai chính:** `example/src/screens/KidsLauncherScreen.tsx`  
> **Các thành phần mới:** `example/src/data/launcherGamesRegistry.ts`, `example/src/components/launcher/*`  
> **Phong cách đồ họa:** Toy Cartridge 3D / Glassmorphism / Nintendo Switch & Google Kids Space UX  
> **Đối tượng người dùng:** Trẻ em 3 – 12 tuổi (Mầm non & Tiểu học) & Phụ huynh quản lý  
> **Ngày lập:** 16/09/2026  
> **Trạng thái:** Đặc tả kiến trúc & Triển khai mã nguồn (Approved Specification)

---

## 📌 1. TỔNG QUAN & TRIẾT LÝ THIẾT KẾ "KIDS WONDER PARK"

### 1.1. Bối cảnh & Điểm nghẽn phiên bản cũ (v2.0)
Màn hình Home của launcher ở phiên bản 2.0 hoạt động như một danh sách ứng dụng Android thông thường:
1. **Quá tải thị giác (Visual Overload)**: Hơn 30 tựa game nội bộ, 2 ứng dụng video an toàn (Green Tube, Safe YouTube) và các ứng dụng Android bên ngoài bị dồn chung vào một lưới `FlatList` duy nhất.
2. **Thiếu điểm nhấn (No Visual Hierarchy)**: Mọi icon đều có kích thước như nhau (64x64), không có tựa game nổi bật trong ngày, không có banner giới thiệu.
3. **Khó tìm kiếm cho trẻ nhỏ**: Các bé từ 3–6 tuổi chưa biết đọc chữ thành thạo, gặp khó khăn khi phải lướt qua hàng chục icon để tìm trò chơi mình thích.
4. **Mã nguồn monolithic**: File `KidsLauncherScreen.tsx` phình to hơn **2.300 dòng**, chứa 28 biến `useState(showXGame)` riêng rẽ và hàng trăm dòng `if (isGameX)` trùng lặp.

### 1.2. Tầm nhìn phiên bản 3.0 "Kids Wonder Park"
Biến màn hình Home thành một **"Công Viên Kỳ Diệu Của Bé"**:
* **Trực quan & Dễ dàng**: Phân chia theo 6 danh mục chủ đề lớn (🌟 Tất cả, 🎴 Khám phá, 🎮 Trí tuệ, 🎨 Sáng tạo, 📺 Video, 📱 Ứng dụng ngoài) với icon to rõ ràng.
* **Game hóa (Gamification)**: Widget hiển thị sao thưởng ⭐, avatar linh vật của bé, đếm ngược thời gian chơi trong ngày ⏳, và Banner nhiệm vụ hôm nay.
* **Thẻ trò chơi 3D (Toy Cartridge Cards)**: Thay thế icon tròn phẳng bằng thẻ đồ chơi bo góc 22px nổi khối, có hiệu ứng nảy lò xo khi chạm và âm thanh vui nhộn.
* **Thanh Bottom Dock cố định**: Truy cập tức thì 4-5 tựa game chủ đạo bất cứ lúc nào.
* **Kiến trúc Clean Architecture**: Tách rời dữ liệu trò chơi (`launcherGamesRegistry.ts`), quản lý router tập trung qua 1 state `activeGameId`.

---

## 🎨 2. SƠ ĐỒ BỐ CỤC GIAO DIỆN (UI WIREFRAME & ARCHITECTURE)

```
+-----------------------------------------------------------------------------------------+
|  [👦 Avatar Bé + Tên]   ⭐ 125 Sao   ⏳ Còn 35 phút              [🎨 Theme] [🔒 Phụ Huynh] | <- 1. SMART HEADER
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|   +---------------------------------------------------------------------------------+   |
|   |  🎡 HERO CAROUSEL: "KHÁM PHÁ HÔM NAY"                                           |   | <- 2. HERO BANNER
|   |  🦁 Thẻ Bài 3D Đời Thật: "Học 5 loài động vật mới"                               |   |    (Tự động đổi)
|   |  [ CHƠI NGAY ▶ ] (Thưởng: 1 Gói Thẻ Vàng)               [ Minh họa 3D nổi bật ] |   |
|   +---------------------------------------------------------------------------------+   |
|                                                                                         |
|   [ 🌟 Tất cả ]  [ 🎴 Học tập ]  [ 🎮 Trí tuệ ]  [ 🎨 Sáng tạo ]  [ 📺 Video ]  [ 📱 App ]  | <- 3. CATEGORY TABS
|                                                                                         |
|   +-------------------+  +-------------------+  +-------------------+  +--------------+ |
|   |  🌿 Nature Spec.  |  |  🎴 Flashcard 3D  |  |  🚀 Phi Hành Gia  |  | 🐾 Chăm Thú  | | <- 4. 3D TOY CARDS
|   |  ★ Khám phá 100%  |  |  ★ 3D Đời Thật    |  |  ★ 60s Siêu Tốc   |  | ★ Level 2    | |    (Hiệu ứng lò xo,
|   |  [ Gradient Xanh ]|  |  [ Gradient Vàng ]|  |  [ Gradient Tím ] |  | [ Gradient ] | |     badge nổi bật)
|   +-------------------+  +-------------------+  +-------------------+  +--------------+ |
|                                                                                         |
+-----------------------------------------------------------------------------------------+
|     [ 🎴 Flashcard ]       [ 🌿 Bách Thảo ]       [ 📺 GreenTube ]       [ 🎨 Tô Màu ]     | <- 5. BOTTOM DOCK
+-----------------------------------------------------------------------------------------+
```

---

## 🧩 3. CHI TIẾT 5 KHU VỰC CHỨC NĂNG

### 3.1. Smart Header (Thanh Điều Khiển Thông Minh)
* **Avatar & Lời chào cá nhân hóa**:
  * Hiển thị avatar tròn của bé (chọn giữa: Bé Tom, Bé MiMi, Gấu trúc, Khủng long).
  * Chạm vào Avatar: Kích hoạt âm thanh chào hỏi vui nhộn (`SoundPlayer`).
* **Widget Thời Gian Còn Lại (Time Glance)**:
  * Hiển thị biểu tượng đồng hồ cát và số phút bé được phép sử dụng trong ngày (ví dụ `⏳ Còn 35 phút`).
  * Khi còn dưới 10 phút, đổi màu sang cam/vàng để nhắc bé chuẩn bị nghỉ ngơi.
* **Widget Sao Thưởng (Star Wallet)**:
  * Hiển thị tổng số sao vàng bé đã tích lũy được từ các trò chơi (`⭐ 125`).
* **Nút Chế Độ Phụ Huynh (Parent Lock)**:
  * Biểu tượng chiếc khiên hoặc ổ khóa vàng 🔒 nổi bật.
  * Nhấn vào sẽ hiển thị `ParentPinModal` với bài toán bảo vệ (hoặc mã PIN) để truy cập cài đặt phụ huynh.
* **Nút Đổi Giao Diện**:
  * Nút nhỏ gọn `🎨` mở bảng chọn Theme rực rỡ và hình nền sinh động.

### 3.2. Hero Banner (Banner Điểm Nhấn "Khám Phá Hôm Nay")
* Tự động đề xuất 1 trong 3 game nổi bật hoặc hiển thị **Nhiệm Vụ Hàng Ngày (Daily Quest)**:
  1. *🦁 Thẻ Bài 3D Đời Thật* – "Bé hãy khám phá 5 loài động vật hoang dã mới!"
  2. *🌿 Nhà Sinh Học Nhí* – "Thực hiện phóng to ngắm sâu bướm và cho cây bắt mồi ăn!"
  3. *🚀 Phi Hành Gia Nhí* – "Lái tàu vũ trụ vượt 500 điểm trong 60 giây!"
* Nút bấm lớn hình viên thuốc phát sáng: **"CHƠI NGAY ▶"** với animation nhấp nhô nhẹ thu hút sự chú ý của bé.

### 3.3. Category Tabs (Thanh Phân Loại 6 Danh Mục Trực Quan)
Thanh cuộn ngang với nút bấm lớn hình vòm mềm mại (pill button):
1. **🌟 Tất cả (All)**: Hiển thị toàn bộ kho ứng dụng và trò chơi.
2. **🎴 Học tập & Tự nhiên (Learn & Nature)**: Thẻ Flashcard 3D, Nature Explorer, Học Toán, Ghép Vần, Vũ Trụ Solar System, Khám Phá Châu Lục, Bốn Mùa.
3. **🎮 Trí tuệ & Câu đố (Brain & Puzzle)**: Lật thẻ Trí nhớ, Xếp hình Jigsaw, Tangram, Mê cung, Nối điểm, Robot Coder, Rắn săn mồi, Nổ bóng, Bóng hình.
4. **🎨 Sáng tạo & Thói quen (Creative & Life)**: Bé tập tô màu, Đàn Xylophone, Chăm sóc thú cưng, Thời trang thời tiết, Vườn cây tí hon, Thói quen đánh răng, Vườn cảm xúc.
5. **📺 Video an toàn (Kids Video)**: Green Kids Tube, Safe YouTube.
6. **📱 Ứng dụng ngoài (Allowed Apps)**: Các ứng dụng Android do cha mẹ cấp phép cài đặt trên máy.

### 3.4. 3D Toy Cards (Thẻ Trò Chơi Đồ Chơi 3D)
* **Kích thước & Kiểu dáng**:
  * Thiết kế hình khối chữ nhật đứng (tỷ lệ 1:1.15) bo tròn góc 22px (`squircle`).
  * Nền thẻ: Gradient đa tầng hoặc màu rực rỡ theo tông màu nhận diện của từng game.
  * Hiệu ứng đổ bóng 3D: Đổ bóng màu (`shadowColor` tương ứng màu game, `elevation: 6`).
* **Biểu tượng nổi khối**:
  * Icon emoji/hình ảnh 3D đặt trong đĩa đệm tròn nổi (embossed badge) kích thước lớn (46px).
* **Tương tác chạm (Micro-interactions)**:
  * Khi bé bấm vào: Thẻ lún xuống nhẹ (`scale: 0.93`), phát âm thanh "bloop/pop" vui nhộn.
  * Khi buông tay: Nảy lò xo bung nở và mở game mượt mà.
* **Huy hiệu thành tích (Corner Badge)**:
  * Huy hiệu góc phải: `🔥 HOT`, `✨ MỚI`, hoặc đánh giá `★★★`.

### 3.5. Quick Bottom Dock (Thanh Truy Cập Nhanh Cố Định)
* Nằm cố định ở đáy màn hình với nền kính mờ mờ ảo (Glassmorphism `rgba(255,255,255,0.85)` ở theme sáng hoặc `rgba(20,25,45,0.85)` ở theme tối).
* Ghim cố định **4 tựa game cốt lõi & được yêu thích nhất**:
  1. 🎴 **Flashcard 3D** (Học từ vựng đời thật)
  2. 🌿 **Tự Nhiên** (Nature Explorer)
  3. 📺 **GreenTube** (Video thiếu nhi chọn lọc)
  4. 🎨 **Tô Màu** (Góc nghệ thuật của bé)
* Cho phép bé truy cập tức thì mà không cần cuộn tìm lại trên danh sách dài.

---

## 🏗️ 4. KIẾN TRÚC MÃ NGUỒN & MODULE HÓA (CLEAN CODE)

### 4.1. File Registry Tập Trung: `launcherGamesRegistry.ts`
Toàn bộ danh sách 26+ game nội bộ được định nghĩa cấu trúc:
```typescript
export interface LauncherGameItem {
  id: string;             // Ví dụ: 'internal.game.flashcards'
  title: string;          // Ví dụ: 'Thẻ Bài 3D'
  category: 'learn' | 'puzzle' | 'creative' | 'video';
  iconEmoji: string;      // Ví dụ: '🎴'
  colors: [string, string]; // Gradient nền ví dụ: ['#FF6B08', '#FF8E53']
  badge?: string;         // 'HOT' | 'MỚI' | '3D'
  description?: string;   // 'Học từ vựng song ngữ 3D đời thật'
  rating?: number;        // 5
}
```

### 4.2. Bộ Sub-Components chuyên biệt
1. `example/src/components/launcher/LauncherHeader.tsx`: Quản lý Avatar, Widget giờ, Widget sao, nút Theme và nút Parent Gate.
2. `example/src/components/launcher/LauncherHeroBanner.tsx`: Hiển thị Banner đề xuất game trong ngày kèm nút "CHƠI NGAY".
3. `example/src/components/launcher/LauncherCategoryTabs.tsx`: Thanh tab lọc danh mục dạng pill cuộn ngang.
4. `example/src/components/launcher/LauncherGameCard.tsx`: Thẻ bài game 3D tương tác cảm ứng có animation scale.
5. `example/src/components/launcher/LauncherBottomDock.tsx`: Thanh Dock đáy kính mờ cố định.

### 4.3. Tái cấu trúc Router trong `KidsLauncherScreen.tsx`
Thay thế 28 biến `showXGame` rườm rà bằng 1 biến router duy nhất:
```typescript
const [activeAppId, setActiveAppId] = useState<string | null>(null);

// Mở game/app cực kỳ tinh gọn:
const handleLaunchApp = (packageName: string) => {
  if (isLocked) {
    Alert.alert('Thiết bị đang bị khóa', lockReason);
    return;
  }
  if (packageName.startsWith('internal.')) {
    setActiveAppId(packageName);
    return;
  }
  // Mở app bên ngoài qua native module:
  RNLauncherKitHelper.launchApplication(packageName);
};
```
