import React, { useState, useRef, useEffect } from 'react';
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
} from 'react-native';
import { soundManager } from '../components/SoundPlayer';

interface EmotionOption {
  id: string;
  nameVi: string;
  emoji: string;
  color: string;
}

const EMOTIONS: EmotionOption[] = [
  { id: 'happy', nameVi: 'Vui Vẻ', emoji: '😊', color: '#10B981' },
  { id: 'sad', nameVi: 'Buồn Bã', emoji: '😢', color: '#3B82F6' },
  { id: 'angry', nameVi: 'Tức Giận', emoji: '😡', color: '#EF4444' },
  { id: 'scared', nameVi: 'Sợ Hãi', emoji: '😨', color: '#8B5CF6' },
  { id: 'surprised', nameVi: 'Ngạc Nhiên', emoji: '😲', color: '#F59E0B' },
  { id: 'proud', nameVi: 'Tự Hào', emoji: '😎', color: '#EC4899' },
];

interface Scenario {
  id: string;
  character: string;
  characterEmoji: string;
  situation: string;
  correctEmotion: string;
  explanation: string;
  advice: string;
  flowerEmoji: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 's1',
    character: 'Bạn Cún Con',
    characterEmoji: '🐶',
    situation: 'Bạn Cún được mẹ tặng một chiếc bánh sinh nhật thật ngon và to!',
    correctEmotion: 'happy',
    explanation: 'Bạn Cún cảm thấy rất Vui Vẻ!',
    advice: 'Khi vui vẻ, chúng mình cùng chia sẻ niềm vui với bạn bè nhé!',
    flowerEmoji: '🌻',
  },
  {
    id: 's2',
    character: 'Bạn Mèo Miu',
    characterEmoji: '🐱',
    situation: 'Bạn Mèo vô tình làm rơi que kem ngọt ngào xuống đất mất rồi...',
    correctEmotion: 'sad',
    explanation: 'Bạn Mèo đang cảm thấy rất Buồn Bã.',
    advice: 'Khi bạn buồn, chúng mình hãy đến ôm bạn và an ủi bạn nhé!',
    flowerEmoji: '🌷',
  },
  {
    id: 's3',
    character: 'Bạn Thỏ Trắng',
    characterEmoji: '🐰',
    situation: 'Trời bất ngờ đổ cơn mưa to có sấm sét đánh ầm ầm trên trời!',
    correctEmotion: 'scared',
    explanation: 'Bạn Thỏ cảm thấy giật mình và Sợ Hãi.',
    advice: 'Đừng sợ nhé, có ba mẹ và người thân ở bên che chở cho bé!',
    flowerEmoji: '🌸',
  },
  {
    id: 's4',
    character: 'Bạn Khỉ Tinh Nghịch',
    characterEmoji: '🐵',
    situation: 'Bạn Khỉ mở một chiếc hộp bí mật và bất ngờ chú hề lò xo nhảy vọt ra!',
    correctEmotion: 'surprised',
    explanation: 'Bạn Khỉ vô cùng Ngạc Nhiên!',
    advice: 'Thế giới có rất nhiều điều bất ngờ và thú vị đang chờ bé khám phá!',
    flowerEmoji: '🌺',
  },
  {
    id: 's5',
    character: 'Bạn Gấu Nâu',
    characterEmoji: '🐻',
    situation: 'Bạn Gấu đã tự giác xếp dọn hết đồ chơi gọn gàng vào ngăn nắp!',
    correctEmotion: 'proud',
    explanation: 'Bạn Gấu rất Tự Hào về bản thân!',
    advice: 'Bé tự lập làm việc tốt cũng thật đáng khen và tự hào!',
    flowerEmoji: '🌹',
  },
  {
    id: 's6',
    character: 'Bạn Khủng Long Nhỏ',
    characterEmoji: '🦖',
    situation: 'Bạn Khủng Long bị ai đó giẫm đổ tòa lâu đài cát vừa xây xong...',
    correctEmotion: 'angry',
    explanation: 'Bạn Khủng Long đang cảm thấy Tức Giận.',
    advice: 'Khi giận, bé hãy hít thở thật sâu 3 lần để bình tĩnh lại nhé!',
    flowerEmoji: '🌼',
  },
];

