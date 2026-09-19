/**
 * Shadow Detective Dataset - Game Thám Tử Soi Đèn Pin "Ai Trong Bóng Đêm?"
 * 40 Vụ Án Thám Tử Trí Tuệ Bí Mật chia 4 Thế Giới Đêm Huyền Bí
 */

import { VocabCard } from './oxfordKidsVocabulary';

export type DetectiveWorldId = 'forest' | 'ocean' | 'city' | 'space';

export interface DetectiveWorldConfig {
  id: DetectiveWorldId;
  name: string;
  subtitle: string;
  themeColor: string;
  accentColor: string;
  darkBg: string;
  iconEmoji: string;
  flashlightColor: string;
  badgeTitle: string;
}

export interface ShadowSuspectOption {
  id: string;
  label: string;
  emoji: string;
  wordId: string;
  isCorrect: boolean;
}

export interface ShadowCaseItem {
  id: string;
  worldId: DetectiveWorldId;
  caseNumber: number; // 1 -> 10
  title: string;
  targetWordId: string;
  labelVi: string;
  labelEn: string;
  emoji: string;
  cluePoem: string[];
  suspectOptions: ShadowSuspectOption[];
  funFact: string;
}

export const DETECTIVE_WORLDS: Record<DetectiveWorldId, DetectiveWorldConfig> = {
  forest: {
    id: 'forest',
    name: 'Rừng Đêm Huyền Bí',
    subtitle: 'Vụ án muông thú ẩn nấp trong rừng sâu',
    themeColor: '#10B981',
    accentColor: '#34D399',
    darkBg: '#022C22',
    iconEmoji: '🌲',
    flashlightColor: '#FDE047',
    badgeTitle: 'Thám Tử Rừng Xanh',
  },
  ocean: {
    id: 'ocean',
    name: 'Đáy Biển Sâu Kì Lạ',
    subtitle: 'Vụ án sinh vật kỳ bí nơi đại dương',
    themeColor: '#0EA5E9',
    accentColor: '#38BDF8',
    darkBg: '#082F49',
    iconEmoji: '🌊',
    flashlightColor: '#67E8F9',
    badgeTitle: 'Thám Tử Đại Dương',
  },
  city: {
    id: 'city',
    name: 'Thành Phố Về Đêm',
    subtitle: 'Vụ án các phương tiện tuần tra đêm muộn',
    themeColor: '#F59E0B',
    accentColor: '#FBBF24',
    darkBg: '#1C1917',
    iconEmoji: '🏙️',
    flashlightColor: '#FEF08A',
    badgeTitle: 'Cảnh Sát Trưởng Trí Tuệ',
  },
  space: {
    id: 'space',
    name: 'Vũ Trụ Huyền Bí',
    subtitle: 'Kính viễn vọng soi bóng các hành tinh',
    themeColor: '#8B5CF6',
    accentColor: '#A78BFA',
    darkBg: '#0F172A',
    iconEmoji: '🪐',
    flashlightColor: '#E9D5FF',
    badgeTitle: 'Thám Tử Thiên Hà',
  },
};

