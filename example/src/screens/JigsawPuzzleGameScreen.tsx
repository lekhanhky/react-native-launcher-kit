import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  PanResponder,
  useWindowDimensions,
  Image,
  Modal,
} from 'react-native';
import { ThemeConfig } from '../services/themes';

// ============================================================
// 1. DATA TYPES
// ============================================================

interface JigsawPuzzleDef {
  id: string;
  title: string;
  emoji: string;
  difficulty: 'easy' | 'medium' | 'hard';
  gridSize: number; // 2 = 2x2, 3 = 3x3
  themeColor: string;
  bgGradientTop: string;
  bgGradientBottom: string;
  /** Mỗi cell chứa emoji + label + màu nền */
  cells: { emoji: string; label: string; bg: string }[];
  /** Mảnh bẫy - không thuộc bức tranh này */
  distractors: { emoji: string; label: string; bg: string }[];
  /** URL ảnh (nếu dùng image mode) */
  imageUrl?: string;
}

interface PieceState {
  id: string;
  cellIndex: number; // index gốc trong cells[] hoặc -1 nếu là distractor
  isDistractor: boolean;
  distractorData?: { emoji: string; label: string; bg: string };
  placed: boolean;
  placedInCell: number; // ô thực tế bé đặt vào (-1 nếu chưa đặt)
  eliminated: boolean; // distractor bị loại bỏ
}

// ============================================================
// 2. PUZZLE DATA — Emoji Grid Mode
// ============================================================

