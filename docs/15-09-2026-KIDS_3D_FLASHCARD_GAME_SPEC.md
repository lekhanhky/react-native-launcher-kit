# 🎴✨ TÀI LIỆU ĐẶC TẢ THIẾT KẾ & NÂNG CẤP GAME: THẺ BÀI MA THUẬT 3D OXFORD (KIDS 3D BILINGUAL FLASHCARDS)

> **Dự án:** Kids Launcher & Educational Platform  
> **Nền tảng:** React Native (Android Launcher) & Web Portal (Next.js)  
> **Định danh Launcher:** `'internal.game.flashcards'`  
> **File triển khai chính:** `example/src/screens/FlashcardGameScreen.tsx` & `example/src/data/oxfordKidsVocabulary.ts`  
> **Phong cách đồ họa:** 3D Stylized Claymorphism / Pixar 3D Animation (Đồng bộ nhân vật Tom & MiMi)  
> **Đối tượng người học:** Trẻ em 2 – 10 tuổi (Mầm non & Tiểu học)  
> **Ngày lập:** 15/09/2026  
> **Trạng thái:** Đặc tả nâng cấp toàn diện (3D Visuals, Multi-sensory SFX & Gamification)

---

## 📌 1. TỔNG QUAN & TRIẾT LÝ NÂNG CẤP ĐỘT PHÁ

### 1.1. Hiện trạng & Lý do cần nâng cấp
Phiên bản Flashcard ban đầu đã xây dựng được nền tảng vững chắc:
* Đã sở hữu **30 chủ đề toàn diện với 500+ thẻ từ vựng Oxford** chọn lọc.
* Hỗ trợ phát âm chuẩn bản xứ US (Oxford) và tiếng Việt, phiên âm IPA, câu ví dụ và fun fact.
* Đã có hiệu ứng lật thẻ 2 pha (`rotateY` trục Y) chống hiện tượng chìm/lún trên Android.

Tuy nhiên, trải nghiệm học tập của bé còn gặp những rào cản khiến game nhanh gây nhàm chán:
1. **Hình ảnh chỉ là Emoji 2D hệ thống**: Kém bắt mắt, màu sắc nhạt nhòa, không có chiều sâu và không kích thích được trí tò mò thị giác của trẻ em thời đại số.
2. **Thẻ bài thiếu tính vật lý**: Chỉ xoay phẳng một chiều, chưa có độ nghiêng theo ngón tay, thiếu độ dày cạnh thẻ (bevel) và lớp tráng gương phản quang đặc trưng của thẻ bài sưu tập.
3. **Tương tác một chiều, thiếu âm thanh thực tế**: Bé chỉ nghe đọc từ vựng mà không nghe được tiếng gầm của sư tử, tiếng còi xe cứu hỏa hay tiếng sóng biển.
4. **Thiếu cơ chế giữ chân (Retention & Gamification)**: Bé làm đúng vài câu rồi thoát, không có cảm giác "sưu tầm tích lũy", không có cấp độ thẻ bài (Thường / Hiếm / Vàng 3D).

### 1.2. Mục tiêu của phiên bản 3D Magic Flashcards
Biến ứng dụng Flashcard truyền thống thành một **"Sổ Tay Thẻ Bài Ma Thuật 3D" (Magic 3D Card Album / Pokédex)** kết hợp công nghệ tương tác trực quan:
* **Thị giác 3D siêu thực**: Hình ảnh 3D Stylized nổi khối, thẻ bài nghiêng 3D đa hướng (Parallax Tilt) phản hồi theo cử chỉ ngón tay.
* **Đa giác quan (Multi-sensory)**: Kết hợp âm thanh thực tế đời sống (Real-world SFX) + Phát âm chuẩn bản xứ + Rung phản hồi (Haptic feedback).
* **Động lực sưu tầm gây nghiện**: Hoạt ảnh xé gói thẻ bí ẩn (Booster Pack Opening) và tủ trưng bày thẻ bài theo độ hiếm.
* **Học tập khoa học**: Tích hợp thuật toán lặp lại ngắt quãng (Spaced Repetition System - SRS) giúp bé ghi nhớ sâu từ khó mà không cảm thấy áp lực.

