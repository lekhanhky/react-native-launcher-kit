import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  StatusBar,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { ThemeConfig } from '../services/themes';

interface Bubble {
  id: string;
  x: number; // Tọa độ X (px)
  y: Animated.Value; // Tọa độ Y animation
  size: number;
  color: string;
  borderColor: string;
  content: string; // Emoji hoặc số hoặc màu
  type: 'standard' | 'rainbow' | 'bonus_time';
  points: number;
}

interface FloatingScore {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  opacity: Animated.Value;
}

interface BubblePopGameScreenProps {
  theme?: ThemeConfig;
  onClose: () => void;
}

type GameMode = 'free' | 'colors' | 'numbers';

const BUBBLE_COLORS = [
  { name: 'Đỏ', bg: '#EF4444', border: '#DC2626', emoji: '🔴' },
  { name: 'Xanh Lá', bg: '#10B981', border: '#059669', emoji: '🟢' },
  { name: 'Xanh Dương', bg: '#3B82F6', border: '#2563EB', emoji: '🔵' },
  { name: 'Vàng', bg: '#FBBF24', border: '#D97706', emoji: '🟡' },
  { name: 'Hồng', bg: '#EC4899', border: '#DB2777', emoji: '🌸' },
  { name: 'Tím', bg: '#8B5CF6', border: '#7C3AED', emoji: '🟣' },
  { name: 'Cam', bg: '#F97316', border: '#EA580C', emoji: '🟠' },
];

