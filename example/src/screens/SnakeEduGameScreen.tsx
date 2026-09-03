import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  PanResponder,
  useWindowDimensions,
  Animated,
  Modal,
  Platform,
} from 'react-native';
import { soundManager } from '../components/SoundPlayer';

// Các chế độ chơi giáo dục
export type SnakeMode = 'math' | 'spelling' | 'shapes' | 'fruits';
export type SnakeSpeed = 'slow' | 'normal' | 'fast';
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface Position {
  x: number;
  y: number;
}

interface FoodItem {
  id: string;
  x: number;
  y: number;
  label: string;
  emoji: string;
  value: any;
  isTarget: boolean;
  color?: string;
}

interface SpellingWord {
  word: string;
  meaning: string;
  emoji: string;
  letters: string[];
}

const SPELLING_WORDS: SpellingWord[] = [
  { word: 'MÈO', meaning: 'Chú mèo con', emoji: '🐱', letters: ['M', 'È', 'O'] },
  { word: 'CÁ', meaning: 'Chú cá bơi', emoji: '🐟', letters: ['C', 'Á'] },
  { word: 'GẤU', meaning: 'Bạn gấu bông', emoji: '🐻', letters: ['G', 'Ấ', 'U'] },
  { word: 'THỎ', meaning: 'Bạn thỏ trắng', emoji: '🐰', letters: ['T', 'H', 'Ỏ'] },
  { word: 'TÁO', meaning: 'Quả táo đỏ', emoji: '🍎', letters: ['T', 'Á', 'O'] },
  { word: 'BÁNH', meaning: 'Bánh kem ngon', emoji: '🎂', letters: ['B', 'Á', 'N', 'H'] },
  { word: 'HOA', meaning: 'Bông hoa hồng', emoji: '🌸', letters: ['H', 'O', 'A'] },
  { word: 'XE', meaning: 'Xe ô tô', emoji: '🚗', letters: ['X', 'E'] },
  { word: 'CHIM', meaning: 'Chú chim hót', emoji: '🐦', letters: ['C', 'H', 'I', 'M'] },
];

const FRUITS_LIST = [
  { emoji: '🍎', name: 'Táo Đỏ', points: 10, color: '#EF4444' },
  { emoji: '🍓', name: 'Dâu Tây', points: 15, color: '#EC4899' },
  { emoji: '🍌', name: 'Chuối Vàng', points: 10, color: '#F59E0B' },
  { emoji: '🍉', name: 'Dưa Hấu', points: 20, color: '#10B981' },
  { emoji: '🍇', name: 'Nho Tím', points: 15, color: '#8B5CF6' },
  { emoji: '🍊', name: 'Cam Ngọt', points: 10, color: '#F97316' },
  { emoji: '🍍', name: 'Dứa Vàng', points: 25, color: '#EAB308' },
  { emoji: '🍒', name: 'Anh Đào', points: 20, color: '#F43F5E' },
];

const SHAPES_LIST = [
  { id: 'circle', label: 'Hình Tròn', emoji: '🔴', color: '#EF4444' },
  { id: 'square', label: 'Hình Vuông', emoji: '🟦', color: '#3B82F6' },
  { id: 'star', label: 'Ngôi Sao', emoji: '⭐', color: '#F59E0B' },
  { id: 'heart', label: 'Trái Tim', emoji: '💖', color: '#EC4899' },
  { id: 'triangle', label: 'Tam Giác', emoji: '🔺', color: '#10B981' },
  { id: 'diamond', label: 'Kim Cương', emoji: '💎', color: '#06B6D4' },
];

const GRID_COLS = 13;
const GRID_ROWS = 9;

const RAINBOW_BODY_COLORS = [
  '#FF2E63', '#FF6B08', '#FFD100', '#10B981',
  '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899',
];