---

## 🎨 2. KIẾN TRÚC ĐỒ HỌA 3D & HIỆU ỨNG THỊ GIÁC

```
                      CẤU TRÚC 3D PARALLAX CARD
                                 │
     ┌───────────────────────────┼───────────────────────────┐
     ▼                           ▼                           ▼
[Lớp 1: NỀN THẺ BÀI]        [Lớp 2: TRÁNG GƯƠNG]       [Lớp 3: VẬT THỂ 3D CHÍNH]
Depth: -15px Z-Index         Holographic Glare Foil     Depth: +25px Z-Index
- Màu chủ đạo danh mục       - Dải sáng cầu vồng        - Ảnh 3D Stylized Render
- Hoa văn chìm Hologram      - Trượt theo góc nghiêng   - Nổi hẳn ra khỏi khung thẻ
```

### 2.1. Thẻ bài 3D Parallax Tilt (Nghiêng theo cử chỉ thời gian thực)
Thay vì thẻ bài nằm bất động trên màn hình, thẻ bài sẽ phản hồi cử động ngón tay:
* **Góc nghiêng 3D (`rotateX`, `rotateY`)**:
  * Khi bé chạm và rê ngón tay trên thẻ, thẻ sẽ nghiêng mượt mà theo hướng chạm với góc tối đa `±14 độ`.
  * Khi bé buông tay, thẻ sử dụng chuyển động lò xo (`Animated.spring`, `friction: 5, tension: 40`) tự động bật đàn hồi trở lại trạng thái cân bằng.
* **Độ sâu thị sai 3 tầng (Multi-layer Parallax)**:
  * **Lớp nền (Background Plate)**: Dịch chuyển nhẹ theo hướng ngược lại (`translate: -6px`), tạo cảm giác lòng thẻ sâu hun hút.
  * **Lớp khung thẻ & Viền kim loại (Bevel Frame)**: Đổ bóng nổi khối 3D với 3 tông màu tạo rãnh viền vàng/bạc.
  * **Lớp nhân vật/đồ vật chính (Foreground 3D Asset)**: Nổi vươn ra phía trước (`translate: +12px`), vượt qua mép khung viền trên, tạo cảm giác con vật hay chiếc xe đang bước ra khỏi thẻ bài như phim 3D.

### 2.2. Lớp phủ Tráng Gương Cầu Vồng (Holographic Foil Reflection)
* Một lớp phủ Gradient mờ đục bán phần (`linear-gradient` góc 45 độ với các màu quang phổ `rgba(255, 0, 128, 0.15)`, `rgba(0, 255, 255, 0.2)`, `rgba(255, 255, 0, 0.15)`).
* Khi góc nghiêng của thẻ thay đổi (`rotateY`), dải sáng phản quang này sẽ trượt ngang qua mặt thẻ bài (`translateX` dịch chuyển từ -100% sang +100%), tạo cảm giác lấp lánh như thẻ bài bóng kính Prizm / Pokemon Holo hiếm có ngoài đời thực.

### 2.3. Quy chuẩn Đồ họa 3D Render (3D Stylized Claymorphism)
* **Định dạng tối ưu**: WebP trong suốt (Transparent Background), độ phân giải chuẩn `512x512 px`, nén chất lượng cao (dung lượng chỉ ~35KB - 60KB/ảnh).
* **Phong cách đồng nhất**:
  * Đổ bóng mềm mại (Soft ambient occlusion), chất liệu đất nặn hoạt hình (Claymorphism/Vinyl Toy) tươi sáng, ấm áp.
  * Tương thích hoàn hảo với phong cách tạo hình của hai nhân vật chính **Bé Tom** và **Bé MiMi**.
  * Không dùng ảnh chụp tả thực quá góc cạnh dễ làm bé phân tâm; ưu tiên các đường nét bo tròn thân thiện, mắt to biểu cảm.

