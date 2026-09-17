# Game Design Spec: 100 Câu Đố Kỳ Thú Cho Bé (100 Riddles Adventure)

**Ngày tạo**: 17/09/2026  
**Trạng thái**: Đã phê duyệt qua quy trình `superpowers:brainstorming`  
**Đối tượng**: Trẻ em 3 – 9 tuổi (Đa cấp độ)

---

## 1. Tổng Quan & Mục Tiêu Trò Chơi

"**100 Câu Đố Kỳ Thú**" là trò chơi giáo dục tương tác giúp phát triển tư duy ngôn ngữ, khả năng liên tưởng, óc quan sát và vốn từ vựng tiếng Việt cho trẻ em.

### Điểm nổi bật:
* **Ngân hàng 100 câu đố dân gian & hiện đại**: Được gieo vần bằng thể thơ lục bát hoặc 4 chữ vui nhộn, giàu hình ảnh và tính giáo dục cao.
* **Bản đồ Phiêu Lưu 5 Vùng Đất**: Chia thành 5 thế giới sinh động, mỗi thế giới 20 câu đố và 1 rương kho báu hoàng kim.
* **Đa chế độ linh hoạt (Dual Mode)**:
  * 🌸 **Chế độ Mầm Non (3 – 5 tuổi)**: Nghe ngâm thơ câu đố & chọn 1 trong 4 bục sân khấu 3D nổi (`VocabCard3DStage`).
  * 🔍 **Chế độ Thám Tử (6 – 9 tuổi)**: Nghe câu đố & xếp các quân kẹo chữ cái để hoàn thiện từ khóa bí ẩn.
* **Tương tác trực quan & Âm thanh**: Bé Tom và Bé MiMi dẫn dắt, đọc thơ diễn cảm, chúc mừng rực rỡ kèm kiến thức mở rộng (*fun fact*).
* **Offline-first 100%**: Lưu trữ tiến độ qua MMKV, hoạt động mượt mà không cần kết nối mạng.

---

## 2. Bản Đồ 5 Vùng Đất & Phân Bổ 100 Câu Đố

| STT | Vùng Đất | Mã (WorldId) | Chủ đề câu đố (20 câu mỗi vùng) | Phần thưởng hoàn thành |
| :---: | :--- | :--- | :--- | :--- |
| 1 | 🦁 **Vương Quốc Muông Thú** | `animals` | Con vật nuôi trong nhà, gia cầm, muông thú rừng sâu, sinh vật biển | 🏆 Cúp Sư Tử Vàng & Rương Muông Thú |
| 2 | 🍎 **Khu Vườn Hoa Trái** | `fruits` | Các loại quả ngọt, rau củ quen thuộc, các loài hoa rực rỡ | 🏆 Cúp Táo Thần & Rương Nông Trại |
| 3 | 🏠 **Ngôi Nhà Thông Thái** | `household` | Đồ đạc gia đình (đồng hồ, quạt...), dụng cụ học tập (bút, sách, thước) | 🏆 Cúp Trí Tuệ & Rương Ngôi Nhà |
| 4 | 🚗 **Thành Phố Phương Tiện** | `vehicles` | Xe cộ đường bộ, xe cứu hộ, tàu hỏa, tàu thủy, máy bay, tàu vũ trụ | 🏆 Cúp Bánh Xe Vàng & Rương Động Cơ |
| 5 | ⛅ **Vũ Trụ & Thiên Nhiên** | `nature` | Mặt trời, trăng sao, mây, mưa, gió, sấm chớp, cầu vồng 7 màu | 🏆 Vương Miện Cầu Vồng & Rương Vũ Trụ |

---

## 3. Kiến Trúc Dữ Liệu (`riddles100Data.ts`)