export const SnakeEduGameScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  // Cấu hình chế độ & Tốc độ
  const [gameMode, setGameMode] = useState<SnakeMode>('math');
  const [speed, setSpeed] = useState<SnakeSpeed>('slow');
  const [isWrapWalls, setIsWrapWalls] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Điểm & Chuỗi Combo
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [stars, setStars] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Rắn: Mảng các tọa độ [đầu, thân, đuôi]
  const [snake, setSnake] = useState<Position[]>([
    { x: 4, y: 4 },
    { x: 3, y: 4 },
    { x: 2, y: 4 },
  ]);
  const [direction, setDirection] = useState<Direction>('RIGHT');

  // Thức ăn trên bản đồ
  const [foods, setFoods] = useState<FoodItem[]>([]);

  // Dữ liệu câu hỏi / nhiệm vụ
  const [currentMathQuestion, setCurrentMathQuestion] = useState<{ text: string; answer: number } | null>(null);
  const [spellingIndex, setSpellingIndex] = useState<number>(0);
  const [spellingLetterStep, setSpellingLetterStep] = useState<number>(0);
  const [targetShape, setTargetShape] = useState<typeof SHAPES_LIST[0]>(SHAPES_LIST[0]);

  // Modal Chiến Thắng
  const [isVictoryModalVisible, setIsVictoryModalVisible] = useState<boolean>(false);
  const victoryScale = useRef(new Animated.Value(0.3)).current;

  // Refs lưu giữ state cho Game Loop Interval
  const stateRef = useRef({
    snake,
    direction,
    foods,
    gameMode,
    isWrapWalls,
    isPlaying,
    isPaused,
    currentMathQuestion,
    spellingIndex,
    spellingLetterStep,
    targetShape,
    score,
    streak,
    stars,
  });

  stateRef.current = {
    snake,
    direction,
    foods,
    gameMode,
    isWrapWalls,
    isPlaying,
    isPaused,
    currentMathQuestion,
    spellingIndex,
    spellingLetterStep,
    targetShape,
    score,
    streak,
    stars,
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 1800);
  };

  // Tạo vị trí ngẫu nhiên không trùng với thân rắn
  const getRandomFreeCell = (currentSnake: Position[], existingFoods: FoodItem[]): Position => {
    let attempts = 0;
    while (attempts < 200) {
      const rx = Math.floor(Math.random() * (GRID_COLS - 2)) + 1;
      const ry = Math.floor(Math.random() * (GRID_ROWS - 2)) + 1;
      const inSnake = currentSnake.some((s) => s.x === rx && s.y === ry);
      const inFood = existingFoods.some((f) => f.x === rx && f.y === ry);
      if (!inSnake && !inFood) {
        return { x: rx, y: ry };
      }
      attempts++;
    }
    return { x: 2, y: 2 };
  };

  // 1. Khởi tạo màn chơi Toán học: Chỉ hiện con số to rõ ràng
  const setupMathRound = (currentSnake: Position[]) => {
    const isSum = Math.random() > 0.4;
    let a = Math.floor(Math.random() * 6) + 1;
    let b = Math.floor(Math.random() * 5) + 1;
    let answer = isSum ? a + b : Math.max(a, b) - Math.min(a, b);
    if (!isSum && a < b) {
      const temp = a; a = b; b = temp; answer = a - b;
    }
    const qText = isSum ? `${a} + ${b} = ?` : `${a} - ${b} = ?`;
    setCurrentMathQuestion({ text: qText, answer });
    soundManager.speak(`Bé hãy tìm ăn đáp án cho ${qText}`);

    // Tạo 3 đáp án: 1 đúng + 2 sai
    const options = [answer];
    while (options.length < 3) {
      const offset = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
      const wrong = Math.max(1, answer + offset);
      if (!options.includes(wrong)) {
        options.push(wrong);
      }
    }
    // Xáo trộn đáp án
    options.sort(() => Math.random() - 0.5);

    const newFoods: FoodItem[] = [];
    options.forEach((opt, idx) => {
      const pos = getRandomFreeCell(currentSnake, newFoods);
      newFoods.push({
        id: `math_${idx}_${Date.now()}`,
        x: pos.x,
        y: pos.y,
        label: `${opt}`,
        emoji: '', // Chỉ hiển thị con số to rõ
        value: opt,
        isTarget: opt === answer,
        color: opt === answer ? '#10B981' : '#3B82F6',
      });
    });
    setFoods(newFoods);
  };

  // 2. Khởi tạo màn chơi Ghép vần: Chỉ hiện chữ cái to rõ ràng
  const setupSpellingRound = (currentSnake: Position[], wordIdx: number, stepIdx: number) => {
    const currentWord = SPELLING_WORDS[wordIdx % SPELLING_WORDS.length];
    const targetLetter = currentWord.letters[stepIdx];

    soundManager.speak(`Hãy ăn chữ cái ${targetLetter} để ghép từ ${currentWord.word}`);

    // Rải tất cả các chữ cái trong từ + một số chữ nhiễu
    const newFoods: FoodItem[] = [];
    currentWord.letters.forEach((letter, idx) => {
      const pos = getRandomFreeCell(currentSnake, newFoods);
      newFoods.push({
        id: `spell_${idx}_${Date.now()}`,
        x: pos.x,
        y: pos.y,
        label: letter,
        emoji: '', // Chỉ hiển thị chữ cái to rõ
        value: letter,
        isTarget: letter === targetLetter && idx === stepIdx,
        color: letter === targetLetter ? '#EC4899' : '#6366F1',
      });
    });
    setFoods(newFoods);
  };

  // 3. Khởi tạo màn chơi Hình khối
  const setupShapesRound = (currentSnake: Position[]) => {
    const target = SHAPES_LIST[Math.floor(Math.random() * SHAPES_LIST.length)];
    setTargetShape(target);
    soundManager.speak(`Hãy ăn ${target.label} ${target.emoji}`);

    const newFoods: FoodItem[] = [];
    for (let i = 0; i < 4; i++) {
      const isTarget = i < 2;
      const shape = isTarget
        ? target
        : SHAPES_LIST.filter((s) => s.id !== target.id)[Math.floor(Math.random() * (SHAPES_LIST.length - 1))];
      const pos = getRandomFreeCell(currentSnake, newFoods);
      newFoods.push({
        id: `shape_${i}_${Date.now()}`,
        x: pos.x,
        y: pos.y,
        label: '',
        emoji: shape.emoji,
        value: shape.id,
        isTarget,
        color: shape.color,
      });
    }
    setFoods(newFoods);
  };

  // 4. Khởi tạo màn chơi Trái cây cổ điển
  const setupFruitsRound = (currentSnake: Position[]) => {
    const newFoods: FoodItem[] = [];
    for (let i = 0; i < 3; i++) {
      const fruit = FRUITS_LIST[Math.floor(Math.random() * FRUITS_LIST.length)];
      const pos = getRandomFreeCell(currentSnake, newFoods);
      newFoods.push({
        id: `fruit_${i}_${Date.now()}`,
        x: pos.x,
        y: pos.y,
        label: fruit.name,
        emoji: fruit.emoji,
        value: fruit.points,
        isTarget: true,
        color: fruit.color,
      });
    }
    setFoods(newFoods);
  };

  // Bắt đầu game
  const startGame = (mode: SnakeMode) => {
    const initialSnake: Position[] = [
      { x: 5, y: 4 },
      { x: 4, y: 4 },
      { x: 3, y: 4 },
    ];
    setSnake(initialSnake);
    setDirection('RIGHT');
    setGameMode(mode);
    setScore(0);
    setStreak(0);
    setStars(0);
    setIsPlaying(true);
    setIsPaused(false);
    setIsVictoryModalVisible(false);

    if (mode === 'math') {
      setupMathRound(initialSnake);
    } else if (mode === 'spelling') {
      setSpellingIndex(0);
      setSpellingLetterStep(0);
      setupSpellingRound(initialSnake, 0, 0);
    } else if (mode === 'shapes') {
      setupShapesRound(initialSnake);
    } else {
      setupFruitsRound(initialSnake);
    }
  };

  // Thay đổi hướng di chuyển
  const changeDirection = (newDir: Direction) => {
    const currentDir = stateRef.current.direction;
    if (newDir === 'UP' && currentDir === 'DOWN') return;
    if (newDir === 'DOWN' && currentDir === 'UP') return;
    if (newDir === 'LEFT' && currentDir === 'RIGHT') return;
    if (newDir === 'RIGHT' && currentDir === 'LEFT') return;
    setDirection(newDir);
    stateRef.current.direction = newDir;
  };

  // Game Loop chính
  useEffect(() => {
    if (!isPlaying || isPaused) return;

    const intervalMs = speed === 'slow' ? 260 : speed === 'normal' ? 180 : 120;
    const interval = setInterval(() => {
      const {
        snake: curSnake,
        direction: curDir,
        foods: curFoods,
        gameMode: curMode,
        isWrapWalls: curWrap,
        currentMathQuestion: curMath,
        spellingIndex: curSpellIdx,
        spellingLetterStep: curSpellStep,
        targetShape: curShape,
        score: curScore,
        streak: curStreak,
        stars: curStars,
      } = stateRef.current;

      const head = curSnake[0];
      let newHead: Position = { ...head };

      if (curDir === 'UP') newHead.y -= 1;
      if (curDir === 'DOWN') newHead.y += 1;
      if (curDir === 'LEFT') newHead.x -= 1;
      if (curDir === 'RIGHT') newHead.x += 1;

      // Xử lý đâm tường hoặc Xuyên tường
      if (curWrap) {
        if (newHead.x < 0) newHead.x = GRID_COLS - 1;
        if (newHead.x >= GRID_COLS) newHead.x = 0;
        if (newHead.y < 0) newHead.y = GRID_ROWS - 1;
        if (newHead.y >= GRID_ROWS) newHead.y = 0;
      } else {
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_COLS ||
          newHead.y < 0 ||
          newHead.y >= GRID_ROWS
        ) {
          // Va vào tường -> Rung nhẹ và lùi lại an toàn
          showToast('💥 Ouch! Rắn vừa chạm tường, hãy quay đầu nhé!');
          soundManager.speak('Cẩn thận chạm tường bé ơi!');
          return;
        }
      }

      // Kiểm tra ăn thức ăn
      const eatenFoodIndex = curFoods.findIndex(
        (f) => f.x === newHead.x && f.y === newHead.y
      );

      let newSnake = [newHead, ...curSnake];

      if (eatenFoodIndex !== -1) {
        const eaten = curFoods[eatenFoodIndex];

        if (curMode === 'math') {
          if (eaten.isTarget) {
            // Đúng đáp án toán học!
            const newScore = curScore + 15;
            const newStreak = curStreak + 1;
            const newStars = curStars + 1;
            setScore(newScore);
            setStreak(newStreak);
            setStars(newStars);
            showToast(`🎉 Chính xác! Đáp án là ${eaten.label}!`);
            soundManager.play(
              'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
              'Đúng rồi! Bé giỏi quá!'
            );

            if (newStars >= 6) {
              handleWin();
              return;
            }
            setupMathRound(newSnake);
          } else {
            // Ăn sai đáp án
            showToast(`Chưa đúng rồi! ${curMath?.text}`);
            soundManager.speak('Chưa đúng rồi bé ơi!');
            // Không tăng chiều dài
            newSnake.pop();
          }
        } else if (curMode === 'spelling') {
          const currentWord = SPELLING_WORDS[curSpellIdx % SPELLING_WORDS.length];
          if (eaten.isTarget) {
            const nextStep = curSpellStep + 1;
            setScore(curScore + 10);
            setStreak(curStreak + 1);

            if (nextStep >= currentWord.letters.length) {
              // Hoàn thành từ vựng!
              const newStars = curStars + 1;
              setStars(newStars);
              showToast(`🌟 Giỏi quá! Ghép thành công từ ${currentWord.word} ${currentWord.emoji}!`);
              soundManager.speak(`Chúc mừng bé đã ghép xong từ ${currentWord.word}`);

              if (newStars >= 5) {
                handleWin();
                return;
              }
              const nextWordIdx = curSpellIdx + 1;
              setSpellingIndex(nextWordIdx);
              setSpellingLetterStep(0);
              setupSpellingRound(newSnake, nextWordIdx, 0);
            } else {
              setSpellingLetterStep(nextStep);
              showToast(`✓ Đã ăn chữ ${eaten.label}!`);
              setupSpellingRound(newSnake, curSpellIdx, nextStep);
            }
          } else {
            showToast(`Hãy tìm chữ ${currentWord.letters[curSpellStep]} bé nhé!`);
            soundManager.speak(`Hãy tìm chữ ${currentWord.letters[curSpellStep]}`);
            newSnake.pop();
          }
        } else if (curMode === 'shapes') {
          if (eaten.isTarget) {
            setScore(curScore + 12);
            setStreak(curStreak + 1);
            const newStars = curStars + 1;
            setStars(newStars);
            showToast(`⭐ Giỏi quá! Đúng ${curShape.label}!`);
            soundManager.speak(`Đúng rồi! ${curShape.label}`);

            if (newStars >= 6) {
              handleWin();
              return;
            }
            setupShapesRound(newSnake);
          } else {
            showToast(`Hãy tìm ăn ${curShape.label} nhé!`);
            newSnake.pop();
          }
        } else {
          // Trái cây tự do
          setScore(curScore + (eaten.value || 10));
          setStreak(curStreak + 1);
          showToast(`Ngoạm! 😋 ${eaten.label} +${eaten.value} điểm!`);
          setupFruitsRound(newSnake);
        }
      } else {
        // Không ăn trúng thì cắt đuôi để rắn giữ nguyên độ dài
        newSnake.pop();
      }

      setSnake(newSnake);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isPlaying, isPaused, speed]);

  // Thắng màn chơi
  const handleWin = () => {
    setIsPlaying(false);
    setIsVictoryModalVisible(true);
    soundManager.speak('Chúc mừng bé đã chiến thắng trò chơi rắn săn mồi thông minh!');
    Animated.spring(victoryScale, {
      toValue: 1,
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  // Khởi động khi mở màn hình
  useEffect(() => {
    startGame('math');
  }, []);

  // Xử lý vuốt màn hình (Swipe Gestures)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, gestureState) => {
        const { dx, dy } = gestureState;
        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > 20) changeDirection('RIGHT');
          else if (dx < -20) changeDirection('LEFT');
        } else {
          if (dy > 20) changeDirection('DOWN');
          else if (dy < -20) changeDirection('UP');
        }
      },
    })
  ).current;

  // Tính toán kích thước ô lưới
  const boardWidth = Math.min(width - 24, 460);
  const boardHeight = (boardWidth / GRID_COLS) * GRID_ROWS;
  const cellSize = boardWidth / GRID_COLS;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1B4B" />

      {/* HEADER: Tiêu đề & Thông số */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>🐍 Rắn Săn Mồi Thông Minh</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statBadge}>⭐ {score} điểm</Text>
            <Text style={styles.statBadge}>🔥 Combo {streak}</Text>
            <Text style={styles.statBadge}>🌟 Thu thập {stars}/6</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.pauseBtn}
          onPress={() => setIsPaused((prev) => !prev)}
          activeOpacity={0.8}
        >
          <Text style={styles.pauseIcon}>{isPaused ? '▶' : '⏸'}</Text>
        </TouchableOpacity>
      </View>

      {/* THANH CHỌN 4 CHẾ ĐỘ GIÁO DỤC (GRID ITEMS ĐỀU NHAU) */}
      <View style={styles.modeGridContainer}>
        {[
          { id: 'math', label: 'Làm Toán', icon: '🔢', color: '#EC4899' },
          { id: 'spelling', label: 'Ghép Từ', icon: '🔤', color: '#10B981' },
          { id: 'shapes', label: 'Hình Khối', icon: '🎨', color: '#3B82F6' },
          { id: 'fruits', label: 'Trái Cây', icon: '🍎', color: '#F59E0B' },
        ].map((m) => {
          const isSelected = gameMode === m.id;
          return (
            <TouchableOpacity
              key={m.id}
              style={[
                styles.modeGridCard,
                isSelected && { backgroundColor: m.color, borderColor: '#FFFFFF', elevation: 5 },
              ]}
              onPress={() => startGame(m.id as SnakeMode)}
              activeOpacity={0.8}
            >
              <Text style={styles.modeGridIcon}>{m.icon}</Text>
              <Text
                style={[styles.modeGridText, isSelected && styles.modeGridTextActive]}
                numberOfLines={1}
              >
                {m.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* NHIỆM VỤ ĐANG THỰC HIỆN BANNER */}
      <View style={styles.missionBanner}>
        {gameMode === 'math' && currentMathQuestion && (
          <Text style={styles.missionText}>
            🎯 Nhiệm vụ: Hãy tìm ăn quả trứng có số{' '}
            <Text style={styles.missionHighlight}>{currentMathQuestion.text}</Text>
          </Text>
        )}
        {gameMode === 'spelling' && (
          <Text style={styles.missionText}>
            🎯 Ghép từ: {SPELLING_WORDS[spellingIndex % SPELLING_WORDS.length].emoji}{' '}
            <Text style={styles.missionHighlight}>
              {SPELLING_WORDS[spellingIndex % SPELLING_WORDS.length].word}
            </Text>{' '}
            (Tìm ăn chữ: <Text style={styles.missionTargetLetter}>
              {SPELLING_WORDS[spellingIndex % SPELLING_WORDS.length].letters[spellingLetterStep]}
            </Text>)
          </Text>
        )}
        {gameMode === 'shapes' && (
          <Text style={styles.missionText}>
            🎯 Nhiệm vụ: Hãy tìm ăn{' '}
            <Text style={styles.missionHighlight}>
              {targetShape.label} {targetShape.emoji}
            </Text>
          </Text>
        )}
        {gameMode === 'fruits' && (
          <Text style={styles.missionText}>
            🎯 Hãy ăn thật nhiều trái cây ngon bổ dưỡng để lớn lên nhé! 🌈
          </Text>
        )}
      </View>

      {/* KHÔNG GIAN BÀN CỜ GAME (GRID PLAYGROUND) */}
      <View style={styles.gameAreaWrapper} {...panResponder.panHandlers}>
        {/* Toast thông báo */}
        {toastMessage !== '' && (
          <View style={styles.toastBadge}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}

        <View
          style={[
            styles.gameBoard,
            { width: boardWidth, height: boardHeight },
          ]}
        >
          {/* Lưới nền ô cờ mờ */}
          <View style={styles.gridOverlay}>
            {Array.from({ length: GRID_ROWS }).map((_, rIdx) => (
              <View key={`row_${rIdx}`} style={styles.gridRow}>
                {Array.from({ length: GRID_COLS }).map((_, cIdx) => (
                  <View
                    key={`cell_${rIdx}_${cIdx}`}
                    style={[
                      styles.gridCell,
                      {
                        width: cellSize,
                        height: cellSize,
                        backgroundColor:
                          (rIdx + cIdx) % 2 === 0 ? '#1E293B' : '#0F172A',
                      },
                    ]}
                  />
                ))}
              </View>
            ))}
          </View>

          {/* CÁC MỤC THỨC ĂN (CHỈ LÀ CON SỐ / CHỮ CÁI TO RÕ RÀNG) */}
          {foods.map((f) => {
            const isTextOnly = f.emoji === '' || !f.emoji;

            return (
              <View
                key={f.id}
                style={[
                  styles.foodItem,
                  {
                    left: f.x * cellSize,
                    top: f.y * cellSize,
                    width: cellSize,
                    height: cellSize,
                  },
                ]}
              >
                <View
                  style={[
                    styles.foodBubble,
                    {
                      backgroundColor: f.color || '#F59E0B',
                      borderRadius: isTextOnly ? cellSize / 2 : 12,
                    },
                  ]}
                >
                  {isTextOnly ? (
                    <Text style={styles.foodNumberText}>{f.label}</Text>
                  ) : (
                    <Text style={styles.foodEmoji}>{f.emoji}</Text>
                  )}
                </View>
              </View>
            );
          })}

          {/* THÂN VÀ ĐẦU RẮN CẦU VỒNG */}
          {snake.map((segment, idx) => {
            const isHead = idx === 0;
            const bodyColor =
              RAINBOW_BODY_COLORS[idx % RAINBOW_BODY_COLORS.length];

            return (
              <View
                key={`snake_${idx}`}
                style={[
                  styles.snakeSegment,
                  {
                    left: segment.x * cellSize + 1,
                    top: segment.y * cellSize + 1,
                    width: cellSize - 2,
                    height: cellSize - 2,
                    borderRadius: isHead ? cellSize / 2 : 6,
                    backgroundColor: isHead ? '#22C55E' : bodyColor,
                    borderColor: isHead ? '#86EFAC' : '#FFFFFF',
                    borderWidth: isHead ? 2 : 1,
                    zIndex: isHead ? 10 : 5,
                  },
                ]}
              >
                {isHead && (
                  <View style={styles.snakeHeadFace}>
                    <Text style={styles.snakeEye}>👀</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* D-PAD ĐIỀU HƯỚNG 4 CHIỀU TO BẢN CHO BÉ */}
      <View style={styles.controlsRow}>
        {/* Nút tốc độ và Xuyên tường */}
        <View style={styles.optionToggles}>
          <TouchableOpacity
            style={styles.toggleBtn}
            onPress={() =>
              setSpeed((prev) =>
                prev === 'slow' ? 'normal' : prev === 'normal' ? 'fast' : 'slow'
              )
            }
            activeOpacity={0.8}
          >
            <Text style={styles.toggleText}>
              {speed === 'slow' ? '🐢 Rùa' : speed === 'normal' ? '🐇 Thỏ' : '🐆 Báo'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleBtn, isWrapWalls && styles.toggleBtnActive]}
            onPress={() => setIsWrapWalls((prev) => !prev)}
            activeOpacity={0.8}
          >
            <Text style={styles.toggleText}>
              {isWrapWalls ? '🌀 Xuyên Tường' : '🧱 Có Tường'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Cụm 4 phím D-Pad */}
        <View style={styles.dpadContainer}>
          <TouchableOpacity
            style={[styles.dpadBtn, styles.dpadUp]}
            onPress={() => changeDirection('UP')}
            activeOpacity={0.6}
          >
            <Text style={styles.dpadArrow}>▲</Text>
          </TouchableOpacity>

          <View style={styles.dpadMiddleRow}>
            <TouchableOpacity
              style={[styles.dpadBtn, styles.dpadLeft]}
              onPress={() => changeDirection('LEFT')}
              activeOpacity={0.6}
            >
              <Text style={styles.dpadArrow}>◀</Text>
            </TouchableOpacity>

            <View style={styles.dpadCenter} />

            <TouchableOpacity
              style={[styles.dpadBtn, styles.dpadRight]}
              onPress={() => changeDirection('RIGHT')}
              activeOpacity={0.6}
            >
              <Text style={styles.dpadArrow}>▶</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.dpadBtn, styles.dpadDown]}
            onPress={() => changeDirection('DOWN')}
            activeOpacity={0.6}
          >
            <Text style={styles.dpadArrow}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* POPUP CHIẾN THẮNG */}
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
            <Text style={styles.victoryTrophy}>🏆 🐍 🌟</Text>
            <Text style={styles.victoryTitle}>BÉ GIỎI XUẤT SẮC!</Text>
            <Text style={styles.victorySubtitle}>
              Chú rắn thông minh đã hoàn thành xuất sắc các thử thách học tập!
            </Text>

            <View style={styles.victoryScoreBox}>
              <Text style={styles.finalScore}>⭐ {score} Điểm Thưởng</Text>
              <Text style={styles.finalStreak}>Chuỗi xuất sắc: {streak} lần</Text>
            </View>

            <View style={styles.victoryActions}>
              <TouchableOpacity
                style={styles.victoryPlayAgainBtn}
                onPress={() => startGame(gameMode)}
                activeOpacity={0.85}
              >
                <Text style={styles.victoryPlayAgainText}>🔄 Chơi Lại Màn Này</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#0A0E1A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#1E1B4B',
    borderBottomWidth: 1.5,
    borderBottomColor: '#312E81',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FBBF24',
    fontSize: 17,
    fontWeight: '900',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 2,
    gap: 6,
  },
  statBadge: {
    color: '#E0E7FF',
    fontSize: 11,
    fontWeight: '700',
    backgroundColor: '#312E81',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pauseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseIcon: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  /* CHỌN CHẾ ĐỘ GRID */
  modeGridContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#16143A',
    borderBottomWidth: 1.5,
    borderBottomColor: '#2E2A68',
    gap: 6,
  },
  modeGridCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#231F53',
    borderWidth: 1.5,
    borderColor: '#4338CA',
    gap: 4,
  },
  modeGridIcon: {
    fontSize: 14,
  },
  modeGridText: {
    color: '#C7D2FE',
    fontSize: 11,
    fontWeight: '800',
  },
  modeGridTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },

  /* MISSION BANNER */
  missionBanner: {
    backgroundColor: '#1E1B4B',
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#312E81',
  },
  missionText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
  },
  missionHighlight: {
    color: '#FBBF24',
    fontWeight: '900',
    fontSize: 14,
  },
  missionTargetLetter: {
    color: '#EC4899',
    fontWeight: '900',
    fontSize: 16,
    backgroundColor: '#312E81',
    paddingHorizontal: 6,
    borderRadius: 6,
  },

  /* BÀN CỜ */
  gameAreaWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  gameBoard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#38BDF8',
    backgroundColor: '#0F172A',
    position: 'relative',
    elevation: 8,
    shadowColor: '#38BDF8',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    borderWidth: 0.2,
    borderColor: 'rgba(255,255,255,0.03)',
  },

  /* THỨC ĂN */
  foodItem: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 6,
  },
  foodBubble: {
    width: '92%',
    height: '92%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  foodNumberText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  foodEmoji: {
    fontSize: 20,
  },

  /* RẮN */
  snakeSegment: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  snakeHeadFace: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  snakeEye: {
    fontSize: 12,
  },

  /* ĐIỀU KHIỂN D-PAD */
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'android' ? 24 : 10,
    paddingTop: 4,
  },
  optionToggles: {
    gap: 8,
  },
  toggleBtn: {
    backgroundColor: '#1E1B4B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#4338CA',
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: '#059669',
    borderColor: '#34D399',
  },
  toggleText: {
    color: '#E0E7FF',
    fontSize: 11,
    fontWeight: '800',
  },
  dpadContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 110,
  },
  dpadMiddleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: -4,
  },
  dpadBtn: {
    width: 44,
    height: 38,
    backgroundColor: '#3730A3',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#6366F1',
    elevation: 4,
  },
  dpadCenter: {
    width: 20,
    height: 20,
  },
  dpadUp: {
    marginBottom: 2,
  },
  dpadDown: {
    marginTop: 2,
  },
  dpadLeft: {
    marginRight: 2,
  },
  dpadRight: {
    marginLeft: 2,
  },
  dpadArrow: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  /* TOAST */
  toastBadge: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    zIndex: 99,
    borderWidth: 1.5,
    borderColor: '#EC4899',
  },
  toastText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
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
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 380,
    borderWidth: 3,
    borderColor: '#F59E0B',
  },
  victoryTrophy: {
    fontSize: 56,
    marginBottom: 10,
  },
  victoryTitle: {
    color: '#FBBF24',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 6,
  },
  victorySubtitle: {
    color: '#E2E8F0',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  victoryScoreBox: {
    backgroundColor: '#312E81',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  finalScore: {
    color: '#FBBF24',
    fontSize: 20,
    fontWeight: '900',
  },
  finalStreak: {
    color: '#A5B4FC',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  victoryActions: {
    width: '100%',
    gap: 10,
  },
  victoryPlayAgainBtn: {
    backgroundColor: '#EC4899',
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: 'center',
  },
  victoryPlayAgainText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '900',
  },
  victoryCloseBtn: {
    backgroundColor: '#3730A3',
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: 'center',
  },
  victoryCloseText: {
    color: '#CBD5E1',
    fontSize: 15,
    fontWeight: '800',
  },
});

export default SnakeEduGameScreen;