### 2.4. Chế độ Mô hình 3D tương tác 360° (Interactive 3D Model Viewer)
* Đối với các chủ đề mang tính khám phá khoa học sâu: **Thế giới Động vật (Animals)**, **Phương tiện Giao thông (Vehicles)**, **Hệ Mặt Trời (Solar System)**:
  * Trên thẻ bài có nút bấm nổi **"Khám Phá 3D 🪐"**.
  * Bấm vào sẽ mở popup toàn màn hình chứa khung WebGL nội bộ (qua `react-native-webview` tải mô hình file `.glb` siêu nhẹ).
  * Bé có thể dùng ngón tay xoay tròn 360 độ quanh con khủng long T-Rex, phóng to ngắm nhìn vành đai sao Thổ, hoặc bấm vào còi xe cứu hỏa để xe phun vòi rồng nước 3D.

---

## 🔊 3. HỆ THỐNG ÂM THANH ĐA GIÁC QUAN (MULTI-SENSORY AUDIO)

```
                            QUY TRÌNH PHÁT ÂM ĐA TẦNG
                                       │
     ┌─────────────────────────────────┼─────────────────────────────────┐
     ▼                                 ▼                                 ▼
[Bước 1: ÂM THANH THỰC TẾ]       [Bước 2: PHÁT ÂM TIẾNG ANH]      [Bước 3: DỊCH NGHĨA VIỆT]
0ms - 800ms                      Sau 900ms                        Sau 2100ms
Tiếng gầm sư tử 🦁              "Lion" /ˈlaɪ.ən/ (US Bản xứ)     "Nghĩa là: Con Sư Tử" 🇻🇳
Tiếng còi tàu hỏa 🚂             (Hỗ trợ nút đọc chậm 0.75x 🐌)    (Giọng đọc chuẩn truyền cảm)
```

### 3.1. Thư viện Âm Thanh Đời Thực (Real World SFX)
* Mỗi thẻ bài được bổ sung trường âm thanh thực tế `realSfxUrl`:
  * **Động vật**: Tiếng chó sủa `woof_woof.mp3`, tiếng mèo kêu `meow.mp3`, tiếng voi gầm `elephant_trumpet.mp3`.
  * **Xe cộ**: Tiếng còi tàu hỏa `train_whistle.mp3`, tiếng trực thăng quay cánh quạt `helicopter_rotor.mp3`.
  * **Tự nhiên**: Tiếng mưa rơi rào rào `rain_sound.mp3`, tiếng sóng biển vỗ bờ `ocean_waves.mp3`.
* Khi bé chạm vào hình ảnh 3D ở giữa thẻ, âm thanh thực tế sẽ phát ngay lập tức (0ms delay) kích thích não bộ liên tưởng thực tế.

### 3.2. Âm thanh Giao diện & Hiệu ứng Phản hồi (UI SFX & Haptics)
* **Lật thẻ**: Âm thanh vuốt gió nhẹ nhàng `card_flip_woosh.mp3`.
* **Thẻ Huyền Thoại (Legendary Card)**: Âm thanh hào quang ngân vang `holy_sparkle_chime.mp3`.
* **Trả lời đúng**: Âm thanh chuông vàng vui tươi `correct_ding.mp3` kèm rung nhẹ thiết bị (Haptic Impact Light).
* **Combo Streak 3x, 5x, 10x**: Cao độ âm thanh (Pitch) tăng dần theo chuỗi đúng tạo cảm giác hưng phấn tột độ.
* **Nhạc nền BGM**: Nhạc cụ gỗ Marimba / Xylophone êm dịu, âm lượng nền 20%, có nút gạt bật/tắt nhanh trên thanh điều khiển.

---

## 🃏 4. CƠ CHẾ GAMIFICATION & ALBUM SƯU TẬP THẺ MA THUẬT

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                  📖 SỔ TAY SƯU TẬP THẺ BÀI (MAGIC POKÉDEX)                    │
├──────────────────────────────────────────────────────────────────────────────┤
│  [🦁 Động vật: 18/22 Thẻ]   [🍎 Trái cây: 20/20 ⭐ Hoàn Thành]   [🚗 Xe cộ...] │
│                                                                              │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐               │
│   │ 🥉 THƯỜNG    │      │ 🥈 HIẾM      │      │ 🥇 HUYỀN THOẠI│               │
│   │ Viền Bạc     │      │ Viền Tím Neon│      │ Viền Vàng 3D │               │
│   │ 🐶 Dog       │      │ 🐬 Dolphin   │      │ 🦁 Lion      │               │
│   │ Đã mở khóa   │      │ Đã mở khóa   │      │ ✨ Holo Foil │               │
│   └──────────────┘      └──────────────┘      └──────────────┘               │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 4.1. Phân cấp Độ Hiếm Của Thẻ (Card Rarity Tiers)
Mỗi thẻ từ vựng trong 30 chủ đề được phân thành 3 cấp độ:
1. **🥉 Thẻ Thường (Common - 60% số thẻ)**:
   * Thẻ bài nền màu chuẩn danh mục, viền xám bạc bo tròn.
   * Dành cho các từ vựng cơ bản, quen thuộc hàng ngày (Cat, Dog, Apple, Car...).