export const SHADOW_CASES_DATA: ShadowCaseItem[] = [
  // =================================================================
  // 1. RỪNG ĐÊM HUYỀN BÍ (10 VỤ ÁN)
  // =================================================================
  {
    id: 'case_forest_01',
    worldId: 'forest',
    caseNumber: 1,
    title: 'Vụ án 01: Bóng Đen Chúa Tể Bờm Dày',
    targetWordId: 'lion',
    labelVi: 'SƯ TỬ',
    labelEn: 'Lion',
    emoji: '🦁',
    cluePoem: [
      'Bờm dày như áo choàng vua',
      'Gầm vang một tiếng gió lùa rừng sâu?',
    ],
    suspectOptions: [
      { id: 'opt_lion', label: 'Sư Tử', emoji: '🦁', wordId: 'lion', isCorrect: true },
      { id: 'opt_cat', label: 'Mèo Mướp', emoji: '🐱', wordId: 'cat', isCorrect: false },
      { id: 'opt_dog', label: 'Cún Con', emoji: '🐶', wordId: 'dog', isCorrect: false },
      { id: 'opt_fox', label: 'Cáo Đỏ', emoji: '🦊', wordId: 'fox', isCorrect: false },
    ],
    funFact: 'Sư tử được mệnh danh là Chúa tể sơn lâm. Tiếng gầm của sư tử vang xa tới tận 8 cây số!',
  },
  {
    id: 'case_forest_02',
    worldId: 'forest',
    caseNumber: 2,
    title: 'Vụ án 02: Bóng Khổng Lồ Mũi Dài',
    targetWordId: 'elephant',
    labelVi: 'CON VOI',
    labelEn: 'Elephant',
    emoji: '🐘',
    cluePoem: [
      'Bốn chân to tựa cột nhà',
      'Mũi dài hút nước phun hoa tắm mình?',
    ],
    suspectOptions: [
      { id: 'opt_hippo', label: 'Hà Mã', emoji: '🦛', wordId: 'hippo', isCorrect: false },
      { id: 'opt_elephant', label: 'Con Voi', emoji: '🐘', wordId: 'elephant', isCorrect: true },
      { id: 'opt_rhino', label: 'Tê Giác', emoji: '🦏', wordId: 'rhino', isCorrect: false },
      { id: 'opt_pig', label: 'Chú Lợn', emoji: '🐷', wordId: 'pig', isCorrect: false },
    ],
    funFact: 'Voi là động vật có vú trên cạn lớn nhất Trái Đất. Vòi của voi có tới hơn 40.000 bó cơ bắp!',
  },
  {
    id: 'case_forest_03',
    worldId: 'forest',
    caseNumber: 3,
    title: 'Vụ án 03: Vệt Vằn Cam Trong Đêm',
    targetWordId: 'tiger',
    labelVi: 'CON HỔ',
    labelEn: 'Tiger',
    emoji: '🐯',
    cluePoem: [
      'Áo lông rực rỡ vằn đen',
      'Móng vuốt sắc lẹm lướt êm trong rừng?',
    ],
    suspectOptions: [
      { id: 'opt_tiger', label: 'Con Hổ', emoji: '🐯', wordId: 'tiger', isCorrect: true },
      { id: 'opt_zebra', label: 'Ngựa Vằn', emoji: '🦓', wordId: 'zebra', isCorrect: false },
      { id: 'opt_leopard', label: 'Báo Đốm', emoji: '🐆', wordId: 'leopard', isCorrect: false },
      { id: 'opt_cat', label: 'Mèo Rừng', emoji: '🐱', wordId: 'cat', isCorrect: false },
    ],
    funFact: 'Hổ là loài bơi lội rất giỏi, không giống các chú mèo nhà thường rất sợ nước!',
  },
  {
    id: 'case_forest_04',
    worldId: 'forest',
    caseNumber: 4,
    title: 'Vụ án 04: Kẻ Canh Đêm Mắt Tròn Xoe',
    targetWordId: 'owl',
    labelVi: 'CÚ MÈO',
    labelEn: 'Owl',
    emoji: '🦉',
    cluePoem: [
      'Ngày ngủ tít trên cành cây',
      'Đêm về mắt sáng xoay tròn săn mồi?',
    ],
    suspectOptions: [
      { id: 'opt_bat', label: 'Con Dơi', emoji: '🦇', wordId: 'bat', isCorrect: false },
      { id: 'opt_bird', label: 'Chim Chích', emoji: '🐦', wordId: 'bird', isCorrect: false },
      { id: 'opt_owl', label: 'Cú Mèo', emoji: '🦉', wordId: 'owl', isCorrect: true },
      { id: 'opt_eagle', label: 'Đại Bàng', emoji: '🦅', wordId: 'eagle', isCorrect: false },
    ],
    funFact: 'Cú mèo có thể xoay đầu tới 270 độ mà không cần phải quay người!',
  },
  {
    id: 'case_forest_05',
    worldId: 'forest',
    caseNumber: 5,
    title: 'Vụ án 05: Bóng Leo Trèo Đu Cành Nhanh',
    targetWordId: 'monkey',
    labelVi: 'CON KHỈ',
    labelEn: 'Monkey',
    emoji: '🐒',
    cluePoem: [
      'Đuôi dài thoăn thoắt chuyền cành',
      'Khoái ăn chuối ngọt chạy quanh rừng già?',
    ],
    suspectOptions: [
      { id: 'opt_squirrel', label: 'Sóc Nâu', emoji: '🐿️', wordId: 'squirrel', isCorrect: false },
      { id: 'opt_monkey', label: 'Con Khỉ', emoji: '🐒', wordId: 'monkey', isCorrect: true },
      { id: 'opt_sloth', label: 'Lười Lùn', emoji: '🦥', wordId: 'sloth', isCorrect: false },
      { id: 'opt_koala', label: 'Gấu Koala', emoji: '🐨', wordId: 'koala', isCorrect: false },
    ],
    funFact: 'Khỉ rất thông minh, chúng biết dùng hòn đá để đập vỡ vỏ hạt dẻ và bóc chuối rất khéo!',
  },
  {
    id: 'case_forest_06',
    worldId: 'forest',
    caseNumber: 6,
    title: 'Vụ án 06: Cái Cổ Cao Chạm Tận Mây',
    targetWordId: 'giraffe',
    labelVi: 'HƯƠU CAO CỔ',
    labelEn: 'Giraffe',
    emoji: '🦒',
    cluePoem: [
      'Cổ dài vươn tới trời xanh',
      'Ăn chồi lá biếc trên cành ngọn cao?',
    ],
    suspectOptions: [
      { id: 'opt_horse', label: 'Ngựa Con', emoji: '🐴', wordId: 'horse', isCorrect: false },
      { id: 'opt_giraffe', label: 'Hươu Cao Cổ', emoji: '🦒', wordId: 'giraffe', isCorrect: true },
      { id: 'opt_deer', label: 'Nai Nhỏ', emoji: '🦌', wordId: 'deer', isCorrect: false },
      { id: 'opt_ostrich', label: 'Đà Điểu', emoji: '🦤', wordId: 'ostrich', isCorrect: false },
    ],
    funFact: 'Hươu cao cổ là động vật cao nhất thế giới. Chiếc lưỡi của nó dài tới 45cm và có màu tím!',
  },
  {
    id: 'case_forest_07',
    worldId: 'forest',
    caseNumber: 7,
    title: 'Vụ án 07: Tai Dài Nhấp Nhổm Củ Cà Rốt',
    targetWordId: 'rabbit',
    labelVi: 'THỎ TRẮNG',
    labelEn: 'Rabbit',
    emoji: '🐰',
    cluePoem: [
      'Tai dài mắt đỏ hồng tươi',
      'Nhảy phắt nhanh thoăn thoắt gặm củ cà rốt?',
    ],
    suspectOptions: [
      { id: 'opt_mouse', label: 'Chuột Nhắt', emoji: '🐭', wordId: 'mouse', isCorrect: false },
      { id: 'opt_rabbit', label: 'Thỏ Trắng', emoji: '🐰', wordId: 'rabbit', isCorrect: true },
      { id: 'opt_hamster', label: 'Hamster', emoji: '🐹', wordId: 'hamster', isCorrect: false },
      { id: 'opt_cat', label: 'Mèo Bông', emoji: '🐱', wordId: 'cat', isCorrect: false },
    ],
    funFact: 'Răng của thỏ không bao giờ ngừng dài ra, vì vậy chúng liên tục phải gặm cỏ khô và rau củ!',
  },
  {
    id: 'case_forest_08',
    worldId: 'forest',
    caseNumber: 8,
    title: 'Vụ án 08: Chàng Béo Mê Mật Ong Ngọt',
    targetWordId: 'bear',
    labelVi: 'GẤU NÂU',
    labelEn: 'Bear',
    emoji: '🐻',
    cluePoem: [
      'Lông dày tròn trịa béo tròn',
      'Thích ăn mật ngọt ngủ ngon suốt mùa đông?',
    ],
    suspectOptions: [
      { id: 'opt_bear', label: 'Gấu Nâu', emoji: '🐻', wordId: 'bear', isCorrect: true },
      { id: 'opt_panda', label: 'Gấu Trúc', emoji: '🐼', wordId: 'panda', isCorrect: false },
      { id: 'opt_dog', label: 'Chó Ngao', emoji: '🐶', wordId: 'dog', isCorrect: false },
      { id: 'opt_pig', label: 'Heo Con', emoji: '🐷', wordId: 'pig', isCorrect: false },
    ],
    funFact: 'Gấu có thể ngủ đông suốt nhiều tháng liền mà không cần thức dậy ăn uống!',
  },
  {
    id: 'case_forest_09',
    worldId: 'forest',
    caseNumber: 9,
    title: 'Vụ án 09: Chàng Nhảy Lò Cò Mang Túi Con',
    targetWordId: 'kangaroo',
    labelVi: 'CHUỘT TÚI',
    labelEn: 'Kangaroo',
    emoji: '🦘',
    cluePoem: [
      'Chân sau bật nhảy tài ghê',
      'Trước bụng có túi ấp con êm đềm?',
    ],
    suspectOptions: [
      { id: 'opt_kangaroo', label: 'Chuột Túi', emoji: '🦘', wordId: 'kangaroo', isCorrect: true },
      { id: 'opt_rabbit', label: 'Thỏ Rừng', emoji: '🐰', wordId: 'rabbit', isCorrect: false },
      { id: 'opt_frog', label: 'Ếch Cốm', emoji: '🐸', wordId: 'frog', isCorrect: false },
      { id: 'opt_monkey', label: 'Khỉ Con', emoji: '🐒', wordId: 'monkey', isCorrect: false },
    ],
    funFact: 'Chuột túi mẹ có chiếc túi ấm áp trước bụng để bé Kangaroo con chui vào ngủ và bú sữa!',
  },
  {
    id: 'case_forest_10',
    worldId: 'forest',
    caseNumber: 10,
    title: 'Vụ án 10: Chiếc Đuôi Bông Nhặt Hạt Dẻ',
    targetWordId: 'squirrel',
    labelVi: 'SÓC NÂU',
    labelEn: 'Squirrel',
    emoji: '🐿️',
    cluePoem: [
      'Đuôi to xòe rộng như tơ',
      'Gom nhặt hạt dẻ dấu bờ gốc cây?',
    ],
    suspectOptions: [
      { id: 'opt_fox', label: 'Cáo Nhỏ', emoji: '🦊', wordId: 'fox', isCorrect: false },
      { id: 'opt_mouse', label: 'Chuột Rừng', emoji: '🐭', wordId: 'mouse', isCorrect: false },
      { id: 'opt_squirrel', label: 'Sóc Nâu', emoji: '🐿️', wordId: 'squirrel', isCorrect: true },
      { id: 'opt_beaver', label: 'Hải Ly', emoji: '🦫', wordId: 'beaver', isCorrect: false },
    ],
    funFact: 'Sóc có trí nhớ rất tốt để tìm lại hàng ngàn hạt dẻ mà chúng đã giấu dưới mặt đất!',
  },

  // =================================================================
  // 2. ĐÁY BIỂN SÂU KÌ LẠ (10 VỤ ÁN)
  // =================================================================
  {
    id: 'case_ocean_01',
    worldId: 'ocean',
    caseNumber: 1,
    title: 'Vụ án 01: Khổng Lồ Phun Cột Nước Lên Trời',
    targetWordId: 'whale',
    labelVi: 'CÁ VOI',
    labelEn: 'Whale',
    emoji: '🐋',
    cluePoem: [
      'Thân to như chiếc tàu ngầm',
      'Trên lưng phun cột nước tung trắng trời?',
    ],
    suspectOptions: [
      { id: 'opt_whale', label: 'Cá Voi', emoji: '🐋', wordId: 'whale', isCorrect: true },
      { id: 'opt_shark', label: 'Cá Mập', emoji: '🦈', wordId: 'shark', isCorrect: false },
      { id: 'opt_dolphin', label: 'Cá Heo', emoji: '🐬', wordId: 'dolphin', isCorrect: false },
      { id: 'opt_seal', label: 'Hải Cẩu', emoji: '🦭', wordId: 'seal', isCorrect: false },
    ],
    funFact: 'Cá voi xanh là sinh vật lớn nhất từng tồn tại trên Trái Đất, to hơn cả khủng long bạo chúa!',
  },
  {
    id: 'case_ocean_02',
    worldId: 'ocean',
    caseNumber: 2,
    title: 'Vụ án 02: Bạn Thân Thủy Thủ Hay Nhào Lộn',
    targetWordId: 'dolphin',
    labelVi: 'CÁ HEO',
    labelEn: 'Dolphin',
    emoji: '🐬',
    cluePoem: [
      'Thân trơn thông minh bơi nhanh',
      'Nhào lộn trên sóng đón chào tàu thuyền?',
    ],
    suspectOptions: [
      { id: 'opt_dolphin', label: 'Cá Heo', emoji: '🐬', wordId: 'dolphin', isCorrect: true },
      { id: 'opt_seal', label: 'Hải Cẩu', emoji: '🦭', wordId: 'seal', isCorrect: false },
      { id: 'opt_penguin', label: 'Chim Cánh Cụt', emoji: '🐧', wordId: 'penguin', isCorrect: false },
      { id: 'opt_fish', label: 'Cá Chim', emoji: '🐟', wordId: 'fish', isCorrect: false },
    ],
    funFact: 'Cá heo giao tiếp với nhau bằng những tiếng huýt và tiếng cách cách đặc biệt như tiếng nói chuyện!',
  },
  {
    id: 'case_ocean_03',
    worldId: 'ocean',
    caseNumber: 3,
    title: 'Vụ án 03: Thợ Săn Răng Nhọn Vây Nhô Cao',
    targetWordId: 'shark',
    labelVi: 'CÁ MẬP',
    labelEn: 'Shark',
    emoji: '🦈',
    cluePoem: [
      'Vây nhô rẽ sóng đại dương',
      'Hàm răng sắc nhọn dẫn đường lướt nhanh?',
    ],
    suspectOptions: [
      { id: 'opt_shark', label: 'Cá Mập', emoji: '🦈', wordId: 'shark', isCorrect: true },
      { id: 'opt_crocodile', label: 'Cá Sấu', emoji: '🐊', wordId: 'crocodile', isCorrect: false },
      { id: 'opt_swordfish', label: 'Cá Kiếm', emoji: '🗡️', wordId: 'swordfish', isCorrect: false },
      { id: 'opt_whale', label: 'Cá Voi', emoji: '🐋', wordId: 'whale', isCorrect: false },
    ],
    funFact: 'Cá mập không có xương mà toàn bộ khung cơ thể được làm bằng sụn dẻo dai giống như tai người!',
  },
  {
    id: 'case_ocean_04',
    worldId: 'ocean',
    caseNumber: 4,
    title: 'Vụ án 04: Quái Kiệt Tám Xúc Tu Phun Mực',
    targetWordId: 'octopus',
    labelVi: 'BẠCH TUỘC',
    labelEn: 'Octopus',
    emoji: '🐙',
    cluePoem: [
      'Tám vòi uốn lượn múa ca',
      'Phun tia mực tím thoát ra hiểm nguy?',
    ],
    suspectOptions: [
      { id: 'opt_squid', label: 'Mực Ống', emoji: '🦑', wordId: 'squid', isCorrect: false },
      { id: 'opt_octopus', label: 'Bạch Tuộc', emoji: '🐙', wordId: 'octopus', isCorrect: true },
      { id: 'opt_jellyfish', label: 'Con Sứa', emoji: '🪼', wordId: 'jellyfish', isCorrect: false },
      { id: 'opt_crab', label: 'Con Cua', emoji: '🦀', wordId: 'crab', isCorrect: false },
    ],
    funFact: 'Bạch tuộc có tới 3 trái tim và máu của chúng có màu xanh dương kỳ lạ!',
  },
  {
    id: 'case_ocean_05',
    worldId: 'ocean',
    caseNumber: 5,
    title: 'Vụ án 05: Cụ Già Mai Cứng Bơi Chậm Rãi',
    targetWordId: 'turtle',
    labelVi: 'RÙA BIỂN',
    labelEn: 'Sea Turtle',
    emoji: '🐢',
    cluePoem: [
      'Mai dày chở nặng trên lưng',
      'Bốn chân như mái chèo mừng sóng êm?',
    ],
    suspectOptions: [
      { id: 'opt_turtle', label: 'Rùa Biển', emoji: '🐢', wordId: 'turtle', isCorrect: true },
      { id: 'opt_snail', label: 'Ốc Sên', emoji: '🐌', wordId: 'snail', isCorrect: false },
      { id: 'opt_crab', label: 'Con Cua', emoji: '🦀', wordId: 'crab', isCorrect: false },
      { id: 'opt_shrimp', label: 'Tôm Hùm', emoji: '🦞', wordId: 'shrimp', isCorrect: false },
    ],
    funFact: 'Rùa biển có thể sống thọ hơn 100 tuổi và bơi hàng ngàn dặm quay lại đúng bãi biển nơi chúng sinh ra!',
  },
  {
    id: 'case_ocean_06',
    worldId: 'ocean',
    caseNumber: 6,
    title: 'Vụ án 06: Chàng Đi Ngang Cặp Kìm Giương Cao',
    targetWordId: 'crab',
    labelVi: 'CON CUA',
    labelEn: 'Crab',
    emoji: '🦀',
    cluePoem: [
      'Tám cẳng hai càng nghênh ngang',
      'Bò ngang trên cát đàng hoàng oai phong?',
    ],
    suspectOptions: [
      { id: 'opt_crab', label: 'Con Cua', emoji: '🦀', wordId: 'crab', isCorrect: true },
      { id: 'opt_lobster', label: 'Tôm Biển', emoji: '🦞', wordId: 'lobster', isCorrect: false },
      { id: 'opt_spider', label: 'Con Nhện', emoji: '🕷️', wordId: 'spider', isCorrect: false },
      { id: 'opt_scorpion', label: 'Bọ Cạp', emoji: '🦂', wordId: 'scorpion', isCorrect: false },
    ],
    funFact: 'Cua đi ngang vì các khớp chân của chúng chỉ gập được theo chiều ngang sang hai bên!',
  },
  {
    id: 'case_ocean_07',
    worldId: 'ocean',
    caseNumber: 7,
    title: 'Vụ án 07: Chiếc Ô Trong Suốt Lơ Lửng Biển Sâu',
    targetWordId: 'jellyfish',
    labelVi: 'CON SỨA',
    labelEn: 'Jellyfish',
    emoji: '🪼',
    cluePoem: [
      'Như chiếc ô dù trong veo',
      'Bồng bềnh làn nước lượn theo nhịp chèo?',
    ],
    suspectOptions: [
      { id: 'opt_jellyfish', label: 'Con Sứa', emoji: '🪼', wordId: 'jellyfish', isCorrect: true },
      { id: 'opt_starfish', label: 'Sao Biển', emoji: '⭐', wordId: 'starfish', isCorrect: false },
      { id: 'opt_sponge', label: 'Bọt Biển', emoji: '🧽', wordId: 'sponge', isCorrect: false },
      { id: 'opt_octopus', label: 'Bạch Tuộc', emoji: '🐙', wordId: 'octopus', isCorrect: false },
    ],
    funFact: 'Sứa biển không có não, không có tim và hơn 95% cơ thể của chúng là nước!',
  },
  {
    id: 'case_ocean_08',
    worldId: 'ocean',
    caseNumber: 8,
    title: 'Vụ án 08: Ngôi Sao 5 Cánh Nằm Dưới Đáy Cát',
    targetWordId: 'starfish',
    labelVi: 'SAO BIỂN',
    labelEn: 'Starfish',
    emoji: '⭐',
    cluePoem: [
      'Năm cánh giống hệt sao trời',
      'Không bay lên gió mà nằm đáy sâu?',
    ],
    suspectOptions: [
      { id: 'opt_starfish', label: 'Sao Biển', emoji: '⭐', wordId: 'starfish', isCorrect: true },
      { id: 'opt_seashell', label: 'Vỏ Sò', emoji: '🐚', wordId: 'seashell', isCorrect: false },
      { id: 'opt_crab', label: 'Cua Biển', emoji: '🦀', wordId: 'crab', isCorrect: false },
      { id: 'opt_stone', label: 'Viên Sỏi', emoji: '🪨', wordId: 'stone', isCorrect: false },
    ],
    funFact: 'Nếu một cánh sao biển bị đứt, chúng có thể tự mọc lại một cánh mới hoàn toàn kỳ diệu!',
  },
  {
    id: 'case_ocean_09',
    worldId: 'ocean',
    caseNumber: 9,
    title: 'Vụ án 09: Chàng Lính Râu Dài Cong Đuôi Lùi',
    targetWordId: 'shrimp',
    labelVi: 'CON TÔM',
    labelEn: 'Shrimp',
    emoji: '🦐',
    cluePoem: [
      'Râu dài lưng uốn cong queo',
      'Búng đuôi lùi bước bơi vèo thoát thân?',
    ],
    suspectOptions: [
      { id: 'opt_shrimp', label: 'Con Tôm', emoji: '🦐', wordId: 'shrimp', isCorrect: true },
      { id: 'opt_fish', label: 'Cá Cơm', emoji: '🐟', wordId: 'fish', isCorrect: false },
      { id: 'opt_worm', label: 'Giun Biển', emoji: '🪱', wordId: 'worm', isCorrect: false },
      { id: 'opt_crab', label: 'Cua Đá', emoji: '🦀', wordId: 'crab', isCorrect: false },
    ],
    funFact: 'Trái tim của con tôm nằm ở trên phần đầu của nó chứ không nằm ở ngực như người!',
  },
  {
    id: 'case_ocean_10',
    worldId: 'ocean',
    caseNumber: 10,
    title: 'Vụ án 10: Chú Ngựa Đứng Thẳng Giữa Rừng Rong',
    targetWordId: 'seahorse',
    labelVi: 'CÁ NGỰA',
    labelEn: 'Seahorse',
    emoji: '🪸',
    cluePoem: [
      'Mang tên giống ngựa trên bờ',
      'Đuôi cong quấn cỏ đứng chờ sóng trôi?',
    ],
    suspectOptions: [
      { id: 'opt_seahorse', label: 'Cá Ngựa', emoji: '🪸', wordId: 'seahorse', isCorrect: true },
      { id: 'opt_eel', label: 'Con Lươn', emoji: '🐍', wordId: 'eel', isCorrect: false },
      { id: 'opt_dolphin', label: 'Cá Heo', emoji: '🐬', wordId: 'dolphin', isCorrect: false },
      { id: 'opt_fish', label: 'Cá Vàng', emoji: '🐠', wordId: 'fish', isCorrect: false },
    ],
    funFact: 'Ở loài cá ngựa, cá bố chính là người mang túi ấp trứng và sinh ra các chú cá ngựa con!',
  },

  // =================================================================
  // 3. THÀNH PHỐ VỀ ĐÊM (10 VỤ ÁN)
  // =================================================================
  {
    id: 'case_city_01',
    worldId: 'city',
    caseNumber: 1,
    title: 'Vụ án 01: Xe Đỏ Thang Dài Còi Hú Vang',
    targetWordId: 'fire_truck',
    labelVi: 'XE CỨU HỎA',
    labelEn: 'Fire Truck',
    emoji: '🚒',
    cluePoem: [
      'Mình đỏ vòi nước thang cao',
      'Còi vang inh ỏi dập ngọn lửa mau?',
    ],
    suspectOptions: [
      { id: 'opt_fire_truck', label: 'Xe Cứu Hỏa', emoji: '🚒', wordId: 'fire_truck', isCorrect: true },
      { id: 'opt_police_car', label: 'Xe Cảnh Sát', emoji: '🚓', wordId: 'police_car', isCorrect: false },
      { id: 'opt_bus', label: 'Xe Buýt', emoji: '🚌', wordId: 'bus', isCorrect: false },
      { id: 'opt_truck', label: 'Xe Tải', emoji: '🚚', wordId: 'truck', isCorrect: false },
    ],
    funFact: 'Thang cứu hỏa trên xe có thể vươn cao tới tầng 15 của các tòa nhà chung cư cao tầng!',
  },
  {
    id: 'case_city_02',
    worldId: 'city',
    caseNumber: 2,
    title: 'Vụ án 02: Xe Chữ Thập Đỏ Cứu Người Bệnh',
    targetWordId: 'ambulance',
    labelVi: 'XE CỨU THƯƠNG',
    labelEn: 'Ambulance',
    emoji: '🚑',
    cluePoem: [
      'Chữ thập đỏ rực trên đầu',
      'Đưa người đau ốm đến mau viện cùng?',
    ],
    suspectOptions: [
      { id: 'opt_ambulance', label: 'Xe Cứu Thương', emoji: '🚑', wordId: 'ambulance', isCorrect: true },
      { id: 'opt_taxi', label: 'Xe Taxi', emoji: '🚕', wordId: 'taxi', isCorrect: false },
      { id: 'opt_van', label: 'Xe Tải Nhỏ', emoji: '🚐', wordId: 'van', isCorrect: false },
      { id: 'opt_car', label: 'Ô Tô Con', emoji: '🚗', wordId: 'car', isCorrect: false },
    ],
    funFact: 'Chữ "AMBULANCE" phía trước xe thường được in ngược để tài xế nhìn qua gương chiếu hậu đọc được xuôi!',
  },
  {
    id: 'case_city_03',
    worldId: 'city',
    caseNumber: 3,
    title: 'Vụ án 03: Đèn Xanh Đỏ Tuần Tra An Ninh',
    targetWordId: 'police_car',
    labelVi: 'XE CẢNH SÁT',
    labelEn: 'Police Car',
    emoji: '🚓',
    cluePoem: [
      'Đèn chớp xanh đỏ trên trần',
      'Tuần tra đường phố giữ gìn bình yên?',
    ],
    suspectOptions: [
      { id: 'opt_police_car', label: 'Xe Cảnh Sát', emoji: '🚓', wordId: 'police_car', isCorrect: true },
      { id: 'opt_race_car', label: 'Xe Đua', emoji: '🏎️', wordId: 'race_car', isCorrect: false },
      { id: 'opt_motorcycle', label: 'Xe Máy', emoji: '🏍️', wordId: 'motorcycle', isCorrect: false },
      { id: 'opt_bus', label: 'Xe Buýt', emoji: '🚌', wordId: 'bus', isCorrect: false },
    ],
    funFact: 'Xe cảnh sát được trang bị máy tính và bộ đàm vô tuyến để liên lạc tức thì với tổng đài chỉ huy!',
  },
  {
    id: 'case_city_04',
    worldId: 'city',
    caseNumber: 4,
    title: 'Vụ án 04: Cánh Quạt Xoay Tít Trên Bầu Trời',
    targetWordId: 'helicopter',
    labelVi: 'TRỰC THĂNG',
    labelEn: 'Helicopter',
    emoji: '🚁',
    cluePoem: [
      'Không cánh dài tựa máy bay',
      'Cánh quạt trên đỉnh bay ngay thẳng trời?',
    ],
    suspectOptions: [
      { id: 'opt_helicopter', label: 'Trực Thăng', emoji: '🚁', wordId: 'helicopter', isCorrect: true },
      { id: 'opt_airplane', label: 'Máy Bay', emoji: '✈️', wordId: 'airplane', isCorrect: false },
      { id: 'opt_rocket', label: 'Tên Lửa', emoji: '🚀', wordId: 'rocket', isCorrect: false },
      { id: 'opt_drone', label: 'Flycam', emoji: '🛸', wordId: 'drone', isCorrect: false },
    ],
    funFact: 'Máy bay trực thăng có khả năng đứng yên lơ lửng một chỗ trên không trung để cứu hộ!',
  },
  {
    id: 'case_city_05',
    worldId: 'city',
    caseNumber: 5,
    title: 'Vụ án 05: Con Rắn Sắt Dài Xình Xịch Trong Đêm',
    targetWordId: 'train',
    labelVi: 'TÀU HỎA',
    labelEn: 'Train',
    emoji: '🚂',
    cluePoem: [
      'Chạy trên hai dải đường ray',
      'Đoàn toa nối đuôi xình xịch xuyên đêm?',
    ],
    suspectOptions: [
      { id: 'opt_train', label: 'Tàu Hỏa', emoji: '🚂', wordId: 'train', isCorrect: true },
      { id: 'opt_bus', label: 'Xe Buýt Dài', emoji: '🚌', wordId: 'bus', isCorrect: false },
      { id: 'opt_ship', label: 'Tàu Thủy', emoji: '🚢', wordId: 'ship', isCorrect: false },
      { id: 'opt_truck', label: 'Xe Container', emoji: '🚛', wordId: 'truck', isCorrect: false },
    ],
    funFact: 'Tàu cao tốc hiện đại (Maglev) có thể chạy với vận tốc lên tới hơn 600 km/h mà không chạm đường ray!',
  },
  {
    id: 'case_city_06',
    worldId: 'city',
    caseNumber: 6,
    title: 'Vụ án 06: Chim Sắt Khổng Lồ Bay Vượt Ngàn Mây',
    targetWordId: 'airplane',
    labelVi: 'MÁY BAY',
    labelEn: 'Airplane',
    emoji: '✈️',
    cluePoem: [
      'Dang đôi cánh bạc lướt bay',
      'Chở bao hành khách vượt mây ngút ngàn?',
    ],
    suspectOptions: [
      { id: 'opt_airplane', label: 'Máy Bay', emoji: '✈️', wordId: 'airplane', isCorrect: true },
      { id: 'opt_helicopter', label: 'Trực Thăng', emoji: '🚁', wordId: 'helicopter', isCorrect: false },
      { id: 'opt_bird', label: 'Chim Ưng', emoji: '🦅', wordId: 'bird', isCorrect: false },
      { id: 'opt_kite', label: 'Con Diều', emoji: '🪁', wordId: 'kite', isCorrect: false },
    ],
    funFact: 'Máy bay thương mại bay ở độ cao hơn 10.000 mét, nơi nhiệt độ bên ngoài lạnh tới âm 50 độ C!',
  },
  {
    id: 'case_city_07',
    worldId: 'city',
    caseNumber: 7,
    title: 'Vụ án 07: Bác Nhà Dài Chở Nhiều Học Sinh',
    targetWordId: 'bus',
    labelVi: 'XE BUÝT',
    labelEn: 'Bus',
    emoji: '🚌',
    cluePoem: [
      'Nhiều ghế nhiều cửa đón đưa',
      'Bé lên ngồi ngoan đến trường an vui?',
    ],
    suspectOptions: [
      { id: 'opt_bus', label: 'Xe Buýt', emoji: '🚌', wordId: 'bus', isCorrect: true },
      { id: 'opt_car', label: 'Ô Tô Con', emoji: '🚗', wordId: 'car', isCorrect: false },
      { id: 'opt_taxi', label: 'Xe Taxi', emoji: '🚕', wordId: 'taxi', isCorrect: false },
      { id: 'opt_truck', label: 'Xe Tải', emoji: '🚚', wordId: 'truck', isCorrect: false },
    ],
    funFact: 'Một chuyến xe buýt chở được tới 60-80 người, giúp giảm ùn tắc giao thông và bảo vệ môi trường!',
  },
  {
    id: 'case_city_08',
    worldId: 'city',
    caseNumber: 8,
    title: 'Vụ án 08: Hai Bánh Quay Đều Chân Đạp Bon Bon',
    targetWordId: 'bicycle',
    labelVi: 'XE ĐẠP',
    labelEn: 'Bicycle',
    emoji: '🚲',
    cluePoem: [
      'Không tốn một giọt xăng dầu',
      'Đôi chân bé đạp bon bon trên đường?',
    ],
    suspectOptions: [
      { id: 'opt_bicycle', label: 'Xe Đạp', emoji: '🚲', wordId: 'bicycle', isCorrect: true },
      { id: 'opt_motorcycle', label: 'Xe Máy', emoji: '🏍️', wordId: 'motorcycle', isCorrect: false },
      { id: 'opt_scooter', label: 'Xe Scooter', emoji: '🛴', wordId: 'scooter', isCorrect: false },
      { id: 'opt_skateboard', label: 'Ván Trượt', emoji: '🛹', wordId: 'skateboard', isCorrect: false },
    ],
    funFact: 'Đạp xe đạp mỗi ngày giúp đôi chân dẻo dai, trái tim khỏe mạnh và tăng chiều cao cho bé rất tốt!',
  },
  {
    id: 'case_city_09',
    worldId: 'city',
    caseNumber: 9,
    title: 'Vụ án 09: Cỗ Máy Khổng Lồ Múc Đất Đắp Đê',
    targetWordId: 'excavator',
    labelVi: 'MÁY MÚC',
    labelEn: 'Excavator',
    emoji: '🚜',
    cluePoem: [
      'Cánh tay sắt gầu múc to',
      'Đào hố xây nhà công trình rộn vang?',
    ],
    suspectOptions: [
      { id: 'opt_excavator', label: 'Máy Múc', emoji: '🚜', wordId: 'excavator', isCorrect: true },
      { id: 'opt_truck', label: 'Xe Ben', emoji: '🚛', wordId: 'truck', isCorrect: false },
      { id: 'opt_crane', label: 'Cần Cẩu', emoji: '🏗️', wordId: 'crane', isCorrect: false },
      { id: 'opt_roller', label: 'Xe Lu', emoji: '🚜', wordId: 'roller', isCorrect: false },
    ],
    funFact: 'Máy múc dùng hệ thống thủy lực dầu cực mạnh để nhấc bổng cả tảng đá nặng hàng tấn!',
  },
  {
    id: 'case_city_10',
    worldId: 'city',
    caseNumber: 10,
    title: 'Vụ án 10: Tòa Lâu Đài Nổi Vượt Biển Khơi',
    targetWordId: 'ship',
    labelVi: 'TÀU THỦY',
    labelEn: 'Ship',
    emoji: '🚢',
    cluePoem: [
      'Lướt trên sóng biếc ngàn khơi',
      'Thả neo đứng đợi bến bờ thân thương?',
    ],
    suspectOptions: [
      { id: 'opt_ship', label: 'Tàu Thủy', emoji: '🚢', wordId: 'ship', isCorrect: true },
      { id: 'opt_boat', label: 'Thuyền Nan', emoji: '🛶', wordId: 'boat', isCorrect: false },
      { id: 'opt_submarine', label: 'Tàu Ngầm', emoji: '🤿', wordId: 'submarine', isCorrect: false },
      { id: 'opt_ferry', label: 'Phà Qua Sông', emoji: '⛴️', wordId: 'ferry', isCorrect: false },
    ],
    funFact: 'Những chiếc tàu du lịch hiện đại lớn bằng cả một tòa nhà 20 tầng, có cả hồ bơi và rạp chiếu phim!',
  },

  // =================================================================
  // 4. VŨ TRỤ HUYỀN BÍ (10 VỤ ÁN)
  // =================================================================
  {
    id: 'case_space_01',
    worldId: 'space',
    caseNumber: 1,
    title: 'Vụ án 01: Quả Cầu Lửa Thắp Sáng Trái Đất',
    targetWordId: 'sun',
    labelVi: 'MẶT TRỜI',
    labelEn: 'Sun',
    emoji: '☀️',
    cluePoem: [
      'Quả cầu rực rỡ nắng mai',
      'Đem nguồn ấm áp rọi soi đất trời?',
    ],
    suspectOptions: [
      { id: 'opt_sun', label: 'Mặt Trời', emoji: '☀️', wordId: 'sun', isCorrect: true },
      { id: 'opt_moon', label: 'Mặt Trăng', emoji: '🌙', wordId: 'moon', isCorrect: false },
      { id: 'opt_star', label: 'Ngôi Sao', emoji: '⭐', wordId: 'star', isCorrect: false },
      { id: 'opt_lamp', label: 'Bóng Đèn', emoji: '💡', wordId: 'lamp', isCorrect: false },
    ],
    funFact: 'Mặt Trời to đến mức có thể chứa được hơn 1,3 triệu Trái Đất ở bên trong lòng nó!',
  },
  {
    id: 'case_space_02',
    worldId: 'space',
    caseNumber: 2,
    title: 'Vụ án 02: Chiếc Lưỡi Liềm Bạc Chiếu Đêm Rằm',
    targetWordId: 'moon',
    labelVi: 'MẶT TRĂNG',
    labelEn: 'Moon',
    emoji: '🌙',
    cluePoem: [
      'Khi tròn vành vạnh đêm rằm',
      'Khi cong lưỡi liềm bầu bạn cùng sao?',
    ],
    suspectOptions: [
      { id: 'opt_moon', label: 'Mặt Trăng', emoji: '🌙', wordId: 'moon', isCorrect: true },
      { id: 'opt_sun', label: 'Mặt Trời', emoji: '☀️', wordId: 'sun', isCorrect: false },
      { id: 'opt_cloud', label: 'Đám Mây', emoji: '☁️', wordId: 'cloud', isCorrect: false },
      { id: 'opt_comet', label: 'Sao Băng', emoji: '☄️', wordId: 'comet', isCorrect: false },
    ],
    funFact: 'Mặt trăng không tự phát sáng, ánh sáng của nó là do phản chiếu từ ánh sáng của Mặt Trời!',
  },
  {
    id: 'case_space_03',
    worldId: 'space',
    caseNumber: 3,
    title: 'Vụ án 03: Ngôi Nhà Xanh Của Tất Cả Chúng Ta',
    targetWordId: 'earth',
    labelVi: 'TRÁI ĐẤT',
    labelEn: 'Earth',
    emoji: '🌍',
    cluePoem: [
      'Quả cầu màu biếc bao la',
      'Có cây có biển chính là nhà chung?',
    ],
    suspectOptions: [
      { id: 'opt_earth', label: 'Trái Đất', emoji: '🌍', wordId: 'earth', isCorrect: true },
      { id: 'opt_mars', label: 'Sao Hỏa', emoji: '🔴', wordId: 'mars', isCorrect: false },
      { id: 'opt_jupiter', label: 'Sao Mộc', emoji: '🪐', wordId: 'jupiter', isCorrect: false },
      { id: 'opt_moon', label: 'Mặt Trăng', emoji: '🌙', wordId: 'moon', isCorrect: false },
    ],
    funFact: 'Trái Đất là hành tinh duy nhất trong Hệ Mặt Trời được biết đến là có sự sống và nước lỏng!',
  },
  {
    id: 'case_space_04',
    worldId: 'space',
    caseNumber: 4,
    title: 'Vụ án 04: Mũi Tên Bốc Lửa Bay Thẳng Lên Trời',
    targetWordId: 'rocket',
    labelVi: 'TÊN LỬA',
    labelEn: 'Rocket',
    emoji: '🚀',
    cluePoem: [
      'Lửa phun rực rỡ đuôi dài',
      'Đưa phi hành gia bay tới trời cao?',
    ],
    suspectOptions: [
      { id: 'opt_rocket', label: 'Tên Lửa', emoji: '🚀', wordId: 'rocket', isCorrect: true },
      { id: 'opt_airplane', label: 'Máy Bay', emoji: '✈️', wordId: 'airplane', isCorrect: false },
      { id: 'opt_firework', label: 'Pháo Hoa', emoji: '🎆', wordId: 'firework', isCorrect: false },
      { id: 'opt_bullet', label: 'Viên Đạn', emoji: '🎯', wordId: 'bullet', isCorrect: false },
    ],
    funFact: 'Tên lửa cần đạt vận tốc hơn 40.000 km/h để thoát khỏi lực hút của Trái Đất và bay vào không gian!',
  },
  {
    id: 'case_space_05',
    worldId: 'space',
    caseNumber: 5,
    title: 'Vụ án 05: Hành Tinh Có Chiếc Vành Đai Tuyệt Đẹp',
    targetWordId: 'saturn',
    labelVi: 'SAO THỔ',
    labelEn: 'Saturn',
    emoji: '🪐',
    cluePoem: [
      'Quanh mình đeo chiếc vành đai',
      'Băng đá lấp lánh ai ai cũng trầm trồ?',
    ],
    suspectOptions: [
      { id: 'opt_saturn', label: 'Sao Thổ', emoji: '🪐', wordId: 'saturn', isCorrect: true },
      { id: 'opt_earth', label: 'Trái Đất', emoji: '🌍', wordId: 'earth', isCorrect: false },
      { id: 'opt_mars', label: 'Sao Hỏa', emoji: '🔴', wordId: 'mars', isCorrect: false },
      { id: 'opt_venus', label: 'Sao Kim', emoji: '✨', wordId: 'venus', isCorrect: false },
    ],
    funFact: 'Vành đai tráng lệ của Sao Thổ được tạo thành từ hàng tỷ mảnh đá và băng tuyết lấp lánh!',
  },
  {
    id: 'case_space_06',
    worldId: 'space',
    caseNumber: 6,
    title: 'Vụ án 06: Chàng Đi Bộ Lơ Lửng Không Trọng Lượng',
    targetWordId: 'astronaut',
    labelVi: 'PHI HÀNH GIA',
    labelEn: 'Astronaut',
    emoji: '👨‍🚀',
    cluePoem: [
      'Mặc bộ đồ trắng tinh tươm',
      'Bay bổng lơ lửng bước trên mặt trăng?',
    ],
    suspectOptions: [
      { id: 'opt_astronaut', label: 'Phi Hành Gia', emoji: '👨‍🚀', wordId: 'astronaut', isCorrect: true },
      { id: 'opt_diver', label: 'Thợ Lặn', emoji: '🤿', wordId: 'diver', isCorrect: false },
      { id: 'opt_pilot', label: 'Phi Công', emoji: '👨‍✈️', wordId: 'pilot', isCorrect: false },
      { id: 'opt_alien', label: 'Người Ngoài Hành Tinh', emoji: '👽', wordId: 'alien', isCorrect: false },
    ],
    funFact: 'Trong không gian không có lực hút, phi hành gia lơ lửng và phải uống nước từ những chiếc túi có ống hút đóng kín!',
  },
  {
    id: 'case_space_07',
    worldId: 'space',
    caseNumber: 7,
    title: 'Vụ án 07: Chiếc Cầu 7 Màu Sau Cơn Mưa Rào',
    targetWordId: 'rainbow',
    labelVi: 'CẦU VỒNG',
    labelEn: 'Rainbow',
    emoji: '🌈',
    cluePoem: [
      'Bảy màu rực rỡ uốn cong',
      'Mưa tạnh nắng hé cầu vồng hiện lên?',
    ],
    suspectOptions: [
      { id: 'opt_rainbow', label: 'Cầu Vồng', emoji: '🌈', wordId: 'rainbow', isCorrect: true },
      { id: 'opt_bridge', label: 'Cây Cầu', emoji: '🌉', wordId: 'bridge', isCorrect: false },
      { id: 'opt_cloud', label: 'Đám Mây', emoji: '☁️', wordId: 'cloud', isCorrect: false },
      { id: 'opt_ribbon', label: 'Dải Ruy Băng', emoji: '🎀', wordId: 'ribbon', isCorrect: false },
    ],
    funFact: 'Cầu vồng được tạo ra khi ánh sáng Mặt Trời chiếu qua những giọt nước mưa li ti trong không khí!',
  },
  {
    id: 'case_space_08',
    worldId: 'space',
    caseNumber: 8,
    title: 'Vụ án 08: Vệt Sáng Xẹt Ngang Bầu Trời Đêm',
    targetWordId: 'comet',
    labelVi: 'SAO BĂNG',
    labelEn: 'Shooting Star',
    emoji: '🌠',
    cluePoem: [
      'Vút qua chớp mắt trên trời',
      'Bé chắp tay ước nụ cười xinh xinh?',
    ],
    suspectOptions: [
      { id: 'opt_comet', label: 'Sao Băng', emoji: '🌠', wordId: 'comet', isCorrect: true },
      { id: 'opt_airplane', label: 'Máy Bay', emoji: '✈️', wordId: 'airplane', isCorrect: false },
      { id: 'opt_firework', label: 'Pháo Hoa', emoji: '🎆', wordId: 'firework', isCorrect: false },
      { id: 'opt_lightning', label: 'Tia Sét', emoji: '⚡', wordId: 'lightning', isCorrect: false },
    ],
    funFact: 'Sao băng thực chất là những mảnh bụi vũ trụ nhỏ rơi vào khí quyển Trái Đất và bốc cháy tạo nên vệt sáng!',
  },
  {
    id: 'case_space_09',
    worldId: 'space',
    caseNumber: 9,
    title: 'Vụ án 09: Cánh Cổng Tròn Xoay Vệ Tinh Nhân Tạo',
    targetWordId: 'satellite',
    labelVi: 'VỆ TINH',
    labelEn: 'Satellite',
    emoji: '🛰️',
    cluePoem: [
      'Xòe hai cánh pin mặt trời',
      'Truyền sóng tín hiệu nối người gần nhau?',
    ],
    suspectOptions: [
      { id: 'opt_satellite', label: 'Vệ Tinh', emoji: '🛰️', wordId: 'satellite', isCorrect: true },
      { id: 'opt_antenna', label: 'Cột Thu Sóng', emoji: '📡', wordId: 'antenna', isCorrect: false },
      { id: 'opt_rocket', label: 'Tên Lửa', emoji: '🚀', wordId: 'rocket', isCorrect: false },
      { id: 'opt_telescope', label: 'Kính Viễn Vọng', emoji: '🔭', wordId: 'telescope', isCorrect: false },
    ],
    funFact: 'Vệ tinh bay quanh Trái Đất giúp chúng ta xem TV trực tiếp, dự báo thời tiết và chỉ đường GPS trên điện thoại!',
  },
  {
    id: 'case_space_10',
    worldId: 'space',
    caseNumber: 10,
    title: 'Vụ án 10: Ống Kính Ma Thuật Ngắm Ngàn Vì Sao',
    targetWordId: 'telescope',
    labelVi: 'KÍNH THIÊN VĂN',
    labelEn: 'Telescope',
    emoji: '🔭',
    cluePoem: [
      'Mắt nhìn xa tít không gian',
      'Ngắm nhìn vũ trụ muôn vàn vì sao?',
    ],
    suspectOptions: [
      { id: 'opt_telescope', label: 'Kính Thiên Văn', emoji: '🔭', wordId: 'telescope', isCorrect: true },
      { id: 'opt_microscope', label: 'Kính Hiển Vi', emoji: '🔬', wordId: 'microscope', isCorrect: false },
      { id: 'opt_glasses', label: 'Kính Râm', emoji: '🕶️', wordId: 'glasses', isCorrect: false },
      { id: 'opt_camera', label: 'Máy Ảnh', emoji: '📷', wordId: 'camera', isCorrect: false },
    ],
    funFact: 'Kính thiên văn không gian Hubble bay ngoài vũ trụ đã chụp được những bức ảnh tuyệt đẹp của các thiên hà xa xôi!',
  },
];

export function getShadowCasesByWorld(worldId: DetectiveWorldId): ShadowCaseItem[] {
  return SHADOW_CASES_DATA.filter((c) => c.worldId === worldId);
}

export function getShadowCaseById(id: string): ShadowCaseItem | undefined {
  return SHADOW_CASES_DATA.find((c) => c.id === id);
}

export function createSyntheticDetectiveCard(caseItem: ShadowCaseItem): VocabCard {
  return {
    id: caseItem.targetWordId,
    english: caseItem.labelEn,
    vietnamese: caseItem.labelVi,
    emoji: caseItem.emoji,
    category: caseItem.worldId,
    color: '#8B5CF6',
    ipa: '',
    exampleEn: '',
    exampleVi: '',
    funFact: caseItem.funFact,
  };
}
