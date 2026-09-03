import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { VocabCard, VocabCategory } from '../data/oxfordKidsVocabulary';
import { vocabularyService } from '../services/vocabularyService';
import { soundManager } from '../components/SoundPlayer';

// ============================================================
// TYPES
// ============================================================
interface Asteroid {
  id: string;
  word: VocabCard;
  x: number;
  animY: Animated.Value;
  animRotate: Animated.Value;
  animScale: Animated.Value;
  animOpacity: Animated.Value;
  isCorrect: boolean;
  isDestroyed: boolean;
  color: string;
}

interface Beam {
  id: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  angle: number;
  length: number;
  animScaleX: Animated.Value;
  animOpacity: Animated.Value;
  animGlow: Animated.Value;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  animX: Animated.Value;
  animY: Animated.Value;
  animOpacity: Animated.Value;
  animScale: Animated.Value;
  color: string;
}

type GameState = 'topic_select' | 'playing' | 'game_over';

const ASTEROID_COLORS = ['#FF6B35', '#7C3AED', '#059669', '#DC2626', '#2563EB', '#D946EF'];
const PARTICLE_COLORS = ['#FFD700', '#FF4500', '#FF1493', '#00BFFF', '#7FFF00', '#FF6347'];
const FIREWORK_COLORS = ['#FFD700', '#FF1493', '#00CED1'];