2. **🥈 Thẻ Hiếm (Rare - 30% số thẻ)**:
   * Thẻ viền tím ánh neon hoặc xanh lam dạ quang, có hiệu ứng hạt sao nhỏ phát sáng quanh thẻ.
   * Dành cho các từ vựng nâng cao hơn (Dolphin, Strawberry, Helicopter, Rainbow...).
3. **🥇 Thẻ Huyền Thoại (Legendary 3D Gold - 10% số thẻ)**:
   * Thẻ viền vàng kim 3D nguyên khối chạm trổ tinh xảo, phủ toàn bộ hiệu ứng phản quang cầu vồng Holographic Foil.
   * Có hiệu ứng hạt bụi vàng kim (Golden Stardust Particles) bay lơ lửng quanh thẻ 3D.
   * Khi bé rút được thẻ này, màn hình sẽ tối đi và dải hào quang bùng nổ chúc mừng bé.

### 4.2. Tính năng "Mở Gói Thẻ Bí Ẩn" (Mystery Booster Pack Opening)
* **Cơ chế nhận gói thẻ**:
  * Đăng nhập học mỗi ngày: Tặng 1 Gói Thẻ Hàng Ngày (Daily Pack - 3 thẻ ngẫu nhiên).
  * Hoàn thành 1 chủ đề từ vựng: Tặng 1 Gói Thẻ Vàng (Gold Pack - đảm bảo có 1 Thẻ Hiếm hoặc Huyền Thoại).
  * Đạt chuỗi 10 câu trả lời đúng liên tiếp: Tặng 1 Thẻ Đặc Biệt.
* **Hoạt ảnh xé gói thẻ 3D (Interactive Pack Rip)**:
  * Hiển thị túi thẻ căng phồng với hình ảnh Tom & MiMi tươi cười.
  * Bé dùng ngón tay vuốt ngang đường chỉ đứt ở miệng túi để "xé túi thẻ" kèm âm thanh xé giấy `pack_rip.mp3`.
  * Các thẻ bài bên trong bay vút lên cao, xoay tròn 3D và úp mặt xuống.
  * Bé chạm vào từng thẻ để hồi hộp lật mở xem mình nhận được thẻ Thường, Hiếm hay Huyền Thoại!

### 4.3. Sổ Tay Sưu Tập Thẻ (Pokédex Collection Book)
* Một giao diện dạng quyển sách lật trang hiển thị toàn bộ 500+ thẻ bài theo từng chủ đề.
* Thẻ nào bé chưa học/chưa mở khóa sẽ hiển thị dưới dạng **Bóng đen kỳ bí (Shadow Silhouette)** kèm dấu hỏi chấm `❓`.
* Dưới mỗi chủ đề có thanh tiến trình hiển thị rõ ràng: *"Bé đã sưu tập được 15/22 thẻ Động Vật"*. Khi đạt 100%, chủ đề sẽ được gắn Vương miện Vàng ⭐ và mở khóa mini-game đặc biệt.

---

## 🎮 5. ĐA DẠNG HÓA 4 CHẾ ĐỘ CHƠI (GAMEPLAY MODES)

Thay vì chỉ có chế độ Lướt Thẻ và 1 Quiz 4 ô nhàm chán, game nâng cấp thành **4 chế độ tương tác chuyên sâu**:

```
                       4 CHẾ ĐỘ CHƠI TƯƠNG TÁC
                                 │
     ┌───────────────────────────┼───────────────────────────┐
     ▼                           ▼                           ▼
[1. Khám Phá 3D Tilt]     [2. Thám Tử Đoán Thẻ]     [3. Ghép Trí Nhớ 3D]
Interactive Explorer      Detective Audio Quiz       Memory 3D Match
     │                                                       │
     └───────────────────────────┬───────────────────────────┘
                                 ▼
                    [4. Thử Thách 60s Siêu Tốc]
                    Speed Card Rush Combo x5
```

### 5.1. Chế độ 1: 🎴 Khám Phá & Tương Tác Thẻ 3D (Interactive Explorer)
* **Thao tác tự do**: Bé vuốt trái/phải để chuyển thẻ, vuốt lên/xuống hoặc chạm để lật mặt sau xem nghĩa tiếng Việt và câu ví dụ sinh động.
* **Chạm vào vật thể**: Chạm con vật/xe cộ để nghe tiếng kêu thực tế.
* **Nút Nghe Chậm 0.75x (Con Ốc Sên 🐌)**: Giúp các bé nhỏ nghe rõ từng âm tiết Phonics (ví dụ: *El - e - phant*).
* **Nút Thu Âm Giọng Bé 🎙️**: Cho phép bé thu âm lại tiếng đọc của mình rồi nghe lại so sánh với giọng chuẩn bản xứ của máy.

### 5.2. Chế độ 2: 🔍 Thám Tử Đoán Thẻ (Detective Audio Quiz)
* **Luật chơi**:
  * Máy phát ra một âm thanh thực tế (tiếng gầm 🦁) hoặc một từ vựng tiếng Anh (*"Where is the Elephant?"*).
  * Hiển thị lưới 4 thẻ bài 3D đang đung đưa nhẹ nhàng.
  * Bé lắng nghe và chạm vào thẻ bài đúng.
* **Phản hồi**:
  * Chọn đúng: Thẻ bài phóng to, nhảy múa vui nhộn, bắn pháo hoa sao ⭐ và cộng điểm thưởng.
  * Chọn sai: Thẻ bài rung lắc nhẹ (Shake animation), phát âm thanh gợi ý nhẹ nhàng: *"Chưa đúng rồi, bé thử lại nhé!"*.

### 5.3. Chế độ 3: 🃏 Ghép Cặp Trí Nhớ 3D (Memory 3D Match)
* **Luật chơi**:
  * Bàn cờ gồm 6, 8 hoặc 12 thẻ bài úp mặt (Mặt sau là logo chiếc Khiên Ma Thuật lấp lánh).
  * Bé lật 2 thẻ bài bất kỳ: 1 thẻ là Hình ảnh 3D, 1 thẻ là Từ vựng tiếng Anh (hoặc 2 thẻ cùng loài).
  * Nếu khớp cặp: 2 thẻ phát sáng bay vào Album sưu tập.
  * Giúp rèn luyện trí nhớ thị giác, khả năng tập trung cao độ và phản xạ từ vựng tức thì.

### 5.4. Chế độ 4: ⚡ Thử Thách Nhanh Tay 60 Giây (Speed Card Rush)
* **Luật chơi dành cho bé 6-10 tuổi**:
  * Trong vòng 60 giây, các từ vựng liên tục xuất hiện.
  * Bé chọn đáp án đúng càng nhanh thì điểm số càng nhân bội số: Combo x2, x3, x5 điểm.
  * Khi đạt Combo 5, thanh đo bùng cháy hiệu ứng lửa thần (Fever Mode) nhân đôi toàn bộ điểm số.
  * Bảng tổng kết vinh danh kỷ lục điểm cao nhất (High Score) được lưu vào máy.

---

## 👦👧 6. MASCOT ĐỒNG HÀNH TƯƠNG TÁC (TOM & MIMI GUIDE)