export const BubblePopGameScreen: React.FC<BubblePopGameScreenProps> = ({ onClose }) => {
  const { width, height } = useWindowDimensions();
  const gameAreaHeight = height - 160;

  const [mode, setMode] = useState<GameMode>('free');
  const [score, setScore] = useState<number>(0);
  const [poppedCount, setPoppedCount] = useState<number>(0);
  const [targetPops] = useState<number>(25); // Mục tiêu 25 quả bóng để thắng
  const [combo, setCombo] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(45); // 45 giây đếm ngược
  const [targetColor, setTargetColor] = useState(BUBBLE_COLORS[0]);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);

  const comboTimerRef = useRef<any>(null);
  const spawnTimerRef = useRef<any>(null);
  const victoryScale = useRef(new Animated.Value(0.3)).current;

  // 1. Khởi động màn chơi mới
  const startNewGame = useCallback(() => {
    setScore(0);
    setPoppedCount(0);
    setCombo(0);
    setTimeLeft(mode === 'free' ? 45 : 40);
    setIsVictory(false);
    setIsGameOver(false);
    setBubbles([]);
    setFloatingScores([]);
    setTargetColor(BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)]);
    setIsGameActive(true);
  }, [mode]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // 2. Đếm ngược thời gian
  useEffect(() => {
    let timer: any = null;
    if (isGameActive && !isVictory && !isGameOver) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsGameActive(false);
            setIsGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isGameActive, isVictory, isGameOver]);

  // 3. Vòng lặp sinh bong bóng ngẫu nhiên bay lên
  useEffect(() => {
    if (!isGameActive || isVictory || isGameOver) return;

    const spawnBubble = () => {
      const bubbleSize = Math.floor(Math.random() * 20) + 65; // 65px - 85px
      const minX = 16;
      const maxX = width - bubbleSize - 16;
      const posX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;

      const randomColor = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
      const randSpecial = Math.random();

      let bubbleType: 'standard' | 'rainbow' | 'bonus_time' = 'standard';
      let content = '';
      let pts = 10;

      if (mode === 'numbers') {
        content = String(Math.floor(Math.random() * 9) + 1);
      } else if (mode === 'colors') {
        content = randomColor.emoji;
      } else {
        if (randSpecial < 0.08) {
          bubbleType = 'rainbow';
          content = '🌈';
          pts = 50;
        } else if (randSpecial < 0.16) {
          bubbleType = 'bonus_time';
          content = '⏰';
          pts = 20;
        } else {
          content = randomColor.emoji;
        }
      }

      const bubbleAnimY = new Animated.Value(gameAreaHeight + 20);
      const newBubble: Bubble = {
        id: `bubble_${Date.now()}_${Math.random()}`,
        x: posX,
        y: bubbleAnimY,
        size: bubbleSize,
        color: bubbleType === 'rainbow' ? '#F43F5E' : bubbleType === 'bonus_time' ? '#0EA5E9' : randomColor.bg,
        borderColor: bubbleType === 'rainbow' ? '#FFE4E6' : bubbleType === 'bonus_time' ? '#BAE6FD' : randomColor.border,
        content: content,
        type: bubbleType,
        points: pts,
      };

      setBubbles((prev) => [...prev.slice(-12), newBubble]);

      // Tốc độ bay lên (4 - 6.5 giây)
      const duration = Math.floor(Math.random() * 2500) + 4000;
      Animated.timing(bubbleAnimY, {
        toValue: -100,
        duration: duration,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setBubbles((curr) => curr.filter((b) => b.id !== newBubble.id));
        }
      });
    };

    spawnTimerRef.current = setInterval(spawnBubble, 800);

    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, [isGameActive, isVictory, isGameOver, width, gameAreaHeight, mode]);

  // 4. Xử lý khi bé chạm làm nổ bong bóng
  const handlePopBubble = (bubble: Bubble) => {
    // Xóa bóng đã nổ khỏi màn hình
    setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));

    // Tính điểm & Combo
    let earnedPts = bubble.points;
    const nextCombo = combo + 1;
    setCombo(nextCombo);

    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => {
      setCombo(0);
    }, 2000);

    if (nextCombo >= 3) {
      earnedPts += nextCombo * 5; // Thưởng combo
    }

    // Xử lý hiệu ứng loại bóng đặc biệt
    let popupText = `+${earnedPts}`;
    if (bubble.type === 'rainbow') {
      popupText = `🌈 TOÀN MÀN HÌNH +${earnedPts}!`;
      // Nổ tất cả bóng đang có
      setTimeout(() => {
        setBubbles([]);
      }, 200);
    } else if (bubble.type === 'bonus_time') {
      popupText = `⏰ +5 GIÂY!`;
      setTimeLeft((t) => t + 5);
    } else if (mode === 'colors' && bubble.color === targetColor.bg) {
      popupText = `ĐÚNG MÀU! +${earnedPts * 2}`;
      earnedPts *= 2;
      // Đổi màu mục tiêu mới
      setTargetColor(BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)]);
    }

    setScore((s) => s + earnedPts);
    const nextPops = poppedCount + 1;
    setPoppedCount(nextPops);

    // Hiệu ứng chữ số bay lên
    showFloatingText(bubble.x + bubble.size / 2, bubble.size, popupText, nextCombo >= 3 ? '#F59E0B' : '#10B981');

    // Kiểm tra chiến thắng
    if (nextPops >= targetPops) {
      handleVictory();
    }
  };

  // Hiệu ứng chữ nổi
  const showFloatingText = (x: number, y: number, text: string, color: string) => {
    const opacity = new Animated.Value(1);
    const floatItem: FloatingScore = {
      id: `score_${Date.now()}_${Math.random()}`,
      x: Math.max(10, Math.min(width - 100, x - 30)),
      y: y + 80,
      text,
      color,
      opacity,
    };

    setFloatingScores((prev) => [...prev, floatItem]);

    Animated.timing(opacity, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      setFloatingScores((prev) => prev.filter((item) => item.id !== floatItem.id));
    });
  };

  // 5. Xử lý chiến thắng
  const handleVictory = () => {
    setIsVictory(true);
    setIsGameActive(false);
    victoryScale.setValue(0.3);
    Animated.spring(victoryScale, {
      toValue: 1,
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0284C7" />

      {/* 1. HEADER CHÍNH */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onClose} activeOpacity={0.7}>
          <Text style={styles.backBtnText}>✕ Đóng</Text>
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>🎈 Nổ Bong Bóng</Text>
          <Text style={styles.headerSub}>Chạm nổ thật nhiều bóng bay nhé bé!</Text>
        </View>

        <TouchableOpacity style={styles.restartBtn} onPress={startNewGame} activeOpacity={0.7}>
          <Text style={styles.restartBtnText}>🔄 Chơi Lại</Text>
        </TouchableOpacity>
      </View>

      {/* 2. THANH CHỌN CHẾ ĐỘ & BẢNG ĐIỂM */}
      <View style={styles.topControlPanel}>
        {/* Chọn Chế Độ Chơi */}
        <View style={styles.modeRow}>
          {[
            { key: 'free', label: '🎈 Tự Do' },
            { key: 'colors', label: '🎨 Tìm Màu' },
            { key: 'numbers', label: '🔢 Học Số' },
          ].map((item) => {
            const isSelected = mode === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.modePill, isSelected && styles.modePillActive]}
                onPress={() => {
                  setMode(item.key as GameMode);
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.modePillText, isSelected && styles.modePillTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Thông Báo Mục Tiêu Màu Sắc Nếu Ở Chế Độ Tìm Màu */}
        {mode === 'colors' && (
          <View style={[styles.targetColorBox, { backgroundColor: targetColor.bg }]}>
            <Text style={styles.targetColorText}>
              Bé hãy nổ bóng: <Text style={{ fontWeight: '900', textDecorationLine: 'underline' }}>{targetColor.name} {targetColor.emoji}</Text>
            </Text>
          </View>
        )}

        {/* BẢNG THỐNG KÊ (TIẾN ĐỘ, COMBO, THỜI GIAN) */}
        <View style={styles.dashboardCard}>
          <View style={styles.dashItem}>
            <Text style={styles.dashLabel}>⏱️ Thời Gian</Text>
            <Text style={[styles.dashValue, timeLeft <= 10 && { color: '#EF4444' }]}>
              {timeLeft}s
            </Text>
          </View>
          <View style={styles.dashDivider} />
          <View style={styles.dashItem}>
            <Text style={styles.dashLabel}>🎯 Đã Nổ</Text>
            <Text style={[styles.dashValue, { color: '#059669' }]}>
              {poppedCount}/{targetPops}
            </Text>
          </View>
          <View style={styles.dashDivider} />
          <View style={styles.dashItem}>
            <Text style={styles.dashLabel}>⭐ Điểm</Text>
            <Text style={[styles.dashValue, { color: '#D97706' }]}>{score}</Text>
          </View>
          {combo >= 2 && (
            <>
              <View style={styles.dashDivider} />
              <View style={styles.dashItem}>
                <Text style={styles.dashLabel}>🔥 Combo</Text>
                <Text style={[styles.dashValue, { color: '#DC2626' }]}>x{combo}</Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* 3. KHÔNG GIAN BẦU TRỜI CHO BONG BÓNG BAY (GAME PLAYGROUND) */}
      <View style={styles.skyArea}>
        {/* Nền mây & bong bóng nhỏ lơ lửng */}
        <Text style={[styles.cloudDecor, { top: 30, left: 20 }]}>☁️</Text>
        <Text style={[styles.cloudDecor, { top: 80, right: 30 }]}>☁️</Text>
        <Text style={[styles.cloudDecor, { top: 160, left: 60 }]}>⛅</Text>

        {/* DANH SÁCH BONG BÓNG ĐANG BAY */}
        {bubbles.map((b) => (
          <Animated.View
            key={b.id}
            style={[
              styles.bubbleContainer,
              {
                left: b.x,
                width: b.size,
                height: b.size,
                borderRadius: b.size / 2,
                backgroundColor: b.color,
                borderColor: b.borderColor,
                transform: [{ translateY: b.y }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.bubbleTouchable}
              activeOpacity={0.6}
              onPress={() => handlePopBubble(b)}
            >
              {/* Vệt sáng 3D bóng bẩy trên quả bóng */}
              <View style={styles.bubbleGloss} />
              <Text style={styles.bubbleContentText}>{b.content}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}

        {/* CHỮ NỔI ĐIỂM SỐ */}
        {floatingScores.map((item) => (
          <Animated.View
            key={item.id}
            style={[
              styles.floatingScoreContainer,
              {
                left: item.x,
                top: item.y,
                opacity: item.opacity,
              },
            ]}
          >
            <Text style={[styles.floatingScoreText, { color: item.color }]}>
              {item.text}
            </Text>
          </Animated.View>
        ))}
      </View>

      {/* 4. MODAL CHIẾN THẮNG */}
      <Modal visible={isVictory} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalCard,
              { transform: [{ scale: victoryScale }] },
            ]}
          >
            <Text style={styles.trophyEmoji}>🏆</Text>
            <Text style={styles.modalTitle}>BÉ QUÁ XUẤT SẮC! 🎉</Text>
            <Text style={styles.modalSub}>
              Bé đã nổ vỡ {poppedCount} quả bóng bay rực rỡ và ghi được {score} điểm!
            </Text>

            {/* 3 NGÔI SAO */}
            <View style={styles.starsRow}>
              <Text style={styles.starIcon}>⭐</Text>
              <Text style={styles.starIcon}>⭐</Text>
              <Text style={styles.starIcon}>⭐</Text>
            </View>

            <View style={styles.modalStatsBox}>
              <Text style={styles.modalStatItem}>
                ⏱️ Thời gian còn lại: <Text style={{ fontWeight: '800', color: '#0284C7' }}>{timeLeft}s</Text>
              </Text>
              <Text style={styles.modalStatItem}>
                🎈 Tổng số bóng nổ: <Text style={{ fontWeight: '800', color: '#059669' }}>{poppedCount} quả</Text>
              </Text>
              <Text style={styles.modalStatItem}>
                🌟 Điểm thưởng nhận được: <Text style={{ fontWeight: '800', color: '#D97706' }}>+{score} Sao</Text>
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.actionPrimaryBtn}
                onPress={startNewGame}
                activeOpacity={0.8}
              >
                <Text style={styles.actionPrimaryText}>🎮 Chơi Ván Tiếp</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionSecondaryBtn}
                onPress={() => {
                  setIsVictory(false);
                  onClose();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.actionSecondaryText}>🏠 Về Trang Chủ</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* 5. MODAL HẾT GIỜ (THỬ LẠI) */}
      <Modal visible={isGameOver} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.trophyEmoji}>⏰</Text>
            <Text style={styles.modalTitle}>HẾT GIỜ RỒI BÉ ƠI!</Text>
            <Text style={styles.modalSub}>
              Bé đã làm rất tốt khi nổ được {poppedCount}/{targetPops} quả bóng. Bé thử lại nhé!
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.actionPrimaryBtn}
                onPress={startNewGame}
                activeOpacity={0.8}
              >
                <Text style={styles.actionPrimaryText}>🔄 Thử Lại Ngay</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionSecondaryBtn}
                onPress={() => {
                  setIsGameOver(false);
                  onClose();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.actionSecondaryText}>🏠 Về Trang Chủ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E0F2FE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0284C7',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  titleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 11,
    color: '#BAE6FD',
    marginTop: 2,
    fontWeight: '500',
  },
  backBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  restartBtn: {
    backgroundColor: '#F59E0B',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  restartBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  /* TOP CONTROL PANEL */
  topControlPanel: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 6,
  },
  modeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
    marginBottom: 8,
  },
  modePill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 7,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
  },
  modePillActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0369A1',
  },
  modePillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0369A1',
  },
  modePillTextActive: {
    color: '#FFFFFF',
  },

  targetColorBox: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  targetColorText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  /* DASHBOARD CARD */
  dashboardCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  dashItem: {
    alignItems: 'center',
    flex: 1,
  },
  dashLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 2,
  },
  dashValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  dashDivider: {
    width: 1,
    height: 22,
    backgroundColor: '#E2E8F0',
  },

  /* SKY AREA */
  skyArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  cloudDecor: {
    position: 'absolute',
    fontSize: 36,
    opacity: 0.45,
  },

  /* BUBBLE */
  bubbleContainer: {
    position: 'absolute',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 5,
  },
  bubbleTouchable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bubbleGloss: {
    position: 'absolute',
    top: 6,
    left: 8,
    width: '28%',
    height: '28%',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 20,
  },
  bubbleContentText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  /* FLOATING SCORE */
  floatingScoreContainer: {
    position: 'absolute',
    zIndex: 99,
  },
  floatingScoreText: {
    fontSize: 18,
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  /* MODALS */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  trophyEmoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  modalSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  starIcon: {
    fontSize: 36,
  },
  modalStatsBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    gap: 6,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalStatItem: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
  modalActions: {
    width: '100%',
    gap: 10,
  },
  actionPrimaryBtn: {
    backgroundColor: '#0284C7',
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionPrimaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  actionSecondaryBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionSecondaryText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '700',
  },
});
