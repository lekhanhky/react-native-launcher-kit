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

interface ShadowItem {
  id: string;
  nameVi: string;
  nameEn: string;
  emoji: string;
  category: string;
}

const ITEMS_DB: ShadowItem[] = [
  { id: 'lion', nameVi: 'Sư Tử', nameEn: 'Lion', emoji: '🦁', category: 'Động vật' },
  { id: 'elephant', nameVi: 'Con Voi', nameEn: 'Elephant', emoji: '🐘', category: 'Động vật' },
  { id: 'giraffe', nameVi: 'Hươu Cao Cổ', nameEn: 'Giraffe', emoji: '🦒', category: 'Động vật' },
  { id: 'penguin', nameVi: 'Chim Cánh Cụt', nameEn: 'Penguin', emoji: '🐧', category: 'Động vật' },
  { id: 'car', nameVi: 'Xe Ô Tô', nameEn: 'Car', emoji: '🚗', category: 'Phương tiện' },
  { id: 'airplane', nameVi: 'Máy Bay', nameEn: 'Airplane', emoji: '✈️', category: 'Phương tiện' },
  { id: 'rocket', nameVi: 'Tên Lửa', nameEn: 'Rocket', emoji: '🚀', category: 'Phương tiện' },
  { id: 'ship', nameVi: 'Tàu Thủy', nameEn: 'Ship', emoji: '🚢', category: 'Phương tiện' },
  { id: 'apple', nameVi: 'Quả Táo', nameEn: 'Apple', emoji: '🍎', category: 'Hoa quả' },
  { id: 'banana', nameVi: 'Quả Chuối', nameEn: 'Banana', emoji: '🍌', category: 'Hoa quả' },
  { id: 'watermelon', nameVi: 'Dưa Hấu', nameEn: 'Watermelon', emoji: '🍉', category: 'Hoa quả' },
  { id: 'strawberry', nameVi: 'Dâu Tây', nameEn: 'Strawberry', emoji: '🍓', category: 'Hoa quả' },
];

