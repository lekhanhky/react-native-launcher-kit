import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
  Platform,
  ScrollView,
  Easing,
} from 'react-native';
import { soundManager } from '../components/SoundPlayer';

// ============================================================
// 🐾 DATA: 6 Pets với màu Pastel tươi sáng cho bé
// ============================================================

interface Pet {
  id: string;
  nameVi: string;
  emoji: string;
  bgGradientStart: string;
  bgGradientEnd: string;
  headerColor: string;
  soundText: string;
  funFact: string;
  unlockStars: number; // Số sao cần để mở khóa pet này
}

const PETS: Pet[] = [
  {
    id: 'puppy',
    nameVi: 'Cún Bông',
    emoji: '🐶',
    bgGradientStart: '#FDE68A',
    bgGradientEnd: '#FEF3C7',
    headerColor: '#92400E',
    soundText: 'Gâu gâu! Gâu gâu!',
    funFact: 'Cún có thính giác tốt gấp 4 lần con người!',
    unlockStars: 0,
  },
  {
    id: 'kitty',
    nameVi: 'Mèo Miu',
    emoji: '🐱',
    bgGradientStart: '#FBCFE8',
    bgGradientEnd: '#FDF2F8',
    headerColor: '#9D174D',
    soundText: 'Meo meo! Meo meo!',
    funFact: 'Mèo có thể nhảy cao gấp 6 lần chiều dài cơ thể!',
    unlockStars: 0,
  },
  {
    id: 'bunny',
    nameVi: 'Thỏ Trắng',
    emoji: '🐰',
    bgGradientStart: '#A7F3D0',
    bgGradientEnd: '#ECFDF5',
    headerColor: '#065F46',
    soundText: 'Nhảy nhảy! Sột soạt!',
    funFact: 'Thỏ có thể xoay tai 180 độ để nghe mọi hướng!',
    unlockStars: 3,
  },
  {
    id: 'hamster',
    nameVi: 'Chuột Hamster',
    emoji: '🐹',
    bgGradientStart: '#E9D5FF',
    bgGradientEnd: '#FAF5FF',
    headerColor: '#6B21A8',
    soundText: 'Chít chít! Chít chít!',
    funFact: 'Hamster có thể nhét thức ăn đầy 2 bên má!',
    unlockStars: 6,
  },
  {
    id: 'bear',
    nameVi: 'Gấu Nâu',
    emoji: '🐻',
    bgGradientStart: '#FED7AA',
    bgGradientEnd: '#FFF7ED',
    headerColor: '#9A3412',
    soundText: 'Gầm gừ! Gừm gừm!',
    funFact: 'Gấu rất thích mật ong và có thể ngửi mật từ xa!',
    unlockStars: 10,
  },
  {
    id: 'penguin',
    nameVi: 'Cánh Cụt',
    emoji: '🐧',
    bgGradientStart: '#BAE6FD',
    bgGradientEnd: '#F0F9FF',
    headerColor: '#0C4A6E',
    soundText: 'Quác quác! Quác quác!',
    funFact: 'Cánh cụt có thể nhịn thở dưới nước tới 20 phút!',
    unlockStars: 15,
  },
];

// ============================================================
// 🎮 DATA: 4 hành động chăm sóc
// ============================================================

interface CareAction {
  id: string;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  reactionEmojis: string[];
  soundPhrase: string;
  starsReward: number;
}

const CARE_ACTIONS: CareAction[] = [
  {
    id: 'feed',
    label: 'Cho Ăn',
    emoji: '🍖',
    color: '#DC2626',
    bgColor: '#FEE2E2',
    reactionEmojis: ['😋', '🍗', '🥩', '🍎', '⭐'],
    soundPhrase: 'Ngon quá! Cảm ơn bé!',
    starsReward: 1,
  },
  {
    id: 'bath',
    label: 'Tắm Rửa',
    emoji: '🛁',
    color: '#2563EB',
    bgColor: '#DBEAFE',
    reactionEmojis: ['🫧', '💧', '🧼', '🚿', '✨'],
    soundPhrase: 'Sạch bóng mát mẻ rồi!',
    starsReward: 1,
  },
  {
    id: 'play',
    label: 'Chơi Bóng',
    emoji: '⚽',
    color: '#16A34A',
    bgColor: '#DCFCE7',
    reactionEmojis: ['🎾', '🏐', '🎈', '🎉', '⭐'],
    soundPhrase: 'Vui quá! Chơi nữa đi bé!',
    starsReward: 1,
  },
  {
    id: 'pet',
    label: 'Vuốt Ve',
    emoji: '💕',
    color: '#DB2777',
    bgColor: '#FCE7F3',
    reactionEmojis: ['💖', '💗', '💝', '🥰', '😍'],
    soundPhrase: 'Dễ chịu quá! Bé dịu dàng lắm!',
    starsReward: 1,
  },
];

