// Bộ từ điển 3000 từ vựng Oxford cơ bản chọn lọc cho trẻ em (30 Chủ Đề Toàn Diện / 500+ Thẻ Từ Vựng)
export interface VocabCard {
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
}

export interface VocabCategory {
  id: string;
  titleEn: string;
  titleVi: string;
  icon: string;
  color: string;
  cards: VocabCard[];
}

export const OXFORD_KIDS_VOCABULARY: VocabCategory[] = [
  // =========================================================================
  // 1. THẾ GIỚI ĐỘNG VẬT (22 TỪ)
  // =========================================================================
  {
    id: 'animals',
    titleEn: 'Animals & Pets',
    titleVi: 'Thế Giới Động Vật',
    icon: '🦁',
    color: '#FF6B08',
    cards: [
      { id: 'dog', english: 'Dog', ipa: '/dɔːɡ/', vietnamese: 'Con Chó', category: 'animals', emoji: '🐶', color: '#F97316', exampleEn: 'The dog is wagging its tail.', exampleVi: 'Chú chó đang vẫy chiếc đuôi.', funFact: 'Chó là người bạn trung thành và thông minh nhất của con người!' },
      { id: 'cat', english: 'Cat', ipa: '/kæt/', vietnamese: 'Con Mèo', category: 'animals', emoji: '🐱', color: '#EC4899', exampleEn: 'The cat loves drinking milk.', exampleVi: 'Mèo con rất thích uống sữa tươi.', funFact: 'Mèo có thể nghe được những âm thanh siêu nhỏ mà tai người không nghe thấy!' },
      { id: 'lion', english: 'Lion', ipa: '/ˈlaɪ.ən/', vietnamese: 'Sư Tử', category: 'animals', emoji: '🦁', color: '#EAB308', exampleEn: 'The lion is the king of the jungle.', exampleVi: 'Sư tử là chúa tể của rừng xanh.', funFact: 'Tiếng gầm của một chú sư tử đực có thể vang xa tới 8 kilômét!' },
      { id: 'elephant', english: 'Elephant', ipa: '/ˈel.ə.fənt/', vietnamese: 'Con Voi', category: 'animals', emoji: '🐘', color: '#64748B', exampleEn: 'An elephant has a very long trunk.', exampleVi: 'Con voi có một chiếc vòi rất dài.', funFact: 'Voi là loài động vật có vú trên cạn lớn nhất thế giới!' },
      { id: 'monkey', english: 'Monkey', ipa: '/ˈmʌŋ.ki/', vietnamese: 'Con Khỉ', category: 'animals', emoji: '🐒', color: '#D97706', exampleEn: 'The monkey loves eating bananas.', exampleVi: 'Chú khỉ rất thích ăn những quả chuối chín.', funFact: 'Khỉ dùng chiếc đuôi dài khéo léo như một cánh tay thứ năm để đu cành!' },
      { id: 'tiger', english: 'Tiger', ipa: '/ˈtaɪ.ɡɚ/', vietnamese: 'Con Hổ', category: 'animals', emoji: '🐯', color: '#EA580C', exampleEn: 'The tiger runs very fast.', exampleVi: 'Con hổ chạy rất nhanh.', funFact: 'Mỗi chú hổ đều có hoa văn sọc vằn độc nhất vô nhị trên thế giới!' },
      { id: 'giraffe', english: 'Giraffe', ipa: '/dʒɪˈræf/', vietnamese: 'Hươu Cao Cổ', category: 'animals', emoji: '🦒', color: '#CA8A04', exampleEn: 'The giraffe can reach tall trees.', exampleVi: 'Hươu cao cổ có thể với tới những ngọn cây rất cao.', funFact: 'Hươu cao cổ là loài động vật cao nhất trên đất liền!' },
      { id: 'zebra', english: 'Zebra', ipa: '/ˈziː.brə/', vietnamese: 'Ngựa Vằn', category: 'animals', emoji: '🦓', color: '#334155', exampleEn: 'The zebra has black and white stripes.', exampleVi: 'Ngựa vằn có những sọc đen và trắng nổi bật.', funFact: 'Những đường sọc giúp ngựa vằn đánh lừa thị giác kẻ săn mồi.' },
      { id: 'kangaroo', english: 'Kangaroo', ipa: '/ˌkæŋ.ɡəˈruː/', vietnamese: 'Chuột Túi', category: 'animals', emoji: '🦘', color: '#B45309', exampleEn: 'The kangaroo carries its baby in a pouch.', exampleVi: 'Chuột túi mang con nhỏ trong chiếc túi trước bụng.', funFact: 'Chuột túi có thể nhảy xa tới 9 mét chỉ trong 1 bước nhảy!' },
      { id: 'bear', english: 'Bear', ipa: '/ber/', vietnamese: 'Con Gấu', category: 'animals', emoji: '🐻', color: '#78350F', exampleEn: 'The bear loves sweet honey.', exampleVi: 'Gấu rất thích ăn mật ong ngọt ngào.', funFact: 'Gấu có khứu giác cực nhạy, ngửi thấy thức ăn cách xa 30km!' },
      { id: 'hippo', english: 'Hippo', ipa: '/ˈhɪp.oʊ/', vietnamese: 'Hà Mã', category: 'animals', emoji: '🦛', color: '#6B7280', exampleEn: 'The hippo swims in the big river.', exampleVi: 'Hà mã bơi lội dưới dòng sông lớn.', funFact: 'Hà mã có thể mở miệng rộng đến 150 độ!' },
      { id: 'wolf', english: 'Wolf', ipa: '/wʊlf/', vietnamese: 'Chó Sói', category: 'animals', emoji: '🐺', color: '#475569', exampleEn: 'The wolf howls at the bright moon.', exampleVi: 'Chó sói hú vang dưới ánh trăng sáng.', funFact: 'Sói sống và săn mồi theo bầy đàn rất đoàn kết.' },
      { id: 'fox', english: 'Fox', ipa: '/fɑːks/', vietnamese: 'Con Cáo', category: 'animals', emoji: '🦊', color: '#EA580C', exampleEn: 'The red fox has a bushy tail.', exampleVi: 'Chú cáo đỏ có chiếc đuôi xù tuyệt đẹp.', funFact: 'Cáo rất thông minh và di chuyển vô cùng nhẹ nhàng.' },
      { id: 'deer', english: 'Deer', ipa: '/dɪr/', vietnamese: 'Con Hươu', category: 'animals', emoji: '🦌', color: '#92400E', exampleEn: 'The deer has beautiful antlers.', exampleVi: 'Chú hươu có cặp sừng phân nhánh rất đẹp.', funFact: 'Hươu có thính giác siêu nhạy để phát hiện tiếng động nhỏ.' },
      { id: 'dolphin', english: 'Dolphin', ipa: '/ˈdɑːl.fɪn/', vietnamese: 'Cá Heo', category: 'animals', emoji: '🐬', color: '#0284C7', exampleEn: 'The dolphin jumps over the ocean waves.', exampleVi: 'Cá heo nhảy nhót trên những con sóng biển.', funFact: 'Cá heo là một trong những loài vật thông minh nhất hành tinh!' },
      { id: 'whale', english: 'Whale', ipa: '/weɪl/', vietnamese: 'Cá Voi', category: 'animals', emoji: '🐋', color: '#0369A1', exampleEn: 'The blue whale is very huge.', exampleVi: 'Cá voi xanh vô cùng to lớn.', funFact: 'Cá voi xanh là sinh vật lớn nhất từng sống trên Trái Đất!' },
      { id: 'shark', english: 'Shark', ipa: '/ʃɑːrk/', vietnamese: 'Cá Mập', category: 'animals', emoji: '🦈', color: '#475569', exampleEn: 'The shark has sharp teeth.', exampleVi: 'Cá mập có những chiếc răng sắc nhọn.', funFact: 'Cá mập đã xuất hiện trên Trái Đất trước cả loài khủng long!' },
      { id: 'penguin', english: 'Penguin', ipa: '/ˈpeŋ.ɡwɪn/', vietnamese: 'Chim Cánh Cụt', category: 'animals', emoji: '🐧', color: '#0F172A', exampleEn: 'The penguin waddles on the ice.', exampleVi: 'Chim cánh cụt lạch bạch bước đi trên băng.', funFact: 'Chim cánh cụt không biết bay nhưng bơi dưới nước siêu cừ khôi!' },
      { id: 'panda', english: 'Panda', ipa: '/ˈpæn.də/', vietnamese: 'Gấu Trúc', category: 'animals', emoji: '🐼', color: '#1E293B', exampleEn: 'The panda eats green bamboo all day.', exampleVi: 'Gấu trúc ăn tre trúc xanh suốt cả ngày.', funFact: 'Gấu trúc dành tới 12 tiếng mỗi ngày chỉ để ăn lá tre!' },
      { id: 'rabbit', english: 'Rabbit', ipa: '/ˈræb.ɪt/', vietnamese: 'Con Thỏ', category: 'animals', emoji: '🐰', color: '#F472B6', exampleEn: 'The rabbit hops around happily.', exampleVi: 'Thỏ con nhảy nhót vui vẻ quanh bãi cỏ.', funFact: 'Đôi tai dài giúp thỏ nghe ngóng và giải nhiệt cơ thể.' },
      { id: 'cow', english: 'Cow', ipa: '/kaʊ/', vietnamese: 'Con Bò', category: 'animals', emoji: '🐮', color: '#64748B', exampleEn: 'The cow gives us fresh milk.', exampleVi: 'Bò sữa cho chúng ta dòng sữa tươi thơm ngon.', funFact: 'Một chú bò sữa có thể tạo ra 25 lít sữa mỗi ngày!' },
      { id: 'horse', english: 'Horse', ipa: '/hɔːrs/', vietnamese: 'Con Ngựa', category: 'animals', emoji: '🐴', color: '#78350F', exampleEn: 'The horse gallops through the field.', exampleVi: 'Chú ngựa phi nước đại qua cánh đồng rộng.', funFact: 'Ngựa có thể ngủ cả khi đang đứng thẳng trên bốn chân!' },
    ],
  },

  // =========================================================================
  // 2. TRÁI CÂY & RAU CỦ (20 TỪ)
  // =========================================================================
  {
    id: 'fruits_veggies',
    titleEn: 'Fruits & Vegetables',
    titleVi: 'Trái Cây & Rau Củ',
    icon: '🍎',
    color: '#EF4444',
    cards: [
      { id: 'apple', english: 'Apple', ipa: '/ˈæp.əl/', vietnamese: 'Quả Táo', category: 'fruits_veggies', emoji: '🍎', color: '#EF4444', exampleEn: 'An apple a day keeps the doctor away.', exampleVi: 'Ăn một quả táo mỗi ngày giúp bé luôn khỏe mạnh.', funFact: 'Có tới hơn 7.500 giống táo khác nhau trên thế giới!' },
      { id: 'banana', english: 'Banana', ipa: '/bəˈnæn.ə/', vietnamese: 'Quả Chuối', category: 'fruits_veggies', emoji: '🍌', color: '#EAB308', exampleEn: 'The banana is sweet and yellow.', exampleVi: 'Quả chuối chín có màu vàng và vị ngọt lành.', funFact: 'Chuối chứa nhiều kali giúp cơ bắp của bé khỏe mạnh và nhiều năng lượng.' },
      { id: 'orange', english: 'Orange', ipa: '/ˈɔːr.ɪndʒ/', vietnamese: 'Quả Cam', category: 'fruits_veggies', emoji: '🍊', color: '#F97316', exampleEn: 'Orange juice is full of vitamin C.', exampleVi: 'Nước cam chứa rất nhiều vitamin C.', funFact: 'Màu cam được đặt tên theo chính quả cam thơm ngon này!' },
      { id: 'mango', english: 'Mango', ipa: '/ˈmæŋ.ɡoʊ/', vietnamese: 'Quả Xoài', category: 'fruits_veggies', emoji: '🥭', color: '#F59E0B', exampleEn: 'The ripe mango is juicy and sweet.', exampleVi: 'Quả xoài chín mọng nước và ngọt lịm.', funFact: 'Xoài được mệnh danh là vua của các loại trái cây nhiệt đới.' },
      { id: 'watermelon', english: 'Watermelon', ipa: '/ˈwɑː.t̬ɚˌmel.ən/', vietnamese: 'Dưa Hấu', category: 'fruits_veggies', emoji: '🍉', color: '#10B981', exampleEn: 'Watermelon is great for hot summer days.', exampleVi: 'Dưa hấu rất tuyệt vời cho những ngày hè nóng nực.', funFact: 'Dưa hấu chứa tới 92% là nước giúp bé giải khát nhanh chóng.' },
      { id: 'strawberry', english: 'Strawberry', ipa: '/ˈstrɑːˌber.i/', vietnamese: 'Dâu Tây', category: 'fruits_veggies', emoji: '🍓', color: '#F43F5E', exampleEn: 'The strawberry is red and pretty.', exampleVi: 'Quả dâu tây đỏ tươi và xinh xắn.', funFact: 'Dâu tây là loại quả duy nhất có hạt nằm ở phía ngoài vỏ!' },
      { id: 'grape', english: 'Grape', ipa: '/ɡreɪp/', vietnamese: 'Quả Nho', category: 'fruits_veggies', emoji: '🍇', color: '#8B5CF6', exampleEn: 'A bunch of sweet purple grapes.', exampleVi: 'Một chùm nho tím ngọt ngào.', funFact: 'Nho có thể phơi khô để làm món nho khô thơm ngon.' },
      { id: 'pineapple', english: 'Pineapple', ipa: '/ˈpaɪnˌæp.əl/', vietnamese: 'Quả Dứa', category: 'fruits_veggies', emoji: '🍍', color: '#F59E0B', exampleEn: 'The pineapple wears a green crown.', exampleVi: 'Quả dứa đội một chiếc vương miện lá xanh.', funFact: 'Mỗi quả dứa cần gần 2 năm để phát triển và chín thơm.' },
      { id: 'coconut', english: 'Coconut', ipa: '/ˈkoʊ.kə.nʌt/', vietnamese: 'Quả Dừa', category: 'fruits_veggies', emoji: '🥥', color: '#78350F', exampleEn: 'Coconut water is fresh and cool.', exampleVi: 'Nước dừa tươi mát lành.', funFact: 'Cây dừa có thể sống và phát triển ngay bên bờ biển mặn.' },
      { id: 'peach', english: 'Peach', ipa: '/piːtʃ/', vietnamese: 'Quả Đào', category: 'fruits_veggies', emoji: '🍑', color: '#FB7185', exampleEn: 'The peach has soft fuzzy skin.', exampleVi: 'Quả đào có lớp vỏ lông nhung mềm mại.', funFact: 'Đào tượng trưng cho sự may mắn và trường thọ.' },
      { id: 'lemon', english: 'Lemon', ipa: '/ˈlem.ən/', vietnamese: 'Quả Chanh', category: 'fruits_veggies', emoji: '🍋', color: '#FACC15', exampleEn: 'Lemon has a fresh sour taste.', exampleVi: 'Chanh có vị chua tươi mát.', funFact: 'Nước chanh giúp diệt khuẩn và tăng cường sức đề kháng cho bé.' },
      { id: 'carrot', english: 'Carrot', ipa: '/ˈkær.ət/', vietnamese: 'Củ Cà Rốt', category: 'fruits_veggies', emoji: '🥕', color: '#EA580C', exampleEn: 'Rabbits love crunchy carrots.', exampleVi: 'Các bạn thỏ rất thích những củ cà rốt giòn ngọt.', funFact: 'Cà rốt chứa nhiều vitamin A giúp đôi mắt bé luôn sáng ngời.' },
      { id: 'tomato', english: 'Tomato', ipa: '/təˈmeɪ.toʊ/', vietnamese: 'Quả Cà Chua', category: 'fruits_veggies', emoji: '🍅', color: '#DC2626', exampleEn: 'The red tomato is rich in vitamins.', exampleVi: 'Quả cà chua đỏ giàu vitamin bổ dưỡng.', funFact: 'Về mặt sinh học, cà chua thực ra là một loại trái cây!' },
      { id: 'potato', english: 'Potato', ipa: '/pəˈteɪ.toʊ/', vietnamese: 'Củ Khoai Tây', category: 'fruits_veggies', emoji: '🥔', color: '#B45309', exampleEn: 'We can make crispy french fries from potatoes.', exampleVi: 'Chúng ta có thể làm khoai tây chiên giòn rụm.', funFact: 'Khoai tây là loại rau củ đầu tiên được trồng thử nghiệm ngoài vũ trụ!' },
      { id: 'broccoli', english: 'Broccoli', ipa: '/ˈbrɑː.kəl.i/', vietnamese: 'Súp Lơ Xanh', category: 'fruits_veggies', emoji: '🥦', color: '#15803D', exampleEn: 'Broccoli looks like little green trees.', exampleVi: 'Súp lơ xanh trông như những cái cây nhỏ xinh.', funFact: 'Súp lơ xanh chứa nhiều canxi giúp xương bé chắc khỏe.' },
      { id: 'cucumber', english: 'Cucumber', ipa: '/ˈkjuː.kʌm.bɚ/', vietnamese: 'Dưa Leo', category: 'fruits_veggies', emoji: '🥒', color: '#16A34A', exampleEn: 'The cucumber is cool and crunchy.', exampleVi: 'Dưa leo giòn rụm và mát lành.', funFact: 'Dưa leo có 95% thành phần là nước tinh khiết.' },
      { id: 'corn', english: 'Corn', ipa: '/kɔːrn/', vietnamese: 'Bắp Ngô', category: 'fruits_veggies', emoji: '🌽', color: '#CA8A04', exampleEn: 'Sweet corn is boiled for snack.', exampleVi: 'Ngô ngọt được luộc chín làm món ăn vặt.', funFact: 'Bắp ngô luôn có số hàng hạt là một số chẵn!' },
      { id: 'onion', english: 'Onion', ipa: '/ˈʌn.jən/', vietnamese: 'Củ Hành Tây', category: 'fruits_veggies', emoji: '🧅', color: '#78350F', exampleEn: 'Onion adds great aroma to soup.', exampleVi: 'Hành tây tạo mùi thơm nồng nàn cho món súp.', funFact: 'Cắt hành làm ta chảy nước mắt vì hơi cay đặc trưng.' },
      { id: 'mushroom', english: 'Mushroom', ipa: '/ˈmʌʃ.ruːm/', vietnamese: 'Cây Nấm', category: 'fruits_veggies', emoji: '🍄', color: '#DC2626', exampleEn: 'The little mushroom grows after the rain.', exampleVi: 'Cây nấm nhỏ mọc lên sau cơn mưa rào.', funFact: 'Nấm không phải là thực vật hay động vật, nấm thuộc giới nấm riêng biệt.' },
      { id: 'pumpkin', english: 'Pumpkin', ipa: '/ˈpʌmp.kɪn/', vietnamese: 'Quả Bí Ngô', category: 'fruits_veggies', emoji: '🎃', color: '#EA580C', exampleEn: 'The big orange pumpkin on Halloween.', exampleVi: 'Quả bí ngô màu cam to lớn trong dịp Halloween.', funFact: 'Bí ngô có thể nặng tới hơn 1.000 kg!' },
    ],
  },

  // =========================================================================
  // 3. PHƯƠNG TIỆN GIAO THÔNG (18 TỪ)
  // =========================================================================
  {
    id: 'vehicles',
    titleEn: 'Vehicles & Transport',
    titleVi: 'Phương Tiện Giao Thông',
    icon: '🚗',
    color: '#0284C7',
    cards: [
      { id: 'car', english: 'Car', ipa: '/kɑːr/', vietnamese: 'Xe Ô Tô', category: 'vehicles', emoji: '🚗', color: '#EF4444', exampleEn: 'Dad drives the red car to work.', exampleVi: 'Bố lái chiếc ô tô màu đỏ đi làm.', funFact: 'Có hơn 1 tỷ chiếc ô tô đang chạy trên khắp thế giới!' },
      { id: 'bus', english: 'Bus', ipa: '/bʌs/', vietnamese: 'Xe Buýt', category: 'vehicles', emoji: '🚌', color: '#EAB308', exampleEn: 'The school bus takes children to school.', exampleVi: 'Xe buýt đưa các bạn học sinh đến trường.', funFact: 'Một chiếc xe buýt có thể chở được hơn 50 hành khách cùng lúc.' },
      { id: 'train', english: 'Train', ipa: '/treɪn/', vietnamese: 'Tàu Hỏa', category: 'vehicles', emoji: '🚂', color: '#3B82F6', exampleEn: 'The train runs fast along the railway track.', exampleVi: 'Tàu hỏa chạy vun vút trên đường ray sắt.', funFact: 'Tàu hỏa siêu tốc Shinkansen ở Nhật Bản chạy êm tới mức không làm đổ cốc nước!' },
      { id: 'airplane', english: 'Airplane', ipa: '/ˈer.pleɪn/', vietnamese: 'Máy Bay', category: 'vehicles', emoji: '✈️', color: '#06B6D4', exampleEn: 'The airplane flies high in the blue sky.', exampleVi: 'Máy bay bay vút trên bầu trời xanh thẳm.', funFact: 'Máy bay có thể bay nhanh hơn cả tốc độ chạy của loài báo săn!' },
      { id: 'helicopter', english: 'Helicopter', ipa: '/ˈhel.əˌkɑːp.tɚ/', vietnamese: 'Trực Thăng', category: 'vehicles', emoji: '🚁', color: '#10B981', exampleEn: 'The helicopter hovers in the air.', exampleVi: 'Trực thăng bay lơ lửng ngay trên không trung.', funFact: 'Trực thăng có thể bay lùi và hạ cánh thẳng đứng ở bất cứ đâu.' },
      { id: 'bicycle', english: 'Bicycle', ipa: '/ˈbaɪ.sə.kəl/', vietnamese: 'Xe Đạp', category: 'vehicles', emoji: '🚲', color: '#10B981', exampleEn: 'Riding a bicycle is good for health.', exampleVi: 'Đạp xe đạp rất tốt cho sức khỏe của bé.', funFact: 'Đi xe đạp giúp bảo vệ môi trường vì hoàn toàn không xả khói bụi.' },
      { id: 'motorbike', english: 'Motorbike', ipa: '/ˈmoʊ.t̬ɚ.baɪk/', vietnamese: 'Xe Máy', category: 'vehicles', emoji: '🏍️', color: '#DC2626', exampleEn: 'Remember to wear a helmet on a motorbike.', exampleVi: 'Nhớ đội mũ bảo hiểm khi ngồi trên xe máy bé nhé.', funFact: 'Việt Nam là một trong những quốc gia có nhiều xe máy nhất thế giới!' },
      { id: 'boat', english: 'Boat', ipa: '/boʊt/', vietnamese: 'Thuyền Nhỏ', category: 'vehicles', emoji: '🛶', color: '#0284C7', exampleEn: 'Rowing a wooden boat on the lake.', exampleVi: 'Chèo thuyền gỗ trên mặt hồ phẳng lặng.', funFact: 'Thuyền là một trong những phát minh di chuyển sớm nhất của loài người.' },
      { id: 'ship', english: 'Ship', ipa: '/ʃɪp/', vietnamese: 'Tàu Thủy Lớn', category: 'vehicles', emoji: '🚢', color: '#1E3A8A', exampleEn: 'The big cruise ship sails on the ocean.', exampleVi: 'Tàu du lịch khổng lồ lướt sóng trên đại dương.', funFact: 'Có những con tàu lớn như một tòa nhà 20 tầng!' },
      { id: 'submarine', english: 'Submarine', ipa: '/ˌsʌb.məˈriːn/', vietnamese: 'Tàu Ngầm', category: 'vehicles', emoji: '🤿', color: '#1E293B', exampleEn: 'The submarine dives deep underwater.', exampleVi: 'Tàu ngầm lặn sâu thẳm dưới đáy biển.', funFact: 'Tàu ngầm có thể ở dưới đáy biển hàng tháng trời mà không cần nổi lên.' },
      { id: 'ambulance', english: 'Ambulance', ipa: '/ˈæm.bjə.ləns/', vietnamese: 'Xe Cứu Thương', category: 'vehicles', emoji: '🚑', color: '#EF4444', exampleEn: 'The ambulance rushes to help sick people.', exampleVi: 'Xe cứu thương hối hả đi cấp cứu người bệnh.', funFact: 'Khi nghe còi xe cứu thương, tất cả xe cộ đều nhường đường ưu tiên.' },
      { id: 'police_car', english: 'Police Car', ipa: '/pəˈliːs kɑːr/', vietnamese: 'Xe Cảnh Sát', category: 'vehicles', emoji: '🚓', color: '#2563EB', exampleEn: 'The police car patrols the city streets.', exampleVi: 'Xe cảnh sát tuần tra trên các con phố.', funFact: 'Đèn nhấp nháy xanh đỏ giúp mọi người nhận ra xe cảnh sát từ xa.' },
      { id: 'fire_truck', english: 'Fire Truck', ipa: '/ˈfaɪr ˌtrʌk/', vietnamese: 'Xe Cứu Hỏa', category: 'vehicles', emoji: '🚒', color: '#DC2626', exampleEn: 'The big red fire truck puts out fires.', exampleVi: 'Xe cứu hỏa đỏ rực dập tắt đám cháy.', funFact: 'Xe cứu hỏa mang theo thang dài và vòi rồng phun nước siêu mạnh!' },
      { id: 'tractor', english: 'Tractor', ipa: '/ˈtræk.tɚ/', vietnamese: 'Máy Cày', category: 'vehicles', emoji: '🚜', color: '#16A34A', exampleEn: 'The tractor works hard on the farm.', exampleVi: 'Máy cày làm việc chăm chỉ trên cánh đồng.', funFact: 'Máy cày có bánh xe khổng lồ giúp không bị lún trong bùn đất.' },
      { id: 'rocket', english: 'Rocket', ipa: '/ˈrɑː.kɪt/', vietnamese: 'Tên Lửa', category: 'vehicles', emoji: '🚀', color: '#8B5CF6', exampleEn: 'The rocket flies into outer space.', exampleVi: 'Tên lửa bay vút vào không gian vũ trụ.', funFact: 'Tên lửa phải bay với tốc độ hơn 40.000 km/h để thoát khỏi lực hút Trái Đất!' },
      { id: 'taxi', english: 'Taxi', ipa: '/ˈtæk.si/', vietnamese: 'Xe Tắc Xi', category: 'vehicles', emoji: '🚕', color: '#F59E0B', exampleEn: 'We take a yellow taxi around the city.', exampleVi: 'Cả nhà đi xe tắc xi màu vàng dạo quanh thành phố.', funFact: 'Xe taxi thường có đèn sáng trên nóc để báo hiệu có khách hay chưa.' },
      { id: 'truck', english: 'Truck', ipa: '/trʌk/', vietnamese: 'Xe Tải', category: 'vehicles', emoji: '🚚', color: '#059669', exampleEn: 'The big truck carries heavy cargo.', exampleVi: 'Chiếc xe tải chở những thùng hàng nặng nề.', funFact: 'Xe tải giúp vận chuyển hoa quả và đồ chơi đến khắp các cửa hàng.' },
      { id: 'scooter', english: 'Scooter', ipa: '/ˈskuː.t̬ɚ/', vietnamese: 'Xe Trượt Scooter', category: 'vehicles', emoji: '🛴', color: '#EC4899', exampleEn: 'The kid rides a scooter in the park.', exampleVi: 'Bé chơi xe trượt scooter trong công viên.', funFact: 'Trượt scooter giúp bé rèn luyện khả năng giữ thăng bằng rất tốt!' },
    ],
  },

  // =========================================================================
  // 4. TRƯỜNG HỌC & DỤNG CỤ (18 TỪ)
  // =========================================================================
  {
    id: 'school',
    titleEn: 'School & Stationery',
    titleVi: 'Trường Học & Dụng Cụ',
    icon: '🎒',
    color: '#8B5CF6',
    cards: [
      { id: 'book', english: 'Book', ipa: '/bʊk/', vietnamese: 'Quyển Sách', category: 'school', emoji: '📖', color: '#3B82F6', exampleEn: 'Reading books gives us knowledge.', exampleVi: 'Đọc sách mang lại cho bé nhiều tri thức bổ ích.', funFact: 'Mỗi trang sách là một cánh cửa mở ra thế giới thần tiên diệu kỳ!' },
      { id: 'pen', english: 'Pen', ipa: '/pen/', vietnamese: 'Bút Mực', category: 'school', emoji: '🖊️', color: '#1D4ED8', exampleEn: 'I write my name with a blue pen.', exampleVi: 'Bé viết tên mình bằng chiếc bút mực xanh.', funFact: 'Bút bi có thể viết được một đoạn đường dài tới 2 kilômét!' },
      { id: 'pencil', english: 'Pencil', ipa: '/ˈpen.səl/', vietnamese: 'Bút Chì', category: 'school', emoji: '✏️', color: '#F59E0B', exampleEn: 'Sharpen your pencil before drawing.', exampleVi: 'Hãy gọt bút chì nhọn trước khi vẽ tranh bé nhé.', funFact: 'Một cây bút chì có thể viết được khoảng 45.000 từ tiếng Anh!' },
      { id: 'eraser', english: 'Eraser', ipa: '/ɪˈreɪ.sɚ/', vietnamese: 'Cục Tẩy', category: 'school', emoji: '🧼', color: '#EC4899', exampleEn: 'Use an eraser to fix mistakes.', exampleVi: 'Dùng cục tẩy để sửa lại những nét vẽ nhầm.', funFact: 'Trước khi có cục tẩy cao su, người ta từng dùng ruột bánh mì để tẩy nét chì.' },
      { id: 'ruler', english: 'Ruler', ipa: '/ˈruː.lɚ/', vietnamese: 'Thước Kẻ', category: 'school', emoji: '📏', color: '#10B981', exampleEn: 'Draw straight lines with a ruler.', exampleVi: 'Kẻ những đường thẳng tắp bằng thước kẻ.', funFact: 'Thước kẻ giúp bé đo chiều dài chính xác từng milimét.' },
      { id: 'backpack', english: 'Backpack', ipa: '/ˈbæk.pæk/', vietnamese: 'Cặp Sách', category: 'school', emoji: '🎒', color: '#EF4444', exampleEn: 'Pack your books into the backpack.', exampleVi: 'Xếp sách vở gọn gàng vào trong cặp sách.', funFact: 'Chiếc ba lô giúp phân bổ đều trọng lượng lên hai vai bé.' },
      { id: 'scissors', english: 'Scissors', ipa: '/ˈsɪz.ɚz/', vietnamese: 'Cây Kéo', category: 'school', emoji: '✂️', color: '#6366F1', exampleEn: 'Cut colorful paper with safety scissors.', exampleVi: 'Cắt giấy màu thủ công bằng kéo an toàn.', funFact: 'Kéo thủ công dành cho bé luôn có đầu bo tròn để đảm bảo an toàn.' },
      { id: 'crayon', english: 'Crayon', ipa: '/ˈkreɪ.ɑːn/', vietnamese: 'Bút Sáp Màu', category: 'school', emoji: '🖍️', color: '#F43F5E', exampleEn: 'Color the rainbow with crayons.', exampleVi: 'Tô màu cầu vồng rực rỡ bằng bút sáp màu.', funFact: 'Bút sáp màu được làm từ sáp ong tự nhiên rất an toàn cho bé.' },
      { id: 'notebook', english: 'Notebook', ipa: '/ˈnoʊt.bʊk/', vietnamese: 'Vở Ghi Bài', category: 'school', emoji: '📓', color: '#475569', exampleEn: 'Write notes in your neat notebook.', exampleVi: 'Viết bài sạch đẹp vào quyển vở ghi.', funFact: 'Tập viết nắn nót giúp bé rèn luyện tính cẩn thận và kiên nhẫn.' },
      { id: 'blackboard', english: 'Blackboard', ipa: '/ˈblæk.bɔːrd/', vietnamese: 'Bảng Đen', category: 'school', emoji: '📋', color: '#0F172A', exampleEn: 'The teacher writes on the blackboard with chalk.', exampleVi: 'Cô giáo viết bài lên bảng đen bằng phấn trắng.', funFact: 'Bảng đen ngày nay thường có màu xanh đậm để bảo vệ thị lực học sinh.' },
      { id: 'desk', english: 'Desk', ipa: '/desk/', vietnamese: 'Bàn Học', category: 'school', emoji: '🪑', color: '#92400E', exampleEn: 'Sit nicely at your study desk.', exampleVi: 'Ngồi ngay ngắn tại bàn học của bé.', funFact: 'Ngồi học thẳng lưng giúp bé có vóc dáng đẹp và không bị mỏi mắt.' },
      { id: 'chair', english: 'Chair', ipa: '/tʃer/', vietnamese: 'Cái Ghế', category: 'school', emoji: '🪑', color: '#B45309', exampleEn: 'Please sit on the comfortable chair.', exampleVi: 'Xin mời ngồi vào chiếc ghế êm ái.', funFact: 'Ghế ngồi vừa vặn giúp bé tập trung học tập tốt hơn.' },
      { id: 'teacher', english: 'Teacher', ipa: '/ˈtiː.tʃɚ/', vietnamese: 'Thầy Cô Giáo', category: 'school', emoji: '👩‍🏫', color: '#D97706', exampleEn: 'The teacher teaches us many good lessons.', exampleVi: 'Thầy cô dạy cho bé bao bài học hay.', funFact: 'Thầy cô như người cha, người mẹ thứ hai dìu dắt bé khôn lớn.' },
      { id: 'student', english: 'Student', ipa: '/ˈstuː.dənt/', vietnamese: 'Học Sinh', category: 'school', emoji: '🧑‍🎓', color: '#2563EB', exampleEn: 'The hardworking student listens carefully.', exampleVi: 'Bạn học sinh chăm chỉ chú ý lắng nghe cô giảng.', funFact: 'Học sinh ngoan luôn lễ phép chào hỏi thầy cô và giúp đỡ bạn bè.' },
      { id: 'classroom', english: 'Classroom', ipa: '/ˈklæs.ruːm/', vietnamese: 'Lớp Học', category: 'school', emoji: '🏫', color: '#059669', exampleEn: 'Our classroom is bright and clean.', exampleVi: 'Lớp học của chúng em sáng sủa và sạch đẹp.', funFact: 'Lớp học là nơi lưu giữ những kỷ niệm tuổi thơ ấm áp nhất.' },
      { id: 'clock', english: 'Clock', ipa: '/klɑːk/', vietnamese: 'Đồng Hồ', category: 'school', emoji: '⏰', color: '#EA580C', exampleEn: 'The clock tells us the time to study.', exampleVi: 'Đồng hồ báo hiệu giờ học bài cho bé.', funFact: 'Thời gian trôi đi không bao giờ quay lại, hãy quý trọng từng phút giây!' },
      { id: 'paper', english: 'Paper', ipa: '/ˈpeɪ.pɚ/', vietnamese: 'Tờ Giấy', category: 'school', emoji: '📄', color: '#94A3B8', exampleEn: 'Fold a paper plane and let it fly.', exampleVi: 'Gấp một chiếc máy bay giấy rồi thả cho bay.', funFact: 'Giấy được phát minh cách đây hơn 2.000 năm từ sợi thực vật.' },
      { id: 'computer', english: 'Computer', ipa: '/kəmˈpjuː.t̬ɚ/', vietnamese: 'Máy Tính', category: 'school', emoji: '💻', color: '#3B82F6', exampleEn: 'Learning English online with a computer.', exampleVi: 'Học tiếng Anh trực tuyến trên máy tính.', funFact: 'Chiếc máy tính đầu tiên nặng tới 30 tấn và chiếm trọn một căn phòng lớn!' },
    ],
  },

  // =========================================================================
  // 5. ĐỒ DÙNG GIA ĐÌNH (18 TỪ)
  // =========================================================================
  {
    id: 'home',
    titleEn: 'Home & Daily Life',
    titleVi: 'Đồ Dùng Gia Đình',
    icon: '🏠',
    color: '#7C3AED',
    cards: [
      { id: 'house', english: 'House', ipa: '/haʊs/', vietnamese: 'Ngôi Nhà', category: 'home', emoji: '🏡', color: '#EC4899', exampleEn: 'Home is where love lives.', exampleVi: 'Ngôi nhà là nơi chan chứa tình yêu thương.', funFact: 'Nhà là tổ ấm bình yên nhất sau mỗi ngày học tập và vui chơi.' },
      { id: 'door', english: 'Door', ipa: '/dɔːr/', vietnamese: 'Cánh Cửa', category: 'home', emoji: '🚪', color: '#92400E', exampleEn: 'Please knock on the door before entering.', exampleVi: 'Hãy gõ cửa trước khi bước vào phòng nhé.', funFact: 'Cánh cửa mở ra đón chào người thân và khách quý đến chơi nhà.' },
      { id: 'window', english: 'Window', ipa: '/ˈwɪn.doʊ/', vietnamese: 'Cửa Sổ', category: 'home', emoji: '🪟', color: '#38BDF8', exampleEn: 'Open the window to let fresh sunshine in.', exampleVi: 'Mở cửa sổ đón ánh nắng sớm mai trong lành.', funFact: 'Cửa sổ giúp không khí trong nhà luôn được lưu thông thoáng mát.' },
      { id: 'bed', english: 'Bed', ipa: '/bed/', vietnamese: 'Chiếc Giường', category: 'home', emoji: '🛏️', color: '#6366F1', exampleEn: 'A soft bed gives you sweet dreams.', exampleVi: 'Chiếc giường êm ái cho bé những giấc mơ đẹp.', funFact: 'Một giấc ngủ sâu trên giường êm giúp não bộ của bé phát triển thông minh.' },
      { id: 'table', english: 'Table', ipa: '/ˈteɪ.bəl/', vietnamese: 'Cái Bàn', category: 'home', emoji: '🪵', color: '#B45309', exampleEn: 'The whole family gathers around the dinner table.', exampleVi: 'Cả gia đình quây quần ấm cúng bên bàn ăn.', funFact: 'Bàn ăn là nơi cả nhà cùng chia sẻ những câu chuyện vui mỗi ngày.' },
      { id: 'lamp', english: 'Lamp', ipa: '/læmp/', vietnamese: 'Đèn Bàn', category: 'home', emoji: '💡', color: '#FACC15', exampleEn: 'Turn on the lamp when reading at night.', exampleVi: 'Bật đèn bàn sáng khi đọc sách ban đêm.', funFact: 'Đèn LED hiện đại giúp tiết kiệm điện và chống cận thị cho mắt bé.' },
      { id: 'television', english: 'Television', ipa: '/ˈtel.ə.vɪʒ.ən/', vietnamese: 'Ti Vi', category: 'home', emoji: '📺', color: '#334155', exampleEn: 'Watch fun cartoons on the television.', exampleVi: 'Xem phim hoạt hình vui nhộn trên ti vi.', funFact: 'Không nên ngồi xem ti vi quá gần để bảo vệ đôi mắt sáng.' },
      { id: 'refrigerator', english: 'Refrigerator', ipa: '/rɪˈfrɪdʒ.ə.reɪ.t̬ɚ/', vietnamese: 'Tủ Lạnh', category: 'home', emoji: '🧊', color: '#0284C7', exampleEn: 'The refrigerator keeps food fresh and cool.', exampleVi: 'Tủ lạnh giữ cho thức ăn luôn tươi ngon.', funFact: 'Nhiệt độ mát trong tủ lạnh ngăn vi khuẩn phát triển làm hỏng thức ăn.' },
      { id: 'sofa', english: 'Sofa', ipa: '/ˈsoʊ.fə/', vietnamese: 'Ghế Xô-pha', category: 'home', emoji: '🛋️', color: '#059669', exampleEn: 'Relax on the soft living room sofa.', exampleVi: 'Nghỉ ngơi thư giãn trên chiếc ghế xô-pha êm ái.', funFact: 'Ghế sofa phòng khách là nơi tiếp đón bạn bè đến chơi nhà.' },
      { id: 'mirror', english: 'Mirror', ipa: '/ˈmɪr.ɚ/', vietnamese: 'Gương Soi', category: 'home', emoji: '🪞', color: '#93C5FD', exampleEn: 'Smile at yourself in the shiny mirror.', exampleVi: 'Mỉm cười tươi tắn trước gương soi.', funFact: 'Gương phản chiếu ánh sáng giúp căn phòng trông rộng rãi hơn.' },
      { id: 'pillow', english: 'Pillow', ipa: '/ˈpɪl.oʊ/', vietnamese: 'Gối Nằm', category: 'home', emoji: '🪶', color: '#F472B6', exampleEn: 'Rest your head on a soft fluffy pillow.', exampleVi: 'Gối đầu trên chiếc gối êm ái như bông.', funFact: 'Chiếc gối mềm nâng đỡ cổ giúp bé ngủ ngon suốt đêm dài.' },
      { id: 'blanket', english: 'Blanket', ipa: '/ˈblæŋ.kɪt/', vietnamese: 'Chiếc Chăn', category: 'home', emoji: '🧶', color: '#C084FC', exampleEn: 'The warm blanket keeps you cozy in winter.', exampleVi: 'Chiếc chăn ấm áp giữ ấm cho bé trong mùa đông.', funFact: 'Đắp chăn ấm tạo cảm giác an toàn và dễ chịu khi ngủ.' },
      { id: 'spoon', english: 'Spoon', ipa: '/spuːn/', vietnamese: 'Cái Thìa', category: 'home', emoji: '🥄', color: '#94A3B8', exampleEn: 'Eat delicious soup with a shiny spoon.', exampleVi: 'Ăn món súp thơm ngon bằng chiếc thìa nhỏ.', funFact: 'Chiếc thìa là dụng cụ ăn uống lâu đời nhất của con người.' },
      { id: 'fork', english: 'Fork', ipa: '/fɔːrk/', vietnamese: 'Cái Nĩa', category: 'home', emoji: '🍴', color: '#64748B', exampleEn: 'Use a fork to pick sweet fruits.', exampleVi: 'Dùng nĩa để gắp những miếng trái cây ngọt.', funFact: 'Nĩa giúp chúng ta gắp thức ăn gọn gàng và sạch sẽ.' },
      { id: 'cup', english: 'Cup', ipa: '/kʌp/', vietnamese: 'Cái Cốc', category: 'home', emoji: '🥛', color: '#38BDF8', exampleEn: 'Drink a cup of warm water every morning.', exampleVi: 'Uống một cốc nước ấm vào mỗi buổi sáng.', funFact: 'Uống đủ nước mỗi ngày giúp làn da bé hồng hào khỏe mạnh.' },
      { id: 'bowl', english: 'Bowl', ipa: '/boʊl/', vietnamese: 'Cái Bát (Chén)', category: 'home', emoji: '🥣', color: '#F97316', exampleEn: 'A warm bowl of soup for dinner.', exampleVi: 'Một bát canh nóng hổi cho bữa tối sum họp.', funFact: 'Bát sứ được tráng men sáng bóng và giữ nhiệt rất tốt.' },
      { id: 'key', english: 'Key', ipa: '/kiː/', vietnamese: 'Chìa Khóa', category: 'home', emoji: '🔑', color: '#EAB308', exampleEn: 'Turn the golden key to unlock the door.', exampleVi: 'Xoay chiếc chìa khóa vàng để mở cửa vào nhà.', funFact: 'Mỗi ổ khóa đều có răng cưa độc nhất tương ứng với chìa khóa của nó.' },
      { id: 'fan', english: 'Fan', ipa: '/fæn/', vietnamese: 'Quạt Máy', category: 'home', emoji: '🪭', color: '#06B6D4', exampleEn: 'The electric fan brings cool breeze.', exampleVi: 'Quạt máy mang lại luồng gió mát lành.', funFact: 'Cánh quạt quay nhanh tạo ra luồng gió làm dịu cơn nóng bức mùa hè.' },
    ],
  },

  // =========================================================================
  // 6. BỘ PHẬN CƠ THỂ (18 TỪ)
  // =========================================================================
  {
    id: 'body',
    titleEn: 'Human Body & Senses',
    titleVi: 'Bộ Phận Cơ Thể',
    icon: '👤',
    color: '#EC4899',
    cards: [
      { id: 'head', english: 'Head', ipa: '/hed/', vietnamese: 'Cái Đầu', category: 'body', emoji: '🗣️', color: '#F43F5E', exampleEn: 'Nod your head to say yes.', exampleVi: 'Gật đầu nhẹ để đồng ý.', funFact: 'Đầu là nơi chứa bộ não kỳ diệu điều khiển mọi hoạt động của cơ thể.' },
      { id: 'eye', english: 'Eye', ipa: '/aɪ/', vietnamese: 'Đôi Mắt', category: 'body', emoji: '👁️', color: '#3B82F6', exampleEn: 'We see the beautiful colorful world with our eyes.', exampleVi: 'Chúng ta ngắm nhìn thế giới tươi đẹp bằng đôi mắt.', funFact: 'Mắt con người có thể phân biệt được tới 10 triệu sắc màu khác nhau!' },
      { id: 'ear', english: 'Ear', ipa: '/ɪr/', vietnamese: 'Đôi Tai', category: 'body', emoji: '👂', color: '#F59E0B', exampleEn: 'Listen to sweet music with your ears.', exampleVi: 'Lắng nghe những điệu nhạc du dương bằng đôi tai.', funFact: 'Đôi tai không chỉ để nghe mà còn giúp cơ thể giữ thăng bằng khi di chuyển.' },
      { id: 'nose', english: 'Nose', ipa: '/noʊz/', vietnamese: 'Cái Mũi', category: 'body', emoji: '👃', color: '#10B981', exampleEn: 'Smell sweet fragrant flowers with your nose.', exampleVi: 'Ngửi hương thơm ngát của bông hoa bằng cái mũi.', funFact: 'Mũi có thể ghi nhớ hàng ngàn mùi hương khác nhau suốt cuộc đời.' },
      { id: 'mouth', english: 'Mouth', ipa: '/maʊθ/', vietnamese: 'Cái Miệng', category: 'body', emoji: '👄', color: '#EF4444', exampleEn: 'Smile brightly with your sweet mouth.', exampleVi: 'Nở nụ cười thật tươi bằng khuôn miệng xinh.', funFact: 'Miệng giúp chúng ta nói chuyện, ca hát và thưởng thức món ăn ngon.' },
      { id: 'hair', english: 'Hair', ipa: '/her/', vietnamese: 'Mái Tóc', category: 'body', emoji: '💇', color: '#1E293B', exampleEn: 'Comb your silky hair neatly every day.', exampleVi: 'Chải mái tóc óng ả gọn gàng mỗi ngày.', funFact: 'Mái tóc giúp giữ ấm và bảo vệ đầu khỏi ánh nắng mặt trời.' },
      { id: 'face', english: 'Face', ipa: '/feɪs/', vietnamese: 'Khuôn Mặt', category: 'body', emoji: '😊', color: '#FBBF24', exampleEn: 'Wash your face with cool clean water.', exampleVi: 'Rửa sạch khuôn mặt bằng nước mát.', funFact: 'Khuôn mặt có hàng chục cơ nhỏ giúp bé thể hiện cảm xúc vui buồn.' },
      { id: 'hand', english: 'Hand', ipa: '/hænd/', vietnamese: 'Bàn Tay', category: 'body', emoji: '✋', color: '#FB923C', exampleEn: 'Wash your hands clean before eating.', exampleVi: 'Rửa tay sạch sẽ trước khi ăn cơm.', funFact: 'Đôi bàn tay khéo léo giúp bé vẽ tranh, viết chữ và cầm nắm đồ chơi.' },
      { id: 'arm', english: 'Arm', ipa: '/ɑːrm/', vietnamese: 'Cánh Tay', category: 'body', emoji: '💪', color: '#EA580C', exampleEn: 'Strong arms to give mom a warm hug.', exampleVi: 'Cánh tay khỏe khoắn ôm mẹ thật ấm áp.', funFact: 'Cánh tay có thể vươn xa và nâng đỡ nhiều vật dụng.' },
      { id: 'leg', english: 'Leg', ipa: '/leɡ/', vietnamese: 'Đôi Chân', category: 'body', emoji: '🦵', color: '#D97706', exampleEn: 'Strong legs help you run and jump.', exampleVi: 'Đôi chân khỏe giúp bé chạy nhảy tung tăng.', funFact: 'Xương đùi ở chân là xương dài và cứng cáp nhất trong cơ thể người.' },
      { id: 'foot', english: 'Foot', ipa: '/fʊt/', vietnamese: 'Bàn Chân', category: 'body', emoji: '🦶', color: '#F59E0B', exampleEn: 'Wear socks to keep your feet warm.', exampleVi: 'Đi tất để giữ ấm cho đôi bàn chân.', funFact: 'Mỗi bàn chân chứa tới 26 chiếc xương nhỏ liên kết hoàn hảo.' },
      { id: 'finger', english: 'Finger', ipa: '/ˈfɪŋ.ɡɚ/', vietnamese: 'Ngón Tay', category: 'body', emoji: '☝️', color: '#FB7185', exampleEn: 'We have ten little nimble fingers.', exampleVi: 'Chúng ta có mười ngón tay nhỏ xinh.', funFact: 'Dấu vân tay trên mỗi ngón tay là hoàn toàn duy nhất cho mỗi người.' },
      { id: 'toe', english: 'Toe', ipa: '/toʊ/', vietnamese: 'Ngón Chân', category: 'body', emoji: '👣', color: '#F472B6', exampleEn: 'Wiggle your toes in the clean sand.', exampleVi: 'Cử động những ngón chân trên bãi cát mịn.', funFact: 'Các ngón chân giúp bé giữ thăng bằng khi đứng thẳng và chạy nhảy.' },
      { id: 'shoulder', english: 'Shoulder', ipa: '/ˈʃoʊl.dɚ/', vietnamese: 'Bờ Vai', category: 'body', emoji: '🤷', color: '#6366F1', exampleEn: 'Carry your backpack on both shoulders.', exampleVi: 'Đeo cặp sách đều trên cả hai bờ vai.', funFact: 'Khớp vai là khớp cử động linh hoạt nhất trên cơ thể.' },
      { id: 'knee', english: 'Knee', ipa: '/niː/', vietnamese: 'Đầu Gối', category: 'body', emoji: '🧎', color: '#8B5CF6', exampleEn: 'Bend your knees when jumping high.', exampleVi: 'Khuỵu đầu gối khi nhảy cao để tiếp đất êm ái.', funFact: 'Đầu gối chịu lực tải toàn bộ sức nặng cơ thể khi chúng ta bước đi.' },
      { id: 'heart', english: 'Heart', ipa: '/hɑːrt/', vietnamese: 'Trái Tim', category: 'body', emoji: '❤️', color: '#EF4444', exampleEn: 'My heart beats with love and joy.', exampleVi: 'Trái tim đập rộn ràng với niềm vui và yêu thương.', funFact: 'Trái tim bé bỏng đập khoảng 100.000 lần mỗi ngày không ngừng nghỉ!' },
      { id: 'tooth', english: 'Tooth', ipa: '/tuːθ/', vietnamese: 'Chiếc Răng', category: 'body', emoji: '🦷', color: '#38BDF8', exampleEn: 'Brush your teeth twice a day for a bright smile.', exampleVi: 'Đánh răng hai lần mỗi ngày để nụ cười luôn trắng sáng.', funFact: 'Men răng là chất cứng nhất trong toàn bộ cơ thể con người!' },
      { id: 'tongue', english: 'Tongue', ipa: '/tʌŋ/', vietnamese: 'Cái Lưỡi', category: 'body', emoji: '👅', color: '#FB7185', exampleEn: 'The tongue helps us taste sweet candy.', exampleVi: 'Chiếc lưỡi giúp bé nếm vị ngọt ngào của viên kẹo.', funFact: 'Lưỡi có hàng ngàn nụ vị giác giúp nhận biết vị ngọt, mặn, chua, đắng.' },
    ],
  },

  // =========================================================================
  // 7. MÀU SẮC & HÌNH KHỐI (16 TỪ)
  // =========================================================================
  {
    id: 'colors_shapes',
    titleEn: 'Colors & Shapes',
    titleVi: 'Màu Sắc & Hình Khối',
    icon: '🎨',
    color: '#10B981',
    cards: [
      { id: 'red', english: 'Red', ipa: '/red/', vietnamese: 'Màu Đỏ', category: 'colors_shapes', emoji: '🔴', color: '#EF4444', exampleEn: 'The ripe strawberry is bright red.', exampleVi: 'Quả dâu tây chín mọng có màu đỏ tươi.', funFact: 'Màu đỏ là màu của may mắn, tình yêu và ngọn lửa ấm áp.' },
      { id: 'blue', english: 'Blue', ipa: '/bluː/', vietnamese: 'Màu Xanh Dương', category: 'colors_shapes', emoji: '🔵', color: '#3B82F6', exampleEn: 'The sky and the sea are deep blue.', exampleVi: 'Bầu trời và biển cả có màu xanh dương thẳm.', funFact: 'Màu xanh dương mang lại cảm giác bình yên và thư thái.' },
      { id: 'yellow', english: 'Yellow', ipa: '/ˈjel.oʊ/', vietnamese: 'Màu Vàng', category: 'colors_shapes', emoji: '🟡', color: '#EAB308', exampleEn: 'The shining sun is bright yellow.', exampleVi: 'Mặt trời tỏa ánh sáng vàng rực rỡ.', funFact: 'Màu vàng tượng trưng cho năng lượng, niềm vui và sự lạc quan.' },
      { id: 'green', english: 'Green', ipa: '/ɡriːn/', vietnamese: 'Màu Xanh Lá', category: 'colors_shapes', emoji: '🟢', color: '#10B981', exampleEn: 'Green leaves on the tall trees.', exampleVi: 'Những chiếc lá xanh tươi trên cây cao.', funFact: 'Màu xanh lá là màu của thiên nhiên và sự tươi mới tràn trề.' },
      { id: 'orange_col', english: 'Orange', ipa: '/ˈɔːr.ɪndʒ/', vietnamese: 'Màu Cam', category: 'colors_shapes', emoji: '🟠', color: '#F97316', exampleEn: 'A sweet carrot is orange.', exampleVi: 'Củ cà rốt ngọt ngào có màu cam.', funFact: 'Màu cam kích thích sự sáng tạo và cảm giác thèm ăn của bé.' },
      { id: 'purple', english: 'Purple', ipa: '/ˈpɝː.pəl/', vietnamese: 'Màu Tím', category: 'colors_shapes', emoji: '🟣', color: '#A855F7', exampleEn: 'A bunch of sweet purple grapes.', exampleVi: 'Chùm nho chín mọng có màu tím mộng mơ.', funFact: 'Màu tím thời xưa từng là màu biểu tượng của hoàng gia quý tộc.' },
      { id: 'pink', english: 'Pink', ipa: '/pɪŋk/', vietnamese: 'Màu Hồng', category: 'colors_shapes', emoji: '🌸', color: '#EC4899', exampleEn: 'A pretty pink lotus flower.', exampleVi: 'Bông hoa sen màu hồng tuyệt đẹp.', funFact: 'Màu hồng tượng trưng cho sự ngọt ngào, dịu dàng và đáng yêu.' },
      { id: 'black', english: 'Black', ipa: '/blæk/', vietnamese: 'Màu Đen', category: 'colors_shapes', emoji: '⚫', color: '#0F172A', exampleEn: 'The night sky is mysterious black.', exampleVi: 'Bầu trời đêm huyền bí có màu đen.', funFact: 'Màu đen hấp thụ toàn bộ ánh sáng chiếu vào nó.' },
      { id: 'white', english: 'White', ipa: '/waɪt/', vietnamese: 'Màu Trắng', category: 'colors_shapes', emoji: '⚪', color: '#94A3B8', exampleEn: 'Fluffy white clouds in the sky.', exampleVi: 'Những đám mây trắng bồng bềnh trên bầu trời.', funFact: 'Màu trắng là sự tổng hợp của tất cả các màu sắc trong dải quang phổ.' },
      { id: 'brown', english: 'Brown', ipa: '/braʊn/', vietnamese: 'Màu Nâu', category: 'colors_shapes', emoji: '🟤', color: '#78350F', exampleEn: 'A brown teddy bear to cuddle.', exampleVi: 'Chú gấu bông màu nâu ôm thật thích.', funFact: 'Màu nâu là màu của đất mẹ màu mỡ nuôi dưỡng cây cối.' },
      { id: 'circle', english: 'Circle', ipa: '/ˈsɝː.kəl/', vietnamese: 'Hình Tròn', category: 'colors_shapes', emoji: '⭕', color: '#EF4444', exampleEn: 'The full moon looks like a big circle.', exampleVi: 'Mặt trăng tròn như một chiếc đĩa bạc.', funFact: 'Hình tròn là hình dạng hoàn hảo không có bất kỳ góc cạnh nào.' },
      { id: 'square', english: 'Square', ipa: '/skwer/', vietnamese: 'Hình Vuông', category: 'colors_shapes', emoji: '⬛', color: '#3B82F6', exampleEn: 'A picture frame is a square.', exampleVi: 'Khung ảnh xinh xắn có hình vuông vắn.', funFact: 'Hình vuông có bốn cạnh dài bằng nhau và bốn góc vuông chuẩn xác.' },
      { id: 'triangle', english: 'Triangle', ipa: '/ˈtraɪ.æŋ.ɡəl/', vietnamese: 'Hình Tam Giác', category: 'colors_shapes', emoji: '🔺', color: '#EAB308', exampleEn: 'A slice of pizza is a triangle.', exampleVi: 'Một miếng bánh pizza có hình tam giác.', funFact: 'Hình tam giác là kết cấu hình học vững chắc và chịu lực tốt nhất.' },
      { id: 'rectangle', english: 'Rectangle', ipa: '/ˈrekˌtæŋ.ɡəl/', vietnamese: 'Hình Chữ Nhật', category: 'colors_shapes', emoji: '▭', color: '#10B981', exampleEn: 'A book page has a rectangle shape.', exampleVi: 'Trang sách có dạng hình chữ nhật.', funFact: 'Hầu hết các cánh cửa và màn hình điện thoại đều có hình chữ nhật.' },
      { id: 'star_shape', english: 'Star', ipa: '/stɑːr/', vietnamese: 'Hình Ngôi Sao', category: 'colors_shapes', emoji: '⭐', color: '#F59E0B', exampleEn: 'A glowing five-pointed yellow star.', exampleVi: 'Ngôi sao vàng năm cánh tỏa sáng lấp lánh.', funFact: 'Ngôi sao năm cánh là biểu tượng tuyệt đẹp trên quốc kỳ Việt Nam.' },
      { id: 'heart_shape', english: 'Heart', ipa: '/hɑːrt/', vietnamese: 'Hình Trái Tim', category: 'colors_shapes', emoji: '💖', color: '#EC4899', exampleEn: 'Draw a sweet heart for mommy.', exampleVi: 'Vẽ một hình trái tim ngọt ngào tặng mẹ yêu.', funFact: 'Hình trái tim là biểu tượng toàn cầu của tình yêu và sự gắn kết.' },
    ],
  },

  // =========================================================================
  // 8. QUẦN ÁO & PHỤ KIỆN (16 TỪ)
  // =========================================================================
  {
    id: 'clothes',
    titleEn: 'Clothes & Accessories',
    titleVi: 'Quần Áo & Phụ Kiện',
    icon: '👕',
    color: '#06B6D4',
    cards: [
      { id: 'shirt', english: 'Shirt', ipa: '/ʃɝːt/', vietnamese: 'Áo Sơ Mi', category: 'clothes', emoji: '👔', color: '#2563EB', exampleEn: 'Dad wears a clean white shirt.', exampleVi: 'Bố mặc chiếc áo sơ mi trắng tinh tươm.', funFact: 'Áo sơ mi có cổ áo lịch sự dùng trong các dịp trang trọng.' },
      { id: 'tshirt', english: 'T-shirt', ipa: '/ˈtiː.ʃɝːt/', vietnamese: 'Áo Phông (Áo Thun)', category: 'clothes', emoji: '👕', color: '#3B82F6', exampleEn: 'A comfortable cotton T-shirt for playing.', exampleVi: 'Áo phông cotton thoáng mát để bé vui chơi.', funFact: 'T-shirt được gọi như vậy vì khi trải phẳng áo có hình chữ T.' },
      { id: 'pants', english: 'Pants', ipa: '/pænts/', vietnamese: 'Quần Dài', category: 'clothes', emoji: '👖', color: '#1D4ED8', exampleEn: 'Wear warm pants when going outside.', exampleVi: 'Mặc quần dài ấm áp khi đi dạo bên ngoài.', funFact: 'Quần dài bảo vệ đôi chân bé khỏi bụi bẩn và côn trùng.' },
      { id: 'shorts', english: 'Shorts', ipa: '/ʃɔːrts/', vietnamese: 'Quần Soóc (Quần Ngắn)', category: 'clothes', emoji: '🩳', color: '#059669', exampleEn: 'Cool shorts for hot summer days.', exampleVi: 'Quần soóc mát mẻ cho những ngày hè rực rỡ.', funFact: 'Quần soóc giúp bé vận động chạy nhảy dễ dàng và năng động.' },
      { id: 'dress', english: 'Dress', ipa: '/dres/', vietnamese: 'Váy Liền (Đầm)', category: 'clothes', emoji: '👗', color: '#EC4899', exampleEn: 'The girl wears a lovely floral dress.', exampleVi: 'Bé gái diện chiếc đầm hoa xinh xắn.', funFact: 'Chiếc váy xòe bồng bềnh giúp bé trông như một nàng công chúa nhỏ.' },
      { id: 'skirt', english: 'Skirt', ipa: '/skɝːt/', vietnamese: 'Chân Váy', category: 'clothes', emoji: '🥻', color: '#A855F7', exampleEn: 'A pleated skirt with school uniform.', exampleVi: 'Chân váy xếp ly đồng phục đi học dễ thương.', funFact: 'Chân váy có thể kết hợp linh hoạt với nhiều kiểu áo khác nhau.' },
      { id: 'jacket', english: 'Jacket', ipa: '/ˈdʒæk.ɪt/', vietnamese: 'Áo Khoác Nhẹ', category: 'clothes', emoji: '🧥', color: '#D97706', exampleEn: 'Zip up your warm jacket in the wind.', exampleVi: 'Kéo khóa áo khoác ấm khi có gió mùa.', funFact: 'Áo khoác gió cản gió lạnh rất hiệu quả bảo vệ sức khỏe.' },
      { id: 'coat', english: 'Coat', ipa: '/koʊt/', vietnamese: 'Áo Măng Tô / Áo Ấm', category: 'clothes', emoji: '🥼', color: '#78350F', exampleEn: 'A thick coat for cold winter days.', exampleVi: 'Chiếc áo ấm dày dặn cho ngày đông lạnh giá.', funFact: 'Áo khoác dạ dày giúp giữ nhiệt độ cơ thể luôn ổn định.' },
      { id: 'hat', english: 'Hat', ipa: '/hæt/', vietnamese: 'Cái Mũ (Vành Rộng)', category: 'clothes', emoji: '👒', color: '#CA8A04', exampleEn: 'Wear a sun hat at the beach.', exampleVi: 'Đội mũ rộng vành khi dạo chơi bãi biển.', funFact: 'Mũ rộng vành che nắng giúp bảo vệ làn da và đôi mắt bé.' },
      { id: 'cap', english: 'Cap', ipa: '/kæp/', vietnamese: 'Mũ Lưỡi Trai', category: 'clothes', emoji: '🧢', color: '#2563EB', exampleEn: 'A cool blue baseball cap.', exampleVi: 'Chiếc mũ lưỡi trai xanh thể thao năng động.', funFact: 'Phần lưỡi trai phía trước giúp chắn bớt ánh nắng chói chang.' },
      { id: 'shoes', english: 'Shoes', ipa: '/ʃuːz/', vietnamese: 'Đôi Giày', category: 'clothes', emoji: '👟', color: '#EF4444', exampleEn: 'Tie your shoelaces before running.', exampleVi: 'Buộc dây giày cẩn thận trước khi chạy bộ.', funFact: 'Đôi giày thể thao êm ái bảo vệ từng bước chân của bé.' },
      { id: 'socks', english: 'Socks', ipa: '/sɑːks/', vietnamese: 'Đôi Tất (Vớ)', category: 'clothes', emoji: '🧦', color: '#10B981', exampleEn: 'Soft warm socks keep your feet cozy.', exampleVi: 'Đôi tất ấm áp giữ ấm cho bàn chân bé.', funFact: 'Đi tất khi ngủ giúp lưu thông máu tốt và ngủ sâu giấc hơn.' },
      { id: 'boots', english: 'Boots', ipa: '/buːts/', vietnamese: 'Đôi Ủng / Bốt', category: 'clothes', emoji: '👢', color: '#B45309', exampleEn: 'Wear rain boots to jump in puddles.', exampleVi: 'Đi ủng đi mưa để lội qua vũng nước vui nhộn.', funFact: 'Ủng cao su không thấm nước giúp chân bé luôn khô ráo.' },
      { id: 'gloves', english: 'Gloves', ipa: '/ɡlʌvz/', vietnamese: 'Đôi Găng Tay', category: 'clothes', emoji: '🧤', color: '#6366F1', exampleEn: 'Wear warm wool gloves to build a snowman.', exampleVi: 'Đeo găng tay len ấm để đắp người tuyết.', funFact: 'Găng tay giúp các ngón tay không bị cóng lạnh khi mùa đông tới.' },
      { id: 'scarf', english: 'Scarf', ipa: '/skɑːrf/', vietnamese: 'Khăn Quàng Cổ', category: 'clothes', emoji: '🧣', color: '#DC2626', exampleEn: 'Wrap a red scarf around your neck.', exampleVi: 'Quàng chiếc khăn đỏ ấm áp quanh cổ.', funFact: 'Giữ ấm vùng cổ giúp phòng tránh các bệnh ho và cảm lạnh.' },
      { id: 'glasses', english: 'Glasses', ipa: '/ˈɡlæs.ɪz/', vietnamese: 'Kính Mắt', category: 'clothes', emoji: '👓', color: '#0F172A', exampleEn: 'Glasses help you see clearly.', exampleVi: 'Kính mắt giúp bé nhìn rõ mọi vật xung quanh.', funFact: 'Kính râm còn giúp chống tia cực tím có hại từ ánh mặt trời.' },
    ],
  },

  // =========================================================================
  // 9. THỨC ĂN & ĐỒ UỐNG (18 TỪ)
  // =========================================================================
  {
    id: 'food_drinks',
    titleEn: 'Food & Drinks',
    titleVi: 'Thức Ăn & Đồ Uống',
    icon: '🍕',
    color: '#F59E0B',
    cards: [
      { id: 'bread', english: 'Bread', ipa: '/bred/', vietnamese: 'Bánh Mì', category: 'food_drinks', emoji: '🍞', color: '#D97706', exampleEn: 'Crispy warm bread for breakfast.', exampleVi: 'Bánh mì nóng giòn cho bữa sáng thơm ngon.', funFact: 'Bánh mì là món ăn phổ biến nhất trên toàn thế giới!' },
      { id: 'rice', english: 'Rice', ipa: '/raɪs/', vietnamese: 'Cơm / Hạt Gạo', category: 'food_drinks', emoji: '🍚', color: '#94A3B8', exampleEn: 'A warm bowl of fragrant white rice.', exampleVi: 'Bát cơm trắng dẻo thơm ngon trong bữa cơm gia đình.', funFact: 'Cơm là lương thực chính nuôi sống hơn một nửa dân số thế giới.' },
      { id: 'noodles', english: 'Noodles', ipa: '/ˈnuː.dəlz/', vietnamese: 'Mì / Phở', category: 'food_drinks', emoji: '🍜', color: '#EA580C', exampleEn: 'A delicious hot bowl of noodle soup.', exampleVi: 'Tô mì nóng hổi thơm ngon tuyệt vời.', funFact: 'Món Phở Việt Nam nổi tiếng khắp thế giới bởi hương vị đậm đà độc đáo.' },
      { id: 'pizza', english: 'Pizza', ipa: '/ˈpiːt.sə/', vietnamese: 'Bánh Pi-da', category: 'food_drinks', emoji: '🍕', color: '#DC2626', exampleEn: 'Share a cheesy pizza with friends.', exampleVi: 'Cùng chia sẻ miếng bánh pizza ngập phô mai với bạn bè.', funFact: 'Chiếc bánh pizza đầu tiên xuất xứ từ đất nước Ý xinh đẹp.' },
      { id: 'burger', english: 'Burger', ipa: '/ˈbɝː.ɡɚ/', vietnamese: 'Bánh Hăm-bơ-gơ', category: 'food_drinks', emoji: '🍔', color: '#B45309', exampleEn: 'A tasty hamburger with lettuce and tomato.', exampleVi: 'Bánh hăm-bơ-gơ kẹp xà lách và cà chua tươi.', funFact: 'Bánh burger có đầy đủ thịt, rau và tinh bột thơm ngon.' },
      { id: 'egg', english: 'Egg', ipa: '/eɡ/', vietnamese: 'Quả Trứng', category: 'food_drinks', emoji: '🥚', color: '#FDE047', exampleEn: 'A fried egg has a bright yellow yolk.', exampleVi: 'Trứng ốp la có lòng đỏ vàng ươm hấp dẫn.', funFact: 'Trứng chứa nhiều protein chất lượng cao giúp bé lớn nhanh và khỏe mạnh.' },
      { id: 'cheese', english: 'Cheese', ipa: '/tʃiːz/', vietnamese: 'Phô Mai', category: 'food_drinks', emoji: '🧀', color: '#FACC15', exampleEn: 'Melted cheese stretches on pizza.', exampleVi: 'Phô mai tan chảy kéo sợi thơm béo ngậy.', funFact: 'Phô mai làm từ sữa, chứa cực nhiều canxi giúp xương và răng chắc khỏe.' },
      { id: 'milk', english: 'Milk', ipa: '/mɪlk/', vietnamese: 'Sữa Tươi', category: 'food_drinks', emoji: '🥛', color: '#60A5FA', exampleEn: 'Drink a glass of milk to grow taller.', exampleVi: 'Uống một ly sữa tươi mỗi ngày để bé cao lớn hơn.', funFact: 'Sữa là nguồn dưỡng chất vàng cho sự phát triển chiều cao của trẻ.' },
      { id: 'water', english: 'Water', ipa: '/ˈwɑː.t̬ɚ/', vietnamese: 'Nước Tinh Khiết', category: 'food_drinks', emoji: '💧', color: '#38BDF8', exampleEn: 'Clean water is vital for all life.', exampleVi: 'Nước sạch là cội nguồn của mọi sự sống.', funFact: 'Cơ thể chúng ta có tới 70% là nước, hãy uống đủ nước mỗi ngày nhé.' },
      { id: 'juice', english: 'Juice', ipa: '/dʒuːs/', vietnamese: 'Nước Ép Trái Cây', category: 'food_drinks', emoji: '🧃', color: '#F97316', exampleEn: 'Fresh orange juice is rich in vitamins.', exampleVi: 'Nước cam ép tươi dồi dào vitamin thiên nhiên.', funFact: 'Nước ép trái cây tươi giúp tăng cường hệ miễn dịch cho bé.' },
      { id: 'cake', english: 'Cake', ipa: '/keɪk/', vietnamese: 'Bánh Sinh Nhật / Bánh Ngọt', category: 'food_drinks', emoji: '🎂', color: '#EC4899', exampleEn: 'Blow the candles on your birthday cake.', exampleVi: 'Thổi nến trên chiếc bánh sinh nhật ngọt ngào.', funFact: 'Chiếc bánh sinh nhật mang theo những lời chúc tốt lành tuổi mới.' },
      { id: 'ice_cream', english: 'Ice Cream', ipa: '/ˌaɪs ˈkriːm/', vietnamese: 'Kem Lạnh', category: 'food_drinks', emoji: '🍦', color: '#F472B6', exampleEn: 'Cool sweet ice cream on a sunny day.', exampleVi: 'Cây kem mát lạnh ngọt lành trong ngày hè đầy nắng.', funFact: 'Vị kem vani và sô-cô-la là hai vị kem được yêu thích nhất thế giới.' },
      { id: 'chocolate', english: 'Chocolate', ipa: '/ˈtʃɑːk.lət/', vietnamese: 'Sô-cô-la', category: 'food_drinks', emoji: '🍫', color: '#78350F', exampleEn: 'Sweet dark chocolate melts in your mouth.', exampleVi: 'Thanh sô-cô-la ngọt ngào tan chảy trong miệng.', funFact: 'Sô-cô-la được làm từ hạt cacao trồng ở các vùng nhiệt đới.' },
      { id: 'candy', english: 'Candy', ipa: '/ˈkæn.di/', vietnamese: 'Kẹo Ngọt', category: 'food_drinks', emoji: '🍬', color: '#A855F7', exampleEn: 'Colorful candy wrapped in shiny foil.', exampleVi: 'Những viên kẹo sắc màu bọc giấy bóng lấp lánh.', funFact: 'Ăn kẹo xong nhớ súc miệng hoặc đánh răng để răng không bị sâu nhé!' },
      { id: 'soup', english: 'Soup', ipa: '/suːp/', vietnamese: 'Món Súp / Canh', category: 'food_drinks', emoji: '🍲', color: '#EA580C', exampleEn: 'A warm bowl of chicken soup.', exampleVi: 'Bát súp gà nóng hổi bổ dưỡng.', funFact: 'Súp nóng giúp làm ấm bụng và xua tan mệt mỏi nhanh chóng.' },
      { id: 'meat', english: 'Meat', ipa: '/miːt/', vietnamese: 'Thịt', category: 'food_drinks', emoji: '🥩', color: '#DC2626', exampleEn: 'Grilled meat is juicy and delicious.', exampleVi: 'Món thịt nướng thơm lừng và ngọt thịt.', funFact: 'Thịt cung cấp nhiều sắt và protein giúp bé khỏe mạnh.' },
      { id: 'fish_food', english: 'Fish', ipa: '/fɪʃ/', vietnamese: 'Món Cá', category: 'food_drinks', emoji: '🐟', color: '#0284C7', exampleEn: 'Fish is great food for your brain.', exampleVi: 'Thịt cá là nguồn thực phẩm tuyệt vời cho trí não bé.', funFact: 'Cá chứa nhiều axit béo Omega-3 giúp phát triển trí thông minh.' },
      { id: 'butter', english: 'Butter', ipa: '/ˈbʌt̬.ɚ/', vietnamese: 'Bơ Thực Phẩm', category: 'food_drinks', emoji: '🧈', color: '#FACC15', exampleEn: 'Spread creamy butter on warm toast.', exampleVi: 'Quết bơ béo ngậy lên lát bánh mì nướng thơm giòn.', funFact: 'Bơ được đánh từ kem sữa tươi mang lại mùi thơm ngậy đặc trưng.' },
    ],
  },

  // =========================================================================
  // 10. GIA ĐÌNH YÊU THƯƠNG (14 TỪ)
  // =========================================================================
  {
    id: 'family',
    titleEn: 'Beloved Family',
    titleVi: 'Gia Đình Yêu Thương',
    icon: '👨‍👩‍👧',
    color: '#EC4899',
    cards: [
      { id: 'father', english: 'Father', ipa: '/ˈfɑː.ðɚ/', vietnamese: 'Người Bố (Cha)', category: 'family', emoji: '👨', color: '#2563EB', exampleEn: 'My father is my hero.', exampleVi: 'Bố là người hùng vĩ đại trong lòng bé.', funFact: 'Vòng tay của bố luôn vững chãi và che chở cho cả gia đình.' },
      { id: 'mother', english: 'Mother', ipa: '/ˈmʌð.ɚ/', vietnamese: 'Người Mẹ', category: 'family', emoji: '👩', color: '#EC4899', exampleEn: 'Mother loves me with all her heart.', exampleVi: 'Mẹ yêu thương bé bằng trọn vẹn trái tim.', funFact: 'Mẹ là người luôn chăm sóc từng bữa ăn giấc ngủ ấm áp cho bé.' },
      { id: 'brother', english: 'Brother', ipa: '/ˈbrʌð.ɚ/', vietnamese: 'Anh / Em Trai', category: 'family', emoji: '👦', color: '#3B82F6', exampleEn: 'I play soccer with my brother.', exampleVi: 'Bé chơi đá bóng vui vẻ cùng anh trai.', funFact: 'Anh em trong nhà luôn yêu thương và giúp đỡ lẫn nhau.' },
      { id: 'sister', english: 'Sister', ipa: '/ˈsɪs.tɚ/', vietnamese: 'Chị / Em Gái', category: 'family', emoji: '👧', color: '#F472B6', exampleEn: 'My sister reads a bedtime story for me.', exampleVi: 'Chị gái đọc truyện cổ tích ru bé ngủ.', funFact: 'Chị em gái như những người bạn thân thiết nhất dưới một mái nhà.' },
      { id: 'baby', english: 'Baby', ipa: '/ˈbeɪ.bi/', vietnamese: 'Em Bé', category: 'family', emoji: '👶', color: '#FBBF24', exampleEn: 'The baby has cute chubby cheeks.', exampleVi: 'Em bé có đôi má phúng phính đáng yêu.', funFact: 'Tiếng cười của em bé mang lại niềm vui bất tận cho cả gia đình.' },
      { id: 'grandfather', english: 'Grandfather', ipa: '/ˈɡræn.fɑː.ðɚ/', vietnamese: 'Ông Nội / Ngoại', category: 'family', emoji: '👴', color: '#475569', exampleEn: 'Grandfather tells wise old tales.', exampleVi: 'Ông kể những câu chuyện cổ tích đầy ý nghĩa.', funFact: 'Ông có nụ cười hiền từ và yêu thương con cháu hết mực.' },
      { id: 'grandmother', english: 'Grandmother', ipa: '/ˈɡræn.mʌð.ɚ/', vietnamese: 'Bà Nội / Ngoại', category: 'family', emoji: '👵', color: '#9333EA', exampleEn: 'Grandmother bakes sweet warm cookies.', exampleVi: 'Bà nướng những chiếc bánh quy thơm lừng cho bé.', funFact: 'Bàn tay của bà luôn ấm áp và dịu dàng xoa đầu bé.' },
      { id: 'uncle', english: 'Uncle', ipa: '/ˈʌŋ.kəl/', vietnamese: 'Chú / Bác / Cậu', category: 'family', emoji: '👨‍💼', color: '#0284C7', exampleEn: 'My uncle brought a cool toy for me.', exampleVi: 'Chú mang tặng bé một món đồ chơi rất ngầu.', funFact: 'Các chú bác luôn mang lại tiếng cười sảng khoái trong các bữa tiệc gia đình.' },
      { id: 'aunt', english: 'Aunt', ipa: '/ænt/', vietnamese: 'Cô / Dì / Bác Gái', category: 'family', emoji: '👩‍💼', color: '#DB2777', exampleEn: 'My aunt smiles warmly when we visit.', exampleVi: 'Dì mỉm cười ấm áp khi bé đến thăm nhà.', funFact: 'Các cô dì luôn chuẩn bị những món ăn ngon lành khi con cháu ghé thăm.' },
      { id: 'cousin', english: 'Cousin', ipa: '/ˈkʌz.ən/', vietnamese: 'Anh Chị Em Họ', category: 'family', emoji: '🧑‍🤝‍🧑', color: '#059669', exampleEn: 'Playing hide and seek with my cousin.', exampleVi: 'Chơi trốn tìm cực vui cùng các anh chị em họ.', funFact: 'Những người anh em họ cùng trang lứa là bạn đồng hành tuổi thơ tuyệt vời.' },
      { id: 'family_word', english: 'Family', ipa: '/ˈfæm.əl.i/', vietnamese: 'Gia Đình', category: 'family', emoji: '👨‍👩‍👧‍👦', color: '#E11D48', exampleEn: 'Family is the most precious gift.', exampleVi: 'Gia đình là món quà vô giá nhất của cuộc đời.', funFact: 'Nơi nào có tình yêu thương gắn kết, nơi đó chính là gia đình.' },
      { id: 'parents', english: 'Parents', ipa: '/ˈper.ənts/', vietnamese: 'Bố Mẹ', category: 'family', emoji: '🧑‍🤝‍🧑', color: '#7C3AED', exampleEn: 'Always respect and love your parents.', exampleVi: 'Luôn hiếu thảo và kính yêu cha mẹ.', funFact: 'Bố mẹ luôn hy sinh tất cả để mang lại những điều tốt nhất cho con cái.' },
      { id: 'son', english: 'Son', ipa: '/sʌn/', vietnamese: 'Con Trai', category: 'family', emoji: '👦', color: '#2563EB', exampleEn: 'The brave son helps his dad fix things.', exampleVi: 'Người con trai dũng cảm giúp bố sửa đồ đạc.', funFact: 'Con trai ngoan ngoãn là niềm tự hào của cả gia đình.' },
      { id: 'daughter', english: 'Daughter', ipa: '/ˈdɑː.t̬ɚ/', vietnamese: 'Con Gái', category: 'family', emoji: '👧', color: '#EC4899', exampleEn: 'The sweet daughter helps mom in the kitchen.', exampleVi: 'Người con gái ngoan ngoãn phụ mẹ nấu ăn trong bếp.', funFact: 'Con gái hiếu thảo như một bông hoa xinh đẹp nở giữa mái nhà.' },
    ],
  },

  // =========================================================================
  // 11. NGHỀ NGHIỆP XÃ HỘI (16 TỪ)
  // =========================================================================
  {
    id: 'jobs',
    titleEn: 'Jobs & Occupations',
    titleVi: 'Nghề Nghiệp Xã Hội',
    icon: '👨‍⚕️',
    color: '#059669',
    cards: [
      { id: 'doctor', english: 'Doctor', ipa: '/ˈdɑːk.tɚ/', vietnamese: 'Bác Sĩ', category: 'jobs', emoji: '👨‍⚕️', color: '#0284C7', exampleEn: 'The kind doctor helps sick people get well.', exampleVi: 'Bác sĩ tận tâm chữa bệnh giúp mọi người khỏe mạnh.', funFact: 'Bác sĩ dùng ống nghe để lắng nghe từng nhịp đập của trái tim.' },
      { id: 'nurse', english: 'Nurse', ipa: '/nɝːs/', vietnamese: 'Y Tá', category: 'jobs', emoji: '👩‍⚕️', color: '#10B981', exampleEn: 'The gentle nurse takes care of patients.', exampleVi: 'Cô y tá dịu dàng chăm sóc từng bệnh nhân.', funFact: 'Y tá luôn ân cần đo nhiệt độ và động viên bệnh nhân mau lành bệnh.' },
      { id: 'police', english: 'Police Officer', ipa: '/pəˈliːs ˌɑː.fɪ.sɚ/', vietnamese: 'Cảnh Sát', category: 'jobs', emoji: '👮', color: '#1D4ED8', exampleEn: 'The police officer keeps our neighborhood safe.', exampleVi: 'Chú cảnh sát giữ gìn an ninh trật tự cho khu phố.', funFact: 'Chú cảnh sát luôn sẵn sàng giúp đỡ các bạn nhỏ khi bị lạc đường.' },
      { id: 'firefighter', english: 'Firefighter', ipa: '/ˈfaɪrˌfaɪ.t̬ɚ/', vietnamese: 'Lính Cứu Hỏa', category: 'jobs', emoji: '👨‍🚒', color: '#DC2626', exampleEn: 'The brave firefighter rescues people from fire.', exampleVi: 'Người lính cứu hỏa dũng cảm giải cứu mọi người khỏi đám cháy.', funFact: 'Trang phục của lính cứu hỏa có thể chịu được sức nóng lên đến 1.000 độ C!' },
      { id: 'teacher_job', english: 'Teacher', ipa: '/ˈtiː.tʃɚ/', vietnamese: 'Giáo Viên', category: 'jobs', emoji: '👩‍🏫', color: '#D97706', exampleEn: 'The teacher inspires young minds.', exampleVi: 'Cô giáo truyền cảm hứng và tri thức cho học sinh.', funFact: 'Nghề giáo là nghề cao quý ươm mầm những tài năng tương lai cho đất nước.' },
      { id: 'chef', english: 'Chef', ipa: '/ʃef/', vietnamese: 'Đầu Bếp', category: 'jobs', emoji: '👨‍🍳', color: '#EA580C', exampleEn: 'The chef cooks delicious meals in the restaurant.', exampleVi: 'Đầu bếp nấu những món ăn thơm ngon tuyệt hảo.', funFact: 'Chiếc nón đầu bếp cao to là biểu tượng danh giá của tài năng ẩm thực.' },
      { id: 'pilot', english: 'Pilot', ipa: '/ˈpaɪ.lət/', vietnamese: 'Phi Công', category: 'jobs', emoji: '👨‍✈️', color: '#2563EB', exampleEn: 'The pilot flies the giant airplane safely.', exampleVi: 'Phi công điều khiển máy bay khổng lồ an toàn trên mây.', funFact: 'Phi công phải trải qua hàng ngàn giờ huấn luyện bay nghiêm ngặt.' },
      { id: 'farmer', english: 'Farmer', ipa: '/ˈfɑːr.mɚ/', vietnamese: 'Nông Dân', category: 'jobs', emoji: '👨‍🌾', color: '#15803D', exampleEn: 'The farmer grows fresh vegetables and rice.', exampleVi: 'Bác nông dân trồng lúa và rau củ tươi ngon.', funFact: 'Nhờ có các bác nông dân chăm chỉ mà chúng ta có cơm ăn mỗi ngày.' },
      { id: 'driver', english: 'Driver', ipa: '/ˈdraɪ.vɚ/', vietnamese: 'Tài Xế', category: 'jobs', emoji: '🚗', color: '#475569', exampleEn: 'The bus driver takes us on an exciting trip.', exampleVi: 'Bác tài xế đưa chúng em đi tham quan vui vẻ.', funFact: 'Tài xế luôn tập trung cao độ để giữ an toàn tuyệt đối cho hành khách.' },
      { id: 'builder', english: 'Builder', ipa: '/ˈbɪl.dɚ/', vietnamese: 'Thợ Xây', category: 'jobs', emoji: '👷', color: '#F59E0B', exampleEn: 'Builders build tall skyscrapers and cozy houses.', exampleVi: 'Các chú thợ xây dựng nên những tòa nhà chọc trời và ngôi nhà ấm áp.', funFact: 'Thợ xây luôn đội mũ bảo hộ cứng cáp để bảo vệ đầu.' },
      { id: 'artist', english: 'Artist', ipa: '/ˈɑːr.t̬ɪst/', vietnamese: 'Họa Sĩ', category: 'jobs', emoji: '👨‍🎨', color: '#A855F7', exampleEn: 'The artist paints beautiful colorful pictures.', exampleVi: 'Họa sĩ vẽ nên những bức tranh phong cảnh rực rỡ.', funFact: 'Họa sĩ dùng cọ vẽ và màu sắc để thể hiện cảm xúc và vẻ đẹp cuộc sống.' },
      { id: 'singer', english: 'Singer', ipa: '/ˈsɪŋ.ɚ/', vietnamese: 'Ca Sĩ', category: 'jobs', emoji: '🎤', color: '#EC4899', exampleEn: 'The singer has a sweet melodious voice.', exampleVi: 'Ca sĩ cất lên giọng hát ngọt ngào và du dương.', funFact: 'Âm nhạc và tiếng hát kết nối trái tim của mọi người trên thế giới.' },
      { id: 'astronaut', english: 'Astronaut', ipa: '/ˈæs.trə.nɑːt/', vietnamese: 'Phi Hành Gia', category: 'jobs', emoji: '👨‍🚀', color: '#6366F1', exampleEn: 'The astronaut floats in zero-gravity space.', exampleVi: 'Phi hành gia bay lơ lửng trong không gian vũ trụ.', funFact: 'Bộ đồ phi hành gia cung cấp oxy và bảo vệ cơ thể ngoài vũ trụ bao la.' },
      { id: 'soldier', english: 'Soldier', ipa: '/ˈsoʊl.dʒɚ/', vietnamese: 'Chú Bộ Đội', category: 'jobs', emoji: '🪖', color: '#166534', exampleEn: 'The brave soldier protects our homeland.', exampleVi: 'Chú bộ đội dũng cảm bảo vệ biên cương Tổ quốc.', funFact: 'Các chú bộ đội luôn ngày đêm canh giữ để đất nước được bình yên.' },
      { id: 'dentist', english: 'Dentist', ipa: '/ˈden.tɪst/', vietnamese: 'Nha Sĩ', category: 'jobs', emoji: '🦷', color: '#06B6D4', exampleEn: 'Visit the dentist for healthy shiny teeth.', exampleVi: 'Khám nha sĩ định kỳ để có hàm răng trắng khỏe.', funFact: 'Nha sĩ giúp nhổ bỏ răng sâu và làm sạch răng miệng rất nhẹ nhàng.' },
      { id: 'scientist', english: 'Scientist', ipa: '/ˈsaɪən.tɪst/', vietnamese: 'Nhà Khoa Học', category: 'jobs', emoji: '🔬', color: '#8B5CF6', exampleEn: 'The scientist discovers new inventions.', exampleVi: 'Nhà khoa học nghiên cứu những phát minh mới cho nhân loại.', funFact: 'Các nhà khoa học dùng kính hiển vi để khám phá thế giới vi mô kỳ diệu.' },
    ],
  },

  // =========================================================================
  // 12. CẢM XÚC & TRẠNG THÁI (15 TỪ)
  // =========================================================================
  {
    id: 'emotions',
    titleEn: 'Emotions & Feelings',
    titleVi: 'Cảm Xúc & Trạng Thái',
    icon: '😃',
    color: '#F43F5E',
    cards: [
      { id: 'happy', english: 'Happy', ipa: '/ˈhæp.i/', vietnamese: 'Vui Vẻ', category: 'emotions', emoji: '😄', color: '#EAB308', exampleEn: 'I feel so happy playing with my friends.', exampleVi: 'Bé cảm thấy thật vui vẻ khi chơi cùng bạn bè.', funFact: 'Nụ cười tươi kích hoạt hoóc-môn hạnh phúc giúp cơ thể khỏe khoắn hơn.' },
      { id: 'sad', english: 'Sad', ipa: '/sæd/', vietnamese: 'Buồn Bã', category: 'emotions', emoji: '😢', color: '#3B82F6', exampleEn: 'A warm hug can cheer up a sad friend.', exampleVi: 'Một cái ôm ấm áp sẽ an ủi người bạn đang buồn.', funFact: 'Buồn bã là cảm xúc tự nhiên, sau cơn mưa trời lại sáng bé nhé!' },
      { id: 'angry', english: 'Angry', ipa: '/ˈæŋ.ɡri/', vietnamese: 'Tức Giận', category: 'emotions', emoji: '😡', color: '#EF4444', exampleEn: 'Take deep breaths when you feel angry.', exampleVi: 'Hít thở thật sâu khi cảm thấy tức giận.', funFact: 'Đếm từ 1 đến 10 giúp cơn tức giận tan biến nhanh chóng.' },
      { id: 'scared', english: 'Scared', ipa: '/skerd/', vietnamese: 'Sợ Hãi', category: 'emotions', emoji: '😨', color: '#6366F1', exampleEn: 'Hold mommy’s hand when you feel scared.', exampleVi: 'Nắm chặt tay mẹ khi bé cảm thấy sợ hãi.', funFact: 'Sợ hãi giúp cơ thể tự động cảnh giác trước nguy hiểm.' },
      { id: 'surprised', english: 'Surprised', ipa: '/sɚˈpraɪzd/', vietnamese: 'Ngạc Nhiên', category: 'emotions', emoji: '😲', color: '#F97316', exampleEn: 'Surprised by a wonderful birthday gift.', exampleVi: 'Bất ngờ và ngạc nhiên trước món quà sinh nhật tuyệt vời.', funFact: 'Khi ngạc nhiên, mắt và miệng chúng ta tự nhiên mở to hơn!' },
      { id: 'sleepy', english: 'Sleepy', ipa: '/ˈsliː.pi/', vietnamese: 'Buồn Ngủ', category: 'emotions', emoji: '🥱', color: '#8B5CF6', exampleEn: 'A big yawn means it is time for bed.', exampleVi: 'Một cái ngáp to báo hiệu đã đến giờ đi ngủ rồi.', funFact: 'Ngáp ngủ giúp cung cấp thêm oxy lên não bộ khi mệt mỏi.' },
      { id: 'tired', english: 'Tired', ipa: '/taɪərd/', vietnamese: 'Mệt Mỏi', category: 'emotions', emoji: '😫', color: '#64748B', exampleEn: 'Drink water and rest when you are tired.', exampleVi: 'Uống nước và nghỉ ngơi khi cảm thấy mệt mỏi.', funFact: 'Nghỉ ngơi 15 phút giúp cơ thể nạp lại đầy ắp năng lượng.' },
      { id: 'hungry', english: 'Hungry', ipa: '/ˈhʌŋ.ɡri/', vietnamese: 'Đói Bụng', category: 'emotions', emoji: '😋', color: '#EA580C', exampleEn: 'My tummy rumbles when I am hungry.', exampleVi: 'Bụng bé réo cồn cào khi bị đói.', funFact: 'Đói là tín hiệu báo cơ thể đang cần nạp thêm năng lượng thức ăn.' },
      { id: 'thirsty', english: 'Thirsty', ipa: '/ˈθɝː.sti/', vietnamese: 'Khát Nước', category: 'emotions', emoji: '🥤', color: '#06B6D4', exampleEn: 'Drink fresh water when you feel thirsty.', exampleVi: 'Uống nước mát khi cảm thấy khát.', funFact: 'Uống nước từng ngụm nhỏ giúp cơ thể hấp thụ nước tốt nhất.' },
      { id: 'excited', english: 'Excited', ipa: '/ɪkˈsaɪ.t̬ɪd/', vietnamese: 'Hào Hứng', category: 'emotions', emoji: '🤩', color: '#EC4899', exampleEn: 'Excited about the weekend zoo trip.', exampleVi: 'Hào hứng và phấn khởi với chuyến đi chơi sở thú cuối tuần.', funFact: 'Sự hào hứng giúp chúng ta học hỏi và khám phá mọi thứ nhanh hơn.' },
      { id: 'brave', english: 'Brave', ipa: '/breɪv/', vietnamese: 'Dũng Cảm', category: 'emotions', emoji: '🦁', color: '#D97706', exampleEn: 'The brave little knight explores the cave.', exampleVi: 'Hiệp sĩ nhỏ dũng cảm khám phá hang động.', funFact: 'Dũng cảm không phải là không sợ, mà là dám đối mặt và vượt qua nỗi sợ.' },
      { id: 'shy', english: 'Shy', ipa: '/ʃaɪ/', vietnamese: 'Rụt Rè', category: 'emotions', emoji: '🙈', color: '#FB7185', exampleEn: 'The shy puppy hides behind its mom.', exampleVi: 'Chú cún con bẽn lẽn trốn sau lưng mẹ.', funFact: 'Nụ cười thân thiện sẽ giúp các bạn nhỏ bớt rụt rè hơn.' },
      { id: 'proud', english: 'Proud', ipa: '/praʊd/', vietnamese: 'Tự Hào', category: 'emotions', emoji: '🦚', color: '#059669', exampleEn: 'Mom is proud of your high score.', exampleVi: 'Mẹ rất tự hào về điểm số tốt của bé.', funFact: 'Cố gắng hết sức mình luôn là điều đáng tự hào nhất.' },
      { id: 'calm', english: 'Calm', ipa: '/kɑːm/', vietnamese: 'Bình Tĩnh', category: 'emotions', emoji: '🧘', color: '#0284C7', exampleEn: 'Stay calm and think of a solution.', exampleVi: 'Giữ bình tĩnh và suy nghĩ cách giải quyết.', funFact: 'Tâm trí bình tĩnh giúp đưa ra những quyết định sáng suốt nhất.' },
      { id: 'strong', english: 'Strong', ipa: '/strɑːŋ/', vietnamese: 'Khỏe Mạnh', category: 'emotions', emoji: '💪', color: '#16A34A', exampleEn: 'Eat well and exercise to be strong.', exampleVi: 'Ăn uống đủ chất và tập thể dục để luôn khỏe mạnh.', funFact: 'Tập luyện thể thao đều đặn giúp tăng cường sức đề kháng và thể lực.' },
    ],
  },

  // =========================================================================
  // 13. HÀNH ĐỘNG HÀNG NGÀY (18 TỪ)
  // =========================================================================
  {
    id: 'actions',
    titleEn: 'Daily Actions & Verbs',
    titleVi: 'Hành Động Hàng Ngày',
    icon: '🏃',
    color: '#0284C7',
    cards: [
      { id: 'run', english: 'Run', ipa: '/rʌn/', vietnamese: 'Chạy Bộ', category: 'actions', emoji: '🏃', color: '#EF4444', exampleEn: 'Run fast on the green grass.', exampleVi: 'Chạy thật nhanh trên bãi cỏ xanh mướt.', funFact: 'Chạy bộ giúp tim bơm máu tốt hơn và đôi chân dẻo dai.' },
      { id: 'walk', english: 'Walk', ipa: '/wɑːk/', vietnamese: 'Đi Bộ', category: 'actions', emoji: '🚶', color: '#3B82F6', exampleEn: 'Walk slowly in the flower garden.', exampleVi: 'Đi bộ thong thả trong vườn hoa ngát hương.', funFact: 'Đi bộ 10.000 bước mỗi ngày là bài tập thể dục tuyệt vời cho mọi lứa tuổi.' },
      { id: 'jump', english: 'Jump', ipa: '/dʒʌmp/', vietnamese: 'Nhảy Lên', category: 'actions', emoji: '🦘', color: '#F59E0B', exampleEn: 'Jump high into the air.', exampleVi: 'Bật nhảy thật cao lên không trung.', funFact: 'Nhảy dây giúp phát triển chiều cao và sự nhanh nhẹn.' },
      { id: 'swim', english: 'Swim', ipa: '/swɪm/', vietnamese: 'Bơi Lội', category: 'actions', emoji: '🏊', color: '#06B6D4', exampleEn: 'Swim like a little fish in cool water.', exampleVi: 'Bơi lội như chú cá nhỏ trong dòng nước mát.', funFact: 'Bơi lội là môn thể thao vận động toàn diện tất cả các cơ bắp.' },
      { id: 'read', english: 'Read', ipa: '/riːd/', vietnamese: 'Đọc Sách', category: 'actions', emoji: '📖', color: '#8B5CF6', exampleEn: 'Read a wonderful fairy tale book.', exampleVi: 'Đọc một cuốn sách truyện cổ tích kỳ diệu.', funFact: 'Đọc sách giúp trí tưởng tượng của bé bay cao bay xa.' },
      { id: 'write', english: 'Write', ipa: '/raɪt/', vietnamese: 'Viết Chữ', category: 'actions', emoji: '✍️', color: '#D97706', exampleEn: 'Write your daily learning diary.', exampleVi: 'Viết nhật ký học tập mỗi ngày.', funFact: 'Viết tay giúp não bộ ghi nhớ kiến thức sâu sắc hơn gõ phím.' },
      { id: 'sing', english: 'Sing', ipa: '/sɪŋ/', vietnamese: 'Ca Hát', category: 'actions', emoji: '🎤', color: '#EC4899', exampleEn: 'Sing a cheerful song for the family.', exampleVi: 'Hát vang bài ca vui nhộn tặng cả nhà.', funFact: 'Ca hát giúp giải tỏa căng thẳng và mang lại tinh thần phấn chấn.' },
      { id: 'dance', english: 'Dance', ipa: '/dæns/', vietnamese: 'Nhảy Múa', category: 'actions', emoji: '💃', color: '#F43F5E', exampleEn: 'Dance to the joyful rhythm of music.', exampleVi: 'Nhảy múa theo điệu nhạc rộn rã tươi vui.', funFact: 'Nhảy múa rèn luyện nhịp điệu và sự dẻo dai uyển chuyển.' },
      { id: 'eat', english: 'Eat', ipa: '/iːt/', vietnamese: 'Ăn Uống', category: 'actions', emoji: '🍽️', color: '#EA580C', exampleEn: 'Eat nutritious food to grow strong.', exampleVi: 'Ăn thức ăn đủ chất dinh dưỡng để mau lớn.', funFact: 'Nhai kỹ no lâu, ăn chậm nhai kỹ giúp tiêu hóa tốt.' },
      { id: 'drink', english: 'Drink', ipa: '/drɪŋk/', vietnamese: 'Uống Nước', category: 'actions', emoji: '🥛', color: '#38BDF8', exampleEn: 'Drink warm milk before bedtime.', exampleVi: 'Uống một ly sữa ấm trước khi đi ngủ.', funFact: 'Uống nước đầy đủ giúp cơ thể luôn thanh lọc và tỉnh táo.' },
      { id: 'sleep', english: 'Sleep', ipa: '/sliːp/', vietnamese: 'Ngủ Say', category: 'actions', emoji: '😴', color: '#475569', exampleEn: 'Sleep early and wake up fresh.', exampleVi: 'Ngủ sớm và thức dậy với tinh thần sảng khoái.', funFact: 'Trong lúc bé ngủ say, cơ thể tiết ra hoóc-môn giúp xương dài ra.' },
      { id: 'play', english: 'Play', ipa: '/pleɪ/', vietnamese: 'Chơi Đùa', category: 'actions', emoji: '🧸', color: '#10B981', exampleEn: 'Play nicely and share toys with friends.', exampleVi: 'Chơi hòa đồng và chia sẻ đồ chơi cùng bạn.', funFact: 'Vui chơi là cách tự nhiên nhất để trẻ em khám phá thế giới.' },
      { id: 'draw', english: 'Draw', ipa: '/drɑː/', vietnamese: 'Vẽ Tranh', category: 'actions', emoji: '🎨', color: '#A855F7', exampleEn: 'Draw a colorful rainbow in the sky.', exampleVi: 'Vẽ cầu vồng rực rỡ sắc màu trên bầu trời.', funFact: 'Vẽ tranh giúp phát triển tư duy hình ảnh và khiếu thẩm mỹ.' },
      { id: 'smile', english: 'Smile', ipa: '/smaɪl/', vietnamese: 'Mỉm Cười', category: 'actions', emoji: '😊', color: '#EAB308', exampleEn: 'A warm smile makes everyone happy.', exampleVi: 'Một nụ cười ấm áp khiến mọi người đều vui lây.', funFact: 'Một nụ cười bằng mười thang thuốc bổ!' },
      { id: 'cry', english: 'Cry', ipa: '/kraɪ/', vietnamese: 'Khóc Nhè', category: 'actions', emoji: '😭', color: '#60A5FA', exampleEn: 'Do not cry, everything will be okay.', exampleVi: 'Đừng khóc nữa bé nhé, mọi chuyện sẽ ổn thôi.', funFact: 'Nước mắt giúp làm sạch và bôi trơn bảo vệ giác mạc mắt.' },
      { id: 'listen', english: 'Listen', ipa: '/ˈlɪs.ən/', vietnamese: 'Lắng Nghe', category: 'actions', emoji: '🎧', color: '#14B8A6', exampleEn: 'Listen carefully to teacher’s instructions.', exampleVi: 'Lắng nghe thật kỹ lời thầy cô hướng dẫn.', funFact: 'Lắng nghe chăm chú là bí quyết quan trọng nhất để học giỏi.' },
      { id: 'speak', english: 'Speak', ipa: '/spiːk/', vietnamese: 'Nói Chuyện', category: 'actions', emoji: '🗣️', color: '#6366F1', exampleEn: 'Speak English confidently every day.', exampleVi: 'Tự tin nói tiếng Anh mỗi ngày bé nhé.', funFact: 'Nói to rõ ràng giúp giọng nói truyền cảm và tự tin hơn.' },
      { id: 'cook', english: 'Cook', ipa: '/kʊk/', vietnamese: 'Nấu Ăn', category: 'actions', emoji: '🍳', color: '#F97316', exampleEn: 'Help mom cook delicious dishes.', exampleVi: 'Giúp mẹ nấu những món ăn thơm ngon.', funFact: 'Nấu ăn là sự kết hợp thú vị giữa khoa học và nghệ thuật.' },
    ],
  },

  // =========================================================================
  // 14. VŨ TRỤ & THIÊN NHIÊN (16 TỪ)
  // =========================================================================
  {
    id: 'nature_space',
    titleEn: 'Space & Nature',
    titleVi: 'Vũ Trụ & Thiên Nhiên',
    icon: '🪐',
    color: '#6366F1',
    cards: [
      { id: 'sun', english: 'Sun', ipa: '/sʌn/', vietnamese: 'Mặt Trời', category: 'nature_space', emoji: '☀️', color: '#F59E0B', exampleEn: 'The sun gives light and warmth to Earth.', exampleVi: 'Mặt trời ban tặng ánh sáng và hơi ấm cho Trái Đất.', funFact: 'Mặt trời to lớn đến mức có thể chứa được 1,3 triệu Trái Đất bên trong!' },
      { id: 'moon', english: 'Moon', ipa: '/muːn/', vietnamese: 'Mặt Trăng', category: 'nature_space', emoji: '🌙', color: '#FACC15', exampleEn: 'The crescent moon shines softly at night.', exampleVi: 'Mặt trăng khuyết tỏa ánh sáng dịu êm trong đêm.', funFact: 'Mặt trăng không tự phát sáng mà phản chiếu ánh sáng từ Mặt trời.' },
      { id: 'star', english: 'Star', ipa: '/stɑːr/', vietnamese: 'Ngôi Sao', category: 'nature_space', emoji: '✨', color: '#EAB308', exampleEn: 'Countless stars twinkle in the night sky.', exampleVi: 'Muôn vàn vì sao lấp lánh trên nền trời đêm.', funFact: 'Có nhiều ngôi sao trong vũ trụ hơn cả số hạt cát trên tất cả bãi biển Trái Đất!' },
      { id: 'earth', english: 'Earth', ipa: '/ɝːθ/', vietnamese: 'Trái Đất', category: 'nature_space', emoji: '🌍', color: '#10B981', exampleEn: 'Earth is our beautiful green home.', exampleVi: 'Trái Đất là ngôi nhà chung xanh tươi của muôn loài.', funFact: 'Trái Đất là hành tinh duy nhất trong Hệ Mặt Trời có nước lỏng và sự sống.' },
      { id: 'planet', english: 'Planet', ipa: '/ˈplæn.ɪt/', vietnamese: 'Hành Tinh', category: 'nature_space', emoji: '🪐', color: '#8B5CF6', exampleEn: 'Saturn is a planet with giant rings.', exampleVi: 'Sao Thổ là hành tinh có những vành đai khổng lồ bao quanh.', funFact: 'Hệ Mặt Trời của chúng ta có 8 hành tinh quay quanh Mặt trời.' },
      { id: 'sky', english: 'Sky', ipa: '/skaɪ/', vietnamese: 'Bầu Trời', category: 'nature_space', emoji: '🌤️', color: '#38BDF8', exampleEn: 'The blue sky is clear and wide.', exampleVi: 'Bầu trời xanh trong vắt và rộng thênh thang.', funFact: 'Bầu trời có màu xanh do hiện tượng tán xạ ánh sáng của bầu khí quyển.' },
      { id: 'cloud', english: 'Cloud', ipa: '/klaʊd/', vietnamese: 'Đám Mây', category: 'nature_space', emoji: '☁️', color: '#94A3B8', exampleEn: 'Fluffy white clouds float like cotton.', exampleVi: 'Những đám mây trắng bồng bềnh trôi như kẹo bông.', funFact: 'Một đám mây bồng bềnh có thể nặng tới 500 tấn hơi nước!' },
      { id: 'rain', english: 'Rain', ipa: '/reɪn/', vietnamese: 'Cơn Mưa', category: 'nature_space', emoji: '🌧️', color: '#0284C7', exampleEn: 'Raindrops nourish the thirsty flowers.', exampleVi: 'Những giọt mưa tưới mát cho muôn hoa đang khát.', funFact: 'Cơn mưa mang lại nguồn nước ngọt quý báu cho cây cối đâm chồi nảy lộc.' },
      { id: 'rainbow', english: 'Rainbow', ipa: '/ˈreɪn.boʊ/', vietnamese: 'Cầu Vồng', category: 'nature_space', emoji: '🌈', color: '#EC4899', exampleEn: 'A magical seven-colored rainbow appears after the rain.', exampleVi: 'Cầu vồng bảy sắc rực rỡ xuất hiện sau cơn mưa.', funFact: 'Cầu vồng gồm 7 sắc màu cơ bản: Đỏ, Cam, Vàng, Lục, Lam, Chàm, Tím.' },
      { id: 'wind', english: 'Wind', ipa: '/wɪnd/', vietnamese: 'Cơn Gió', category: 'nature_space', emoji: '💨', color: '#64748B', exampleEn: 'Cool breeze whispers through green leaves.', exampleVi: 'Làn gió mát thì thầm qua kẽ lá xanh.', funFact: 'Gió là sự chuyển động của không khí từ nơi áp cao về nơi áp thấp.' },
      { id: 'mountain', english: 'Mountain', ipa: '/ˈmaʊn.tən/', vietnamese: 'Ngọn Núi', category: 'nature_space', emoji: '⛰️', color: '#475569', exampleEn: 'The tall mountain touches the clouds.', exampleVi: 'Ngọn núi sừng sững cao chạm tới tầng mây.', funFact: 'Đỉnh núi Everest là đỉnh núi cao nhất thế giới với độ cao 8.848 mét.' },
      { id: 'river', english: 'River', ipa: '/ˈrɪv.ɚ/', vietnamese: 'Dòng Sông', category: 'nature_space', emoji: '🌊', color: '#0284C7', exampleEn: 'The peaceful river flows gently into the sea.', exampleVi: 'Dòng sông êm đềm chảy xuôi ra biển lớn.', funFact: 'Sông Mê Kông chảy qua Việt Nam bồi đắp phù sa màu mỡ cho đồng bằng.' },
      { id: 'sea', english: 'Sea', ipa: '/siː/', vietnamese: 'Biển Cả', category: 'nature_space', emoji: '🌊', color: '#1E40AF', exampleEn: 'Listen to the sound of ocean waves.', exampleVi: 'Lắng nghe tiếng sóng biển rì rào vỗ bờ.', funFact: 'Đại dương bao phủ hơn 70% bề mặt Trái Đất chúng ta.' },
      { id: 'forest', english: 'Forest', ipa: '/ˈfɔːr.ɪst/', vietnamese: 'Khu Rừng', category: 'nature_space', emoji: '🌲', color: '#166534', exampleEn: 'Birds sing happily in the green forest.', exampleVi: 'Chim hót líu lo trong khu rừng xanh ngát.', funFact: 'Rừng rậm được ví như lá phổi xanh khổng lồ cung cấp oxy cho Trái Đất.' },
      { id: 'tree', english: 'Tree', ipa: '/triː/', vietnamese: 'Cây Xanh', category: 'nature_space', emoji: '🌳', color: '#15803D', exampleEn: 'The big shady tree provides cool shade.', exampleVi: 'Cây bóng mát tỏa bóng râm che chở mọi người.', funFact: 'Có những cây cổ thụ có thể sống lâu hơn 4.000 năm tuổi!' },
      { id: 'flower', english: 'Flower', ipa: '/ˈflaʊ.ɚ/', vietnamese: 'Bông Hoa', category: 'nature_space', emoji: '🌸', color: '#F43F5E', exampleEn: 'Colorful flowers bloom in spring.', exampleVi: 'Muôn hoa khoe sắc rực rỡ khi mùa xuân về.', funFact: 'Hoa tỏa hương thơm ngát để thu hút ong bướm đến thụ phấn.' },
    ],
  },

  // =========================================================================
  // 15. CÔN TRÙNG KỲ THÚ (14 TỪ)
  // =========================================================================
  {
    id: 'insects',
    titleEn: 'Insects & Bugs',
    titleVi: 'Côn Trùng Kỳ Thú',
    icon: '🐛',
    color: '#10B981',
    cards: [
      { id: 'butterfly', english: 'Butterfly', ipa: '/ˈbʌt̬.ɚ.flaɪ/', vietnamese: 'Bươm Bướm', category: 'insects', emoji: '🦋', color: '#A855F7', exampleEn: 'The butterfly has colorful wings.', exampleVi: 'Chú bươm bướm có đôi cánh rực rỡ sắc màu.', funFact: 'Bươm bướm nếm vị thức ăn bằng chính đôi chân nhỏ của mình!' },
      { id: 'bee', english: 'Bee', ipa: '/biː/', vietnamese: 'Con Ong', category: 'insects', emoji: '🐝', color: '#EAB308', exampleEn: 'The busy bee makes sweet honey.', exampleVi: 'Chú ong chăm chỉ làm ra mật ngọt thơm lừng.', funFact: 'Để làm ra 1 thìa mật ong, cả đàn ong phải bay hàng ngàn dặm hút nhụy hoa.' },
      { id: 'ant', english: 'Ant', ipa: '/ænt/', vietnamese: 'Con Kiến', category: 'insects', emoji: '🐜', color: '#78350F', exampleEn: 'Ants work together as a great team.', exampleVi: 'Loài kiến làm việc cùng nhau rất đoàn kết.', funFact: 'Một chú kiến nhỏ có thể nâng vật nặng gấp 50 lần trọng lượng cơ thể!' },
      { id: 'ladybug', english: 'Ladybug', ipa: '/ˈleɪ.di.bʌɡ/', vietnamese: 'Bọ Rùa', category: 'insects', emoji: '🐞', color: '#DC2626', exampleEn: 'The red ladybug has tiny black dots.', exampleVi: 'Chú bọ rùa đỏ có những chấm đen tròn xinh xắn.', funFact: 'Bọ rùa là người bạn tốt của nhà nông vì chuyên ăn sâu bọ hại cây.' },
      { id: 'dragonfly', english: 'Dragonfly', ipa: '/ˈdræɡ.ən.flaɪ/', vietnamese: 'Chuồn Chuồn', category: 'insects', emoji: '🦗', color: '#06B6D4', exampleEn: 'The dragonfly hovers over the pond.', exampleVi: 'Chú chuồn chuồn bay lượn trên mặt hồ nước.', funFact: 'Chuồn chuồn có thể bay lùi và bay với tốc độ hơn 50 km/h!' },
      { id: 'grasshopper', english: 'Grasshopper', ipa: '/ˈɡræsˌhɑː.pɚ/', vietnamese: 'Châu Chấu', category: 'insects', emoji: '🦗', color: '#16A34A', exampleEn: 'The green grasshopper jumps far in the grass.', exampleVi: 'Chú châu chấu xanh nhảy thoăn thoắt trong bãi cỏ.', funFact: 'Châu chấu có cơ quan thính giác nằm ngay ở bụng!' },
      { id: 'beetle', english: 'Beetle', ipa: '/ˈbiː.t̬əl/', vietnamese: 'Bọ Cánh Cứng', category: 'insects', emoji: '🪲', color: '#15803D', exampleEn: 'The beetle has a shiny hard shell.', exampleVi: 'Bọ cánh cứng có lớp vỏ bọc sáng bóng và cứng cáp.', funFact: 'Bọ cánh cứng là nhóm sinh vật đông đảo nhất trên hành tinh.' },
      { id: 'spider', english: 'Spider', ipa: '/ˈspaɪ.dɚ/', vietnamese: 'Con Nhện', category: 'insects', emoji: '🕷️', color: '#1E293B', exampleEn: 'The spider spins a silk web.', exampleVi: 'Chú nhện giăng tơ dệt nên chiếc mạng tơ tuyệt đẹp.', funFact: 'Tơ nhện dẻo dai hơn cả sợi thép có cùng kích thước!' },
      { id: 'snail', english: 'Snail', ipa: '/sneɪl/', vietnamese: 'Ốc Sên', category: 'insects', emoji: '🐌', color: '#B45309', exampleEn: 'The snail carries its house on its back.', exampleVi: 'Ốc sên mang ngôi nhà vỏ ốc trên lưng.', funFact: 'Ốc sên di chuyển chậm rãi nhưng có thể ngủ liên tục tới 3 năm!' },
      { id: 'caterpillar', english: 'Caterpillar', ipa: '/ˈkæt̬.ɚˌpɪl.ɚ/', vietnamese: 'Sâu Bướm', category: 'insects', emoji: '🐛', color: '#84CC16', exampleEn: 'The green caterpillar turns into a butterfly.', exampleVi: 'Chú sâu bướm xanh sẽ hóa thành cánh bướm rực rỡ.', funFact: 'Sâu bướm ăn lá non liên tục để chuẩn bị cho quá trình biến hình diệu kỳ.' },
      { id: 'worm', english: 'Worm', ipa: '/wɝːm/', vietnamese: 'Giun Đất', category: 'insects', emoji: '🪱', color: '#FB7185', exampleEn: 'Earthworms make the soil rich and fertile.', exampleVi: 'Giun đất làm cho đất đai tơi xốp và màu mỡ.', funFact: 'Giun đất thở trực tiếp qua lớp da ẩm ướt của mình.' },
      { id: 'mosquito', english: 'Mosquito', ipa: '/məˈskiː.toʊ/', vietnamese: 'Con Muỗi', category: 'insects', emoji: '🦟', color: '#64748B', exampleEn: 'Sleep under a net to avoid mosquitoes.', exampleVi: 'Ngủ trong màn để tránh bị muỗi đốt nhé.', funFact: 'Chỉ có muỗi cái mới hút máu để nuôi trứng.' },
      { id: 'fly', english: 'Fly', ipa: '/flaɪ/', vietnamese: 'Con Ruồi', category: 'insects', emoji: '🪰', color: '#334155', exampleEn: 'Cover food so flies cannot land on it.', exampleVi: 'Đậy lồng bàn thức ăn cẩn thận để ruồi không đậu vào.', funFact: 'Mắt ruồi gồm hàng ngàn thấu kính nhỏ giúp quan sát 360 độ.' },
      { id: 'cricket', english: 'Cricket', ipa: '/ˈkrɪk.ɪt/', vietnamese: 'Con Dế Mèn', category: 'insects', emoji: '🦗', color: '#92400E', exampleEn: 'The cricket chirps merrily in the evening.', exampleVi: 'Chú dế mèn gáy vang rộn rã trong đêm thanh vắng.', funFact: 'Dế mèn phát ra tiếng gáy bằng cách cọ xát hai cánh vào nhau.' },
    ],
  },

  // =========================================================================
  // 16. ĐỒ CHƠI & TRÒ CHƠI (18 TỪ)
  // =========================================================================
  {
    id: 'toys_games',
    titleEn: 'Toys & Games',
    titleVi: 'Đồ Chơi & Trò Chơi',
    icon: '🧸',
    color: '#F43F5E',
    cards: [
      { id: 'doll', english: 'Doll', ipa: '/dɑːl/', vietnamese: 'Búp Bê', category: 'toys_games', emoji: '🪆', color: '#EC4899', exampleEn: 'The little girl brushes her doll’s hair.', exampleVi: 'Bé gái chải tóc cho búp bê xinh xắn.', funFact: 'Búp bê là món đồ chơi cổ xưa nhất trong lịch sử loài người!' },
      { id: 'robot', english: 'Robot', ipa: '/ˈroʊ.bɑːt/', vietnamese: 'Người Máy', category: 'toys_games', emoji: '🤖', color: '#3B82F6', exampleEn: 'The toy robot walks and flashes lights.', exampleVi: 'Chú người máy đồ chơi vừa đi vừa nháy đèn.', funFact: 'Robot thông minh có thể giúp con người khám phá sao Hỏa xa xôi.' },
      { id: 'teddy_bear', english: 'Teddy Bear', ipa: '/ˈted.i ˌber/', vietnamese: 'Gấu Bông', category: 'toys_games', emoji: '🧸', color: '#B45309', exampleEn: 'Hug your soft teddy bear to sleep.', exampleVi: 'Ôm chú gấu bông mềm mại đi ngủ.', funFact: 'Gấu bông Teddy được đặt tên theo một vị Tổng thống Mỹ yêu động vật.' },
      { id: 'kite', english: 'Kite', ipa: '/kaɪt/', vietnamese: 'Con Diều', category: 'toys_games', emoji: '🪁', color: '#10B981', exampleEn: 'Fly a colorful kite on a windy afternoon.', exampleVi: 'Thả cánh diều rực rỡ trong buổi chiều lộng gió.', funFact: 'Những cánh diều đầu tiên được làm từ tre và lụa cách đây 2.800 năm.' },
      { id: 'ball', english: 'Ball', ipa: '/bɑːl/', vietnamese: 'Quả Bóng', category: 'toys_games', emoji: '⚽', color: '#1E293B', exampleEn: 'Kick the soccer ball into the goal.', exampleVi: 'Sút quả bóng tròn bay thẳng vào khung thành.', funFact: 'Chơi bóng giúp rèn luyện phản xạ nhanh nhẹn và tinh thần đồng đội.' },
      { id: 'puzzle_toy', english: 'Puzzle', ipa: '/ˈpʌz.əl/', vietnamese: 'Tranh Ghép Hình', category: 'toys_games', emoji: '🧩', color: '#8B5CF6', exampleEn: 'Solve the colorful jigsaw puzzle.', exampleVi: 'Hoàn thành bức tranh ghép hình nhiều mảnh sinh động.', funFact: 'Ghép hình giúp rèn luyện trí nhớ và khả năng quan sát không gian.' },
      { id: 'lego', english: 'Building Blocks', ipa: '/ˈbɪl.dɪŋ ˌblɑːks/', vietnamese: 'Khối Xếp Hình (Lego)', category: 'toys_games', emoji: '🧱', color: '#EF4444', exampleEn: 'Build a tall castle with building blocks.', exampleVi: 'Xây tòa lâu đài cao lớn bằng các khối xếp hình.', funFact: 'Có hàng triệu cách kết hợp chỉ từ 6 viên gạch xếp hình nhỏ!' },
      { id: 'balloon', english: 'Balloon', ipa: '/bəˈluːn/', vietnamese: 'Bóng Bay', category: 'toys_games', emoji: '🎈', color: '#F43F5E', exampleEn: 'A red balloon floats up into the sky.', exampleVi: 'Quả bóng bay đỏ bay bổng lên nền trời.', funFact: 'Bóng bay bơm khí Heli có thể bay lơ lửng vì nhẹ hơn không khí.' },
      { id: 'yoyo', english: 'Yo-yo', ipa: '/ˈjoʊ.joʊ/', vietnamese: 'Con Quay Yo-yo', category: 'toys_games', emoji: '🪀', color: '#059669', exampleEn: 'Spin the green yo-yo up and down.', exampleVi: 'Kéo thả con quay yo-yo lên xuống thoăn thoắt.', funFact: 'Yo-yo là món đồ chơi phổ biến thứ hai thế giới sau búp bê.' },
      { id: 'toy_car', english: 'Toy Car', ipa: '/tɔɪ kɑːr/', vietnamese: 'Xe Ô Tô Đồ Chơi', category: 'toys_games', emoji: '🏎️', color: '#EA580C', exampleEn: 'Race the toy car across the living room.', exampleVi: 'Đua xe ô tô đồ chơi chạy khắp phòng khách.', funFact: 'Xe đồ chơi chạy cót chuyển hóa thế năng thành động năng kỳ diệu.' },
      { id: 'board_game', english: 'Board Game', ipa: '/ˈbɔːrd ˌɡeɪm/', vietnamese: 'Cờ Bàn Trò Chơi', category: 'toys_games', emoji: '🎲', color: '#D97706', exampleEn: 'Play a fun board game with the whole family.', exampleVi: 'Chơi trò chơi cờ bàn vui nhộn cùng cả gia đình.', funFact: 'Chơi cờ bàn giúp bé học cách lập chiến lược và tuân thủ luật chơi.' },
      { id: 'spinning_top', english: 'Spinning Top', ipa: '/ˈspɪn.ɪŋ ˌtɑːp/', vietnamese: 'Con Quay', category: 'toys_games', emoji: '🪅', color: '#CA8A04', exampleEn: 'The wooden top spins super fast.', exampleVi: 'Con quay gỗ quay tít mù trên mặt đất.', funFact: 'Con quay giữ thăng bằng nhờ định luật bảo toàn mô-men động lượng.' },
      { id: 'water_gun', english: 'Water Gun', ipa: '/ˈwɑː.t̬ɚ ˌɡʌn/', vietnamese: 'Súng Phun Nước', category: 'toys_games', emoji: '🔫', color: '#06B6D4', exampleEn: 'Squirt water on a sunny pool day.', exampleVi: 'Phun nước mát rượi trong ngày hè ở hồ bơi.', funFact: 'Trò chơi bắn súng nước mang lại tiếng cười sảng khoái mùa hè.' },
      { id: 'playdough', english: 'Playdough', ipa: '/ˈpleɪ.doʊ/', vietnamese: 'Đất Nặn Sắc Màu', category: 'toys_games', emoji: '🎨', color: '#A855F7', exampleEn: 'Mold colorful animals from playdough.', exampleVi: 'Nặn những con vật đáng yêu từ đất nặn nhiều màu.', funFact: 'Đất nặn giúp đôi bàn tay bé thêm dẻo dai và kích thích sáng tạo.' },
      { id: 'skateboard_toy', english: 'Skateboard', ipa: '/ˈskeɪt.bɔːrd/', vietnamese: 'Ván Trượt', category: 'toys_games', emoji: '🛹', color: '#16A34A', exampleEn: 'Glide smoothly on the skateboard.', exampleVi: 'Lướt êm ru trên chiếc ván trượt phong cách.', funFact: 'Trượt ván đòi hỏi sự tập trung và khả năng giữ thăng bằng tuyệt vời.' },
      { id: 'marbles', english: 'Marbles', ipa: '/ˈmɑːr.bəlz/', vietnamese: 'Viên Bi Ve', category: 'toys_games', emoji: '🔮', color: '#38BDF8', exampleEn: 'Shiny glass marbles in different colors.', exampleVi: 'Những viên bi ve thủy tinh lấp lánh sắc màu.', funFact: 'Trò bắn bi ve là trò chơi dân gian yêu thích của nhiều thế hệ trẻ thơ.' },
      { id: 'drum_toy', english: 'Toy Drum', ipa: '/tɔɪ drʌm/', vietnamese: 'Trống Đồ Chơi', category: 'toys_games', emoji: '🥁', color: '#DC2626', exampleEn: 'Beat the toy drum: Tum tum tum!', exampleVi: 'Gõ chiếc trống đồ chơi: Tùng tùng tùng!', funFact: 'Tiếng trống rộn rã giúp bé cảm thụ nhịp điệu âm nhạc từ nhỏ.' },
      { id: 'swing_toy', english: 'Swing', ipa: '/swɪŋ/', vietnamese: 'Xích Đu', category: 'toys_games', emoji: '🎪', color: '#F59E0B', exampleEn: 'Sway high on the playground swing.', exampleVi: 'Đung đưa lên cao trên chiếc xích đu sân chơi.', funFact: 'Chơi xích đu tạo cảm giác bay bổng như chim non trên cành.' },
    ],
  },

  // =========================================================================
  // 17. THỂ THAO & VẬN ĐỘNG (18 TỪ)
  // =========================================================================
  {
    id: 'sports',
    titleEn: 'Sports & Fitness',
    titleVi: 'Thể Thao & Vận Động',
    icon: '⚽',
    color: '#10B981',
    cards: [
      { id: 'football', english: 'Football (Soccer)', ipa: '/ˈfʊt.bɑːl/', vietnamese: 'Bóng Đá', category: 'sports', emoji: '⚽', color: '#1E293B', exampleEn: 'Football is the most popular sport in the world.', exampleVi: 'Bóng đá là môn thể thao vua được yêu thích nhất thế giới.', funFact: 'Trận đấu bóng đá có 22 cầu thủ cùng tranh tài trên sân cỏ xanh.' },
      { id: 'basketball', english: 'Basketball', ipa: '/ˈbæs.kət.bɑːl/', vietnamese: 'Bóng Rổ', category: 'sports', emoji: '🏀', color: '#EA580C', exampleEn: 'Shoot the orange ball into the hoop.', exampleVi: 'Ném quả bóng cam chuẩn xác vào rổ.', funFact: 'Chơi bóng rổ thường xuyên giúp trẻ em phát triển chiều cao vượt trội.' },
      { id: 'badminton', english: 'Badminton', ipa: '/ˈbæd.mɪn.tən/', vietnamese: 'Cầu Lông', category: 'sports', emoji: '🏸', color: '#FACC15', exampleEn: 'Hit the white shuttlecock over the net.', exampleVi: 'Đánh quả cầu lông trắng bay qua lưới.', funFact: 'Cầu lông có thể bay với tốc độ hơn 400 km/h sau cú đập bóng!' },
      { id: 'swimming', english: 'Swimming', ipa: '/ˈswɪm.ɪŋ/', vietnamese: 'Bơi Lội', category: 'sports', emoji: '🏊', color: '#0284C7', exampleEn: 'Swimming keeps your whole body fit and cool.', exampleVi: 'Bơi lội giúp toàn bộ cơ thể săn chắc và dẻo dai.', funFact: 'Bơi lội là kỹ năng sinh tồn quan trọng bảo vệ an toàn cho bé dưới nước.' },
      { id: 'tennis', english: 'Tennis', ipa: '/ˈten.ɪs/', vietnamese: 'Quần Vợt (Ten-nít)', category: 'sports', emoji: '🎾', color: '#84CC16', exampleEn: 'Hit the fuzzy yellow ball with a racket.', exampleVi: 'Đánh quả bóng nỉ vàng bằng chiếc vợt tennis.', funFact: 'Bóng tennis có lớp nỉ xù để kiểm soát quỹ đạo bay ổn định.' },
      { id: 'volleyball', english: 'Volleyball', ipa: '/ˈvɑː.li.bɑːl/', vietnamese: 'Bóng Chuyền', category: 'sports', emoji: '🏐', color: '#38BDF8', exampleEn: 'Spike the ball over the high net.', exampleVi: 'Đập bóng uy lực bay qua chiếc lưới cao.', funFact: 'Bóng chuyền bãi biển là môn thể thao mùa hè vô cùng sôi động.' },
      { id: 'cycling', english: 'Cycling', ipa: '/ˈsaɪ.klɪŋ/', vietnamese: 'Đạp Xe Thể Thao', category: 'sports', emoji: '🚴', color: '#16A34A', exampleEn: 'Cycling in the morning refreshes your mind.', exampleVi: 'Đạp xe buổi sáng giúp tinh thần sảng khoái tràn đầy năng lượng.', funFact: 'Đạp xe giúp tăng cường sức khỏe tim mạch và sức bền đôi chân.' },
      { id: 'running', english: 'Running', ipa: '/ˈrʌn.ɪŋ/', vietnamese: 'Chạy Bộ Thể Dục', category: 'sports', emoji: '🏃', color: '#DC2626', exampleEn: 'Running every day keeps you healthy.', exampleVi: 'Chạy bộ mỗi ngày giúp bé luôn khỏe khoắn.', funFact: 'Chạy bộ kích thích tiết endorphin giúp bé luôn vui vẻ và lạc quan.' },
      { id: 'skateboarding', english: 'Skateboarding', ipa: '/ˈskeɪtˌbɔːr.dɪŋ/', vietnamese: 'Trượt Ván', category: 'sports', emoji: '🛹', color: '#7C3AED', exampleEn: 'Practice cool tricks on the skateboard.', exampleVi: 'Luyện tập những động tác trượt ván điêu luyện.', funFact: 'Trượt ván đã chính thức trở thành môn thi đấu tại Thế vận hội Olympic.' },
      { id: 'karate', english: 'Karate', ipa: '/kəˈrɑː.t̬i/', vietnamese: 'Võ Ka-ra-tê', category: 'sports', emoji: '🥋', color: '#1E293B', exampleEn: 'Karate teaches discipline and self-defense.', exampleVi: 'Học võ Ka-ra-tê rèn luyện tính kỷ luật và tự vệ.', funFact: 'Đai đen trong võ thuật tượng trưng cho sự kiên trì và thành thạo cao nhất.' },
      { id: 'gymnastics', english: 'Gymnastics', ipa: '/dʒɪmˈnæs.tɪks/', vietnamese: 'Thể Dục Dụng Cụ', category: 'sports', emoji: '🤸', color: '#EC4899', exampleEn: 'Flexible moves on the balance beam.', exampleVi: 'Những động tác uốn dẻo tuyệt đẹp trên cầu thăng bằng.', funFact: 'Thể dục dụng cụ rèn luyện sự dẻo dai, khéo léo và sức mạnh cơ thể.' },
      { id: 'baseball', english: 'Baseball', ipa: '/ˈbeɪs.bɑːl/', vietnamese: 'Bóng Chày', category: 'sports', emoji: '⚾', color: '#DC2626', exampleEn: 'Hit a home run with the wooden bat.', exampleVi: 'Đánh một cú bóng bay xa ghi điểm ngoạn mục.', funFact: 'Găng tay bóng chày được thiết kế đặc biệt để bắt bóng an toàn.' },
      { id: 'ping_pong', english: 'Table Tennis', ipa: '/ˈteɪ.bəl ˌten.ɪs/', vietnamese: 'Bóng Bàn', category: 'sports', emoji: '🏓', color: '#EA580C', exampleEn: 'Quick reflexes in table tennis games.', exampleVi: 'Phản xạ chớp nhoáng trong những pha bóng bàn gay cấn.', funFact: 'Quả bóng bàn nhẹ chỉ nặng 2,7 gram nhưng bay rất nhanh.' },
      { id: 'golf', english: 'Golf', ipa: '/ɡɑːlf/', vietnamese: 'Đánh Gôn', category: 'sports', emoji: '⛳', color: '#059669', exampleEn: 'Putt the white ball into the hole.', exampleVi: 'Gạt nhẹ quả bóng trắng lăn vào lỗ cờ.', funFact: 'Sân gôn là những thảm cỏ xanh mướt rộng lớn giữa thiên nhiên.' },
      { id: 'skiing', english: 'Skiing', ipa: '/ˈskiː.ɪŋ/', vietnamese: 'Trượt Tuyết', category: 'sports', emoji: '🎿', color: '#0284C7', exampleEn: 'Glide down the snowy mountain slope.', exampleVi: 'Lướt nhanh xuống sườn núi phủ tuyết trắng xóa.', funFact: 'Người cổ đại phát minh ra ván trượt tuyết để săn bắn trong mùa đông.' },
      { id: 'roller_skating', english: 'Roller Skating', ipa: '/ˈroʊ.lɚ ˌskeɪ.tɪŋ/', vietnamese: 'Trượt Pa-tin', category: 'sports', emoji: '🛼', color: '#F43F5E', exampleEn: 'Wear knee pads when roller skating.', exampleVi: 'Đeo đệm bảo vệ đầu gối khi trượt pa-tin.', funFact: 'Giày pa-tin có 4 bánh xe giúp lướt nhanh như bay trên đường nhựa.' },
      { id: 'yoga', english: 'Yoga', ipa: '/ˈjoʊ.ɡə/', vietnamese: 'Tập Y-ô-ga', category: 'sports', emoji: '🧘', color: '#8B5CF6', exampleEn: 'Breathe deeply in a peaceful yoga pose.', exampleVi: 'Hít thở sâu trong tư thế yoga thư thái.', funFact: 'Yoga giúp tâm trí bình tĩnh và cơ thể dẻo dai khỏe mạnh.' },
      { id: 'surfing', english: 'Surfing', ipa: '/ˈsɝː.fɪŋ/', vietnamese: 'Lướt Sóng', category: 'sports', emoji: '🏄', color: '#06B6D4', exampleEn: 'Ride the giant blue ocean waves.', exampleVi: 'Cưỡi trên đỉnh những con sóng biển xanh biếc.', funFact: 'Lướt sóng xuất phát từ văn hóa biển truyền thống của người dân đảo Hawaii.' },
    ],
  },

  // =========================================================================
  // 18. THỜI TIẾT & MÙA TRONG NĂM (16 TỪ)
  // =========================================================================
  {
    id: 'weather_seasons',
    titleEn: 'Weather & Seasons',
    titleVi: 'Thời Tiết & Mùa Trong Năm',
    icon: '⛅',
    color: '#0284C7',
    cards: [
      { id: 'sunny', english: 'Sunny', ipa: '/ˈsʌn.i/', vietnamese: 'Trời Nắng', category: 'weather_seasons', emoji: '☀️', color: '#F59E0B', exampleEn: 'A bright sunny day for playing outside.', exampleVi: 'Một ngày nắng rực rỡ thích hợp đi chơi ngoài trời.', funFact: 'Ánh nắng mặt trời buổi sớm giúp cơ thể tổng hợp vitamin D tự nhiên.' },
      { id: 'rainy', english: 'Rainy', ipa: '/ˈreɪ.ni/', vietnamese: 'Trời Mưa', category: 'weather_seasons', emoji: '🌧️', color: '#0284C7', exampleEn: 'Remember to bring an umbrella on a rainy day.', exampleVi: 'Nhớ mang theo ô khi trời mưa bé nhé.', funFact: 'Nước mưa là nguồn sống nuôi dưỡng cây cối và đồng ruộng xanh tươi.' },
      { id: 'windy', english: 'Windy', ipa: '/ˈwɪn.di/', vietnamese: 'Trời Nhiều Gió', category: 'weather_seasons', emoji: '💨', color: '#64748B', exampleEn: 'The wind makes the leaves dance.', exampleVi: 'Gió thổi làm những chiếc lá nhảy múa theo điệu nhạc.', funFact: 'Gió mạnh có thể quay các cánh tuabin khổng lồ để tạo ra điện sạch.' },
      { id: 'snowy', english: 'Snowy', ipa: '/ˈsnoʊ.i/', vietnamese: 'Trời Có Tuyết', category: 'weather_seasons', emoji: '❄️', color: '#93C5FD', exampleEn: 'Build a funny snowman on a snowy day.', exampleVi: 'Đắp một chú người tuyết ngộ nghĩnh trong ngày tuyết rơi.', funFact: 'Mỗi bông tuyết rơi xuống đều có cấu trúc lục giác độc nhất vô nhị.' },
      { id: 'cloudy', english: 'Cloudy', ipa: '/ˈklaʊ.di/', vietnamese: 'Trời Nhiều Mây', category: 'weather_seasons', emoji: '☁️', color: '#94A3B8', exampleEn: 'The cloudy sky shields us from hot sun.', exampleVi: 'Bầu trời nhiều mây che bớt ánh nắng gay gắt.', funFact: 'Mây được hình thành từ hàng tỷ giọt nước li ti bay lơ lửng.' },
      { id: 'stormy', english: 'Stormy', ipa: '/ˈstɔːr.mi/', vietnamese: 'Trời Bão Tố', category: 'weather_seasons', emoji: '⛈️', color: '#334155', exampleEn: 'Stay safe indoors when it is stormy.', exampleVi: 'Ở trong nhà an toàn khi ngoài trời có mưa bão sấm chớp.', funFact: 'Ánh chớp lóe sáng trước rồi chúng ta mới nghe thấy tiếng sấm sau.' },
      { id: 'rainbow_w', english: 'Rainbow', ipa: '/ˈreɪn.boʊ/', vietnamese: 'Cầu Vồng', category: 'weather_seasons', emoji: '🌈', color: '#EC4899', exampleEn: 'A magical rainbow shines after the storm.', exampleVi: 'Cầu vồng kỳ diệu tỏa sáng rực rỡ sau cơn bão tan.', funFact: 'Cầu vồng xuất hiện khi ánh sáng mặt trời chiếu qua những giọt nước mưa.' },
      { id: 'spring', english: 'Spring', ipa: '/sprɪŋ/', vietnamese: 'Mùa Xuân', category: 'weather_seasons', emoji: '🌸', color: '#F472B6', exampleEn: 'Flowers bloom and trees sprout in spring.', exampleVi: 'Muôn hoa đua nở và cây cối đâm chồi khi mùa xuân về.', funFact: 'Mùa xuân là mùa của Tết cổ truyền và sự khởi đầu ấm áp mới.' },
      { id: 'summer', english: 'Summer', ipa: '/ˈsʌm.ɚ/', vietnamese: 'Mùa Hè', category: 'weather_seasons', emoji: '🏖️', color: '#F97316', exampleEn: 'We love swimming at the beach in summer.', exampleVi: 'Bé rất thích đi tắm biển trong những ngày hè rực rỡ.', funFact: 'Mùa hè là mùa ngày dài hơn đêm và có kỳ nghỉ hè thú vị.' },
      { id: 'autumn', english: 'Autumn (Fall)', ipa: '/ˈɑː.t̬əm/', vietnamese: 'Mùa Thu', category: 'weather_seasons', emoji: '🍂', color: '#D97706', exampleEn: 'Golden leaves fall gently in autumn.', exampleVi: 'Những chiếc lá vàng nhẹ nhàng rơi khi mùa thu sang.', funFact: 'Mùa thu có đêm Rằm Trung Thu rước đèn ông sao vui nhộn.' },
      { id: 'winter', english: 'Winter', ipa: '/ˈwɪn.t̬ɚ/', vietnamese: 'Mùa Đông', category: 'weather_seasons', emoji: '⛄', color: '#38BDF8', exampleEn: 'Wear a warm jacket and scarf in winter.', exampleVi: 'Mặc áo ấm và quàng khăn len trong mùa đông lạnh.', funFact: 'Nhiều loài động vật như gấu sẽ ngủ đông suốt những tháng lạnh giá.' },
      { id: 'hot', english: 'Hot', ipa: '/hɑːt/', vietnamese: 'Nóng Bức', category: 'weather_seasons', emoji: '🥵', color: '#EF4444', exampleEn: 'Drink fresh coconut water when it is hot.', exampleVi: 'Uống nước dừa tươi mát lành khi trời nóng bức.', funFact: 'Nhiệt độ cơ thể người luôn duy trì ổn định ở mức khoảng 37 độ C.' },
      { id: 'cold', english: 'Cold', ipa: '/koʊld/', vietnamese: 'Lạnh Giá', category: 'weather_seasons', emoji: '🥶', color: '#0284C7', exampleEn: 'Warm soup is delicious in cold weather.', exampleVi: 'Bát súp nóng thật thơm ngon trong thời tiết lạnh giá.', funFact: 'Vùng Nam Cực là nơi lạnh nhất trên toàn Trái Đất.' },
      { id: 'warm', english: 'Warm', ipa: '/wɔːrm/', vietnamese: 'Ấm Áp', category: 'weather_seasons', emoji: '🌤️', color: '#F59E0B', exampleEn: 'Warm spring sunshine feels so cozy.', exampleVi: 'Ánh nắng mùa xuân ấm áp mang lại cảm giác dễ chịu.', funFact: 'Sự ấm áp giúp cây cối nảy mầm và muôn thú vui tươi.' },
      { id: 'cool', english: 'Cool', ipa: '/kuːl/', vietnamese: 'Mát Mẻ', category: 'weather_seasons', emoji: '🍃', color: '#10B981', exampleEn: 'A cool breeze in the autumn afternoon.', exampleVi: 'Làn gió mát rượi trong buổi chiều mùa thu êm ả.', funFact: 'Thời tiết mát mẻ rất lý tưởng để cả gia đình đi dã ngoại.' },
      { id: 'foggy', english: 'Foggy', ipa: '/ˈfɑː.ɡi/', vietnamese: 'Trời Sương Mù', category: 'weather_seasons', emoji: '🌫️', color: '#64748B', exampleEn: 'The city is covered in mysterious foggy mist.', exampleVi: 'Thành phố mờ ảo trong làn sương mù sớm mai.', funFact: 'Sương mù thực chất là những đám mây sà sát xuống mặt đất.' },
    ],
  },

  // =========================================================================
  // 19. CÁC PHÒNG TRONG NHÀ (16 TỪ)
  // =========================================================================
  {
    id: 'rooms_house',
    titleEn: 'Rooms in the House',
    titleVi: 'Các Phòng Trong Nhà',
    icon: '🛋️',
    color: '#8B5CF6',
    cards: [
      { id: 'living_room', english: 'Living Room', ipa: '/ˈlɪv.ɪŋ ˌruːm/', vietnamese: 'Phòng Khách', category: 'rooms_house', emoji: '🛋️', color: '#EC4899', exampleEn: 'The family gathers in the cozy living room.', exampleVi: 'Cả gia đình quây quần ấm cúng trong phòng khách.', funFact: 'Phòng khách là bộ mặt của ngôi nhà nơi tiếp đón người thân và bạn bè.' },
      { id: 'bedroom', english: 'Bedroom', ipa: '/ˈbed.ruːm/', vietnamese: 'Phòng Ngủ', category: 'rooms_house', emoji: '🛏️', color: '#6366F1', exampleEn: 'Sleep peacefully in your quiet bedroom.', exampleVi: 'Ngủ say giấc nồng trong căn phòng ngủ yên tĩnh.', funFact: 'Phòng ngủ thoáng mát giúp bé có giấc ngủ sâu và mơ những giấc mơ đẹp.' },
      { id: 'kitchen', english: 'Kitchen', ipa: '/ˈkɪtʃ.ən/', vietnamese: 'Nhà Bếp', category: 'rooms_house', emoji: '🍳', color: '#F59E0B', exampleEn: 'Mom cooks delicious meals in the kitchen.', exampleVi: 'Mẹ nấu những món ăn thơm lừng trong gian bếp.', funFact: 'Nhà bếp là nơi giữ lửa yêu thương cho mọi bữa cơm sum họp.' },
      { id: 'bathroom', english: 'Bathroom', ipa: '/ˈbæθ.ruːm/', vietnamese: 'Phòng Tắm', category: 'rooms_house', emoji: '🚿', color: '#06B6D4', exampleEn: 'Take a refreshing shower in the clean bathroom.', exampleVi: 'Tắm gội mát mẻ sạch sẽ trong phòng tắm.', funFact: 'Phòng tắm sạch sẽ giúp ngăn ngừa vi khuẩn và bảo vệ sức khỏe bé.' },
      { id: 'dining_room', english: 'Dining Room', ipa: '/ˈdaɪ.nɪŋ ˌruːm/', vietnamese: 'Phòng Ăn', category: 'rooms_house', emoji: '🍽️', color: '#EA580C', exampleEn: 'Enjoy happy meals together in the dining room.', exampleVi: 'Thưởng thức bữa cơm vui vẻ cùng nhau trong phòng ăn.', funFact: 'Bàn ăn là nơi mọi người cùng chia sẻ những chuyện vui trong ngày.' },
      { id: 'garden', english: 'Garden', ipa: '/ˈɡɑːr.dən/', vietnamese: 'Khu Vườn', category: 'rooms_house', emoji: '🏡', color: '#10B981', exampleEn: 'Colorful flowers and sweet fruits in the garden.', exampleVi: 'Muôn hoa khoe sắc và quả ngọt trĩu cành trong vườn.', funFact: 'Làm vườn giúp bé gần gũi với thiên nhiên và biết yêu quý cây xanh.' },
      { id: 'balcony', english: 'Balcony', ipa: '/ˈbæl.kə.ni/', vietnamese: 'Ban Công', category: 'rooms_house', emoji: '🪴', color: '#14B8A6', exampleEn: 'Watch the sunrise from the airy balcony.', exampleVi: 'Ngắm bình minh rực rỡ từ ban công thoáng đãng.', funFact: 'Trồng vài chậu hoa nhỏ ngoài ban công giúp không khí thêm trong lành.' },
      { id: 'garage', english: 'Garage', ipa: '/ɡəˈrɑːʒ/', vietnamese: 'Nhà Để Xe (Ga-ra)', category: 'rooms_house', emoji: '🚗', color: '#475569', exampleEn: 'Park the car safely inside the garage.', exampleVi: 'Đỗ xe ô tô an toàn bên trong nhà để xe.', funFact: 'Nhà để xe bảo vệ xe cộ khỏi mưa nắng và thời tiết xấu.' },
      { id: 'attic', english: 'Attic', ipa: '/ˈæt̬.ɪk/', vietnamese: 'Gác Xép / Tầng Áp Mái', category: 'rooms_house', emoji: '📦', color: '#78350F', exampleEn: 'Old treasure memories stored in the attic.', exampleVi: 'Những món kỷ vật tuổi thơ được cất giữ trên gác xép.', funFact: 'Gác xép là không gian yên tĩnh nằm ngay sát mái nhà.' },
      { id: 'basement', english: 'Basement', ipa: '/ˈbeɪs.mənt/', vietnamese: 'Tầng Hầm', category: 'rooms_house', emoji: '🪜', color: '#334155', exampleEn: 'The basement is cool and spacious.', exampleVi: 'Tầng hầm mát mẻ và rộng rãi.', funFact: 'Tầng hầm nằm hoàn toàn dưới mặt đất giúp ngôi nhà thêm kiên cố.' },
      { id: 'yard', english: 'Yard', ipa: '/jɑːrd/', vietnamese: 'Sân Nhà', category: 'rooms_house', emoji: '🌱', color: '#16A34A', exampleEn: 'Play tag with puppy in the green front yard.', exampleVi: 'Chơi đuổi bắt cùng chú cún con trước sân nhà.', funFact: 'Sân nhà là không gian vận động ngoài trời tuyệt vời cho trẻ em.' },
      { id: 'hallway', english: 'Hallway', ipa: '/ˈhɑːl.weɪ/', vietnamese: 'Hành Lang', category: 'rooms_house', emoji: '🚪', color: '#94A3B8', exampleEn: 'Walk quietly down the clean hallway.', exampleVi: 'Bước đi nhẹ nhàng dọc theo hành lang sạch sẽ.', funFact: 'Hành lang kết nối các phòng trong ngôi nhà với nhau.' },
      { id: 'roof', english: 'Roof', ipa: '/ruːf/', vietnamese: 'Mái Nhà', category: 'rooms_house', emoji: '⛺', color: '#DC2626', exampleEn: 'The red roof protects the house from rain.', exampleVi: 'Mái ngói đỏ che chở ngôi nhà khỏi mưa nắng.', funFact: 'Mái nhà dốc giúp nước mưa thoát nhanh chóng không bị ứ đọng.' },
      { id: 'stairs', english: 'Stairs', ipa: '/sterz/', vietnamese: 'Cầu Thang', category: 'rooms_house', emoji: '🪜', color: '#D97706', exampleEn: 'Hold the handrail when climbing the stairs.', exampleVi: 'Vịnh vào tay vịn khi bước lên cầu thang bé nhé.', funFact: 'Đi bộ leo cầu thang là bài tập tuyệt vời giúp đôi chân săn chắc.' },
      { id: 'porch', english: 'Porch', ipa: '/pɔːrtʃ/', vietnamese: 'Hiên Nhà', category: 'rooms_house', emoji: '🪑', color: '#CA8A04', exampleEn: 'Grandfather sits on the porch enjoying fresh tea.', exampleVi: 'Ông ngồi trước hiên nhà thưởng thức chén trà thơm.', funFact: 'Hiên nhà là nơi đón những cơn gió mát lành vào mỗi buổi chiều tà.' },
      { id: 'fence', english: 'Fence', ipa: '/fens/', vietnamese: 'Hàng Rào', category: 'rooms_house', emoji: '🪵', color: '#B45309', exampleEn: 'A neat white fence around the flower garden.', exampleVi: 'Hàng rào trắng xinh xắn bao quanh vườn hoa.', funFact: 'Hàng rào hoa hồng vừa làm đẹp vừa bảo vệ khu vườn nhỏ.' },
    ],
  },

  // =========================================================================
  // 20. BÃI BIỂN & MÙA HÈ (16 TỪ)
  // =========================================================================
  {
    id: 'beach_summer',
    titleEn: 'Beach & Summer Fun',
    titleVi: 'Bãi Biển & Mùa Hè',
    icon: '🏖️',
    color: '#06B6D4',
    cards: [
      { id: 'sand', english: 'Sand', ipa: '/sænd/', vietnamese: 'Bãi Cát Vàng', category: 'beach_summer', emoji: '🏖️', color: '#F59E0B', exampleEn: 'Walk barefoot on the soft warm sand.', exampleVi: 'Đi chân trần trên bãi cát mịn màng ấm áp.', funFact: 'Cát biển được tạo thành từ những mảnh vỏ sò và đá vỡ vụn qua hàng triệu năm.' },
      { id: 'sandcastle', english: 'Sandcastle', ipa: '/ˈsændˌkæs.əl/', vietnamese: 'Lâu Đài Cát', category: 'beach_summer', emoji: '🏰', color: '#D97706', exampleEn: 'Build a giant sandcastle with towers.', exampleVi: 'Xây một tòa lâu đài cát khổng lồ có nhiều ngọn tháp.', funFact: 'Nước biển ẩm giúp các hạt cát dính chặt vào nhau tạo hình lâu đài vững chắc.' },
      { id: 'shell', english: 'Seashell', ipa: '/ˈsiː.ʃel/', vietnamese: 'Vỏ Sò Biển', category: 'beach_summer', emoji: '🐚', color: '#F472B6', exampleEn: 'Listen to the ocean sound inside a seashell.', exampleVi: 'Lắng nghe tiếng sóng biển thì thầm bên trong vỏ ốc.', funFact: 'Âm thanh nghe thấy trong vỏ ốc thực ra là tiếng vang của dòng máu chảy trong tai ta.' },
      { id: 'wave', english: 'Ocean Wave', ipa: '/weɪv/', vietnamese: 'Sóng Biển', category: 'beach_summer', emoji: '🌊', color: '#0284C7', exampleEn: 'Jump over the splashing ocean waves.', exampleVi: 'Nhảy qua những ngọn sóng biển vỗ bờ tung bọt trắng.', funFact: 'Sóng biển được sinh ra từ sức gió thổi miệt mài trên mặt đại dương.' },
      { id: 'sunglasses', english: 'Sunglasses', ipa: '/ˈsʌnˌɡlæs.ɪz/', vietnamese: 'Kính Râm (Kính Mát)', category: 'beach_summer', emoji: '🕶️', color: '#1E293B', exampleEn: 'Wear cool sunglasses to protect your eyes.', exampleVi: 'Đeo kính mát sành điệu để bảo vệ đôi mắt khỏi nắng chói.', funFact: 'Kính râm ngăn chặn tia UV gây hại cho thị lực của bé.' },
      { id: 'sunscreen', english: 'Sunscreen', ipa: '/ˈsʌn.skriːn/', vietnamese: 'Kem Chống Nắng', category: 'beach_summer', emoji: '🧴', color: '#FBBF24', exampleEn: 'Apply sunscreen before playing under the sun.', exampleVi: 'Thoa kem chống nắng trước khi vui chơi dưới ánh mặt trời.', funFact: 'Kem chống nắng tạo lớp màng bảo vệ làn da bé khỏi bị cháy nắng.' },
      { id: 'towel', english: 'Beach Towel', ipa: '/ˈbiːtʃ ˌtaʊ.əl/', vietnamese: 'Khăn Tắm Biển', category: 'beach_summer', emoji: '🧖', color: '#EC4899', exampleEn: 'Dry off with a large colorful beach towel.', exampleVi: 'Lau khô người bằng chiếc khăn tắm biển sắc màu rực rỡ.', funFact: 'Khăn bông mềm giúp thấm hút nước nhanh và giữ ấm sau khi bơi.' },
      { id: 'swimsuit', english: 'Swimsuit', ipa: '/ˈswɪm.suːt/', vietnamese: 'Bộ Đồ Bơi', category: 'beach_summer', emoji: '🩱', color: '#F43F5E', exampleEn: 'Put on your bright swimsuit to swim.', exampleVi: 'Mặc bộ đồ bơi xinh xắn để cùng hòa mình vào làn nước mát.', funFact: 'Đồ bơi được làm từ chất liệu đặc biệt co giãn và nhanh khô ráo.' },
      { id: 'coconut_tree', english: 'Palm Tree', ipa: '/pɑːm triː/', vietnamese: 'Cây Dừa Biển', category: 'beach_summer', emoji: '🌴', color: '#15803D', exampleEn: 'Tall palm trees sway along the coast.', exampleVi: 'Những rặng dừa xanh đung đưa theo gió dọc bờ biển.', funFact: 'Cây dừa có bộ rễ chùm bám sâu vào cát giúp chống chịu gió bão biển.' },
      { id: 'surfing_board', english: 'Surfboard', ipa: '/ˈsɝːf.bɔːrd/', vietnamese: 'Ván Lướt Sóng', category: 'beach_summer', emoji: '🏄', color: '#06B6D4', exampleEn: 'Balance on the surfboard over big waves.', exampleVi: 'Giữ thăng bằng trên ván lướt sóng cưỡi qua ngọn sóng lớn.', funFact: 'Ván lướt sóng hiện đại được làm từ sợi thủy tinh siêu nhẹ và nổi cực tốt.' },
      { id: 'beach_ball', english: 'Beach Ball', ipa: '/ˈbiːtʃ ˌbɑːl/', vietnamese: 'Bóng Bơm Hơi Bãi Biển', category: 'beach_summer', emoji: '🏐', color: '#FACC15', exampleEn: 'Toss the colorful beach ball with friends.', exampleVi: 'Tung quả bóng bãi biển sắc màu cùng các bạn.', funFact: 'Bóng bơm hơi nhẹ tênh có thể nổi bồng bềnh trên mặt nước biển.' },
      { id: 'flip_flops', english: 'Flip-flops', ipa: '/ˈflɪp.flɑːps/', vietnamese: 'Dép Kẹp (Tông)', category: 'beach_summer', emoji: '🩴', color: '#8B5CF6', exampleEn: 'Wear comfortable flip-flops on the sand.', exampleVi: 'Đi đôi dép tông êm ái dạo bước trên bãi cát.', funFact: 'Dép xỏ ngón thoáng mát là lựa chọn số 1 cho các chuyến đi biển.' },
      { id: 'beach_umbrella', english: 'Beach Umbrella', ipa: '/ˈbiːtʃ ʌmˌbrel.ə/', vietnamese: 'Ô Che Nắng Bãi Biển', category: 'beach_summer', emoji: '⛱️', color: '#EF4444', exampleEn: 'Relax in the cool shade under the umbrella.', exampleVi: 'Nghỉ ngơi dưới bóng râm mát mẻ của chiếc ô khổng lồ.', funFact: 'Tán ô bãi biển rộng lớn che mát cho cả gia đình cùng ngồi nghỉ.' },
      { id: 'lifeguard', english: 'Lifeguard', ipa: '/ˈlaɪf.ɡɑːrd/', vietnamese: 'Nhân Viên Cứu Hộ', category: 'beach_summer', emoji: '🛟', color: '#DC2626', exampleEn: 'The lifeguard watches over swimmers carefully.', exampleVi: 'Chú cứu hộ biển quan sát bảo vệ an toàn cho mọi người.', funFact: 'Nhân viên cứu hộ là những vận động viên bơi lội siêu giỏi và dũng cảm.' },
      { id: 'sea_breeze', english: 'Sea Breeze', ipa: '/ˈsiː ˌbriːz/', vietnamese: 'Gió Biển', category: 'beach_summer', emoji: '🌬️', color: '#38BDF8', exampleEn: 'Fresh salty sea breeze cools the hot air.', exampleVi: 'Làn gió biển mằn mặn xua tan cơn nóng nực mùa hè.', funFact: 'Gió biển thổi từ biển vào đất liền vào ban ngày do chênh lệch nhiệt độ.' },
      { id: 'island', english: 'Island', ipa: '/ˈaɪ.lənd/', vietnamese: 'Hòn Đảo', category: 'beach_summer', emoji: '🏝️', color: '#10B981', exampleEn: 'A green tropical island in the clear blue sea.', exampleVi: 'Một hòn đảo nhiệt đới xanh tươi giữa biển xanh trong vắt.', funFact: 'Việt Nam có đảo Phú Quốc nổi tiếng là đảo ngọc xinh đẹp tuyệt vời.' },
    ],
  },

  // =========================================================================
  // 21. SỨC KHỎE & VỆ SINH CÁ NHÂN (16 TỪ)
  // =========================================================================
  {
    id: 'health_hygiene',
    titleEn: 'Health & Hygiene',
    titleVi: 'Sức Khỏe & Vệ Sinh',
    icon: '🧼',
    color: '#10B981',
    cards: [
      { id: 'soap', english: 'Soap', ipa: '/soʊp/', vietnamese: 'Bánh Xà Phòng', category: 'health_hygiene', emoji: '🧼', color: '#EC4899', exampleEn: 'Wash with bubbly soap to kill germs.', exampleVi: 'Rửa tay bằng xà phòng nhiều bọt để diệt sạch vi khuẩn.', funFact: 'Rửa tay với xà phòng trong 20 giây giúp loại bỏ 99% vi khuẩn gây hại.' },
      { id: 'toothbrush', english: 'Toothbrush', ipa: '/ˈtuːθ.brʌʃ/', vietnamese: 'Bàn Chải Đánh Răng', category: 'health_hygiene', emoji: '🪥', color: '#3B82F6', exampleEn: 'Brush gently with a soft toothbrush.', exampleVi: 'Chải răng nhẹ nhàng bằng chiếc bàn chải lông mềm.', funFact: 'Nên thay bàn chải đánh răng mới sau mỗi 3 tháng sử dụng.' },
      { id: 'toothpaste', english: 'Toothpaste', ipa: '/ˈtuːθ.peɪst/', vietnamese: 'Kem Đánh Răng', category: 'health_hygiene', emoji: '🧴', color: '#06B6D4', exampleEn: 'Minty toothpaste makes your breath fresh.', exampleVi: 'Kem đánh răng bạc hà cho hơi thở thơm tho tươi mát.', funFact: 'Chất Fluoride trong kem đánh răng giúp men răng chắc khỏe chống sâu răng.' },
      { id: 'shampoo', english: 'Shampoo', ipa: '/ʃæmˈpuː/', vietnamese: 'Dầu Gội Đầu', category: 'health_hygiene', emoji: '🧴', color: '#8B5CF6', exampleEn: 'Shampoo leaves your hair clean and fragrant.', exampleVi: 'Dầu gội giúp mái tóc bé sạch gàu và thơm ngát.', funFact: 'Dầu gội trẻ em có công thức đặc biệt dịu nhẹ không làm cay mắt bé.' },
      { id: 'towel_h', english: 'Towel', ipa: '/ˈtaʊ.əl/', vietnamese: 'Khăn Mặt / Khăn Lau', category: 'health_hygiene', emoji: '🧖', color: '#F472B6', exampleEn: 'Wipe your face dry with a clean towel.', exampleVi: 'Lau khô khuôn mặt bằng chiếc khăn sạch mềm.', funFact: 'Khăn bông mềm mại nâng niu làn da nhạy cảm của trẻ thơ.' },
      { id: 'bandage', english: 'Bandage', ipa: '/ˈbæn.dɪdʒ/', vietnamese: 'Băng Cá Nhân', category: 'health_hygiene', emoji: '🩹', color: '#FB923C', exampleEn: 'Put a cute bandage on the little scrape.', exampleVi: 'Dán chiếc băng cá nhân xinh xắn lên vết xước nhỏ.', funFact: 'Băng cá nhân giữ vết thương sạch sẽ và mau lành hơn.' },
      { id: 'medicine', english: 'Medicine', ipa: '/ˈmed.ə.sən/', vietnamese: 'Thuốc Chữa Bệnh', category: 'health_hygiene', emoji: '💊', color: '#EF4444', exampleEn: 'Take medicine as doctor prescribes.', exampleVi: 'Uống thuốc đúng theo lời bác sĩ dặn dò.', funFact: 'Thuốc giúp cơ thể đánh bại vi khuẩn và hồi phục sức khỏe nhanh chóng.' },
      { id: 'fever', english: 'Fever', ipa: '/ˈfiː.vɚ/', vietnamese: 'Bị Sốt', category: 'health_hygiene', emoji: '🤒', color: '#EA580C', exampleEn: 'Rest and drink warm water when you have a fever.', exampleVi: 'Nghỉ ngơi và uống nhiều nước ấm khi bé bị sốt.', funFact: 'Sốt là phản ứng tự nhiên của hệ miễn dịch đang chiến đấu chống lại mầm bệnh.' },
      { id: 'cough', english: 'Cough', ipa: '/kɑːf/', vietnamese: 'Bị Ho', category: 'health_hygiene', emoji: '😷', color: '#64748B', exampleEn: 'Cover your mouth with your elbow when you cough.', exampleVi: 'Che miệng bằng khuỷu tay khi ho để giữ vệ sinh chung.', funFact: 'Uống một thìa mật ong chanh đào ấm giúp làm dịu cơn ho nhanh chóng.' },
      { id: 'clean', english: 'Clean', ipa: '/kliːn/', vietnamese: 'Sạch Sẽ', category: 'health_hygiene', emoji: '✨', color: '#10B981', exampleEn: 'Keep your study desk neat and clean.', exampleVi: 'Giữ cho góc học tập luôn ngăn nắp và sạch sẽ.', funFact: 'Môi trường sống sạch sẽ giúp tinh thần minh mẫn và ít ốm đau.' },
      { id: 'healthy', english: 'Healthy', ipa: '/ˈhel.θi/', vietnamese: 'Khỏe Mạnh', category: 'health_hygiene', emoji: '🍎', color: '#15803D', exampleEn: 'Eat fresh fruits and veggies to stay healthy.', exampleVi: 'Ăn nhiều hoa quả và rau xanh để cơ thể luôn khỏe mạnh.', funFact: 'Khỏe mạnh là nền tảng vững chắc để bé học tập và vui chơi hết mình.' },
      { id: 'wash_hands', english: 'Wash Hands', ipa: '/wɑːʃ hændz/', vietnamese: 'Rửa Tay Sạch', category: 'health_hygiene', emoji: '🙌', color: '#0284C7', exampleEn: 'Wash hands before meals and after playing.', exampleVi: 'Rửa tay trước khi ăn và sau khi đi chơi về.', funFact: 'Rửa tay đúng cách là biện pháp phòng ngừa bệnh tật đơn giản và hiệu quả nhất.' },
      { id: 'shower', english: 'Shower', ipa: '/ˈʃaʊ.ɚ/', vietnamese: 'Tắm Vòi Sen', category: 'health_hygiene', emoji: '🚿', color: '#38BDF8', exampleEn: 'A warm shower relaxes all your muscles.', exampleVi: 'Tắm vòi sen nước ấm giúp thư giãn toàn bộ cơ bắp.', funFact: 'Tia nước từ vòi sen mát-xa nhẹ nhàng giúp cơ thể sảng khoái.' },
      { id: 'mask', english: 'Face Mask', ipa: '/feɪs mæsk/', vietnamese: 'Khẩu Trang', category: 'health_hygiene', emoji: '😷', color: '#93C5FD', exampleEn: 'Wear a face mask when in crowded dusty places.', exampleVi: 'Đeo khẩu trang khi đi đến nơi đông người hoặc nhiều khói bụi.', funFact: 'Khẩu trang lọc bụi mịn và bảo vệ đường hô hấp của bé.' },
      { id: 'comb', english: 'Comb', ipa: '/koʊm/', vietnamese: 'Cái Lược Chải Đầu', category: 'health_hygiene', emoji: '🪮', color: '#D97706', exampleEn: 'Comb your hair neatly before going to school.', exampleVi: 'Chải đầu tóc gọn gàng trước khi đến trường.', funFact: 'Chải đầu nhẹ nhàng giúp lưu thông máu dưới da đầu rất tốt.' },
      { id: 'tissue', english: 'Tissue', ipa: '/ˈtɪʃ.uː/', vietnamese: 'Khăn Giấy', category: 'health_hygiene', emoji: '🧻', color: '#E2E8F0', exampleEn: 'Wipe your hands clean with a soft tissue.', exampleVi: 'Lau sạch tay bằng tờ khăn giấy mềm.', funFact: 'Khăn giấy tiện lợi giúp giữ vệ sinh cá nhân mọi lúc mọi nơi.' },
    ],
  },

  // =========================================================================
  // 22. CÔNG VIÊN & VUI CHƠI (16 TỪ)
  // =========================================================================
  {
    id: 'park_playground',
    titleEn: 'Park & Playground',
    titleVi: 'Công Viên & Vui Chơi',
    icon: '🎪',
    color: '#EC4899',
    cards: [
      { id: 'slide', english: 'Slide', ipa: '/slaɪd/', vietnamese: 'Cầu Trượt', category: 'park_playground', emoji: '🛝', color: '#EF4444', exampleEn: 'Slide down fast and giggling happily.', exampleVi: 'Trượt xuống thật nhanh và cười khúc khích vui vẻ.', funFact: 'Cầu trượt là trò chơi được yêu thích nhất ở mọi sân chơi trẻ em.' },
      { id: 'swing', english: 'Swing', ipa: '/swɪŋ/', vietnamese: 'Xích Đu', category: 'park_playground', emoji: '🎪', color: '#F59E0B', exampleEn: 'Fly high in the sky on the playground swing.', exampleVi: 'Bay vút lên cao trên chiếc xích đu sân chơi.', funFact: 'Chơi xích đu giúp bé kích thích tiền đình và giữ thăng bằng tốt.' },
      { id: 'seesaw', english: 'Seesaw', ipa: '/ˈsiː.sɑː/', vietnamese: 'Bập Bênh', category: 'park_playground', emoji: '🪵', color: '#10B981', exampleEn: 'Up and down on the fun wooden seesaw.', exampleVi: 'Lên rồi lại xuống trên chiếc bập bênh gỗ vui nhộn.', funFact: 'Trò chơi bập bênh dạy cho bé bài học tuyệt vời về sự cân bằng và chia sẻ.' },
      { id: 'sandbox', english: 'Sandbox', ipa: '/ˈsænd.bɑːks/', vietnamese: 'Hố Cát Vui Chơi', category: 'park_playground', emoji: '🏖️', color: '#FBBF24', exampleEn: 'Dig and build sand shapes in the sandbox.', exampleVi: 'Đào và tạo hình các con vật trong hố cát.', funFact: 'Chơi cát kích thích xúc giác và trí tưởng tượng phong phú của trẻ.' },
      { id: 'bench', english: 'Park Bench', ipa: '/pɑːrk bentʃ/', vietnamese: 'Ghế Đá Công Viên', category: 'park_playground', emoji: '🪑', color: '#475569', exampleEn: 'Sit on the park bench under green trees.', exampleVi: 'Ngồi nghỉ trên ghế đá dưới tán cây xanh mát.', funFact: 'Ghế công viên là nơi lý tưởng để đọc sách và hít thở khí trời trong lành.' },
      { id: 'fountain', english: 'Fountain', ipa: '/ˈfaʊn.tən/', vietnamese: 'Đài Phun Nước', category: 'park_playground', emoji: '⛲', color: '#0284C7', exampleEn: 'Water dances gracefully in the fountain.', exampleVi: 'Những tia nước nhảy múa uyển chuyển trong đài phun nước.', funFact: 'Đài phun nước làm dịu mát không khí xung quanh công viên.' },
      { id: 'grass', english: 'Green Grass', ipa: '/ɡriːn ɡræs/', vietnamese: 'Thảm Cỏ Xanh', category: 'park_playground', emoji: '🌱', color: '#16A34A', exampleEn: 'Sit on the soft green grass for a picnic.', exampleVi: 'Ngồi trên thảm cỏ xanh mướt để cùng dã ngoại.', funFact: 'Màu xanh của cỏ cây giúp mắt thư giãn sau những giờ học bài.' },
      { id: 'picnic', english: 'Picnic', ipa: '/ˈpɪk.nɪk/', vietnamese: 'Buổi Dã Ngoại', category: 'park_playground', emoji: '🧺', color: '#EA580C', exampleEn: 'Delicious sandwiches in our family picnic basket.', exampleVi: 'Những chiếc bánh mì kẹp thơm ngon trong giỏ dã ngoại gia đình.', funFact: 'Dã ngoại ngoài trời giúp cả nhà gắn kết yêu thương nhiều hơn.' },
      { id: 'bike_path', english: 'Bicycle Path', ipa: '/ˈbaɪ.sə.kəl pæθ/', vietnamese: 'Làn Đường Xe Đạp', category: 'park_playground', emoji: '🚴', color: '#059669', exampleEn: 'Ride safely along the designated bicycle path.', exampleVi: 'Đạp xe an toàn dọc theo làn đường dành riêng cho xe đạp.', funFact: 'Đường xe đạp trong công viên rợp bóng mát không có khói bụi xe cộ.' },
      { id: 'ticket', english: 'Ticket', ipa: '/ˈtɪk.ɪt/', vietnamese: 'Vé Vào Cổng', category: 'park_playground', emoji: '🎟️', color: '#DC2626', exampleEn: 'Show your entrance ticket to the friendly guide.', exampleVi: 'Xuất trình vé vào cổng cho người soát vé thân thiện.', funFact: 'Chiếc vé xinh xắn mở ra một ngày vui chơi đầy ắp tiếng cười.' },
      { id: 'ferris_wheel', english: 'Ferris Wheel', ipa: '/ˈfer.ɪs ˌwiːl/', vietnamese: 'Vòng Quay Khổng Lồ', category: 'park_playground', emoji: '🎡', color: '#8B5CF6', exampleEn: 'See the whole city from atop the Ferris wheel.', exampleVi: 'Ngắm nhìn toàn cảnh thành phố từ đỉnh vòng quay khổng lồ.', funFact: 'Vòng quay quay chậm rãi đưa bé lên cao ngắm mây trời.' },
      { id: 'carousel', english: 'Carousel', ipa: '/ˌkær.əˈsel/', vietnamese: 'Đu Quay Ngựa Gỗ', category: 'park_playground', emoji: '🎠', color: '#EC4899', exampleEn: 'Ride a colorful horse on the merry-go-round.', exampleVi: 'Cưỡi chú ngựa gỗ sắc màu trên vòng đu quay rực rỡ.', funFact: 'Tiếng nhạc du dương của đu quay đưa bé vào thế giới cổ tích nhiệm màu.' },
      { id: 'ice_cart', english: 'Ice Cream Cart', ipa: '/ˈaɪs ˌkriːm kɑːrt/', vietnamese: 'Xe Bán Kem Dạo', category: 'park_playground', emoji: '🍦', color: '#F472B6', exampleEn: 'Choose your favorite strawberry cone at the cart.', exampleVi: 'Chọn que kem dâu yêu thích tại xe bán kem dạo.', funFact: 'Chiếc chuông reng reng vui tai báo hiệu xe kem đang tới gần.' },
      { id: 'park_lake', english: 'Park Lake', ipa: '/pɑːrk leɪk/', vietnamese: 'Hồ Nước Công Viên', category: 'park_playground', emoji: '🦆', color: '#06B6D4', exampleEn: 'Feed white ducks swimming in the park lake.', exampleVi: 'Cho đàn vịt trắng tung tăng bơi lội dưới hồ nước ăn.', funFact: 'Hồ nước trong công viên là nơi cư ngụ của nhiều loài cá và chim muông.' },
      { id: 'kite_field', english: 'Kite Field', ipa: '/kaɪt fiːld/', vietnamese: 'Bãi Thả Diều', category: 'park_playground', emoji: '🪁', color: '#38BDF8', exampleEn: 'Run across the windy field to launch your kite.', exampleVi: 'Chạy băng qua bãi cỏ lộng gió để thả cánh diều bay cao.', funFact: 'Bãi thả diều rực rỡ sắc màu với hàng trăm cánh diều bay lượn.' },
      { id: 'statue', english: 'Statue', ipa: '/ˈstætʃ.uː/', vietnamese: 'Bức Tượng', category: 'park_playground', emoji: '🗿', color: '#94A3B8', exampleEn: 'A bronze statue of a famous hero.', exampleVi: 'Bức tượng đồng uy nghiêm tạc hình người anh hùng dân tộc.', funFact: 'Tượng đài trong công viên nhắc nhở chúng ta ghi nhớ lịch sử hào hùng.' },
    ],
  },

  // =========================================================================
  // 23. LỄ HỘI & DỊP ĐẶC BIỆT (16 TỪ)
  // =========================================================================
  {
    id: 'holidays_celebrations',
    titleEn: 'Holidays & Festivals',
    titleVi: 'Lễ Hội & Dịp Đặc Biệt',
    icon: '🎃',
    color: '#D97706',
    cards: [
      { id: 'tet_holiday', english: 'Tet Holiday (Lunar New Year)', ipa: '/tet ˈhɑː.lə.deɪ/', vietnamese: 'Tết Cổ Truyền', category: 'holidays_celebrations', emoji: '🧧', color: '#DC2626', exampleEn: 'Wear new clothes and receive lucky money on Tet.', exampleVi: 'Mặc quần áo mới và nhận phong bao lì xì may mắn trong ngày Tết.', funFact: 'Tết là dịp lễ thiêng liêng nhất để cả gia đình sum vầy đoàn tụ.' },
      { id: 'birthday', english: 'Birthday', ipa: '/ˈbɝːθ.deɪ/', vietnamese: 'Ngày Sinh Nhật', category: 'holidays_celebrations', emoji: '🎂', color: '#EC4899', exampleEn: 'Make a wish and blow out birthday candles.', exampleVi: 'Ước một điều ước ngọt ngào và thổi tắt nến sinh nhật.', funFact: 'Mỗi năm sinh nhật đánh dấu bé đã lớn thêm một tuổi ngoan ngoãn hơn.' },
      { id: 'christmas', english: 'Christmas', ipa: '/ˈkrɪs.məs/', vietnamese: 'Lễ Giáng Sinh (Noel)', category: 'holidays_celebrations', emoji: '🎄', color: '#15803D', exampleEn: 'Decorate the green Christmas tree with sparkling lights.', exampleVi: 'Trang trí cây thông Noel bằng những dây đèn lấp lánh.', funFact: 'Ông già Noel cưỡi cỗ xe tuần lộc mang quà đến cho các bạn nhỏ ngoan.' },
      { id: 'halloween', english: 'Halloween', ipa: '/ˌhæl.oʊˈiːn/', vietnamese: 'Lễ Hội Ma Hóa Trang', category: 'holidays_celebrations', emoji: '🎃', color: '#EA580C', exampleEn: 'Dress up in fun costumes for Trick or Treat.', exampleVi: 'Hóa trang thành các nhân vật ngộ nghĩnh đi xin kẹo.', funFact: 'Bí ngô khoét hình mặt cười Jack-o’-lantern là biểu tượng của Halloween.' },
      { id: 'mid_autumn', english: 'Mid-Autumn Festival', ipa: '/mɪd ˈɑː.t̬əm/', vietnamese: 'Tết Trung Thu', category: 'holidays_celebrations', emoji: '🥮', color: '#F59E0B', exampleEn: 'Carry star lanterns and eat sweet mooncakes.', exampleVi: 'Rước đèn ông sao và thưởng thức bánh trung thu thơm ngọt.', funFact: 'Đêm Rằm Trung Thu trăng tròn và sáng nhất trong cả năm.' },
      { id: 'fireworks', english: 'Fireworks', ipa: '/ˈfaɪr.wɝːks/', vietnamese: 'Pháo Hoa Rực Rỡ', category: 'holidays_celebrations', emoji: '🎆', color: '#8B5CF6', exampleEn: 'Brilliant fireworks light up the New Year night sky.', exampleVi: 'Những chùm pháo hoa rực rỡ thắp sáng bầu trời đêm giao thừa.', funFact: 'Pháo hoa được phát minh tại phương Đông từ hơn 1.000 năm trước.' },
      { id: 'lantern', english: 'Lantern', ipa: '/ˈlæn.tɚn/', vietnamese: 'Đèn Lồng', category: 'holidays_celebrations', emoji: '🏮', color: '#EF4444', exampleEn: 'Hold a glowing red lantern in the parade.', exampleVi: 'Cầm chiếc đèn lồng đỏ rực rỡ tham gia đoàn rước.', funFact: 'Đèn lồng tượng trưng cho sự may mắn, bình an và xua đi bóng tối.' },
      { id: 'present', english: 'Present (Gift)', ipa: '/ˈprez.ənt/', vietnamese: 'Hộp Quà Tặng', category: 'holidays_celebrations', emoji: '🎁', color: '#F43F5E', exampleEn: 'Unwrap a lovely gift wrapped with a ribbon.', exampleVi: 'Mở hộp quà xinh xắn được thắt chiếc nơ lụa mềm mại.', funFact: 'Món quà ý nghĩa nhất chính là tấm lòng yêu thương chân thành.' },
      { id: 'candle', english: 'Candle', ipa: '/ˈkæn.dəl/', vietnamese: 'Cây Nến', category: 'holidays_celebrations', emoji: '🕯️', color: '#FACC15', exampleEn: 'Warm flickering light from the small candle.', exampleVi: 'Ánh sáng lung linh ấm áp tỏa ra từ ngọn nến nhỏ.', funFact: 'Ngọn nến tượng trưng cho ánh sáng tri thức và niềm hy vọng.' },
      { id: 'party', english: 'Party', ipa: '/ˈpɑːr.t̬i/', vietnamese: 'Bữa Tiệc', category: 'holidays_celebrations', emoji: '🎉', color: '#A855F7', exampleEn: 'Sing, dance and play games at the festive party.', exampleVi: 'Hát ca, nhảy múa và chơi trò chơi tại bữa tiệc sôi động.', funFact: 'Bữa tiệc là dịp gắn kết tình bạn và chia sẻ niềm vui rộn rã.' },
      { id: 'santa', english: 'Santa Claus', ipa: '/ˈsæn.t̬ə ˌklɑːz/', vietnamese: 'Ông Già Tuyết (Noel)', category: 'holidays_celebrations', emoji: '🎅', color: '#DC2626', exampleEn: 'Santa Claus has a jolly laugh: Ho ho ho!', exampleVi: 'Ông già Noel cất tiếng cười sảng khoái: Hô hô hô!', funFact: 'Ông già Noel sống ở Bắc Cực cùng các chú yêu tinh chế tạo đồ chơi.' },
      { id: 'easter', english: 'Easter', ipa: '/ˈiː.stɚ/', vietnamese: 'Lễ Phục Sinh', category: 'holidays_celebrations', emoji: '🐣', color: '#10B981', exampleEn: 'Hunt for colorful painted eggs hidden in grass.', exampleVi: 'Đi tìm những quả trứng phục sinh vẽ hoa văn giấu trong bãi cỏ.', funFact: 'Quả trứng Phục Sinh tượng trưng cho sự tái sinh và mùa xuân tươi mới.' },
      { id: 'festival_mask', english: 'Festival Mask', ipa: '/ˈfes.tə.vəl mæsk/', vietnamese: 'Mặt Nạ Lễ Hội', category: 'holidays_celebrations', emoji: '🎭', color: '#3B82F6', exampleEn: 'Wear an funny animal mask for the parade.', exampleVi: 'Đeo chiếc mặt nạ con vật ngộ nghĩnh đi trẩy hội.', funFact: 'Mặt nạ hóa trang giúp các lễ hội thêm phần huyền bí và rộn ràng.' },
      { id: 'flower_market', english: 'Flower Market', ipa: '/ˈflaʊ.ɚ ˌmɑːr.kɪt/', vietnamese: 'Chợ Hoa Xuân', category: 'holidays_celebrations', emoji: '🌺', color: '#FB7185', exampleEn: 'Visit the vibrant Tet flower market with yellow apricot blooms.', exampleVi: 'Đi dạo chợ hoa xuân ngắm hoa mai vàng rực rỡ.', funFact: 'Chợ hoa ngày Tết ngập tràn sắc vàng hoa mai và sắc thắm hoa đào.' },
      { id: 'mooncake', english: 'Mooncake', ipa: '/ˈmuːn.keɪk/', vietnamese: 'Bánh Trung Thu', category: 'holidays_celebrations', emoji: '🥮', color: '#D97706', exampleEn: 'Enjoy sweet lotus seed mooncake with warm tea.', exampleVi: 'Thưởng thức bánh trung thu nhân hạt sen cùng chén trà ấm.', funFact: 'Bánh trung thu tròn vẹn tượng trưng cho sự viên mãn và đoàn tụ gia đình.' },
      { id: 'celebration_bell', english: 'Bell', ipa: '/bel/', vietnamese: 'Chiếc Chuông Vàng', category: 'holidays_celebrations', emoji: '🔔', color: '#EAB308', exampleEn: 'Jingle bells ring cheerfully in winter.', exampleVi: 'Tiếng chuông ngân vang rộn rã trong mùa đông an lành.', funFact: 'Tiếng chuông ngân vang báo hiệu những điều may mắn và hân hoan.' },
    ],
  },

  // =========================================================================
  // 24. NHẠC CỤ & ÂM NHẠC (16 TỪ)
  // =========================================================================
  {
    id: 'music_instruments',
    titleEn: 'Musical Instruments',
    titleVi: 'Nhạc Cụ & Âm Nhạc',
    icon: '🎵',
    color: '#8B5CF6',
    cards: [
      { id: 'piano', english: 'Piano', ipa: '/piˈæn.oʊ/', vietnamese: 'Đàn Dương Cầm (Pi-a-nô)', category: 'music_instruments', emoji: '🎹', color: '#1E293B', exampleEn: 'Play sweet classical melodies on the black and white keys.', exampleVi: 'Chơi những giai điệu êm dịu trên phím đàn trắng đen.', funFact: 'Đàn Piano có tới 88 phím đàn và được mệnh danh là vua của các loại nhạc cụ!' },
      { id: 'guitar', english: 'Guitar', ipa: '/ɡɪˈtɑːr/', vietnamese: 'Đàn Ghi-ta', category: 'music_instruments', emoji: '🎸', color: '#D97706', exampleEn: 'Strum the acoustic guitar around the campfire.', exampleVi: 'Gảy đàn ghi-ta mộc mạc bên ánh lửa trại bập bùng.', funFact: 'Đàn ghi-ta cổ điển thường có 6 dây tạo nên âm hưởng ấm áp.' },
      { id: 'drum', english: 'Drum', ipa: '/drʌm/', vietnamese: 'Chiếc Trống', category: 'music_instruments', emoji: '🥁', color: '#DC2626', exampleEn: 'Keep the energetic beat with drumsticks.', exampleVi: 'Giữ nhịp điệu rộn rã bằng dùi trống.', funFact: 'Trống là một trong những nhạc cụ gõ lâu đời nhất của loài người.' },
      { id: 'violin', english: 'Violin', ipa: '/ˌvaɪəˈlɪn/', vietnamese: 'Đàn Vĩ Cầm (Vi-ô-lông)', category: 'music_instruments', emoji: '🎻', color: '#92400E', exampleEn: 'The violin produces high and graceful tunes.', exampleVi: 'Đàn vĩ cầm cất lên những âm thanh thanh thoát và du dương.', funFact: 'Cây vĩ để kéo đàn vĩ cầm thường được làm từ lông đuôi ngựa thật.' },
      { id: 'flute', english: 'Flute', ipa: '/fluːt/', vietnamese: 'Cây Sáo', category: 'music_instruments', emoji: '🪈', color: '#64748B', exampleEn: 'Blow gentle air to create sweet flute sounds.', exampleVi: 'Thổi luồng hơi nhẹ nhàng tạo nên tiếng sáo ngọt ngào.', funFact: 'Tiếng sáo trong trẻo thánh thót tựa như tiếng chim hót giữa rừng xanh.' },
      { id: 'trumpet', english: 'Trumpet', ipa: '/ˈtrʌm.pɪt/', vietnamese: 'Kèn Trăm-pét', category: 'music_instruments', emoji: '🎺', color: '#EAB308', exampleEn: 'The golden trumpet sounds triumphant and loud.', exampleVi: 'Chiếc kèn đồng vang lên khúc ca khải hoàn rực rỡ.', funFact: 'Kèn trumpet làm bằng đồng thau sáng bóng có âm lượng rất vang dội.' },
      { id: 'bell_inst', english: 'Bell', ipa: '/bel/', vietnamese: 'Chiếc Chuông', category: 'music_instruments', emoji: '🔔', color: '#FACC15', exampleEn: 'Clear bell rings with a joyful chime.', exampleVi: 'Tiếng chuông reo vang âm thanh trong trẻo vui tai.', funFact: 'Chuông nhỏ bằng đồng phát ra âm thanh cộng hưởng ngân dài.' },
      { id: 'microphone', english: 'Microphone', ipa: '/ˈmaɪ.krə.foʊn/', vietnamese: 'Mi-crô Ca Hát', category: 'music_instruments', emoji: '🎤', color: '#EC4899', exampleEn: 'Sing your heart out into the microphone.', exampleVi: 'Cất cao giọng hát say sưa vào chiếc mi-crô.', funFact: 'Mi-crô biến đổi sóng âm thanh thành tín hiệu điện tử để khuếch đại to hơn.' },
      { id: 'song', english: 'Song', ipa: '/sɑːŋ/', vietnamese: 'Bài Hát', category: 'music_instruments', emoji: '🎶', color: '#3B82F6', exampleEn: 'Learn a cheerful English nursery rhyme song.', exampleVi: 'Học một bài hát thiếu nhi tiếng Anh vui nhộn.', funFact: 'Học tiếng Anh qua bài hát giúp bé ghi nhớ từ vựng nhanh gấp 3 lần!' },
      { id: 'melody', english: 'Melody', ipa: '/ˈmel.ə.di/', vietnamese: 'Giai Điệu', category: 'music_instruments', emoji: '🎼', color: '#10B981', exampleEn: 'A sweet gentle lullaby melody.', exampleVi: 'Giai điệu bài hát ru êm đềm đưa bé vào giấc ngủ ngon.', funFact: 'Giai điệu âm nhạc giúp kích thích não bộ phát triển trí thông minh cảm xúc.' },
      { id: 'rhythm', english: 'Rhythm', ipa: '/ˈrɪð.əm/', vietnamese: 'Nhịp Điệu', category: 'music_instruments', emoji: '🥁', color: '#F97316', exampleEn: 'Clap your hands to the lively rhythm.', exampleVi: 'Vỗ đôi bàn tay theo nhịp điệu rộn ràng.', funFact: 'Nhịp điệu có ở khắp nơi: tiếng tim đập, tiếng bước chân, tiếng sóng vỗ.' },
      { id: 'harmonica', english: 'Harmonica', ipa: '/hɑːrˈmɑː.nɪ.kə/', vietnamese: 'Kèn Hác-mô-ni-ca', category: 'music_instruments', emoji: '🪗', color: '#06B6D4', exampleEn: 'A pocket-sized harmonica you can play anywhere.', exampleVi: 'Cây kèn hác-mô-ni-ca nhỏ gọn bỏ túi mang đi khắp nơi.', funFact: 'Kèn harmonica phát ra âm thanh cả khi bạn thổi ra lẫn hít vào.' },
      { id: 'saxophone', english: 'Saxophone', ipa: '/ˈsæk.sə.foʊn/', vietnamese: 'Kèn Sắc-xô-phôn', category: 'music_instruments', emoji: '🎷', color: '#CA8A04', exampleEn: 'Smooth jazz melodies on the shiny saxophone.', exampleVi: 'Những giai điệu nhạc jazz êm ái trên chiếc kèn sắc-xô-phôn vàng.', funFact: 'Kèn saxophone tuy làm bằng đồng nhưng thuộc bộ nhạc cụ hơi gỗ.' },
      { id: 'accordion', english: 'Accordion', ipa: '/əˈkɔːr.di.ən/', vietnamese: 'Đàn Phong Cầm', category: 'music_instruments', emoji: '🪗', color: '#B45309', exampleEn: 'Expand and squeeze the accordion bellows.', exampleVi: 'Kéo ra rồi ép vào hộp gió đàn phong cầm để tạo âm thanh.', funFact: 'Đàn phong cầm vừa có bàn phím vừa có bộ nút bấm đệm hợp âm.' },
      { id: 'headphones', english: 'Headphones', ipa: '/ˈhed.foʊnz/', vietnamese: 'Tai Nghe', category: 'music_instruments', emoji: '🎧', color: '#6366F1', exampleEn: 'Put on headphones to listen to crisp audio.', exampleVi: 'Đeo tai nghe để lắng nghe âm thanh trong trẻo rõ ràng.', funFact: 'Không nên nghe tai nghe ở âm lượng quá lớn để bảo vệ màng nhĩ.' },
      { id: 'music_note', english: 'Music Note', ipa: '/ˈmjuː.zɪk noʊt/', vietnamese: 'Nốt Nhạc', category: 'music_instruments', emoji: '🎵', color: '#F43F5E', exampleEn: 'Seven basic music notes: Do, Re, Mi, Fa, Sol, La, Si.', exampleVi: 'Bảy nốt nhạc cơ bản: Đồ, Rê, Mi, Pha, Son, La, Si.', funFact: 'Chỉ từ 7 nốt nhạc cơ bản, con người đã sáng tác ra hàng triệu bản nhạc bất hủ.' },
    ],
  },

  // =========================================================================
  // 25. VỊ TRÍ & PHƯƠNG HƯỚNG (16 TỪ)
  // =========================================================================
  {
    id: 'positions_directions',
    titleEn: 'Positions & Directions',
    titleVi: 'Vị Trí & Phương Hướng',
    icon: '🧭',
    color: '#059669',
    cards: [
      { id: 'in', english: 'In (Inside)', ipa: '/ɪn/', vietnamese: 'Ở Bên Trong', category: 'positions_directions', emoji: '📥', color: '#3B82F6', exampleEn: 'The pencil is in the pencil case.', exampleVi: 'Cây bút chì nằm ở bên trong hộp bút.', funFact: 'Giới từ chỉ vị trí giúp chúng ta mô tả đồ vật nằm ở đâu một cách chính xác.' },
      { id: 'on', english: 'On', ipa: '/ɑːn/', vietnamese: 'Ở Phía Trên', category: 'positions_directions', emoji: '🔛', color: '#10B981', exampleEn: 'The red apple sits on the table.', exampleVi: 'Quả táo đỏ nằm ở trên mặt bàn.', funFact: 'Dùng "On" khi đồ vật tiếp xúc trực tiếp trên bề mặt của vật khác.' },
      { id: 'under', english: 'Under', ipa: '/ˈʌn.dɚ/', vietnamese: 'Ở Phía Dưới', category: 'positions_directions', emoji: '👇', color: '#F59E0B', exampleEn: 'The cat sleeps under the warm chair.', exampleVi: 'Chú mèo con nằm ngủ ở dưới chiếc ghế ấm áp.', funFact: 'Mèo rất thích chui xuống dưới gầm giường vì cảm thấy an toàn.' },
      { id: 'behind', english: 'Behind', ipa: '/bɪˈhaɪnd/', vietnamese: 'Ở Phía Sau', category: 'positions_directions', emoji: '🙈', color: '#6366F1', exampleEn: 'The boy hides behind the big tree.', exampleVi: 'Cậu bé trốn ở phía sau thân cây to.', funFact: 'Chơi trốn tìm giúp rèn luyện khả năng định hướng không gian tuyệt vời.' },
      { id: 'in_front_of', english: 'In front of', ipa: '/ɪn frʌnt ʌv/', vietnamese: 'Ở Phía Trước', category: 'positions_directions', emoji: '🚶', color: '#EC4899', exampleEn: 'Stand politely in front of the teacher.', exampleVi: 'Đứng lễ phép ở phía trước mặt thầy cô.', funFact: 'Nhìn thẳng về phía trước giúp chúng ta bước đi vững vàng tự tin.' },
      { id: 'next_to', english: 'Next to (Beside)', ipa: '/nekst tuː/', vietnamese: 'Ở Ngay Bên Cạnh', category: 'positions_directions', emoji: '🤝', color: '#0284C7', exampleEn: 'Sit next to your best friend in class.', exampleVi: 'Ngồi ngay bên cạnh người bạn thân trong lớp học.', funFact: 'Có một người bạn tốt ngồi bên cạnh làm giờ học thêm vui vẻ.' },
      { id: 'between', english: 'Between', ipa: '/bɪˈtwiːn/', vietnamese: 'Ở Giữa (2 vật)', category: 'positions_directions', emoji: '🥪', color: '#D97706', exampleEn: 'The strawberry is between two cookies.', exampleVi: 'Quả dâu tây nằm ở giữa hai chiếc bánh quy.', funFact: 'Dùng "between" khi ở giữa 2 đối tượng và "among" khi ở giữa nhiều đối tượng.' },
      { id: 'above', english: 'Above', ipa: '/əˈbʌv/', vietnamese: 'Ở Cao Hơn', category: 'positions_directions', emoji: '☁️', color: '#06B6D4', exampleEn: 'Birds fly high above the green forest.', exampleVi: 'Những chú chim bay lượn ở trên cao phía trên khu rừng.', funFact: 'Dùng "Above" khi không có sự tiếp xúc bề mặt.' },
      { id: 'left', english: 'Left', ipa: '/left/', vietnamese: 'Bên Tay Trái', category: 'positions_directions', emoji: '👈', color: '#8B5CF6', exampleEn: 'Raise your left hand high.', exampleVi: 'Giơ cao bàn tay bên trái của bé lên nào.', funFact: 'Khoảng 10% dân số trên thế giới thuận tay trái đấy!' },
      { id: 'right', english: 'Right', ipa: '/raɪt/', vietnamese: 'Bên Tay Phải', category: 'positions_directions', emoji: '👉', color: '#EF4444', exampleEn: 'Turn right at the green corner.', exampleVi: 'Rẽ về phía bên phải ở góc đường xanh.', funFact: 'Hầu hết mọi người dùng tay phải để cầm bút viết chữ.' },
      { id: 'near', english: 'Near (Close)', ipa: '/nɪr/', vietnamese: 'Ở Gần', category: 'positions_directions', emoji: '📍', color: '#16A34A', exampleEn: 'The cozy school is near my house.', exampleVi: 'Trường học thân yêu nằm ở rất gần nhà bé.', funFact: 'Trường ở gần giúp bé có thể thong thả đi bộ đến lớp mỗi sáng.' },
      { id: 'far', english: 'Far', ipa: '/fɑːr/', vietnamese: 'Ở Xa', category: 'positions_directions', emoji: '🔭', color: '#475569', exampleEn: 'Twinkling stars are far away in space.', exampleVi: 'Những vì sao lấp lánh ở rất xa trong không gian vũ trụ.', funFact: 'Ánh sáng từ ngôi sao xa xôi mất hàng triệu năm mới đến được mắt ta.' },
      { id: 'inside', english: 'Inside', ipa: '/ɪnˈsaɪd/', vietnamese: 'Phía Bên Trong', category: 'positions_directions', emoji: '🏠', color: '#EA580C', exampleEn: 'Stay warm inside when it rains.', exampleVi: 'Ở ấm áp bên trong nhà khi trời đổ mưa.', funFact: 'Bên trong ngôi nhà luôn là nơi an toàn và ấm áp nhất.' },
      { id: 'outside', english: 'Outside', ipa: '/ˌaʊtˈsaɪd/', vietnamese: 'Phía Bên Ngoài', category: 'positions_directions', emoji: '🌳', color: '#10B981', exampleEn: 'Play tag outside under the sunshine.', exampleVi: 'Vui chơi ngoài trời dưới ánh nắng chan hòa.', funFact: 'Hoạt động ngoài trời giúp trẻ em năng động và sáng tạo hơn.' },
      { id: 'north', english: 'North', ipa: '/nɔːrθ/', vietnamese: 'Hướng Bắc', category: 'positions_directions', emoji: '🧭', color: '#0284C7', exampleEn: 'The red compass needle always points North.', exampleVi: 'Kim la bàn màu đỏ luôn luôn chỉ về hướng Bắc.', funFact: 'Từ trường Trái Đất giúp kim la bàn tự động định vị phương hướng chuẩn xác.' },
      { id: 'south', english: 'South', ipa: '/saʊθ/', vietnamese: 'Hướng Nam', category: 'positions_directions', emoji: '🧭', color: '#DC2626', exampleEn: 'Migrating birds fly South for the warm winter.', exampleVi: 'Đàn chim di cư bay về phương Nam để tránh rét mùa đông.', funFact: 'Chim muông có khả năng cảm nhận từ trường để bay hàng ngàn dặm không lạc đường.' },
    ],
  },

  // =========================================================================
  // 26. THỜI GIAN & LỊCH TRÌNH (18 TỪ)
  // =========================================================================
  {
    id: 'time_calendar',
    titleEn: 'Days & Time',
    titleVi: 'Thời Gian & Lịch Trình',
    icon: '📅',
    color: '#0284C7',
    cards: [
      { id: 'monday', english: 'Monday', ipa: '/ˈmʌn.deɪ/', vietnamese: 'Thứ Hai', category: 'time_calendar', emoji: '📅', color: '#EF4444', exampleEn: 'Monday is the exciting start of the school week.', exampleVi: 'Thứ Hai là ngày khởi đầu tuần học mới tràn đầy hứng khởi.', funFact: 'Thứ Hai được đặt tên theo Mặt trăng (Moon Day trong tiếng Anh cổ).' },
      { id: 'tuesday', english: 'Tuesday', ipa: '/ˈtuːz.deɪ/', vietnamese: 'Thứ Ba', category: 'time_calendar', emoji: '📅', color: '#F97316', exampleEn: 'We have fun music class on Tuesday.', exampleVi: 'Chúng em có tiết học âm nhạc vui nhộn vào ngày Thứ Ba.', funFact: 'Thứ Ba tràn đầy năng lượng học tập và sáng tạo.' },
      { id: 'wednesday', english: 'Wednesday', ipa: '/ˈwenz.deɪ/', vietnamese: 'Thứ Tư', category: 'time_calendar', emoji: '📅', color: '#F59E0B', exampleEn: 'Wednesday is right in the middle of the week.', exampleVi: 'Thứ Tư là ngày nằm chính giữa tuần học.', funFact: 'Chữ cái "d" trong từ Wednesday là âm câm không phát âm ra.' },
      { id: 'thursday', english: 'Thursday', ipa: '/ˈθɝːz.deɪ/', vietnamese: 'Thứ Năm', category: 'time_calendar', emoji: '📅', color: '#10B981', exampleEn: 'Thursday brings exciting science experiments.', exampleVi: 'Thứ Năm có những tiết thí nghiệm khoa học kỳ thú.', funFact: 'Thứ Năm được đặt tên theo thần Sấm sét Thor dũng mãnh.' },
      { id: 'friday', english: 'Friday', ipa: '/ˈfraɪ.deɪ/', vietnamese: 'Thứ Sáu', category: 'time_calendar', emoji: '📅', color: '#06B6D4', exampleEn: 'Friday afternoon means the weekend is here!', exampleVi: 'Chiều Thứ Sáu báo hiệu kỳ nghỉ cuối tuần sắp tới rồi!', funFact: 'Thứ Sáu là ngày kết thúc tuần học tập chăm chỉ để chuẩn bị nghỉ ngơi.' },
      { id: 'saturday', english: 'Saturday', ipa: '/ˈsæt̬.ɚ.deɪ/', vietnamese: 'Thứ Bảy', category: 'time_calendar', emoji: '🎉', color: '#8B5CF6', exampleEn: 'Go to the zoo with family on Saturday.', exampleVi: 'Cùng gia đình đi sở thú vui chơi vào ngày Thứ Bảy.', funFact: 'Thứ Bảy là ngày tuyệt vời cho các hoạt động dã ngoại ngoài trời.' },
      { id: 'sunday', english: 'Sunday', ipa: '/ˈsʌn.deɪ/', vietnamese: 'Chủ Nhật', category: 'time_calendar', emoji: '☀️', color: '#EC4899', exampleEn: 'Relax and read books on peaceful Sunday.', exampleVi: 'Nghỉ ngơi và đọc sách thư giãn vào ngày Chủ Nhật êm đềm.', funFact: 'Chủ Nhật được đặt tên theo Mặt trời (Sun Day) ấm áp.' },
      { id: 'morning', english: 'Morning', ipa: '/ˈmɔːr.nɪŋ/', vietnamese: 'Buổi Sáng', category: 'time_calendar', emoji: '🌅', color: '#FBBF24', exampleEn: 'Say Good Morning with a bright smile.', exampleVi: 'Chào buổi sáng bằng một nụ cười tươi rạng rỡ.', funFact: 'Tập thể dục buổi sáng giúp cơ thể nạp năng lượng cho cả ngày dài.' },
      { id: 'afternoon', english: 'Afternoon', ipa: '/ˌæf.tɚˈnuːn/', vietnamese: 'Buổi Chiều', category: 'time_calendar', emoji: '☀️', color: '#F97316', exampleEn: 'Play soccer in the sunny afternoon.', exampleVi: 'Chơi đá bóng vào buổi chiều ngập tràn ánh nắng.', funFact: 'Sau giấc ngủ trưa ngắn, cơ thể tỉnh táo học tập buổi chiều hiệu quả.' },
      { id: 'evening', english: 'Evening', ipa: '/ˈiːv.nɪŋ/', vietnamese: 'Buổi Tối', category: 'time_calendar', emoji: '🌆', color: '#6366F1', exampleEn: 'Family dinner together in the warm evening.', exampleVi: 'Cả nhà cùng quây quần ăn bữa cơm tối ấm áp.', funFact: 'Buổi tối là thời gian gắn kết yêu thương giữa các thành viên trong gia đình.' },
      { id: 'night', english: 'Night', ipa: '/naɪt/', vietnamese: 'Ban Đêm', category: 'time_calendar', emoji: '🌙', color: '#0F172A', exampleEn: 'Say Good Night and have sweet dreams.', exampleVi: 'Chúc ngủ ngon và có những giấc mơ thần tiên tuyệt đẹp.', funFact: 'Bầu trời đêm huyền ảo với muôn vàn vì sao lấp lánh.' },
      { id: 'yesterday', english: 'Yesterday', ipa: '/ˈjes.tɚ.deɪ/', vietnamese: 'Ngày Hôm Qua', category: 'time_calendar', emoji: '⏮️', color: '#64748B', exampleEn: 'Yesterday was a wonderful memory.', exampleVi: 'Ngày hôm qua đã trở thành một kỷ niệm đẹp.', funFact: 'Những bài học hôm qua giúp bé trưởng thành và thông minh hơn hôm nay.' },
      { id: 'today', english: 'Today', ipa: '/təˈdeɪ/', vietnamese: 'Ngày Hôm Nay', category: 'time_calendar', emoji: '▶️', color: '#16A34A', exampleEn: 'Today is a brand new gift to learn and play.', exampleVi: 'Ngày hôm nay là một món quà mới để bé học tập và vui chơi.', funFact: 'Hiện tại là món quà quý giá nhất, hãy tận hưởng từng phút giây!' },
      { id: 'tomorrow', english: 'Tomorrow', ipa: '/təˈmɔːr.oʊ/', vietnamese: 'Ngày Mai', category: 'time_calendar', emoji: '⏭️', color: '#2563EB', exampleEn: 'Tomorrow will bring new exciting adventures.', exampleVi: 'Ngày mai sẽ mang đến bao điều mới lạ đang chờ đón bé.', funFact: 'Luôn giữ tinh thần lạc quan và háo hức đón chào ngày mới.' },
      { id: 'month', english: 'Month', ipa: '/mʌnθ/', vietnamese: 'Tháng', category: 'time_calendar', emoji: '🗓️', color: '#7C3AED', exampleEn: 'There are twelve months in one year.', exampleVi: 'Có mười hai tháng trong một năm tròn.', funFact: 'Một tháng thường có từ 30 đến 31 ngày, riêng tháng Hai có 28 hoặc 29 ngày.' },
      { id: 'year', english: 'Year', ipa: '/jɪr/', vietnamese: 'Năm', category: 'time_calendar', emoji: '🌍', color: '#D97706', exampleEn: 'Happy New Year full of happiness!', exampleVi: 'Chúc mừng năm mới tràn ngập niềm vui và hạnh phúc!', funFact: 'Một năm là khoảng thời gian Trái Đất quay trọn vẹn một vòng quanh Mặt trời (365 ngày).' },
      { id: 'hour', english: 'Hour', ipa: '/aʊr/', vietnamese: 'Giờ Đồng Hồ', category: 'time_calendar', emoji: '⏳', color: '#EA580C', exampleEn: 'One hour has sixty precious minutes.', exampleVi: 'Một giờ đồng hồ có sáu mươi phút quý giá.', funFact: 'Chữ cái "h" trong từ Hour là âm câm không đọc ra.' },
      { id: 'minute', english: 'Minute', ipa: '/ˈmɪn.ɪt/', vietnamese: 'Phút', category: 'time_calendar', emoji: '⏱️', color: '#059669', exampleEn: 'Spend five minutes reading every morning.', exampleVi: 'Dành năm phút đọc sách mỗi buổi sáng sớm.', funFact: 'Mỗi phút trôi qua kim giây trên đồng hồ quay đều đặn đúng 60 vòng.' },
    ],
  },

  // =========================================================================
  // 27. ĐỊA ĐIỂM TRONG THÀNH PHỐ (18 TỪ)
  // =========================================================================
  {
    id: 'places_city',
    titleEn: 'Places in Town',
    titleVi: 'Địa Điểm Thành Phố',
    icon: '🏥',
    color: '#059669',
    cards: [
      { id: 'hospital', english: 'Hospital', ipa: '/ˈhɑː.spɪ.t̬əl/', vietnamese: 'Bệnh Viện', category: 'places_city', emoji: '🏥', color: '#EF4444', exampleEn: 'Doctors and nurses care for sick people in the hospital.', exampleVi: 'Bác sĩ và y tá chăm sóc người bệnh chu đáo trong bệnh viện.', funFact: 'Bệnh viện luôn mở cửa 24/7 để sẵn sàng cứu chữa cho mọi người.' },
      { id: 'school_place', english: 'School', ipa: '/skuːl/', vietnamese: 'Trường Học', category: 'places_city', emoji: '🏫', color: '#3B82F6', exampleEn: 'Children learn and play together at school.', exampleVi: 'Các bạn học sinh cùng học tập và vui chơi tại trường học.', funFact: 'Trường học là ngôi nhà thứ hai thân thương nuôi dưỡng ước mơ tuổi thơ.' },
      { id: 'supermarket', english: 'Supermarket', ipa: '/ˈsuː.pɚˌmɑːr.kɪt/', vietnamese: 'Siêu Thị', category: 'places_city', emoji: '🛒', color: '#10B981', exampleEn: 'Buy fresh groceries and fruits at the supermarket.', exampleVi: 'Mua sắm thực phẩm tươi ngon và hoa quả tại siêu thị.', funFact: 'Siêu thị hiện đại có hàng ngàn mặt hàng được sắp xếp gọn gàng trên kệ.' },
      { id: 'park_place', english: 'Park', ipa: '/pɑːrk/', vietnamese: 'Công Viên', category: 'places_city', emoji: '🌳', color: '#16A34A', exampleEn: 'Run and play happily in the green park.', exampleVi: 'Chạy nhảy vui vẻ trong công viên xanh rợp bóng mát.', funFact: 'Công viên được ví như lá phổi xanh thanh lọc không khí cho thành phố.' },
      { id: 'cinema', english: 'Cinema (Movie Theater)', ipa: '/ˈsɪn.ə.mə/', vietnamese: 'Rạp Chiếu Phim', category: 'places_city', emoji: '🎬', color: '#8B5CF6', exampleEn: 'Watch 3D animated cartoons at the cinema.', exampleVi: 'Xem phim hoạt hình 3D hấp dẫn tại rạp chiếu phim.', funFact: 'Rạp chiếu phim có màn hình khổng lồ và hệ thống âm thanh vòm sống động.' },
      { id: 'bakery', english: 'Bakery', ipa: '/ˈbeɪ.kɚ.i/', vietnamese: 'Tiệm Bánh Mì', category: 'places_city', emoji: '🥖', color: '#D97706', exampleEn: 'Sweet aroma of fresh bread from the bakery.', exampleVi: 'Mùi bánh mì mới ra lò thơm ngát tỏa ra từ tiệm bánh.', funFact: 'Thợ làm bánh thức dậy từ sáng sớm tinh mơ để nướng những mẻ bánh nóng hổi.' },
      { id: 'bank', english: 'Bank', ipa: '/bæŋk/', vietnamese: 'Ngân Hàng', category: 'places_city', emoji: '🏦', color: '#0284C7', exampleEn: 'Keep money safe inside the bank.', exampleVi: 'Cất giữ tiền tiết kiệm an toàn trong ngân hàng.', funFact: 'Tiết kiệm những đồng tiền nhỏ hôm nay sẽ giúp bé thực hiện ước mơ lớn mai sau.' },
      { id: 'museum', english: 'Museum', ipa: '/mjuːˈziː.əm/', vietnamese: 'Bảo Tàng', category: 'places_city', emoji: '🏛️', color: '#78350F', exampleEn: 'See ancient dinosaur bones in the museum.', exampleVi: 'Chiêm ngưỡng những bộ xương khủng long cổ đại trong bảo tàng.', funFact: 'Bảo tàng lưu giữ những hiện vật lịch sử và văn hóa quý giá của nhân loại.' },
      { id: 'airport', english: 'Airport', ipa: '/ˈer.pɔːrt/', vietnamese: 'Sân Bay', category: 'places_city', emoji: '🛫', color: '#06B6D4', exampleEn: 'Airplanes take off and land on the airport runway.', exampleVi: 'Máy bay cất cánh và hạ cánh trên đường băng sân bay.', funFact: 'Sân bay kết nối mọi quốc gia trên thế giới lại gần nhau hơn.' },
      { id: 'hotel', english: 'Hotel', ipa: '/hoʊˈtel/', vietnamese: 'Khách Sạn', category: 'places_city', emoji: '🏨', color: '#EC4899', exampleEn: 'Stay in a cozy hotel room during vacation.', exampleVi: 'Nghỉ ngơi trong căn phòng khách sạn tiện nghi khi đi du lịch.', funFact: 'Khách sạn có dịch vụ dọn phòng chu đáo giúp du khách cảm thấy thoải mái như ở nhà.' },
      { id: 'bridge', english: 'Bridge', ipa: '/brɪdʒ/', vietnamese: 'Cây Cầu', category: 'places_city', emoji: '🌉', color: '#EA580C', exampleEn: 'The majestic bridge spans across the big river.', exampleVi: 'Cây cầu uy nghi bắc ngang qua dòng sông lớn.', funFact: 'Cầu Cổng Vàng ở San Francisco là một trong những cây cầu nổi tiếng nhất thế giới.' },
      { id: 'zoo_place', english: 'Zoo', ipa: '/zuː/', vietnamese: 'Vườn Thú / Sở Thú', category: 'places_city', emoji: '🦁', color: '#EAB308', exampleEn: 'Visit cute animals at the city zoo.', exampleVi: 'Thăm những con thú đáng yêu tại sở thú thành phố.', funFact: 'Sở thú giúp bảo tồn và chăm sóc các loài động vật hoang dã quý hiếm.' },
      { id: 'library', english: 'Library', ipa: '/ˈlaɪ.brer.i/', vietnamese: 'Thư Viện', category: 'places_city', emoji: '📚', color: '#6366F1', exampleEn: 'Quietly read books in the spacious library.', exampleVi: 'Đọc sách giữ trật tự trong thư viện rộng thênh thang.', funFact: 'Thư viện là kho tàng tri thức vô tận mở cửa đón chào tất cả mọi người.' },
      { id: 'post_office', english: 'Post Office', ipa: '/ˈpoʊst ˌɑː.fɪs/', vietnamese: 'Bưu Điện', category: 'places_city', emoji: '📮', color: '#DC2626', exampleEn: 'Send a handwritten letter at the post office.', exampleVi: 'Gửi bức thư tay đầy ắp yêu thương tại bưu điện.', funFact: 'Những người đưa thư chăm chỉ chuyển phát thư từ và bưu phẩm đến tận cửa nhà.' },
      { id: 'restaurant', english: 'Restaurant', ipa: '/ˈres.trɑːnt/', vietnamese: 'Nhà Hàng', category: 'places_city', emoji: '🍽️', color: '#F59E0B', exampleEn: 'Enjoy a special delicious dinner at the restaurant.', exampleVi: 'Thưởng thức bữa tối ngon miệng tại nhà hàng.', funFact: 'Nhà hàng phục vụ nhiều món ăn đặc sản từ các nền ẩm thực trên thế giới.' },
      { id: 'fire_station', english: 'Fire Station', ipa: '/ˈfaɪr ˌsteɪ.ʃən/', vietnamese: 'Trạm Cứu Hỏa', category: 'places_city', emoji: '🚒', color: '#EF4444', exampleEn: 'Firefighters are always ready at the fire station.', exampleVi: 'Các chú lính cứu hỏa luôn túc trực sẵn sàng tại trạm cứu hỏa.', funFact: 'Xe cứu hỏa có còi báo động đặc biệt để xin đường khẩn cấp.' },
      { id: 'police_station', english: 'Police Station', ipa: '/pəˈliːs ˌsteɪ.ʃən/', vietnamese: 'Đồn Cảnh Sát', category: 'places_city', emoji: '🚓', color: '#1D4ED8', exampleEn: 'Police officers work hard to protect people.', exampleVi: 'Các chiến sĩ cảnh sát làm việc tận tụy để bảo vệ bình yên cho nhân dân.', funFact: 'Nếu cần sự giúp đỡ khẩn cấp, bạn có thể gọi số điện thoại cảnh sát 113.' },
      { id: 'market', english: 'Traditional Market', ipa: '/ˈmɑːr.kɪt/', vietnamese: 'Chợ Truyền Thống', category: 'places_city', emoji: '🧺', color: '#059669', exampleEn: 'Bustling traditional market with fresh vegetables and fish.', exampleVi: 'Khu chợ truyền thống tấp nập với rau củ tươi ngon và tôm cá.', funFact: 'Chợ truyền thống là nét văn hóa đặc sắc đậm đà tình làng nghĩa xóm.' },
    ],
  },

  // =========================================================================
  // 28. SINH VẬT BIỂN SÂU (16 TỪ)
  // =========================================================================
  {
    id: 'sea_creatures',
    titleEn: 'Deep Ocean Creatures',
    titleVi: 'Sinh Vật Biển Sâu',
    icon: '🐙',
    color: '#0284C7',
    cards: [
      { id: 'octopus', english: 'Octopus', ipa: '/ˈɑːk.tə.pəs/', vietnamese: 'Bạch Tuộc', category: 'sea_creatures', emoji: '🐙', color: '#EC4899', exampleEn: 'The octopus has eight flexible arms and three hearts.', exampleVi: 'Bạch tuộc có tám xúc tua linh hoạt và ba trái tim kỳ diệu.', funFact: 'Bạch tuộc có thể đổi màu da trong tích tắc để ngụy trang ẩn nấp kẻ thù!' },
      { id: 'jellyfish', english: 'Jellyfish', ipa: '/ˈdʒel.i.fɪʃ/', vietnamese: 'Con Sứa Biển', category: 'sea_creatures', emoji: '🪼', color: '#C084FC', exampleEn: 'The translucent jellyfish glows in the dark water.', exampleVi: 'Con sứa biển trong suốt phát sáng lung linh dưới làn nước thẳm.', funFact: 'Sứa biển không có não, không có tim hay xương sống mà cơ thể 95% là nước!' },
      { id: 'sea_turtle', english: 'Sea Turtle', ipa: '/ˈsiː ˌtɝː.t̬əl/', vietnamese: 'Rùa Biển (Đồi Mồi)', category: 'sea_creatures', emoji: '🐢', color: '#10B981', exampleEn: 'The sea turtle glides peacefully through coral reefs.', exampleVi: 'Rùa biển lướt đi êm ả qua những rạn san hô rực rỡ.', funFact: 'Rùa biển có thể sống thọ hơn 100 tuổi và bơi hàng ngàn dặm vượt đại dương.' },
      { id: 'seahorse', english: 'Seahorse', ipa: '/ˈsiː.hɔːrs/', vietnamese: 'Cá Ngựa', category: 'sea_creatures', emoji: '🫧', color: '#F59E0B', exampleEn: 'The tiny seahorse holds onto seagrass with its tail.', exampleVi: 'Chú cá ngựa tí hon dùng đuôi bám chặt vào nhánh cỏ biển.', funFact: 'Ở loài cá ngựa, chính cá ngựa bố là người mang trứng và sinh ra đàn con nhỏ!' },
      { id: 'starfish', english: 'Starfish', ipa: '/ˈstɑːr.fɪʃ/', vietnamese: 'Sao Biển', category: 'sea_creatures', emoji: '⭐', color: '#F43F5E', exampleEn: 'The colorful starfish rests on the sandy seabed.', exampleVi: 'Con sao biển xinh xắn nằm nghỉ trên đáy cát biển.', funFact: 'Nếu chẳng may bị mất một cánh tay, sao biển có thể tự mọc lại cánh tay mới hoàn chỉnh!' },
      { id: 'crab', english: 'Crab', ipa: '/kræb/', vietnamese: 'Con Cua', category: 'sea_creatures', emoji: '🦀', color: '#EF4444', exampleEn: 'The red crab walks sideways with two big claws.', exampleVi: 'Chú cua đỏ bò ngang với hai chiếc càng to lớn chắc khỏe.', funFact: 'Cua thở bằng mang và luôn di chuyển theo chiều ngang rất ngộ nghĩnh.' },
      { id: 'lobster', english: 'Lobster', ipa: '/ˈlɑːb.stɚ/', vietnamese: 'Tôm Hùm', category: 'sea_creatures', emoji: '🦞', color: '#DC2626', exampleEn: 'The lobster has long antennas and hard shell.', exampleVi: 'Tôm hùm có đôi râu dài và lớp vỏ cứng cáp bảo vệ.', funFact: 'Tôm hùm có thể sống rất lâu và không ngừng lớn lên trong suốt cuộc đời.' },
      { id: 'squid', english: 'Squid', ipa: '/skwɪd/', vietnamese: 'Con Mực', category: 'sea_creatures', emoji: '🦑', color: '#FB7185', exampleEn: 'The squid shoots dark ink to escape danger.', exampleVi: 'Con mực phun ra đám mực đen nhánh để trốn thoát kẻ thù.', funFact: 'Mực ống có đôi mắt to giúp nhìn rõ con mồi dưới đáy biển sâu thẳm.' },
      { id: 'coral', english: 'Coral', ipa: '/ˈkɔːr.əl/', vietnamese: 'San Hô', category: 'sea_creatures', emoji: '🪸', color: '#FB923C', exampleEn: 'Vibrant coral reefs are home to millions of fish.', exampleVi: 'Những rạn san hô rực rỡ là tổ ấm của hàng triệu sinh vật biển.', funFact: 'San hô thực chất là những sinh vật động vật nhỏ bé sống thành quần thể khổng lồ.' },
      { id: 'seal', english: 'Seal', ipa: '/siːl/', vietnamese: 'Hải Cẩu (Chó Biển)', category: 'sea_creatures', emoji: '🦭', color: '#64748B', exampleEn: 'The playful seal claps its flippers on ice.', exampleVi: 'Chú hải cẩu tinh nghịch vỗ đôi vây trên tảng băng trắng.', funFact: 'Hải cẩu có lớp mỡ dày dưới da giúp giữ ấm cơ thể trong làn nước đóng băng.' },
      { id: 'walrus', english: 'Walrus', ipa: '/ˈwɑːl.rəs/', vietnamese: 'Hải Mã', category: 'sea_creatures', emoji: '🦭', color: '#78350F', exampleEn: 'The giant walrus has two long ivory tusks.', exampleVi: 'Hải mã khổng lồ có hai chiếc ngà dài bằng ngà voi.', funFact: 'Hải mã dùng cặp ngà dài để kéo cơ thể nặng hàng tấn trèo lên tảng băng trơn.' },
      { id: 'clam', english: 'Clam', ipa: '/klæm/', vietnamese: 'Con Ngao / Sò', category: 'sea_creatures', emoji: '🦪', color: '#94A3B8', exampleEn: 'A shiny pearl inside the oyster shell.', exampleVi: 'Viên ngọc trai sáng lấp lánh bên trong vỏ con hàu.', funFact: 'Hạt cát nhỏ rơi vào trong vỏ hàu sau nhiều năm sẽ kết tinh thành ngọc trai quý giá.' },
      { id: 'stingray', english: 'Stingray', ipa: '/ˈstɪŋ.reɪ/', vietnamese: 'Cá Đuối', category: 'sea_creatures', emoji: '🐡', color: '#334155', exampleEn: 'The flat stingray glides like a bird in water.', exampleVi: 'Cá đuối phẳng lướt đi uyển chuyển như cánh chim dưới đáy biển.', funFact: 'Cá đuối không có xương cứng mà toàn bộ khung xương được làm từ sụn mềm dẻo.' },
      { id: 'sea_urchin', english: 'Sea Urchin', ipa: '/ˈsiː ˌɝː.tʃɪn/', vietnamese: 'Nhum Biển (Cầu Gai)', category: 'sea_creatures', emoji: '🦔', color: '#1E293B', exampleEn: 'The spiky sea urchin protects itself with sharp needles.', exampleVi: 'Con cầu gai bảo vệ cơ thể bằng những chiếc gai nhọn hoắt.', funFact: 'Cầu gai ăn rong biển giúp giữ cho các rạn san hô luôn sạch sẽ và phát triển.' },
      { id: 'sea_otter', english: 'Sea Otter', ipa: '/ˈsiː ˌɑː.t̬ɚ/', vietnamese: 'Rái Cá Biển', category: 'sea_creatures', emoji: '🦦', color: '#92400E', exampleEn: 'Sea otters hold hands while sleeping so they do not drift away.', exampleVi: 'Rái cá biển nắm chặt tay nhau khi ngủ để không bị sóng cuốn trôi.', funFact: 'Rái cá biển có bộ lông dày nhất trong vương quốc động vật với 1 triệu sợi lông/cm²!' },
      { id: 'eel', english: 'Eel', ipa: '/iːl/', vietnamese: 'Lươn Biển / Cá Chình', category: 'sea_creatures', emoji: '🐍', color: '#059669', exampleEn: 'The electric eel can generate electric sparks.', exampleVi: 'Cá chình điện có thể phóng ra dòng điện để tự vệ.', funFact: 'Lươn biển bơi uốn lượn hình chữ S uyển chuyển qua các khe đá ngầm.' },
    ],
  },

  // =========================================================================
  // 29. KHOA HỌC KỲ DIỆU (16 TỪ)
  // =========================================================================
  {
    id: 'science_wonders',
    titleEn: 'Science & Wonders',
    titleVi: 'Khoa Học Kỳ Diệu',
    icon: '🔬',
    color: '#8B5CF6',
    cards: [
      { id: 'magnet', english: 'Magnet', ipa: '/ˈmæɡ.nət/', vietnamese: 'Nam Châm', category: 'science_wonders', emoji: '🧲', color: '#DC2626', exampleEn: 'The red horseshoe magnet attracts iron nails.', exampleVi: 'Thanh nam châm hình móng ngựa hút những chiếc đinh sắt.', funFact: 'Nam châm có 2 cực Bắc và Nam: Cùng cực thì đẩy nhau, khác cực thì hút nhau!' },
      { id: 'gravity', english: 'Gravity', ipa: '/ˈɡræv.ə.t̬i/', vietnamese: 'Trọng Lực (Lực Hút)', category: 'science_wonders', emoji: '🍎', color: '#10B981', exampleEn: 'Gravity pulls the falling apple to the ground.', exampleVi: 'Trọng lực kéo quả táo rơi thẳng xuống mặt đất.', funFact: 'Nhờ có trọng lực của Trái Đất mà chúng ta có thể đứng vững trên mặt đất không bị bay lơ lửng.' },
      { id: 'light', english: 'Light', ipa: '/laɪt/', vietnamese: 'Ánh Sáng', category: 'science_wonders', emoji: '💡', color: '#FACC15', exampleEn: 'Light travels super fast through space.', exampleVi: 'Ánh sáng di chuyển siêu nhanh qua không gian vũ trụ.', funFact: 'Tốc độ ánh sáng là 300.000 km/s - có thể bay 7,5 vòng quanh Trái Đất chỉ trong 1 giây!' },
      { id: 'shadow', english: 'Shadow', ipa: '/ˈʃæd.oʊ/', vietnamese: 'Bóng Râm / Chiếc Bóng', category: 'science_wonders', emoji: '👤', color: '#334155', exampleEn: 'Your shadow follows you everywhere in the sun.', exampleVi: 'Chiếc bóng luôn đi theo bé khắp mọi nơi dưới ánh mặt trời.', funFact: 'Bóng xuất hiện khi có một vật thể chắn ánh sáng truyền thẳng.' },
      { id: 'electricity', english: 'Electricity', ipa: '/ɪˌlekˈtrɪs.ə.t̬i/', vietnamese: 'Dòng Điện', category: 'science_wonders', emoji: '⚡', color: '#F59E0B', exampleEn: 'Electricity powers our home lights and appliances.', exampleVi: 'Dòng điện thắp sáng bóng đèn và vận hành các thiết bị trong nhà.', funFact: 'Tia sét trên trời là một luồng điện tự nhiên khổng lồ cực kỳ mạnh mẽ.' },
      { id: 'volcano', english: 'Volcano', ipa: '/vɑːlˈkeɪ.noʊ/', vietnamese: 'Núi Lửa', category: 'science_wonders', emoji: '🌋', color: '#EA580C', exampleEn: 'Red hot magma erupts from the active volcano.', exampleVi: 'Dung nham đỏ rực phun trào từ ngọn núi lửa đang hoạt động.', funFact: 'Dung nham núi lửa nguội đi tạo thành những vùng đất đai cực kỳ màu mỡ.' },
      { id: 'energy', english: 'Energy', ipa: '/ˈen.ɚ.dʒi/', vietnamese: 'Năng Lượng', category: 'science_wonders', emoji: '🔋', color: '#16A34A', exampleEn: 'Solar panels turn sunshine into clean energy.', exampleVi: 'Tấm pin mặt trời biến ánh nắng thành nguồn năng lượng sạch.', funFact: 'Năng lượng không tự nhiên sinh ra hay mất đi mà chỉ chuyển hóa từ dạng này sang dạng khác.' },
      { id: 'telescope', english: 'Telescope', ipa: '/ˈtel.ə.skoʊp/', vietnamese: 'Kính Thiên Văn', category: 'science_wonders', emoji: '🔭', color: '#3B82F6', exampleEn: 'Look at craters on the Moon through a telescope.', exampleVi: 'Ngắm nhìn các miệng hố trên Mặt trăng qua kính thiên văn.', funFact: 'Kính thiên văn không gian Hubble chụp được những bức ảnh tuyệt đẹp về các thiên hà xa xôi.' },
      { id: 'microscope', english: 'Microscope', ipa: '/ˈmaɪ.krə.skoʊp/', vietnamese: 'Kính Hiển Vi', category: 'science_wonders', emoji: '🔬', color: '#8B5CF6', exampleEn: 'Discover tiny cells through the powerful microscope.', exampleVi: 'Khám phá những tế bào tí hon qua chiếc kính hiển vi hiện đại.', funFact: 'Kính hiển vi có thể phóng đại hình ảnh lên hàng triệu lần giúp nhìn rõ từng con vi khuẩn.' },
      { id: 'fossil', english: 'Fossil', ipa: '/ˈfɑː.səl/', vietnamese: 'Hóa Thạch', category: 'science_wonders', emoji: '🦴', color: '#92400E', exampleEn: 'Dinosaur footprints preserved in ancient rock fossils.', exampleVi: 'Dấu chân khủng long được lưu giữ trong những tảng đá hóa thạch cổ xưa.', funFact: 'Hóa thạch là những dấu tích của sinh vật sống từ hàng triệu năm trước để lại.' },
      { id: 'galaxy', english: 'Galaxy', ipa: '/ˈɡæl.ək.si/', vietnamese: 'Thiên Hà (Dải Ngân Hà)', category: 'science_wonders', emoji: '🌌', color: '#6366F1', exampleEn: 'Our Milky Way galaxy contains billions of stars.', exampleVi: 'Dải Ngân Hà của chúng ta chứa hàng trăm tỷ ngôi sao lấp lánh.', funFact: 'Có hàng trăm tỷ thiên hà khác nhau trong vũ trụ bao la không giới hạn.' },
      { id: 'prism', english: 'Prism', ipa: '/ˈprɪz.əm/', vietnamese: 'Lăng Kính', category: 'science_wonders', emoji: '💎', color: '#38BDF8', exampleEn: 'A glass prism splits white light into a rainbow of colors.', exampleVi: 'Lăng kính thủy tinh phân tách ánh sáng trắng thành 7 sắc cầu vồng.', funFact: 'Nhà bác học Isaac Newton là người đầu tiên dùng lăng kính khám phá bí mật của ánh sáng.' },
      { id: 'sound_wave', english: 'Sound Wave', ipa: '/saʊnd weɪv/', vietnamese: 'Sóng Âm Thanh', category: 'science_wonders', emoji: '🔊', color: '#EC4899', exampleEn: 'Sound travels as invisible vibrating waves through the air.', exampleVi: 'Âm thanh truyền đi dưới dạng những làn sóng rung động vô hình trong không khí.', funFact: 'Trong chân không vũ trụ không có không khí nên hoàn toàn không có âm thanh nào truyền đi được.' },
      { id: 'chemistry', english: 'Chemistry', ipa: '/ˈkem.ə.stri/', vietnamese: 'Hóa Học', category: 'science_wonders', emoji: '🧪', color: '#06B6D4', exampleEn: 'Mixing liquids creates fun colorful chemical reactions.', exampleVi: 'Pha trộn các chất lỏng tạo nên những phản ứng hóa học đổi màu kỳ thú.', funFact: 'Mọi vật chất quanh ta: từ nước, không khí đến cơ thể đều được cấu tạo từ các nguyên tố hóa học.' },
      { id: 'atom', english: 'Atom', ipa: '/ˈæt̬.əm/', vietnamese: 'Nguyên Tử', category: 'science_wonders', emoji: '⚛️', color: '#F43F5E', exampleEn: 'Atoms are the tiny building blocks of everything.', exampleVi: 'Nguyên tử là những viên gạch tí hon cấu tạo nên vạn vật trong vũ trụ.', funFact: 'Một triệu nguyên tử xếp thẳng hàng mới bằng độ dày của một sợi tóc mỏng manh!' },
      { id: 'laboratory', english: 'Laboratory (Lab)', ipa: '/ˈlæb.rə.tɔːr.i/', vietnamese: 'Phòng Thí Nghiệm', category: 'science_wonders', emoji: '🏢', color: '#14B8A6', exampleEn: 'Scientists wear white coats to conduct experiments in the lab.', exampleVi: 'Các nhà khoa học mặc áo choàng trắng làm thí nghiệm trong phòng nghiên cứu.', funFact: 'Phòng thí nghiệm là nơi ra đời của những loại vắc-xin và phát minh cứu sống nhân loại.' },
    ],
  },

  // =========================================================================
  // 30. TÍNH TỪ ĐỐI LẬP (18 TỪ)
  // =========================================================================
  {
    id: 'opposite_adjectives',
    titleEn: 'Opposite Adjectives',
    titleVi: 'Tính Từ Đối Lập',
    icon: '⚖️',
    color: '#D97706',
    cards: [
      { id: 'big', english: 'Big', ipa: '/bɪɡ/', vietnamese: 'To Lớn', category: 'opposite_adjectives', emoji: '🐘', color: '#2563EB', exampleEn: 'The elephant is very big and strong.', exampleVi: 'Chú voi rất to lớn và khỏe mạnh.', funFact: 'Cá voi xanh là sinh vật to lớn nhất từng tồn tại trên Trái Đất.' },
      { id: 'small', english: 'Small', ipa: '/smɑːl/', vietnamese: 'Nhỏ Bé', category: 'opposite_adjectives', emoji: '🐜', color: '#F59E0B', exampleEn: 'The little ant carries a crumb.', exampleVi: 'Chú kiến nhỏ bé tha mẩu bánh mì về tổ.', funFact: 'Dù nhỏ bé nhưng các bạn kiến có sức mạnh phi thường nâng vật nặng gấp 50 lần.' },
      { id: 'tall', english: 'Tall', ipa: '/tɑːl/', vietnamese: 'Cao', category: 'opposite_adjectives', emoji: '🦒', color: '#16A34A', exampleEn: 'The giraffe has a tall slender neck.', exampleVi: 'Chú hươu cao cổ có chiếc cổ cao thanh mảnh.', funFact: 'Hươu cao cổ có thể cao tới gần 6 mét!' },
      { id: 'short', english: 'Short', ipa: '/ʃɔːrt/', vietnamese: 'Thấp / Ngắn', category: 'opposite_adjectives', emoji: '🐕', color: '#78350F', exampleEn: 'The Corgi puppy has cute short legs.', exampleVi: 'Chú cún Corgi có bốn chiếc chân ngắn lũn cũn đáng yêu.', funFact: 'Từ "Short" vừa có nghĩa là chiều cao thấp, vừa có nghĩa là chiều dài ngắn.' },
      { id: 'fast', english: 'Fast', ipa: '/fæst/', vietnamese: 'Nhanh Nhẹn', category: 'opposite_adjectives', emoji: '🐆', color: '#EF4444', exampleEn: 'The cheetah runs super fast across the savanna.', exampleVi: 'Báo săn chạy siêu nhanh trên thảo nguyên.', funFact: 'Báo cheetah có thể tăng tốc từ 0 lên 100 km/h chỉ trong 3 giây!' },
      { id: 'slow', english: 'Slow', ipa: '/sloʊ/', vietnamese: 'Chậm Chạp', category: 'opposite_adjectives', emoji: '🐢', color: '#059669', exampleEn: 'The green turtle walks slow and steady.', exampleVi: 'Chú rùa xanh bước đi chậm rãi và kiên trì.', funFact: 'Trong truyện ngụ ngôn, chú rùa kiên nhẫn đã chiến thắng bạn thỏ chạy nhanh!' },
      { id: 'heavy', english: 'Heavy', ipa: '/ˈhev.i/', vietnamese: 'Nặng Nề', category: 'opposite_adjectives', emoji: '🏋️', color: '#475569', exampleEn: 'The iron barbell is very heavy to lift.', exampleVi: 'Quả tạ sắt rất nặng nề khi nâng lên.', funFact: 'Vàng là một trong những kim loại đặc và nặng nhất thế giới.' },
      { id: 'light_weight', english: 'Light', ipa: '/laɪt/', vietnamese: 'Nhẹ Nhàng', category: 'opposite_adjectives', emoji: '🪶', color: '#38BDF8', exampleEn: 'A soft bird feather is light as air.', exampleVi: 'Chiếc lông chim mềm mại nhẹ bẫng trong không gian.', funFact: 'Từ "Light" vừa có nghĩa là ánh sáng, vừa có nghĩa là trọng lượng nhẹ.' },
      { id: 'hard', english: 'Hard', ipa: '/hɑːrd/', vietnamese: 'Cứng Cáp', category: 'opposite_adjectives', emoji: '🪨', color: '#334155', exampleEn: 'Diamonds are the hardest stones on Earth.', exampleVi: 'Kim cương là loại đá cứng cáp nhất trên Trái Đất.', funFact: 'Kim cương cứng đến mức chỉ có kim cương khác mới có thể cắt được nó!' },
      { id: 'soft', english: 'Soft', ipa: '/sɑːft/', vietnamese: 'Mềm Mại', category: 'opposite_adjectives', emoji: '🧸', color: '#F472B6', exampleEn: 'The fluffy cotton pillow is so soft.', exampleVi: 'Chiếc gối bông gòn êm ái thật mềm mại.', funFact: 'Chạm vào những đồ vật mềm mại giúp não bộ cảm thấy thư giãn và an tâm.' },
      { id: 'clean_adj', english: 'Clean', ipa: '/kliːn/', vietnamese: 'Sạch Sẽ', category: 'opposite_adjectives', emoji: '🧼', color: '#10B981', exampleEn: 'Wash hands clean before having dinner.', exampleVi: 'Rửa tay sạch sẽ trước khi ăn cơm.', funFact: 'Giữ vệ sinh sạch sẽ là cách tốt nhất để bảo vệ sức khỏe mỗi ngày.' },
      { id: 'dirty', english: 'Dirty', ipa: '/ˈdɝː.t̬i/', vietnamese: 'Bẩn / Lấm Bùn', category: 'opposite_adjectives', emoji: '🐾', color: '#92400E', exampleEn: 'Wipe muddy paws after playing in the garden.', exampleVi: 'Lau sạch những bàn chân lấm bùn sau khi chơi ngoài vườn.', funFact: 'Nghịch đất cát vui nhưng nhớ rửa sạch chân tay sau khi chơi xong nhé!' },
      { id: 'old', english: 'Old', ipa: '/oʊld/', vietnamese: 'Cũ / Già', category: 'opposite_adjectives', emoji: '🏛️', color: '#64748B', exampleEn: 'The wise old banyan tree has lived for 200 years.', exampleVi: 'Cây đa cổ thụ đã sống thọ hơn 200 năm tuổi.', funFact: 'Từ "Old" vừa có nghĩa là đồ vật cũ, vừa có nghĩa là tuổi tác cao.' },
      { id: 'new', english: 'New', ipa: '/nuː/', vietnamese: 'Mới Tinh', category: 'opposite_adjectives', emoji: '✨', color: '#8B5CF6', exampleEn: 'Wear a brand new uniform on the first school day.', exampleVi: 'Mặc bộ đồng phục mới tinh tươm trong ngày khai trường.', funFact: 'Mở một trang vở mới mang lại cảm giác hứng khởi học tập ngập tràn.' },
      { id: 'hot_adj', english: 'Hot', ipa: '/hɑːt/', vietnamese: 'Nóng', category: 'opposite_adjectives', emoji: '🔥', color: '#EF4444', exampleEn: 'Be careful, the soup is very hot!', exampleVi: 'Cẩn thận bé nhé, bát canh đang rất nóng!', funFact: 'Nhiệt độ bề mặt của Mặt trời lên tới 5.500 độ C.' },
      { id: 'cold_adj', english: 'Cold', ipa: '/koʊld/', vietnamese: 'Lạnh', category: 'opposite_adjectives', emoji: '🧊', color: '#0284C7', exampleEn: 'Ice cubes are frozen solid and cold.', exampleVi: 'Những viên đá lạnh đóng băng cứng ngắc và buốt giá.', funFact: 'Nước bắt đầu đóng băng thành đá ở nhiệt độ 0 độ C.' },
      { id: 'happy_adj', english: 'Happy', ipa: '/ˈhæp.i/', vietnamese: 'Vui Vẻ', category: 'opposite_adjectives', emoji: '😄', color: '#EAB308', exampleEn: 'A joyful smile makes everyone happy.', exampleVi: 'Một nụ cười vui tươi khiến tất cả mọi người đều hân hoan.', funFact: 'Niềm vui có thể lan tỏa từ người này sang người khác qua nụ cười.' },
      { id: 'sad_adj', english: 'Sad', ipa: '/sæd/', vietnamese: 'Buồn Bã', category: 'opposite_adjectives', emoji: '😢', color: '#60A5FA', exampleEn: 'Give a gentle smile to cheer up someone sad.', exampleVi: 'Nở một nụ cười hiền hậu để an ủi người bạn đang buồn.', funFact: 'Chia sẻ nỗi buồn cùng người thân sẽ giúp nỗi buồn vơi đi một nửa.' },
    ],
  },
];
