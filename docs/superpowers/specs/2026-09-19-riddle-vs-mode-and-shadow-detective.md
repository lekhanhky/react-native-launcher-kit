# Tài Liệu Thiết Kế: Mở Rộng Game Câu Đố & Ý Tưởng Game Mới

**Ngày tạo**: 19/09/2026  
**Dự án**: React Native Kids Launcher - Kids Wonder Park Edition  
**Mục tiêu**:
1. **Phương án A1 (Mở rộng game hiện tại)**: Chế độ Đấu Trí 2 Người (2-Player VS Battle Mode) trong Game 100 Câu Đố Kỳ Thú.
2. **Phương án B1 (Tựa game mới độc lập)**: Game Thám Tử Soi Đèn Pin "Ai Trong Bóng Đêm?" (Shadow Riddle & Spotlight Detective).

---

# PHẦN 1: PHƯƠNG ÁN A1 - CHẾ ĐỘ ĐẤU TRÍ 2 NGƯỜI (2-PLAYER VS MODE)

## 1.1. Mục Tiêu & Giá Trị
* **Đối tượng trải nghiệm**: Bé và Ba/Mẹ, hoặc Bé và Anh/Chị/Bạn bè (2 người cùng chơi trên 1 thiết bị điện thoại hoặc máy tính bảng).
* **Giá trị giáo dục & cảm xúc**:
  * Biến thiết bị thông minh thành bàn cờ tương tác gia đình (Family Boardgame).
  * Khuyến khích ba mẹ dành thời gian chơi cùng con, thi đua lành mạnh và khen ngợi bé.
  * Tăng cường phản xạ nghe - hiểu ngôn ngữ và xử lý hình ảnh nhanh dưới áp lực thời gian vui vẻ.

## 1.2. Thiết Kế Màn Hình & Cơ Chế Điều Khiển (Split-Screen)
* **Giao diện chia đôi đối xứng (Split-Screen UI)**:
  * **Nửa trên (Người chơi 2 - 👧 hoặc 👨 Ba/Mẹ)**: Có tùy chọn xoay ngược 180° (`rotate: '180deg'`) khi 2 người ngồi đối diện nhau qua bàn, hoặc để xuôi nếu ngồi cạnh nhau.
  * **Thanh trung tâm (Center Referee Bar)**:
    * Tỉ số trận đấu (vd: Player 1 `[ 3 ]` - `[ 2 ]` Player 2, chạm mốc 5 điểm trước sẽ thắng cuộc).
    * Nút phát loa câu đố thơ vần (`🔊 Nghe Thơ`).
    * Dòng thơ câu đố hiện tại hiển thị ở thanh trung tâm để cả 2 cùng đọc.
  * **Nửa dưới (Người chơi 1 - 👦 Bé)**: Bố cục nút bấm thuận tay người chơi phía dưới.
* **Quy tắc thi đấu (Game Rules)**:
  1. Mỗi lượt, một câu đố ngẫu nhiên từ ngân hàng 100 câu đố được đưa ra kèm 4 phương án lựa chọn.
  2. Hệ thống đọc thơ qua giọng đọc AI tiếng Việt hoặc hiển thị văn bản.
  3. Hai người chơi quan sát 4 thẻ đáp án trên nửa màn hình của mình:
     * **Chọn đúng**: Người chọn đúng trước được **+1 điểm**, bừng sáng hiệu ứng chiến thắng của hiệp đấu, phát âm thanh chúc mừng và SFX con vật/phương tiện.
     * **Chọn sai**: Người chọn sai bị **khóa nút trong hiệp đó (Lockout)**, tạo cơ hội cho người còn lại bình tĩnh suy nghĩ và trả lời để giành điểm.
  4. **Chạm mốc 5 điểm**: Trận đấu kết thúc, màn hình vinh danh nhà vô địch với cúp hoàng kim và tràng pháo hoa rực rỡ.