export const ShadowMatchingGameScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { width } = useWindowDimensions();
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [currentItems, setCurrentItems] = useState<ShadowItem[]>([]);
  const [shuffledShadows, setShuffledShadows] = useState<ShadowItem[]>([]);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [selectedSource, setSelectedSource] = useState<ShadowItem | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Animations
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    soundManager.speak('Bé hãy ghép các hình màu vào đúng bóng đen nhé!', 'vi');
    startNewRound(1);
  }, []);

  const startNewRound = (roundNum: number) => {
    setMatchedIds([]);
    setSelectedSource(null);
    setShowCelebration(false);

    // Pick 3 random items
    const shuffled = [...ITEMS_DB].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);
    setCurrentItems(selected);
    setShuffledShadows([...selected].sort(() => Math.random() - 0.5));
  };

  const handleSelectSource = (item: ShadowItem) => {
    if (matchedIds.includes(item.id)) return;
    setSelectedSource(item);
    soundManager.speak(`${item.nameVi}, tiếng Anh là ${item.nameEn}`, 'vi');
  };

  const handleSelectTarget = (targetItem: ShadowItem) => {
    if (matchedIds.includes(targetItem.id)) return;

    if (!selectedSource) {
      soundManager.speak('Bé hãy bấm chọn một hình màu ở bên dưới trước nhé', 'vi');
      return;
    }

    if (selectedSource.id === targetItem.id) {
      // Correct Match!
      const newMatched = [...matchedIds, targetItem.id];
      setMatchedIds(newMatched);
      setSelectedSource(null);
      setScore((prev) => prev + 15);

      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
        Animated.spring(bounceAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
      ]).start();

      soundManager.speak(`Chính xác! Đó là ${targetItem.nameVi}!`, 'vi');

      if (newMatched.length === currentItems.length) {
        setShowCelebration(true);
        soundManager.speak('Hoan hô bé! Bé đã ghép đúng toàn bộ các bóng!', 'vi');
        setTimeout(() => {
          setRound((r) => r + 1);
          startNewRound(round + 1);
        }, 2200);
      }
    } else {
      // Wrong Match
      soundManager.speak('Chưa đúng rồi, bé nhìn kỹ hình dáng chiếc bóng xem!', 'vi');
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0C4A6E" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>👥 Chiếc Bóng Kỳ Diệu</Text>
          <Text style={styles.subtitleText}>Vòng {round} • Điểm: ⭐ {score}</Text>
        </View>
        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={() => startNewRound(round)}
          activeOpacity={0.7}
        >
          <Text style={styles.refreshBtnText}>🔄</Text>
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[
          styles.contentArea,
          { transform: [{ translateX: shakeAnim }, { scale: bounceAnim }] },
        ]}
      >
        {/* SHADOW SLOTS (TOP) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>🎯 Tìm bóng phù hợp:</Text>
          <View style={styles.slotsRow}>
            {shuffledShadows.map((item) => {
              const isMatched = matchedIds.includes(item.id);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.shadowSlot,
                    isMatched && styles.shadowSlotMatched,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => handleSelectTarget(item)}
                >
                  {isMatched ? (
                    <View style={styles.matchedBadge}>
                      <Text style={styles.matchedEmoji}>{item.emoji}</Text>
                      <Text style={styles.matchedName}>{item.nameVi}</Text>
                    </View>
                  ) : (
                    <View style={styles.silhouetteContainer}>
                      <Text style={styles.silhouetteEmoji}>{item.emoji}</Text>
                      <View style={styles.shadowOverlay} />
                      <Text style={styles.questionMark}>❓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* INSTRUCTION */}
        <View style={styles.instructionBanner}>
          <Text style={styles.instructionText}>
            {selectedSource
              ? `👉 Đã chọn [${selectedSource.nameVi} ${selectedSource.emoji}]. Hãy chạm vào chiếc bóng tương ứng!`
              : '👇 Chạm vào 1 hình dưới đây để bắt đầu ghép!'}
          </Text>
        </View>

        {/* COLOR ITEMS (BOTTOM) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>🎨 Các hình cần ghép:</Text>
          <View style={styles.slotsRow}>
            {currentItems.map((item) => {
              const isMatched = matchedIds.includes(item.id);
              const isSelected = selectedSource?.id === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.colorCard,
                    isSelected && styles.colorCardSelected,
                    isMatched && styles.colorCardMatched,
                  ]}
                  disabled={isMatched}
                  activeOpacity={0.8}
                  onPress={() => handleSelectSource(item)}
                >
                  <Text style={styles.colorEmoji}>{item.emoji}</Text>
                  <Text style={styles.colorNameVi}>{item.nameVi}</Text>
                  <Text style={styles.colorNameEn}>{item.nameEn}</Text>
                  {isMatched && <Text style={styles.checkDone}>✅</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Animated.View>

      {/* CELEBRATION POPUP */}
      {showCelebration && (
        <View style={styles.celebrationOverlay}>
          <Text style={styles.celebrationEmoji}>🎉 🌟 🏆</Text>
          <Text style={styles.celebrationTitle}>XUẤT SẮC!</Text>
          <Text style={styles.celebrationSub}>Bé đã nhận ra mọi chiếc bóng!</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#075985',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 8,
    paddingBottom: 10,
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
    color: '#BAE6FD',
    marginTop: 2,
  },
  refreshBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshBtnText: {
    fontSize: 18,
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 14,
    justifyContent: 'space-around',
    paddingBottom: 16,
  },
  sectionCard: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  sectionHeading: {
    color: '#E0F2FE',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
  },
  slotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  shadowSlot: {
    flex: 1,
    aspectRatio: 0.9,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#334155',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowSlotMatched: {
    backgroundColor: '#065F46',
    borderColor: '#34D399',
    borderStyle: 'solid',
  },
  silhouetteContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  silhouetteEmoji: {
    fontSize: 48,
    opacity: 0.15,
  },
  shadowOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderRadius: 10,
  },
  questionMark: {
    position: 'absolute',
    fontSize: 22,
  },
  matchedBadge: {
    alignItems: 'center',
  },
  matchedEmoji: {
    fontSize: 44,
  },
  matchedName: {
    color: '#A7F3D0',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 4,
  },
  instructionBanner: {
    backgroundColor: 'rgba(254, 240, 138, 0.95)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  instructionText: {
    color: '#854D0E',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  colorCard: {
    flex: 1,
    aspectRatio: 0.9,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
    borderWidth: 2.5,
    borderColor: 'transparent',
    padding: 6,
  },
  colorCardSelected: {
    borderColor: '#F59E0B',
    transform: [{ scale: 1.06 }],
    backgroundColor: '#FEF3C7',
  },
  colorCardMatched: {
    opacity: 0.35,
    backgroundColor: '#E2E8F0',
  },
  colorEmoji: {
    fontSize: 40,
  },
  colorNameVi: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
  colorNameEn: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '600',
  },
  checkDone: {
    position: 'absolute',
    top: 4,
    right: 4,
    fontSize: 14,
  },
  celebrationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  celebrationEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  celebrationTitle: {
    color: '#FDE047',
    fontSize: 28,
    fontWeight: '900',
  },
  celebrationSub: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
  },
});

export default ShadowMatchingGameScreen;