Theo đúng định hướng nhận diện thương hiệu của nền tảng, hai nhân vật **Bé Tom 👦** và **Bé MiMi 👧** sẽ đồng hành cùng bé trong suốt màn chơi:
* **Vị trí hiển thị**: Góc dưới bên phải màn hình (kích thước nhỏ gọn, không che khuất thẻ bài).
* **Trạng thái cảm xúc thời gian thực**:
  * **Chờ đợi (Idle)**: Bé Tom chớp mắt, đu đưa chiếc kính lúp; Bé MiMi ôm gấu bông nhỏ mỉm cười.
  * **Bé lật trúng Thẻ Huyền Thoại**: Cả Tom và MiMi cùng nhảy cẫng lên vỗ tay reo hò: *"Oa, thẻ vàng lấp lánh kìa bé ơi!"*.
  * **Bé trả lời đúng liên tiếp**: Bé Tom giơ ngón tay cái Like 👍, Bé MiMi tặng bé một trái tim hồng lơ lửng.
  * **Bé chọn chưa đúng**: Bé Tom đưa tay lên cằm suy nghĩ, khích lệ: *"Đừng lo, thử lại lần nữa nhé bạn!"*.
  * **Không tương tác quá 20s**: Bé MiMi ngáp nhẹ hoặc vẫy tay gọi: *"Bé ơi, chúng mình cùng khám phá thẻ tiếp theo nào!"*.

---

## 🧠 7. THUẬT TOÁN ÔN TẬP NGẮT QUÃNG THÔNG MINH (SPACED REPETITION - SRS)

Nhằm tối ưu hóa hiệu quả giáo dục thực chất cho bé, hệ thống tích hợp bộ ghi nhớ thông minh:
* **Ghi nhận lịch sử tương tác của từng từ vựng**:
  * `timesReviewed`: Số lần bé đã nhìn thấy từ này.
  * `correctStreak`: Số lần bé trả lời đúng liên tiếp trong mini-game.
  * `lastReviewedAt`: Mốc thời gian lần cuối bé học từ này.
  * `masteryLevel`: Đánh giá mức độ thành thạo từ 1 đến 5 sao ⭐.
* **Tự động kích hoạt Danh mục "Từ Cần Ôn Luyện 💡"**:
  * Những từ bé trả lời sai từ 2 lần trở lên sẽ được thuật toán tự động gom vào một danh mục ôn tập ưu tiên.
  * Khi bé vào game, hệ thống sẽ gợi ý: *"Bé ơi, có 5 từ vựng đang chờ bé ôn lại để nhận sao vàng đấy!"*.
  * Sau khi bé vượt qua từ đó 3 lần liên tiếp, từ sẽ được công nhận "Đã Thuộc Lòng (Mastered)".

---

## 📐 8. ĐẶC TẢ KIẾN TRÚC DỮ LIỆU (DATA SCHEMA SPECIFICATION)

### 8.1. Mở rộng Cấu trúc Thẻ Từ Vựng (`VocabCard3D`)
Cập nhật interface trong `example/src/data/oxfordKidsVocabulary.ts` đảm bảo **tương thích ngược 100%**:

```typescript
export type CardRarityTier = 'common' | 'rare' | 'legendary';

export interface VocabCard3D {
  // --- Các trường dữ liệu cơ bản (Đã có sẵn) ---
  id: string;
  english: string;
  ipa: string;
  vietnamese: string;
  category: string;
  emoji: string;
  color: string;
  exampleEn: string;
  exampleVi: string;
  funFact: string;

  // --- CÁC TRƯỜNG DỮ LIỆU NÂNG CẤP 3D & SFX MỚI ---
  image3dUrl?: string;          // Ảnh render 3D (WebP transparent 512x512)
  model3dUrl?: string;          // Đường dẫn mô hình 3D .glb (tùy chọn)
  realSfxUrl?: string;          // Âm thanh đời thực (tiếng kêu, còi xe, sóng biển)
  pronunciationSlowUrl?: string;// Audio phát âm chậm Phonics
  rarityTier: CardRarityTier;   // Cấp độ thẻ bài: 'common' | 'rare' | 'legendary'
  holographicPattern?: 'prism' | 'gold_dust' | 'neon_stars'; // Kiểu vân tráng gương

  // --- Trạng thái học tập của bé (Local Storage MMKV) ---
  isUnlocked?: boolean;         // Đã mở khóa vào Album chưa
  masteryLevel?: number;        // Cấp độ thuần thục 1 - 5 sao
  wrongCount?: number;          // Số lần đoán sai
  correctCount?: number;        // Số lần đoán đúng
  unlockedAt?: number;          // Thời điểm mở khóa thẻ
}

export interface VocabCategory3D {
  id: string;
  titleEn: string;
  titleVi: string;
  icon: string;
  color: string;
  banner3dUrl?: string;         // Ảnh bìa chủ đề 3D
  cards: VocabCard3D[];
}
```

