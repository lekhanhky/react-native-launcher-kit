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

interface TangramPuzzleGameScreenProps {
  theme?: ThemeConfig;
  onClose: () => void;
}

export type PuzzleMode = 'tangram' | 'jigsaw';

export interface TangramPiece {
  id: string;
  name: string;
  emoji: string;
  color: string;
  borderColor: string;
  width: number;
  height: number;
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  transform?: any[];
  // Tọa độ mục tiêu trên bảng ghép (px)
  targetX: number;
  targetY: number;
}

export interface TangramPuzzle {
  id: string;
  title: string;
  emoji: string;
  category: string;
  boardWidth: number;
  boardHeight: number;
  boardBg: string;
  pieces: TangramPiece[];
}

export interface JigsawPiece {
  id: string;
  index: number;
  emoji: string;
  label: string;
  color: string;
  targetRow: number;
  targetCol: number;
}

export interface JigsawPuzzle {
  id: string;
  title: string;
  emoji: string;
  themeColor: string;
  gridSize: number; // 2x2 hoặc 3x3
  pieces: JigsawPiece[];
}

// 1. Danh sách các bài xếp hình khối Tangram
export const TANGRAM_PUZZLES: TangramPuzzle[] = [
  {
    id: 'sailboat',
    title: 'Thuyền Buồm Lướt Sóng',
    emoji: '⛵',
    category: 'Phương tiện',
    boardWidth: 260,
    boardHeight: 220,
    boardBg: '#E0F2FE',
    pieces: [
      {
        id: 'hull',
        name: 'Thân Thuyền',
        emoji: '🛥️',
        color: '#EA580C',
        borderColor: '#C2410C',
        width: 170,
        height: 44,
        borderBottomLeftRadius: 22,
        borderBottomRightRadius: 22,
        targetX: 45,
        targetY: 155,
      },
      {
        id: 'mast',
        name: 'Cột Buồm',
        emoji: '🪵',
        color: '#78350F',
        borderColor: '#451A03',
        width: 14,
        height: 110,
        borderRadius: 6,
        targetX: 123,
        targetY: 45,
      },
      {
        id: 'sail_left',
        name: 'Cánh Buồm Nhỏ',
        emoji: '🔺',
        color: '#0284C7',
        borderColor: '#0369A1',
        width: 60,
        height: 80,
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 10,
        targetX: 60,
        targetY: 65,
      },
      {
        id: 'sail_right',
        name: 'Cánh Buồm Lớn',
        emoji: '🚩',
        color: '#E11D48',
        borderColor: '#BE123C',
        width: 75,
        height: 95,
        borderTopLeftRadius: 38,
        borderBottomRightRadius: 12,
        targetX: 140,
        targetY: 50,
      },
      {
        id: 'flag',
        name: 'Lá Cờ Đỉnh',
        emoji: '⭐',
        color: '#FBBF24',
        borderColor: '#D97706',
        width: 32,
        height: 24,
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        targetX: 137,
        targetY: 25,
      },
    ],
  },
  {
    id: 'house',
    title: 'Ngôi Nhà Hạnh Phúc',
    emoji: '🏠',
    category: 'Kiến trúc',
    boardWidth: 260,
    boardHeight: 220,
    boardBg: '#FEF3C7',
    pieces: [
      {
        id: 'roof',
        name: 'Mái Nhà Đỏ',
        emoji: '⛺',
        color: '#DC2626',
        borderColor: '#B91C1C',
        width: 160,
        height: 65,
        borderTopLeftRadius: 80,
        borderTopRightRadius: 80,
        targetX: 50,
        targetY: 30,
      },
      {
        id: 'chimney',
        name: 'Ống Khói',
        emoji: '🧱',
        color: '#D97706',
        borderColor: '#B45309',
        width: 24,
        height: 40,
        borderRadius: 4,
        targetX: 165,
        targetY: 20,
      },
      {
        id: 'wall',
        name: 'Tường Nhà',
        emoji: '🏡',
        color: '#F59E0B',
        borderColor: '#D97706',
        width: 130,
        height: 95,
        borderRadius: 10,
        targetX: 65,
        targetY: 95,
      },
      {
        id: 'door',
        name: 'Cửa Chính',
        emoji: '🚪',
        color: '#7C2D12',
        borderColor: '#431407',
        width: 36,
        height: 52,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        targetX: 112,
        targetY: 138,
      },
      {
        id: 'window',
        name: 'Cửa Sổ Tròn',
        emoji: '🪟',
        color: '#38BDF8',
        borderColor: '#0284C7',
        width: 32,
        height: 32,
        borderRadius: 16,
        targetX: 75,
        targetY: 110,
      },
    ],
  },
  {
    id: 'rocket',
    title: 'Tên Lửa Khám Phá',
    emoji: '🚀',
    category: 'Vũ trụ',
    boardWidth: 260,
    boardHeight: 220,
    boardBg: '#0F172A',
    pieces: [
      {
        id: 'nose',
        name: 'Đầu Tên Lửa',
        emoji: '🔺',
        color: '#EF4444',
        borderColor: '#DC2626',
        width: 60,
        height: 50,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        targetX: 100,
        targetY: 20,
      },
      {
        id: 'body',
        name: 'Thân Tàu',
        emoji: '🚀',
        color: '#E2E8F0',
        borderColor: '#94A3B8',
        width: 66,
        height: 85,
        borderRadius: 12,
        targetX: 97,
        targetY: 70,
      },
      {
        id: 'window_port',
        name: 'Cửa Sổ Tròn',
        emoji: '👨‍🚀',
        color: '#06B6D4',
        borderColor: '#0891B2',
        width: 34,
        height: 34,
        borderRadius: 17,
        targetX: 113,
        targetY: 85,
      },
      {
        id: 'wing_l',
        name: 'Cánh Trái',
        emoji: '◀️',
        color: '#8B5CF6',
        borderColor: '#7C3AED',
        width: 36,
        height: 55,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 8,
        targetX: 61,
        targetY: 100,
      },
      {
        id: 'wing_r',
        name: 'Cánh Phải',
        emoji: '▶️',
        color: '#8B5CF6',
        borderColor: '#7C3AED',
        width: 36,
        height: 55,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 8,
        targetX: 163,
        targetY: 100,
      },
      {
        id: 'flame',
        name: 'Ngọn Lửa',
        emoji: '🔥',
        color: '#F59E0B',
        borderColor: '#D97706',
        width: 44,
        height: 45,
        borderBottomLeftRadius: 22,
        borderBottomRightRadius: 22,
        targetX: 108,
        targetY: 155,
      },
    ],
  },
  {
    id: 'tree',
    title: 'Cây Thông Xanh Tươi',
    emoji: '🌲',
    category: 'Thiên nhiên',
    boardWidth: 260,
    boardHeight: 220,
    boardBg: '#ECFDF5',
    pieces: [
      {
        id: 'star_top',
        name: 'Ngôi Sao Vàng',
        emoji: '⭐',
        color: '#FBBF24',
        borderColor: '#D97706',
        width: 36,
        height: 36,
        borderRadius: 18,
        targetX: 112,
        targetY: 15,
      },
      {
        id: 'leaf_top',
        name: 'Tán Lá Nhỏ',
        emoji: '🎄',
        color: '#22C55E',
        borderColor: '#16A34A',
        width: 80,
        height: 45,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        targetX: 90,
        targetY: 50,
      },
      {
        id: 'leaf_mid',
        name: 'Tán Lá Vừa',
        emoji: '🌲',
        color: '#16A34A',
        borderColor: '#15803D',
        width: 120,
        height: 50,
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
        targetX: 70,
        targetY: 85,
      },
      {
        id: 'leaf_bot',
        name: 'Tán Lá Lớn',
        emoji: '🌿',
        color: '#15803D',
        borderColor: '#166534',
        width: 160,
        height: 55,
        borderTopLeftRadius: 80,
        borderTopRightRadius: 80,
        targetX: 50,
        targetY: 125,
      },
      {
        id: 'trunk',
        name: 'Gốc Cây',
        emoji: '🪵',
        color: '#78350F',
        borderColor: '#451A03',
        width: 36,
        height: 45,
        borderRadius: 6,
        targetX: 112,
        targetY: 170,
      },
    ],
  },
];

