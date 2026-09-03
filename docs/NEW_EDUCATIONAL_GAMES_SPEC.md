# 🎮 TÀI LIỆU ĐẶC TẢ 10 TRÒ CHƠI GIÁO DỤC CHO TRẺ (KIDS EDTECH EXPANSION SPEC)

> **Tài liệu đặc tả kiến trúc, luật chơi và kế hoạch phát triển 10 trò chơi giáo dục mới** tích hợp vào **React Native Launcher Kit**.
> 
> *Định hướng phương pháp giáo dục:* **Montessori**, **STEM & Coding Logic**, **Trí tuệ cảm xúc (EQ)**, **Rèn luyện thói quen tự lập (Life Skills)** và **Cảm thụ nghệ thuật & âm nhạc**.

---

## 📑 MỤC LỤC
1. [Tổng Quan & Triết Lý Giáo Dục](#1-tổng-quan--triết-lý-giáo-dục)
2. [Chi Tiết 10 Trò Chơi Mới](#2-chi-tiết-10-trò-chơi-mới)
   - [Game 1: 🤖 Lập Trình Robot Tí Hon (Little Robot Coder)](#game-1--lập-trình-robot-tí-hon-little-robot-coder)
   - [Game 2: 👥 Khu Vườn Cảm Xúc (Emotional Garden - EQ)](#game-2--khu-vườn-cảm-xúc-emotional-garden---eq)
   - [Game 3: 👥 Chiếc Bóng Kỳ Diệu (Shadow Matching)](#game-3--chiếc-bóng-kỳ-diệu-shadow-matching)
   - [Game 4: 🔍 Tìm Điểm Khác Biệt (Spot the Differences)](#game-4--tìm-điểm-khác-biệt-spot-the-differences)
   - [Game 5: 🎹 Đàn Xylophone 7 Sắc Cầu Vồng (Kids Xylophone)](#game-5--đàn-xylophone-7-sắc-cầu-vồng-kids-xylophone)
   - [Game 6: 🌱 Bé Làm Vườn & Nông Trại Vui Vẻ (Little Gardener)](#game-6--bé-làm-vườn--nông-trại-vui-vẻ-little-gardener)
   - [Game 7: 👗 Thời Tiết & Trang Phục (Weather & Dress Up)](#game-7--thời-tiết--trang-phục-weather--dress-up)
   - [Game 8: ⚖️ Chiếc Cân Thăng Bằng (Balance Scale Physics)](#game-8--chiếc-cân-thăng-bằng-balance-scale-physics)
   - [Game 9: 🪐 Du Hành Hệ Mặt Trời (Solar System Journey)](#game-9--du-hành-hệ-mặt-trời-solar-system-journey)
   - [Game 10: 🦷 Bé Vui Đánh Răng & Thói Quen Tốt (Daily Habits)](#game-10--bé-vui-đánh-răng--thói-quen-tốt-daily-habits)
3. [Kiến Trúc Kỹ Thuật & Cấu Trúc File Code](#3-kiến-trúc-kỹ-thuật--cấu-trúc-file-code)
4. [Kế Hoạch Triển Khai (Roadmap)](#4-kế-hoạch-triển-khai-roadmap)

---

## 1. TỔNG QUAN & TRIẾT LÝ GIÁO DỤC

Hệ thống trò chơi được thiết kế nhằm mục tiêu:
1. **Không gây nghiện tiêu cực:** Không sử dụng các cơ chế kích thích độc hại (dark patterns), giới hạn thời gian chơi thông minh qua Parental Control.
2. **Âm thanh & Giọng đọc thân thiện:** Sử dụng tiếng Việt chuẩn, lời khen tích cực khích lệ tư duy tự lập của trẻ.
3. **Hiệu ứng trực quan hấp dẫn (Visual Feedback):** Tương tác vật lý nhạy bén, màu sắc tươi sáng, hạt pháo hoa sao lấp lánh (Particle VFX).

---

## 2. CHI TIẾT 10 TRÒ CHƠI MỚI

---

### Game 1: 🤖 Lập Trình Robot Tí Hon (Little Robot Coder)
* **Độ tuổi:** 4 – 9 tuổi
* **Lĩnh vực:** STEM / Tư duy thuật toán & định hướng không gian.
* **Mục tiêu:** Giúp trẻ hiểu được khái niệm về chuỗi câu lệnh (Sequence) và gỡ lỗi (Debugging).
* **Gameplay:**
  - Bản đồ lưới $5 \times 5$ hoặc $6 \times 6$ có chướng ngại vật (đá, sông nước) và các ngôi sao cần nhặt.
  - Bé kéo các khối lệnh: `⬆️ Tiến 1 ô`, `⬇️ Lùi 1 ô`, `⬅️ Xoay trái`, `➡️ Xoay phải`, `🌟 Nhặt sao`.
  - Nhấn nút **"Chạy Lệnh 🚀"**, Robot sẽ di chuyển theo từng bước đã xếp.
  - Nếu thành công: Robot ăn mừng bằng điệu nhảy vui nhộn.
* **Tệp dự kiến:** `src/screens/RobotCoderGameScreen.tsx`

---

### Game 2: 👥 Khu Vườn Cảm Xúc (Emotional Garden - EQ)
* **Độ tuổi:** 3 – 7 tuổi
* **Lĩnh vực:** Trí tuệ cảm xúc (EQ) / Kỹ năng xã hội.
* **Mục tiêu:** Giúp trẻ nhận biết, gọi tên 6 cảm xúc cơ bản và học cách thấu hiểu người khác.
* **Gameplay:**
  - Tình huống minh họa hoạt hình: *Bạn cún bị ướt mưa*, *Bạn mèo được ăn bánh ngon*, *Bạn gấu làm vỡ đồ chơi*.
  - Bé chọn khuôn mặt cảm xúc đúng: `Vui Vẻ 😊`, `Buồn Bã 😢`, `Ngạc Nhiên 😲`, `Tức Giận 😡`, `Sợ Hãi 😨`, `Tự Hào 😎`.
  - Giọng đọc giải thích nguyên nhân và đưa ra lời khuyên: *"Khi bạn buồn, chúng mình hãy ôm bạn một cái nhé!"*.
* **Tệp dự kiến:** `src/screens/EmotionGardenGameScreen.tsx`

---

### Game 3: 👥 Chiếc Bóng Kỳ Diệu (Shadow Matching)
* **Độ tuổi:** 2 – 5 tuổi
* **Lĩnh vực:** Quan sát thị giác / Hình học không gian Montessori.
* **Mục tiêu:** Nhận biết hình dáng đường bao, phát triển khả năng so sánh đối chiếu vật thể.
* **Gameplay:**
  - Xuất hiện 3–4 chiếc bóng đen của các con vật, phương tiện giao thông hoặc đồ dùng gia đình.
  - Bên dưới là các hình màu sinh động. Bé kéo thả hình màu khớp vào bóng đen tương ứng.
  - Khi thả đúng: Hình ảnh sáng bừng lên, phát âm thanh chân thực (tiếng còi tàu xe lửa, tiếng chim hót) kèm tên tiếng Việt & tiếng Anh.
* **Tệp dự kiến:** `src/screens/ShadowMatchingGameScreen.tsx`

---

### Game 4: 🔍 Tìm Điểm Khác Biệt (Spot the Differences)
* **Độ tuổi:** 4 – 10 tuổi
* **Lĩnh vực:** Tập trung thị giác / Rèn luyện tính kiên trì.
* **Mục tiêu:** Nâng cao khả năng phân tích chi tiết hình ảnh và trí nhớ ngắn hạn.
* **Gameplay:**
  - Hai bức tranh hoạt hình đặt cạnh nhau với 3 đến 5 chi tiết khác nhau (màu áo, hình đám mây, chú chim trên cây...).
  - Bé chạm vào điểm khác biệt: Vòng tròn ngôi sao phát sáng đánh dấu điểm tìm thấy.
  - Có nút hỗ trợ gợi ý (Kính lúp 🔍) nếu bé tìm lâu chưa thấy.
* **Tệp dự kiến:** `src/screens/SpotDifferenceGameScreen.tsx`

---

### Game 5: 🎹 Đàn Xylophone 7 Sắc Cầu Vồng (Kids Xylophone)
* **Độ tuổi:** 2 – 8 tuổi
* **Lĩnh vực:** Âm nhạc & Cảm thụ giai điệu.
* **Mục tiêu:** Kích thích thính giác, nuôi dưỡng tâm hồn và khả năng cảm thụ nhịp phách.
* **Gameplay:**
  - Bàn phím gõ 7 thanh màu sắc: Đồ (Đỏ) - Rê (Cam) - Mi (Vàng) - Pha (Xanh lá) - Son (Xanh dương) - La (Xanh đậm) - Si (Tím).
  - Chế độ **"Tập Đánh Theo Bài"**: Nốt nhạc rơi xuống thanh phím để bé chạm đúng nhịp (bài *Kìa con bướm vàng*, *Bé tập đếm*, *Twinkle Twinkle*).
  - Chế độ **"Tự Do Sáng Tác"**: Ghi âm và phát lại bản nhạc của bé.
* **Tệp dự kiến:** `src/screens/XylophoneGameScreen.tsx`

---

### Game 6: 🌱 Bé Làm Vườn & Nông Trại Vui Vẻ (Little Gardener)
* **Độ tuổi:** 3 – 8 tuổi
* **Lĩnh vực:** Khoa học tự nhiên (STEM Biology) / Ý thức bảo vệ môi trường.
* **Mục tiêu:** Hiểu quy trình sinh trưởng của cây trồng từ hạt mầm đến ngày hái quả.
* **Gameplay:**
  - Bé chọn hạt giống: Cà chua 🍅, Hoa hướng dương 🌻, Cây táo 🍏, Cà rốt 🥕.
  - Các bước thực hiện: Đào đất ➡️ Gieo hạt ➡️ Tưới nước 💧 ➡️ Kéo mặt trời sưởi ấm ☀️ ➡️ Bắt sâu 🐛 ➡️ Thu hoạch.
  - Cây cối biểu cảm cười vui khi được chăm sóc tốt.
* **Tệp dự kiến:** `src/screens/LittleGardenerGameScreen.tsx`

---

### Game 7: 👗 Thời Tiết & Trang Phục (Weather & Dress Up)
* **Độ tuổi:** 2 – 6 tuổi
* **Lĩnh vực:** Kỹ năng sống / Nhận biết hiện tượng tự nhiên.
* **Mục tiêu:** Tự lập trong việc lựa chọn quần áo phù hợp với điều kiện thời tiết thực tế.
* **Gameplay:**
  - Cửa sổ hiển thị thời tiết: Ngày nắng gắt ☀️, Ngày mưa to 🌧️, Trời tuyết lạnh ❄️, Gió bão 🍃.
  - Tủ đồ gồm: Áo ấm, áo mưa, ủng, kính râm, mũ rộng vành, ô dù.
  - Bé kéo trang phục mặc cho nhân vật. Nếu chọn sai (mặc áo cộc khi trời tuyết), nhân vật sẽ run rẩy hài hước và giọng đọc nhắc nhở nhẹ nhàng.
* **Tệp dự kiến:** `src/screens/WeatherDressUpGameScreen.tsx`

---

### Game 8: ⚖️ Chiếc Cân Thăng Bằng (Balance Scale Physics)
* **Độ tuổi:** 4 – 9 tuổi
* **Lĩnh vực:** Toán học & Vật lý trực quan.
* **Mục tiêu:** Hiểu khái niệm so sánh trọng lượng, bảo toàn khối lượng và cân bằng.
* **Gameplay:**
  - Cân đòn bập bênh với đĩa bên trái chứa vật thể (ví dụ 1 quả dưa hấu nặng 3kg).
  - Bên phải là khay chứa các loại quả có trọng lượng khác nhau (1kg, 0.5kg).
  - Bé thả các quả lên đĩa sao cho kim cân chỉ thẳng đứng ở mức thăng bằng.
* **Tệp dự kiến:** `src/screens/BalanceScaleGameScreen.tsx`

---

### Game 9: 🪐 Du Hành Hệ Mặt Trời (Solar System Journey)
* **Độ tuổi:** 5 – 10 tuổi
* **Lĩnh vực:** Thiên văn học / Khám phá khoa học.
* **Mục tiêu:** Cung cấp kiến thức cơ bản về Mặt Trời, Mặt Trăng và 8 hành tinh trong hệ Mặt Trời.
* **Gameplay:**
  - Bé điều khiển phi thuyền bay qua không gian vũ trụ 3D lấp lánh sao.
  - Chạm vào từng hành tinh (Sao Thủy, Sao Kim, Trái Đất 🌍, Sao Hỏa...) để mở khóa mô hình quay 360 độ kèm thông tin thú vị dạng audio thuyết minh.
  - Mini-game nhặt các mảnh thiên thạch bảo vệ trạm không gian.
* **Tệp dự kiến:** `src/screens/SolarSystemGameScreen.tsx`

---

### Game 10: 🦷 Bé Vui Đánh Răng & Thói Quen Tốt (Daily Habits)
* **Độ tuổi:** 2 – 6 tuổi
* **Lĩnh vực:** Chăm sóc sức khỏe / Vệ sinh cá nhân.
* **Mục tiêu:** Hình thành thói quen đánh răng đúng cách trong 2 phút, giảm nỗi sợ chải răng ở trẻ nhỏ.
* **Gameplay:**
  - Nhân vật bạn Gấu hoặc Khủng Long có hàm răng dính thức ăn và vi khuẩn sâu răng màu tím 👾.
  - Bé di chuyển bàn chải có bọt kem khắp mặt ngoài, mặt trong và mặt nhai của răng.
  - Nhạc nền đánh răng vui nhộn phát trong 2 phút chuẩn khoa học nha khoa.
  - Kết thúc: Hàm răng phát sáng lấp lánh ⭐.
* **Tệp dự kiến:** `src/screens/DentalHabitsGameScreen.tsx`

---

### Game 11: 🐍 Rắn Săn Mồi Thông Minh (Edu-Snake Math & Words)
* **Độ tuổi:** 3 – 10 tuổi
* **Lĩnh vực:** Phản xạ / Toán học tư duy & Ghép vần Tiếng Việt.
* **Mục tiêu:** Rèn luyện phản xạ nhanh, khả năng định hướng không gian, làm quen với số học và ghép vần từ ngữ.
* **Gameplay:**
  - **Chế độ Săn Số & Làm Toán (Math):** Rắn tìm ăn các số theo thứ tự tăng dần hoặc giải các phép tính nhanh (`3 + 2 = ?` -> ăn số `5`).
  - **Chế độ Ghép Từ (Spelling):** Đề bài hiện từ vựng (`M - È - O`), rắn phải ăn đúng từng chữ cái theo thứ tự để ghép thành từ.
  - **Chế độ Hình Khối & Màu Sắc (Shapes):** Săn tìm đúng màu sắc và hình dạng theo yêu cầu nhiệm vụ.
  - **Chế độ Trái Cây Thư Giãn (Classic Fruits):** Ăn hoa quả tăng chiều dài thân rắn cầu vồng 🌈.
  - **Điều khiển:** Phím điều hướng D-Pad 4 chiều to bản hoặc vuốt ngón tay (Swipe), hỗ trợ chế độ Xuyên tường an toàn cho bé nhỏ.
* **Tệp triển khai:** `src/screens/SnakeEduGameScreen.tsx`
* **Định danh Launcher:** `'internal.game.snakeedu'`

---

### Game 12: 🎴 Thẻ Bài Từ Vựng Song Ngữ Oxford (Kids Bilingual Flashcards)
* **Độ tuổi:** 2 – 10 tuổi
* **Lĩnh vực:** Phát triển ngôn ngữ / 3000 từ vựng cốt lõi Oxford (Động vật, Cây cối, Côn trùng, Xe cộ, Nghề nghiệp...).
* **Mục tiêu:** Xây dựng vốn từ vựng phong phú, rèn luyện phát âm chuẩn bản xứ Anh - Việt, phát triển tư duy song ngữ sớm.
* **Gameplay:**
  - **3 Chế độ ngôn ngữ:** 🇻🇳 Tiếng Việt, 🇬🇧 Tiếng Anh (kèm IPA & Phonics), 🌐 Song Ngữ Anh - Việt (lật mặt trước/sau).
  - **Lật thẻ 3D tương tác:** Chạm để lật thẻ 180 độ, nút phát âm chuẩn US 🔊, nút đọc chậm 0.75x 🐌, hình ảnh sắc nét.
  - **Mini-game Thám Tử Đoán Tranh:** Nghe từ phát âm -> chọn thẻ tranh đúng trong 4 đáp án.
  - **10+ Bộ chủ đề:** Động vật 🦁, Côn trùng 🐛, Cây cối 🌳, Trái cây 🍎, Xe cộ 🚗, Đồ dùng 🏠, Cơ thể 👤, Màu sắc 🎨, Vũ trụ 🪐, Nghề nghiệp 👨‍👩‍👧.
* **Tệp triển khai:** `src/screens/FlashcardGameScreen.tsx` & `src/data/oxfordKidsVocabulary.ts`
* **Định danh Launcher:** `'internal.game.flashcards'`

---

## 3. KIẾN TRÚC KỸ THUẬT & CẤU TRÚC FILE CODE

### 3.1. Các Component Tái Sử Dụng (Shared UI Components)
Tất cả các màn hình game mới sẽ thừa hưởng các component dùng chung trong `example/src/components/`:
* `GameHeader.tsx`: Header chuẩn có nút Thoát ✕, Nút bật/tắt âm thanh 🔊/🔇, Nút Chơi lại 🔄.
* `VictoryModal.tsx`: Popup chúc mừng chiến thắng kèm hiệu ứng sao ⭐ và nút Chơi tiếp.
* `VoicePromptBar.tsx`: Thanh giọng đọc tiếng Việt hỗ trợ bấm nghe lại bất cứ lúc nào.
* `ParticleEffect.tsx`: Hiệu ứng nổ hạt kim tuyến/ngôi sao 360 độ.

### 3.2. Cấu Trúc Khai Báo Trong Launcher
Trong `KidsLauncherScreen.tsx`, các game mới sẽ được đăng ký vào danh sách ứng dụng nội bộ:
```typescript
// Định danh Package Name nội bộ cho các game mới
'internal.game.robotcoder'     // Game 1
'internal.game.emotions'       // Game 2
'internal.game.shadowmatch'    // Game 3
'internal.game.spotdiff'       // Game 4
'internal.game.xylophone'      // Game 5
'internal.game.gardener'       // Game 6
'internal.game.weatherdress'   // Game 7
'internal.game.balancescale'   // Game 8
'internal.game.solarsystem'    // Game 9
'internal.game.dentalhabits'   // Game 10
'internal.game.snakeedu'       // Game 11: Rắn Săn Mồi Giáo Dục
'internal.game.flashcards'     // Game 12: Thẻ Bài Từ Vựng Song Ngữ
```

---

## 4. KẾ HOẠCH TRIỂN KHAI (ROADMAP)

| Giai Đoạn | Trò Chơi Trọng Tâm | Tính Năng Chính |
| :--- | :--- | :--- |
| **Giai đoạn 1 (Ưu tiên cao)** | 🎴 **Flashcards**, 🐍 **Edu-Snake**, 🤖 **Robot Coder** | Từ vựng song ngữ Oxford + Rắn toán học + Lập trình STEM |
| **Giai đoạn 2** | 🎹 **Xylophone**, 👥 **Chiếc Bóng**, 🔍 **Điểm Khác Biệt** | Cảm thụ âm nhạc + Rèn luyện thị giác tập trung |
| **Giai đoạn 3** | 🌱 **Bé Làm Vườn** & 🦷 **Bé Vui Đánh Răng** | Giáo dục thói quen sống và kiến thức tự nhiên |
| **Giai đoạn 4** | 👥 **Khu Vườn EQ**, 👗 **Thời Tiết**, ⚖️ **Cân Thăng Bằng**, 🪐 **Hệ Mặt Trời** | Hoàn thiện trọn bộ trò chơi giáo dục toàn diện |

---

*Tài liệu này là căn cứ kỹ thuật chuẩn để đội ngũ kỹ sư tiến hành code và đóng gói vào các bản cập nhật tiếp theo.*
