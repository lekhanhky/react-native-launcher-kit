import React, { useState, useEffect, useRef, useCallback } from 'react';
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

interface SortingGameScreenProps {
  theme?: ThemeConfig;
  onClose: () => void;
}

export type SortingCategoryMode = 'recycle' | 'tidy' | 'animals';

export interface SortTargetBin {
  id: string;
  name: string;
  emoji: string;
  color: string;
  borderColor: string;
  badgeBg: string;
  description: string;
}

export interface SortableItem {
  id: string;
  name: string;
  emoji: string;
  targetBinId: string;
  categoryName: string;
  fact: string;
}

// 1. Chế độ Phân loại rác bảo vệ môi trường
const RECYCLE_BINS: SortTargetBin[] = [
  {
    id: 'organic',
    name: 'Rác Hữu Cơ',
    emoji: '🍎',
    color: '#10B981',
    borderColor: '#059669',
    badgeBg: '#D1FAE5',
    description: 'Thức ăn thừa, vỏ hoa quả, rau củ có thể ủ phân bón',
  },
  {
    id: 'recyclable',
    name: 'Rác Tái Chế',
    emoji: '🧴',
    color: '#F59E0B',
    borderColor: '#D97706',
    badgeBg: '#FEF3C7',
    description: 'Chai nhựa, giấy báo, lon kim loại tái sử dụng được',
  },
  {
    id: 'hazardous',
    name: 'Rác Nguy Hại',
    emoji: '🔋',
    color: '#EF4444',
    borderColor: '#DC2626',
    badgeBg: '#FEE2E2',
    description: 'Pin, bóng đèn, đồ điện tử cần xử lý đặc biệt',
  },
];

const RECYCLE_ITEMS: SortableItem[] = [
  { id: 'banana', name: 'Vỏ Chuối', emoji: '🍌', targetBinId: 'organic', categoryName: 'Rác Hữu Cơ', fact: 'Vỏ chuối tự phân hủy thành phân bón tốt cho cây!' },
  { id: 'apple_core', name: 'Lõi Táo', emoji: '🍎', targetBinId: 'organic', categoryName: 'Rác Hữu Cơ', fact: 'Lõi táo dễ phân hủy trong đất.' },
  { id: 'bread', name: 'Bánh Mì Cũ', emoji: '🍞', targetBinId: 'organic', categoryName: 'Rác Hữu Cơ', fact: 'Thức ăn thừa là nguồn hữu cơ tự nhiên.' },
  { id: 'veggie', name: 'Lá Rau Cũ', emoji: '🥬', targetBinId: 'organic', categoryName: 'Rác Hữu Cơ', fact: 'Rau xanh giúp đất tơi xốp hơn khi ủ.' },
  { id: 'plastic_bottle', name: 'Chai Nhựa', emoji: '🧴', targetBinId: 'recyclable', categoryName: 'Rác Tái Chế', fact: 'Chai nhựa có thể ép thành đồ chơi mới!' },
  { id: 'newspaper', name: 'Báo Cũ', emoji: '📰', targetBinId: 'recyclable', categoryName: 'Rác Tái Chế', fact: 'Giấy báo được tái sinh thành tập vở mới.' },
  { id: 'can', name: 'Lon Nước Ngọt', emoji: '🥫', targetBinId: 'recyclable', categoryName: 'Rác Tái Chế', fact: 'Nhôm kim loại tái chế được vô số lần!' },
  { id: 'box', name: 'Hộp Các-tông', emoji: '📦', targetBinId: 'recyclable', categoryName: 'Rác Tái Chế', fact: 'Gấp gọn bìa giấy để gửi nhà máy tái chế.' },
  { id: 'battery', name: 'Viên Pin Cũ', emoji: '🔋', targetBinId: 'hazardous', categoryName: 'Rác Nguy Hại', fact: 'Pin chứa hóa chất nguy hiểm, không vứt bừa bãi!' },
  { id: 'bulb', name: 'Bóng Đèn Vỡ', emoji: '💡', targetBinId: 'hazardous', categoryName: 'Rác Nguy Hại', fact: 'Thủy tinh bóng đèn cần gom riêng an toàn.' },
  { id: 'plug', name: 'Dây Cáp Điện', emoji: '🔌', targetBinId: 'hazardous', categoryName: 'Rác Nguy Hại', fact: 'Rác điện tử cần gửi điểm thu gom chuyên biệt.' },
  { id: 'meds', name: 'Vỏ Thuốc Hết Hạn', emoji: '💊', targetBinId: 'hazardous', categoryName: 'Rác Nguy Hại', fact: 'Thuốc men thừa cần xử lý đúng quy trình.' },
];