// 2. Danh sách tranh ghép hình Jigsaw Puzzle (2x2 = 4 mảnh)
export const JIGSAW_PUZZLES: JigsawPuzzle[] = [
  {
    id: 'unicorn_jigsaw',
    title: 'Kỳ Lân Phép Thuật',
    emoji: '🦄',
    themeColor: '#EC4899',
    gridSize: 2,
    pieces: [
      { id: 'u_0', index: 0, emoji: '🌟 🦄', label: 'Góc Trái Trên', color: '#FDF2F8', targetRow: 0, targetCol: 0 },
      { id: 'u_1', index: 1, emoji: '🌈 ✨', label: 'Góc Phải Trên', color: '#FDF4FF', targetRow: 0, targetCol: 1 },
      { id: 'u_2', index: 2, emoji: '🌸 💖', label: 'Góc Trái Dưới', color: '#FCE7F3', targetRow: 1, targetCol: 0 },
      { id: 'u_3', index: 3, emoji: '☁️ ⭐', label: 'Góc Phải Dưới', color: '#FBCFE8', targetRow: 1, targetCol: 1 },
    ],
  },
  {
    id: 'dino_jigsaw',
    title: 'Khủng Long Rừng Xanh',
    emoji: '🦖',
    themeColor: '#10B981',
    gridSize: 2,
    pieces: [
      { id: 'd_0', index: 0, emoji: '☀️ 🦖', label: 'Góc Trái Trên', color: '#F0FDF4', targetRow: 0, targetCol: 0 },
      { id: 'd_1', index: 1, emoji: '🌿 🌴', label: 'Góc Phải Trên', color: '#DCFCE7', targetRow: 0, targetCol: 1 },
      { id: 'd_2', index: 2, emoji: '🌱 🦶', label: 'Góc Trái Dưới', color: '#BBF7D0', targetRow: 1, targetCol: 0 },
      { id: 'd_3', index: 3, emoji: '🥚 🌸', label: 'Góc Phải Dưới', color: '#86EFAC', targetRow: 1, targetCol: 1 },
    ],
  },
  {
    id: 'ocean_jigsaw',
    title: 'Cá Heo Đại Dương',
    emoji: '🐬',
    themeColor: '#0284C7',
    gridSize: 2,
    pieces: [
      { id: 'o_0', index: 0, emoji: '🌊 🐬', label: 'Góc Trái Trên', color: '#F0F9FF', targetRow: 0, targetCol: 0 },
      { id: 'o_1', index: 1, emoji: '🫧 🦀', label: 'Góc Phải Trên', color: '#E0F2FE', targetRow: 0, targetCol: 1 },
      { id: 'o_2', index: 2, emoji: '🪸 🐠', label: 'Góc Trái Dưới', color: '#BAE6FD', targetRow: 1, targetCol: 0 },
      { id: 'o_3', index: 3, emoji: '🐢 🐚', label: 'Góc Phải Dưới', color: '#7DD3FC', targetRow: 1, targetCol: 1 },
    ],
  },
];

