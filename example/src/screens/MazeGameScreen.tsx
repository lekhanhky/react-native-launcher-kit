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

interface MazeGameScreenProps {
  theme?: ThemeConfig;
  onClose: () => void;
}

export type MazeDifficulty = 'easy' | 'medium' | 'hard';

export interface MazeTheme {
  id: string;
  name: string;
  playerEmoji: string;
  goalEmoji: string;
  collectEmoji: string;
  wallColor: string;
  pathColor: string;
  trailColor: string;
  bgGradient: string;
  story: string;
}

export interface Cell {
  row: number;
  col: number;
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
  visited: boolean;
  hasStar?: boolean;
}

export const MAZE_THEMES: MazeTheme[] = [
  {
    id: 'bunny',
    name: 'Thỏ Con Tìm Cà Rốt',
    playerEmoji: '🐰',
    goalEmoji: '🥕',
    collectEmoji: '⭐',
    wallColor: '#15803D',
    pathColor: '#DCFCE7',
    trailColor: '#86EFAC',
    bgGradient: '#064E3B',
    story: 'Bé hãy dẫn đường cho chú Thỏ nhỏ tìm về củ cà rốt ngon lành nhé!',
  },
  {
    id: 'kitty',
    name: 'Mèo Con Tìm Đĩa Cá',
    playerEmoji: '🐱',
    goalEmoji: '🐟',
    collectEmoji: '🧶',
    wallColor: '#C2410C',
    pathColor: '#FFEDD5',
    trailColor: '#FDBA74',
    bgGradient: '#7C2D12',
    story: 'Chú mèo con đang đói bụng, bé hãy giúp mèo vượt mê cung tìm cá nhé!',
  },
  {
    id: 'space',
    name: 'Phi Thuyền Về Trái Đất',
    playerEmoji: '🚀',
    goalEmoji: '🌍',
    collectEmoji: '✨',
    wallColor: '#4338CA',
    pathColor: '#EEF2FF',
    trailColor: '#A5B4FC',
    bgGradient: '#1E1B4B',
    story: 'Tàu vũ trụ thám hiểm đang tìm đường quay về với Trái Đất xinh đẹp!',
  },
  {
    id: 'duckling',
    name: 'Vịt Con Về Với Mẹ',
    playerEmoji: '🐥',
    goalEmoji: '🦆',
    collectEmoji: '🪷',
    wallColor: '#0369A1',
    pathColor: '#E0F2FE',
    trailColor: '#7DD3FC',
    bgGradient: '#0C4A6E',
    story: 'Chú vịt con lạc đường bơi qua đầm sen để trở về vòng tay vịt mẹ!',
  },
];

// Thuật toán DFS Recursive Backtracker tạo mê cung hoàn hảo (Perfect Maze)
function generateMaze(rows: number, cols: number): { grid: Cell[][]; stars: { r: number; c: number }[] } {
  const grid: Cell[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        walls: { top: true, right: true, bottom: true, left: true },
        visited: false,
      });
    }
    grid.push(row);
  }

  const stack: [number, number][] = [];
  grid[0][0].visited = true;
  stack.push([0, 0]);

  while (stack.length > 0) {
    const [currR, currC] = stack[stack.length - 1];
    const neighbors: { r: number; c: number; dir: 'top' | 'right' | 'bottom' | 'left' }[] = [];

    // Top
    if (currR > 0 && !grid[currR - 1][currC].visited) {
      neighbors.push({ r: currR - 1, c: currC, dir: 'top' });
    }
    // Right
    if (currC < cols - 1 && !grid[currR][currC + 1].visited) {
      neighbors.push({ r: currR, c: currC + 1, dir: 'right' });
    }
    // Bottom
    if (currR < rows - 1 && !grid[currR + 1][currC].visited) {
      neighbors.push({ r: currR + 1, c: currC, dir: 'bottom' });
    }
    // Left
    if (currC > 0 && !grid[currR][currC - 1].visited) {
      neighbors.push({ r: currR, c: currC - 1, dir: 'left' });
    }

    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      // Xóa tường giữa ô hiện tại và ô kế tiếp
      if (next.dir === 'top') {
        grid[currR][currC].walls.top = false;
        grid[next.r][next.c].walls.bottom = false;
      } else if (next.dir === 'right') {
        grid[currR][currC].walls.right = false;
        grid[next.r][next.c].walls.left = false;
      } else if (next.dir === 'bottom') {
        grid[currR][currC].walls.bottom = false;
        grid[next.r][next.c].walls.top = false;
      } else if (next.dir === 'left') {
        grid[currR][currC].walls.left = false;
        grid[next.r][next.c].walls.right = false;
      }

      grid[next.r][next.c].visited = true;
      stack.push([next.r, next.c]);
    } else {
      stack.pop();
    }
  }

  // Đặt ngẫu nhiên 3 ngôi sao thưởng trên đường đi
  const stars: { r: number; c: number }[] = [];
  const starCount = rows <= 5 ? 2 : rows <= 7 ? 3 : 4;
  while (stars.length < starCount) {
    const sr = Math.floor(Math.random() * rows);
    const sc = Math.floor(Math.random() * cols);
    // Tránh vị trí xuất phát (0,0) và đích (rows-1, cols-1)
    if (
      (sr !== 0 || sc !== 0) &&
      (sr !== rows - 1 || sc !== cols - 1) &&
      !stars.some((s) => s.r === sr && s.c === sc)
    ) {
      stars.push({ r: sr, c: sc });
      grid[sr][sc].hasStar = true;
    }
  }

  return { grid, stars };
}