export const EmotionGardenGameScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [bloomedFlowers, setBloomedFlowers] = useState<string[]>([]);
  const [showAdvice, setShowAdvice] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  // Animations
  const flowerScale = useRef(new Animated.Value(1)).current;
  const cardFade = useRef(new Animated.Value(1)).current;

  const currentScenario = SCENARIOS[currentIdx];

  useEffect(() => {
    soundManager.speak('Chào mừng bé đến Khu Vườn Cảm Xúc EQ!', 'vi');
    readCurrentScenario();
  }, []);

  const readCurrentScenario = () => {
    const s = SCENARIOS[currentIdx];
    soundManager.speak(`${s.character} gặp chuyện này: ${s.situation}. Theo bé bạn cảm thấy thế nào?`, 'vi');
  };

  const handleSelectEmotion = (emotionId: string) => {
    setSelectedEmotion(emotionId);
    if (emotionId === currentScenario.correctEmotion) {
      setShowAdvice(true);
      const flower = currentScenario.flowerEmoji;
      if (!bloomedFlowers.includes(flower)) {
        setBloomedFlowers((prev) => [...prev, flower]);
      }

      Animated.sequence([
        Animated.timing(flowerScale, { toValue: 1.3, duration: 200, useNativeDriver: true }),
        Animated.spring(flowerScale, { toValue: 1, friction: 3, useNativeDriver: true }),
      ]).start();

      soundManager.speak(`Chính xác! ${currentScenario.explanation} ${currentScenario.advice}`, 'vi');
    } else {
      soundManager.speak('Chưa đúng rồi, bé hãy thử lắng nghe lại câu chuyện xem bạn cảm thấy sao nhé!', 'vi');
    }
  };

  const nextScenario = () => {
    setShowAdvice(false);
    setSelectedEmotion(null);
    if (currentIdx + 1 < SCENARIOS.length) {
      setCurrentIdx((prev) => prev + 1);
      setTimeout(() => {
        const nextS = SCENARIOS[currentIdx + 1];
        soundManager.speak(`${nextS.character} gặp chuyện này: ${nextS.situation}. Bạn cảm thấy thế nào?`, 'vi');
      }, 400);
    } else {
      soundManager.speak('Tuyệt vời! Bé đã giúp toàn bộ khu vườn cảm xúc nở hoa rực rỡ!', 'vi');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#064E3B" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>🌱 Khu Vườn Cảm Xúc (EQ)</Text>
          <Text style={styles.subtitleText}>Hoa đã nở: {bloomedFlowers.length}/{SCENARIOS.length}</Text>
        </View>
        <TouchableOpacity
          style={styles.soundBtn}
          onPress={readCurrentScenario}
          activeOpacity={0.7}
        >
          <Text style={styles.soundBtnText}>🔊</Text>
        </TouchableOpacity>
      </View>

      {/* BLOOMED GARDEN BAR */}
      <View style={styles.gardenBar}>
        <Text style={styles.gardenLabel}>Khu vườn của bé: </Text>
        <View style={styles.gardenFlowers}>
          {bloomedFlowers.map((f, i) => (
            <Animated.Text key={i} style={[styles.flowerItem, { transform: [{ scale: flowerScale }] }]}>
              {f}
            </Animated.Text>
          ))}
          {bloomedFlowers.length === 0 && <Text style={styles.emptyGarden}>Chưa có hoa nở... Hãy trả lời đúng nhé!</Text>}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea}>
        {/* SITUATION CARD */}
        <Animated.View style={[styles.scenarioCard, { opacity: cardFade }]}>
          <Text style={styles.characterHeader}>{currentScenario.characterEmoji} {currentScenario.character}</Text>
          <View style={styles.situationBubble}>
            <Text style={styles.situationText}>"{currentScenario.situation}"</Text>
          </View>
          <Text style={styles.questionPrompt}>👉 Bạn ấy đang cảm thấy thế nào nhỉ?</Text>
        </Animated.View>

        {/* EMOTION GRID */}
        <View style={styles.emotionGrid}>
          {EMOTIONS.map((em) => {
            const isSelected = selectedEmotion === em.id;
            const isCorrect = isSelected && em.id === currentScenario.correctEmotion;
            return (
              <TouchableOpacity
                key={em.id}
                style={[
                  styles.emotionCard,
                  { borderColor: em.color },
                  isSelected && { backgroundColor: em.color + '30' },
                  isCorrect && styles.correctCard,
                ]}
                activeOpacity={0.8}
                onPress={() => handleSelectEmotion(em.id)}
              >
                <Text style={styles.emotionEmoji}>{em.emoji}</Text>
                <Text style={[styles.emotionName, { color: em.color }]}>{em.nameVi}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ADVICE & LESSON POPUP */}
        {showAdvice && (
          <View style={styles.adviceBox}>
            <Text style={styles.adviceTitle}>💡 Lời khuyên ấm áp:</Text>
            <Text style={styles.adviceText}>{currentScenario.advice}</Text>
            <TouchableOpacity style={styles.nextBtn} onPress={nextScenario} activeOpacity={0.8}>
              <Text style={styles.nextBtnText}>
                {currentIdx + 1 < SCENARIOS.length ? 'Tiếp tục câu chuyện ➡️' : '🏆 Hoàn Thành Khu Vườn!'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#064E3B',
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
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  subtitleText: {
    fontSize: 12,
    color: '#A7F3D0',
    marginTop: 2,
  },
  soundBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  soundBtnText: {
    fontSize: 18,
  },
  gardenBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: 14,
    marginVertical: 6,
    padding: 8,
    borderRadius: 14,
  },
  gardenLabel: {
    color: '#FDE68A',
    fontSize: 12,
    fontWeight: '700',
  },
  gardenFlowers: {
    flexDirection: 'row',
    flex: 1,
    gap: 6,
  },
  flowerItem: {
    fontSize: 20,
  },
  emptyGarden: {
    color: '#D1FAE5',
    fontSize: 11,
    fontStyle: 'italic',
  },
  scrollArea: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
  scenarioCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  characterHeader: {
    fontSize: 18,
    fontWeight: '900',
    color: '#065F46',
    marginBottom: 8,
  },
  situationBubble: {
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  situationText: {
    fontSize: 15,
    color: '#064E3B',
    lineHeight: 22,
    fontWeight: '600',
  },
  questionPrompt: {
    fontSize: 13,
    fontWeight: '800',
    color: '#047857',
    marginTop: 12,
  },
  emotionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  emotionCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  correctCard: {
    backgroundColor: '#D1FAE5',
    borderColor: '#059669',
  },
  emotionEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  emotionName: {
    fontSize: 12,
    fontWeight: '800',
  },
  adviceBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 18,
    padding: 16,
    borderWidth: 2,
    borderColor: '#F59E0B',
    marginTop: 10,
  },
  adviceTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#B45309',
    marginBottom: 4,
  },
  adviceText: {
    fontSize: 14,
    color: '#78350F',
    lineHeight: 20,
    fontWeight: '600',
  },
  nextBtn: {
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});

export default EmotionGardenGameScreen;