// 2. Chế độ Bé Dọn Dẹp Phòng Ngăn Nắp
const TIDY_BINS: SortTargetBin[] = [
  {
    id: 'fruits',
    name: 'Rổ Trái Cây',
    emoji: '🧺',
    color: '#EC4899',
    borderColor: '#DB2777',
    badgeBg: '#FCE7F3',
    description: 'Thức ăn ngon và hoa quả ngọt ngào',
  },
  {
    id: 'toys',
    name: 'Thùng Đồ Chơi',
    emoji: '🧸',
    color: '#8B5CF6',
    borderColor: '#7C3AED',
    badgeBg: '#EDE9FE',
    description: 'Gấu bông, ô tô, robot chơi xong cất gọn',
  },
  {
    id: 'stationery',
    name: 'Balo Học Tập',
    emoji: '🎒',
    color: '#0284C7',
    borderColor: '#0369A1',
    badgeBg: '#E0F2FE',
    description: 'Sách vở, bút thước cho bé chuẩn bị đi học',
  },
];

const TIDY_ITEMS: SortableItem[] = [
  { id: 'strawberry', name: 'Quả Dâu Tây', emoji: '🍓', targetBinId: 'fruits', categoryName: 'Rổ Trái Cây', fact: 'Dâu tây đỏ mọng giàu vitamin C.' },
  { id: 'watermelon', name: 'Miếng Dưa Hấu', emoji: '🍉', targetBinId: 'fruits', categoryName: 'Rổ Trái Cây', fact: 'Dưa hấu mát lành ngọt lịm.' },
  { id: 'grapes', name: 'Chùm Nho Tím', emoji: '🍇', targetBinId: 'fruits', categoryName: 'Rổ Trái Cây', fact: 'Nho tím ngọt thơm bé rất thích.' },
  { id: 'cake_slice', name: 'Bánh Ngọt', emoji: '🍰', targetBinId: 'fruits', categoryName: 'Rổ Trái Cây', fact: 'Món tráng miệng thơm ngậy.' },
  { id: 'teddy', name: 'Chú Gấu Bông', emoji: '🧸', targetBinId: 'toys', categoryName: 'Thùng Đồ Chơi', fact: 'Gấu bông là người bạn thân ôm khi ngủ.' },
  { id: 'toy_car', name: 'Xe Ô Tô Đồ Chơi', emoji: '🚗', targetBinId: 'toys', categoryName: 'Thùng Đồ Chơi', fact: 'Cất xe vào thùng sau khi đua xong nhé.' },
  { id: 'robot', name: 'Bạn Robot', emoji: '🤖', targetBinId: 'toys', categoryName: 'Thùng Đồ Chơi', fact: 'Robot biến hình bảo vệ thế giới đồ chơi.' },
  { id: 'ball', name: 'Quả Bóng Tròn', emoji: '⚽', targetBinId: 'toys', categoryName: 'Thùng Đồ Chơi', fact: 'Bóng đá giúp bé rèn luyện thể thao.' },
  { id: 'book', name: 'Sách Truyện Tranh', emoji: '📚', targetBinId: 'stationery', categoryName: 'Balo Học Tập', fact: 'Sách mở ra chân trời tri thức kỳ diệu.' },
  { id: 'pencil', name: 'Cây Bút Chì', emoji: '✏️', targetBinId: 'stationery', categoryName: 'Balo Học Tập', fact: 'Bút chì giúp bé tập viết những nét chữ đầu tiên.' },
  { id: 'ruler', name: 'Cây Thước Kẻ', emoji: '📐', targetBinId: 'stationery', categoryName: 'Balo Học Tập', fact: 'Thước kẻ giúp vẽ những đoạn thẳng ngay ngắn.' },
  { id: 'paint_palette', name: 'Bảng Màu Vẽ', emoji: '🎨', targetBinId: 'stationery', categoryName: 'Balo Học Tập', fact: 'Sắc màu tô điểm cho những bức tranh sinh động.' },
];