export const TangramPuzzleGameScreen: React.FC<TangramPuzzleGameScreenProps> = ({ onClose }) => {
  const { width } = useWindowDimensions();

  const [mode, setMode] = useState<PuzzleMode>('tangram');

  // Tangram State
  const [currentTangramIdx, setCurrentTangramIdx] = useState<number>(0);
  const currentTangram = TANGRAM_PUZZLES[currentTangramIdx];
  const [placedTangramPieces, setPlacedTangramPieces] = useState<{ [pieceId: string]: boolean }>({});
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);

  // Jigsaw State
  const [currentJigsawIdx, setCurrentJigsawIdx] = useState<number>(0);
  const currentJigsaw = JIGSAW_PUZZLES[currentJigsawIdx];
  const [jigsawGrid, setJigsawGrid] = useState<(JigsawPiece | null)[]>([null, null, null, null]);
  const [availableJigsawPieces, setAvailableJigsawPieces] = useState<JigsawPiece[]>([]);
  const [selectedJigsawPiece, setSelectedJigsawPiece] = useState<JigsawPiece | null>(null);

  // Thông báo & Hiệu ứng
  const [toastText, setToastText] = useState<string>('');
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [hintActive, setHintActive] = useState<boolean>(false);
  const [showHelperLines, setShowHelperLines] = useState<boolean>(true);

  // Animations
  const victoryScale = useRef(new Animated.Value(0.3)).current;
  const snapAnim = useRef(new Animated.Value(1)).current;

  // Hiển thị thông báo nhỏ
  const showToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => setToastText(''), 1800);
  };

  // 1. Khởi tạo Tangram Puzzle mới
  const startNewTangram = useCallback((idx: number) => {
    setCurrentTangramIdx(idx);
    setPlacedTangramPieces({});
    setSelectedPieceId(null);
    setIsVictory(false);
    setHintActive(false);
  }, []);

  // 2. Khởi tạo Jigsaw Puzzle mới
  const startNewJigsaw = useCallback((idx: number) => {
    setCurrentJigsawIdx(idx);
    const puzzle = JIGSAW_PUZZLES[idx];
    setJigsawGrid([null, null, null, null]);
    // Xáo trộn các mảnh ghép
    setAvailableJigsawPieces([...puzzle.pieces].sort(() => 0.5 - Math.random()));
    setSelectedJigsawPiece(null);
    setIsVictory(false);
    setHintActive(false);
  }, []);

  useEffect(() => {
    if (mode === 'tangram') {
      startNewTangram(currentTangramIdx);
    } else {
      startNewJigsaw(currentJigsawIdx);
    }
  }, [mode, currentTangramIdx, currentJigsawIdx, startNewTangram, startNewJigsaw]);

  // Hiệu ứng Snap nảy
  const triggerSnapAnim = () => {
    Animated.sequence([
      Animated.timing(snapAnim, { toValue: 1.12, duration: 90, useNativeDriver: true }),
      Animated.timing(snapAnim, { toValue: 1, duration: 110, useNativeDriver: true }),
    ]).start();
  };

  // 3. Xử lý đặt mảnh Tangram vào đúng vị trí
  const handlePlaceTangramPiece = (piece: TangramPiece) => {
    if (placedTangramPieces[piece.id]) return;

    triggerSnapAnim();
    const updated = { ...placedTangramPieces, [piece.id]: true };
    setPlacedTangramPieces(updated);
    setSelectedPieceId(null);
    setHintActive(false);
    showToast(`✨ Khớp hoàn hảo: ${piece.name}!`);

    // Kiểm tra hoàn thành tất cả các mảnh
    if (Object.keys(updated).length === currentTangram.pieces.length) {
      setIsVictory(true);
      Animated.spring(victoryScale, {
        toValue: 1,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      }).start();
    }
  };

  // 4. Xử lý đặt mảnh Jigsaw vào ô trên lưới
  const handlePlaceJigsawSlot = (slotIdx: number) => {
    if (!selectedJigsawPiece) {
      showToast('👆 Hãy chọn 1 mảnh ghép ở khay bên dưới trước nhé!');
      return;
    }

    // Kiểm tra xem ô này có đúng với mảnh ghép không
    if (selectedJigsawPiece.index === slotIdx) {
      triggerSnapAnim();
      const updatedGrid = [...jigsawGrid];
      updatedGrid[slotIdx] = selectedJigsawPiece;
      setJigsawGrid(updatedGrid);

      // Bỏ mảnh ghép ra khỏi danh sách còn lại
      const updatedAvailable = availableJigsawPieces.filter((p) => p.id !== selectedJigsawPiece.id);
      setAvailableJigsawPieces(updatedAvailable);
      setSelectedJigsawPiece(null);
      setHintActive(false);
      showToast(`🧩 Khớp chính xác mảnh ghép!`);

      // Kiểm tra thắng
      if (updatedAvailable.length === 0) {
        setIsVictory(true);
        Animated.spring(victoryScale, {
          toValue: 1,
          friction: 4,
          tension: 50,
          useNativeDriver: true,
        }).start();
      }
    } else {
      showToast('💡 Vị trí này chưa đúng rồi, bé thử ô khác nhé!');
    }
  };

  // Gợi ý mảnh ghép
  const handleShowHint = () => {
    setHintActive(true);
    if (mode === 'tangram') {
      const remaining = currentTangram.pieces.find((p) => !placedTangramPieces[p.id]);
      if (remaining) {
        setSelectedPieceId(remaining.id);
        showToast(`💡 Gợi ý: Hãy đặt mảnh "${remaining.name}" vào vị trí phát sáng!`);
      }
    } else {
      if (availableJigsawPieces.length > 0) {
        const nextPiece = availableJigsawPieces[0];
        setSelectedJigsawPiece(nextPiece);
        showToast(`💡 Gợi ý: Hãy đặt mảnh "${nextPiece.label}" vào ô số ${nextPiece.index + 1}!`);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#312E81" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={onClose}>
          <Text style={styles.backBtnText}>⬅ Thoát</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>🧩 Xếp Hình Trí Tuệ</Text>
          <Text style={styles.headerSubtitle}>
            {mode === 'tangram' ? currentTangram.title : currentJigsaw.title}
          </Text>
        </View>

        <TouchableOpacity style={styles.hintBtn} activeOpacity={0.8} onPress={handleShowHint}>
          <Text style={styles.hintBtnText}>💡 Gợi Ý</Text>
        </TouchableOpacity>
      </View>

      {/* THANH CHỌN CHẾ ĐỘ & BÀI XẾP HÌNH */}
      <View style={styles.topControlSection}>
        {/* Switch Mode */}
        <View style={styles.modeTabs}>
          <TouchableOpacity
            style={[styles.modeTabBtn, mode === 'tangram' && styles.modeTabBtnActive]}
            onPress={() => setMode('tangram')}
            activeOpacity={0.8}
          >
            <Text style={[styles.modeTabText, mode === 'tangram' && styles.modeTabTextActive]}>
              🔷 Hình Khối Tangram
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeTabBtn, mode === 'jigsaw' && styles.modeTabBtnActive]}
            onPress={() => setMode('jigsaw')}
            activeOpacity={0.8}
          >
            <Text style={[styles.modeTabText, mode === 'jigsaw' && styles.modeTabTextActive]}>
              🧩 Ghép Tranh Jigsaw
            </Text>
          </TouchableOpacity>
        </View>

        {/* Danh sách các bài xếp hình */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.puzzleScroll}>
          {mode === 'tangram'
            ? TANGRAM_PUZZLES.map((pz, pIdx) => {
                const isSelected = pIdx === currentTangramIdx;
                return (
                  <TouchableOpacity
                    key={pz.id}
                    style={[styles.puzzleChip, isSelected && styles.puzzleChipActive]}
                    onPress={() => startNewTangram(pIdx)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.puzzleChipEmoji}>{pz.emoji}</Text>
                    <Text style={[styles.puzzleChipText, isSelected && styles.puzzleChipTextActive]}>
                      {pz.title}
                    </Text>
                  </TouchableOpacity>
                );
              })
            : JIGSAW_PUZZLES.map((pz, pIdx) => {
                const isSelected = pIdx === currentJigsawIdx;
                return (
                  <TouchableOpacity
                    key={pz.id}
                    style={[styles.puzzleChip, isSelected && styles.puzzleChipActive]}
                    onPress={() => startNewJigsaw(pIdx)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.puzzleChipEmoji}>{pz.emoji}</Text>
                    <Text style={[styles.puzzleChipText, isSelected && styles.puzzleChipTextActive]}>
                      {pz.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
        </ScrollView>
      </View>

      {/* THÔNG BÁO POPUP */}
      {toastText !== '' && (
        <View style={styles.toastCard}>
          <Text style={styles.toastText}>{toastText}</Text>
        </View>
      )}

      {/* KHUNG BẢNG XẾP HÌNH TRUNG TÂM (TARGET PUZZLE BOARD) */}
      <View style={styles.boardContainer}>
        {mode === 'tangram' ? (
          /* BẢNG TANGRAM */
          <Animated.View
            style={[
              styles.tangramBoard,
              {
                width: currentTangram.boardWidth,
                height: currentTangram.boardHeight,
                backgroundColor: currentTangram.boardBg,
                transform: [{ scale: snapAnim }],
              },
            ]}
          >
            {/* ĐƯỜNG NÉT HƯỚNG DẪN HOẶC MẢNH GHÉP ĐÃ KHỚP */}
            {currentTangram.pieces.map((piece) => {
              const isPlaced = placedTangramPieces[piece.id];
              const isHinted = hintActive && selectedPieceId === piece.id;

              return (
                <TouchableOpacity
                  key={piece.id}
                  activeOpacity={0.8}
                  onPress={() => handlePlaceTangramPiece(piece)}
                  style={[
                    styles.tangramPieceTarget,
                    {
                      left: piece.targetX,
                      top: piece.targetY,
                      width: piece.width,
                      height: piece.height,
                      borderRadius: piece.borderRadius || 0,
                      borderTopLeftRadius: piece.borderTopLeftRadius || 0,
                      borderTopRightRadius: piece.borderTopRightRadius || 0,
                      borderBottomLeftRadius: piece.borderBottomLeftRadius || 0,
                      borderBottomRightRadius: piece.borderBottomRightRadius || 0,
                      backgroundColor: isPlaced
                        ? piece.color
                        : isHinted
                        ? 'rgba(254, 240, 138, 0.7)'
                        : 'rgba(0, 0, 0, 0.08)',
                      borderColor: isPlaced
                        ? piece.borderColor
                        : isHinted
                        ? '#F59E0B'
                        : 'rgba(0, 0, 0, 0.25)',
                      borderWidth: isPlaced ? 3 : 2,
                      borderStyle: isPlaced ? 'solid' : 'dashed',
                    },
                  ]}
                >
                  {isPlaced ? (
                    <Text style={styles.placedPieceEmoji}>{piece.emoji}</Text>
                  ) : (
                    showHelperLines && (
                      <Text style={styles.piecePlaceholderText}>{piece.name}</Text>
                    )
                  )}
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        ) : (
          /* BẢNG JIGSAW 2x2 */
          <Animated.View
            style={[
              styles.jigsawBoard,
              { borderColor: currentJigsaw.themeColor, transform: [{ scale: snapAnim }] },
            ]}
          >
            {jigsawGrid.map((piece, slotIdx) => {
              const isFilled = piece !== null;
              const isHinted = hintActive && selectedJigsawPiece?.index === slotIdx;

              return (
                <TouchableOpacity
                  key={`slot_${slotIdx}`}
                  style={[
                    styles.jigsawSlot,
                    {
                      backgroundColor: isFilled
                        ? piece.color
                        : isHinted
                        ? '#FEF08A'
                        : '#F8FAFC',
                      borderColor: isFilled
                        ? currentJigsaw.themeColor
                        : isHinted
                        ? '#F59E0B'
                        : '#CBD5E1',
                    },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => handlePlaceJigsawSlot(slotIdx)}
                >
                  {isFilled ? (
                    <View style={styles.jigsawFilledContent}>
                      <Text style={styles.jigsawEmoji}>{piece.emoji}</Text>
                      <Text style={styles.jigsawLabel}>{piece.label}</Text>
                    </View>
                  ) : (
                    <View style={styles.jigsawEmptyContent}>
                      <Text style={styles.jigsawSlotNumber}>Ô {slotIdx + 1}</Text>
                      <Text style={styles.jigsawSlotHint}>Chạm để đặt</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        )}
      </View>

      {/* KHAY CHỨA CÁC MẢNH GHÉP (PIECES TRAY) */}
      <View style={styles.traySection}>
        <View style={styles.trayHeader}>
          <Text style={styles.trayTitle}>
            {mode === 'tangram'
              ? '👇 CHẠM MẢNH GHÉP VÀO KHUNG Ở TRÊN:'
              : '👇 CHỌN MẢNH GHÉP RỒI CHẠM VÀO Ô TRỐNG:'}
          </Text>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() =>
              mode === 'tangram'
                ? startNewTangram(currentTangramIdx)
                : startNewJigsaw(currentJigsawIdx)
            }
          >
            <Text style={styles.resetBtnText}>🔄 Xếp Lại</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trayScroll}
        >
          {mode === 'tangram'
            ? currentTangram.pieces.map((piece) => {
                const isPlaced = placedTangramPieces[piece.id];
                const isSelected = selectedPieceId === piece.id;

                if (isPlaced) {
                  return (
                    <View key={piece.id} style={styles.placedPiecePlaceholder}>
                      <Text style={styles.placedCheckmark}>✓</Text>
                      <Text style={styles.placedPieceTitle}>{piece.name}</Text>
                    </View>
                  );
                }

                return (
                  <TouchableOpacity
                    key={piece.id}
                    style={[
                      styles.pieceCard,
                      { backgroundColor: piece.color, borderColor: piece.borderColor },
                      isSelected && styles.pieceCardSelected,
                    ]}
                    activeOpacity={0.75}
                    onPress={() => {
                      setSelectedPieceId(piece.id);
                      handlePlaceTangramPiece(piece);
                    }}
                  >
                    <Text style={styles.pieceCardEmoji}>{piece.emoji}</Text>
                    <Text style={styles.pieceCardName}>{piece.name}</Text>
                  </TouchableOpacity>
                );
              })
            : availableJigsawPieces.map((piece) => {
                const isSelected = selectedJigsawPiece?.id === piece.id;
                return (
                  <TouchableOpacity
                    key={piece.id}
                    style={[
                      styles.jigsawPieceCard,
                      { backgroundColor: piece.color },
                      isSelected && styles.jigsawPieceCardSelected,
                    ]}
                    activeOpacity={0.75}
                    onPress={() => {
                      setSelectedJigsawPiece(piece);
                      showToast(`Đã chọn "${piece.label}". Hãy chạm vào ô phù hợp ở trên!`);
                    }}
                  >
                    <Text style={styles.jigsawCardEmoji}>{piece.emoji}</Text>
                    <Text style={styles.jigsawCardLabel}>{piece.label}</Text>
                  </TouchableOpacity>
                );
              })}
        </ScrollView>
      </View>

      {/* MODAL CHIẾN THẮNG */}
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
            <Text style={styles.victoryTrophy}>🏆 🌟 🧩</Text>
            <Text style={styles.victoryTitle}>BÉ XẾP HÌNH XUẤT SẮC!</Text>
            <Text style={styles.victorySubtitle}>
              Tất cả các mảnh ghép đã được đặt vào đúng vị trí thật hoàn hảo!
            </Text>

            <View style={styles.victoryStarsRow}>
              <Text style={styles.starIcon}>⭐</Text>
              <Text style={[styles.starIcon, { fontSize: 48 }]}>🌟</Text>
              <Text style={styles.starIcon}>⭐</Text>
            </View>

            <View style={styles.victoryActions}>
              <TouchableOpacity
                style={styles.victoryPlayNextBtn}
                activeOpacity={0.85}
                onPress={() => {
                  if (mode === 'tangram') {
                    const nextIdx = (currentTangramIdx + 1) % TANGRAM_PUZZLES.length;
                    startNewTangram(nextIdx);
                  } else {
                    const nextIdx = (currentJigsawIdx + 1) % JIGSAW_PUZZLES.length;
                    startNewJigsaw(nextIdx);
                  }
                }}
              >
                <Text style={styles.victoryPlayNextText}>✨ Thử Bài Xếp Mới</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.victoryReplayBtn}
                activeOpacity={0.85}
                onPress={() => {
                  if (mode === 'tangram') startNewTangram(currentTangramIdx);
                  else startNewJigsaw(currentJigsawIdx);
                }}
              >
                <Text style={styles.victoryReplayText}>🔄 Xếp Lại Bài Này</Text>
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
    backgroundColor: '#1E1B4B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#312E81',
    borderBottomWidth: 2,
    borderBottomColor: '#4338CA',
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
  topControlSection: {
    backgroundColor: '#1E1B4B',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#312E81',
    gap: 6,
  },
  modeTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  modeTabBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#312E81',
  },
  modeTabBtnActive: {
    backgroundColor: '#8B5CF6',
    borderWidth: 1.5,
    borderColor: '#DDD6FE',
  },
  modeTabText: {
    color: '#C7D2FE',
    fontSize: 12,
    fontWeight: '700',
  },
  modeTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  puzzleScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  puzzleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#312E81',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4338CA',
  },
  puzzleChipActive: {
    backgroundColor: '#EC4899',
    borderColor: '#FCE7F3',
  },
  puzzleChipEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  puzzleChipText: {
    color: '#C7D2FE',
    fontSize: 12,
    fontWeight: '700',
  },
  puzzleChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  toastCard: {
    position: 'absolute',
    top: 135,
    alignSelf: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
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
  boardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  tangramBoard: {
    borderRadius: 24,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#4F46E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  tangramPieceTarget: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  placedPieceEmoji: {
    fontSize: 20,
  },
  piecePlaceholderText: {
    fontSize: 9.5,
    color: 'rgba(0, 0, 0, 0.5)',
    fontWeight: '800',
    textAlign: 'center',
  },
  jigsawBoard: {
    width: 250,
    height: 250,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  jigsawSlot: {
    width: '50%',
    height: '50%',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  jigsawFilledContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  jigsawEmoji: {
    fontSize: 32,
    marginBottom: 2,
  },
  jigsawLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E293B',
  },
  jigsawEmptyContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  jigsawSlotNumber: {
    fontSize: 14,
    fontWeight: '900',
    color: '#94A3B8',
  },
  jigsawSlotHint: {
    fontSize: 9,
    fontWeight: '700',
    color: '#CBD5E1',
    marginTop: 2,
  },
  traySection: {
    backgroundColor: '#312E81',
    paddingTop: 10,
    paddingBottom: 38,
    paddingHorizontal: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 2,
    borderTopColor: '#4338CA',
  },
  trayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  trayTitle: {
    color: '#C7D2FE',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  resetBtn: {
    backgroundColor: '#3730A3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  resetBtnText: {
    color: '#E0E7FF',
    fontSize: 11,
    fontWeight: '800',
  },
  trayScroll: {
    gap: 10,
    paddingVertical: 4,
  },
  pieceCard: {
    width: 80,
    height: 70,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  pieceCardSelected: {
    transform: [{ scale: 1.12 }],
    borderWidth: 3.5,
    borderColor: '#FDE047',
  },
  pieceCardEmoji: {
    fontSize: 24,
    marginBottom: 2,
  },
  pieceCardName: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  placedPiecePlaceholder: {
    width: 80,
    height: 70,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  placedCheckmark: {
    fontSize: 22,
    color: '#10B981',
    fontWeight: '900',
  },
  placedPieceTitle: {
    fontSize: 9,
    color: '#A5B4FC',
    fontWeight: '700',
    marginTop: 2,
  },
  jigsawPieceCard: {
    width: 80,
    height: 70,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  jigsawPieceCardSelected: {
    transform: [{ scale: 1.12 }],
    borderColor: '#FDE047',
    borderWidth: 3.5,
  },
  jigsawCardEmoji: {
    fontSize: 24,
    marginBottom: 2,
  },
  jigsawCardLabel: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#1E293B',
    textAlign: 'center',
  },
  victoryModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
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
    marginBottom: 6,
  },
  victorySubtitle: {
    color: '#C7D2FE',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  victoryStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  starIcon: {
    fontSize: 32,
  },
  victoryActions: {
    width: '100%',
    gap: 10,
  },
  victoryPlayNextBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A7F3D0',
  },
  victoryPlayNextText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  victoryReplayBtn: {
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
  },
  victoryReplayText: {
    color: '#78350F',
    fontSize: 14,
    fontWeight: '900',
  },
  victoryCloseBtn: {
    backgroundColor: '#3730A3',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  victoryCloseText: {
    color: '#E0E7FF',
    fontSize: 14,
    fontWeight: '800',
  },
});