const JIGSAW_PUZZLES: JigsawPuzzleDef[] = [
  // === EASY (2x2) ===
  {
    id: 'farm_animals',
    title: 'Nông Trại Vui Vẻ',
    emoji: '🐮',
    difficulty: 'easy',
    gridSize: 2,
    themeColor: '#16A34A',
    bgGradientTop: '#DCFCE7',
    bgGradientBottom: '#BBF7D0',
    cells: [
      { emoji: '🐮', label: 'Bò', bg: '#FEF3C7' },
      { emoji: '🐷', label: 'Heo', bg: '#FCE7F3' },
      { emoji: '🐔', label: 'Gà', bg: '#FEF9C3' },
      { emoji: '🐴', label: 'Ngựa', bg: '#DBEAFE' },
    ],
    distractors: [
      { emoji: '🐬', label: 'Cá heo', bg: '#D1FAE5' },
      { emoji: '🦁', label: 'Sư tử', bg: '#FEF3C7' },
      { emoji: '🐧', label: 'Chim cánh cụt', bg: '#E2E8F0' },
    ],
  },
  {
    id: 'fruits',
    title: 'Hoa Quả Tươi Ngon',
    emoji: '🍎',
    difficulty: 'easy',
    gridSize: 2,
    themeColor: '#DC2626',
    bgGradientTop: '#FEF2F2',
    bgGradientBottom: '#FECACA',
    cells: [
      { emoji: '🍎', label: 'Táo', bg: '#FEE2E2' },
      { emoji: '🍌', label: 'Chuối', bg: '#FEF9C3' },
      { emoji: '🍇', label: 'Nho', bg: '#EDE9FE' },
      { emoji: '🍊', label: 'Cam', bg: '#FFEDD5' },
    ],
    distractors: [
      { emoji: '🥦', label: 'Bông cải', bg: '#D1FAE5' },
      { emoji: '🥕', label: 'Cà rốt', bg: '#FFEDD5' },
      { emoji: '🍫', label: 'Sôcôla', bg: '#FEF3C7' },
    ],
  },
  {
    id: 'vehicles',
    title: 'Phương Tiện Giao Thông',
    emoji: '🚗',
    difficulty: 'easy',
    gridSize: 2,
    themeColor: '#2563EB',
    bgGradientTop: '#EFF6FF',
    bgGradientBottom: '#BFDBFE',
    cells: [
      { emoji: '🚗', label: 'Xe hơi', bg: '#FEE2E2' },
      { emoji: '🚌', label: 'Xe buýt', bg: '#FEF9C3' },
      { emoji: '✈️', label: 'Máy bay', bg: '#DBEAFE' },
      { emoji: '🚢', label: 'Tàu', bg: '#D1FAE5' },
    ],
    distractors: [
      { emoji: '🍔', label: 'Hamburger', bg: '#FFEDD5' },
      { emoji: '🎨', label: 'Bảng màu', bg: '#EDE9FE' },
      { emoji: '⚽', label: 'Bóng đá', bg: '#D1FAE5' },
    ],
  },

  // === MEDIUM (3x3) ===
  {
    id: 'ocean_world',
    title: 'Thế Giới Đại Dương',
    emoji: '🐠',
    difficulty: 'medium',
    gridSize: 3,
    themeColor: '#0891B2',
    bgGradientTop: '#ECFEFF',
    bgGradientBottom: '#A5F3FC',
    cells: [
      { emoji: '🐙', label: 'Bạch tuộc', bg: '#FCE7F3' },
      { emoji: '🐠', label: 'Cá', bg: '#DBEAFE' },
      { emoji: '🦀', label: 'Cua', bg: '#FEE2E2' },
      { emoji: '🐬', label: 'Cá heo', bg: '#D1FAE5' },
      { emoji: '🐢', label: 'Rùa', bg: '#DCFCE7' },
      { emoji: '🦑', label: 'Mực', bg: '#EDE9FE' },
      { emoji: '🐳', label: 'Cá voi', bg: '#DBEAFE' },
      { emoji: '🦈', label: 'Cá mập', bg: '#E2E8F0' },
      { emoji: '🐚', label: 'Sò', bg: '#FEF3C7' },
    ],
    distractors: [
      { emoji: '🦋', label: 'Bướm', bg: '#FCE7F3' },
      { emoji: '🐒', label: 'Khỉ', bg: '#FEF3C7' },
      { emoji: '🌲', label: 'Cây thông', bg: '#DCFCE7' },
      { emoji: '🌞', label: 'Mặt trời', bg: '#FEF9C3' },
    ],
  },
  {
    id: 'space_explorer',
    title: 'Khám Phá Vũ Trụ',
    emoji: '🚀',
    difficulty: 'medium',
    gridSize: 3,
    themeColor: '#7C3AED',
    bgGradientTop: '#F5F3FF',
    bgGradientBottom: '#DDD6FE',
    cells: [
      { emoji: '🌍', label: 'Trái đất', bg: '#D1FAE5' },
      { emoji: '🌙', label: 'Mặt trăng', bg: '#FEF9C3' },
      { emoji: '⭐', label: 'Ngôi sao', bg: '#FEF3C7' },
      { emoji: '🚀', label: 'Tên lửa', bg: '#FEE2E2' },
      { emoji: '🛸', label: 'UFO', bg: '#EDE9FE' },
      { emoji: '☄️', label: 'Sao chổi', bg: '#FFEDD5' },
      { emoji: '🪐', label: 'Sao mộc', bg: '#FCE7F3' },
      { emoji: '👨‍🚀', label: 'Phi hành gia', bg: '#DBEAFE' },
      { emoji: '🌟', label: 'Sao sáng', bg: '#FEF9C3' },
    ],
    distractors: [
      { emoji: '🍎', label: 'Táo', bg: '#FEE2E2' },
      { emoji: '🐷', label: 'Heo', bg: '#FCE7F3' },
      { emoji: '🎵', label: 'Nhạc', bg: '#EDE9FE' },
      { emoji: '📚', label: 'Sách', bg: '#DBEAFE' },
    ],
  },
  {
    id: 'garden_flowers',
    title: 'Khu Vườn Hoa Đẹp',
    emoji: '🌸',
    difficulty: 'medium',
    gridSize: 3,
    themeColor: '#DB2777',
    bgGradientTop: '#FDF2F8',
    bgGradientBottom: '#FBCFE8',
    cells: [
      { emoji: '🌹', label: 'Hoa hồng', bg: '#FEE2E2' },
      { emoji: '🌻', label: 'Hướng dương', bg: '#FEF9C3' },
      { emoji: '🌸', label: 'Hoa đào', bg: '#FCE7F3' },
      { emoji: '🌺', label: 'Hoa dâm bụt', bg: '#FEE2E2' },
      { emoji: '🌷', label: 'Hoa tulip', bg: '#FEE2E2' },
      { emoji: '💐', label: 'Bó hoa', bg: '#EDE9FE' },
      { emoji: '🌼', label: 'Hoa cúc', bg: '#FEF3C7' },
      { emoji: '🍀', label: 'Cỏ ba lá', bg: '#D1FAE5' },
      { emoji: '🌿', label: 'Lá xanh', bg: '#DCFCE7' },
    ],
    distractors: [
      { emoji: '🚀', label: 'Tên lửa', bg: '#FEE2E2' },
      { emoji: '🐠', label: 'Cá', bg: '#DBEAFE' },
      { emoji: '❄️', label: 'Tuyết', bg: '#E2E8F0' },
      { emoji: '🍕', label: 'Pizza', bg: '#FFEDD5' },
    ],
  },

  // === HARD (4x4) ===
  {
    id: 'emoji_world',
    title: 'Thế Giới Biểu Tượng',
    emoji: '😀',
    difficulty: 'hard',
    gridSize: 4,
    themeColor: '#EA580C',
    bgGradientTop: '#FFF7ED',
    bgGradientBottom: '#FED7AA',
    cells: [
      { emoji: '😀', label: 'Vui', bg: '#FEF9C3' },
      { emoji: '🥰', label: 'Yêu', bg: '#FCE7F3' },
      { emoji: '😎', label: 'Ngầu', bg: '#DBEAFE' },
      { emoji: '🤩', label: 'Wow', bg: '#FEF3C7' },
      { emoji: '🎈', label: 'Bóng', bg: '#FEE2E2' },
      { emoji: '🎁', label: 'Quà', bg: '#EDE9FE' },
      { emoji: '🎂', label: 'Bánh', bg: '#FFEDD5' },
      { emoji: '🎉', label: 'Tiệc', bg: '#D1FAE5' },
      { emoji: '🦄', label: 'Kỳ lân', bg: '#FCE7F3' },
      { emoji: '🐶', label: 'Cún', bg: '#FEF3C7' },
      { emoji: '🐱', label: 'Mèo', bg: '#FEF9C3' },
      { emoji: '🐰', label: 'Thỏ', bg: '#E2E8F0' },
      { emoji: '🌈', label: 'Cầu vồng', bg: '#DBEAFE' },
      { emoji: '🔥', label: 'Lửa', bg: '#FEE2E2' },
      { emoji: '💎', label: 'Kim cương', bg: '#DBEAFE' },
      { emoji: '🏆', label: 'Cúp', bg: '#FEF9C3' },
    ],
    distractors: [
      { emoji: '🌵', label: 'Xương rồng', bg: '#DCFCE7' },
      { emoji: '🔮', label: 'Quả cầu', bg: '#EDE9FE' },
      { emoji: '🧲', label: 'Từ tính', bg: '#E2E8F0' },
      { emoji: '🎯', label: 'Bia', bg: '#FEE2E2' },
      { emoji: '🧪', label: 'Ống nghiệm', bg: '#DBEAFE' },
    ],
  },
];

