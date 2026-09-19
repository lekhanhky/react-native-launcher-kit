/**
 * Launcher Games Registry - Kids Wonder Park Edition
 * Danh mục chuẩn hoá toàn bộ các trò chơi nội bộ và ứng dụng video an toàn.
 */

export type LauncherCategoryType = 'all' | 'learn' | 'puzzle' | 'creative' | 'video' | 'apps';

export interface LauncherGameItem {
  id: string;
  title: string;
  category: 'learn' | 'puzzle' | 'creative' | 'video';
  iconEmoji: string;
  gradientColors: [string, string];
  badge?: string;
  badgeBg?: string;
  description: string;
  rating?: number;
}

export interface CategoryTabItem {
  id: LauncherCategoryType;
  label: string;
  icon: string;
  color: string;
}

export const LAUNCHER_CATEGORY_TABS: CategoryTabItem[] = [
  { id: 'all', label: 'Tất cả', icon: '🌟', color: '#3B82F6' },
  { id: 'learn', label: 'Khám phá', icon: '🎴', color: '#10B981' },
  { id: 'puzzle', label: 'Trí tuệ', icon: '🎮', color: '#8B5CF6' },
  { id: 'creative', label: 'Sáng tạo', icon: '🎨', color: '#EC4899' },
  { id: 'video', label: 'Video', icon: '📺', color: '#EF4444' },
  { id: 'apps', label: 'App của bé', icon: '📱', color: '#F59E0B' },
];