// Thuật toán BFS tìm đường ngắn nhất để đưa ra Gợi ý (Hint)
function findShortestPath(
  grid: Cell[][],
  rows: number,
  cols: number,
  start: { r: number; c: number },
  goal: { r: number; c: number }
): { r: number; c: number }[] {
  const queue: { r: number; c: number; path: { r: number; c: number }[] }[] = [
    { r: start.r, c: start.c, path: [start] },
  ];
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  visited[start.r][start.c] = true;

  while (queue.length > 0) {
    const { r, c, path } = queue.shift()!;
    if (r === goal.r && c === goal.c) {
      return path;
    }

    const cell = grid[r][c];
    // Đi lên
    if (!cell.walls.top && r > 0 && !visited[r - 1][c]) {
      visited[r - 1][c] = true;
      queue.push({ r: r - 1, c, path: [...path, { r: r - 1, c }] });
    }
    // Đi phải
    if (!cell.walls.right && c < cols - 1 && !visited[r][c + 1]) {
      visited[r][c + 1] = true;
      queue.push({ r, c: c + 1, path: [...path, { r, c: c + 1 }] });
    }
    // Đi xuống
    if (!cell.walls.bottom && r < rows - 1 && !visited[r + 1][c]) {
      visited[r + 1][c] = true;
      queue.push({ r: r + 1, c, path: [...path, { r: r + 1, c }] });
    }
    // Đi trái
    if (!cell.walls.left && c > 0 && !visited[r][c - 1]) {
      visited[r][c - 1] = true;
      queue.push({ r, c: c - 1, path: [...path, { r, c: c - 1 }] });
    }
  }
  return [];
}

