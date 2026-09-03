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
  Platform,
} from 'react-native';
import { ThemeConfig } from '../services/themes';

interface Bubble {
  id: string;
  x: number;
  y: Animated.Value;
  size: number;
  color: string;
  borderColor: string;
  colorName: string;
  content: string;
  type: 'standard' | 'rainbow' | 'bonus_time';
  points: number;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  animX: Animated.Value;
  animY: Animated.Value;
  animScale: Animated.Value;
  animOpacity: Animated.Value;
  animRotate: Animated.Value;
  char: string;
  color: string;
  size: number;
}

interface Shockwave {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  animScale: Animated.Value;
  animOpacity: Animated.Value;
}

interface FloatingScore {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  animY: Animated.Value;
  animOpacity: Animated.Value;
  animScale: Animated.Value;
}

interface BubblePopGameScreenProps {
  theme?: ThemeConfig;
  onClose: () => void;
}

type GameMode = 'colors' | 'free' | 'numbers';

const BUBBLE_COLORS = [
  { name: 'Đỏ', bg: '#EF4444', border: '#DC2626', glow: 'rgba(239, 68, 68, 0.45)', emoji: '🔴' },
  { name: 'Xanh Lá', bg: '#10B981', border: '#059669', glow: 'rgba(16, 185, 129, 0.45)', emoji: '🟢' },
  { name: 'Xanh Dương', bg: '#3B82F6', border: '#2563EB', glow: 'rgba(59, 130, 246, 0.45)', emoji: '🔵' },
  { name: 'Vàng', bg: '#FBBF24', border: '#D97706', glow: 'rgba(251, 191, 36, 0.45)', emoji: '🟡' },
  { name: 'Hồng', bg: '#EC4899', border: '#DB2777', glow: 'rgba(236, 72, 153, 0.45)', emoji: '🌸' },
  { name: 'Tím', bg: '#8B5CF6', border: '#7C3AED', glow: 'rgba(139, 92, 246, 0.45)', emoji: '🟣' },
  { name: 'Cam', bg: '#F97316', border: '#EA580C', glow: 'rgba(249, 115, 22, 0.45)', emoji: '🟠' },
];

const PRAISE_MESSAGES = [
  '⭐ TUYỆT VỜI!',
  '🎉 CHÍNH XÁC!',
  '🌟 BÉ GIỎI QUÁ!',
  '🔥 XUẤT SẮC!',
  '👏 HOAN HÔ!',
];

