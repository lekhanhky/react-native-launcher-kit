# 🕹️ ĐẶC TẢ CHI TIẾT TOP 10 GAME KINH ĐIỂN TÍCH HỢP GIÁO DỤC CHO TRẺ EM
*(Retro Classics Reimagined for Kids EdTech Ecosystem - Phiên bản 1.0)*

> **Tài liệu chiến lược & thiết kế kỹ thuật** mở rộng hệ sinh thái trò chơi trên nền tảng **React Native / Kids Launcher**.  
> **Triết lý:** Lấy cảm hứng từ 10 cơ chế trò chơi kinh điển đã được yêu thích qua nhiều thế hệ, loại bỏ hoàn toàn bạo lực, "thay máu" bằng các tương tác học tập thông minh (STEM, Toán học, Tiếng Anh, Logic dãy số và Phản xạ tư duy).

---

## 📑 MỤC LỤC
1. [Tổng Quan & Ma Trận Phân Loại Giáo Dục](#1-tổng-quan--ma-trận-phân-loại-giáo-dục)
2. [Chi Tiết Thiết Kế 10 Tựa Game Kinh Điển](#2-chi-tiết-thiết-kế-10-tựa-game-kinh-điển)
   - [Game 1: 🟡 Pac-Man Học Chữ & Số (Pac-Edu / Pac-Math & Spelling)](#game-1--pac-man-học-chữ--số-pac-edu)
   - [Game 2: 🧱 Xếp Gạch Tính Tổng 10 (Math-Tris / Number Bonds)](#game-2--xếp-gạch-tính-tổng-10-math-tris)
   - [Game 3: 🐦 Chú Chim Vượt Ống Tính Nhẩm (Flappy Math & Vocab)](#game-3--chú-chim-vượt-ống-tính-nhẩm-flappy-math)
   - [Game 4: 👾 Bắn Ruồi Không Gian Tri Thức (Space Math Invaders)](#game-4--bắn-ruồi-không-gian-tri-thức-space-invaders)
   - [Game 5: 🐸 Chú Ếch Băng Đường Đếm Nhảy (Frogger Number Sequence)](#game-5--chú-ếch-băng-đường-đếm-nhảy-frogger)
   - [Game 6: 💣 Đặt Bóng Màu Mê Cung (Color & Water Bomberman)](#game-6--đặt-bóng-màu-mê-cung-color-bomberman)
   - [Game 7: 🏓 Bắn Bóng Phá Gạch Từ Vựng (Breakout Oxford Vocab)](#game-7--bắn-bóng-phá-gạch-từ-vựng-breakout)
   - [Game 8: 🦍 Khỉ Khổng Lồ & Bậc Thang So Sánh (Donkey Math Ladder)](#game-8--khỉ-khổng-lồ--bậc-thang-so-sánh-donkey-kong)
   - [Game 9: 🦘 Bật Nhảy Lên Mây Tri Thức (Doodle Sky Hopper)](#game-9--bật-nhảy-lên-mây-tri-thức-doodle-jump)
   - [Game 10: 🦕 Khủng Long Thổi Bóng Hợp Nhất (Bubble Bobble Math Merge)](#game-10--khủng-long-thổi-bóng-hợp-nhất-bubble-bobble)
3. [Kiến Trúc Kỹ Thuật Chung Trên React Native](#3-kiến-trúc-kỹ-thuật-chung-trên-react-native)
4. [Lộ Trình Triển Khai (Roadmap)](#4-lộ-trình-triển-khai-roadmap)

---

## 1. TỔNG QUAN & MA TRẬN PHÂN LOẠI GIÁO DỤC

| STT | Tên Game Kinh Điển | Tên Phiên Bản Giáo Dục | Trọng Tâm Kiến Thức | Độ Tuổi Phù Hợp | Thời Gian Ván Chơi |
| :---: | :--- | :--- | :--- | :---: | :---: |
| **1** | **Pac-Man (1980)** | `Pac-Edu` | Số chẵn/lẻ, Ghép từ vựng tiếng Anh | 4 – 9 tuổi | 2 – 3 phút |
| **2** | **Tetris (1984)** | `Math-Tris` | Tổng bằng 10, Tư duy hình học | 5 – 10 tuổi | 3 – 5 phút |
| **3** | **Flappy Bird (2013)** | `Flappy Math` | Tính nhẩm nhanh, Phản xạ tức thì | 6 – 10 tuổi | 1 – 2 phút |
| **4** | **Space Invaders (1978)** | `Space Math Invaders` | Bảng cửu chương, Nhận diện từ | 5 – 10 tuổi | 2 – 4 phút |
| **5** | **Frogger (1981)** | `Frogger Sequence` | Quy luật dãy số, Bảng chữ cái | 4 – 8 tuổi | 2 – 3 phút |
| **6** | **Bomberman (1983)** | `Color Bomberman` | Giải mê cung, Khám phá tự nhiên | 5 – 9 tuổi | 3 – 4 phút |
| **7** | **Breakout / Arkanoid (1976)** | `Breakout Oxford` | Từ vựng Oxford theo chủ đề | 4 – 8 tuổi | 2 – 3 phút |
| **8** | **Donkey Kong (1981)** | `Donkey Math Ladder` | So sánh số lớn/bé, Thứ tự số | 5 – 9 tuổi | 2 – 4 phút |
| **9** | **Doodle Jump (2009)** | `Doodle Sky Hopper` | Nguyên âm / Phụ âm, Số nguyên tố | 6 – 10 tuổi | 1 – 3 phút |
| **10** | **Bubble Bobble (1986)** | `Bubble Math Merge` | Hợp nhất số, Phép cộng mầm non | 3 – 6 tuổi | 2 – 3 phút |

---

## 2. CHI TIẾT THIẾT KẾ 10 TỰA GAME KINH ĐIỂN

---

### Game 1: 🟡 Pac-Man Học Chữ & Số (Pac-Edu)
* **Nguyên bản:** *Pac-Man (Namco, 1980)*.
* **Cốt truyện giáo dục:** Chú Pac-Man màu vàng đói bụng chu du trong mê cung sách vở để thu thập các hạt tri thức.
* **Cơ chế Gameplay:**
  - Bản đồ mê cung dạng lưới Grid $15 \times 15$.
  - 4 bóng ma ngộ nghĩnh (không có răng nanh hay mặt dữ tợn) tuần tra chậm rãi.
* **Lồng ghép bài học:**
  - **Chế độ 1 - Bữa Tiệc Số Chẵn/Lẻ:** Đề bài: *"Pac-Man chỉ được ăn các số Chẵn!"*. Bé điều khiển Pac-Man ăn các số `2, 4, 6, 8, 10...` để cộng điểm. Nếu ăn nhầm số lẻ sẽ bị giảm năng lượng.
  - **Chế độ 2 - Đánh Vần Tiếng Anh (Spelling Quest):** Màn hình hiện chữ `"CAT"`. Trong mê cung rải rác các chữ cái. Bé phải tìm ăn đúng chữ `C`, rồi tới `A`, rồi tới `T`. Ăn xong chữ cái nào, loa phát âm to rõ chữ cái đó kèm hiệu ứng lấp lánh.
  - **Viên Năng Lượng Thần Kỳ (Super Pellet):** Viên năng lượng giải một phép tính lớn (ví dụ: $7 + 3 = 10$). Khi ăn vào, các bóng ma biến thành những viên kẹo ngọt vui vẻ, Pac-Man có thể đuổi bắt chúng trong 7 giây.
* **Tệp code đề xuất:** `src/screens/PacEduGameScreen.tsx`.

---

### Game 2: 🧱 Xếp Gạch Tính Tổng 10 (Math-Tris)
* **Nguyên bản:** *Tetris (Alexey Pajitnov, 1984)*.
* **Cốt truyện giáo dục:** Xây dựng tòa tháp tri thức bằng cách ghép nối các con số tương thích.
* **Cơ chế Gameplay:**
  - Các khối gạch số nhiều màu sắc rơi dần từ trên xuống (tốc độ vừa phải dành riêng cho trẻ em).
  - Bé có thể bấm nút xoay khối gạch và dịch chuyển trái/phải/thả nhanh.
* **Lồng ghép bài học:**
  - **Quy tắc Số Bạn Thân (Number Bonds to 10):** Đây là phương pháp dạy toán mầm non và lớp 1 nổi tiếng ở Singapore & Nhật Bản.
    - Khi khối số `4` chạm vào khối số `6` $\rightarrow 4 + 6 = 10 \rightarrow$ Hai khối nổ tung thành sao vàng, cộng $+100$ điểm!
    - Khối `2` kết hợp khối `8` $\rightarrow$ Nổ tan hàng!
  - **Chế độ Ghép Màu & Hình Học:** Dành cho bé mẫu giáo 3-5 tuổi (ghép 2 nửa hình tròn thành quả cầu hoàn chỉnh).
* **Tệp code đề xuất:** `src/screens/MathTrisGameScreen.tsx`.

---

### Game 3: 🐦 Chú Chim Vượt Ống Tính Nhẩm (Flappy Math)
* **Nguyên bản:** *Flappy Bird (Đông Nguyễn, 2013)*.
* **Cốt truyện giáo dục:** Chú chim nhỏ bay qua khu rừng câu hỏi để về tổ ấm.
* **Cơ chế Gameplay:**
  - Chạm nhẹ vào màn hình để chim đập cánh bay lên, buông tay chim rơi xuống theo trọng lực mượt mà.
* **Lồng ghép bài học:**
  - Phía trước mỗi cặp cột cây chia thành **2 cổng bay:**
    - Cổng trên: Mang số `12`
    - Cổng dưới: Mang số `15`
  - Đề bài hiện to ở giữa đỉnh màn hình: `"3 x 4 = ?"`
  - Bé phải điều chỉnh nhịp đập cánh để lượn qua đúng cổng `12`. Nếu bay vào cổng `15` hoặc va vào cành cây, chim sẽ nảy nhẹ lùi lại và được thử lại ngay.
* **Giá trị rèn luyện:** Rèn phản xạ tính nhẩm siêu tốc chỉ trong 1 - 2 giây, giúp trẻ không còn sợ các phép tính nhân/chia.
* **Tệp code đề xuất:** `src/screens/FlappyMathGameScreen.tsx`.

---

### Game 4: 👾 Bắn Ruồi Không Gian Tri Thức (Space Math Invaders)
* **Nguyên bản:** *Space Invaders / Galaga (1978 - 1981)*.
* **Cốt truyện giáo dục:** Bảo vệ Trái Đất khỏi cơn mưa thiên thạch bí ẩn mang các câu đố.
* **Cơ chế Gameplay:**
  - Tàu phi thuyền của bé ở phía đáy màn hình, vuốt ngón tay để trượt ngang và tự động bắn đạn laser ngôi sao.
* **Lồng ghép bài học:**
  - Các phi thuyền ngoài hành tinh bay theo hàng ngang từ trên xuống. Mỗi con mang một từ tiếng Anh hoặc con số.
  - **Radar nhiệm vụ:** *"Bắn hạ từ: QUẢ TÁO 🍎"*. Hàng quái vật gồm các từ `BANANA`, `APPLE`, `ORANGE`. Bé di chuyển tàu ngắm bắn đúng quái vật mang chữ `APPLE`.
  - **Thử thách Boss cuối:** Quái vật khổng lồ có thanh máu là các phép tính bảng cửu chương (ví dụ: $6 \times 7$). Bé bắn đúng con số $42$ liên tiếp 3 lần để thu phục Boss thành bạn tốt!
* **Tệp code đề xuất:** `src/screens/SpaceMathInvadersScreen.tsx`.

---

### Game 5: 🐸 Chú Ếch Băng Đường Đếm Nhảy (Frogger Sequence)
* **Nguyên bản:** *Frogger (Konami, 1981)*.
* **Cốt truyện giáo dục:** Chú ếch xanh vượt qua dòng sông tri thức để đến dự tiệc sinh nhật ao làng.
* **Cơ chế Gameplay:**
  - Màn hình chia làm 2 phần: Nửa dưới là đường đi trên cạn, nửa trên là dòng sông có các khúc gỗ và lá sen trôi dạt.
* **Lồng ghép bài học:**
  - **Quy luật Dãy Số (Math Sequence):**
    - Khúc gỗ 1: `2`
    - Khúc gỗ 2: `4`
    - Khúc gỗ 3: `6`
    - Khúc gỗ 4 cần nhảy tới: Có 2 lựa chọn trôi qua `8` hoặc `9`. Bé phải điều khiển ếch nhảy lên khúc gỗ số `8` theo quy luật đếm cách 2!
  - **Quy luật Bảng Chữ Cái:** Nhảy theo chuỗi vần `A ➔ B ➔ C ➔ D`.
* **Giá trị rèn luyện:** Xây dựng tư duy logic nền tảng cho khoa học máy tính và toán học giải tích sau này.
* **Tệp code đề xuất:** `src/screens/FroggerSequenceScreen.tsx`.

---

### Game 6: 💣 Đặt Bóng Màu Mê Cung (Color Bomberman)
* **Nguyên bản:** *Bomberman (Hudson Soft, 1983)*.
* **Cốt truyện giáo dục:** Bé thám hiểm đi tìm kho báu cổ đại bị chôn giấu sau các khối đất đá mềm.
* **Cơ chế Gameplay:**
  - Bản đồ mê cung nhìn từ trên xuống (Top-down view).
  - Không dùng bom lửa sát thương, bé đặt **Quả Cầu Nước / Bong Bóng Màu Sắc**. Sau 2 giây bóng vỡ tung tạo ra làn nước mát làm tan biến các chướng ngại vật bằng đất.
* **Lồng ghép bài học:**
  - Khi phá vỡ các khối đá phong ấn, rương cổ tích sẽ xuất hiện:
    - Mở rương: Xuất hiện câu đố vui khoa học đời sống (ví dụ: *"Loài vật nào sống ở Nam Cực?"* ➔ `Chim Cánh Cụt 🐧`, `Lạc Đà 🐪`, `Hươu Cao Cổ 🦒`).
    - Bé chọn đúng sẽ nhận được chìa khóa vàng để mở cổng qua màn.
* **Tệp code đề xuất:** `src/screens/ColorBombermanScreen.tsx`.

---

### Game 7: 🏓 Bắn Bóng Phá Gạch Từ Vựng (Breakout Oxford)
* **Nguyên bản:** *Breakout (Atari, 1976) / Arkanoid*.
* **Cốt truyện giáo dục:** Quả bóng thần kỳ bay lượn trên bầu trời để giải phóng các từ vựng bị đóng băng.
* **Cơ chế Gameplay:**
  - Bé dùng ngón tay kéo thanh đỡ bên dưới để đón quả bóng nảy qua lại, không để bóng rơi xuống đáy.
* **Lồng ghép bài học:**
  - Mỗi hàng gạch trên cao mang biểu tượng và từ vựng thuộc các chủ đề Oxford:
    - Hàng 1 (Gia đình): `Father 👨`, `Mother 👩`, `Baby 👶`.
    - Hàng 2 (Màu sắc): `Red 🔴`, `Blue 🔵`, `Green 🟢`.
  - Mỗi khi bóng nảy trúng viên gạch nào, hiệu ứng âm thanh nổ pop vui tai vang lên, đồng thời giọng đọc Oxford phát âm to rõ từ đó.
  - Sau khi phá hết gạch, toàn bộ từ vựng đã học được tổng kết lại trên bảng vinh danh để bé đọc lại một lần nữa.
* **Tệp code đề xuất:** `src/screens/BreakoutOxfordScreen.tsx`.

---

### Game 8: 🦍 Khỉ Khổng Lồ & Bậc Thang So Sánh (Donkey Math Ladder)
* **Nguyên bản:** *Donkey Kong (Nintendo, 1981)*.
* **Cốt truyện giáo dục:** Bé dũng sĩ leo lên ngọn tháp cao để giải cứu chú gấu bông bị bác khỉ giữ trên đỉnh.
* **Cơ chế Gameplay:**
  - Các tầng thang dốc nghiêng nối với nhau bằng các cầu thang thẳng đứng.
  - Bác khỉ ở đỉnh tháp thỉnh thoảng lăn các quả bóng rơm xuống, bé phải bấm nút Nhảy để tránh bóng rơm.
* **Lồng ghép bài học:**
  - Ở chân mỗi chiếc thang leo lên tầng tiếp theo có một **Cửa Khóa Toán Học**:
    - Hiển thị phép so sánh: `7 [ ? ] 9`. Bé phải chọn dấu đúng: `>` hoặc `<` hoặc `=`.
    - Chọn đúng: Thang hạ xuống và bé leo lên tầng cao hơn.
    - Càng lên tầng cao, bài học càng nâng dần: So sánh biểu thức $3 + 2 [ ? ] 4 + 1$.
* **Tệp code đề xuất:** `src/screens/DonkeyMathLadderScreen.tsx`.

---

### Game 9: 🦘 Bật Nhảy Lên Mây Tri Thức (Doodle Sky Hopper)
* **Nguyên bản:** *Doodle Jump (Lima Sky, 2009)*.
* **Cốt truyện giáo dục:** Chú thú cưng nhí nhảnh đeo lò xo dưới chân nhảy vút lên bầu trời tìm kiếm các vì sao.
* **Cơ chế Gameplay:**
  - Nhân vật tự động nhún nảy liên tục. Bé nghiêng máy (hoặc bấm nút Trái / Phải) để điều khiển hướng rơi vào các đám mây lơ lửng.
* **Lồng ghép bài học:**
  - **Thử thách Nguyên Âm Tiếng Anh:**
    - Các đám mây xanh mang các chữ cái Nguyên âm (`A`, `E`, `I`, `O`, `U`): Khi nhảy trúng, lò xo bật mạnh đẩy bé vút lên thêm 500m!
    - Các đám mây xám mang phụ âm: Khi nhảy trúng, mây kêu răng rắc nứt vỡ, đòi hỏi bé phải phản xạ tìm mây khác ngay lập tức!
  - **Thử thách Dãy Số Nguyên Tố:** Dành cho học sinh tiểu học (nhảy vào các số `2, 3, 5, 7, 11...`).
* **Tệp code đề xuất:** `src/screens/DoodleSkyHopperScreen.tsx`.

---

### Game 10: 🦕 Khủng Long Thổi Bóng Hợp Nhất (Bubble Bobble Math Merge)
* **Nguyên bản:** *Bubble Bobble (Taito, 1986)*.
* **Cốt truyện giáo dục:** Đôi bạn khủng long xanh Bub và Bob thổi bong bóng xà phòng kỳ diệu để sáng tạo ra những con số mới.
* **Cơ chế Gameplay:**
  - Khủng long nhảy qua các bục lơ lửng, bấm nút để nhả ra các quả bong bóng tròn bay lơ lửng trong không gian.
* **Lồng ghép bài học:**
  - **Cơ chế Hợp Nhất Toán Học (Math 2048 Style):**
    - Khi thổi ra quả bóng mang số `5`, bé đẩy nó chạm vào một quả bóng số `5` khác đang lơ lửng $\rightarrow$ Hai quả bóng hợp nhất thành quả bóng số `10` khổng lồ!
    - Tiếp tục ghép hai quả bóng số `10` thành quả bóng `20` chứa đầy kẹo ngọt và phần thưởng!
  - Cực kỳ thư giãn, âm nhạc êm dịu, không áp lực thời gian, rất thích hợp cho các bé mầm non làm quen với khái niệm "Cộng gộp" của phép toán.
* **Tệp code đề xuất:** `src/screens/BubbleMathMergeScreen.tsx`.

---

## 3. KIẾN TRÚC KỸ THUẬT CHUNG TRÊN REACT NATIVE

Toàn bộ 10 tựa game trên đều tuân thủ các chuẩn kỹ thuật cao cấp đã được kiểm nghiệm trong dự án Kids Launcher:

1. **Hiệu năng 60 FPS Native:**
   - Dùng vòng lặp `requestAnimationFrame` kết hợp `useRef` để tính toán vật lý tọa độ $(x, y)$, không lạm dụng React re-render gây giật màn hình.
   - Các hiệu ứng chuyển động dùng `Animated` với `useNativeDriver: true`.
2. **Âm thanh & Phát âm đa ngôn ngữ:**
   - Tích hợp trực tiếp vào component trung tâm [SoundPlayer.tsx](file:///c:/react-native-launcher-kit/example/src/components/SoundPlayer.tsx).
   - Phát âm tiếng Anh chuẩn Oxford (US/UK) và tiếng Việt miền Bắc/Nam chuẩn thông qua native module và fallback thông minh.
3. **Phụ Huynh Quản Lý & Bảo Vệ Trẻ Em:**
   - Tích hợp tính năng hẹn giờ giới hạn giờ chơi (Daily Time Limit) từ [AppTimeLimitService](file:///c:/react-native-launcher-kit/example/src/services/appTimeLimitService.ts).
   - Khi hết giờ, game tự động lưu tiến trình và chuyển về màn hình nhắc nhở bé nghỉ ngơi bảo vệ mắt.

---

## 4. LỘ TRÌNH TRIỂN KHAI (ROADMAP)

### 🥇 Giai đoạn 1: Bộ Ba Tiên Phong (Wave 1)
* [ ] **Bé Mario Khám Phá** (Platformer 2D Native - xem chi tiết tại [MARIO_EDU_PLATFORMER_GAME_SPEC.md](file:///c:/react-native-launcher-kit/docs/MARIO_EDU_PLATFORMER_GAME_SPEC.md)).
* [ ] **Pac-Edu** (Pac-Man Mê Cung Học Số Chẵn/Lẻ & Đánh Vần).
* [ ] **Flappy Math** (Chim Bay Tính Nhẩm Nhanh).

### 🥈 Giai đoạn 2: Không Gian & Phản Xạ (Wave 2)
* [ ] **Space Math Invaders** (Bắn Ruồi Tri Thức Bảng Cửu Chương).
* [ ] **Frogger Sequence** (Ếch Băng Sông Dãy Số Quy Luật).
* [ ] **Breakout Oxford** (Bắn Bóng Phá Gạch Từ Vựng Tiếng Anh).

### 🥉 Giai đoạn 3: Xếp Hình & Hợp Nhất Trí Tuệ (Wave 3)
* [ ] **Math-Tris** (Xếp Gạch Tổng 10 Singapore).
* [ ] **Color Bomberman** (Bóng Nước Mê Cung Khoa Học).
* [ ] **Donkey Math Ladder** (Bậc Thang So Sánh Lớn/Bé).
* [ ] **Bubble Math Merge** (Khủng Long Thổi Bóng Hợp Nhất Số).
