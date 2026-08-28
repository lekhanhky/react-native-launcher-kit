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
  const { width } = useWindowDimensions();

  const [activeTab, setActiveTab] = useState<ActiveTab>('templates');
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  const currentTemplate = ART_TEMPLATES[selectedTemplateIndex];

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

  // 2. Xử lý vẽ tự do ngón tay (Freehand PanResponder)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => activeTab === 'doodle' || activeTab === 'stickers',
      onMoveShouldSetPanResponder: () => activeTab === 'doodle',
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        if (activeTab === 'stickers') {
          // Dán sticker ngay tại vị trí chạm
          const newSticker: PlacedSticker = {
            id: `stk_${Date.now()}_${Math.random()}`,
            x: locationX - 20,
            y: locationY - 20,
            emoji: selectedSticker,
            size: 38,
          };
          setPlacedStickers((prev) => [...prev, newSticker]);
          showToast(`Dán sticker ${selectedSticker}! ✨`);
          return;
        }

        if (activeTab === 'doodle') {
          const colorToUse =
            brushType === 'eraser'
              ? '#FFFFFF'
              : brushType === 'rainbow'
              ? COLOR_PALETTE[Math.floor(Math.random() * (COLOR_PALETTE.length - 2))].hex
              : selectedColorHex;

          const stroke: DoodleStroke = {
            id: `stroke_${Date.now()}`,
            points: [{ x: locationX, y: locationY }],
            color: colorToUse,
            width: strokeWidth,
            type: brushType,
          };
          setCurrentStroke(stroke);
        }
      },
      onPanResponderMove: (evt) => {
        if (activeTab === 'doodle') {
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
        if (activeTab === 'doodle') {
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

      {/* HEADER ĐỈNH */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.8}
          onPress={onClose}
        >
          <Text style={styles.backBtnText}>⬅ Thoát</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>🎨 Bé Vui Tô Màu</Text>
          <Text style={styles.headerSubtitle}>
            {activeTab === 'templates'
              ? `${currentTemplate.emoji} ${currentTemplate.title} (${countColoredParts()}/${currentTemplate.parts.length})`
              : activeTab === 'doodle'
              ? '✏️ Bảng Vẽ Tự Do Kỳ Diệu'
              : '✨ Bộ Sưu Tập Dán Sticker'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.finishBtn}
          activeOpacity={0.8}
          onPress={handleFinishArtwork}
        >
          <Text style={styles.finishBtnText}>🌟 Xong Rồi!</Text>
        </TouchableOpacity>
      </View>

      {/* THANH CHỌN CHẾ ĐỘ (TABS) */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'templates' && styles.tabButtonActive]}
          onPress={() => setActiveTab('templates')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabButtonText, activeTab === 'templates' && styles.tabButtonTextActive]}>
            🖼️ Tranh Mẫu
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'doodle' && styles.tabButtonActive]}
          onPress={() => setActiveTab('doodle')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabButtonText, activeTab === 'doodle' && styles.tabButtonTextActive]}>
            ✏️ Nét Vẽ Tự Do
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'stickers' && styles.tabButtonActive]}
          onPress={() => setActiveTab('stickers')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabButtonText, activeTab === 'stickers' && styles.tabButtonTextActive]}>
            ✨ Dán Sticker
          </Text>
        </TouchableOpacity>
      </View>

      {/* DANH SÁCH CHỌN BỨC TRANH (CHỈ HIỆN KHI Ở TAB TRANH MẪU) */}
      {activeTab === 'templates' && (
        <View style={styles.templateSelectorWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.templateScrollList}
          >
            {ART_TEMPLATES.map((tmpl, idx) => {
              const isSelected = idx === selectedTemplateIndex;
              return (
                <TouchableOpacity
                  key={tmpl.id}
                  style={[styles.templateCard, isSelected && styles.templateCardSelected]}
                  onPress={() => setSelectedTemplateIndex(idx)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.templateEmoji}>{tmpl.emoji}</Text>
                  <Text
                    style={[styles.templateCardTitle, isSelected && styles.templateCardTitleSelected]}
                    numberOfLines={1}
                  >
                    {tmpl.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* KHUNG VÙNG CANVAS TRANH VẼ */}
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

              return (
                <TouchableOpacity
                  key={part.id}
                  activeOpacity={0.8}
                  onPress={() => handleColorPart(part.id, part.name)}
                  style={[
                    styles.partTouchTarget,
                    part.style,
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

      {/* THANH CÔNG CỤ ĐIỀU KHIỂN BÚT / STICKER / HÀNH ĐỘNG */}
      <View style={styles.toolsBar}>
        {/* Nút Hoàn tác & Phép thuật */}
        <View style={styles.quickActionRow}>
          {activeTab === 'templates' ? (
            <>
              <TouchableOpacity
                style={styles.magicBtn}
                onPress={handleMagicAutoFill}
                activeOpacity={0.8}
              >
                <Text style={styles.magicBtnText}>🪄 Tô Phép Thuật</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionSmallBtn}
                onPress={handleClearCurrentTemplate}
                activeOpacity={0.8}
              >
                <Text style={styles.actionSmallBtnText}>🧹 Xóa Trắng</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.actionSmallBtn}
                onPress={handleUndo}
                activeOpacity={0.8}
              >
                <Text style={styles.actionSmallBtnText}>↺ Hoàn tác</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionSmallBtn}
                onPress={handleClearAllDoodles}
                activeOpacity={0.8}
              >
                <Text style={styles.actionSmallBtnText}>🧹 Xóa Hết</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Chọn loại cọ vẽ khi ở tab Doodle */}
          {activeTab === 'doodle' && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
              <TouchableOpacity
                style={[styles.brushTypeBtn, brushType === 'crayon' && styles.brushTypeBtnActive]}
                onPress={() => setBrushType('crayon')}
              >
                <Text style={styles.brushTypeText}>🖍️ Màu Sáp</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.brushTypeBtn, brushType === 'neon' && styles.brushTypeBtnActive]}
                onPress={() => setBrushType('neon')}
              >
                <Text style={styles.brushTypeText}>💡 Phát Sáng</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.brushTypeBtn, brushType === 'rainbow' && styles.brushTypeBtnActive]}
                onPress={() => setBrushType('rainbow')}
              >
                <Text style={styles.brushTypeText}>🌈 7 Màu</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.brushTypeBtn, brushType === 'eraser' && styles.brushTypeBtnActive]}
                onPress={() => setBrushType('eraser')}
              >
                <Text style={styles.brushTypeText}>🧽 Tẩy</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>

        {/* NẾU Ở TAB STICKER: HIỂN THỊ DANH SÁCH STICKERS */}
        {activeTab === 'stickers' ? (
          <View style={styles.stickerSelectorWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {STICKERS.map((stk, sIdx) => {
                const isSelected = stk === selectedSticker;
                return (
                  <TouchableOpacity
                    key={`stk_item_${sIdx}`}
                    style={[styles.stickerThumb, isSelected && styles.stickerThumbSelected]}
                    onPress={() => {
                      setSelectedSticker(stk);
                      showToast(`Đã chọn sticker ${stk}! Chạm lên canvas để dán nhé.`);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.stickerEmoji}>{stk}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        ) : (
          /* NẾU Ở TAB TRANH MẪU HOẶC VẼ: HIỂN THỊ BẢNG 18 MÀU RỰC RỠ */
          <View style={styles.paletteWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.paletteScrollList}
            >
              {COLOR_PALETTE.map((c) => {
                const isSelected = c.hex === selectedColorHex;
                return (
                  <TouchableOpacity
                    key={c.id}
                    activeOpacity={0.8}
                    onPress={() => {
                      setSelectedColorHex(c.hex);
                      if (brushType === 'eraser') setBrushType('crayon');
                      showToast(`🎨 Bé chọn màu: ${c.name}`);
                    }}
                    style={[
                      styles.colorDropBtn,
                      { backgroundColor: c.hex, borderColor: c.border },
                      isSelected && styles.colorDropBtnSelected,
                    ]}
                  >
                    {isSelected && (
                      <View style={styles.colorSelectedIndicator}>
                        <Text style={styles.checkmarkIcon}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>

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
                <Text style={styles.victoryCloseText}>🏠 Về Trang Chủ</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#1E1B4B',
    borderBottomWidth: 2,
    borderBottomColor: '#312E81',
  },
  backBtn: {
    backgroundColor: '#3730A3',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#4F46E5',
  },
  backBtnText: {
    color: '#E0E7FF',
    fontSize: 14,
    fontWeight: '800',
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  headerTitle: {
    color: '#FDE047',
    fontSize: 18,
    fontWeight: '900',
  },
  headerSubtitle: {
    color: '#C7D2FE',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  finishBtn: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FDE68A',
  },
  finishBtnText: {
    color: '#78350F',
    fontSize: 14,
    fontWeight: '900',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#334155',
  },
  tabButtonActive: {
    backgroundColor: '#8B5CF6',
    borderWidth: 1.5,
    borderColor: '#DDD6FE',
  },
  tabButtonText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  templateSelectorWrapper: {
    backgroundColor: '#1E1B4B',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#312E81',
  },
  templateScrollList: {
    paddingHorizontal: 12,
    gap: 8,
  },
  templateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#312E81',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#4338CA',
  },
  templateCardSelected: {
    backgroundColor: '#F43F5E',
    borderColor: '#FFE4E6',
  },
  templateEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  templateCardTitle: {
    color: '#C7D2FE',
    fontSize: 12,
    fontWeight: '700',
  },
  templateCardTitleSelected: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  canvasContainer: {
    flex: 1,
    margin: 12,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#4F46E5',
    backgroundColor: '#FFFFFF',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  artworkBoard: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  partTouchTarget: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  partEmoji: {
    fontSize: 22,
  },
  partLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  doodleBoard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  doodlePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  doodlePlaceholderIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  doodlePlaceholderText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  toastBadge: {
    position: 'absolute',
    top: 14,
    alignSelf: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 99,
    borderWidth: 1.5,
    borderColor: '#FDE047',
  },
  toastText: {
    color: '#FEF08A',
    fontSize: 13,
    fontWeight: '800',
  },
  toolsBar: {
    backgroundColor: '#1E1B4B',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: 2,
    borderTopColor: '#312E81',
  },
  quickActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  magicBtn: {
    backgroundColor: '#EC4899',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FDF2F8',
  },
  magicBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  actionSmallBtn: {
    backgroundColor: '#3730A3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  actionSmallBtnText: {
    color: '#E0E7FF',
    fontSize: 12,
    fontWeight: '800',
  },
  brushTypeBtn: {
    backgroundColor: '#312E81',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#4338CA',
  },
  brushTypeBtnActive: {
    backgroundColor: '#10B981',
    borderColor: '#D1FAE5',
  },
  brushTypeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  paletteWrapper: {
    paddingVertical: 2,
  },
  paletteScrollList: {
    gap: 10,
    paddingHorizontal: 4,
  },
  colorDropBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  colorDropBtnSelected: {
    transform: [{ scale: 1.15 }],
    borderColor: '#FFFFFF',
    borderWidth: 4,
  },
  colorSelectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  stickerSelectorWrapper: {
    paddingVertical: 4,
  },
  stickerThumb: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#312E81',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#4338CA',
  },
  stickerThumbSelected: {
    backgroundColor: '#F43F5E',
    borderColor: '#FFE4E6',
    transform: [{ scale: 1.12 }],
  },
  stickerEmoji: {
    fontSize: 24,
  },
  victoryModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  victoryCard: {
    width: '90%',
    maxWidth: 380,
    backgroundColor: '#1E1B4B',
    borderRadius: 28,
    borderWidth: 4,
    borderColor: '#FDE047',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  victoryTrophy: {
    fontSize: 50,
    marginBottom: 8,
  },
  victoryTitle: {
    color: '#FDE047',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  victorySubtitle: {
    color: '#C7D2FE',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  victoryStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  starBig: {
    fontSize: 32,
  },
  victoryActions: {
    width: '100%',
    gap: 10,
  },
  victoryKeepPlayingBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A7F3D0',
  },
  victoryKeepPlayingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  victoryCloseBtn: {
    backgroundColor: '#3730A3',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#6366F1',
  },
  victoryCloseText: {
    color: '#E0E7FF',
    fontSize: 14,
    fontWeight: '800',
  },
});