// ============================================================
// MAIN COMPONENT
// ============================================================
export const SpaceShooterGameScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { width, height } = useWindowDimensions();

  // Game state
  const [gameState, setGameState] = useState<GameState>('topic_select');
  const [categories, setCategories] = useState<VocabCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<VocabCategory | null>(null);
  const [wordQueue, setWordQueue] = useState<VocabCard[]>([]);
  const [currentTarget, setCurrentTarget] = useState<VocabCard | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [round, setRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [beams, setBeams] = useState<Beam[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [fireworks, setFireworks] = useState<Particle[]>([]);
  const [showFlash, setShowFlash] = useState(false);
  const [flashColor, setFlashColor] = useState('white');
  const [isRoundActive, setIsRoundActive] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  // Animated values
  const shipFlame = useRef(new Animated.Value(1)).current;
  const promptAnim = useRef(new Animated.Value(0)).current;
  const screenShake = useRef(new Animated.Value(0)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;

  // Star field
  const stars = useRef(
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      anim: new Animated.Value(Math.random()),
    }))
  ).current;

  // Refs
  const roundTimerRef = useRef<any>(null);
  const isGameActiveRef = useRef(false);
  const wordQueueRef = useRef<VocabCard[]>([]);
  const roundRef = useRef(0);
  const selectedCategoryRef = useRef<VocabCategory | null>(null);

  // ============================================================
  // LOAD CATEGORIES
  // ============================================================
  useEffect(() => {
    const cats = vocabularyService.getAllCategories();
    setCategories(cats);
  }, []);

  // ============================================================
  // STAR ANIMATION
  // ============================================================
  useEffect(() => {
    stars.forEach((star) => {
      const twinkle = () => {
        Animated.sequence([
          Animated.timing(star.anim, {
            toValue: 0.2,
            duration: 800 + Math.random() * 1500,
            useNativeDriver: true,
          }),
          Animated.timing(star.anim, {
            toValue: 1,
            duration: 800 + Math.random() * 1500,
            useNativeDriver: true,
          }),
        ]).start(() => twinkle());
      };
      twinkle();
    });
  }, []);

  // ============================================================
  // SHIP FLAME ANIMATION
  // ============================================================
  useEffect(() => {
    const flicker = () => {
      Animated.sequence([
        Animated.timing(shipFlame, {
          toValue: 0.6,
          duration: 100 + Math.random() * 150,
          useNativeDriver: true,
        }),
        Animated.timing(shipFlame, {
          toValue: 1,
          duration: 100 + Math.random() * 150,
          useNativeDriver: true,
        }),
      ]).start(() => flicker());
    };
    flicker();
  }, []);

  // ============================================================
  // SPAWN EXPLOSION PARTICLES
  // ============================================================
  const spawnExplosion = useCallback((cx: number, cy: number) => {
    const newParticles: Particle[] = Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const distance = 60 + Math.random() * 60;
      const animX = new Animated.Value(0);
      const animY = new Animated.Value(0);
      const animOpacity = new Animated.Value(1);
      const animScale = new Animated.Value(1);

      Animated.parallel([
        Animated.timing(animX, { toValue: Math.cos(angle) * distance, duration: 600, useNativeDriver: true }),
        Animated.timing(animY, { toValue: Math.sin(angle) * distance, duration: 600, useNativeDriver: true }),
        Animated.timing(animOpacity, { toValue: 0, duration: 600, useNativeDriver: true }),
        Animated.timing(animScale, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]).start();

      return {
        id: `p-${Date.now()}-${i}`,
        x: cx, y: cy,
        animX, animY, animOpacity, animScale,
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
      };
    });
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  // ============================================================
  // SPAWN FIREWORKS
  // ============================================================
  const spawnFireworks = useCallback(() => {
    const fws: Particle[] = [];
    for (let f = 0; f < 3; f++) {
      const cx = 60 + Math.random() * (width - 120);
      const cy = 80 + Math.random() * 150;
      const fwColor = FIREWORK_COLORS[f % FIREWORK_COLORS.length];

      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const distance = 40 + Math.random() * 40;
        const animX = new Animated.Value(0);
        const animY = new Animated.Value(0);
        const animOpacity = new Animated.Value(0);
        const animScale = new Animated.Value(0);

        Animated.sequence([
          Animated.delay(f * 200),
          Animated.parallel([
            Animated.timing(animOpacity, { toValue: 1, duration: 100, useNativeDriver: true }),
            Animated.timing(animScale, { toValue: 1, duration: 100, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(animX, { toValue: Math.cos(angle) * distance, duration: 500, useNativeDriver: true }),
            Animated.timing(animY, { toValue: Math.sin(angle) * distance, duration: 500, useNativeDriver: true }),
            Animated.timing(animOpacity, { toValue: 0, duration: 800, useNativeDriver: true }),
            Animated.timing(animScale, { toValue: 0.3, duration: 800, useNativeDriver: true }),
          ]),
        ]).start();

        fws.push({
          id: `fw-${Date.now()}-${f}-${i}`,
          x: cx, y: cy,
          animX, animY, animOpacity, animScale,
          color: fwColor,
        });
      }
    }
    setFireworks(prev => [...prev, ...fws]);
  }, [width]);

  // ============================================================
  // HANDLE MISSED TARGET
  // ============================================================
  const handleMissedTarget = useCallback(() => {
    if (!isGameActiveRef.current) return;
    setIsRoundActive(false);

    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        isGameActiveRef.current = false;
        setTimeout(() => setGameState('game_over'), 500);
        return 0;
      }
      // Next round
      setTimeout(() => {
        setAsteroids([]);
        const nextRound = roundRef.current;
        const queue = wordQueueRef.current;
        const cat = selectedCategoryRef.current;
        if (cat && queue.length > nextRound) {
          startRound(queue, nextRound, cat);
        }
      }, 1200);
      return newLives;
    });

    // Screen shake
    Animated.sequence([
      Animated.timing(screenShake, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(screenShake, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(screenShake, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(screenShake, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(screenShake, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();

    soundManager.speak('Hết giờ rồi! Cố lên nào bé', 'vi');
  }, []);

  // ============================================================
  // START A ROUND
  // ============================================================
  const startRound = useCallback((queue: VocabCard[], roundIdx: number, category: VocabCategory) => {
    if (!isGameActiveRef.current) return;
    if (roundIdx >= queue.length) {
      isGameActiveRef.current = false;
      setGameState('game_over');
      return;
    }

    const targetWord = queue[roundIdx];
    setCurrentTarget(targetWord);
    setRound(roundIdx + 1);
    roundRef.current = roundIdx + 1;
    setIsRoundActive(true);

    // Voice prompt
    setShowPrompt(true);
    Animated.timing(promptAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();

    const promptText = `Bé hãy bắn vào chữ ${targetWord.english}, nghĩa là ${targetWord.vietnamese}`;
    soundManager.speak(promptText, 'vi');

    // Create asteroids after voice delay
    roundTimerRef.current = setTimeout(() => {
      if (!isGameActiveRef.current) return;

      // Get wrong words
      const allCards = vocabularyService.getAllCategories().flatMap(c => c.cards);
      const wrongCards = allCards
        .filter(c => c.id !== targetWord.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2 + Math.floor(Math.random() * 2));

      const allWords = [targetWord, ...wrongCards].sort(() => Math.random() - 0.5);
      const asteroidW = 90;
      const padding = 15;
      const usableW = width - padding * 2 - asteroidW;

      const newAsteroids: Asteroid[] = allWords.map((word, idx) => {
        const x = padding + (usableW / Math.max(allWords.length - 1, 1)) * idx;
        const animY = new Animated.Value(-100);
        const animRotate = new Animated.Value(0);
        const animScale = new Animated.Value(1);
        const animOpacity = new Animated.Value(1);
        const color = ASTEROID_COLORS[idx % ASTEROID_COLORS.length];

        const fallDuration = Math.max(6000 - roundIdx * 80, 3500);
        Animated.timing(animY, {
          toValue: height - 220,
          duration: fallDuration,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished && word.id === targetWord.id && isGameActiveRef.current) {
            handleMissedTarget();
          }
        });

        Animated.loop(
          Animated.timing(animRotate, {
            toValue: 1,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          })
        ).start();

        return {
          id: `ast-${roundIdx}-${idx}`,
          word, x, animY, animRotate, animScale, animOpacity,
          isCorrect: word.id === targetWord.id,
          isDestroyed: false, color,
        };
      });

      setAsteroids(newAsteroids);
    }, 2500);
  }, [width, height, handleMissedTarget]);

  // ============================================================
  // CORRECT HIT
  // ============================================================
  const handleCorrectHit = useCallback((asteroid: Asteroid) => {
    setIsRoundActive(false);
    asteroid.isDestroyed = true;

    const comboBonus = combo >= 2 ? 2 : 1;
    setScore(prev => prev + 10 * comboBonus);
    setCombo(prev => prev + 1);
    setCorrectCount(prev => prev + 1);

    // Explosion on asteroid
    Animated.parallel([
      Animated.timing(asteroid.animScale, { toValue: 1.5, duration: 150, useNativeDriver: true }),
      Animated.timing(asteroid.animOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();

    // White flash
    setFlashColor('#FFFFFF');
    setShowFlash(true);
    Animated.sequence([
      Animated.timing(flashAnim, { toValue: 0.3, duration: 50, useNativeDriver: true }),
      Animated.timing(flashAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]).start(() => setShowFlash(false));

    spawnExplosion(asteroid.x + 45, 120);
    setTimeout(() => spawnFireworks(), 200);

    soundManager.speak('Chính xác! Giỏi lắm bé!', 'vi');

    // Stop other asteroids
    setAsteroids(prev => prev.map(a => {
      if (a.id !== asteroid.id) {
        a.animY.stopAnimation();
        Animated.timing(a.animOpacity, { toValue: 0, duration: 400, useNativeDriver: true }).start();
      }
      return a;
    }));

    // Next round
    setTimeout(() => {
      if (!isGameActiveRef.current) return;
      setAsteroids([]);
      setParticles([]);
      setFireworks([]);
      setShowPrompt(false);
      promptAnim.setValue(0);

      const queue = wordQueueRef.current;
      const cat = selectedCategoryRef.current;
      const nextRound = roundRef.current;
      if (cat && queue.length > nextRound) {
        startRound(queue, nextRound, cat);
      } else {
        isGameActiveRef.current = false;
        setGameState('game_over');
      }
    }, 2200);
  }, [combo, spawnExplosion, spawnFireworks, startRound]);

  // ============================================================
  // WRONG HIT
  // ============================================================
  const handleWrongHit = useCallback((asteroid: Asteroid) => {
    setCombo(0);

    Animated.sequence([
      Animated.timing(asteroid.animScale, { toValue: 1.15, duration: 100, useNativeDriver: true }),
      Animated.timing(asteroid.animScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    setFlashColor('#EF4444');
    setShowFlash(true);
    Animated.sequence([
      Animated.timing(flashAnim, { toValue: 0.2, duration: 50, useNativeDriver: true }),
      Animated.timing(flashAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setShowFlash(false));

    Animated.sequence([
      Animated.timing(screenShake, { toValue: 5, duration: 40, useNativeDriver: true }),
      Animated.timing(screenShake, { toValue: -5, duration: 40, useNativeDriver: true }),
      Animated.timing(screenShake, { toValue: 3, duration: 40, useNativeDriver: true }),
      Animated.timing(screenShake, { toValue: 0, duration: 40, useNativeDriver: true }),
    ]).start();

    soundManager.speak('Sai rồi, thử lại nào!', 'vi');
  }, []);

  // ============================================================
  // SHOOT ASTEROID
  // ============================================================
  const shootAsteroid = useCallback((asteroid: Asteroid) => {
    if (!isRoundActive || asteroid.isDestroyed) return;

    const shipCenterX = width / 2;
    const shipY = height - 145;
    const targetX = asteroid.x + 45;
    const targetY = 120;

    // Calculate beam angle and length
    const dx = targetX - shipCenterX;
    const dy = targetY - shipY; // negative (upward)
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx); // radians

    const beam: Beam = {
      id: `beam-${Date.now()}`,
      startX: shipCenterX,
      startY: shipY,
      targetX, targetY,
      angle,
      length,
      animScaleX: new Animated.Value(0),
      animOpacity: new Animated.Value(1),
      animGlow: new Animated.Value(0.5),
    };

    setBeams(prev => [...prev, beam]);

    // Beam shoots out fast, then fades
    Animated.sequence([
      // 1. Beam extends from ship to target
      Animated.timing(beam.animScaleX, {
        toValue: 1, duration: 120, useNativeDriver: true,
      }),
      // 2. Bright glow pulse
      Animated.timing(beam.animGlow, {
        toValue: 1, duration: 80, useNativeDriver: true,
      }),
      // 3. Hold briefly
      Animated.delay(100),
      // 4. Fade out
      Animated.parallel([
        Animated.timing(beam.animOpacity, {
          toValue: 0, duration: 200, useNativeDriver: true,
        }),
        Animated.timing(beam.animGlow, {
          toValue: 0, duration: 200, useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setBeams(prev => prev.filter(b => b.id !== beam.id));
    });

    // Spawn spark particles along beam path
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const t = 0.2 + (i / 6) * 0.7;
        const px = shipCenterX + dx * t + (Math.random() - 0.5) * 12;
        const py = shipY + dy * t + (Math.random() - 0.5) * 12;
        const spark: Particle = {
          id: `spark-${Date.now()}-${i}`,
          x: px, y: py,
          animX: new Animated.Value(0),
          animY: new Animated.Value(0),
          animOpacity: new Animated.Value(1),
          animScale: new Animated.Value(1),
          color: ['#FBBF24', '#FF6B35', '#FFFFFF', '#FCD34D'][i % 4],
        };
        Animated.parallel([
          Animated.timing(spark.animX, { toValue: (Math.random() - 0.5) * 20, duration: 350, useNativeDriver: true }),
          Animated.timing(spark.animY, { toValue: (Math.random() - 0.5) * 20, duration: 350, useNativeDriver: true }),
          Animated.timing(spark.animOpacity, { toValue: 0, duration: 350, useNativeDriver: true }),
          Animated.timing(spark.animScale, { toValue: 0, duration: 350, useNativeDriver: true }),
        ]).start();
        setParticles(prev => [...prev, spark]);
      }, 80 + i * 30);
    }

    // Trigger hit after beam reaches target
    setTimeout(() => {
      if (asteroid.isCorrect) {
        handleCorrectHit(asteroid);
      } else {
        handleWrongHit(asteroid);
      }
    }, 250);
  }, [isRoundActive, width, height, handleCorrectHit, handleWrongHit]);

  // ============================================================
  // SELECT TOPIC & START GAME
  // ============================================================
  const startGame = useCallback((category: VocabCategory) => {
    setSelectedCategory(category);
    selectedCategoryRef.current = category;
    const shuffled = [...category.cards].sort(() => Math.random() - 0.5);
    setWordQueue(shuffled);
    wordQueueRef.current = shuffled;
    setScore(0);
    setLives(3);
    setCombo(0);
    setRound(0);
    roundRef.current = 0;
    setTotalRounds(shuffled.length);
    setCorrectCount(0);
    setAsteroids([]);
    setBeams([]);
    setParticles([]);
    setFireworks([]);
    setGameState('playing');
    isGameActiveRef.current = true;

    setTimeout(() => startRound(shuffled, 0, category), 800);
  }, [startRound]);

  // ============================================================
  // CLEANUP
  // ============================================================
  useEffect(() => {
    return () => {
      isGameActiveRef.current = false;
      if (roundTimerRef.current) clearTimeout(roundTimerRef.current);
    };
  }, []);

  // ============================================================
  // REPLAY / CHANGE TOPIC
  // ============================================================
  const handleReplay = useCallback(() => {
    if (selectedCategory) startGame(selectedCategory);
  }, [selectedCategory, startGame]);

  const handleChangeTopic = useCallback(() => {
    isGameActiveRef.current = false;
    setGameState('topic_select');
    setAsteroids([]);
    setBeams([]);
    setParticles([]);
    setFireworks([]);
  }, []);

  // ============================================================
  // RENDER: STARS
  // ============================================================
  const renderStars = () => stars.map(star => (
    <Animated.View
      key={star.id}
      style={[
        styles.star,
        {
          left: `${star.x}%` as any,
          top: `${star.y}%` as any,
          width: star.size,
          height: star.size,
          borderRadius: star.size / 2,
          opacity: star.anim,
        },
      ]}
    />
  ));

  // ============================================================
  // RENDER: TOPIC SELECTOR
  // ============================================================
  if (gameState === 'topic_select') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0A0E27" />
        {renderStars()}

        <View style={[styles.topicHeader, { paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 16 : 16 }]}>
          <TouchableOpacity style={[styles.backBtn, { top: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 8 }]} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.backBtnText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.topicTitle}>🚀 Phi Hành Gia Nhí</Text>
          <Text style={styles.topicSubtitle}>Chọn chủ đề để bắt đầu cuộc phiêu lưu!</Text>
        </View>

        <ScrollView contentContainerStyle={styles.topicGrid}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.topicCard, { borderColor: cat.color + '60' }]}
              onPress={() => startGame(cat)}
              activeOpacity={0.8}
            >
              <Text style={styles.topicIcon}>{cat.icon}</Text>
              <Text style={styles.topicName} numberOfLines={1}>{cat.titleVi}</Text>
              <Text style={styles.topicCount}>{cat.cards.length} từ</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ============================================================
  // RENDER: GAME OVER
  // ============================================================
  if (gameState === 'game_over') {
    const isWin = correctCount === totalRounds;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0A0E27" />
        {renderStars()}
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverEmoji}>{isWin ? '🏆' : '💫'}</Text>
          <Text style={styles.gameOverTitle}>{isWin ? 'HOÀN THÀNH XUẤT SẮC!' : 'KẾT THÚC CHUYẾN BAY!'}</Text>
          <Text style={styles.gameOverSubtitle}>{selectedCategory?.titleVi}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>⭐ {score}</Text>
              <Text style={styles.statLabel}>Tổng điểm</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>✅ {correctCount}/{round}</Text>
              <Text style={styles.statLabel}>Bắn trúng</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.replayBtn} onPress={handleReplay} activeOpacity={0.8}>
            <Text style={styles.replayBtnText}>🔄 Chơi Lại</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.changeTopicBtn} onPress={handleChangeTopic} activeOpacity={0.8}>
            <Text style={styles.changeTopicBtnText}>📚 Đổi Chủ Đề</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exitBtn} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.exitBtnText}>🏠 Về Trang Chủ</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ============================================================
  // RENDER: PLAYING
  // ============================================================
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0E27" />

      <Animated.View style={[styles.gameArea, { transform: [{ translateX: screenShake }] }]}>
        {renderStars()}

        {/* HEADER */}
        <View style={[styles.gameHeader, { paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 8 }]}>
          <View style={styles.headerLeft}>
            <Text style={styles.scoreText}>⭐ {score}</Text>
            {combo >= 2 && <Text style={styles.comboText}>🔥 x{combo}</Text>}
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.livesText}>{'❤️'.repeat(lives)}{'🖤'.repeat(3 - lives)}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.roundText}>{round}/{totalRounds}</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.closeGameBtn}>
              <Text style={styles.closeGameBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ASTEROIDS */}
        {asteroids.map(asteroid => {
          if (asteroid.isDestroyed) return null;
          const rotate = asteroid.animRotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
          return (
            <Animated.View
              key={asteroid.id}
              style={[styles.asteroidContainer, {
                left: asteroid.x,
                transform: [{ translateY: asteroid.animY }, { rotate }, { scale: asteroid.animScale }],
                opacity: asteroid.animOpacity,
              }]}
            >
              <TouchableOpacity
                style={[styles.asteroid, { backgroundColor: asteroid.color }]}
                onPress={() => shootAsteroid(asteroid)}
                activeOpacity={0.9}
              >
                <Text style={styles.asteroidEmoji}>{asteroid.word.emoji}</Text>
                <Text style={styles.asteroidText} numberOfLines={1}>{asteroid.word.english}</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* LASER BEAMS */}
        {beams.map(beam => {
          const angleDeg = (beam.angle * 180) / Math.PI;
          return (
            <Animated.View
              key={beam.id}
              style={[styles.beamContainer, {
                left: beam.startX,
                top: beam.startY,
                width: beam.length,
                transform: [
                  { rotate: `${angleDeg}deg` },
                  { scaleX: beam.animScaleX },
                ],
                opacity: beam.animOpacity,
              }]}
            >
              {/* Outer glow */}
              <Animated.View style={[styles.beamGlowOuter, {
                opacity: beam.animGlow,
                width: beam.length,
              }]} />
              {/* Main beam */}
              <View style={[styles.beamCore, { width: beam.length }]} />
              {/* Inner bright line */}
              <View style={[styles.beamInner, { width: beam.length }]} />
              {/* Outer glow bottom */}
              <Animated.View style={[styles.beamGlowOuter, {
                opacity: beam.animGlow,
                width: beam.length,
              }]} />
            </Animated.View>
          );
        })}

        {/* EXPLOSION PARTICLES */}
        {particles.map(p => (
          <Animated.View key={p.id} style={[styles.particle, {
            left: p.x, top: p.y, backgroundColor: p.color,
            transform: [{ translateX: p.animX }, { translateY: p.animY }, { scale: p.animScale }],
            opacity: p.animOpacity,
          }]} />
        ))}

        {/* FIREWORKS */}
        {fireworks.map(fw => (
          <Animated.View key={fw.id} style={[styles.fireworkDot, {
            left: fw.x, top: fw.y, backgroundColor: fw.color,
            transform: [{ translateX: fw.animX }, { translateY: fw.animY }, { scale: fw.animScale }],
            opacity: fw.animOpacity,
          }]} />
        ))}

        {/* VOICE PROMPT */}
        {showPrompt && currentTarget && (
          <Animated.View style={[styles.promptBubble, {
            opacity: promptAnim,
            transform: [{ scale: promptAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
          }]}>
            <Text style={styles.promptText}>
              Bắn vào chữ <Text style={styles.promptHighlight}>"{currentTarget.english}"</Text>
            </Text>
            <Text style={styles.promptMeaning}>({currentTarget.vietnamese} {currentTarget.emoji})</Text>
            <TouchableOpacity
              style={styles.promptSpeakBtn}
              onPress={() => soundManager.speak(`Bé hãy bắn vào chữ ${currentTarget.english}, nghĩa là ${currentTarget.vietnamese}`, 'vi')}
              activeOpacity={0.7}
            >
              <Text style={styles.promptSpeakText}>🔊</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* SPACESHIP */}
        <View style={styles.shipContainer}>
          <View style={styles.ship}>
            <Text style={styles.shipEmoji}>🚀</Text>
            <Animated.View style={[styles.shipFlame, {
              opacity: shipFlame,
              transform: [{ scaleY: shipFlame.interpolate({ inputRange: [0.6, 1], outputRange: [0.7, 1.2] }) }],
            }]}>
              <Text style={styles.flameEmoji}>🔥</Text>
            </Animated.View>
          </View>
        </View>

        {/* PROGRESS BAR */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${(round / Math.max(totalRounds, 1)) * 100}%` as any }]} />
        </View>

        {/* FLASH OVERLAY */}
        {showFlash && (
          <Animated.View style={[styles.flashOverlay, { backgroundColor: flashColor, opacity: flashAnim }]} pointerEvents="none" />
        )}
      </Animated.View>
    </SafeAreaView>
  );
};

// ============================================================
// STYLES
// ============================================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E27' },
  gameArea: { flex: 1 },
  star: { position: 'absolute', backgroundColor: '#FFFFFF' },

  // TOPIC SELECTOR
  topicHeader: { alignItems: 'center', paddingBottom: 16, zIndex: 10 },
  backBtn: { position: 'absolute', right: 16, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  backBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  topicTitle: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', textAlign: 'center', marginBottom: 6 },
  topicSubtitle: { fontSize: 14, color: '#94A3B8', textAlign: 'center' },
  topicGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 10, justifyContent: 'center', paddingBottom: 40 },
  topicCard: { width: '30%', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 12, alignItems: 'center', borderWidth: 1.5 },
  topicIcon: { fontSize: 32, marginBottom: 6 },
  topicName: { fontSize: 11, fontWeight: '700', color: '#E2E8F0', textAlign: 'center', marginBottom: 2 },
  topicCount: { fontSize: 10, color: '#64748B', fontWeight: '600' },

  // GAME HEADER
  gameHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 8, zIndex: 20 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scoreText: { color: '#FFD700', fontSize: 18, fontWeight: '900' },
  comboText: { color: '#FF6B35', fontSize: 14, fontWeight: '800', backgroundColor: 'rgba(255,107,53,0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  headerCenter: { alignItems: 'center' },
  livesText: { fontSize: 18 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  roundText: { color: '#94A3B8', fontSize: 13, fontWeight: '700' },
  closeGameBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.12)', justifyContent: 'center', alignItems: 'center' },
  closeGameBtnText: { color: '#94A3B8', fontSize: 16, fontWeight: '700' },

  // ASTEROIDS
  asteroidContainer: { position: 'absolute', zIndex: 10 },
  asteroid: { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 8, elevation: 8, borderWidth: 2, borderColor: 'rgba(255,255,255,0.25)' },
  asteroidEmoji: { fontSize: 24, marginBottom: 2 },
  asteroidText: { color: '#FFFFFF', fontSize: 12, fontWeight: '900', textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },

  // LASER BEAM
  beamContainer: {
    position: 'absolute',
    height: 16,
    transformOrigin: 'left center',
    zIndex: 15,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  beamGlowOuter: {
    height: 6,
    backgroundColor: 'rgba(251, 191, 36, 0.35)',
    borderRadius: 3,
  },
  beamCore: {
    height: 4,
    backgroundColor: '#FBBF24',
    borderRadius: 2,
    shadowColor: '#FBBF24',
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 10,
  },
  beamInner: {
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
    marginTop: -3,
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },

  // PARTICLES
  particle: { position: 'absolute', width: 10, height: 10, borderRadius: 5, zIndex: 25 },
  fireworkDot: { position: 'absolute', width: 7, height: 7, borderRadius: 3.5, zIndex: 25 },

  // PROMPT
  promptBubble: { position: 'absolute', bottom: 180, left: 20, right: 20, backgroundColor: 'rgba(30, 41, 59, 0.92)', borderRadius: 20, paddingVertical: 14, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', borderWidth: 1.5, borderColor: 'rgba(99, 102, 241, 0.5)', gap: 6, zIndex: 30 },
  promptText: { color: '#E2E8F0', fontSize: 15, fontWeight: '700', textAlign: 'center' },
  promptHighlight: { color: '#FBBF24', fontWeight: '900', fontSize: 17 },
  promptMeaning: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  promptSpeakBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(99, 102, 241, 0.3)', justifyContent: 'center', alignItems: 'center' },
  promptSpeakText: { fontSize: 18 },

  // SPACESHIP
  shipContainer: { position: 'absolute', bottom: 80, left: 0, right: 0, alignItems: 'center', zIndex: 20 },
  ship: { alignItems: 'center' },
  shipEmoji: { fontSize: 52 },
  shipFlame: { marginTop: -12 },
  flameEmoji: { fontSize: 24 },

  // PROGRESS BAR
  progressBarContainer: { position: 'absolute', bottom: 60, left: 20, right: 20, height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, zIndex: 20 },
  progressBar: { height: 6, backgroundColor: '#6366F1', borderRadius: 3 },

  // FLASH
  flashOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 50 },

  // GAME OVER
  gameOverContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30, zIndex: 10 },
  gameOverEmoji: { fontSize: 72, marginBottom: 16 },
  gameOverTitle: { fontSize: 26, fontWeight: '900', color: '#FFFFFF', textAlign: 'center', marginBottom: 6 },
  gameOverSubtitle: { fontSize: 16, color: '#94A3B8', fontWeight: '600', marginBottom: 24 },
  statsContainer: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: 20, gap: 20, marginBottom: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '900', color: '#FFD700', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
  replayBtn: { backgroundColor: '#6366F1', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 16, marginBottom: 12, width: '100%', alignItems: 'center', shadowColor: '#6366F1', shadowOpacity: 0.4, shadowRadius: 10, elevation: 5 },
  replayBtnText: { color: '#FFF', fontSize: 17, fontWeight: '800' },
  changeTopicBtn: { backgroundColor: 'rgba(255,255,255,0.1)', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 14, marginBottom: 12, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  changeTopicBtnText: { color: '#E2E8F0', fontSize: 15, fontWeight: '700' },
  exitBtn: { paddingVertical: 10 },
  exitBtnText: { color: '#64748B', fontSize: 14, fontWeight: '600' },
});

export default SpaceShooterGameScreen;