// 3. Chế độ Tìm Ngôi Nhà Cho Muông Thú
const ANIMAL_BINS: SortTargetBin[] = [
  {
    id: 'jungle',
    name: 'Rừng Xanh Hoang Dã',
    emoji: '🌴',
    color: '#059669',
    borderColor: '#047857',
    badgeBg: '#D1FAE5',
    description: 'Nơi ở của chúa sơn lâm, voi khỉ leo trèo',
  },
  {
    id: 'ocean',
    name: 'Đại Dương Bao La',
    emoji: '🌊',
    color: '#0284C7',
    borderColor: '#0369A1',
    badgeBg: '#E0F2FE',
    description: 'Thế giới nước xanh ngát của cá heo, rùa biển',
  },
  {
    id: 'farm',
    name: 'Nông Trại Vui Vẻ',
    emoji: '🏡',
    color: '#D97706',
    borderColor: '#B45309',
    badgeBg: '#FEF3C7',
    description: 'Gia đình gà, vịt, cún con, bò sữa thân thiện',
  },
];

const ANIMAL_ITEMS: SortableItem[] = [
  { id: 'lion', name: 'Sư Tử Hùng Dũng', emoji: '🦁', targetBinId: 'jungle', categoryName: 'Rừng Xanh', fact: 'Sư tử là vua của muôn loài rừng rậm!' },
  { id: 'monkey', name: 'Khỉ Tinh Nghịch', emoji: '🐵', targetBinId: 'jungle', categoryName: 'Rừng Xanh', fact: 'Khỉ thích chuyền cành và ăn quả ngọt.' },
  { id: 'elephant', name: 'Chú Voi Khổng Lồ', emoji: '🐘', targetBinId: 'jungle', categoryName: 'Rừng Xanh', fact: 'Voi có chiếc vòi dài khéo léo lấy nước.' },
  { id: 'giraffe', name: 'Hươu Cao Cổ', emoji: '🦒', targetBinId: 'jungle', categoryName: 'Rừng Xanh', fact: 'Hươu cao cổ vươn tới những ngọn cây cao nhất.' },
  { id: 'whale', name: 'Cá Voi Xanh', emoji: '🐳', targetBinId: 'ocean', categoryName: 'Đại Dương', fact: 'Cá voi xanh là sinh vật lớn nhất hành tinh!' },
  { id: 'dolphin', name: 'Cá Heo Thông Minh', emoji: '🐬', targetBinId: 'ocean', categoryName: 'Đại Dương', fact: 'Cá heo rất thân thiện và thích nhảy múa trên sóng.' },
  { id: 'turtle', name: 'Rùa Biển Hiền Lành', emoji: '🐢', targetBinId: 'ocean', categoryName: 'Đại Dương', fact: 'Rùa biển có thể bơi lặn hàng ngàn cây số.' },
  { id: 'octopus', name: 'Bạch Tuộc 8 Râu', emoji: '🐙', targetBinId: 'ocean', categoryName: 'Đại Dương', fact: 'Bạch tuộc rất thông minh và có thể đổi màu ngụy trang.' },
  { id: 'dog', name: 'Chú Cún Cưng', emoji: '🐶', targetBinId: 'farm', categoryName: 'Nông Trại', fact: 'Cún cưng luôn trung thành và trông giữ nhà cửa.' },
  { id: 'cow', name: 'Bò Sữa Hiền Hòa', emoji: '🐮', targetBinId: 'farm', categoryName: 'Nông Trại', fact: 'Bò sữa cho bé nguồn sữa tươi thơm ngon mỗi ngày.' },
  { id: 'duck', name: 'Vịt Con Lạch Bạch', emoji: '🦆', targetBinId: 'farm', categoryName: 'Nông Trại', fact: 'Vịt thích bơi lội dưới ao và kêu cạp cạp.' },
  { id: 'rooster', name: 'Gà Trống Gáy Sáng', emoji: '🐔', targetBinId: 'farm', categoryName: 'Nông Trại', fact: 'Gà trống cất tiếng gáy báo hiệu một ngày mới.' },
];