// ============================================================
// 3. PROPS
// ============================================================

interface JigsawPuzzleGameScreenProps {
  theme?: ThemeConfig;
  onClose: () => void;
}

// ============================================================
// 4. COMPONENT
// ============================================================

export const JigsawPuzzleGameScreen: React.FC<JigsawPuzzleGameScreenProps> = ({
  onClose,
}) => {
  const { width: screenW, height: screenH } = useWindowDimensions();

  // === STATE ===
  const [screen, setScreen] = useState<'select' | 'play'>('select');
  const [selectedPuzzle, setSelectedPuzzle] = useState<JigsawPuzzleDef | null>(null);
  const [pieces, setPieces] = useState<PieceState[]>([]);
  const [shuffledOrder, setShuffledOrder] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [moveCount, setMoveCount] = useState(0);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Refs cho PanResponder
  const piecesRef = useRef<PieceState[]>([]);
  const handlePlaceRef = useRef<(pieceId: string, dropX: number, dropY: number) => void>(() => {});
  const boardLayoutRef = useRef<{ x: number; y: number; width: number; height: number }>({ x: 0, y: 0, width: 0, height: 0 });

  // === ANIMATION VALUES ===
  const victoryScale = useRef(new Animated.Value(0)).current;
  const victoryOpacity = useRef(new Animated.Value(0)).current;

  // Mỗi piece có pan position riêng
  const panRefs = useRef<{ [key: string]: Animated.ValueXY }>({});
  const scaleRefs = useRef<{ [key: string]: Animated.Value }>({});

  // ============================================================
  // 5. START GAME
  // ============================================================

  const startGame = useCallback((puzzle: JigsawPuzzleDef) => {
    setSelectedPuzzle(puzzle);
    setIsComplete(false);
    setScore(0);
    setMoveCount(0);
    setWarningMessage(null);
    victoryScale.setValue(0);
    victoryOpacity.setValue(0);

    const total = puzzle.gridSize * puzzle.gridSize;

    // Tạo mảnh ghép thật
    const newPieces: PieceState[] = [];
    for (let i = 0; i < total; i++) {
      const id = `piece_${i}`;
      newPieces.push({ id, cellIndex: i, isDistractor: false, placed: false, placedInCell: -1, eliminated: false });
    }

    // Tạo mảnh bẫy (distractor)
    const distractors = puzzle.distractors || [];
    for (let d = 0; d < distractors.length; d++) {
      const id = `distractor_${d}`;
      newPieces.push({
        id,
        cellIndex: -1,
        isDistractor: true,
        distractorData: distractors[d],
        placed: false,
        placedInCell: -1,
        eliminated: false,
      });
    }

    // Khởi tạo animation values cho tất cả
    for (const p of newPieces) {
      if (!panRefs.current[p.id]) {
        panRefs.current[p.id] = new Animated.ValueXY({ x: 0, y: 0 });
      } else {
        panRefs.current[p.id].setValue({ x: 0, y: 0 });
      }
      if (!scaleRefs.current[p.id]) {
        scaleRefs.current[p.id] = new Animated.Value(1);
      } else {
        scaleRefs.current[p.id].setValue(1);
      }
    }

    setPieces(newPieces);
    piecesRef.current = newPieces;

    // Xáo trộn toàn bộ (real + distractor)
    const allPieceIds = newPieces.map((_, i) => i);
    for (let i = allPieceIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allPieceIds[i], allPieceIds[j]] = [allPieceIds[j], allPieceIds[i]];
    }
    setShuffledOrder(allPieceIds);

    setScreen('play');
  }, [victoryScale, victoryOpacity]);

  // ============================================================
  // 6. HANDLE PLACE PIECE
  // ============================================================

  const handlePlacePiece = useCallback((pieceId: string, dropX: number, dropY: number) => {
    if (!selectedPuzzle || isComplete) return;

    const piece = piecesRef.current.find((p) => p.id === pieceId);
    if (!piece || piece.placed || piece.eliminated) return;

    const board = boardLayoutRef.current;
    const grid = selectedPuzzle.gridSize;
    const cellW = board.width / grid;
    const cellH = board.height / grid;

    // Kiểm tra xem drop có rơi vào vùng board không
    const inBoard =
      dropX >= board.x && dropX <= board.x + board.width &&
      dropY >= board.y && dropY <= board.y + board.height;

    if (inBoard && piece.isDistractor) {
      // 🚫 DISTRACTOR — Cảnh báo + loại bỏ
      setWarningMessage(`❌ "${piece.distractorData?.label}" không thuộc bức tranh này!`);
      setTimeout(() => setWarningMessage(null), 2000);

      const updatedPieces = piecesRef.current.map((p) =>
        p.id === pieceId ? { ...p, eliminated: true } : p
      );
      setPieces(updatedPieces);
      piecesRef.current = updatedPieces;

      Animated.timing(scaleRefs.current[pieceId], {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
      return;
    }

    if (!inBoard || piece.isDistractor) {
      Animated.spring(panRefs.current[pieceId], {
        toValue: { x: 0, y: 0 },
        friction: 5,
        useNativeDriver: false,
      }).start();
      return;
    }

    // === MẢNH THẬT: tìm ô trống gần nhất để đặt vào ===
    const occupiedCells = new Set(
      piecesRef.current
        .filter((p) => p.placed && p.placedInCell >= 0)
        .map((p) => p.placedInCell)
    );

    let bestCell = -1;
    let bestDist = Infinity;
    for (let idx = 0; idx < grid * grid; idx++) {
      if (occupiedCells.has(idx)) continue; // ô đã có mảnh
      const row = Math.floor(idx / grid);
      const col = idx % grid;
      const cx = board.x + col * cellW + cellW / 2;
      const cy = board.y + row * cellH + cellH / 2;
      const d = Math.sqrt(Math.pow(dropX - cx, 2) + Math.pow(dropY - cy, 2));
      if (d < bestDist) {
        bestDist = d;
        bestCell = idx;
      }
    }

    if (bestCell < 0 || bestDist > cellW * 1.2) {
      // Không tìm được ô trống gần
      Animated.spring(panRefs.current[pieceId], {
        toValue: { x: 0, y: 0 },
        friction: 5,
        useNativeDriver: false,
      }).start();
      return;
    }

    // ✅ ĐÚNG CHỦ ĐỀ! Đặt vào ô trống gần nhất
    setWarningMessage(null);
    const updatedPieces = piecesRef.current.map((p) =>
      p.id === pieceId ? { ...p, placed: true, placedInCell: bestCell } : p
    );
    setPieces(updatedPieces);
    piecesRef.current = updatedPieces;

    setScore((prev) => prev + 10);
    setMoveCount((prev) => prev + 1);

    Animated.spring(scaleRefs.current[pieceId], {
      toValue: 1,
      friction: 4,
      useNativeDriver: false,
    }).start();

    // Kiểm tra hoàn thành
    const realPieces = updatedPieces.filter((p) => !p.isDistractor);
    const allPlaced = realPieces.every((p) => p.placed);
    if (allPlaced) {
      setIsComplete(true);
      Animated.parallel([
        Animated.spring(victoryScale, { toValue: 1, friction: 4, tension: 50, useNativeDriver: true }),
        Animated.timing(victoryOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();
    }
  }, [selectedPuzzle, isComplete, victoryScale, victoryOpacity]);

  // Cập nhật ref
  handlePlaceRef.current = handlePlacePiece;

  // ============================================================
  // 7. RENDER - SELECT SCREEN
  // ============================================================

  if (screen === 'select') {
    const easyPuzzles = JIGSAW_PUZZLES.filter((p) => p.difficulty === 'easy');
    const mediumPuzzles = JIGSAW_PUZZLES.filter((p) => p.difficulty === 'medium');
    const hardPuzzles = JIGSAW_PUZZLES.filter((p) => p.difficulty === 'hard');

    // Responsive: tính card width dựa trên screen width
    const cardGap = 12;
    const sectionPadding = 16;
    // 3 cột trên landscape, 2 cột trên portrait nhỏ
    const numCols = screenW > 500 ? 3 : 2;
    const cardWidth = (screenW - sectionPadding * 2 - cardGap * (numCols - 1)) / numCols;

    const renderPuzzleGrid = (puzzles: JigsawPuzzleDef[], gridLabel: string) => (
      <View style={styles.puzzleGrid}>
        {puzzles.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[
              styles.puzzleCard,
              {
                width: cardWidth,
                backgroundColor: p.bgGradientTop,
                borderColor: p.themeColor + '40',
              },
            ]}
            onPress={() => startGame(p)}
            activeOpacity={0.75}
          >
            <Text style={[styles.puzzleCardEmoji, { fontSize: cardWidth * 0.28 }]}>{p.emoji}</Text>
            <Text
              style={[styles.puzzleCardTitle, { color: p.themeColor, fontSize: cardWidth * 0.1 }]}
              numberOfLines={2}
            >
              {p.title}
            </Text>
            <View style={[styles.puzzleCardBadge, { backgroundColor: p.themeColor + '20' }]}>
              <Text style={[styles.puzzleCardBadgeText, { color: p.themeColor }]}>{gridLabel}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );

    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerEmoji}>🧩</Text>
            <Text style={styles.headerTitle}>Bé Ghép Tranh</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.selectScroll}
          contentContainerStyle={styles.selectScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Easy */}
          <View style={styles.diffSection}>
            <View style={styles.diffHeader}>
              <Text style={styles.diffBadgeEasy}>⭐ Dễ</Text>
              <Text style={styles.diffSubtitle}>2×2 — 4 mảnh ghép</Text>
            </View>
            {renderPuzzleGrid(easyPuzzles, '2×2')}
          </View>

          {/* Medium */}
          <View style={styles.diffSection}>
            <View style={styles.diffHeader}>
              <Text style={styles.diffBadgeMedium}>⭐⭐ Trung Bình</Text>
              <Text style={styles.diffSubtitle}>3×3 — 9 mảnh ghép</Text>
            </View>
            {renderPuzzleGrid(mediumPuzzles, '3×3')}
          </View>

          {/* Hard */}
          <View style={styles.diffSection}>
            <View style={styles.diffHeader}>
              <Text style={styles.diffBadgeHard}>⭐⭐⭐ Khó</Text>
              <Text style={styles.diffSubtitle}>4×4 — 16 mảnh ghép</Text>
            </View>
            {renderPuzzleGrid(hardPuzzles, '4×4')}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ============================================================
  // 8. RENDER - PLAY SCREEN
  // ============================================================

  if (!selectedPuzzle) return null;

  const grid = selectedPuzzle.gridSize;
  const boardPadding = 16;
  const boardSize = Math.min(screenW - boardPadding * 2, screenH * 0.42);
  const cellSize = boardSize / grid;
  const pieceTrayHeight = screenH * 0.3;

  // Mảnh ghép chưa đặt (cả thật và bẫy, chưa bị loại)
  const unplacedPieceIndices = shuffledOrder.filter((idx) => {
    const p = pieces[idx];
    return p && !p.placed && !p.eliminated;
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: selectedPuzzle.bgGradientTop }]}>
      <StatusBar barStyle="dark-content" backgroundColor={selectedPuzzle.bgGradientTop} />

      {/* Header */}
      <View style={[styles.playHeader, { backgroundColor: selectedPuzzle.bgGradientTop }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => { setScreen('select'); setSelectedPuzzle(null); }}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.playHeaderTitle}>{selectedPuzzle.emoji} {selectedPuzzle.title}</Text>
        </View>
        <View style={styles.scoreBox}>
          <Text style={[styles.scoreText, { color: selectedPuzzle.themeColor }]}>
            ⭐ {score}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statPill, { backgroundColor: selectedPuzzle.themeColor + '15' }]}>
          <Text style={[styles.statText, { color: selectedPuzzle.themeColor }]}>
            ✅ {pieces.filter((p) => !p.isDistractor && p.placed).length}/{grid * grid}
          </Text>
        </View>
        <View style={[styles.statPill, { backgroundColor: selectedPuzzle.themeColor + '15' }]}>
          <Text style={[styles.statText, { color: selectedPuzzle.themeColor }]}>
            👆 {moveCount} lượt
          </Text>
        </View>
      </View>

      {/* Warning message */}
      {warningMessage && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>{warningMessage}</Text>
        </View>
      )}

      {/* Board */}
      <View
        style={[styles.boardContainer, { width: boardSize, height: boardSize }]}
        onLayout={(e) => {
          e.target.measureInWindow((x: number, y: number, w: number, h: number) => {
            boardLayoutRef.current = { x, y, width: w, height: h };
          });
        }}
      >
        {Array.from({ length: grid * grid }).map((_, idx) => {
          const row = Math.floor(idx / grid);
          const col = idx % grid;
          // Tìm mảnh đã được đặt vào ô này (bất kỳ mảnh thật nào)
          const placedPiece = pieces.find((p) => p.placed && p.placedInCell === idx && !p.isDistractor);
          const isPlaced = !!placedPiece;
          // Lấy data hiển thị từ mảnh đã đặt
          const displayCell = isPlaced
            ? selectedPuzzle.cells[placedPiece!.cellIndex]
            : null;

          return (
            <View
              key={`cell_${idx}`}
              style={[
                styles.boardCell,
                {
                  width: cellSize - 4,
                  height: cellSize - 4,
                  left: col * cellSize + 2,
                  top: row * cellSize + 2,
                  backgroundColor: isPlaced ? displayCell!.bg : '#F1F5F9',
                  borderColor: isPlaced ? selectedPuzzle.themeColor + '60' : '#E2E8F0',
                },
              ]}
            >
              {isPlaced ? (
                <>
                  <Text style={[styles.cellEmoji, { fontSize: cellSize * 0.4 }]}>{displayCell!.emoji}</Text>
                  <Text style={[styles.cellLabel, { fontSize: cellSize * 0.12 }]}>{displayCell!.label}</Text>
                </>
              ) : (
                <Text style={[styles.cellPlaceholder, { fontSize: cellSize * 0.18 }]}>?</Text>
              )}
            </View>
          );
        })}
      </View>

      {/* Vùng mảnh ghép xáo trộn (bao gồm cả mảnh bẫy) */}
      <View style={[styles.pieceTray, { height: pieceTrayHeight }]}>
        <Text style={[styles.trayTitle, { color: selectedPuzzle.themeColor }]}>
          Kéo đúng mảnh ghép lên bảng 👆
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trayScroll}
        >
          {unplacedPieceIndices.map((pieceIdx) => {
            const piece = pieces[pieceIdx];
            if (!piece) return null;

            // Lấy cell data: nếu là mảnh thật dùng cells[], nếu là bẫy dùng distractorData
            const cell = piece.isDistractor
              ? piece.distractorData!
              : selectedPuzzle.cells[piece.cellIndex];

            return (
              <DraggablePiece
                key={piece.id}
                pieceId={piece.id}
                cell={cell}
                cellSize={cellSize}
                themeColor={piece.isDistractor ? '#94A3B8' : selectedPuzzle.themeColor}
                pan={panRefs.current[piece.id]}
                scale={scaleRefs.current[piece.id]}
                onDrop={handlePlaceRef}
              />
            );
          })}
        </ScrollView>
      </View>

      {/* Victory Modal */}
      <Modal
        visible={isComplete}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setScreen('select');
          setSelectedPuzzle(null);
        }}
      >
        <View style={styles.victoryModalOverlay}>
          <Animated.View style={[styles.victoryCard, { transform: [{ scale: victoryScale }] }]}>
            <Text style={styles.victoryEmoji}>🎉</Text>
            <Text style={styles.victoryTitle}>Tuyệt Vời!</Text>
            <Text style={styles.victorySubtitle}>
              Bé đã ghép xong "{selectedPuzzle.title}" trong {moveCount} lượt!
            </Text>
            <Text style={styles.victoryScore}>⭐ {score} điểm</Text>

            <View style={styles.victoryButtons}>
              <TouchableOpacity
                style={[styles.victoryBtn, { backgroundColor: selectedPuzzle.themeColor }]}
                onPress={() => startGame(selectedPuzzle)}
                activeOpacity={0.8}
              >
                <Text style={styles.victoryBtnText}>🔄 Chơi Lại</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.victoryBtn, styles.victoryBtnOutline]}
                onPress={() => { setScreen('select'); setSelectedPuzzle(null); }}
                activeOpacity={0.8}
              >
                <Text style={[styles.victoryBtnText, { color: '#475569' }]}>📋 Chọn Bài Khác</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ============================================================
