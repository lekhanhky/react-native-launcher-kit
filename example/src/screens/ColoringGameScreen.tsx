import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
  StatusBar,
  Animated,
  PanResponder,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { ThemeConfig } from '../services/themes';

interface ColoringGameScreenProps {
  theme?: ThemeConfig;
  onClose: () => void;
}

// Bảng màu 18 sắc màu rực rỡ dành cho bé
export const COLOR_PALETTE = [
  { id: 'red', name: 'Đỏ Dâu', hex: '#FF2E63', border: '#D61A4C' },
  { id: 'crimson', name: 'Đỏ Tươi', hex: '#EF4444', border: '#DC2626' },
  { id: 'orange', name: 'Cam Cà Rốt', hex: '#FF6B08', border: '#E05300' },
  { id: 'amber', name: 'Cam San Hô', hex: '#F97316', border: '#C2410C' },
  { id: 'yellow', name: 'Vàng Hoàng Yến', hex: '#FFD100', border: '#D4AA00' },
  { id: 'lime', name: 'Xanh Chuối', hex: '#84CC16', border: '#65A30D' },
  { id: 'green', name: 'Xanh Lá Tươi', hex: '#10B981', border: '#059669' },
  { id: 'teal', name: 'Xanh Ngọc', hex: '#14B8A6', border: '#0D9488' },
  { id: 'cyan', name: 'Xanh Da Trời', hex: '#06B6D4', border: '#0891B2' },
  { id: 'blue', name: 'Xanh Biển Sâu', hex: '#3B82F6', border: '#1D4ED8' },
  { id: 'indigo', name: 'Xanh Chàm', hex: '#6366F1', border: '#4338CA' },
  { id: 'purple', name: 'Tím Phép Thuật', hex: '#8B5CF6', border: '#6D28D9' },
  { id: 'pink', name: 'Hồng Kẹo Ngọt', hex: '#EC4899', border: '#BE185D' },
  { id: 'rose', name: 'Hồng Pastel', hex: '#F472B6', border: '#DB2777' },
  { id: 'brown', name: 'Nâu Socola', hex: '#854D0E', border: '#713F12' },
  { id: 'dark', name: 'Đen Mực', hex: '#1E293B', border: '#0F172A' },
  { id: 'gray', name: 'Xám Bạc', hex: '#94A3B8', border: '#64748B' },
  { id: 'white', name: 'Trắng Sữa', hex: '#FFFFFF', border: '#CBD5E1' },
];

export const STICKERS = [
  '⭐', '🌟', '✨', '🌈', '❤️', '💖', '👑', '💎',
  '🌸', '🌻', '🍭', '🍦', '🎈', '🚀', '🐱', '🐶',
  '🦋', '🍄', '🍎', '🍉', '🚗', '🦄', '🦖', '🤖'
];

export type BrushType = 'crayon' | 'neon' | 'rainbow' | 'sparkle' | 'eraser';
export type ActiveTab = 'templates' | 'doodle' | 'stickers';

// Dữ liệu vùng tranh mẫu
export interface TemplatePart {
  id: string;
  name: string;
  defaultColor?: string;
  style: any;
  label?: string;
  emoji?: string;
}

export interface ArtTemplate {
  id: string;
  title: string;
  category: string;
  emoji: string;
  bgDefaultColor: string;
  parts: TemplatePart[];
}