```typescript
export type WorldId = 'animals' | 'fruits' | 'household' | 'vehicles' | 'nature';

export interface RiddleOption3D {
  id: string;
  label: string;
  image3D: string;
  isCorrect: boolean;
}

export interface RiddleItem {
  id: string;                      // vd: 'riddle_a_01'
  worldId: WorldId;
  indexInWorld: number;            // 1 -> 20
  title: string;                   // "Câu đố số 1: Bạn là ai?"
  poem: string[];                  // Mảng câu thơ, vd: ["Con gì mào đỏ gáy vang", "Báo trời sáng rực rộn ràng làng thôn?"]
  answer: string;                  // "GÀ TRỐNG"
  answerClean: string;             // "GA TRONG"
  scrambleLetters: string[];       // ["G", "À", "T", "R", "Ố", "N", "G", "M", "E", "O"]
  image3D: string;                 // Mã ảnh 3D mô hình chuẩn (Fluent/Pixar)
  options3D: RiddleOption3D[];     // 4 lựa chọn cho chế độ Mầm non
  hintPoem: string;                // Thơ manh mối khi bấm Bóng đèn
  funFact: string;                 // Kiến thức sau khi giải đúng
}
```

---

## 4. Cơ Chế Gameplay Chi Tiết

### 4.1. Vòng lặp trò chơi (Gameplay Loop)
1. **Chọn trạm trên Bản đồ**: Màn hình bản đồ cuộn hiển thị 20 trạm nối tiếp nhau với hiệu ứng đảo nổi.
2. **Hiển thị Câu Đố**:
   * Cuộn giấy da cổ tích trải ra hiển thị câu thơ đố.
   * Nút Loa tự động phát âm thanh ngâm thơ hoặc bấm để nghe lại bất cứ lúc nào.
3. **Thực hiện giải đố theo chế độ**:
   * **Mầm non**: 4 bục 3D (`VocabCard3DStage`) với bóng đổ, hiệu ứng rung nảy vật lý. Chạm bục để chọn.
   * **Thám tử**: Hàng ô chữ trống và khay kẹo chữ cái nhiều màu. Chạm chữ để điền, chạm ô để hoàn tác.
4. **Trợ giúp (Hints)**:
   * Chế độ Mầm non: Nút *Bóng Đèn Thần* làm mờ và vô hiệu hóa 2 phương án sai.
   * Chế độ Thám tử: Nút *Kính Lúp Manh Mối* tự động điền 1 chữ cái khó vào ô trống.
5. **Ăn mừng & Phần thưởng**:
   * Hiệu ứng pháo hoa giấy confetti.
   * Mô hình 3D phóng to xoay 360 độ.
   * Bé Tom / Bé MiMi đọc câu giải thích kiến thức đời sống bổ ích.
   * Cộng 1 – 3 sao vàng tùy theo số lần thử và việc sử dụng gợi ý.

---

## 5. Cấu Trúc Mã Nguồn & Tích Hợp Hệ Thống

```
example/src/
├── data/
│   └── riddles100Data.ts                 # 100 câu đố thơ vần chi tiết chia 5 vùng
├── services/
│   └── riddleService.ts                  # Lưu trữ MMKV: Tiến độ, sao, rương đã mở
├── components/riddles/
│   ├── RiddleWorldMapModal.tsx           # Bản đồ 5 vùng đất phiêu lưu & chọn trạm
│   ├── Riddle3DStageGrid.tsx             # Lưới 4 bục 3D (Chế độ Mầm Non)
│   ├── RiddleLetterScramble.tsx          # Khay chữ cái tương tác (Chế độ Thám Tử)
│   └── RiddleTreasureModal.tsx           # Rương kho báu hoàng kim khi hoàn thành vùng đất
└── screens/
    └── RiddlesGameScreen.tsx             # Màn hình chính game 100 Câu Đố
```

* **Đăng ký vào Launcher**: Khai báo package `internal.game.riddles100` với tên "100 Câu Đố Kỳ Thú" trong `KidsLauncherScreen.tsx`.

---

## 6. Kế Hoạch Kiểm Thử & Nghiệm Thu (Verification Criteria)

1. **TypeScript Type Safety**: Chạy `npx tsc --noEmit` đạt 0 lỗi.
2. **Dữ liệu đầy đủ 100%**: Đủ 100 câu đố với thơ vần chuẩn, không bị trùng lặp, đầy đủ 4 options 3D và khay chữ cái.
3. **Hiệu năng 60 FPS**: Hoạt động mượt mà trên Android Emulator/thiết bị thật, không rò rỉ bộ nhớ khi chuyển màn.
4. **Lưu trữ chuẩn xác**: Sau khi tắt app mở lại, số sao và các trạm đã vượt qua vẫn được bảo toàn nguyên vẹn.