// 9. DRAGGABLE PIECE COMPONENT
// ============================================================

interface DraggablePieceProps {
  pieceId: string;
  cell: { emoji: string; label: string; bg: string };
  cellSize: number;
  themeColor: string;
  pan: Animated.ValueXY;
  scale: Animated.Value;
  onDrop: React.MutableRefObject<(pieceId: string, dropX: number, dropY: number) => void>;
}

const DraggablePiece: React.FC<DraggablePieceProps> = ({
  pieceId,
  cell,
  cellSize,
  themeColor,
  pan,
  scale,
  onDrop,
}) => {
  const pieceSize = Math.min(cellSize * 0.85, 80);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        Animated.spring(scale, { toValue: 1.2, useNativeDriver: false }).start();
      },
      onPanResponderMove: (_, gestureState) => {
        pan.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (_, gestureState) => {
        Animated.spring(scale, { toValue: 1, useNativeDriver: false }).start();
        const dropX = gestureState.moveX;
        const dropY = gestureState.moveY;
        onDrop.current(pieceId, dropX, dropY);
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.draggablePiece,
        {
          width: pieceSize,
          height: pieceSize,
          backgroundColor: cell.bg,
          borderColor: themeColor + '50',
          transform: [
            ...pan.getTranslateTransform(),
            { scale: scale },
          ],
        },
      ]}
    >
      <Text style={[styles.pieceEmoji, { fontSize: pieceSize * 0.42 }]}>{cell.emoji}</Text>
      <Text style={[styles.pieceLabel, { fontSize: pieceSize * 0.14, color: themeColor }]}>{cell.label}</Text>
    </Animated.View>
  );
};