export const MazeGameScreen: React.FC<MazeGameScreenProps> = ({ onClose }) => {
  const { width } = useWindowDimensions();

  // Chủ đề và cấp độ
  const [currentTheme, setCurrentTheme] = useState<MazeTheme>(MAZE_THEMES[0]);
  const [difficulty, setDifficulty] = useState<MazeDifficulty>('easy');

  // Kích thước mê cung theo độ khó
  const rows = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 7 : 9;
  const cols = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 7 : 9;

  // Dữ liệu mê cung
  const [mazeGrid, setMazeGrid] = useState<Cell[][]>([]);
  const [playerPos, setPlayerPos] = useState<{ r: number; c: number }>({ r: 0, c: 0 });
  const [goalPos, setGoalPos] = useState<{ r: number; c: number }>({ r: rows - 1, c: cols - 1 });
  const [trail, setTrail] = useState<{ [key: string]: boolean }>({ '0_0': true });
  const [collectedStars, setCollectedStars] = useState<number>(0);
  const [totalStars, setTotalStars] = useState<number>(0);

  // Trạng thái chơi & Thống kê
  const [stepCount, setStepCount] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [hintSteps, setHintSteps] = useState<{ [key: string]: boolean }>({});
  const [feedbackToast, setFeedbackToast] = useState<string>('');

  // Animations
  const playerAnim = useRef(new Animated.Value(1)).current;
  const victoryScale = useRef(new Animated.Value(0.3)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Thông báo nhỏ
  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(''), 1800);
  };

  // 1. Tạo màn chơi mới
  const startNewMaze = useCallback((diff: MazeDifficulty, theme: MazeTheme) => {
    const r = diff === 'easy' ? 5 : diff === 'medium' ? 7 : 9;
    const c = diff === 'easy' ? 5 : diff === 'medium' ? 7 : 9;

    const { grid, stars } = generateMaze(r, c);
    setMazeGrid(grid);
    setPlayerPos({ r: 0, c: 0 });
    setGoalPos({ r: r - 1, c: c - 1 });
    setTrail({ '0_0': true });
    setCollectedStars(0);
    setTotalStars(stars.length);
    setStepCount(0);
    setTimerSeconds(0);
    setIsVictory(false);
    setHintSteps({});
  }, []);

  useEffect(() => {
    startNewMaze(difficulty, currentTheme);
  }, [difficulty, currentTheme, startNewMaze]);

  // 2. Đếm thời gian chơi
  useEffect(() => {
    let interval: any = null;
    if (!isVictory) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isVictory]);

  // Hiệu ứng bước đi nảy nhẹ
  const triggerStepAnim = () => {
    Animated.sequence([
      Animated.timing(playerAnim, { toValue: 1.25, duration: 80, useNativeDriver: true }),
      Animated.timing(playerAnim, { toValue: 1, duration: 90, useNativeDriver: true }),
    ]).start();
  };

  // Rung khi đâm vào tường
  const triggerWallHitAnim = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  // 3. Xử lý di chuyển theo 4 hướng
  const movePlayer = useCallback((dir: 'up' | 'right' | 'down' | 'left') => {
    if (isVictory || mazeGrid.length === 0) return;

    const { r, c } = playerPos;
    const currentCell = mazeGrid[r][c];

    let targetR = r;
    let targetC = c;
    let isBlocked = false;

    if (dir === 'up') {
      if (currentCell.walls.top || r === 0) isBlocked = true;
      else targetR = r - 1;
    } else if (dir === 'right') {
      if (currentCell.walls.right || c === cols - 1) isBlocked = true;
      else targetC = c + 1;
    } else if (dir === 'down') {
      if (currentCell.walls.bottom || r === rows - 1) isBlocked = true;
      else targetR = r + 1;
    } else if (dir === 'left') {
      if (currentCell.walls.left || c === 0) isBlocked = true;
      else targetC = c - 1;
    }

    if (isBlocked) {
      triggerWallHitAnim();
      showToast('🚧 Có tường chặn rồi bé ơi!');
      return;
    }

    // Di chuyển thành công
    triggerStepAnim();
    setStepCount((prev) => prev + 1);
    setPlayerPos({ r: targetR, c: targetC });
    setTrail((prev) => ({ ...prev, [`${targetR}_${targetC}`]: true }));

    // Kiểm tra thu thập sao
    if (mazeGrid[targetR][targetC].hasStar) {
      const updatedGrid = [...mazeGrid];
      updatedGrid[targetR][targetC].hasStar = false;
      setMazeGrid(updatedGrid);
      setCollectedStars((prev) => prev + 1);
      showToast(`⭐ Nhặt được ngôi sao lấp lánh!`);
    }

    // Kiểm tra về đích!
    if (targetR === goalPos.r && targetC === goalPos.c) {
      setIsVictory(true);
      Animated.spring(victoryScale, {
        toValue: 1,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      }).start();
    }
  }, [playerPos, mazeGrid, rows, cols, goalPos, isVictory, victoryScale]);

  // 4. Vuốt ngón tay trực tiếp trên mê cung (Swipe PanResponder)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 10 || Math.abs(gesture.dy) > 10,
      onPanResponderRelease: (_, gesture) => {
        const { dx, dy } = gesture;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);

        if (Math.max(absX, absY) > 20) {
          if (absX > absY) {
            // Ngang
            if (dx > 0) movePlayer('right');
            else movePlayer('left');
          } else {
            // Dọc
            if (dy > 0) movePlayer('down');
            else movePlayer('up');
          }
        }
      },
    })
  ).current;

  // 5. Tính toán Gợi ý đường đi tiếp theo
  const handleShowHint = () => {
    if (mazeGrid.length === 0 || isVictory) return;
    const path = findShortestPath(mazeGrid, rows, cols, playerPos, goalPos);
    if (path.length > 1) {
      const hintMap: { [key: string]: boolean } = {};
      // Lấy tối đa 4 bước tiếp theo
      path.slice(1, 5).forEach((p) => {
        hintMap[`${p.r}_${p.c}`] = true;
      });
      setHintSteps(hintMap);
      showToast('💡 La bàn thần kỳ đã chỉ đường cho bé!');
    }
  };

  // Tính toán kích thước ô lưới phù hợp với màn hình
  const mazeBoardSize = Math.min(width - 32, 340);
  const cellSize = mazeBoardSize / cols;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.bgGradient }]}>
      <StatusBar barStyle="light-content" backgroundColor={currentTheme.bgGradient} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={onClose}>
          <Text style={styles.backBtnText}>⬅ Thoát</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>🌀 Mê Cung Kỳ Thú</Text>
          <Text style={styles.headerSubtitle}>{currentTheme.name}</Text>
        </View>

        <TouchableOpacity style={styles.hintBtn} activeOpacity={0.8} onPress={handleShowHint}>
          <Text style={styles.hintBtnText}>💡 Chỉ Đường</Text>
        </TouchableOpacity>
      </View>

      {/* THANH CHỌN CHỦ ĐỀ VÀ ĐỘ KHÓ */}
      <View style={styles.configBar}>
        {/* Chọn Độ Khó */}
        <View style={styles.diffRow}>
          <TouchableOpacity
            style={[styles.diffBtn, difficulty === 'easy' && styles.diffBtnActive]}
            onPress={() => setDifficulty('easy')}
            activeOpacity={0.8}
          >
            <Text style={[styles.diffBtnText, difficulty === 'easy' && styles.diffBtnTextActive]}>
              🌱 Dễ (5x5)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.diffBtn, difficulty === 'medium' && styles.diffBtnActive]}
            onPress={() => setDifficulty('medium')}
            activeOpacity={0.8}
          >
            <Text style={[styles.diffBtnText, difficulty === 'medium' && styles.diffBtnTextActive]}>
              🌿 Vừa (7x7)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.diffBtn, difficulty === 'hard' && styles.diffBtnActive]}
            onPress={() => setDifficulty('hard')}
            activeOpacity={0.8}
          >
            <Text style={[styles.diffBtnText, difficulty === 'hard' && styles.diffBtnTextActive]}>
              🌳 Khó (9x9)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Chọn Nhân Vật & Chủ Đề */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.themeScroll}>
          {MAZE_THEMES.map((thm) => {
            const isSelected = thm.id === currentTheme.id;
            return (
              <TouchableOpacity
                key={thm.id}
                style={[styles.themeChip, isSelected && styles.themeChipActive]}
                onPress={() => setCurrentTheme(thm)}
                activeOpacity={0.8}
              >
                <Text style={styles.themeChipEmoji}>{thm.playerEmoji}</Text>
                <Text style={[styles.themeChipText, isSelected && styles.themeChipTextActive]}>
                  {thm.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* THÔNG TIN TRẠNG THÁI: BƯỚC ĐI, THỜI GIAN, NGÔI SAO */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Bước đi</Text>
          <Text style={styles.statValue}>👣 {stepCount}</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Thời gian</Text>
          <Text style={styles.statValue}>⏱️ {timerSeconds}s</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Ngôi sao</Text>
          <Text style={styles.statValue}>
            ⭐ {collectedStars}/{totalStars}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.refreshMazeBtn}
          activeOpacity={0.8}
          onPress={() => startNewMaze(difficulty, currentTheme)}
        >
          <Text style={styles.refreshMazeText}>🔄 Mê Cung Mới</Text>
        </TouchableOpacity>
      </View>

      {/* THÔNG BÁO TOAST */}
      {feedbackToast !== '' && (
        <View style={styles.toastCard}>
          <Text style={styles.toastText}>{feedbackToast}</Text>
        </View>
      )}

      {/* KHUNG MÊ CUNG CHÍNH */}
      <View style={styles.mazeWrapper} {...panResponder.panHandlers}>
        <Animated.View
          style={[
            styles.mazeBoard,
            {
              width: mazeBoardSize,
              height: mazeBoardSize,
              backgroundColor: currentTheme.pathColor,
              borderColor: currentTheme.wallColor,
              transform: [{ translateX: shakeAnim }],
            },
          ]}
        >
          {mazeGrid.map((row, rIdx) => (
            <View key={`row_${rIdx}`} style={styles.mazeRow}>
              {row.map((cell, cIdx) => {
                const isPlayer = playerPos.r === rIdx && playerPos.c === cIdx;
                const isGoal = goalPos.r === rIdx && goalPos.c === cIdx;
                const isTrail = trail[`${rIdx}_${cIdx}`];
                const isHint = hintSteps[`${rIdx}_${cIdx}`];

                return (
                  <View
                    key={`cell_${rIdx}_${cIdx}`}
                    style={[
                      styles.cellBox,
                      {
                        width: cellSize,
                        height: cellSize,
                        borderTopWidth: cell.walls.top ? 3 : 0,
                        borderRightWidth: cell.walls.right ? 3 : 0,
                        borderBottomWidth: cell.walls.bottom ? 3 : 0,
                        borderLeftWidth: cell.walls.left ? 3 : 0,
                        borderColor: currentTheme.wallColor,
                        backgroundColor: isHint
                          ? '#FEF08A'
                          : isTrail
                          ? currentTheme.trailColor
                          : currentTheme.pathColor,
                      },
                    ]}
                  >
                    {/* DẤU CHÂN HOẶC HIỆU ỨNG GỢI Ý */}
                    {isHint && !isPlayer && !isGoal && (
                      <Text style={styles.hintDot}>💡</Text>
                    )}

                    {/* VẬT PHẨM SAO THƯỞNG */}
                    {cell.hasStar && !isPlayer && !isGoal && (
                      <Text style={[styles.starIcon, { fontSize: cellSize * 0.45 }]}>
                        {currentTheme.collectEmoji}
                      </Text>
                    )}

                    {/* ĐÍCH ĐẾN */}
                    {isGoal && (
                      <View style={styles.goalTargetBox}>
                        <Text style={[styles.goalEmoji, { fontSize: cellSize * 0.65 }]}>
                          {currentTheme.goalEmoji}
                        </Text>
                      </View>
                    )}

                    {/* NHÂN VẬT NGƯỜI CHƠI */}
                    {isPlayer && (
                      <Animated.View
                        style={[
                          styles.playerBox,
                          { transform: [{ scale: playerAnim }] },
                        ]}
                      >
                        <Text style={[styles.playerEmoji, { fontSize: cellSize * 0.7 }]}>
                          {currentTheme.playerEmoji}
                        </Text>
                      </Animated.View>
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </Animated.View>
      </View>

      {/* CỤM PHÍM ĐIỀU HƯỚNG D-PAD VIRTUAL JOYSTICK */}
      <View style={styles.controlsSection}>
        <View style={styles.dpadContainer}>
          {/* NÚT LÊN */}
          <TouchableOpacity
            style={[styles.dpadBtn, styles.dpadUp, { backgroundColor: currentTheme.wallColor }]}
            activeOpacity={0.7}
            onPress={() => movePlayer('up')}
          >
            <Text style={styles.dpadArrow}>⬆️</Text>
          </TouchableOpacity>

          <View style={styles.dpadMiddleRow}>
            {/* NÚT TRÁI */}
            <TouchableOpacity
              style={[styles.dpadBtn, styles.dpadLeft, { backgroundColor: currentTheme.wallColor }]}
              activeOpacity={0.7}
              onPress={() => movePlayer('left')}
            >
              <Text style={styles.dpadArrow}>⬅️</Text>
            </TouchableOpacity>

            {/* TÂM ĐIỀU KHIỂN */}
            <View style={styles.dpadCenter}>
              <Text style={styles.dpadCenterIcon}>🎮</Text>
            </View>

            {/* NÚT PHẢI */}
            <TouchableOpacity
              style={[styles.dpadBtn, styles.dpadRight, { backgroundColor: currentTheme.wallColor }]}
              activeOpacity={0.7}
              onPress={() => movePlayer('right')}
            >
              <Text style={styles.dpadArrow}>➡️</Text>
            </TouchableOpacity>
          </View>

          {/* NÚT XUỐNG */}
          <TouchableOpacity
            style={[styles.dpadBtn, styles.dpadDown, { backgroundColor: currentTheme.wallColor }]}
            activeOpacity={0.7}
            onPress={() => movePlayer('down')}
          >
            <Text style={styles.dpadArrow}>⬇️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MODAL CHIẾN THẮNG & VỀ ĐÍCH */}
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
            <Text style={styles.victoryTrophy}>🏆 🌟 🥕</Text>
            <Text style={styles.victoryTitle}>VỀ ĐÍCH THÀNH CÔNG!</Text>
            <Text style={styles.victorySubtitle}>
              Bé đã xuất sắc dẫn lối cho {currentTheme.playerEmoji} vượt qua mê cung bí ẩn!
            </Text>

            <View style={styles.resultSummary}>
              <View style={styles.resultCol}>
                <Text style={styles.resultColLabel}>Số bước</Text>
                <Text style={styles.resultColVal}>{stepCount} bước</Text>
              </View>
              <View style={styles.resultCol}>
                <Text style={styles.resultColLabel}>Thời gian</Text>
                <Text style={styles.resultColVal}>{timerSeconds} giây</Text>
              </View>
              <View style={styles.resultCol}>
                <Text style={styles.resultColLabel}>Ngôi sao</Text>
                <Text style={styles.resultColVal}>
                  ⭐ {collectedStars}/{totalStars}
                </Text>
              </View>
            </View>

            <View style={styles.victoryActions}>
              <TouchableOpacity
                style={styles.victoryPlayAgainBtn}
                activeOpacity={0.85}
                onPress={() => startNewMaze(difficulty, currentTheme)}
              >
                <Text style={styles.victoryPlayAgainText}>🌀 Chơi Mê Cung Mới</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.victoryNextDiffBtn}
                activeOpacity={0.85}
                onPress={() => {
                  const nextDiff: MazeDifficulty =
                    difficulty === 'easy' ? 'medium' : difficulty === 'medium' ? 'hard' : 'easy';
                  setDifficulty(nextDiff);
                }}
              >
                <Text style={styles.victoryNextDiffText}>
                  ⭐ Thử Thách Mức Khó Hơn
                </Text>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  backBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  backBtnText: {
    color: '#FFFFFF',
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
    color: '#E0E7FF',
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
  configBar: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    gap: 6,
  },
  diffRow: {
    flexDirection: 'row',
    gap: 8,
  },
  diffBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  diffBtnActive: {
    backgroundColor: '#F59E0B',
    borderWidth: 1.5,
    borderColor: '#FEF08A',
  },
  diffBtnText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
  },
  diffBtnTextActive: {
    color: '#78350F',
    fontWeight: '900',
  },
  themeScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  themeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  themeChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#A7F3D0',
  },
  themeChipEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  themeChipText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
  },
  themeChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#C7D2FE',
    fontSize: 10,
    fontWeight: '700',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  refreshMazeBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  refreshMazeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  toastCard: {
    position: 'absolute',
    top: 140,
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
  mazeWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  mazeBoard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  mazeRow: {
    flexDirection: 'row',
    flex: 1,
  },
  cellBox: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  hintDot: {
    fontSize: 12,
  },
  starIcon: {
    position: 'absolute',
  },
  goalTargetBox: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalEmoji: {},
  playerBox: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerEmoji: {},
  controlsSection: {
    paddingBottom: 38,
    alignItems: 'center',
  },
  dpadContainer: {
    width: 170,
    height: 125,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dpadMiddleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 170,
    marginVertical: 2,
  },
  dpadBtn: {
    width: 50,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  dpadUp: {
    marginBottom: 2,
  },
  dpadDown: {
    marginTop: 2,
  },
  dpadLeft: {},
  dpadRight: {},
  dpadArrow: {
    fontSize: 18,
  },
  dpadCenter: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dpadCenterIcon: {
    fontSize: 16,
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
  resultSummary: {
    flexDirection: 'row',
    backgroundColor: '#312E81',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#4338CA',
    marginBottom: 18,
    width: '100%',
    justifyContent: 'space-around',
  },
  resultCol: {
    alignItems: 'center',
  },
  resultColLabel: {
    color: '#A5B4FC',
    fontSize: 11,
    fontWeight: '700',
  },
  resultColVal: {
    color: '#FDE047',
    fontSize: 14,
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
  victoryNextDiffBtn: {
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
  },
  victoryNextDiffText: {
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
