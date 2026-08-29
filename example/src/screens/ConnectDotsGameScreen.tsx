import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  ScrollView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { soundManager } from '../components/SoundPlayer';

interface Dot {
  num: number;
  x: number;
  y: number;
}

interface ShapeLevel {
  id: string;
  name: string;
  emoji: string;
  color: string;
  dots: Dot[];
  funFact: string;
}

const LEVELS: ShapeLevel[] = [
  {
    id: 'star',
    name: 'Ngôi Sao Lấp Lánh',
    emoji: '⭐',
    color: '#FBBF24',
    funFact: 'Ngôi sao 5 cánh tỏa sáng lung linh trên bầu trời đêm!',
    dots: [
      { num: 1, x: 50, y: 15 },
      { num: 2, x: 62, y: 38 },
      { num: 3, x: 88, y: 38 },
      { num: 4, x: 68, y: 55 },
      { num: 5, x: 75, y: 82 },
      { num: 6, x: 50, y: 66 },
      { num: 7, x: 25, y: 82 },
      { num: 8, x: 32, y: 55 },
      { num: 9, x: 12, y: 38 },
      { num: 10, x: 38, y: 38 },
    ],
  },
  {
    id: 'fish',
    name: 'Chú Cá Vàng',
    emoji: '🐠',
    color: '#38BDF8',
    funFact: 'Cá vàng tung tăng bơi lội dưới làn nước trong xanh!',
    dots: [
      { num: 1, x: 20, y: 50 },
      { num: 2, x: 35, y: 30 },
      { num: 3, x: 55, y: 25 },
      { num: 4, x: 70, y: 40 },
      { num: 5, x: 88, y: 25 },
      { num: 6, x: 80, y: 50 },
      { num: 7, x: 88, y: 75 },
      { num: 8, x: 70, y: 60 },
      { num: 9, x: 55, y: 75 },
      { num: 10, x: 35, y: 70 },
      { num: 11, x: 20, y: 50 },
    ],
  },
  {
    id: 'heart',
    name: 'Trái Tim Yêu Thương',
    emoji: '❤️',
    color: '#F43F5E',
    funFact: 'Trái tim biểu tượng cho tình yêu thương ấm áp của gia đình!',
    dots: [
      { num: 1, x: 50, y: 75 },
      { num: 2, x: 30, y: 55 },
      { num: 3, x: 20, y: 40 },
      { num: 4, x: 20, y: 28 },
      { num: 5, x: 28, y: 18 },
      { num: 6, x: 40, y: 20 },
      { num: 7, x: 50, y: 32 },
      { num: 8, x: 60, y: 20 },
      { num: 9, x: 72, y: 18 },
      { num: 10, x: 80, y: 28 },
      { num: 11, x: 80, y: 40 },
      { num: 12, x: 70, y: 55 },
      { num: 13, x: 50, y: 75 },
    ],
  },
  {
    id: 'house',
    name: 'Ngôi Nhà Xinh',
    emoji: '🏠',
    color: '#10B981',
    funFact: 'Ngôi nhà xinh xắn ấm áp rộn rã tiếng cười!',
    dots: [
      { num: 1, x: 50, y: 15 },
      { num: 2, x: 80, y: 40 },
      { num: 3, x: 80, y: 80 },
      { num: 4, x: 60, y: 80 },
      { num: 5, x: 60, y: 55 },
      { num: 6, x: 40, y: 55 },
      { num: 7, x: 40, y: 80 },
      { num: 8, x: 20, y: 80 },
      { num: 9, x: 20, y: 40 },
      { num: 10, x: 50, y: 15 },
    ],
  },
];