// Danh sách các tranh mẫu tương tác sinh động
export const ART_TEMPLATES: ArtTemplate[] = [
  {
    id: 'car',
    title: 'Xe Đua Siêu Tốc',
    category: 'Phương tiện',
    emoji: '🚗',
    bgDefaultColor: '#E0F2FE',
    parts: [
      { id: 'sun', name: 'Mặt trời', style: { width: 56, height: 56, borderRadius: 28, position: 'absolute', top: 16, right: 24, zIndex: 2 }, emoji: '☀️' },
      { id: 'cloud_1', name: 'Mây xanh 1', style: { width: 80, height: 36, borderRadius: 18, position: 'absolute', top: 22, left: 30, zIndex: 2 }, emoji: '☁️' },
      { id: 'cloud_2', name: 'Mây xanh 2', style: { width: 68, height: 32, borderRadius: 16, position: 'absolute', top: 48, left: 90, zIndex: 2 }, emoji: '☁️' },
      { id: 'road', name: 'Mặt đường đua', style: { position: 'absolute', bottom: 12, left: 10, right: 10, height: 48, borderRadius: 14, zIndex: 1 }, label: '🏁 ĐƯỜNG ĐUA' },
      { id: 'car_roof', name: 'Mui & Kính xe', style: { width: 140, height: 60, borderTopLeftRadius: 36, borderTopRightRadius: 36, position: 'absolute', top: 96, alignSelf: 'center', zIndex: 3 }, emoji: '🪟' },
      { id: 'car_body', name: 'Thân xe ô tô', style: { width: 230, height: 66, borderRadius: 20, position: 'absolute', top: 145, alignSelf: 'center', zIndex: 4 }, label: '⚡ SIÊU XE ⚡' },
      { id: 'headlight_left', name: 'Đèn xe trái', style: { width: 24, height: 24, borderRadius: 12, position: 'absolute', top: 154, left: 40, zIndex: 5 }, emoji: '💡' },
      { id: 'headlight_right', name: 'Đèn xe phải', style: { width: 24, height: 24, borderRadius: 12, position: 'absolute', top: 154, right: 40, zIndex: 5 }, emoji: '💡' },
      { id: 'wheel_left', name: 'Bánh xe trước', style: { width: 58, height: 58, borderRadius: 29, position: 'absolute', top: 182, left: 56, zIndex: 6, borderWidth: 7, borderColor: '#1E293B' }, emoji: '⚙️' },
      { id: 'wheel_right', name: 'Bánh xe sau', style: { width: 58, height: 58, borderRadius: 29, position: 'absolute', top: 182, right: 56, zIndex: 6, borderWidth: 7, borderColor: '#1E293B' }, emoji: '⚙️' },
    ],
  },
  {
    id: 'unicorn',
    title: 'Kỳ Lân Phép Thuật',
    category: 'Cổ tích',
    emoji: '🦄',
    bgDefaultColor: '#FDF2F8',
    parts: [
      { id: 'rainbow_arc', name: 'Cầu vồng phép màu', style: { width: 220, height: 70, borderTopLeftRadius: 110, borderTopRightRadius: 110, position: 'absolute', top: 14, alignSelf: 'center', zIndex: 1 }, emoji: '🌈' },
      { id: 'star_left', name: 'Sao lấp lánh', style: { width: 44, height: 44, borderRadius: 22, position: 'absolute', top: 28, left: 24, zIndex: 2 }, emoji: '⭐' },
      { id: 'star_right', name: 'Sao diệu kỳ', style: { width: 44, height: 44, borderRadius: 22, position: 'absolute', top: 32, right: 24, zIndex: 2 }, emoji: '✨' },
      { id: 'horn', name: 'Sừng kỳ lân', style: { width: 36, height: 60, borderTopLeftRadius: 18, borderTopRightRadius: 18, position: 'absolute', top: 70, alignSelf: 'center', zIndex: 5 }, emoji: '🌟' },
      { id: 'mane', name: 'Bờm tóc 7 màu', style: { width: 150, height: 70, borderRadius: 35, position: 'absolute', top: 104, alignSelf: 'center', zIndex: 3 }, label: '💖 BỜM TÓC' },
      { id: 'face', name: 'Khuôn mặt kỳ lân', style: { width: 120, height: 90, borderRadius: 45, position: 'absolute', top: 120, alignSelf: 'center', zIndex: 4 }, emoji: '👀' },
      { id: 'cheeks', name: 'Má hồng xinh', style: { width: 80, height: 26, borderRadius: 13, position: 'absolute', top: 182, alignSelf: 'center', zIndex: 5 }, emoji: '🌸' },
      { id: 'body', name: 'Thân kỳ lân', style: { width: 190, height: 80, borderRadius: 40, position: 'absolute', top: 188, alignSelf: 'center', zIndex: 3 }, label: '🦄 KỲ LÂN' },
      { id: 'cloud_base', name: 'Đám mây êm ái', style: { position: 'absolute', bottom: 10, left: 20, right: 20, height: 44, borderRadius: 22, zIndex: 2 }, emoji: '☁️' },
    ],
  },
  {
    id: 'rocket',
    title: 'Tên Lửa Không Gian',
    category: 'Vũ trụ',
    emoji: '🚀',
    bgDefaultColor: '#0F172A',
    parts: [
      { id: 'moon', name: 'Mặt trăng khuyết', style: { width: 50, height: 50, borderRadius: 25, position: 'absolute', top: 18, left: 24, zIndex: 2 }, emoji: '🌙' },
      { id: 'planet_1', name: 'Hành tinh sao hỏa', style: { width: 46, height: 46, borderRadius: 23, position: 'absolute', top: 22, right: 30, zIndex: 2 }, emoji: '🪐' },
      { id: 'rocket_nose', name: 'Mũi tên lửa', style: { width: 64, height: 60, borderTopLeftRadius: 32, borderTopRightRadius: 32, position: 'absolute', top: 60, alignSelf: 'center', zIndex: 5 }, emoji: '🔺' },
      { id: 'rocket_hull', name: 'Thân tàu vũ trụ', style: { width: 90, height: 110, borderRadius: 18, position: 'absolute', top: 112, alignSelf: 'center', zIndex: 4 }, label: '🚀 NASA' },
      { id: 'rocket_window', name: 'Cửa sổ kính tròn', style: { width: 52, height: 52, borderRadius: 26, position: 'absolute', top: 130, alignSelf: 'center', zIndex: 6, borderWidth: 4, borderColor: '#E2E8F0' }, emoji: '👨‍🚀' },
      { id: 'wing_left', name: 'Cánh tàu bên trái', style: { width: 44, height: 75, borderTopLeftRadius: 28, borderBottomLeftRadius: 10, position: 'absolute', top: 145, left: 75, zIndex: 3 }, emoji: '◀️' },
      { id: 'wing_right', name: 'Cánh tàu bên phải', style: { width: 44, height: 75, borderTopRightRadius: 28, borderBottomRightRadius: 10, position: 'absolute', top: 145, right: 75, zIndex: 3 }, emoji: '▶️' },
      { id: 'flame_outer', name: 'Ngọn lửa phản lực', style: { width: 70, height: 60, borderBottomLeftRadius: 35, borderBottomRightRadius: 35, position: 'absolute', top: 218, alignSelf: 'center', zIndex: 2 }, emoji: '🔥' },
    ],
  },
  {
    id: 'cake',
    title: 'Bánh Sinh Nhật Ngọt Ngào',
    category: 'Món ngon',
    emoji: '🎂',
    bgDefaultColor: '#FFFBEB',
    parts: [
      { id: 'candle_flame', name: 'Ngọn nến lung linh', style: { width: 32, height: 40, borderTopLeftRadius: 16, borderTopRightRadius: 16, position: 'absolute', top: 18, alignSelf: 'center', zIndex: 5 }, emoji: '🕯️' },
      { id: 'candle_body', name: 'Thân nến', style: { width: 22, height: 45, borderRadius: 6, position: 'absolute', top: 56, alignSelf: 'center', zIndex: 4 }, emoji: '✨' },
      { id: 'strawberries', name: 'Hàng dâu tây', style: { width: 140, height: 32, borderRadius: 16, position: 'absolute', top: 96, alignSelf: 'center', zIndex: 4 }, emoji: '🍓🍓🍓' },
      { id: 'cake_layer_top', name: 'Tầng bánh trên', style: { width: 160, height: 58, borderRadius: 14, position: 'absolute', top: 118, alignSelf: 'center', zIndex: 3 }, label: 'KEM SOCOLA' },
      { id: 'cream_frosting', name: 'Lớp kem chảy béo ngậy', style: { width: 190, height: 30, borderRadius: 15, position: 'absolute', top: 168, alignSelf: 'center', zIndex: 4 }, emoji: '🍦🍦🍦' },
      { id: 'cake_layer_bottom', name: 'Tầng bánh dưới', style: { width: 220, height: 68, borderRadius: 16, position: 'absolute', top: 188, alignSelf: 'center', zIndex: 2 }, label: '🎂 HAPPY BIRTHDAY 🎂' },
      { id: 'cake_plate', name: 'Đĩa đựng bánh', style: { position: 'absolute', bottom: 6, left: 16, right: 16, height: 32, borderRadius: 16, zIndex: 1 }, label: '👑 ĐĨA BẠC 👑' },
    ],
  },
  {
    id: 'fish',
    title: 'Chú Cá Đại Dương',
    category: 'Đại dương',
    emoji: '🐠',
    bgDefaultColor: '#ECFEFF',
    parts: [
      { id: 'bubble_1', name: 'Bọt biển to', style: { width: 36, height: 36, borderRadius: 18, position: 'absolute', top: 20, right: 40, zIndex: 2 }, emoji: '🫧' },
      { id: 'bubble_2', name: 'Bọt biển nhỏ', style: { width: 26, height: 26, borderRadius: 13, position: 'absolute', top: 56, right: 65, zIndex: 2 }, emoji: '🫧' },
      { id: 'tail_fin', name: 'Đuôi cá uốn lượn', style: { width: 80, height: 100, borderTopLeftRadius: 40, borderBottomLeftRadius: 40, position: 'absolute', top: 85, left: 30, zIndex: 2 }, emoji: '🌊' },
      { id: 'top_fin', name: 'Vây lưng nhọn', style: { width: 70, height: 40, borderTopLeftRadius: 35, borderTopRightRadius: 35, position: 'absolute', top: 60, alignSelf: 'center', zIndex: 2 }, emoji: '🦈' },
      { id: 'fish_body', name: 'Thân cá tròn xinh', style: { width: 170, height: 110, borderRadius: 55, position: 'absolute', top: 90, alignSelf: 'center', zIndex: 3 }, emoji: '✨' },
      { id: 'fish_eye', name: 'Mắt cá long lanh', style: { width: 34, height: 34, borderRadius: 17, position: 'absolute', top: 110, right: 90, zIndex: 5, borderWidth: 4, borderColor: '#1E293B' }, emoji: '👀' },
      { id: 'fish_stripes', name: 'Sọc vằn rực rỡ', style: { width: 50, height: 90, borderRadius: 25, position: 'absolute', top: 100, alignSelf: 'center', zIndex: 4 }, label: '🐠' },
      { id: 'seaweed', name: 'Rạn san hô & Rong biển', style: { position: 'absolute', bottom: 10, left: 16, right: 16, height: 46, borderRadius: 20, zIndex: 1 }, emoji: '🌿 🪸 🌿' },
    ],
  },
  {
    id: 'dino',
    title: 'Khủng Long Dễ Thương',
    category: 'Động vật',
    emoji: '🦖',
    bgDefaultColor: '#F0FDF4',
    parts: [
      { id: 'sun_dino', name: 'Mặt trời rừng xanh', style: { width: 52, height: 52, borderRadius: 26, position: 'absolute', top: 16, left: 24, zIndex: 2 }, emoji: '☀️' },
      { id: 'dino_spikes', name: 'Gai lưng ngộ nghĩnh', style: { width: 160, height: 36, borderTopLeftRadius: 18, borderTopRightRadius: 18, position: 'absolute', top: 65, alignSelf: 'center', zIndex: 2 }, emoji: '🔺🔺🔺🔺' },
      { id: 'dino_head', name: 'Đầu khủng long', style: { width: 100, height: 80, borderRadius: 40, position: 'absolute', top: 86, alignSelf: 'center', zIndex: 4 }, emoji: '🦖' },
      { id: 'dino_eye', name: 'Mắt khủng long', style: { width: 30, height: 30, borderRadius: 15, position: 'absolute', top: 100, left: 140, zIndex: 5 }, emoji: '👀' },
      { id: 'dino_belly', name: 'Bụng khủng long', style: { width: 160, height: 100, borderRadius: 50, position: 'absolute', top: 140, alignSelf: 'center', zIndex: 3 }, label: '💚 BÉ DINO' },
      { id: 'dino_leg_left', name: 'Chân trái', style: { width: 44, height: 44, borderRadius: 22, position: 'absolute', top: 220, left: 95, zIndex: 2 }, emoji: '🦶' },
      { id: 'dino_leg_right', name: 'Chân phải', style: { width: 44, height: 44, borderRadius: 22, position: 'absolute', top: 220, right: 95, zIndex: 2 }, emoji: '🦶' },
      { id: 'grass_field', name: 'Đồng cỏ xanh tươi', style: { position: 'absolute', bottom: 8, left: 12, right: 12, height: 36, borderRadius: 18, zIndex: 1 }, emoji: '🌱 🌸 🌱 🌸' },
    ],
  },
  {
    id: 'butterfly',
    title: 'Bướm Hoa Rực Rỡ',
    category: 'Thiên nhiên',
    emoji: '🦋',
    bgDefaultColor: '#FEF3C7',
    parts: [
      { id: 'flower_left', name: 'Bông hoa đỏ', style: { width: 50, height: 50, borderRadius: 25, position: 'absolute', bottom: 16, left: 24, zIndex: 2 }, emoji: '🌺' },
      { id: 'flower_right', name: 'Bông hoa vàng', style: { width: 50, height: 50, borderRadius: 25, position: 'absolute', bottom: 16, right: 24, zIndex: 2 }, emoji: '🌻' },
      { id: 'wing_top_left', name: 'Cánh bướm trên trái', style: { width: 90, height: 90, borderTopLeftRadius: 50, borderTopRightRadius: 20, borderBottomLeftRadius: 30, position: 'absolute', top: 40, left: 35, zIndex: 3 }, emoji: '🌸' },
      { id: 'wing_top_right', name: 'Cánh bướm trên phải', style: { width: 90, height: 90, borderTopRightRadius: 50, borderTopLeftRadius: 20, borderBottomRightRadius: 30, position: 'absolute', top: 40, right: 35, zIndex: 3 }, emoji: '🌸' },
      { id: 'wing_bot_left', name: 'Cánh bướm dưới trái', style: { width: 70, height: 70, borderBottomLeftRadius: 40, borderTopLeftRadius: 15, position: 'absolute', top: 120, left: 55, zIndex: 2 }, emoji: '✨' },
      { id: 'wing_bot_right', name: 'Cánh bướm dưới phải', style: { width: 70, height: 70, borderBottomRightRadius: 40, borderTopRightRadius: 15, position: 'absolute', top: 120, right: 55, zIndex: 2 }, emoji: '✨' },
      { id: 'butterfly_body', name: 'Thân bướm xinh', style: { width: 34, height: 130, borderRadius: 17, position: 'absolute', top: 50, alignSelf: 'center', zIndex: 4 }, label: '🦋' },
      { id: 'antenna', name: 'Râu bướm', style: { width: 50, height: 26, borderRadius: 13, position: 'absolute', top: 26, alignSelf: 'center', zIndex: 5 }, emoji: '👀' },
    ],
  },
  {
    id: 'castle',
    title: 'Lâu Đài Cổ Tích',
    category: 'Cổ tích',
    emoji: '🏰',
    bgDefaultColor: '#EDE9FE',
    parts: [
      { id: 'cloud_castle', name: 'Mây hồng cổ tích', style: { width: 100, height: 40, borderRadius: 20, position: 'absolute', top: 20, left: 20, zIndex: 2 }, emoji: '☁️' },
      { id: 'flag_center', name: 'Cờ hoàng gia', style: { width: 30, height: 36, borderTopRightRadius: 15, position: 'absolute', top: 24, alignSelf: 'center', zIndex: 5 }, emoji: '🚩' },
      { id: 'roof_center', name: 'Chóp mái chính', style: { width: 70, height: 50, borderTopLeftRadius: 35, borderTopRightRadius: 35, position: 'absolute', top: 56, alignSelf: 'center', zIndex: 4 }, emoji: '👑' },
      { id: 'tower_left', name: 'Tháp canh trái', style: { width: 60, height: 110, borderRadius: 12, position: 'absolute', top: 90, left: 40, zIndex: 3 }, label: '🏰 THÁP' },
      { id: 'tower_right', name: 'Tháp canh phải', style: { width: 60, height: 110, borderRadius: 12, position: 'absolute', top: 90, right: 40, zIndex: 3 }, label: '🏰 THÁP' },
      { id: 'main_wall', name: 'Tường thành trung tâm', style: { width: 130, height: 95, borderRadius: 14, position: 'absolute', top: 105, alignSelf: 'center', zIndex: 2 }, label: 'LÂU ĐÀI' },
      { id: 'gate', name: 'Cổng thành vòm', style: { width: 54, height: 55, borderTopLeftRadius: 27, borderTopRightRadius: 27, position: 'absolute', top: 145, alignSelf: 'center', zIndex: 4 }, emoji: '🚪' },
      { id: 'ground_castle', name: 'Bãi cỏ trước thành', style: { position: 'absolute', bottom: 8, left: 10, right: 10, height: 36, borderRadius: 18, zIndex: 1 }, emoji: '🌷 🌷 🌷 🌷' },
    ],
  },
];

