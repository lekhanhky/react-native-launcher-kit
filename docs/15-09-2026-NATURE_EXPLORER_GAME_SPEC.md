# 🌿🐾 TÀI LIỆU ĐẶC TẢ THIẾT KẾ GAME: BIỆT ĐỘI KHÁM PHÁ NHÍ (NATURE EXPLORER)
> **Dự án:** Kids Launcher & Educational Platform  
> **Nền tảng:** React Native (Android Launcher) & Web Portal (Next.js)  
> **Backend & Storage:** Supabase (PostgreSQL + Realtime + Storage)  
> **Phong cách đồ họa:** 3D Stylized Animation (Chuẩn Google Veo / Pixar)  
> **Nhân vật chính:** 👦 **Bé Tom** & 👧 **Bé MiMi** (Theo Bảng Nhân Vật Kỹ Thuật Tối Ưu)  
> **Đối tượng hướng đến:** Trẻ 4 – 9 tuổi  
> **Ngày tạo:** 15/09/2026 (Cập nhật: 15/09/2026 - Chuẩn hóa Nhân vật Tom & MiMi theo Model Sheet)  
> **Trạng thái:** Bản thiết kế hoàn chỉnh (Dynamic Content-Driven)

---

## 📌 1. TỔNG QUAN & TRIẾT LÝ GIÁO DỤC

### 1.1. Sứ mệnh của Game
Trẻ em ở độ tuổi 4–9 luôn tràn ngập sự tò mò về thế giới xung quanh: *"Tại sao cây xương rồng lại có gai?", "Tại sao cổ hươu lại dài?", "Cây nắp ấm ăn thịt như thế nào?"*.

**"Biệt Đội Khám Phá Nhí"** được xây dựng như một trò chơi phiêu lưu sinh thái đa giác quan:
- **Học thông qua trải nghiệm tương tác trực quan (Playful Learning & Cause-and-Effect)**: Bé không bị ép làm bài kiểm tra hay học vẹt trắc nghiệm, mà được tự tay kéo thả cho thú ăn, di kính lúp tìm con vật ẩn nấp, cào lá bới cát, thổi gió làm bay hạt giống, và tua thanh trượt xem vòng đời sinh trưởng cùng hai người bạn thân thiết: **Bé Tom** và **Bé MiMi**.
- **Đa dạng hóa cơ chế chơi (Multi-Modal Interaction)**: Kết hợp linh hoạt 7+ hình thức tương tác (kính lúp, cào thẻ, kéo thả, thanh trượt thời gian, thổi micro, chụp ảnh Safari, nối bóng và trắc nghiệm hình ảnh) phù hợp với sự phát triển vận động tinh và tâm lý tò mò của trẻ 4–9 tuổi.
- **Trực quan hóa sinh động & Thân thiện với trẻ chưa biết chữ**: Mọi thử thách đều có **hình ảnh minh họa trực quan 3D** kết hợp **giọng đọc thuyết minh truyền cảm**, có biểu cảm sinh động của Tom & MiMi giúp các bé nhỏ tuổi (4-6 tuổi) dễ dàng nắm bắt.
- **Dữ liệu hoàn toàn động (Dynamic Content-Driven)**: Mọi màn chơi, cảnh quan, sinh vật và loại hình tương tác con (Interaction Type & Config) được quản lý tập trung trên **Supabase**. Phụ huynh và ban biên tập có thể thêm màn mới, thử thách mới từ xa mà **không cần biên dịch lại file APK**.

---

## 👦👧 2. ĐẶC TẢ CHI TIẾT HAI NHÂN VẬT CHÍNH (BÉ TOM & BÉ MIMI)

Thiết kế nhân vật được chuẩn hóa đồng bộ 100% theo **Bảng Nhân Vật Kỹ Thuật Tối Ưu (Google Veo / 3D Animation Standard)**:

```
       ┌──────────────────────────────┐          ┌──────────────────────────────┐
       │      👦 BÉ TOM (BÉ TRAI)     │          │     👧 BÉ MIMI (BÉ GÁI)      │
       ├──────────────────────────────┤          ├──────────────────────────────┤
       │ • Cậu bé năng động, tò mò    │          │ • Cô bé đáng yêu, hoạt bát   │
       │ • Tóc ngắn nâu ấm cắt gọn    │ ◄──────► │ • Tóc búi 2 củ tỏi + nơ hồng │
       │ • Quần yếm bò denim cổ điển  │ Đối thoại│ • Váy yếm hồng pastel mềm mại│
       │ • Áo thun vàng kem + giày bot│ sinh động│ • Đôi mắt to tròn lém lỉnh   │
       │ • "Bé nhìn bạn voi kìa!"     │          │ • "Oa anh Tom ơi, đẹp quá!"  │
       └──────────────────────────────┘          └──────────────────────────────┘
```

---

### 2.1. Nhân Vật Nam: BÉ TOM 👦