export const INTERNAL_GAMES_REGISTRY: LauncherGameItem[] = [
  // --- KHÁM PHÁ & HỌC TẬP (LEARN) ---
  {
    id: 'internal.game.flashcards',
    title: 'Thẻ Bài 3D',
    category: 'learn',
    iconEmoji: '🎴',
    gradientColors: ['#FF6B08', '#F59E0B'],
    badge: '3D THỰC TẾ',
    badgeBg: '#EF4444',
    description: 'Từ vựng 3D đời thật & Sổ Pokédex',
    rating: 5,
  },
  {
    id: 'internal.game.natureexplorer',
    title: 'Tự Nhiên 3D',
    category: 'learn',
    iconEmoji: '🌿',
    gradientColors: ['#10B981', '#059669'],
    badge: 'HOT',
    badgeBg: '#F59E0B',
    description: 'Bách thảo, rạp phim & vòng đời sinh vật',
    rating: 5,
  },
  {
    id: 'internal.game.solarsystem',
    title: 'Hệ Mặt Trời',
    category: 'learn',
    iconEmoji: '🪐',
    gradientColors: ['#6366F1', '#4F46E5'],
    badge: '3D VŨ TRỤ',
    badgeBg: '#8B5CF6',
    description: 'Khám phá 8 hành tinh kỳ vĩ',
    rating: 5,
  },
  {
    id: 'internal.game.continentexplorer',
    title: 'Năm Châu Bốn Bể',
    category: 'learn',
    iconEmoji: '🦅',
    gradientColors: ['#0284C7', '#0369A1'],
    description: 'Hành trình thám hiểm địa cầu',
    rating: 5,
  },
  {
    id: 'internal.game.fourseasons',
    title: 'Bốn Mùa Kỳ Diệu',
    category: 'learn',
    iconEmoji: '🦋',
    gradientColors: ['#EC4899', '#DB2777'],
    description: 'Khám phá Xuân Hạ Thu Đông',
    rating: 5,
  },
  {
    id: 'internal.game.math',
    title: 'Bé Học Toán',
    category: 'learn',
    iconEmoji: '🧮',
    gradientColors: ['#3B82F6', '#1D4ED8'],
    description: 'Đua tốc độ toán học vui vẻ',
    rating: 4,
  },
  {
    id: 'internal.game.wordspelling',
    title: 'Ghép Vần Chữ',
    category: 'learn',
    iconEmoji: '📝',
    gradientColors: ['#F97316', '#EA580C'],
    description: 'Ghép chữ và đánh vần tiếng Việt',
    rating: 4,
  },

  // --- TRÍ TUỆ & CÂU ĐỐ (PUZZLE) ---
  {
    id: 'internal.game.riddles100',
    title: '100 Câu Đố',
    category: 'puzzle',
    iconEmoji: '🕵️‍♂️',
    gradientColors: ['#F59E0B', '#D97706'],
    badge: '100 CÂU',
    badgeBg: '#EF4444',
    description: 'Thơ đố vần, bục 3D & 5 thế giới kỳ thú',
    rating: 5,
  },
  {
    id: 'internal.game.shadowdetective',
    title: 'Soi Bóng Đen',
    category: 'puzzle',
    iconEmoji: '🔦',
    gradientColors: ['#6366F1', '#4F46E5'],
    badge: 'MỚI • 3D',
    badgeBg: '#10B981',
    description: 'Đèn pin ma thuật soi bóng đoán hình',
    rating: 5,
  },
  {
    id: 'internal.game.spaceshooter',
    title: 'Phi Hành Gia',
    category: 'puzzle',
    iconEmoji: '🚀',
    gradientColors: ['#8B5CF6', '#6D28D9'],
    badge: 'SIÊU TỐC',
    badgeBg: '#EC4899',
    description: 'Bắn thiên thạch săn sao vàng',
    rating: 5,
  },
  {
    id: 'internal.game.memory',
    title: 'Lật Thẻ Trí Nhớ',
    category: 'puzzle',
    iconEmoji: '🃏',
    gradientColors: ['#7C3AED', '#5B21B6'],
    description: 'Rèn luyện trí nhớ siêu phàm',
    rating: 4,
  },
  {
    id: 'internal.game.jigsaw',
    title: 'Ghép Tranh',
    category: 'puzzle',
    iconEmoji: '🖼️',
    gradientColors: ['#14B8A6', '#0F766E'],
    description: 'Ghép mảnh hoàn chỉnh bức tranh',
    rating: 4,
  },
  {
    id: 'internal.game.tangram',
    title: 'Xếp Tangram',
    category: 'puzzle',
    iconEmoji: '🧩',
    gradientColors: ['#F59E0B', '#B45309'],
    description: 'Xếp hình 7 mảnh trí tuệ',
    rating: 4,
  },
  {
    id: 'internal.game.maze',
    title: 'Mê Cung Tìm Tổ',
    category: 'puzzle',
    iconEmoji: '🌀',
    gradientColors: ['#06B6D4', '#0E7490'],
    description: 'Tìm đường về nhà khéo léo',
    rating: 4,
  },
  {
    id: 'internal.game.connectdots',
    title: 'Nối Điểm Số',
    category: 'puzzle',
    iconEmoji: '🔢',
    gradientColors: ['#3B82F6', '#1E40AF'],
    description: 'Nối số hé lộ hình bí mật',
    rating: 4,
  },
  {
    id: 'internal.game.robotcoder',
    title: 'Robot Lập Trình',
    category: 'puzzle',
    iconEmoji: '🤖',
    gradientColors: ['#64748B', '#334155'],
    badge: 'STEAM',
    badgeBg: '#3B82F6',
    description: 'Chỉ huy robot giải cứu thế giới',
    rating: 5,
  },
  {
    id: 'internal.game.shadowmatch',
    title: 'Tìm Bóng Hình',
    category: 'puzzle',
    iconEmoji: '👥',
    gradientColors: ['#475569', '#1E293B'],
    description: 'Nhìn bóng đoán hình chuẩn xác',
    rating: 4,
  },
  {
    id: 'internal.game.spotdiff',
    title: 'Tìm Điểm Khác',
    category: 'puzzle',
    iconEmoji: '🔍',
    gradientColors: ['#D97706', '#92400E'],
    description: 'Thử tài tinh mắt quan sát',
    rating: 4,
  },
  {
    id: 'internal.game.bubblepop',
    title: 'Nổ Bong Bóng',
    category: 'puzzle',
    iconEmoji: '🎈',
    gradientColors: ['#F43F5E', '#BE123C'],
    description: 'Bấm nổ bong bóng sắc màu',
    rating: 4,
  },
  {
    id: 'internal.game.snakeedu',
    title: 'Rắn Săn Mồi',
    category: 'puzzle',
    iconEmoji: '🐍',
    gradientColors: ['#10B981', '#047857'],
    description: 'Ăn chữ và số thông minh',
    rating: 4,
  },
  {
    id: 'internal.game.balancescale',
    title: 'Cân Thăng Bằng',
    category: 'puzzle',
    iconEmoji: '⚖️',
    gradientColors: ['#EAB308', '#A16207'],
    description: 'Học cân bằng trọng lượng',
    rating: 4,
  },

  // --- SÁNG TẠO & ĐỜI SỐNG (CREATIVE) ---
  {
    id: 'internal.game.coloring',
    title: 'Bé Tập Tô Màu',
    category: 'creative',
    iconEmoji: '🎨',
    gradientColors: ['#EF4444', '#B91C1C'],
    badge: 'YÊU THÍCH',
    badgeBg: '#F59E0B',
    description: 'Thỏa sức vẽ và tô tranh đẹp',
    rating: 5,
  },
  {
    id: 'internal.game.petcare',
    title: 'Chăm Thú Cưng',
    category: 'creative',
    iconEmoji: '🐾',
    gradientColors: ['#EC4899', '#BE185D'],
    badge: 'MỚI',
    badgeBg: '#10B981',
    description: 'Cho ăn, tắm rửa và chơi cùng thú cưng',
    rating: 5,
  },
  {
    id: 'internal.game.xylophone',
    title: 'Đàn Xylophone',
    category: 'creative',
    iconEmoji: '🎹',
    gradientColors: ['#A855F7', '#7E22CE'],
    description: 'Gõ nốt nhạc phát âm thanh thánh thót',
    rating: 5,
  },
  {
    id: 'internal.game.gardener',
    title: 'Vườn Của Bé',
    category: 'creative',
    iconEmoji: '🌱',
    gradientColors: ['#84CC16', '#4D7C0F'],
    description: 'Tưới cây, gieo hạt, thu hoạch quả',
    rating: 4,
  },
  {
    id: 'internal.game.weatherdress',
    title: 'Thời Trang',
    category: 'creative',
    iconEmoji: '👗',
    gradientColors: ['#06B6D4', '#0369A1'],
    description: 'Phối đồ sành điệu theo thời tiết',
    rating: 4,
  },
  {
    id: 'internal.game.dentalhabits',
    title: 'Bé Đánh Răng',
    category: 'creative',
    iconEmoji: '🦷',
    gradientColors: ['#38BDF8', '#0284C7'],
    description: 'Tập đánh răng bảo vệ nụ cười sáng',
    rating: 4,
  },
  {
    id: 'internal.game.sorting',
    title: 'Phân Loại Rác',
    category: 'creative',
    iconEmoji: '♻️',
    gradientColors: ['#10B981', '#065F46'],
    description: 'Bảo vệ môi trường xanh sạch',
    rating: 4,
  },
  {
    id: 'internal.game.emotions',
    title: 'Vườn Cảm Xúc',
    category: 'creative',
    iconEmoji: '😊',
    gradientColors: ['#FBBF24', '#D97706'],
    description: 'Nhận biết cảm xúc vui, buồn, giận',
    rating: 4,
  },
  {
    id: 'internal.game.animalsound',
    title: 'Tiếng Con Vật',
    category: 'creative',
    iconEmoji: '🐶',
    gradientColors: ['#F97316', '#C2410C'],
    description: 'Nghe tiếng đoán đúng con vật',
    rating: 4,
  },

  // --- VIDEO AN TOÀN (VIDEO) ---
  {
    id: 'internal.safe.greentube',
    title: 'GreenTube',
    category: 'video',
    iconEmoji: '▶',
    gradientColors: ['#10B981', '#059669'],
    badge: 'AN TOÀN',
    badgeBg: '#10B981',
    description: 'Video hoạt hình giáo dục chọn lọc',
    rating: 5,
  },
  {
    id: 'internal.safe.youtube',
    title: 'Kids YouTube',
    category: 'video',
    iconEmoji: '▶',
    gradientColors: ['#EF4444', '#DC2626'],
    badge: 'SAFE',
    badgeBg: '#EF4444',
    description: 'Kênh thiếu nhi an toàn',
    rating: 5,
  },
];