## 1.3. Tích Hợp Kỹ Thuật
* Component: `example/src/components/riddles/RiddleVersusBattleModal.tsx`
* Tích hợp vào `RiddlesGameScreen.tsx`: Nút chuyển đổi nhanh `⚔️ Đấu Trí 2 Người` tại thanh chế độ.
* Tái sử dụng:
  * Ngân hàng 100 câu thơ đố `riddles100Data.ts`.
  * Bộ máy âm thanh `riddleSoundService.ts` (TTS, Pop, Correct Bell, Cartoon Boing, Fanfare).
  * Mô hình ảnh 3D thẻ bài.

---

# PHẦN 2: PHƯƠNG ÁN B1 - GAME THÁM TỬ SOI ĐÈN PIN: "AI TRONG BÓNG ĐÊM?"

## 2.1. Ý Tưởng Chủ Đạo (Concept)
"Ai Trong Bóng Đêm?" (Shadow Riddle & Spotlight Detective) là một tựa game trí tuệ khám phá thị giác độc lập kế thừa thư viện mô hình 3D thực tế của launcher. 
Trẻ nhỏ có bản năng tò mò cực kỳ lớn với những hình ảnh bí mật ẩn giấu sau bóng tối (tương tự như màn đoán bóng "Who's that Pokémon?" kinh điển).

## 2.2. Lối Chơi (Core Gameplay Mechanics)
1. **Màn đêm bí ẩn & Bóng đen 3D (Silhouette)**:
   * Trung tâm màn hình là một căn phòng bóng đêm bí ẩn.
   * Vật thể bí mật (con vật, hoa quả, phương tiện...) chỉ hiển thị dưới dạng một **bóng đen tuyền** đang xoay nhẹ 3D.
2. **Chiếc Đèn Pin Ma Thuật (Interactive Spotlight)**:
   * Bé dùng ngón tay chạm và rê chiếc "Đèn pin ma thuật" trên màn hình.
   * Vùng đèn pin chiếu tới sẽ hé lộ chi tiết thật bằng màu sắc và ánh sáng (ví dụ: soi thấy chiếc đuôi xù của con sóc, cái mỏ nhọn của chú vịt, hay chiếc còi hụ của xe cứu hỏa).
3. **Câu Thơ Manh Mối (Clue Rhymes)**:
   * Giọng đọc thám tử đọc 2 câu thơ gợi mở manh mối:
     *"Chân ngắn mỏ bẹt, bì bõm ao sâu - Đố bé biết được là ai trốn nào?"*
4. **Mở Đèn Bừng Sáng (Reveal & Victory)**:
   * Bé chọn 1 trong 3 đáp án nghi vấn.
   * Khi trả lời đúng: Đèn bật sáng toàn phòng (`Flashlight ON`), bóng đen biến thành mô hình 3D rực rỡ đầy đủ hiệu ứng nhún nhảy, phát âm thanh kêu thật của loài vật đó, mở khóa thẻ bài sưu tập Pokedex.

## 2.3. Cấu Trúc Các Vùng Đất Khám Phá
1. 🌲 **Rừng Đêm Huyền Bí (Night Forest)**: Đoán bóng muông thú trong rừng.
2. 🌊 **Đáy Biển Sâu Kỳ Lạ (Deep Ocean)**: Đèn pin lặn biển soi bóng cá voi, bạch tuộc, san hô.
3. 🏙️ **Thành Phố Ban Đêm (City Lights)**: Soi bóng xe cứu hỏa, trực thăng cứu hộ, tàu hỏa vượt đêm.
4. 🪐 **Thiên Hà Tối (Cosmic Dark)**: Kính thiên văn soi bóng các hành tinh và phi thuyền không gian.

## 2.4. Kế Hoạch Đóng Gói
* Đăng ký mã định danh mới: `internal.game.shadowdetective`.
* Biểu tượng đại diện: 🔦 (Chiếc đèn pin thám tử).
* Phân loại trong Launcher: Danh mục **Khám phá (🎴)** và **Trí tuệ (🎮)**.