// Định dạng nét vẽ tự do
interface DoodleStroke {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  width: number;
  type: BrushType;
}

// Sticker được dán lên canvas
interface PlacedSticker {
  id: string;
  x: number;
  y: number;
  emoji: string;
  size: number;
}

export const ColoringGameScreen: React.FC<ColoringGameScreenProps> = ({ onClose }) => {
  const { width, height } = useWindowDimensions();

  const [activeTab, setActiveTab] = useState<ActiveTab>('templates');
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  const currentTemplate = ART_TEMPLATES[selectedTemplateIndex];

  // Modal xem và chọn Lưới Tranh Mẫu (Template Grid Modal)
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState<boolean>(false);

  // Màu đang chọn
  const [selectedColorHex, setSelectedColorHex] = useState<string>(COLOR_PALETTE[0].hex);
  
  // Màu đã tô cho các vùng trong tranh mẫu (Key: templateId_partId -> colorHex)
  const [filledColors, setFilledColors] = useState<{ [key: string]: string }>({});

  // Cọ vẽ tự do
  const [brushType, setBrushType] = useState<BrushType>('crayon');
  const [strokeWidth, setStrokeWidth] = useState<number>(10);
  const [strokes, setStrokes] = useState<DoodleStroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<DoodleStroke | null>(null);

  // Sticker
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([]);
  const [selectedSticker, setSelectedSticker] = useState<string>(STICKERS[0]);

  // Thông báo / Phản hồi hiệu ứng
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isVictoryModalVisible, setIsVictoryModalVisible] = useState<boolean>(false);
  const victoryScale = useRef(new Animated.Value(0.3)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Hiệu ứng thông báo nhỏ
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 1800);
  };

  // 1. Chạm vào vùng tranh để đổ màu (Tap-to-color Flood Fill)
  const handleColorPart = (partId: string, partName: string) => {
    const key = `${currentTemplate.id}_${partId}`;
    const newColor = selectedColorHex;
    setFilledColors((prev) => ({
      ...prev,
      [key]: newColor,
    }));

    // Hiệu ứng nảy nhẹ
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.08, duration: 100, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();

    showToast(`🎨 Đã tô ${partName}!`);
  };

  // Tô phép màu tự động ngẫu nhiên tất cả các vùng (Magic Brush)
  const handleMagicAutoFill = () => {
    const newFill = { ...filledColors };
    currentTemplate.parts.forEach((part) => {
      const key = `${currentTemplate.id}_${part.id}`;
      const randomColor = COLOR_PALETTE[Math.floor(Math.random() * (COLOR_PALETTE.length - 2))].hex;
      newFill[key] = randomColor;
    });
    setFilledColors(newFill);
    showToast('🪄 Phép thuật rực rỡ biến hình!');
  };

  // Xóa trắng bức tranh hiện tại
  const handleClearCurrentTemplate = () => {
    const newFill = { ...filledColors };
    currentTemplate.parts.forEach((part) => {
      delete newFill[`${currentTemplate.id}_${part.id}`];
    });
    setFilledColors(newFill);
    showToast('🧹 Đã tẩy sạch tranh!');
  };

  // Ref lưu trạng thái hiện tại để PanResponder không bị dính closure cũ
  const stateRef = useRef({
    activeTab,
    selectedSticker,
    brushType,
    selectedColorHex,
    strokeWidth,
  });

  // Cập nhật ref mỗi khi state thay đổi
  stateRef.current = {
    activeTab,
    selectedSticker,
    brushType,
    selectedColorHex,
    strokeWidth,
  };

  // 2. Xử lý vẽ tự do ngón tay (Freehand PanResponder)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        const tab = stateRef.current.activeTab;
        return tab === 'doodle' || tab === 'stickers';
      },
      onMoveShouldSetPanResponder: () => stateRef.current.activeTab === 'doodle',
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const { activeTab: tab, selectedSticker: stk, brushType: bt, selectedColorHex: clr, strokeWidth: sw } = stateRef.current;

        if (tab === 'stickers') {
          // Dán sticker ngay tại vị trí chạm
          const newSticker: PlacedSticker = {
            id: `stk_${Date.now()}_${Math.random()}`,
            x: locationX - 20,
            y: locationY - 20,
            emoji: stk,
            size: 38,
          };
          setPlacedStickers((prev) => [...prev, newSticker]);
          showToast(`Dán sticker ${stk}! ✨`);
          return;
        }

        if (tab === 'doodle') {
          const colorToUse =
            bt === 'eraser'
              ? '#FFFFFF'
              : bt === 'rainbow'
              ? COLOR_PALETTE[Math.floor(Math.random() * (COLOR_PALETTE.length - 2))].hex
              : clr;

          const stroke: DoodleStroke = {
            id: `stroke_${Date.now()}`,
            points: [{ x: locationX, y: locationY }],
            color: colorToUse,
            width: sw,
            type: bt,
          };
          setCurrentStroke(stroke);
        }
      },
      onPanResponderMove: (evt) => {
        if (stateRef.current.activeTab === 'doodle') {
          const { locationX, locationY } = evt.nativeEvent;
          setCurrentStroke((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              points: [...prev.points, { x: locationX, y: locationY }],
            };
          });
        }
      },
      onPanResponderRelease: () => {
        if (stateRef.current.activeTab === 'doodle') {
          setCurrentStroke((prev) => {
            if (prev && prev.points.length > 0) {
              setStrokes((all) => [...all, prev]);
            }
            return null;
          });
        }
      },
    })
  ).current;

  // Hoàn tác nét vẽ hoặc dán sticker gần nhất
  const handleUndo = () => {
    if (activeTab === 'doodle') {
      setStrokes((prev) => prev.slice(0, -1));
      showToast('↺ Đã hoàn tác nét vẽ!');
    } else if (activeTab === 'stickers') {
      setPlacedStickers((prev) => prev.slice(0, -1));
      showToast('↺ Đã gỡ sticker gần nhất!');
    } else {
      handleClearCurrentTemplate();
    }
  };

  // Làm sạch toàn bộ canvas vẽ
  const handleClearAllDoodles = () => {
    setStrokes([]);
    setPlacedStickers([]);
    showToast('✨ Đã làm mới trang vẽ!');
  };

  // Mở màn hình ăn mừng chiến thắng / tác phẩm đẹp
  const handleFinishArtwork = () => {
    setIsVictoryModalVisible(true);
    Animated.spring(victoryScale, {
      toValue: 1,
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  // Đếm số phần đã tô màu trong tranh
  const countColoredParts = useCallback(() => {
    let count = 0;
    currentTemplate.parts.forEach((part) => {
      if (filledColors[`${currentTemplate.id}_${part.id}`]) {
        count++;
      }
    });
    return count;
  }, [currentTemplate, filledColors]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1B4B" />

      {/* TIER 1: THANH HEADER KẾT HỢP TABS VÀ NÚT HÀNH ĐỘNG */}
      <View style={styles.headerBar}>
        {/* Nút Thoát */}
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={onClose}>
          <Text style={styles.backBtnText}>⬅</Text>
        </TouchableOpacity>

        {/* Cụm Tabs Chế Độ: Tranh, Vẽ, Dán */}
        <View style={styles.modeTabs}>
          <TouchableOpacity
            style={[styles.modeTabBtn, activeTab === 'templates' && styles.modeTabBtnActive]}
            onPress={() => setActiveTab('templates')}
            activeOpacity={0.8}
          >
            <Text style={[styles.modeTabText, activeTab === 'templates' && styles.modeTabTextActive]}>
              🖼️ Tranh
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeTabBtn, activeTab === 'doodle' && styles.modeTabBtnActive]}
            onPress={() => setActiveTab('doodle')}
            activeOpacity={0.8}
          >
            <Text style={[styles.modeTabText, activeTab === 'doodle' && styles.modeTabTextActive]}>
              ✏️ Vẽ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeTabBtn, activeTab === 'stickers' && styles.modeTabBtnActive]}
            onPress={() => setActiveTab('stickers')}
            activeOpacity={0.8}
          >
            <Text style={[styles.modeTabText, activeTab === 'stickers' && styles.modeTabTextActive]}>
              ✨ Dán
            </Text>
          </TouchableOpacity>
        </View>

        {/* Nút Hành Động Nhanh (Đũa thần, Xóa, Hoàn thành) */}
        <View style={styles.headerActions}>
          {activeTab === 'templates' && (
            <>
              <TouchableOpacity
                style={styles.headerActionBtn}
                activeOpacity={0.8}
                onPress={handleMagicAutoFill}
              >
                <Text style={styles.headerActionEmoji}>🪄</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerActionBtn}
                activeOpacity={0.8}
                onPress={handleClearCurrentTemplate}
              >
                <Text style={styles.headerActionEmoji}>🧹</Text>
              </TouchableOpacity>
            </>
          )}

          {activeTab === 'doodle' && (
            <>
              <TouchableOpacity
                style={styles.headerActionBtn}
                activeOpacity={0.8}
                onPress={handleUndo}
              >
                <Text style={styles.headerActionEmoji}>↺</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerActionBtn}
                activeOpacity={0.8}
                onPress={handleClearAllDoodles}
              >
                <Text style={styles.headerActionEmoji}>🧹</Text>
              </TouchableOpacity>
            </>
          )}

          {activeTab === 'stickers' && (
            <TouchableOpacity
              style={styles.headerActionBtn}
              activeOpacity={0.8}
              onPress={handleClearAllDoodles}
            >
              <Text style={styles.headerActionEmoji}>🧹</Text>
            </TouchableOpacity>
          )}

          {/* Nút Hoàn Thành ⭐ */}
          <TouchableOpacity
            style={styles.finishBtn}
            activeOpacity={0.8}
            onPress={handleFinishArtwork}
          >
            <Text style={styles.finishBtnText}>🌟</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* TIER 2: KHU VỰC CÔNG CỤ DẠNG LƯỚI (GRID ITEMS) RÕ RÀNG, DỄ BẤM */}
      <View style={styles.gridToolbarPanel}>
        {activeTab === 'templates' && (
          <View style={styles.templatesToolbarWrapper}>
            {/* 1. THANH CHỌN TRANH DẠNG THẺ GRID TRỰC QUAN */}
            <View style={styles.templateHeaderCard}>
              <TouchableOpacity
                style={styles.templateNavArrow}
                onPress={() =>
                  setSelectedTemplateIndex((prev) =>
                    prev > 0 ? prev - 1 : ART_TEMPLATES.length - 1
                  )
                }
                activeOpacity={0.7}
              >
                <Text style={styles.templateNavArrowText}>◀</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.templateDropdownBtn}
                onPress={() => setIsTemplateModalVisible(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.templateDropdownEmoji}>{currentTemplate.emoji}</Text>
                <View style={styles.templateDropdownInfo}>
                  <Text style={styles.templateDropdownTitle} numberOfLines={1}>
                    {currentTemplate.title}
                  </Text>
                  <Text style={styles.templateDropdownSub}>
                    {currentTemplate.category} • Đã tô {countColoredParts()}/
                    {currentTemplate.parts.length} vùng
                  </Text>
                </View>
                <View style={styles.gridIconBadge}>
                  <Text style={styles.gridIconBadgeText}>📑 Lưới Tranh</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.templateNavArrow}
                onPress={() =>
                  setSelectedTemplateIndex((prev) =>
                    prev < ART_TEMPLATES.length - 1 ? prev + 1 : 0
                  )
                }
                activeOpacity={0.7}
              >
                <Text style={styles.templateNavArrowText}>▶</Text>
              </TouchableOpacity>
            </View>

            {/* 2. LƯỚI BẢNG 18 MÀU 2 HÀNG RỰC RỠ */}
            <View style={styles.colorGridWrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.colorGridScrollContent}
              >
                <View style={styles.colorGridContainer}>
                  {COLOR_PALETTE.map((c) => {
                    const isSelected =
                      c.hex.toLowerCase() === selectedColorHex.toLowerCase();
                    return (
                      <TouchableOpacity
                        key={c.id}
                        style={[
                          styles.colorGridItem,
                          { backgroundColor: c.hex, borderColor: isSelected ? '#FFFFFF' : c.border },
                          isSelected && styles.colorGridItemActive,
                        ]}
                        onPress={() => {
                          setSelectedColorHex(c.hex);
                          showToast(`Đã chọn ${c.name}`);
                        }}
                        activeOpacity={0.7}
                      >
                        {isSelected && <Text style={styles.colorCheckMark}>✓</Text>}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          </View>
        )}

        {activeTab === 'doodle' && (
          <View style={styles.doodleToolbarWrapper}>
            {/* 1. Lưới chọn cọ vẽ */}
            <View style={styles.brushGridRow}>
              {[
                { id: 'crayon', name: '🖍️ Bút Sáp' },
                { id: 'neon', name: '💡 Neon' },
                { id: 'rainbow', name: '🌈 Cầu Vồng' },
                { id: 'eraser', name: '🧽 Tẩy' },
              ].map((b) => {
                const isSelected = brushType === b.id;
                return (
                  <TouchableOpacity
                    key={b.id}
                    style={[styles.brushGridCard, isSelected && styles.brushGridCardActive]}
                    onPress={() => setBrushType(b.id as BrushType)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.brushGridCardTitle,
                        isSelected && styles.brushGridCardTitleActive,
                      ]}
                    >
                      {b.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 2. Lưới màu sắc */}
            <View style={styles.colorGridWrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.colorGridScrollContent}
              >
                <View style={styles.colorGridContainer}>
                  {COLOR_PALETTE.map((c) => {
                    const isSelected =
                      c.hex.toLowerCase() === selectedColorHex.toLowerCase();
                    return (
                      <TouchableOpacity
                        key={c.id}
                        style={[
                          styles.colorGridItem,
                          { backgroundColor: c.hex, borderColor: isSelected ? '#FFFFFF' : c.border },
                          isSelected && styles.colorGridItemActive,
                        ]}
                        onPress={() => {
                          setSelectedColorHex(c.hex);
                          showToast(`Đã chọn ${c.name}`);
                        }}
                        activeOpacity={0.7}
                      >
                        {isSelected && <Text style={styles.colorCheckMark}>✓</Text>}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          </View>
        )}

        {activeTab === 'stickers' && (
          <View style={styles.stickerGridWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.stickerGridScrollContent}
            >
              <View style={styles.stickerGridContainer}>
                {STICKERS.map((stk, sIdx) => {
                  const isSelected = stk === selectedSticker;
                  return (
                    <TouchableOpacity
                      key={`stk_${sIdx}`}
                      style={[
                        styles.stickerGridItem,
                        isSelected && styles.stickerGridItemActive,
                      ]}
                      onPress={() => {
                        setSelectedSticker(stk);
                        showToast(`Đã chọn ${stk}`);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.stickerGridEmoji}>{stk}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        )}
      </View>

      {/* KHUNG VÙNG CANVAS TRANH VẼ RỘNG RÃI */}
      <View style={styles.canvasContainer}>
        {/* THÔNG BÁO POPUP NHỎ */}
        {toastMessage !== '' && (
          <View style={styles.toastBadge}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}

        {/* NỘI DUNG 1: TRANH MẪU ĐỔ MÀU TƯƠNG TÁC */}
        {activeTab === 'templates' && (
          <Animated.View
            style={[
              styles.artworkBoard,
              {
                backgroundColor: currentTemplate.bgDefaultColor,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            {/* Lưới các chi tiết hình vẽ có thể chạm để tô */}
            {currentTemplate.parts.map((part) => {
              const key = `${currentTemplate.id}_${part.id}`;
              const partBg = filledColors[key] || '#FFFFFF';
              const isColored = Boolean(filledColors[key]);
              
              // Scale the part if the screen is too small (scaling factor)
              const scaleFactor = Math.min(width / 380, 1);
              const scaledStyle = {
                ...part.style,
                transform: [{ scale: scaleFactor }],
              };

              return (
                <TouchableOpacity
                  key={part.id}
                  activeOpacity={0.8}
                  onPress={() => handleColorPart(part.id, part.name)}
                  style={[
                    styles.partTouchTarget,
                    scaledStyle,
                    {
                      backgroundColor: partBg,
                      borderWidth: isColored ? 2 : 3,
                      borderColor: isColored ? '#334155' : '#1E293B',
                      borderStyle: isColored ? 'solid' : 'dashed',
                    },
                  ]}
                >
                  {part.emoji && <Text style={styles.partEmoji}>{part.emoji}</Text>}
                  {part.label && (
                    <Text
                      style={[
                        styles.partLabel,
                        { color: isColored && partBg === '#1E293B' ? '#FFF' : '#1E293B' },
                      ]}
                    >
                      {part.label}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        )}

        {/* NỘI DUNG 2 & 3: CANVAS VẼ TỰ DO & DÁN STICKER QUA PAN RESPONDER */}
        {(activeTab === 'doodle' || activeTab === 'stickers') && (
          <View style={styles.doodleBoard} {...panResponder.panHandlers}>
            {/* CÁC NÉT VẼ ĐÃ LƯU */}
            {strokes.map((stroke) => {
              return (
                <View key={stroke.id} style={StyleSheet.absoluteFill} pointerEvents="none">
                  {stroke.points.map((pt, pIdx) => (
                    <View
                      key={`pt_${pIdx}`}
                      style={{
                        position: 'absolute',
                        left: pt.x - stroke.width / 2,
                        top: pt.y - stroke.width / 2,
                        width: stroke.width,
                        height: stroke.width,
                        borderRadius: stroke.width / 2,
                        backgroundColor: stroke.color,
                        shadowColor: stroke.type === 'neon' ? stroke.color : 'transparent',
                        shadowOpacity: stroke.type === 'neon' ? 0.9 : 0,
                        shadowRadius: stroke.type === 'neon' ? 8 : 0,
                        elevation: stroke.type === 'neon' ? 6 : 0,
                      }}
                    />
                  ))}
                </View>
              );
            })}

            {/* NÉT VẼ HIỆN TẠI ĐANG KÉO */}
            {currentStroke && (
              <View style={StyleSheet.absoluteFill} pointerEvents="none">
                {currentStroke.points.map((pt, pIdx) => (
                  <View
                    key={`cpt_${pIdx}`}
                    style={{
                      position: 'absolute',
                      left: pt.x - currentStroke.width / 2,
                      top: pt.y - currentStroke.width / 2,
                      width: currentStroke.width,
                      height: currentStroke.width,
                      borderRadius: currentStroke.width / 2,
                      backgroundColor: currentStroke.color,
                    }}
                  />
                ))}
              </View>
            )}

            {/* CÁC STICKER ĐÃ DÁN */}
            {placedStickers.map((stk) => (
              <View
                key={stk.id}
                style={{
                  position: 'absolute',
                  left: stk.x,
                  top: stk.y,
                  width: stk.size + 10,
                  height: stk.size + 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                pointerEvents="none"
              >
                <Text style={{ fontSize: stk.size }}>{stk.emoji}</Text>
              </View>
            ))}

            {strokes.length === 0 && placedStickers.length === 0 && !currentStroke && (
              <View style={styles.doodlePlaceholder} pointerEvents="none">
                <Text style={styles.doodlePlaceholderIcon}>
                  {activeTab === 'doodle' ? '✏️' : '✨'}
                </Text>
                <Text style={styles.doodlePlaceholderText}>
                  {activeTab === 'doodle'
                    ? 'Bé hãy vuốt ngón tay lên màn hình để vẽ nét xinh!'
                    : 'Chạm vào màn hình để dán sticker ngộ nghĩnh!'}
                </Text>
              </View>
            )}
          </View>
        )}

      </View>

      {/* MODAL LƯỚI BỘ SƯU TẬP TẤT CẢ TRANH MẪU (FULL TEMPLATE GRID MODAL) */}
      <Modal
        visible={isTemplateModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsTemplateModalVisible(false)}
      >
        <View style={styles.templateModalOverlay}>
          <View style={styles.templateModalContainer}>
            {/* Header Modal */}
            <View style={styles.templateModalHeader}>
              <View style={styles.templateModalTitleGroup}>
                <Text style={styles.templateModalTitle}>🖼️ BỘ SƯU TẬP TRANH TÔ MÀU</Text>
                <Text style={styles.templateModalSub}>
                  Bé hãy chọn một bức tranh yêu thích để bắt đầu tô màu nhé!
                </Text>
              </View>
              <TouchableOpacity
                style={styles.templateModalCloseBtn}
                onPress={() => setIsTemplateModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.templateModalCloseText}>✕ Đóng</Text>
              </TouchableOpacity>
            </View>

            {/* LƯỚI CÁC TRANH MẪU (GRID 2 CỘT) */}
            <ScrollView
              contentContainerStyle={styles.templateGridScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.templateGrid}>
                {ART_TEMPLATES.map((tmpl, idx) => {
                  const isSelected = idx === selectedTemplateIndex;
                  let coloredCount = 0;
                  tmpl.parts.forEach((p) => {
                    if (filledColors[`${tmpl.id}_${p.id}`]) coloredCount++;
                  });

                  return (
                    <TouchableOpacity
                      key={tmpl.id}
                      style={[
                        styles.templateGridCard,
                        { backgroundColor: tmpl.bgDefaultColor },
                        isSelected && styles.templateGridCardActive,
                      ]}
                      onPress={() => {
                        setSelectedTemplateIndex(idx);
                        setIsTemplateModalVisible(false);
                        showToast(`Đã mở tranh ${tmpl.title}! 🎨`);
                      }}
                      activeOpacity={0.85}
                    >
                      {/* Huy hiệu đang tô */}
                      {isSelected && (
                        <View style={styles.templateActiveTag}>
                          <Text style={styles.templateActiveTagText}>✓ Đang chọn</Text>
                        </View>
                      )}

                      {/* Icon tranh lớn */}
                      <Text style={styles.templateGridEmoji}>{tmpl.emoji}</Text>

                      {/* Tên tranh */}
                      <Text style={styles.templateGridTitle} numberOfLines={1}>
                        {tmpl.title}
                      </Text>

                      {/* Danh mục & Tiến độ */}
                      <View style={styles.templateGridFooter}>
                        <View style={styles.templateCategoryPill}>
                          <Text style={styles.templateCategoryText}>{tmpl.category}</Text>
                        </View>
                        <Text style={styles.templateProgressText}>
                          {coloredCount}/{tmpl.parts.length} vùng
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL KHEN THƯỞNG / CHIẾN THẮNG HỌA SĨ NHÍ */}
      <Modal
        visible={isVictoryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVictoryModalVisible(false)}
      >
        <View style={styles.victoryModalOverlay}>
          <Animated.View
            style={[
              styles.victoryCard,
              { transform: [{ scale: victoryScale }] },
            ]}
          >
            <Text style={styles.victoryTrophy}>🏆 🎨 🌟</Text>
            <Text style={styles.victoryTitle}>HOẠ SĨ NHÍ TÀI BA!</Text>
            <Text style={styles.victorySubtitle}>
              Bức tranh của bé trông thật rực rỡ và tràn đầy màu sắc diệu kỳ!
            </Text>

            <View style={styles.victoryStarsRow}>
              <Text style={styles.starBig}>⭐</Text>
              <Text style={[styles.starBig, { fontSize: 44 }]}>🌟</Text>
              <Text style={styles.starBig}>⭐</Text>
            </View>

            <View style={styles.victoryActions}>
              <TouchableOpacity
                style={styles.victoryKeepPlayingBtn}
                onPress={() => setIsVictoryModalVisible(false)}
                activeOpacity={0.85}
              >
                <Text style={styles.victoryKeepPlayingText}>🎨 Vẽ & Tô Tiếp</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.victoryCloseBtn}
                onPress={() => {
                  setIsVictoryModalVisible(false);
                  onClose();
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.victoryCloseText}>Về Màn Hình Chính</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#1E1B4B',
    borderBottomWidth: 1,
    borderBottomColor: '#312E81',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    padding: 3,
    gap: 4,
  },
  modeTabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeTabBtnActive: {
    backgroundColor: '#EC4899',
    shadowColor: '#EC4899',
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  modeTabText: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '800',
  },
  modeTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#312E81',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4338CA',
  },
  headerActionEmoji: {
    fontSize: 16,
  },
  finishBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  finishBtnText: {
    color: '#FFF',
    fontSize: 16,
  },

  /* TIER 2: GRID TOOLBAR PANEL */
  gridToolbarPanel: {
    backgroundColor: '#16143A',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: '#2E2A68',
    gap: 6,
  },
  templatesToolbarWrapper: {
    gap: 6,
  },
  templateHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#231F53',
    borderRadius: 14,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#4338CA',
  },
  templateNavArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3730A3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateNavArrowText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
  },
  templateDropdownBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 8,
  },
  templateDropdownEmoji: {
    fontSize: 24,
  },
  templateDropdownInfo: {
    flex: 1,
  },
  templateDropdownTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  templateDropdownSub: {
    color: '#A5B4FC',
    fontSize: 11,
    fontWeight: '600',
  },
  gridIconBadge: {
    backgroundColor: '#EC4899',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  gridIconBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },

  /* LƯỚI BẢNG MÀU 2 HÀNG (COLOR GRID) */
  colorGridWrapper: {
    marginTop: 2,
  },
  colorGridScrollContent: {
    paddingHorizontal: 2,
  },
  colorGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 330,
    gap: 6,
    alignItems: 'center',
  },
  colorGridItem: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorGridItemActive: {
    transform: [{ scale: 1.25 }],
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 6,
    shadowColor: '#FFF',
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  colorCheckMark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  /* LƯỚI CỌ VẼ (DOODLE BRUSH GRID) */
  doodleToolbarWrapper: {
    gap: 6,
  },
  brushGridRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
  },
  brushGridCard: {
    flex: 1,
    paddingVertical: 6,
    backgroundColor: '#231F53',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#4338CA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brushGridCardActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#FDE68A',
    elevation: 4,
  },
  brushGridCardTitle: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '800',
  },
  brushGridCardTitleActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },

  /* LƯỚI STICKERS (STICKER GRID) */
  stickerGridWrapper: {
    paddingVertical: 2,
  },
  stickerGridScrollContent: {
    paddingHorizontal: 2,
  },
  stickerGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 440,
    gap: 6,
  },
  stickerGridItem: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#231F53',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#4338CA',
  },
  stickerGridItemActive: {
    backgroundColor: '#EC4899',
    borderColor: '#FBCFE8',
    transform: [{ scale: 1.15 }],
    elevation: 4,
  },
  stickerGridEmoji: {
    fontSize: 22,
  },

  /* CANVAS VÙNG TRANH */
  canvasContainer: {
    flex: 1,
    backgroundColor: '#090D16',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  artworkBoard: {
    width: 340,
    height: 250,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#334155',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    position: 'relative',
  },
  partTouchTarget: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  partEmoji: {
    fontSize: 24,
  },
  partLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  doodleBoard: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  doodlePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  doodlePlaceholderIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  doodlePlaceholderText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  /* MODAL LƯỚI BỘ SƯU TẬP TRANH */
  templateModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  templateModalContainer: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#1E1B4B',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#EC4899',
    padding: 16,
    elevation: 10,
  },
  templateModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#312E81',
    marginBottom: 12,
  },
  templateModalTitleGroup: {
    flex: 1,
  },
  templateModalTitle: {
    color: '#F472B6',
    fontSize: 18,
    fontWeight: '900',
  },
  templateModalSub: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  templateModalCloseBtn: {
    backgroundColor: '#3730A3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  templateModalCloseText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  templateGridScrollContent: {
    paddingBottom: 16,
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  templateGridCard: {
    width: '48%',
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
    position: 'relative',
    elevation: 3,
  },
  templateGridCardActive: {
    borderColor: '#EC4899',
    borderWidth: 3,
    transform: [{ scale: 1.03 }],
    elevation: 6,
  },
  templateActiveTag: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#EC4899',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  templateActiveTagText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  templateGridEmoji: {
    fontSize: 42,
    marginVertical: 4,
  },
  templateGridTitle: {
    color: '#1E293B',
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },
  templateGridFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  templateCategoryPill: {
    backgroundColor: 'rgba(30, 41, 59, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  templateCategoryText: {
    color: '#334155',
    fontSize: 10,
    fontWeight: '700',
  },
  templateProgressText: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '700',
  },

  /* VICTORY MODAL */
  victoryModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  victoryCard: {
    backgroundColor: '#1E1B4B',
    borderRadius: 32,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    borderWidth: 4,
    borderColor: '#F59E0B',
  },
  victoryTrophy: {
    fontSize: 70,
    marginBottom: 16,
  },
  victoryTitle: {
    color: '#FBBF24',
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(245, 158, 11, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  victorySubtitle: {
    color: '#E2E8F0',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  victoryStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  starBig: {
    fontSize: 36,
    marginHorizontal: 8,
  },
  victoryActions: {
    width: '100%',
    gap: 12,
  },
  victoryKeepPlayingBtn: {
    backgroundColor: '#EC4899',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  victoryKeepPlayingText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
  },
  victoryCloseBtn: {
    backgroundColor: '#312E81',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  victoryCloseText: {
    color: '#94A3B8',
    fontSize: 18,
    fontWeight: '900',
  },
  toastBadge: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 99,
    borderWidth: 1,
    borderColor: '#EC4899',
  },
  toastText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default ColoringGameScreen;