// ============================================================
// 📊 MOOD States
// ============================================================

interface MoodState {
  emoji: string;
  label: string;
  color: string;
}

const MOODS: Record<string, MoodState> = {
  hungry: { emoji: '😿', label: 'Đang đói', color: '#EF4444' },
  normal: { emoji: '😊', label: 'Vui vẻ', color: '#F59E0B' },
  happy: { emoji: '🥰', label: 'Rất vui', color: '#10B981' },
  ecstatic: { emoji: '🤩', label: 'Siêu vui', color: '#8B5CF6' },
};

// ============================================================
// 🎮 MAIN COMPONENT
// ============================================================

export const PetCareGameScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  // State
  const [selectedPetIdx, setSelectedPetIdx] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [careCount, setCareCount] = useState(0); // Tổng số lần chăm sóc
  const [floatingEmojis, setFloatingEmojis] = useState<
    { id: number; emoji: string; x: number }[]
  >([]);
  const [showVictory, setShowVictory] = useState(false);

  // Mood tracking per pet
  const [petMoods, setPetMoods] = useState<Record<string, number>>(() => {
    const moods: Record<string, number> = {};
    PETS.forEach((p) => (moods[p.id] = 0));
    return moods;
  });

  // Animations
  const petBounce = useRef(new Animated.Value(1)).current;
  const petWiggle = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(0)).current;
  const starPop = useRef(new Animated.Value(0)).current;
  const idleAnim = useRef(new Animated.Value(0)).current;
  const floatAnims = useRef<Map<number, Animated.Value>>(new Map());
  let emojiCounter = useRef(0);

  const currentPet = PETS[selectedPetIdx]!;

  // Calculate mood
  const getMoodKey = (moodVal: number): string => {
    if (moodVal <= 0) return 'hungry';
    if (moodVal <= 2) return 'normal';
    if (moodVal <= 5) return 'happy';
    return 'ecstatic';
  };

  const currentMoodVal = petMoods[currentPet.id] || 0;
  const currentMoodKey = getMoodKey(currentMoodVal);
  const currentMood = MOODS[currentMoodKey]!;

  // Idle breathing animation
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(idleAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(idleAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  // Welcome speech
  useEffect(() => {
    soundManager.speak(
      'Chào bé! Hãy chăm sóc các bạn thú cưng dễ thương nhé! Chạm vào nút bên dưới để bắt đầu!',
      'vi'
    );
  }, []);

  // ==============================
  // Handle care action
  // ==============================
  const handleCareAction = useCallback(
    (action: CareAction) => {
      // 1. Bounce + wiggle pet animation
      Animated.parallel([
        Animated.sequence([
          Animated.spring(petBounce, {
            toValue: 1.2,
            friction: 3,
            tension: 200,
            useNativeDriver: true,
          }),
          Animated.spring(petBounce, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(petWiggle, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(petWiggle, {
            toValue: -1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(petWiggle, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(petWiggle, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      // 2. Heart pop animation
      Animated.sequence([
        Animated.timing(heartScale, {
          toValue: 1.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(heartScale, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.timing(heartScale, {
          toValue: 0,
          duration: 600,
          delay: 800,
          useNativeDriver: true,
        }),
      ]).start();

      // 3. Star pop animation
      Animated.sequence([
        Animated.delay(300),
        Animated.spring(starPop, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(starPop, {
          toValue: 0,
          duration: 500,
          delay: 600,
          useNativeDriver: true,
        }),
      ]).start();

      // 4. Spawn floating emojis
      const newEmojis = action.reactionEmojis.map((em) => {
        const id = ++emojiCounter.current;
        const anim = new Animated.Value(0);
        floatAnims.current.set(id, anim);

        Animated.timing(anim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start(() => {
          floatAnims.current.delete(id);
          setFloatingEmojis((prev) => prev.filter((e) => e.id !== id));
        });

        return {
          id,
          emoji: em,
          x: Math.random() * 260 + 30,
        };
      });
      setFloatingEmojis((prev) => [...prev, ...newEmojis]);

      // 5. Update mood & stars
      setPetMoods((prev) => ({
        ...prev,
        [currentPet.id]: Math.min((prev[currentPet.id] || 0) + 1, 8),
      }));

      setTotalStars((prev) => prev + action.starsReward);
      setCareCount((prev) => prev + 1);

      // 6. Sound
      soundManager.speak(
        `${currentPet.nameVi} nói: ${action.soundPhrase}`,
        'vi'
      );

      // 7. Check victory (every 20 cares)
      if ((careCount + 1) % 20 === 0 && careCount > 0) {
        setTimeout(() => {
          setShowVictory(true);
          soundManager.speak(
            'Hoan hô! Bé chăm sóc thú cưng thật giỏi! Bé nhận được nhiều ngôi sao!',
            'vi'
          );
        }, 1000);
      }
    },
    [currentPet, careCount]
  );

  // ==============================
  // Select pet
  // ==============================
  const handleSelectPet = (idx: number) => {
    const pet = PETS[idx]!;
    if (pet.unlockStars > totalStars) {
      soundManager.speak(
        `Bé cần ${pet.unlockStars} ngôi sao để mở khóa ${pet.nameVi}. Hãy chăm sóc thêm nhé!`,
        'vi'
      );
      return;
    }
    setSelectedPetIdx(idx);
    soundManager.speak(
      `${pet.soundText} Xin chào! Mình là ${pet.nameVi}! Hãy chăm sóc mình nhé!`,
      'vi'
    );
  };

  // ==============================
  // Computed
  // ==============================
  const idleTranslateY = idleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const wiggleRotation = petWiggle.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-8deg', '0deg', '8deg'],
  });

  // ==============================
  // RENDER
  // ==============================
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentPet.bgGradientStart }]}>
      <StatusBar barStyle="dark-content" backgroundColor={currentPet.bgGradientStart} />

      {/* ═══════════════ HEADER ═══════════════ */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
          <Text style={[styles.closeBtnText, { color: currentPet.headerColor }]}>✕</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={[styles.titleText, { color: currentPet.headerColor }]}>
            🐾 Bé Và Bạn Thú Cưng
          </Text>
          <Text style={[styles.subtitleText, { color: currentPet.headerColor + 'AA' }]}>
            ⭐ {totalStars} Sao
          </Text>
        </View>
        <TouchableOpacity
          style={styles.soundBtn}
          onPress={() =>
            soundManager.speak(
              `Đây là bạn ${currentPet.nameVi}! ${currentPet.funFact}`,
              'vi'
            )
          }
          activeOpacity={0.7}
        >
          <Text style={styles.soundBtnText}>🔊</Text>
        </TouchableOpacity>
      </View>

      {/* ═══════════════ PET SELECTOR BAR ═══════════════ */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.petSelectorScrollView}
        contentContainerStyle={styles.petSelectorBar}
      >
        {PETS.map((pet, idx) => {
          const isSelected = idx === selectedPetIdx;
          const isLocked = pet.unlockStars > totalStars;
          return (
            <TouchableOpacity
              key={pet.id}
              style={[
                styles.petSelectorCard,
                {
                  backgroundColor: isSelected
                    ? '#FFFFFF'
                    : isLocked
                    ? 'rgba(0,0,0,0.15)'
                    : 'rgba(255,255,255,0.5)',
                  borderColor: isSelected ? pet.bgGradientStart : 'transparent',
                },
              ]}
              activeOpacity={0.8}
              onPress={() => handleSelectPet(idx)}
            >
              <Text style={styles.petSelectorEmoji}>
                {isLocked ? '🔒' : pet.emoji}
              </Text>
              <Text
                style={[
                  styles.petSelectorName,
                  {
                    color: isSelected
                      ? pet.headerColor
                      : isLocked
                      ? '#94A3B8'
                      : '#475569',
                  },
                ]}
              >
                {pet.nameVi}
              </Text>
              {isLocked && (
                <Text style={styles.petSelectorLockText}>
                  ⭐{pet.unlockStars}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ═══════════════ PET ROOM ═══════════════ */}
      <View style={[styles.petRoom, { backgroundColor: currentPet.bgGradientEnd }]}>
        {/* Mood indicator */}
        <View style={[styles.moodBadge, { backgroundColor: currentMood.color + '25' }]}>
          <Text style={styles.moodEmoji}>{currentMood.emoji}</Text>
          <Text style={[styles.moodText, { color: currentMood.color }]}>
            {currentMood.label}
          </Text>
          {/* Mood bar */}
          <View style={styles.moodBarContainer}>
            <View
              style={[
                styles.moodBarFill,
                {
                  backgroundColor: currentMood.color,
                  width: `${Math.min((currentMoodVal / 8) * 100, 100)}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Fun Fact Bubble */}
        <View style={styles.speechBubble}>
          <Text style={[styles.speechText, { color: currentPet.headerColor }]}>
            💡 {currentPet.funFact}
          </Text>
        </View>

        {/* PET CHARACTER (large emoji with animations) */}
        <View style={styles.petCharacterArea}>
          <Animated.Text
            style={[
              styles.petBigEmoji,
              {
                transform: [
                  { scale: petBounce },
                  { translateY: idleTranslateY },
                  { rotate: wiggleRotation },
                ],
              },
            ]}
          >
            {currentPet.emoji}
          </Animated.Text>

          {/* Pet name */}
          <Text style={[styles.petName, { color: currentPet.headerColor }]}>
            {currentPet.nameVi}
          </Text>

          {/* Heart reaction floating */}
          <Animated.Text
            style={[
              styles.heartReaction,
              {
                transform: [{ scale: heartScale }],
                opacity: heartScale,
              },
            ]}
          >
            💖
          </Animated.Text>

          {/* Star reward popup */}
          <Animated.View
            style={[
              styles.starPopup,
              {
                transform: [
                  { scale: starPop },
                  {
                    translateY: starPop.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, -10],
                    }),
                  },
                ],
                opacity: starPop,
              },
            ]}
          >
            <Text style={styles.starPopupText}>+1 ⭐</Text>
          </Animated.View>

          {/* Floating emojis */}
          {floatingEmojis.map((item) => {
            const anim = floatAnims.current.get(item.id);
            if (!anim) return null;
            return (
              <Animated.Text
                key={item.id}
                style={[
                  styles.floatingEmoji,
                  {
                    left: item.x,
                    transform: [
                      {
                        translateY: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -180],
                        }),
                      },
                      {
                        scale: anim.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [0.5, 1.2, 0.3],
                        }),
                      },
                    ],
                    opacity: anim.interpolate({
                      inputRange: [0, 0.3, 0.8, 1],
                      outputRange: [0, 1, 0.8, 0],
                    }),
                  },
                ]}
              >
                {item.emoji}
              </Animated.Text>
            );
          })}
        </View>
      </View>

      {/* ═══════════════ CARE ACTION BUTTONS ═══════════════ */}
      <View style={styles.actionBar}>
        {CARE_ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionBtn, { backgroundColor: action.bgColor, borderColor: action.color }]}
            activeOpacity={0.7}
            onPress={() => handleCareAction(action)}
          >
            <Text style={styles.actionEmoji}>{action.emoji}</Text>
            <Text style={[styles.actionLabel, { color: action.color }]}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ═══════════════ BOTTOM TIP BAR ═══════════════ */}
      <View style={[styles.tipBar, { backgroundColor: currentPet.headerColor + '15' }]}>
        <Text style={styles.tipIcon}>🐾</Text>
        <Text style={[styles.tipText, { color: currentPet.headerColor }]}>
          {careCount === 0
            ? 'Chạm vào các nút bên trên để chăm sóc thú cưng nhé!'
            : `Bé đã chăm sóc ${careCount} lần! Tiếp tục nhé!`}
        </Text>
      </View>

      {/* ═══════════════ VICTORY OVERLAY ═══════════════ */}
      {showVictory && (
        <View style={styles.victoryOverlay}>
          <Text style={styles.victoryEmoji}>🎉 🐾 ⭐</Text>
          <Text style={styles.victoryTitle}>BÉ GIỎI QUÁ!</Text>
          <Text style={styles.victorySubtitle}>
            Bé đã chăm sóc tuyệt vời! Bé có {totalStars} ngôi sao ⭐
          </Text>
          {/* Check if new pet unlocked */}
          {PETS.some((p) => p.unlockStars === totalStars || (p.unlockStars > 0 && p.unlockStars <= totalStars)) && (
            <Text style={styles.victoryUnlock}>
              🔓 Thú cưng mới đã được mở khóa!
            </Text>
          )}
          <TouchableOpacity
            style={styles.victoryBtn}
            onPress={() => setShowVictory(false)}
            activeOpacity={0.8}
          >
            <Text style={styles.victoryBtnText}>🐾 Tiếp Tục Chăm Sóc</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

// ============================================================
// 🎨 STYLES: Màu sắc pastel tươi sáng, hình ảnh to rõ cho trẻ em
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // ─── HEADER ───
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 8,
    paddingBottom: 6,
  },
  closeBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  closeBtnText: {
    fontSize: 22,
    fontWeight: '900',
  },
  titleContainer: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '900',
  },
  subtitleText: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 1,
  },
  soundBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  soundBtnText: {
    fontSize: 20,
  },

  // ─── PET SELECTOR ───
  petSelectorScrollView: {
    flexGrow: 0,
    marginBottom: 4,
  },
  petSelectorBar: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 8,
    alignItems: 'center',
  },
  petSelectorCard: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  petSelectorEmoji: {
    fontSize: 22,
  },
  petSelectorName: {
    fontWeight: '800',
    fontSize: 12,
  },
  petSelectorLockText: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '700',
  },

  // ─── PET ROOM ───
  petRoom: {
    flex: 1,
    marginHorizontal: 14,
    borderRadius: 28,
    padding: 14,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  moodEmoji: {
    fontSize: 20,
  },
  moodText: {
    fontSize: 13,
    fontWeight: '800',
  },
  moodBarContainer: {
    width: 60,
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  moodBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  speechBubble: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    elevation: 1,
  },
  speechText: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
  },
  petCharacterArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  petBigEmoji: {
    fontSize: 135,
  },
  petName: {
    fontSize: 26,
    fontWeight: '900',
    marginTop: 4,
    textShadowColor: 'rgba(255,255,255,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heartReaction: {
    position: 'absolute',
    top: 10,
    right: 40,
    fontSize: 40,
  },
  starPopup: {
    position: 'absolute',
    top: 5,
    left: 40,
    backgroundColor: '#FDE047',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  starPopupText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#92400E',
  },
  floatingEmoji: {
    position: 'absolute',
    fontSize: 28,
    bottom: 80,
  },

  // ─── CARE ACTION BUTTONS ───
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    gap: 2,
  },
  actionEmoji: {
    fontSize: 32,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '900',
    marginTop: 2,
  },

  // ─── TIP BAR ───
  tipBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 14,
    marginBottom: 10,
    padding: 10,
    borderRadius: 14,
    gap: 8,
  },
  tipIcon: {
    fontSize: 20,
  },
  tipText: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },

  // ─── VICTORY OVERLAY ───
  victoryOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
    padding: 24,
  },
  victoryEmoji: {
    fontSize: 60,
    marginBottom: 12,
  },
  victoryTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FDE047',
    textShadowColor: 'rgba(253,224,71,0.4)',
    textShadowRadius: 10,
  },
  victorySubtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 24,
  },
  victoryUnlock: {
    color: '#A7F3D0',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 10,
  },
  victoryBtn: {
    marginTop: 24,
    backgroundColor: '#F59E0B',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  victoryBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
});

export default PetCareGameScreen;