### 8.2. Cấu trúc Quản lý Túi Thẻ & Album (Storage Keys MMKV)
Lưu trữ trên thiết bị thông qua service `storage.ts`:
* `FLASHCARD_COLLECTION_ALBUM`: Danh sách các `cardId` bé đã mở khóa và cấp độ sao.
* `FLASHCARD_UNOPENED_PACKS`: Số lượng túi thẻ bí ẩn bé đang sở hữu (`{ commonPacks: 2, goldPacks: 1 }`).
* `FLASHCARD_SRS_REVIEW_QUEUE`: Hàng đợi các thẻ từ cần ôn tập ngắt quãng.
* `FLASHCARD_HIGH_SCORES`: Điểm kỷ lục của chế độ Thử Thách 60s.

---

## 💻 9. MÃ NGUỒN MẪU THAM CHIẾU KỸ THUẬT (REFERENCE IMPLEMENTATION)

Dưới đây là mã nguồn thành phần chuẩn để đội ngũ kỹ sư dễ dàng lắp ghép khi tiến hành code:

### 9.1. Component Thẻ Bài 3D Parallax Tilt (`ParallaxCard3D.tsx`)
```tsx
import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Image,
  Text,
  useWindowDimensions,
} from 'react-native';
import { VocabCard3D } from '../data/oxfordKidsVocabulary';

interface ParallaxCard3DProps {
  card: VocabCard3D;
  isFlipped: boolean;
  onPress: () => void;
}

export const ParallaxCard3D: React.FC<ParallaxCard3DProps> = ({
  card,
  isFlipped,
  onPress,
}) => {
  const { width } = useWindowDimensions();
  const tiltAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  // Lắng nghe cử chỉ rê ngón tay để tạo góc nghiêng vật lý thời gian thực
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        // Giới hạn góc nghiêng tối đa ±14 độ
        const maxAngle = 14;
        const rotateX = Math.max(-maxAngle, Math.min(maxAngle, -gestureState.dy / 8));
        const rotateY = Math.max(-maxAngle, Math.min(maxAngle, gestureState.dx / 8));
        tiltAnim.setValue({ x: rotateX, y: rotateY });
      },
      onPanResponderRelease: () => {
        // Đàn hồi lò xo tự nhiên về vị trí cân bằng
        Animated.spring(tiltAnim, {
          toValue: { x: 0, y: 0 },
          friction: 6,
          tension: 45,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  // Nội suy góc xoay và dải sáng phản quang
  const rotateXStr = tiltAnim.x.interpolate({
    inputRange: [-14, 0, 14],
    outputRange: ['-14deg', '0deg', '14deg'],
  });
  const rotateYStr = tiltAnim.y.interpolate({
    inputRange: [-14, 0, 14],
    outputRange: ['-14deg', '0deg', '14deg'],
  });
  const glareTranslateX = tiltAnim.y.interpolate({
    inputRange: [-14, 0, 14],
    outputRange: [-150, 0, 150],
  });

  const isLegendary = card.rarityTier === 'legendary';

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.cardContainer,
        {
          transform: [
            { perspective: 1200 },
            { rotateX: rotateXStr },
            { rotateY: rotateYStr },
          ],
        },
      ]}
    >
      {/* 1. LỚP NỀN THẺ BÀI (BACKGROUND PLATE) */}
      <View
        style={[
          styles.cardBase,
          { borderColor: isLegendary ? '#F59E0B' : card.color },
          isLegendary && styles.legendaryBorder,
        ]}
      >
        {/* 2. DẢI SÁNG TRÁNG GƯƠNG CẦU VỒNG (HOLOGRAPHIC FOIL) */}
        {isLegendary && (
          <Animated.View
            style={[
              styles.holographicOverlay,
              { transform: [{ translateX: glareTranslateX }] },
            ]}
          />
        )}

        {/* 3. VẬT THỂ 3D NỔI BẬT (FOREGROUND 3D ASSET) */}
        <View style={styles.imageBox3D}>
          {card.image3dUrl ? (
            <Image
              source={{ uri: card.image3dUrl }}
              style={styles.image3D}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.emojiFallback}>{card.emoji}</Text>
          )}
        </View>

        {/* THÔNG TIN TỪ VỰNG & HUY HIỆU ĐỘ HIẾM */}
        <View style={styles.cardBottomInfo}>
          <Text style={styles.englishWord}>{card.english}</Text>
          <Text style={styles.ipaWord}>{card.ipa}</Text>
          <Text style={styles.vietnameseWord}>{card.vietnamese}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    maxWidth: 380,
    height: 420,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBase: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 28,
    borderWidth: 3.5,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  legendaryBorder: {
    borderWidth: 4,
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  holographicOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    width: '200%',
    transform: [{ skewX: '-25deg' }],
  },
  imageBox3D: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  image3D: {
    width: '100%',
    height: '100%',
  },
  emojiFallback: {
    fontSize: 90,
  },
  cardBottomInfo: {
    alignItems: 'center',
    width: '100%',
  },
  englishWord: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
  },
  ipaWord: {
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  vietnameseWord: {
    color: '#34D399',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
});
```