export const BubblePopGameScreen: React.FC<BubblePopGameScreenProps> = ({ onClose }) => {
  const { width, height } = useWindowDimensions();
  const gameAreaHeight = height - 190;

  const [mode, setMode] = useState<GameMode>('colors');
  const [score, setScore] = useState<number>(0);
  const [poppedCount, setPoppedCount] = useState<number>(0);
  const [targetPops] = useState<number>(20);
  const [combo, setCombo] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(50);
  const [targetColor, setTargetColor] = useState(BUBBLE_COLORS[0]);
  const [colorQuestCount, setColorQuestCount] = useState<number>(0);
  const [colorQuestTarget] = useState<number>(3); // Nổ 3 bóng cùng màu để chuyển màu tiếp
  const [voiceText, setVoiceText] = useState<string>('Bé hãy tìm và làm nổ bóng màu Đỏ nhé!');
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState<boolean>(false);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);
  const [isSuperJackpot, setIsSuperJackpot] = useState<boolean>(false);

  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [shockwaves, setShockwaves] = useState<Shockwave[]>([]);
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);
  const [skyLayout, setSkyLayout] = useState<{ y: number; height: number }>({ y: 190, height: 500 });

  const comboTimerRef = useRef<any>(null);
  const spawnTimerRef = useRef<any>(null);
  const reminderTimerRef = useRef<any>(null);
  const victoryScale = useRef(new Animated.Value(0.3)).current;
  const questGlowAnim = useRef(new Animated.Value(0.8)).current;

  // Giọng đọc tiếng Việt (Speech Synthesis Web API hoặc Visual Audio Wave)
  const speakVoice = useCallback(
    (text: string) => {
      setVoiceText(text);
      if (isSoundMuted) return;

      setIsVoiceSpeaking(true);
      const globalObj = typeof globalThis !== 'undefined' ? (globalThis as any) : {};
      const win = globalObj.window || globalObj;

      if (win && win.speechSynthesis && win.SpeechSynthesisUtterance) {
        try {
          win.speechSynthesis.cancel();
          const utterance = new win.SpeechSynthesisUtterance(text);
          utterance.lang = 'vi-VN';
          utterance.rate = 0.92;
          utterance.pitch = 1.15;
          utterance.onend = () => setIsVoiceSpeaking(false);
          utterance.onerror = () => setIsVoiceSpeaking(false);
          win.speechSynthesis.speak(utterance);
        } catch {
          setTimeout(() => setIsVoiceSpeaking(false), 2200);
        }
      } else {
        setTimeout(() => setIsVoiceSpeaking(false), 2200);
      }
    },
    [isSoundMuted]
  );

  // Hiệu ứng nhịp đập phát sáng viền cho khung mục tiêu
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(questGlowAnim, {
          toValue: 1.15,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(questGlowAnim, {
          toValue: 0.85,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [questGlowAnim]);

  // 1. Khởi động màn chơi mới
  const startNewGame = useCallback(() => {
    setScore(0);
    setPoppedCount(0);
    setCombo(0);
    setColorQuestCount(0);
    setTimeLeft(mode === 'free' ? 50 : 45);
    setIsVictory(false);
    setIsGameOver(false);
    setIsSuperJackpot(false);
    setBubbles([]);
    setParticles([]);
    setShockwaves([]);
    setFloatingScores([]);

    const initialColor = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
    setTargetColor(initialColor);
    setIsGameActive(true);

    if (mode === 'colors') {
      setTimeout(() => {
        speakVoice(`Bé ơi, hãy tìm và làm nổ quả bóng màu ${initialColor.name} nhé!`);
      }, 400);
    } else if (mode === 'numbers') {
      setTimeout(() => {
        speakVoice('Bé ơi, hãy nổ các quả bóng chữ số và nhận thật nhiều điểm nhé!');
      }, 400);
    } else {
      setTimeout(() => {
        speakVoice('Chào bé yêu! Bé hãy chạm làm nổ thật nhiều bong bóng rực rỡ nhé!');
      }, 400);
    }
  }, [mode, speakVoice]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // 2. Bộ đếm ngược thời gian
  useEffect(() => {
    let timer: any = null;
    if (isGameActive && !isVictory && !isGameOver) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsGameActive(false);
            setIsGameOver(true);
            speakVoice('Hết giờ rồi bé ơi! Bé hãy thử lại cùng ba mẹ nhé!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isGameActive, isVictory, isGameOver, speakVoice]);

  // 3. Tự động nhắc lại nếu bé chưa chạm đúng màu sau 9 giây
  useEffect(() => {
    if (!isGameActive || mode !== 'colors' || isVictory || isGameOver) return;

    if (reminderTimerRef.current) clearTimeout(reminderTimerRef.current);
    reminderTimerRef.current = setTimeout(() => {
      speakVoice(`Quả bóng màu ${targetColor.name} đang bay lên kìa, bé chạm vào nó đi nào!`);
    }, 9000);

    return () => {
      if (reminderTimerRef.current) clearTimeout(reminderTimerRef.current);
    };
  }, [targetColor, isGameActive, mode, isVictory, isGameOver, speakVoice, colorQuestCount]);

  // 4. Vòng lặp sinh bong bóng ngẫu nhiên bay lên
  useEffect(() => {
    if (!isGameActive || isVictory || isGameOver) return;

    const spawnBubble = () => {
      const bubbleSize = Math.floor(Math.random() * 22) + 68; // 68px - 90px
      const minX = 16;
      const maxX = width - bubbleSize - 16;
      const posX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;

      // Ưu tiên 50% xác suất ra màu mục tiêu để bé dễ dàng tìm thấy
      let randomColor = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
      if (mode === 'colors' && Math.random() < 0.5) {
        randomColor = targetColor;
      }

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
          pts = 25;
        } else {
          content = randomColor.emoji;
        }
      }

      const bubbleAnimY = new Animated.Value(gameAreaHeight + 25);
      const newBubble: Bubble = {
        id: `bubble_${Date.now()}_${Math.random()}`,
        x: posX,
        y: bubbleAnimY,
        size: bubbleSize,
        color: bubbleType === 'rainbow' ? '#F43F5E' : bubbleType === 'bonus_time' ? '#0EA5E9' : randomColor.bg,
        borderColor: bubbleType === 'rainbow' ? '#FFE4E6' : bubbleType === 'bonus_time' ? '#BAE6FD' : randomColor.border,
        colorName: randomColor.name,
        content: content,
        type: bubbleType,
        points: pts,
      };

      setBubbles((prev) => [...prev.slice(-14), newBubble]);

      // Tốc độ bay lên (4 - 6.2 giây)
      const duration = Math.floor(Math.random() * 2200) + 4000;
      Animated.timing(bubbleAnimY, {
        toValue: -110,
        duration: duration,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setBubbles((curr) => curr.filter((b) => b.id !== newBubble.id));
        }
      });
    };

    spawnTimerRef.current = setInterval(spawnBubble, 750);

    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, [isGameActive, isVictory, isGameOver, width, gameAreaHeight, mode, targetColor]);

  // 5. Hệ thống hiệu ứng nổ hạt đa tầng (Multi-Layered Particle & Shockwave VFX)
  const triggerSuperPopVFX = (x: number, y: number, bubbleColor: string, isTargetMatch: boolean) => {
    const shockwaveId = `shock_${Date.now()}_${Math.random()}`;
    const animScale = new Animated.Value(0.4);
    const animOpacity = new Animated.Value(1);

    const newShockwave: Shockwave = {
      id: shockwaveId,
      x: x - 40,
      y: y - 40,
      size: 80,
      color: isTargetMatch ? '#F59E0B' : bubbleColor,
      animScale,
      animOpacity,
    };

    setShockwaves((prev) => [...prev, newShockwave]);

    Animated.parallel([
      Animated.timing(animScale, {
        toValue: 2.5,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(animOpacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShockwaves((prev) => prev.filter((s) => s.id !== shockwaveId));
    });

    // 18 - 24 hạt đa sắc bay 360 độ kèm trọng lực và xoay
    const particleCount = isTargetMatch ? 22 : 14;
    const PARTICLE_CHARS = isTargetMatch
      ? ['⭐', '✨', '💎', '🎉', '🌟', '🎊']
      : ['✨', '🎈', '⭐', '💥', '✨'];

    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
      const speed = Math.random() * 95 + 45;
      const targetDistX = Math.cos(angle) * speed;
      const targetDistY = Math.sin(angle) * speed + 25; // Hơi kéo xuống do trọng lực

      const pAnimX = new Animated.Value(0);
      const pAnimY = new Animated.Value(0);
      const pAnimScale = new Animated.Value(Math.random() * 0.5 + 0.8);
      const pAnimOpacity = new Animated.Value(1);
      const pAnimRotate = new Animated.Value(0);

      const pId = `p_${Date.now()}_${i}_${Math.random()}`;
      newParticles.push({
        id: pId,
        x,
        y,
        animX: pAnimX,
        animY: pAnimY,
        animScale: pAnimScale,
        animOpacity: pAnimOpacity,
        animRotate: pAnimRotate,
        char: PARTICLE_CHARS[i % PARTICLE_CHARS.length],
        color: bubbleColor,
        size: Math.floor(Math.random() * 8) + 16,
      });

      Animated.parallel([
        Animated.timing(pAnimX, {
          toValue: targetDistX,
          duration: 550,
          useNativeDriver: true,
        }),
        Animated.timing(pAnimY, {
          toValue: targetDistY,
          duration: 550,
          useNativeDriver: true,
        }),
        Animated.timing(pAnimScale, {
          toValue: 0.2,
          duration: 550,
          useNativeDriver: true,
        }),
        Animated.timing(pAnimOpacity, {
          toValue: 0,
          duration: 550,
          useNativeDriver: true,
        }),
        Animated.timing(pAnimRotate, {
          toValue: 1,
          duration: 550,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setParticles((prev) => prev.filter((p) => p.id !== pId));
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);
  };

  // 6. Xử lý khi bé chạm làm nổ bong bóng (Nổ ngay tức thì)
  const handlePopBubble = (
    bubble: Bubble,
    touchPageX?: number,
    touchPageY?: number
  ) => {
    const isTargetMatch =
      mode === 'colors'
        ? bubble.colorName === targetColor.name ||
          bubble.color === targetColor.bg ||
          bubble.type === 'rainbow' ||
          bubble.type === 'bonus_time'
        : true;

    // Tính tọa độ nổ tại đúng điểm chạm ngón tay
    const popX = touchPageX !== undefined ? Math.max(20, Math.min(width - 40, touchPageX)) : bubble.x + bubble.size / 2;
    const popY = touchPageY !== undefined ? Math.max(20, touchPageY - (skyLayout.y || 190)) : gameAreaHeight / 2;

    // Kích hoạt hiệu ứng nổ hạt đa tầng VFX ngay tại điểm chạm
    triggerSuperPopVFX(popX, popY, bubble.color, isTargetMatch);

    // XÓA BÓNG KHỎI MÀN HÌNH NGAY LẬP TỨC (Instant Pop!)
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
      earnedPts += nextCombo * 5;
    }

    let popupText = `+${earnedPts} ⭐`;

    // Phân loại chế độ chơi
    if (bubble.type === 'rainbow') {
      popupText = `🌈 SIÊU NỔ CẦU VỒNG +${earnedPts}!`;
      setIsSuperJackpot(true);
      setTimeout(() => setIsSuperJackpot(false), 2000);
      setBubbles([]);
      speakVoice('Siêu nổ cầu vồng toàn màn hình! Hoan hô bé!');
    } else if (bubble.type === 'bonus_time') {
      popupText = `⏰ +5 GIÂY!`;
      setTimeLeft((t) => t + 5);
      speakVoice('Cộng thêm năm giây!');
    } else if (mode === 'colors') {
      if (isTargetMatch) {
        earnedPts *= 2;
        const nextCount = colorQuestCount + 1;
        setColorQuestCount(nextCount);

        const praise = PRAISE_MESSAGES[Math.floor(Math.random() * PRAISE_MESSAGES.length)];
        popupText = `${praise} +${earnedPts}`;

        if (nextCount >= colorQuestTarget) {
          // Hoàn thành bộ màu này -> Chuyển màu kế tiếp ngay
          setColorQuestCount(0);
          const nextColor = BUBBLE_COLORS.filter((c) => c.name !== targetColor.name)[
            Math.floor(Math.random() * (BUBBLE_COLORS.length - 1))
          ];
          setTargetColor(nextColor);
          speakVoice(`Chính xác rồi! Tiếp theo, bé hãy tìm bóng màu ${nextColor.name} nhé!`);
        } else {
          speakVoice(`Đúng màu ${targetColor.name} rồi! Thêm ${colorQuestTarget - nextCount} quả nữa nhé!`);
        }
      } else {
        // Chạm bóng khác màu -> Nhắc nhở tích cực
        speakVoice(`Bóng màu ${bubble.colorName}! Bé hãy tìm bóng màu ${targetColor.name} nhé!`);
        popupText = `${bubble.colorName} +${earnedPts}`;
      }
    } else {
      if (nextCombo >= 3) {
        popupText = `COMBO x${nextCombo}! +${earnedPts}`;
      }
    }

    setScore((s) => s + earnedPts);
    const nextPops = poppedCount + 1;
    setPoppedCount(nextPops);

    // Hiệu ứng chữ nổi tại đúng điểm nổ
    showFloatingText(
      popX,
      popY,
      popupText,
      isTargetMatch ? '#10B981' : '#3B82F6'
    );

    // Kiểm tra chiến thắng
    if (nextPops >= targetPops) {
      handleVictory();
    }
  };

  // Hiệu ứng chữ điểm số nổi bồng bềnh
  const showFloatingText = (x: number, y: number, text: string, color: string) => {
    const animOpacity = new Animated.Value(1);
    const animY = new Animated.Value(0);
    const animScale = new Animated.Value(0.7);

    const floatItem: FloatingScore = {
      id: `score_${Date.now()}_${Math.random()}`,
      x: Math.max(12, Math.min(width - 120, x - 40)),
      y: y,
      text,
      color,
      animY,
      animOpacity,
      animScale,
    };

    setFloatingScores((prev) => [...prev, floatItem]);

    Animated.parallel([
      Animated.spring(animScale, {
        toValue: 1.2,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(animY, {
        toValue: -50,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(450),
        Animated.timing(animOpacity, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setFloatingScores((prev) => prev.filter((item) => item.id !== floatItem.id));
    });
  };

  // 7. Xử lý chiến thắng
  const handleVictory = () => {
    setIsVictory(true);
    setIsGameActive(false);
    victoryScale.setValue(0.3);
    speakVoice('Hoan hô bé! Bé đã hoàn thành xuất sắc trò chơi nổ bong bóng!');
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
          <Text style={styles.headerTitle}>🎈 Nổ Bong Bóng Kỳ Diệu</Text>
          <Text style={styles.headerSub}>Thợ Săn Màu Sắc & Giọng Đọc Thông Minh</Text>
        </View>

        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={[styles.audioToggleBtn, isSoundMuted && styles.audioToggleBtnMuted]}
            onPress={() => setIsSoundMuted(!isSoundMuted)}
            activeOpacity={0.7}
          >
            <Text style={styles.audioToggleText}>{isSoundMuted ? '🔇' : '🔊'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.restartBtn} onPress={startNewGame} activeOpacity={0.7}>
            <Text style={styles.restartBtnText}>🔄</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. BANNER GIỌNG ĐỌC & YÊU CẦU NHIỆM VỤ */}
      <View style={styles.voicePromptBanner}>
        <TouchableOpacity
          style={styles.speakerPill}
          onPress={() => speakVoice(voiceText)}
          activeOpacity={0.8}
        >
          <Text style={[styles.speakerIcon, isVoiceSpeaking && styles.speakerIconPulsing]}>
            {isVoiceSpeaking ? '📢' : '🗣️'}
          </Text>
          <Text style={styles.voicePromptText} numberOfLines={2}>
            {voiceText}
          </Text>
          <Text style={styles.tapToReplayHint}>[Nghe Lại]</Text>
        </TouchableOpacity>
      </View>

      {/* 3. THANH ĐIỀU KHIỂN & BẢNG TIẾN ĐỘ */}
      <View style={styles.topControlPanel}>
        {/* Chọn Chế Độ Chơi */}
        <View style={styles.modeRow}>
          {[
            { key: 'colors', label: '🎨 Thợ Săn Màu' },
            { key: 'free', label: '🎈 Nổ Tự Do' },
            { key: 'numbers', label: '🔢 Học Số' },
          ].map((item) => {
            const isSelected = mode === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.modePill, isSelected && styles.modePillActive]}
                onPress={() => setMode(item.key as GameMode)}
                activeOpacity={0.8}
              >
                <Text style={[styles.modePillText, isSelected && styles.modePillTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Khung Màu Mục Tiêu (Ở Chế Độ Tìm Màu) */}
        {mode === 'colors' && (
          <Animated.View
            style={[
              styles.targetColorBox,
              {
                backgroundColor: targetColor.bg,
                shadowColor: targetColor.bg,
                transform: [{ scale: questGlowAnim }],
              },
            ]}
          >
            <View style={styles.targetColorLeft}>
              <Text style={styles.targetColorEmoji}>{targetColor.emoji}</Text>
              <Text style={styles.targetColorText}>
                Tìm bóng: <Text style={styles.targetColorNameHighlight}>{targetColor.name.toUpperCase()}</Text>
              </Text>
            </View>
            <View style={styles.targetQuestProgressBadge}>
              <Text style={styles.targetQuestProgressText}>
                {colorQuestCount}/{colorQuestTarget} quả ⭐
              </Text>
            </View>
          </Animated.View>
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

      {/* 4. KHÔNG GIAN BẦU TRỜI CHO BONG BÓNG BAY (GAME PLAYGROUND) */}
      <View
        style={styles.skyArea}
        onLayout={(e) => setSkyLayout(e.nativeEvent.layout)}
      >
        {/* Nền mây trang trí */}
        <Text style={[styles.cloudDecor, { top: 20, left: 16 }]}>☁️</Text>
        <Text style={[styles.cloudDecor, { top: 70, right: 24 }]}>☁️</Text>
        <Text style={[styles.cloudDecor, { top: 150, left: 50 }]}>⛅</Text>

        {/* HIỆU ỨNG SIÊU JACKPOT CẦU VỒNG */}
        {isSuperJackpot && (
          <View style={styles.superJackpotOverlay}>
            <Text style={styles.superJackpotText}>🌈 SIÊU NỔ CẦU VỒNG! 🌈</Text>
          </View>
        )}

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
              activeOpacity={0.3}
              onPressIn={(e) => {
                const { pageX, pageY } = e.nativeEvent;
                handlePopBubble(b, pageX, pageY);
              }}
            >
              {/* Vệt sáng 3D bóng bẩy trên quả bóng */}
              <View style={styles.bubbleGloss} />
              <Text style={styles.bubbleContentText}>{b.content}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}

        {/* SÓNG XUNG KÍCH PHÁT SÁNG (SHOCKWAVE VFX) */}
        {shockwaves.map((s) => (
          <Animated.View
            key={s.id}
            style={[
              styles.shockwaveRing,
              {
                left: s.x,
                top: s.y,
                width: s.size,
                height: s.size,
                borderRadius: s.size / 2,
                borderColor: s.color,
                opacity: s.animOpacity,
                transform: [{ scale: s.animScale }],
              },
            ]}
          />
        ))}

        {/* CƠN MƯA HẠT KIM TUYẾN & SAO 3D (PARTICLE EXPLOSION) */}
        {particles.map((p) => {
          const spin = p.animRotate.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '720deg'],
          });
          return (
            <Animated.View
              key={p.id}
              style={[
                styles.particleItem,
                {
                  left: p.x,
                  top: p.y,
                  opacity: p.animOpacity,
                  transform: [
                    { translateX: p.animX },
                    { translateY: p.animY },
                    { scale: p.animScale },
                    { rotate: spin },
                  ],
                },
              ]}
            >
              <Text style={{ fontSize: p.size }}>{p.char}</Text>
            </Animated.View>
          );
        })}

        {/* CHỮ NỔI ĐIỂM SỐ & KHEN THƯỞNG */}
        {floatingScores.map((item) => (
          <Animated.View
            key={item.id}
            style={[
              styles.floatingScoreContainer,
              {
                left: item.x,
                top: item.y,
                opacity: item.animOpacity,
                transform: [
                  { translateY: item.animY },
                  { scale: item.animScale },
                ],
              },
            ]}
          >
            <Text style={[styles.floatingScoreText, { color: item.color }]}>
              {item.text}
            </Text>
          </Animated.View>
        ))}
      </View>

      {/* 5. MODAL CHIẾN THẮNG */}
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

      {/* 6. MODAL HẾT GIỜ (THỬ LẠI) */}
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
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
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
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  headerSub: {
    fontSize: 10.5,
    color: '#BAE6FD',
    marginTop: 1,
    fontWeight: '600',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  audioToggleBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 14,
  },
  audioToggleBtnMuted: {
    backgroundColor: 'rgba(239, 68, 68, 0.4)',
  },
  audioToggleText: {
    fontSize: 14,
  },
  restartBtn: {
    backgroundColor: '#F59E0B',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  restartBtnText: {
    fontSize: 14,
  },

  /* VOICE PROMPT BANNER */
  voicePromptBanner: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  speakerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 8,
  },
  speakerIcon: {
    fontSize: 20,
  },
  speakerIconPulsing: {
    transform: [{ scale: 1.2 }],
  },
  voicePromptText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0369A1',
    lineHeight: 16,
  },
  tapToReplayHint: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284C7',
  },

  /* TOP CONTROL PANEL */
  topControlPanel: {
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 4,
  },
  modeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
    marginBottom: 6,
  },
  modePill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
  },
  modePillActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0369A1',
  },
  modePillText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0369A1',
  },
  modePillTextActive: {
    color: '#FFFFFF',
  },

  targetColorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  targetColorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  targetColorEmoji: {
    fontSize: 18,
  },
  targetColorText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  targetColorNameHighlight: {
    fontSize: 14,
    fontWeight: '900',
    textDecorationLine: 'underline',
  },
  targetQuestProgressBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  targetQuestProgressText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  /* DASHBOARD CARD */
  dashboardCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 8,
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
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 2,
  },
  dashValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  dashDivider: {
    width: 1,
    height: 20,
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
    fontSize: 34,
    opacity: 0.4,
  },

  /* BUBBLE */
  bubbleContainer: {
    position: 'absolute',
    borderWidth: 3.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  bubbleTouchable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bubbleGloss: {
    position: 'absolute',
    top: 7,
    left: 9,
    width: '30%',
    height: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
  },
  bubbleContentText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  /* SHOCKWAVE VFX */
  shockwaveRing: {
    position: 'absolute',
    borderWidth: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 90,
  },

  /* PARTICLE ITEM */
  particleItem: {
    position: 'absolute',
    zIndex: 95,
  },

  /* FLOATING SCORE */
  floatingScoreContainer: {
    position: 'absolute',
    zIndex: 100,
  },
  floatingScoreText: {
    fontSize: 18,
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  /* SUPER JACKPOT */
  superJackpotOverlay: {
    position: 'absolute',
    top: '35%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 99,
  },
  superJackpotText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F43F5E',
    backgroundColor: '#FFF1F2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FB7185',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
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
    fontSize: 54,
    marginBottom: 6,
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
    marginBottom: 14,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  starIcon: {
    fontSize: 34,
  },
  modalStatsBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    gap: 6,
    marginBottom: 18,
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