export const HERO_FEATURED_GAMES = [
  {
    id: 'internal.game.shadowdetective',
    title: 'Thám Tử Soi Đèn Pin',
    tagline: 'Soi bóng đen 3D ma mị & giải mã 40 vụ án kỳ bí',
    emoji: '🔦',
    quest: 'Nhiệm vụ: Cầm đèn pin soi bóng đoán đúng 3 vụ án!',
    badge: 'MỚI RA MẮT • 3D',
    colors: ['#6366F1', '#4F46E5'] as [string, string],
  },
  {
    id: 'internal.game.riddles100',
    title: '100 Câu Đố Kỳ Thú',
    tagline: 'Thơ vần lục bát, bục 3D & chế độ đấu trí 2 người',
    emoji: '🕵️‍♂️',
    quest: 'Nhiệm vụ: Vượt 5 câu đố để mở khóa rương hoàng kim!',
    badge: 'ĐẤU TRÍ 2 NGƯỜI',
    colors: ['#F59E0B', '#D97706'] as [string, string],
  },
  {
    id: 'internal.game.flashcards',
    title: 'Thẻ Bài 3D Đời Thật',
    tagline: 'Khám phá 500+ từ vựng & muôn loài sinh động',
    emoji: '🦁',
    quest: 'Nhiệm vụ: Học 3 thẻ bài mới để nhận 1 Gói Thẻ Vàng!',
    badge: 'ĐỀ XUẤT HÔM NAY',
    colors: ['#FF6B08', '#F59E0B'] as [string, string],
  },
  {
    id: 'internal.game.natureexplorer',
    title: 'Nhà Sinh Học Nhí',
    tagline: 'Vườn bách thảo, rạp chiếu phim & vòng đời sinh vật',
    emoji: '🌿',
    quest: 'Nhiệm vụ: Bật kính lúp quan sát sâu bướm và cho cây ăn!',
    badge: 'HOT TUẦN NÀY',
    colors: ['#10B981', '#059669'] as [string, string],
  },
  {
    id: 'internal.game.spaceshooter',
    title: 'Phi Hành Gia Nhí',
    tagline: 'Lái phi thuyền vượt thiên thạch đạt kỷ lục 60s',
    emoji: '🚀',
    quest: 'Nhiệm vụ: Đạt chuỗi 100 điểm thử thách!',
    badge: 'THỬ THÁCH',
    colors: ['#8B5CF6', '#6D28D9'] as [string, string],
  },
];

export const BOTTOM_DOCK_GAME_IDS = [
  'internal.game.flashcards',
  'internal.game.natureexplorer',
  'internal.safe.greentube',
  'internal.game.coloring',
];