![Bé Tom Profile](file:///C:/Users/LEKHANHKY/.gemini/antigravity/brain/23663c35-b74d-41c6-bf5e-aafb828b1078/.user_uploaded/media_1789478271532.jpg)

#### A. Hồ Sơ Cơ Bản & Tính Cách
* **Đặc tính**: Cậu bé năng động, giàu trí tò mò, hơi bướng bỉnh nhẹ nhưng cực kỳ tình cảm và luôn che chở cho em gái MiMi.
* **Sở thích**: Thích khám phá, chạy nhảy, cầm kính lúp và bút chì màu ghi chép những điều kỳ thú trong thiên nhiên.
* **Tỷ lệ cơ thể & Chiều cao**: Chuẩn tỷ lệ trẻ em ~4.5 – 5 đầu (Chiều cao mô hình ~80cm – 110cm).

#### B. Ngoại Hình & Trang Phục (3D Render Specification)
* **Kiểu tóc**: Tóc ngắn cắt gọn gàng, chải hơi lệch nhẹ tự nhiên, màu **Nâu Hạt Dẻ Ấm** (HEX `#6B3A2A`).
* **Khuôn mặt**: Má phúng phính bầu bĩnh, đôi mắt to đen láy lém lỉnh, hàng lông mày sắc nét linh hoạt.
* **Trang phục**:
  * **Quần yếm bò**: Chất liệu denim xanh cổ điển (HEX `#5B82A6`), có túi phía trước ngực và đường chỉ may tinh tế.
  * **Áo thun trong**: Cộc tay màu vàng kem pastel (HEX `#FCE794`), cổ tròn mềm mại.
  * **Giày dép**: Giày thể thao Sneaker màu trắng tinh, đế có rãnh chống trượt bám đất khi thám hiểm.
* **Phụ kiện tham chiếu (Accessories)**:
  * Nón lưỡi trai thể thao phối màu vàng – xanh denim.
  * Bút sáp màu (Pencil / Crayon) và gấu bông hồng nhỏ.

#### C. Lưới Biểu Cảm & Diễn Xuất (Expression Grid)
* **Vui vẻ & Tự hào**: Cười mỉm tự tin, reo lên phấn khích khi bé chọn đúng đáp án.
* **Nghịch ngợm & Tò mò**: Nháy mắt tinh quái, chỉ tay vào các bụi cây có con vật ẩn nấp.
* **Tập trung & Quyết tâm**: Nhíu mày suy nghĩ, tay chống cằm khi gặp câu đố hóc búa.
* **Phoneme Chart (Khuôn miệng phát âm)**: Đầy đủ các khẩu hình chuẩn `A, E, I, O, U, M/B, TH/S, Ch/Sh` đồng bộ nhép môi với giọng lồng tiếng Việt/Anh.

---

### 2.2. Nhân Vật Nữ: BÉ MIMI 👧

![Bé MiMi Profile](file:///C:/Users/LEKHANHKY/.gemini/antigravity/brain/23663c35-b74d-41c6-bf5e-aafb828b1078/.user_uploaded/media_1789478271524.jpg)

#### A. Hồ Sơ Cơ Bản & Tính Cách
* **Đặc tính**: Cô bé đáng yêu, ngây thơ, hoạt bát, tràn đầy năng lượng và yêu mến mọi loài cây cỏ, hoa lá, con vật nhỏ.
* **Sở thích**: Thích ôm ấp gấu bông, vẽ hoa lá bằng bút sáp hồng, hay đặt ra những câu hỏi ngây thơ nhưng bất ngờ.
* **Tỷ lệ cơ thể & Chiều cao**: Chuẩn tỷ lệ trẻ em ~4.5 – 5 đầu (Chiều cao mô hình ~80cm).

#### B. Ngoại Hình & Trang Phục (3D Render Specification)
* **Kiểu tóc**: Tóc màu nâu ấm, búi củ tỏi hai bên đầu (Space Buns) cực kỳ đáng yêu, mái bằng lưa thưa chạm lông mày. Hai bên búi tóc cài **hai chiếc nơ hồng pastel** (HEX `#E77497`).
* **Khuôn mặt**: Gương mặt tròn xoe bầu bĩnh, má ửng hồng hào, đôi mắt to long lanh ngơ ngác đầy thiện cảm.
* **Trang phục**:
  * **Váy yếm xòe**: Màu hồng pastel dịu ngọt (HEX `#F8B7CD`), chất liệu vải mềm rủ nhẹ nhàng, không nhăn, có đính nơ nhỏ xinh ở cổ áo.
  * **Giày dép**: Giày búp bê màu hồng cùng tông ôm chân nhẹ nhàng.
* **Phụ kiện tham chiếu (Accessories)**:
  * Chú gấu bông màu hồng phấn (Plush Bear) luôn mang theo.
  * Bút sáp màu hồng phấn cầm tay để tô màu các loài hoa.

#### C. Lưới Biểu Cảm & Diễn Xuất (Expression Grid)
* **Hớn hở & Hét lên vui sướng**: Hai mắt sáng rực, nhảy cẫng lên vỗ tay khi bé hoàn thành màn chơi.
* **Ngạc nhiên & Sững sốt**: Miệng tròn chữ O, mắt mở to kinh ngạc trước những sự thật sinh học kỳ thú.
* **Mếu máo / Bối rối**: Khi chọn nhầm đáp án, khẽ chớp mắt ngập ngừng: *"Ôi suýt đúng rồi, bé thử lại với MiMi nhé!"*.
* **Bướng bỉnh & Suy tư**: Phồng má đáng yêu khi đang cùng bé suy nghĩ câu đố.

---

### 2.3. Dải Xoay Cơ Thể 360 Độ (Turnaround Views)
Cả Tom và MiMi đều được chuẩn hóa 5 góc nhìn phục vụ mô hình hoạt họa:
1. **Front (Chính diện)**: Dùng trong các màn hình đối thoại, hướng dẫn và chúc mừng.
2. **3/4 Front (Góc nghiêng 45°)**: Dùng khi nhân vật đứng quan sát hoặc tương tác chạm vào các con vật trên cảnh.
3. **Side (Góc nghiêng 90°)**: Dùng khi nhân vật di chuyển/chạy bộ từ cảnh này sang cảnh khác.
4. **3/4 Back & Back (Góc nhìn từ phía sau)**: Tạo chiều sâu khi hai bé nhìn về phía rừng rậm/đại ngàn cùng người chơi.

---

## 🗺️ 3. CẤU TRÚC GAMEPLAY & HỆ THỐNG CƠ CHẾ TƯƠNG TÁC ĐA DẠNG

### 3.1. Cấu trúc 3 Cấp bậc (Hierarchy)
1. **Màn lớn / Thế Giới (World)**: Đại diện cho một hệ sinh thái lớn (Vd: Rừng Mưa Nhiệt Đới, Thảo Nguyên Châu Phi, Sa Mạc & Ốc Đảo, Thế Giới Dưới Nước, Vườn Thực Vật Đột Biến...).
2. **Cảnh con (Scene)**: Mỗi Thế giới gồm 3 – 5 cảnh trượt ngang (Horizontal Panorama) hoặc các điểm dừng chân khác nhau.
3. **Thực thể tương tác (Interactive Entity - Cây & Con vật)**:
   - Được gắn tọa độ tương đối `%` trên cảnh nền.
   - Khi bé chạm vào: Phát hiệu ứng rung rinh/nhảy múa + Tiếng kêu/Âm thanh sinh học + Kích hoạt Thử thách tương tác (Mini-game hoặc Khám phá) tương ứng.

---

### 3.2. Hệ Thống 7+ Cơ Chế Tương Tác Qua Từng Màn (Multi-Modal Interaction System)
Để tránh sự nhàm chán của các bài kiểm tra trắc nghiệm chữ truyền thống, game áp dụng **triết lý Montessori & Tương tác xúc giác nguyên bản (Tactile Play)** phù hợp với lứa tuổi 4–9:

```
                          ┌──────────────────────────────────────────────┐
                          │   HỆ THỐNG TƯƠNG TÁC ĐA GIÁC QUAN CỦA BÉ     │
                          └──────────────────────┬───────────────────────┘
                                                 │
          ┌──────────────────┬───────────────────┼───────────────────┬──────────────────┐
          ▼                  ▼                   ▼                   ▼                  ▼
    🔍 KÍNH LÚP        🍎 KÉO - THẢ       🌿 CÀO LÁ / BỚI CÁT   ⏳ THANH TRƯỢT     🌬️ THỔI MICRO
   Soi tìm chi tiết   Cho thú ăn & Chăm sóc  Khai quật bí mật    Vòng đời sinh trưởng  Gió thổi hạt bay
```

#### 1. 🔍 Kính Lúp Thám Tử & Đèn Pin Soi Đêm (`MAGNIFIER`)
* **Cách chơi**: Bé dùng ngón tay di chuyển chiếc **Kính lúp của Tom** hoặc **Đèn pin của MiMi** trên màn hình. Vùng kính lúp soi qua sẽ phóng to và làm rõ nét các chi tiết ẩn (ví dụ: hoa văn cánh bướm, chú bọ ngụy trang trên thân cây, hoặc soi trong hang tối).
* **Thao tác**: Chạm rê ngón tay (`PanGesture`).
* **Hiệu ứng**: Phóng to x2 và lộ sáng đối tượng bên dưới. Bé tìm trúng sinh vật ➔ Sinh vật cử động vẫy tay chào và reo lên vui nhộn.

#### 2. 🍎 Kéo – Thả Sinh Thái: Nuôi Dưỡng & Chuỗi Thức Ăn (`FEEDING`)
* **Cách chơi**: Dưới đáy màn hình xuất hiện 3 món vật phẩm (thức ăn hoặc công cụ). Bé kéo món đồ thích hợp thả vào đúng sinh vật:
  - *Cây nắp ấm*: Bé kéo chú muỗi thả vào miệng ấm ➔ Ấm khép nắp cái "Tách!", rung rinh nhai nhóp nhép.
  - *Hươu cao cổ*: Kéo bó lá non lên ngọn cây cao để hươu vươn cổ tới ngoạm.
  - *Gấu nâu*: Kéo cá hồi vào giỏ, gạt bỏ lon thiếc hoặc rác thải ra ngoài.
* **Thao tác**: Kéo - Thả (`Drag & Drop`). Có phản hồi haptic rung nhẹ khi khớp đích (Snap-to-target).

#### 3. 🌿 Cào Lá – Quét Bùn – Bới Cát Khai Quật (`SCRATCH`)
* **Cách chơi**: Sinh vật bị che phủ bởi một lớp tự nhiên (lớp lá khô rụng, lớp cát sa mạc, lớp tuyết trắng hoặc sương mù mặt nước). Bé dùng ngón tay cào quẹt liên tục để dọn sạch lớp phủ.
* **Thao tác**: Vuốt liên tục nhiều lần (`Multi-stroke Swiping`).
* **Hiệu ứng**: Khi diện tích cào sạch đạt >70%, toàn bộ lớp phủ tan biến, bung tỏa hiệu ứng pháo hoa sao vàng kèm âm thanh reo mừng của MiMi.

#### 4. ⏳ Thanh Trượt Thời Gian: Vòng Đời Sinh Trưởng (`LIFE_CYCLE`)
* **Cách chơi**: Trực quan hóa quy luật phát triển tự nhiên. Bé kéo thanh trượt từ trái sang phải để chứng kiến từng giai đoạn biến hình kỳ diệu:
  - *Mầm cây hướng dương*: Hạt giống 🌱 ➔ Nảy mầm 🌿 ➔ Cây vươn cao ➔ Bông hoa nở rộ xoay theo mặt trời 🌻.
  - *Chú bướm xinh*: Trứng bướm ➔ Sâu róm ăn lá ➔ Kén tằm ngủ say ➔ Bướm bung cánh bay lượn 🦋.
  - *Bạn ếch*: Trứng nước ➔ Nòng nọc bơi lội ➔ Ếch con mọc chân ➔ Chú ếch xanh nhảy ồm ộp 🐸.
* **Thao tác**: Kéo thanh trượt (`Slider Drag`).

#### 5. 🌬️ Thổi Micro & Tương Tác Âm Thanh (`BREATH_MIC`)
* **Cách chơi**: Tận dụng micro thiết bị. MiMi khích lệ: *"Bé hãy thổi phù một hơi thật mạnh vào máy để giúp bạn bồ công anh nhé!"*.
* **Thao tác**: Thổi hơi hoặc phát âm thanh to vào micro.
* **Hiệu ứng**: Khi biên độ âm thanh (dB) vượt ngưỡng thiết lập, hàng trăm cánh hoa bồ công anh tách ra, bay dập dờn theo làn gió khắp màn hình kèm âm thanh du dương.

#### 6. 📸 Nhiếp Ảnh Gia Nhí: Bắt Trọn Khoảnh Khắc (`SNAPSHOT`)
* **Cách chơi**: Sinh vật chuyển động tự nhiên (chim chuyền cành, sóc giấu hạt dẻ, cá heo nhào lộn). Có một nút chụp ảnh lớn màu vàng rực rỡ. Bé căn đúng thời điểm khoảnh khắc đẹp nhất để bấm "Tách!".
* **Thao tác**: Chạm nút chụp đúng nhịp (`Timing Tap`).
* **Hiệu ứng**: Khung hình đóng băng 1 giây tạo thành bức ảnh Polaroid, được dán ngay vào Sổ Bách Khoa Nhí với 3 ngôi sao lấp lánh.

#### 7. 🧩 Nối Bóng Sinh Vật & Ghép Hình Giải Phẫu (`SILHOUETTE`)
* **Cách chơi**: Trên cảnh xuất hiện bóng đen (silhouette) của các bộ phận hoặc con vật. Bé kéo con vật/bộ phận tương ứng thả khớp vào bóng râm:
  - Ghép chiếc vòi dài vào mặt chú Voi.
  - Ghép đôi cánh vút cong vào chú Đại Bàng.
  - Kéo sinh vật thả vào đúng bóng in trên mặt đất.
* **Thao tác**: Kéo thả khớp hình (`Shape Match & Snap`).

#### 8. 📝 Thử Thách Trắc Nghiệm Hình Ảnh & Thuyết Minh (`MCQ`)
* **Cách chơi**: Dùng như màn tổng kết nhẹ nhàng. Hiển thị hình ảnh to rõ, Bé Tom hoặc Bé MiMi đọc to câu hỏi và 2-3 thẻ lựa chọn bằng hình ảnh trực quan (không đánh đố bằng văn bản phức tạp).

---

### 3.4. Hệ Thống Rạp Chiếu Phim Sinh Học Nhí Tích Hợp YouTube (In-Game Discovery Cinema Player)

Nhằm kết hợp hoàn hảo giữa mô hình **Đồ Họa 3D Tương Tác** và **Thế Giới Tự Nhiên Ngoài Đời Thực**, trò chơi tích hợp một rạp chiếu phim khoa học thu nhỏ (`NatureCinemaModal`) phát video trực tiếp ngay trong ứng dụng mà không đẩy bé ra ngoài trình duyệt hay ứng dụng YouTube thông thường.

```
┌──────────────────────────────────────────────────────────────────┐
│   🎬 RẠP PHIM THÁM HIỂM NHÍ: BẮT TRỌN THẾ GIỚI TỰ NHIÊN         │
├──────────────────────────────────────────────────────────────────┤
│  [Chạm Sinh Vật / Sổ Bách Khoa] ──> [Mở NatureCinemaModal]       │
│                                           │                      │
│                                           ▼                      │
│                ┌──────────────────────────────────────┐          │
│                │  react-native-youtube-iframe Player  │          │
│                │   (modestbranding=1, rel=0, no ads)  │          │
│                └──────────────────────────────────────┘          │
│                                           │                      │
│                                           ▼                      │
│                [Bé Xem Xong Clip Khoa Học 1 - 2 Phút]            │
│                                           │                      │
│                                           ▼                      │
│                 [Nhận +5 ⭐ Thám Hiểm & Quay Lại Game]            │
└──────────────────────────────────────────────────────────────────┘
```

#### A. Kiến Trúc Kỹ Thuật & Giải Pháp An Toàn Cho Trẻ Em (Child Safety)
* **Thư viện triển khai**: `react-native-youtube-iframe` kết hợp `react-native-webview`.
* **Cấu hình sandbox an toàn tuyệt đối**:
  * `modestbranding: 1`: Giảm thiểu tối đa logo và liên kết ngoài.
  * `rel: 0`: **Chặn 100% video đề xuất từ các kênh khác**, chỉ phát duy nhất video bài học đã được tuyển chọn.
  * Không hiển thị phần bình luận (comments), nút chia sẻ hay đề xuất thuật toán YouTube.
  * Trình phát đóng gói trong cửa sổ modal nội bộ, có nút `✕ Đóng` lớn dễ bấm để quay lại ngay với Tom và MiMi.

#### B. Danh Mục Video Tuyển Chọn Theo Từng Sinh Vật (Curated Video Registry)
| Sinh vật | Tiêu đề thước phim | Nguồn tài liệu | Thời lượng | YouTube Video ID |
| :--- | :--- | :--- | :--- | :--- |
| **🐘 Chú Voi Con** | Voi Con Tắm Suối & Nghịch Nước Rừng Rậm | National Geographic Kids | 1:45 | `dGgtu1i5tmg` |
| **🪴 Cây Nắp Ấm** | Cận Cảnh Cây Nắp Ấm Bắt Côn Trùng Bằng Mật Ngọt | BBC Earth / VTV7 | 1:30 | `womW1y-b_1E` |
| **🦎 Tắc Kè Hoa** | Khoảnh Khắc Tắc Kè Hoa Đổi Màu Da Ngụy Trang | BBC Wild Nature | 1:15 | `ioblgpA5eTo` |
| **🌸 Cây Xấu Hổ** | Thí Nghiệm Chạm Tay Lá Cây Cụp Lại Tự Vệ | Science for Kids | 1:00 | `g0LFBM3hOLs` |
| **🦋 Vòng Đời Bướm** | Thước Phim Quay Chậm (Timelapse) Bướm Lột Xác | Nature TimeLapse | 2:00 | `ocWgSgMGxOc` |

#### C. Điểm Chạm Kích Hoạt Trong Game
1. **Trong Sổ Tay Bách Khoa Toàn Thư (`FieldGuideModal`)**: Mỗi thẻ sinh vật đã mở khóa đều có thêm nút rực rỡ `🎬 Xem Thước Phim Thật` đặt cạnh nút nghe giọng đọc.
2. **Sau khi hoàn thành thử thách tương tác**: Bé Tom và Bé MiMi vui vẻ gợi ý: *"Bé có muốn xem bạn ấy ngoài đời thực chuyển động thế nào không? Cùng vào rạp chiếu phim nhé!"*.
3. **Phần thưởng học tập**: Bé xem xong video khoa học được tặng ngay **+5 ⭐ Thám Hiểm** để ghi nhận tinh thần tìm tòi học hỏi.

#### D. Giao Diện Quản Trị & Nhập Link YouTube Trong Admin Dashboard (Parent Settings)
Nhằm giúp phụ huynh và giáo viên chủ động điều chỉnh hoặc thay đổi nội dung video tư liệu theo giáo án bài học riêng:
* **Vị trí tích hợp**: Tab **YouTube (📺)** trong `ParentSettingsScreen` được trang bị thanh Segment Control:
  * `[📺 Kênh Cho Bé]`: Quản lý danh sách whitelist các kênh được phép xem và hạn mức thời gian.
  * `[🌿 Video Rừng Xanh (5)]`: Bảng điều khiển trực quan dành riêng cho 5 sinh vật trong game Khám Phá Thiên Nhiên.
* **Tính năng trên mỗi thẻ sinh vật**:
  * **Hiển thị trực quan**: Hình ảnh 3D chân thực, tên tiếng Việt, tên khoa học, phân loại cảnh (Thảm rừng / Tán cây) và nhãn trạng thái (`🌱 Gốc` / `✨ Đã Sửa`).
  * **Ô nhập Link/ID YouTube**: Hỗ trợ dán bất kỳ định dạng link (`youtube.com/watch?v=...`, `youtu.be/...`, mã ID 11 ký tự). Hệ thống tự động bóc tách mã video và hiển thị phản hồi kiểm tra tính hợp lệ tức thì (`✓ Mã ID nhận diện: ...`).
  * **Ô tùy chỉnh tiêu đề video**: Cho phép đặt tên video thân thiện cho bé.
  * **Nút 🎬 Xem Thử**: Mở trực tiếp `NatureCinemaModal` ngay trong trang quản trị để phụ huynh xem thử nội dung, âm thanh và độ an toàn trước khi lưu.
  * **Nút 🔄 Về Mặc Định**: Cho phép đặt lại từng sinh vật hoặc toàn bộ 5 sinh vật về video mẫu giáo dục chuẩn ban đầu.
* **Cơ chế lưu trữ & đồng bộ (`natureExplorerService`)**:
  * Lưu trữ bền vững cục bộ bằng MMKV qua khóa `STORAGE_KEYS.NATURE_YOUTUBE_CONFIG`.
  * Game `NatureExplorerGameScreen.tsx` tự động tải cấu hình mới khi khởi chạy, và hàm `openCinema()` luôn kiểm tra bản cập nhật mới nhất từ dịch vụ.

---

### 3.5. Chu Trình Màn Chơi Tiêu Biểu (Scene Gameplay Loop)
Mỗi Cảnh chơi (Scene) không lặp lại một kiểu tương tác duy nhất mà đan xen nhịp nhàng theo chu trình 5 bước:

```
[ 1. QUAN SÁT TỰ DO ] ──► Bé vuốt Panorama ngắm cảnh, chạm cây lá rung rinh
          ▼
[ 2. TÌM KIẾM BÍ ẨN ] ──► Dùng Kính lúp hoặc Cào lá tìm sinh vật ẩn nấp
          ▼
[ 3. TƯƠNG TÁC CHÍNH] ──► Cho ăn (Nắp ấm), Kéo vòng đời (Bướm), hoặc Ghép hình (Voi)
          ▼
[ 4. BÉ TOM & MIMI  ] ──► Đọc lời giải thích khoa học vui nhộn, vỗ tay khen ngợi
          ▼
[ 5. GHI NHẬN HUY HIỆU]─► Tặng Sticker vào Sổ Bách Khoa Toàn Thư & Mở cảnh mới
```

---

### 3.4. Bảng Quy Hoạch Cơ Chế Tương Tác Theo Từng Sinh Vật

#### A. Nhóm Động Vật (Animals)
| Con vật | Loại tương tác (`type`) | Cụ thể hành động của Bé | Lời dẫn của Tom & MiMi | Ý nghĩa giáo dục |
| :--- | :--- | :--- | :--- | :--- |
| **Tắc kè hoa** 🦎 | `MAGNIFIER` & `DRAG_COLOR` | Di kính lúp tìm tắc kè đang trốn trên lá; kéo bảng màu ngụy trang cho tắc kè | **Tom**: *"Tắc kè đang trốn đâu nhỉ? Bé dùng kính lúp tìm xem!"* | Khả năng ngụy trang tránh kẻ thù |
| **Voi** 🐘 | `SILHOUETTE` & `DRAG_WATER` | Kéo vòi gắn vào thân voi; chạm vòi hút nước sông rồi phun tắm mát cho voi con | **MiMi**: *"Vòi voi làm được nhiều việc lắm, bé giúp bạn tắm mát nhé!"* | Vòi voi đa năng như bàn tay con người |
| **Hươu cao cổ** 🦒 | `FEEDING` | Kéo chùm lá non đưa lên thật cao cho hươu vươn cổ dài tới ăn | **Tom**: *"Cổ bạn Hươu cao tít, bé đưa lá non lên cao cho bạn nhé!"* | Chiếc cổ dài giúp ăn lá non trên đỉnh cây |
| **Chim cánh cụt** 🐧 | `SNAPSHOT` | Canh lúc chim cánh cụt lặn xuống nước xòe cánh bơi như mái chèo để bấm "Tách!" | **MiMi**: *"Bé chụp giúp MiMi lúc bạn chim rẽ sóng bơi lội nhé!"* | Cánh cụt không bay trời mà bơi lội siêu nhanh |
| **Lạc đà** 🐪 | `SCRATCH` | Cào lớp cát sa mạc để tìm dấu chân và khám phá chiếc bướu chứa năng lượng | **Tom**: *"Bé cào nhẹ lớp cát xem dấu chân to của ai đây nào?"* | Bướu chứa mỡ dự trữ giúp vượt sa mạc |
| **Cú mèo** 🦉 | `MAGNIFIER` (Đèn pin) | Rọi đèn pin trong đêm tối, chạm xoay đầu cú mèo gần 270 độ | **MiMi**: *"Trời tối quá, bé bật đèn pin soi xem ai đang thức nhé!"* | Mắt thu sáng ban đêm và cổ xoay linh hoạt |

#### B. Nhóm Thực Vật (Plants)
| Loài cây | Loại tương tác (`type`) | Cụ thể hành động của Bé | Lời dẫn của Tom & MiMi | Ý nghĩa giáo dục |
| :--- | :--- | :--- | :--- | :--- |
| **Cây Nắp Ấm** 🪴 | `FEEDING` | Kéo chú muỗi lại gần miệng nắp ấm ➔ Nắp ấm khép nắp cái tách và tiêu hóa | **MiMi**: *"Bạn nắp ấm đang đói, bé thả chú muỗi vào chiếc bình nhé!"* | Bẫy côn trùng để bổ sung chất đạm |
| **Hoa Hướng Dương** 🌻 | `LIFE_CYCLE` | Kéo thanh trượt từ hạt mầm ➔ cây con ➔ bông hoa xoay hướng theo mặt trời | **Tom**: *"Bé kéo thanh trượt xem bạn hoa lớn lên và chào mặt trời nào!"* | Hiện tượng hướng nhật của hoa hướng dương |
| **Bồ Công Anh** 🌾 | `BREATH_MIC` | Thổi phù một hơi thật mạnh vào micro để làm bay các hạt giống lơ lửng | **MiMi**: *"Bé thổi thật mạnh vào máy giúp hạt giống bay đi xa nhé!"* | Phát tán hạt giống nhờ gió tự nhiên |
| **Cây Xấu Hổ (Trinh nữ)** 🌿 | `TAP_REACTIVE` | Khẽ chạm ngón tay vào lá ➔ Toàn bộ lá khép rủ xuống ngay tức thì | **MiMi**: *"Bé chạm khẽ vào lá xem bạn ấy xấu hổ e thẹn thế nào kìa!"* | Cơ chế tự vệ khép lá khi có kích thích |
| **Cây Xương Rồng** 🌵 | `SCRATCH` & `MCQ` | Gạt bỏ cát nóng, chạm xem gai nhọn thay thế lá để chống bốc hơi nước | **Tom**: *"Tại sao giữa sa mạc nắng gắt xương rồng lại không có lá to nhỉ?"* | Thích nghi hạn chế bốc hơi nước |
| **Cây Hoa Sen** 🪷 | `DRAG_DROP` | Kéo giọt nước thả lên lá sen ➔ Giọt nước vo tròn và lăn trôi đi không dính | **MiMi**: *"Bé nhỏ giọt nước lên lá sen xem điều kỳ diệu gì xảy ra!"* | Lớp sáp nano chống dính nước đặc biệt |

---

## 🎨 4. ĐẶC TẢ THIẾT KẾ ĐỒ HỌA & NÂNG CẤP HÌNH ẢNH (GRAPHICS & ART SPEC)

### 4.1. Định Hình Phong Cách: 3D Stylized Pixar Animation (Google Veo Standard)
* **Đặc trưng thị giác**:
  * Đồng bộ tuyệt đối với model sheet của Bé Tom & Bé MiMi: Nhân vật nổi khối 3D, làn da trắng hồng căng mịn, đôi mắt to phản chiếu catchlight.
  * Các loài động vật và cây cối cũng dựng theo chuẩn 3D Chibi (đầu to, thân tròn, bề mặt có vân chất liệu nhung mịn hoặc vảy da bóng nhẹ).
  * Quy chuẩn file tài nguyên hình ảnh:
    * **Kích thước**: Chuẩn hình vuông **512x512 px** (đối tượng nằm trọn ở giữa).
    * **Định dạng**: **WebP** hoặc **PNG** tách nền trong suốt 100%.
    * **Lưu trữ**: Đồng bộ tập trung trên bucket `explorer-assets` của Supabase Storage.

### 4.2. Kích Thước & Tỷ Lệ Hiển Thị Trên Màn Hình
```
┌─────────────────────────────────────────────────────────────┐
│ 🌄 TRẠNG THÁI 1: KHÁM PHÁ CẢNH QUAN (Toàn cảnh Parallax)    │
│                                                             │
│         ☁️                    ☀️                            │
│                 🦒 Hươu (30%)                               │
│                                   🪴 Nắp ấm (15%)           │
│   🐘 Voi (25%)                                              │
│ ─────────────────────────────────────────────────────────── │
│ 👦 Bé Tom (20%)   👧 Bé MiMi (18%)  [ 🎒 Sổ Bách Khoa ]     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 🎮 TRẠNG THÁI 2: THỬ THÁCH TƯƠNG TÁC (Interactive Stage)     │
│                                                             │
│       ┌───────────────┐     💬 MiMi: "Bé kéo chú muỗi thả   │
│       │  🪴 NẮP ẤM    │              vào bình cho cây nhé!" │
│       │ (Phóng to 55%)│                                     │
│       │     [ 🎯 ]    │     [ 🪰 Ruồi ]   [ 🪨 Đá ]         │
│       └───────────────┘     (Bé kéo thả vật phẩm vào miệng) │
│                                                             │
│ 👧 Bé MiMi (35%) cổ vũ       👦 Bé Tom (38%) chỉ dẫn        │
└─────────────────────────────────────────────────────────────┘
```

| Thành phần | Trạng thái 1: Khám phá Cảnh | Trạng thái 2: Thử thách Tương tác | Ghi chú Trải nghiệm (UX) |
| :--- | :--- | :--- | :--- |
| **Bé Tom & Bé MiMi** | Chiếm 18% – 22% chiều cao | Chiếm 35% – 40% màn hình | Đứng hai góc dưới, dẫn dắt, biểu cảm ngạc nhiên / vỗ tay |
| **Sinh vật tương tác** (Voi, Hươu, Nắp ấm) | Chiếm 15% – 35% chiều cao cảnh | Phóng to 50% – 60% trung tâm | Nơi diễn ra tương tác chính (nhận thức ăn, khớp bóng, cào lá) |
| **Khu vực tương tác** (Thẻ/Vật phẩm/Thanh trượt) | Chạm trực tiếp trên cảnh | Nằm ở nửa dưới màn hình | Kích thước tối thiểu mỗi icon **80x80 dp**, dễ ngón tay bé thao tác |
| **Vùng chạm (Hitbox)** | Tối thiểu **64x64 dp** | Vùng thả (Snap Target) **120x120 dp** | Hiệu ứng hào quang nhấp nháy (Glow Ring) + Rung nhẹ khi khớp đích |

### 4.3. Năm Chiến Lược Nâng Cấp Đồ Họa Đẳng Cấp Cao
1. **Parallax Cuộn Đa Lớp (4-Layer Depth)**: Lớp mây trời xa (0.2x) $\rightarrow$ Núi mờ (0.5x) $\rightarrow$ Sân chơi chính (1.0x) $\rightarrow$ Tiền cảnh lá mờ bokeh (1.4x).
2. **Hiệu Ứng Khí Quyển & Hạt Li Ti (`@shopify/react-native-skia`)**: Vệt nắng vàng xiên qua kẽ lá (God rays), bụi phấn hoa lơ lửng, đom đóm ban đêm.
3. **Hoạt Ảnh Chuyên Nghiệp (Rive / Lottie)**: Bé Tom vẫy nón, Bé MiMi ôm gấu bông nhún nhảy, voi cử động vòi, tắc kè đổi màu.
4. **Phản Hồi Xúc Giác & Nhún Nảy (Juice & Micro-interactions)**: Nhún nảy Squash & Stretch, rung phản hồi xúc giác nhẹ (`react-native-haptic-feedback`), pháo hoa sao vàng bung tỏa.

---

## 🗄️ 5. THIẾT KẾ CƠ SỞ DỮ LIỆU SUPABASE (DATABASE ARCHITECTURE)

*(Xem mã nguồn SQL chi tiết tại file [04_nature_explorer_schema.sql](file:///c:/react-native-launcher-kit/docs/sql/04_nature_explorer_schema.sql))*

Hệ thống lưu trữ cấu trúc động hoàn toàn trên **Supabase PostgreSQL & Storage**, mở rộng bảng `explorer_quizzes` (hoạt động như bộ máy thử thách tương tác `explorer_challenges`) với hai trường cốt lõi:
- `interaction_type`: Chuẩn hóa loại hình (`MCQ`, `MAGNIFIER`, `FEEDING`, `SCRATCH`, `LIFE_CYCLE`, `BREATH_MIC`, `SNAPSHOT`, `SILHOUETTE`).
- `interaction_config JSONB`: Lưu trữ tham số chi tiết cho từng loại mini-game (tọa độ ẩn giấu, danh sách vật phẩm kéo thả, ngưỡng âm thanh micro, các bước vòng đời...).

```sql
-- Cấu trúc mở rộng hỗ trợ tương tác đa dạng
ALTER TABLE explorer_quizzes 
ADD COLUMN IF NOT EXISTS interaction_type VARCHAR(50) DEFAULT 'MCQ',
ADD COLUMN IF NOT EXISTS interaction_config JSONB DEFAULT '{}'::jsonb;
```

---

## 💻 6. KIẾN TRÚC CLIENT TRÊN REACT NATIVE

### 6.1. Bộ Công Nghệ Chi Tiết (Tech Stack)
| Thành phần | Công nghệ / Thư viện | Mục đích sử dụng |
| :--- | :--- | :--- |
| **Core Framework** | React Native + TypeScript | Xây dựng ứng dụng mượt mà, định kiểu an toàn |
| **Graphics & Shader** | `@shopify/react-native-skia` | Render tia sáng, mặt nạ Kính lúp (Clipping Mask), cào thẻ (Clear BlendMode) |
| **Vector Animation** | `@rive-app/react-native` hoặc `lottie-react-native` | Hoạt ảnh chớp mắt, nụ cười của Tom & MiMi mượt mà, dung lượng siêu nhẹ |
| **UI & Gestures** | `react-native-reanimated` + `react-native-gesture-handler` | Xử lý Parallax, kéo thả cho thú ăn (Pan/Snap), thanh trượt vòng đời (Slider) |
| **Audio & Voice** | `react-native-sound` + `react-native-audio-record` | Phát âm thanh thiên nhiên, lời dẫn Tom & MiMi và nhận diện hơi thở bé thổi micro |
| **Xúc giác (Haptic)**| `react-native-haptic-feedback` | Rung nhẹ khi chạm trúng con vật / kéo thả khớp thức ăn / hoàn thành màn |
| **Lưu trữ Cục bộ** | `@react-native-async-storage/async-storage` | Lưu trữ dữ liệu Offline-first giúp bé chơi khi không có mạng |
| **Backend & Sync** | `@supabase/supabase-js` | Kết nối cơ sở dữ liệu PostgreSQL và Storage đám mây |

### 6.2. Cấu Trúc File & Thư Mục
```
example/src/
├── screens/
│   ├── NatureWorldMapScreen.tsx         # Bản đồ chọn Thế Giới / Màn lớn
│   ├── NatureSceneViewScreen.tsx        # Màn hình cảnh chơi tương tác chính (Parallax 4 lớp)
│   └── NatureFieldGuideScreen.tsx       # Sổ tay Bách khoa Toàn thư của bé
├── components/explorer/
│   ├── ParallaxSceneContainer.tsx       # Khung cuộn 4 lớp có hiệu ứng chiều sâu
│   ├── Animated3DSprite.tsx             # Component sinh vật 3D có nhịp thở và hào quang
│   ├── DuoDialogueBar.tsx               # Thanh hội thoại Bé Tom & Bé MiMi dẫn dắt
│   ├── AtmosphericParticles.tsx         # Hạt bụi vàng, tia nắng Skia
│   ├── InteractiveChallengeHost.tsx     # Bộ điều phối các loại hình tương tác con (Host)
│   └── interactions/                    # Các module mini-game tương tác độc lập:
│       ├── MagnifierRevealView.tsx      # 1. Kính lúp soi chi tiết & Đèn pin đêm
│       ├── DragDropFeedingView.tsx      # 2. Kéo thả cho thú ăn & chọn thức ăn
│       ├── ScratchToRevealView.tsx      # 3. Cào lá, quét bùn, bới cát
│       ├── LifeCycleSliderView.tsx      # 4. Thanh trượt tua vòng đời sinh trưởng
│       ├── MicrophoneBlowerView.tsx     # 5. Thổi gió micro làm bay hạt giống
│       ├── SafariSnapshotView.tsx       # 6. Bấm máy ảnh bắt trọn khoảnh khắc
│       ├── SilhouetteMatchView.tsx      # 7. Nối bóng & ghép bộ phận khuyết
│       └── AudioVisualQuizView.tsx      # 8. Trắc nghiệm hình ảnh & giọng thuyết minh
└── services/
    ├── NatureExplorerSupabase.ts        # Kết nối API Supabase & Caching Offline
    └── NatureAudioPlayer.ts             # Quản lý phát âm thanh môi trường & giọng đọc
```

---

## 🖥️ 7. TÍCH HỢP QUẢN TRỊ NỘI DUNG TRÊN WEB-PORTAL

Tận dụng thư mục [`web-portal`](file:///c:/react-native-launcher-kit/web-portal) (Next.js) hiện có trong dự án:
* **Visual Canvas Editor**: Tải ảnh nền phong cảnh lên, kéo thả con vật 3D vào tọa độ mong muốn (`pos_x`, `pos_y`).
* **Interaction Configurator**: Chọn loại tương tác (`interaction_type`) cho từng sinh vật (Kính lúp, Kéo thả, Cào lá, Trắc nghiệm...) và thiết lập thông số trực quan không cần gõ code.
* **Lồng tiếng hội thoại**: Upload file âm thanh câu hỏi giọng Bé Tom và giọng Bé MiMi lên Supabase.
* Thiết bị bé chơi tự động cập nhật nội dung mới nhất mà không cần cài đặt lại file APK.

---

## 🎯 8. KẾ HOẠCH TRIỂN KHAI THEO GIAI ĐOẠN

| Giai đoạn | Nội dung thực hiện | Kết quả bàn giao |
| :--- | :--- | :--- |
| **Giai đoạn 1** | Cập nhật bảng Database trên Supabase (`interaction_type`, `interaction_config`) & Nạp Seed Data | Script SQL hoàn chỉnh chạy thành công trên Supabase |
| **Giai đoạn 2** | Xây dựng Service `NatureExplorerSupabase.ts` & Bộ phân loại Challenge Parser | Lớp nạp cấu hình thử thách và Cache Offline |
| **Giai đoạn 3** | Xây dựng Khung Cảnh chơi Parallax & Host điều phối `InteractiveChallengeHost.tsx` | Màn hình `NatureSceneViewScreen.tsx` & khung tương tác linh hoạt |
| **Giai đoạn 4** | Triển khai các màn tương tác cốt lõi (`FEEDING`, `MAGNIFIER`, `SCRATCH`, `LIFE_CYCLE`, `MCQ`) | Các mini-game hoạt động mượt mà với cử chỉ Reanimated & Skia |
| **Giai đoạn 5** | Ghép hình ảnh 3D Bé Tom & Bé MiMi & Hệ thống âm thanh, biểu cảm phản hồi | Trải nghiệm đa giác quan với giọng thoại tương tác sinh động |
| **Giai đoạn 6** | Xây dựng Sổ tay Bách khoa Toàn thư & Tích hợp vào Kids Launcher | Menu vào game hoàn chỉnh từ `KidsLauncherScreen.tsx` |

---
*Tài liệu này là đặc tả kiến trúc chuẩn để bắt đầu triển khai code cho các màn hình và backend của trò chơi.*