export const ConnectDotsGameScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { width, height } = useWindowDimensions();
  const canvasSize = Math.min(width - 32, height * 0.42, 340);

  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [currentExpectedDot, setCurrentExpectedDot] = useState(1);
  const [connectedDots, setConnectedDots] = useState<Dot[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const scaleAnim = useRef(new Animated.Value(0)).current;

  const currentLevel = LEVELS[currentLevelIdx];

  const startLevel = (idx: number) => {
    setCurrentLevelIdx(idx);
    setCurrentExpectedDot(1);
    setConnectedDots([]);
    setIsCompleted(false);
    scaleAnim.setValue(0);
    soundManager.speak(`Màn ${idx + 1}: ${LEVELS[idx].name}. Bé hãy chạm vào số 1 nhé!`);
  };

  useEffect(() => {
    startLevel(currentLevelIdx);
  }, [currentLevelIdx]);

  const handleDotPress = (dot: Dot) => {
    if (isCompleted) return;

    if (dot.num === currentExpectedDot) {
      const newConnected = [...connectedDots, dot];
      setConnectedDots(newConnected);

      soundManager.speak(`${dot.num}`, 'vi');
      soundManager.play('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');

      if (currentExpectedDot >= currentLevel.dots.length) {
        setIsCompleted(true);
        setScore((prev) => prev + 20);
        soundManager.play(
          'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
          `Tuyệt vời! Bé đã vẽ xong ${currentLevel.name}!`
        );

        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }).start();
      } else {
        setCurrentExpectedDot((prev) => prev + 1);
      }
    } else {
      soundManager.speak(`Bé hãy tìm số ${currentExpectedDot} nhé!`);
    }
  };

  const handleNextLevel = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      setCurrentLevelIdx((prev) => prev + 1);
    } else {
      setCurrentLevelIdx(0);
    }
  };

  const renderLine = (p1: Dot, p2: Dot, index: number) => {
    const x1 = (p1.x / 100) * canvasSize;
    const y1 = (p1.y / 100) * canvasSize;
    const x2 = (p2.x / 100) * canvasSize;
    const y2 = (p2.y / 100) * canvasSize;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    return (
      <View
        key={`line_${index}`}
        style={{
          position: 'absolute',
          left: midX - length / 2,
          top: midY - 2.5,
          width: length,
          height: 5,
          backgroundColor: currentLevel.color,
          borderRadius: 3,
          transform: [{ rotate: `${angle}deg` }],
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>🔢 Nối Điểm Theo Số</Text>
          <Text style={styles.levelSubtitle}>
            Hình {currentLevelIdx + 1}/{LEVELS.length}: {currentLevel.name}
          </Text>
        </View>

        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>⭐ {score}</Text>
        </View>
      </View>

      {/* Vùng Canvas Nối Điểm dạng cuộn mượt không bị che navigation */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.canvasContainer, { width: canvasSize, height: canvasSize }]}>
          {connectedDots.map((dot, index) => {
            if (index === 0) return null;
            return renderLine(connectedDots[index - 1], dot, index);
          })}

          {currentLevel.dots.map((dot, idx) => {
            const posX = (dot.x / 100) * canvasSize - 19;
            const posY = (dot.y / 100) * canvasSize - 19;
            const isConnected = dot.num < currentExpectedDot || isCompleted;
            const isNext = dot.num === currentExpectedDot;

            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.dotButton,
                  { left: posX, top: posY },
                  isConnected && { backgroundColor: currentLevel.color, borderColor: '#FFFFFF' },
                  isNext && styles.dotButtonNext,
                ]}
                onPress={() => handleDotPress(dot)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dotNumber, isConnected && styles.dotNumberConnected]}>
                  {dot.num}
                </Text>
              </TouchableOpacity>
            );
          })}

          {isCompleted && (
            <Animated.View
              style={[
                styles.completedIllustration,
                { transform: [{ scale: scaleAnim }] },
              ]}
              pointerEvents="none"
            >
              <Text style={styles.completedEmoji}>{currentLevel.emoji}</Text>
            </Animated.View>
          )}
        </View>

        {isCompleted ? (
          <View style={styles.celebrationBox}>
            <Text style={styles.celebrationTitle}>🎉 Bé Giỏi Quá! Hoàn Thành {currentLevel.name}!</Text>
            <Text style={styles.funFactText}>{currentLevel.funFact}</Text>
            <TouchableOpacity style={styles.nextLevelBtn} onPress={handleNextLevel}>
              <Text style={styles.nextLevelText}>Vẽ Hình Tiếp Theo ➔</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.guideBox}>
            <Text style={styles.guideText}>
              👉 Bé hãy chạm vào điểm tròn số <Text style={styles.highlightNum}>{currentExpectedDot}</Text> nhé!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E293B',
    borderBottomWidth: 2,
    borderBottomColor: '#334155',
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FBBF24',
    fontSize: 20,
    fontWeight: '900',
  },
  levelSubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  scoreBadge: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  scoreText: {
    color: '#FBBF24',
    fontSize: 16,
    fontWeight: '900',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'android' ? 60 : 36,
  },
  canvasContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#475569',
    position: 'relative',
    elevation: 8,
    marginBottom: 20,
  },
  dotButton: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#334155',
    borderWidth: 2.5,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  dotButtonNext: {
    borderColor: '#F59E0B',
    backgroundColor: '#78350F',
    transform: [{ scale: 1.15 }],
  },
  dotNumber: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  dotNumberConnected: {
    color: '#0F172A',
    fontWeight: '900',
  },
  completedIllustration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderRadius: 24,
  },
  completedEmoji: {
    fontSize: 110,
  },
  celebrationBox: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  celebrationTitle: {
    color: '#FBBF24',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  funFactText: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 14,
  },
  nextLevelBtn: {
    backgroundColor: '#38BDF8',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
    elevation: 4,
  },
  nextLevelText: {
    color: '#0F172A',
    fontSize: 17,
    fontWeight: '900',
  },
  guideBox: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#334155',
    marginTop: 8,
  },
  guideText: {
    color: '#E2E8F0',
    fontSize: 15,
    fontWeight: '700',
  },
  highlightNum: {
    color: '#F59E0B',
    fontSize: 18,
    fontWeight: '900',
  },
});

export default ConnectDotsGameScreen;