---

## 🚀 10. KẾ HOẠCH & LỘ TRÌNH TRIỂN KHAI (ROADMAP)

Dưới đây là các giai đoạn kỹ thuật cụ thể đã phân định rõ ràng để tiến hành lập trình:

| Giai đoạn | Nhiệm vụ kỹ thuật | Đầu ra cụ thể |
| :--- | :--- | :--- |
| **Giai đoạn 1** *(Ưu tiên 1)* | **Nâng cấp Component Thẻ bài 3D Parallax Tilt**<br>• Tích hợp `PanResponder` và lò xo `Animated.spring`<br>• Tạo hiệu ứng tráng gương phản quang cầu vồng Holographic Foil.<br>• Tích hợp trường `image3dUrl` hiển thị ảnh 3D Stylized (fallback an toàn sang Emoji). | Thẻ bài lật nghiêng 3D sống động 60fps trên mọi máy Android. |
| **Giai đoạn 2** *(Ưu tiên 2)* | **Hệ thống Âm thanh Đa Giác Quan (Multi-sensory SFX)**<br>• Tích hợp kho âm thanh đời thực `realSfxUrl` (tiếng thú kêu, xe cộ).<br>• Chế độ đọc chậm 0.75x với biểu tượng Con Ốc Sên 🐌.<br>• Âm thanh tương tác lật thẻ và haptic feedback. | Bé vừa nhìn hình 3D, vừa nghe tiếng động thực tế và phát âm chuẩn bản xứ. |
| **Giai đoạn 3** *(Ưu tiên 3)* | **Sổ Tay Sưu Tập Thẻ Ma Thuật & Mở Gói Thẻ Bí Ẩn**<br>• Phân cấp độ hiếm (Common, Rare, Legendary Gold 3D).<br>• Màn hình Album Sưu tập (Pokédex) theo dõi tiến độ hoàn thành.<br>• Hoạt ảnh xé gói thẻ bí ẩn (Booster Pack Opening) lộn nhào 3D. | Tăng vọt tỷ lệ mở ứng dụng hàng ngày và tạo sự gắn kết dài lâu với trẻ. |
| **Giai đoạn 4** *(Hoàn thiện)* | **Bổ sung 2 Mini-Game Mới & Thuật toán SRS**<br>• Mini-game *Ghép Cặp Trí Nhớ 3D* và *Thử Thách Nhanh Tay 60s*.<br>• Thuật toán ôn tập Spaced Repetition gom danh sách "Từ Cần Ôn Luyện".<br>• Mascot Bé Tom & Bé MiMi tương tác biểu cảm thời gian thực. | Trở thành tựa game Flashcard giáo dục toàn diện, chuẩn quốc tế cho trẻ. |

---

*Tài liệu này là chuẩn mực kỹ thuật và thiết kế chính thức dành cho việc nâng cấp phần game Flashcard trên hệ thống Kids Launcher.*