// ============================================================
// 10. STYLES
// ============================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // === HEADER ===
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    padding: 6,
    width: 40,
  },
  backArrow: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerEmoji: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },

  // === SELECT SCREEN ===
  selectScroll: {
    flex: 1,
  },
  selectScrollContent: {
    paddingBottom: 40,
  },
  diffSection: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  diffHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  diffBadgeEasy: {
    fontSize: 14,
    fontWeight: '800',
    color: '#16A34A',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    overflow: 'hidden',
  },
  diffBadgeMedium: {
    fontSize: 14,
    fontWeight: '800',
    color: '#D97706',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    overflow: 'hidden',
  },
  diffBadgeHard: {
    fontSize: 14,
    fontWeight: '800',
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    overflow: 'hidden',
  },
  diffSubtitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  puzzleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  puzzleCard: {
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    gap: 8,
  },
  puzzleCardEmoji: {
    textAlign: 'center',
  },
  puzzleCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  puzzleCardBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  puzzleCardBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },

  // === PLAY HEADER ===
  playHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  playHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  scoreBox: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '800',
  },

  // === STATS ===
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  statPill: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
  },
  statText: {
    fontSize: 13,
    fontWeight: '700',
  },

  // === WARNING ===
  warningBanner: {
    marginHorizontal: 20,
    marginVertical: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FECACA',
    alignItems: 'center',
  },
  warningText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
    textAlign: 'center',
  },

  // === BOARD ===
  boardContainer: {
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#E2E8F0',
    position: 'relative',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  boardCell: {
    position: 'absolute',
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellEmoji: {
    textAlign: 'center',
  },
  cellLabel: {
    textAlign: 'center',
    fontWeight: '700',
    color: '#475569',
    marginTop: 2,
  },
  cellPlaceholder: {
    color: '#CBD5E1',
    fontWeight: '800',
  },

  // === PIECE TRAY ===
  pieceTray: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 8,
  },
  trayTitle: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  trayScroll: {
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 8,
  },

  // === DRAGGABLE PIECE ===
  draggablePiece: {
    borderRadius: 14,
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    zIndex: 100,
  },
  pieceEmoji: {
    textAlign: 'center',
  },
  pieceLabel: {
    textAlign: 'center',
    fontWeight: '800',
    marginTop: 2,
  },

  // === VICTORY ===
  victoryModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  victoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '85%',
    maxWidth: 340,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  victoryEmoji: {
    fontSize: 44,
    marginBottom: 6,
  },
  victoryTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  victorySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 8,
  },
  victoryScore: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F59E0B',
    marginBottom: 16,
  },
  victoryButtons: {
    gap: 10,
    width: '100%',
  },
  victoryBtn: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  victoryBtnOutline: {
    backgroundColor: '#F1F5F9',
  },
  victoryBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
