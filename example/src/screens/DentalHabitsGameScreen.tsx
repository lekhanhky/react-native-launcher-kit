import React, { useState, useRef, useEffect } from 'react';
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
} from 'react-native';
import { soundManager } from '../components/SoundPlayer';

interface Tooth {
  id: number;
  hasGerm: boolean;
  hasStain: boolean;
  foamLevel: number; // 0 to 3
  isClean: boolean;
}

const CHARACTERS = [
  { id: 'bear', name: 'Gấu Nâu', emoji: '🐻', color: '#D97706' },
  { id: 'dino', name: 'Khủng Long', emoji: '🦖', color: '#10B981' },
  { id: 'puppy', name: 'Cún Bông', emoji: '🐶', color: '#F97316' },
];

export const DentalHabitsGameScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedChar, setSelectedChar] = useState(CHARACTERS[0]);
  const [teeth, setTeeth] = useState<Tooth[]>([]);
  const [cleanCount, setCleanCount] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Sparkle animation
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    soundManager.speak('Chào bé! Hãy giúp bạn gấu đánh răng sạch bóng nhé!', 'vi');
    initTeeth();
  }, []);

  const initTeeth = () => {
    const initialTeeth: Tooth[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      hasGerm: Math.random() > 0.35,
      hasStain: Math.random() > 0.4,
      foamLevel: 0,
      isClean: false,
    }));
    setTeeth(initialTeeth);
    setCleanCount(0);
    setTimerSeconds(120);
    setIsTimerRunning(true);
    setIsFinished(false);
  };

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const brushTooth = (toothId: number) => {
    setTeeth((prevTeeth) => {
      let newlyCleaned = false;
      const updated = prevTeeth.map((t) => {
        if (t.id === toothId) {
          const nextFoam = Math.min(t.foamLevel + 1, 3);
          const clean = nextFoam >= 2;
          if (!t.isClean && clean) newlyCleaned = true;
          return {
            ...t,
            foamLevel: nextFoam,
            hasGerm: clean ? false : t.hasGerm,
            hasStain: clean ? false : t.hasStain,
            isClean: clean,
          };
        }
        return t;
      });

      const totalClean = updated.filter((t) => t.isClean).length;
      setCleanCount(totalClean);

      if (newlyCleaned) {
        soundManager.speak('Xoẹt xoẹt! Sạch một chiếc răng!', 'vi');
      }

      if (totalClean === updated.length) {
        setIsFinished(true);
        setIsTimerRunning(false);
        Animated.timing(sparkleAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
        soundManager.speak('Hoan hô bé! Toàn bộ hàm răng đã trắng tinh sáng bóng!', 'vi');
      }

      return updated;
    });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0891B2" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>🦷 Bé Vui Đánh Răng</Text>
          <Text style={styles.subtitleText}>Thời gian: ⏱️ {formatTime(timerSeconds)} • Sạch: {cleanCount}/12</Text>
        </View>
        <TouchableOpacity style={styles.resetBtn} onPress={initTeeth} activeOpacity={0.7}>
          <Text style={styles.resetBtnText}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* CHARACTER PICKER */}
      <View style={styles.charPicker}>
        {CHARACTERS.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[styles.charCard, selectedChar.id === c.id && styles.charCardActive]}
            onPress={() => {
              setSelectedChar(c);
              initTeeth();
              soundManager.speak(`Bắt đầu đánh răng cho bạn ${c.name}`, 'vi');
            }}
          >
            <Text style={styles.charEmoji}>{c.emoji}</Text>
            <Text style={[styles.charName, selectedChar.id === c.id && styles.charNameActive]}>{c.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* MOUTH & TEETH DISPLAY */}
      <View style={styles.mouthContainer}>
        {/* CHARACTER HEAD */}
        <View style={[styles.charAvatarHeader, { backgroundColor: selectedChar.color + '30' }]}>
          <Text style={styles.hugeAvatar}>{selectedChar.emoji}</Text>
          <Text style={styles.brushTip}>🪥 Chạm vào răng để chải bọt sạch bóng!</Text>
        </View>

        {/* OPEN MOUTH */}
        <View style={styles.openMouth}>
          {/* UPPER TEETH */}
          <View style={styles.teethRow}>
            {teeth.slice(0, 6).map((t) => (
              <TouchableOpacity
                key={t.id}
                style={[
                  styles.tooth,
                  t.isClean && styles.toothClean,
                  t.foamLevel > 0 && styles.toothFoamy,
                ]}
                activeOpacity={0.75}
                onPress={() => brushTooth(t.id)}
              >
                {t.hasGerm && <Text style={styles.germEmoji}>👾</Text>}
                {t.hasStain && !t.hasGerm && <Text style={styles.stainEmoji}>🍫</Text>}
                {t.foamLevel > 0 && !t.isClean && <Text style={styles.foamEmoji}>🫧</Text>}
                {t.isClean && <Text style={styles.sparkleEmoji}>✨</Text>}
              </TouchableOpacity>
            ))}
          </View>

          {/* TONGUE */}
          <View style={styles.tongue}>
            <Text style={styles.tongueEmoji}>👅</Text>
          </View>

          {/* LOWER TEETH */}
          <View style={styles.teethRow}>
            {teeth.slice(6, 12).map((t) => (
              <TouchableOpacity
                key={t.id}
                style={[
                  styles.tooth,
                  t.isClean && styles.toothClean,
                  t.foamLevel > 0 && styles.toothFoamy,
                ]}
                activeOpacity={0.75}
                onPress={() => brushTooth(t.id)}
              >
                {t.hasGerm && <Text style={styles.germEmoji}>👾</Text>}
                {t.hasStain && !t.hasGerm && <Text style={styles.stainEmoji}>🍫</Text>}
                {t.foamLevel > 0 && !t.isClean && <Text style={styles.foamEmoji}>🫧</Text>}
                {t.isClean && <Text style={styles.sparkleEmoji}>✨</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* TOOTHBRUSH ACTION BAR */}
      <View style={styles.brushActionBar}>
        <View style={styles.brushIconContainer}>
          <Text style={styles.brushBigIcon}>🪥</Text>
        </View>
        <Text style={styles.brushTipText}>
          {isFinished
            ? '⭐ Răng trắng xinh thơm tho rồi!'
            : 'Chải răng 2 lần mỗi ngày sau ăn & trước khi ngủ nhé!'}
        </Text>
      </View>

      {/* SUCCESS OVERLAY */}
      {isFinished && (
        <View style={styles.finishOverlay}>
          <Text style={styles.finishEmoji}>⭐ 🪥 🌟</Text>
          <Text style={styles.finishTitle}>HÀM RĂNG TỎA SÁNG!</Text>
          <Text style={styles.finishSubtitle}>Bạn {selectedChar.name} cảm ơn bé rất nhiều!</Text>
          <TouchableOpacity style={styles.playAgainBtn} onPress={initTeeth} activeOpacity={0.8}>
            <Text style={styles.playAgainText}>🦷 Đánh Lại Nào</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E7490',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 8,
    paddingBottom: 8,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
  },
  titleContainer: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  subtitleText: {
    fontSize: 12,
    color: '#CFFAFE',
    marginTop: 2,
  },
  resetBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetBtnText: {
    fontSize: 18,
  },
  charPicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  charCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  charCardActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FDE047',
  },
  charEmoji: {
    fontSize: 20,
  },
  charName: {
    color: '#E0F2FE',
    fontWeight: '700',
    fontSize: 12,
  },
  charNameActive: {
    color: '#0E7490',
  },
  mouthContainer: {
    flex: 1,
    marginHorizontal: 16,
    backgroundColor: '#164E63',
    borderRadius: 24,
    padding: 14,
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  charAvatarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
    gap: 12,
  },
  hugeAvatar: {
    fontSize: 36,
  },
  brushTip: {
    color: '#CFFAFE',
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  openMouth: {
    flex: 1,
    backgroundColor: '#881337',
    borderRadius: 30,
    marginVertical: 10,
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 6,
    borderColor: '#F43F5E',
  },
  teethRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tooth: {
    width: 44,
    height: 48,
    backgroundColor: '#FDE68A',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D97706',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  toothClean: {
    backgroundColor: '#FFFFFF',
    borderColor: '#38BDF8',
  },
  toothFoamy: {
    borderColor: '#67E8F9',
  },
  germEmoji: {
    fontSize: 20,
  },
  stainEmoji: {
    fontSize: 18,
  },
  foamEmoji: {
    fontSize: 22,
  },
  sparkleEmoji: {
    fontSize: 22,
  },
  tongue: {
    alignItems: 'center',
  },
  tongueEmoji: {
    fontSize: 40,
    opacity: 0.8,
  },
  brushActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 10,
    borderRadius: 16,
    gap: 10,
  },
  brushIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FDE047',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brushBigIcon: {
    fontSize: 24,
  },
  brushTipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  finishOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
    padding: 20,
  },
  finishEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  finishTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FDE047',
  },
  finishSubtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'center',
  },
  playAgainBtn: {
    marginTop: 20,
    backgroundColor: '#06B6D4',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 16,
  },
  playAgainText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default DentalHabitsGameScreen;