export const SortingGameScreen: React.FC<SortingGameScreenProps> = ({ onClose }) => {
  const { width } = useWindowDimensions();

  const [mode, setMode] = useState<SortingCategoryMode>('recycle');
  const [activeBins, setActiveBins] = useState<SortTargetBin[]>(RECYCLE_BINS);
  const [remainingItems, setRemainingItems] = useState<SortableItem[]>([]);
  const [currentItem, setCurrentItem] = useState<SortableItem | null>(null);
  
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [sortedCount, setSortedCount] = useState<number>(0);
  const [totalRounds] = useState<number>(8); // 8 đồ vật mỗi lượt chơi

  // Tương tác & Thông báo
  const [selectedBinId, setSelectedBinId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [hintActive, setHintActive] = useState<boolean>(false);

  // Layout thùng chứa để phát hiện vị trí thả
  const binLayouts = useRef<{ [key: string]: { x: number; y: number; width: number; height: number } }>({});

  // Animations
  const pan = useRef(new Animated.ValueXY()).current;
  const itemScale = useRef(new Animated.Value(1)).current;
  const binScaleAnim = useRef<{ [key: string]: Animated.Value }>({}).current;
  const victoryScale = useRef(new Animated.Value(0.3)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Ref để PanResponder luôn gọi được hàm xử lý mới nhất (tránh stale closure)
  const handleDropRef = useRef<(bin: SortTargetBin) => void>(() => {});

  // Khởi tạo animation scale cho từng thùng
  activeBins.forEach((bin) => {
    if (!binScaleAnim[bin.id]) {
      binScaleAnim[bin.id] = new Animated.Value(1);
    }
  });

  const isDroppingRef = useRef(false);

  // 1. Khởi động màn chơi mới
  const startNewGame = useCallback((targetMode: SortingCategoryMode) => {
    isDroppingRef.current = false;
    let bins = RECYCLE_BINS;
    let pool = [...RECYCLE_ITEMS];

    if (targetMode === 'tidy') {
      bins = TIDY_BINS;
      pool = [...TIDY_ITEMS];
    } else if (targetMode === 'animals') {
      bins = ANIMAL_BINS;
      pool = [...ANIMAL_ITEMS];
    }

    // Xáo trộn ngẫu nhiên và lấy 8 vật phẩm
    const shuffled = pool.sort(() => 0.5 - Math.random()).slice(0, 8);

    setMode(targetMode);
    setActiveBins(bins);
    setRemainingItems(shuffled.slice(1));
    setCurrentItem(shuffled[0]);
    setScore(0);
    setCombo(0);
    setSortedCount(0);
    setIsVictory(false);
    setFeedbackState('idle');
    setFeedbackText('');
    setHintActive(false);

    pan.setValue({ x: 0, y: 0 });
    itemScale.setValue(1);
  }, [binScaleAnim, itemScale, pan]);

  useEffect(() => {
    startNewGame('recycle');
  }, [startNewGame]);

  // Rung lắc khi trả lời sai
  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: false }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: false }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: false }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: false }),
    ]).start();
  };

  // Nảy thùng khi thả đúng
  const triggerBinPulse = (binId: string) => {
    if (binScaleAnim[binId]) {
      Animated.sequence([
        Animated.timing(binScaleAnim[binId], { toValue: 1.15, duration: 120, useNativeDriver: true }),
        Animated.timing(binScaleAnim[binId], { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  };

  // 2. Xử lý khi bé phân loại vào thùng (Dù bằng Kéo thả hay Chạm nút)
  const handleDropIntoBin = useCallback((targetBin: SortTargetBin) => {
    if (!currentItem || feedbackState !== 'idle') {
      isDroppingRef.current = false;
      return;
    }

    if (currentItem.targetBinId === targetBin.id) {
      // ✅ ĐÚNG!
      setFeedbackState('correct');
      setFeedbackText(`🎉 Chính xác! ${currentItem.name} thuộc về ${targetBin.name}.`);
      setScore((prev) => prev + 10 + combo * 2);
      setCombo((prev) => prev + 1);
      triggerBinPulse(targetBin.id);

      // Hiệu ứng thu nhỏ vật phẩm vào thùng
      Animated.parallel([
        Animated.timing(itemScale, { toValue: 0.1, duration: 250, useNativeDriver: false }),
      ]).start(() => {
        const nextSorted = sortedCount + 1;
        setSortedCount(nextSorted);

        if (remainingItems.length > 0) {
          const next = remainingItems[0];
          setCurrentItem(next);
          setRemainingItems((prev) => prev.slice(1));
          setFeedbackState('idle');
          setFeedbackText('');
          setHintActive(false);
          pan.setValue({ x: 0, y: 0 });
          itemScale.setValue(1);
          isDroppingRef.current = false;
        } else {
          // 🎉 Chiến thắng toàn bộ màn chơi!
          setIsVictory(true);
          Animated.spring(victoryScale, {
            toValue: 1,
            friction: 4,
            tension: 50,
            useNativeDriver: true,
          }).start();
          isDroppingRef.current = false;
        }
      });
    } else {
      // ❌ CHƯA ĐÚNG
      setFeedbackState('wrong');
      setFeedbackText(`💡 Chưa đúng rồi! ${currentItem.name} không thuộc về ${targetBin.name}.`);
      setCombo(0);
      triggerShake();

      // Đưa vật phẩm trở lại vị trí trung tâm
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        friction: 5,
        useNativeDriver: false,
      }).start(() => {
        setTimeout(() => {
          setFeedbackState('idle');
          isDroppingRef.current = false;
        }, 1200);
      });
    }
  }, [currentItem, feedbackState, combo, sortedCount, remainingItems, itemScale, pan, victoryScale]);

  // Cập nhật ref mỗi khi hàm được tạo mới (đảm bảo PanResponder dùng đúng version)
  handleDropRef.current = handleDropIntoBin;

  const hoveredBinRef = useRef<string | null>(null);

  // 3. Kéo thả đồ vật qua PanResponder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        Animated.spring(itemScale, { toValue: 1.15, useNativeDriver: false }).start();
        hoveredBinRef.current = null;
      },
      onPanResponderMove: (e, gestureState) => {
        pan.setValue({ x: gestureState.dx, y: gestureState.dy });
        
        const { width: screenW, height: screenH } = require('react-native').Dimensions.get('window');
        const dropX = gestureState.moveX;
        const dropY = gestureState.moveY;

        let currentlyHoveredId = null;

        // Xác định xem ngón tay đang ở vùng của thùng nào (33% dưới màn hình)
        if (dropY > screenH * 0.33 && gestureState.numberActiveTouches > 0) {
          const binIndex = Math.floor(dropX / (screenW / activeBins.length));
          if (binIndex >= 0 && binIndex < activeBins.length) {
            currentlyHoveredId = activeBins[binIndex].id;
          }
        }

        // Cập nhật hiệu ứng phình to cho thùng đang được lướt qua
        if (currentlyHoveredId !== hoveredBinRef.current) {
          activeBins.forEach((bin) => {
            if (binScaleAnim[bin.id]) {
               Animated.spring(binScaleAnim[bin.id], { 
                 toValue: bin.id === currentlyHoveredId ? 1.15 : 1, 
                 useNativeDriver: true 
               }).start();
            }
          });
          hoveredBinRef.current = currentlyHoveredId;
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        Animated.spring(itemScale, { toValue: 1, useNativeDriver: false }).start();
        
        let droppedBin: SortTargetBin | null = null;

        // Nếu lúc buông tay ra, có thùng đang được hút (lưu trong hoveredBinRef)
        if (hoveredBinRef.current) {
          droppedBin = activeBins.find((b) => b.id === hoveredBinRef.current) || null;
          
          // Reset hiệu ứng phình to của tất cả các thùng khi nhấc ngón tay lên
          activeBins.forEach((bin) => {
            if (binScaleAnim[bin.id]) {
               Animated.spring(binScaleAnim[bin.id], { toValue: 1, useNativeDriver: true }).start();
            }
          });
          hoveredBinRef.current = null;
        }

        if (droppedBin) {
          // Xử lý kiểm tra đúng/sai và xuất hiện thông báo - gọi qua ref để tránh stale closure
          handleDropRef.current(droppedBin);
        } else {
          // Bay trở về vị trí cũ nếu thả ra ngoài không trúng thùng nào
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  // Gợi ý cho bé
  const handleShowHint = () => {
    if (!currentItem) return;
    setHintActive(true);
    const correctBin = activeBins.find((b) => b.id === currentItem.targetBinId);
    if (correctBin) {
      setFeedbackText(`💡 Gợi ý: Hãy đặt ${currentItem.name} vào "${correctBin.name}"!`);
      triggerBinPulse(correctBin.id);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#064E3B" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={onClose}>
          <Text style={styles.backBtnText}>⬅ Thoát</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>♻️ Phân Loại Thông Minh</Text>
          <Text style={styles.headerScore}>
            ⭐ Điểm: <Text style={{ color: '#FDE047', fontWeight: '900' }}>{score}</Text>
            {combo > 1 && ` 🔥 Combo x${combo}`}
          </Text>
        </View>

        <TouchableOpacity style={styles.hintBtn} activeOpacity={0.8} onPress={handleShowHint}>
          <Text style={styles.hintBtnText}>💡 Gợi ý</Text>
        </TouchableOpacity>
      </View>

      {/* THANH CHỌN CHỦ ĐỀ */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, mode === 'recycle' && styles.tabBtnActive]}
          activeOpacity={0.8}
          onPress={() => startNewGame('recycle')}
        >
          <Text style={[styles.tabBtnText, mode === 'recycle' && styles.tabBtnTextActive]}>
            ♻️ Phân Loại Rác
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, mode === 'tidy' && styles.tabBtnActive]}
          activeOpacity={0.8}
          onPress={() => startNewGame('tidy')}
        >
          <Text style={[styles.tabBtnText, mode === 'tidy' && styles.tabBtnTextActive]}>
            🧸 Dọn Đồ Ngăn Nắp
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, mode === 'animals' && styles.tabBtnActive]}
          activeOpacity={0.8}
          onPress={() => startNewGame('animals')}
        >
          <Text style={[styles.tabBtnText, mode === 'animals' && styles.tabBtnTextActive]}>
            🐾 Ngôi Nhà Muông Thú
          </Text>
        </TouchableOpacity>
      </View>

      {/* THANH TIẾN TRÌNH */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${(sortedCount / totalRounds) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          Đã phân loại: {sortedCount}/{totalRounds} đồ vật
        </Text>
      </View>

      {/* THÔNG BÁO GỢI Ý & PHẢN HỒI */}
      {feedbackText !== '' && (
        <View
          style={[
            styles.feedbackBanner,
            feedbackState === 'correct'
              ? styles.feedbackCorrect
              : feedbackState === 'wrong'
              ? styles.feedbackWrong
              : styles.feedbackHint,
          ]}
        >
          <Text style={styles.feedbackBannerText}>{feedbackText}</Text>
        </View>
      )}

      {/* KHU VỰC VẬT PHẨM ĐANG CHỜ PHÂN LOẠI */}
      <View style={styles.itemStageContainer}>
        {currentItem ? (
          <Animated.View
            style={[
              styles.draggableItemCard,
              {
                transform: [
                  { translateX: pan.x },
                  { translateY: pan.y },
                  { scale: itemScale },
                  { translateX: shakeAnim },
                ],
              },
            ]}
            {...panResponder.panHandlers}
          >
            <View style={styles.itemEmojiBox}>
              <Text style={styles.itemEmoji}>{currentItem.emoji}</Text>
            </View>
            <Text style={styles.itemName}>{currentItem.name}</Text>
            <Text style={styles.itemGuide}>👆 Chạm & Kéo thả vào đúng thùng nhé!</Text>
          </Animated.View>
        ) : (
          <View style={styles.itemEmptyBox}>
            <Text style={styles.itemEmptyText}>Đang chuẩn bị đồ vật tiếp theo...</Text>
          </View>
        )}
      </View>

      {/* KHU VỰC 3 THÙNG CHỨA PHÂN LOẠI (TARGET BINS) */}
      <View style={styles.binsSection}>
        <Text style={styles.binsSectionTitle}>👇 CHỌN HOẶC THẢ VÀO THÙNG TƯƠNG ỨNG:</Text>
        <View style={styles.binsRow}>
          {activeBins.map((bin) => {
            const isHighlighted = hintActive && currentItem?.targetBinId === bin.id;
            const animScale = binScaleAnim[bin.id] || new Animated.Value(1);

            return (
              <Animated.View
                key={bin.id}
                style={[
                  styles.binWrapper,
                  { transform: [{ scale: animScale }] },
                ]}
                onLayout={(event) => {
                  event.target.measure((x, y, width, height, pageX, pageY) => {
                    binLayouts.current[bin.id] = {
                      x: pageX,
                      y: pageY,
                      width,
                      height,
                    };
                  });
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.binCard,
                    {
                      backgroundColor: bin.badgeBg,
                      borderColor: isHighlighted ? '#FDE047' : bin.borderColor,
                      borderWidth: isHighlighted ? 4 : 2.5,
                    },
                  ]}
                  activeOpacity={0.75}
                  onPress={() => handleDropIntoBin(bin)}
                >
                  <View style={[styles.binTopHandle, { backgroundColor: bin.color }]} />
                  <View style={styles.binEmojiCircle}>
                    <Text style={styles.binEmoji}>{bin.emoji}</Text>
                  </View>
                  <Text style={[styles.binName, { color: bin.borderColor }]}>
                    {bin.name}
                  </Text>
                  <Text style={styles.binDesc} numberOfLines={2}>
                    {bin.description}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>

      {/* MODAL CHIẾN THẮNG & HOÀN THÀNH */}
      <Modal
        visible={isVictory}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVictory(false)}
      >
        <View style={styles.victoryModalOverlay}>
          <Animated.View
            style={[
              styles.victoryCard,
              { transform: [{ scale: victoryScale }] },
            ]}
          >
            <Text style={styles.victoryTrophy}>🏆 🌟 ♻️</Text>
            <Text style={styles.victoryTitle}>BÉ SIÊU GỌN GÀNG & XANH!</Text>
            <Text style={styles.victorySubtitle}>
              Bé đã phân loại xuất sắc tất cả các đồ vật vào đúng nơi quy định!
            </Text>

            <View style={styles.scoreBadgeBox}>
              <Text style={styles.scoreBadgeLabel}>Tổng điểm xuất sắc</Text>
              <Text style={styles.scoreBadgeValue}>🌟 {score} Điểm</Text>
            </View>

            <View style={styles.victoryActions}>
              <TouchableOpacity
                style={styles.victoryPlayAgainBtn}
                activeOpacity={0.85}
                onPress={() => startNewGame(mode)}
              >
                <Text style={styles.victoryPlayAgainText}>🔄 Chơi Lại Màn Này</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.victoryChangeModeBtn}
                activeOpacity={0.85}
                onPress={() => {
                  const nextMode: SortingCategoryMode =
                    mode === 'recycle' ? 'tidy' : mode === 'tidy' ? 'animals' : 'recycle';
                  startNewGame(nextMode);
                }}
              >
                <Text style={styles.victoryChangeModeText}>✨ Đổi Chủ Đề Mới</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.victoryCloseBtn}
                activeOpacity={0.85}
                onPress={() => {
                  setIsVictory(false);
                  onClose();
                }}
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
    backgroundColor: '#064E3B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#065F46',
    borderBottomWidth: 2,
    borderBottomColor: '#047857',
  },
  backBtn: {
    backgroundColor: '#047857',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  backBtnText: {
    color: '#ECFDF5',
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
    fontSize: 17,
    fontWeight: '900',
  },
  headerScore: {
    color: '#D1FAE5',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  hintBtn: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FDE68A',
  },
  hintBtnText: {
    color: '#78350F',
    fontSize: 13,
    fontWeight: '900',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#047857',
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 6,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#065F46',
  },
  tabBtnActive: {
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
  },
  tabBtnText: {
    color: '#A7F3D0',
    fontSize: 12,
    fontWeight: '700',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#064E3B',
    gap: 10,
  },
  progressBarBg: {
    flex: 1,
    height: 12,
    backgroundColor: '#065F46',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#047857',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FDE047',
    borderRadius: 6,
  },
  progressText: {
    color: '#D1FAE5',
    fontSize: 12,
    fontWeight: '800',
  },
  feedbackBanner: {
    marginHorizontal: 16,
    marginVertical: 4,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  feedbackCorrect: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  feedbackWrong: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  feedbackHint: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  feedbackBannerText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  itemStageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  draggableItemCard: {
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#34D399',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  itemEmojiBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#A7F3D0',
  },
  itemEmoji: {
    fontSize: 46,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#064E3B',
    marginBottom: 4,
  },
  itemGuide: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    textAlign: 'center',
  },
  itemEmptyBox: {
    padding: 20,
    alignItems: 'center',
  },
  itemEmptyText: {
    color: '#A7F3D0',
    fontSize: 14,
    fontWeight: '700',
  },
  binsSection: {
    backgroundColor: '#065F46',
    paddingTop: 10,
    paddingBottom: 38,
    paddingHorizontal: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 2,
    borderTopColor: '#047857',
  },
  binsSectionTitle: {
    color: '#A7F3D0',
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  binsRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  binWrapper: {
    flex: 1,
  },
  binCard: {
    borderRadius: 18,
    padding: 10,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  binTopHandle: {
    width: 36,
    height: 6,
    borderRadius: 3,
    marginBottom: 6,
  },
  binEmojiCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  binEmoji: {
    fontSize: 24,
  },
  binName: {
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 2,
  },
  binDesc: {
    fontSize: 9.5,
    color: '#475569',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 12,
  },
  victoryModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(6, 78, 59, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  victoryCard: {
    width: '90%',
    maxWidth: 380,
    backgroundColor: '#064E3B',
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
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  victorySubtitle: {
    color: '#D1FAE5',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  scoreBadgeBox: {
    backgroundColor: '#065F46',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#34D399',
    alignItems: 'center',
    marginBottom: 18,
  },
  scoreBadgeLabel: {
    color: '#A7F3D0',
    fontSize: 12,
    fontWeight: '700',
  },
  scoreBadgeValue: {
    color: '#FDE047',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
  victoryActions: {
    width: '100%',
    gap: 10,
  },
  victoryPlayAgainBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A7F3D0',
  },
  victoryPlayAgainText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  victoryChangeModeBtn: {
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
  },
  victoryChangeModeText: {
    color: '#78350F',
    fontSize: 14,
    fontWeight: '900',
  },
  victoryCloseBtn: {
    backgroundColor: '#047857',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  victoryCloseText: {
    color: '#ECFDF5',
    fontSize: 14,
    fontWeight: '800',
  },
});
