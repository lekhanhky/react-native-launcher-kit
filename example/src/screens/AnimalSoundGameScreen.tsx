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
  useWindowDimensions,
} from 'react-native';
import { ThemeConfig } from '../services/themes';

interface AnimalInfo {
  id: string;
  name: string;
  emoji: string;
  soundText: string;
  soundDescription: string;
  category: 'farm' | 'wild';
  color: string;
}

interface AnimalSoundGameScreenProps {
  theme?: ThemeConfig;
  onClose: () => void;
}

const ANIMAL_LIST: AnimalInfo[] = [
  { id: 'dog', name: 'Chú Cún Con', emoji: '🐶', soundText: 'Gâu gâu! Gâu gâu!', soundDescription: 'Tiếng cún con sủa vui mừng', category: 'farm', color: '#FDE68A' },
  { id: 'cat', name: 'Mèo Con', emoji: '🐱', soundText: 'Meo meo! Meo meo!', soundDescription: 'Tiếng mèo con kêu nũng nịu', category: 'farm', color: '#FED7AA' },
  { id: 'rooster', name: 'Gà Trống', emoji: '🐔', soundText: 'Ò ó o o!', soundDescription: 'Tiếng gà trống gáy buổi sáng', category: 'farm', color: '#FECDD3' },
  { id: 'duck', name: 'Vịt Con', emoji: '🦆', soundText: 'Cạp cạp! Cạp cạp!', soundDescription: 'Tiếng vịt con bơi dưới ao', category: 'farm', color: '#BAE6FD' },
  { id: 'cow', name: 'Bò Sữa', emoji: '🐮', soundText: 'Ùm bòoo! Ùm bòoo!', soundDescription: 'Tiếng bò sữa trên đồng cỏ', category: 'farm', color: '#E9D5FF' },
  { id: 'pig', name: 'Heo Con', emoji: '🐷', soundText: 'Ủn ỉn! Ủn ỉn!', soundDescription: 'Tiếng heo con đòi ăn', category: 'farm', color: '#FBCFE8' },
  { id: 'lion', name: 'Sư Tử', emoji: '🦁', soundText: 'Gaooo! Gầm gừ!', soundDescription: 'Tiếng sư tử chúa sơn lâm gầm', category: 'wild', color: '#FEF08A' },
  { id: 'frog', name: 'Chú Ếch', emoji: '🐸', soundText: 'Ộp ộp! Ộp ộp!', soundDescription: 'Tiếng ếch kêu sau cơn mưa', category: 'wild', color: '#BBF7D0' },
  { id: 'sheep', name: 'Cừu Non', emoji: '🐑', soundText: 'Be beee! Be beee!', soundDescription: 'Tiếng cừu non gọi mẹ', category: 'farm', color: '#DDD6FE' },
  { id: 'horse', name: 'Ngựa Con', emoji: '🐴', soundText: 'Hí hí hí! Lộc cộc!', soundDescription: 'Tiếng ngựa phi nước đại', category: 'farm', color: '#E2E8F0' },
  { id: 'elephant', name: 'Chú Voi', emoji: '🐘', soundText: 'Éc éc! Rống vang!', soundDescription: 'Tiếng voi huơ vòi gọi bạn', category: 'wild', color: '#CFFAFE' },
  { id: 'monkey', name: 'Khỉ Vàng', emoji: '🐵', soundText: 'Khẹc khẹc! Chít chít!', soundDescription: 'Tiếng khỉ leo trèo trên cây', category: 'wild', color: '#FFEDD5' },
];

export const AnimalSoundGameScreen: React.FC<AnimalSoundGameScreenProps> = ({ onClose }) => {
  const { width } = useWindowDimensions();
  const [gameMode, setGameMode] = useState<'quiz' | 'explorer'>('quiz');

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentAnimal, setCurrentAnimal] = useState<AnimalInfo>(ANIMAL_LIST[0]);
  const [options, setOptions] = useState<AnimalInfo[]>([]);
  const [score, setScore] = useState<number>(0);
  const [totalQuestions] = useState<number>(8); // 8 câu đố mỗi lượt chơi
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isAnswering, setIsAnswering] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);

  // Explorer State
  const [playingExplorerId, setPlayingExplorerId] = useState<string | null>(null);

  // Animations
  const soundWaveScale = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const victoryScale = useRef(new Animated.Value(0.3)).current;

  // Hiệu ứng sóng âm thanh nhấp nháy khi phát tiếng
  const triggerSoundAnimation = useCallback(() => {
    Animated.sequence([
      Animated.timing(soundWaveScale, { toValue: 1.25, duration: 150, useNativeDriver: true }),
      Animated.timing(soundWaveScale, { toValue: 0.95, duration: 150, useNativeDriver: true }),
      Animated.timing(soundWaveScale, { toValue: 1.15, duration: 150, useNativeDriver: true }),
      Animated.timing(soundWaveScale, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  }, [soundWaveScale]);

  // 1. Tạo câu hỏi mới
  const generateQuestion = useCallback((index: number) => {
    const target = ANIMAL_LIST[index % ANIMAL_LIST.length];
    setCurrentAnimal(target);

    // Lấy 3 con vật khác làm đáp án gây nhiễu
    const distractors = ANIMAL_LIST.filter((a) => a.id !== target.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // Xáo trộn 4 đáp án
    const allChoices = [target, ...distractors].sort(() => Math.random() - 0.5);
    setOptions(allChoices);
    setSelectedOptionId(null);
    setIsCorrect(null);
    setIsAnswering(false);

    // Kích hoạt hiệu ứng phát tiếng âm thanh
    setTimeout(() => {
      triggerSoundAnimation();
    }, 200);
  }, [triggerSoundAnimation]);

  // Khởi tạo game
  const startNewQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsVictory(false);
    generateQuestion(0);
  }, [generateQuestion]);

  useEffect(() => {
    if (gameMode === 'quiz') {
      startNewQuiz();
    }
  }, [gameMode, startNewQuiz]);

  // 2. Xử lý khi bé chọn đáp án con vật
  const handleSelectOption = (animal: AnimalInfo) => {
    if (isAnswering) return;
    setIsAnswering(true);
    setSelectedOptionId(animal.id);

    if (animal.id === currentAnimal.id) {
      // ĐÚNG 🎉
      setIsCorrect(true);
      setScore((s) => s + 100);

      // Hiệu ứng nhảy cẫng lên
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: 1.25, duration: 200, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();

      // Chuyển sang câu tiếp theo sau 1.2s
      setTimeout(() => {
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex >= totalQuestions) {
          handleVictory();
        } else {
          setCurrentQuestionIndex(nextIndex);
          generateQuestion(nextIndex);
        }
      }, 1200);
    } else {
      // SAI -> Rung nhẹ và cho bé chọn lại
      setIsCorrect(false);

      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 80, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 8, duration: 80, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
      ]).start();

      setTimeout(() => {
        setIsAnswering(false);
        setIsCorrect(null);
      }, 1000);
    }
  };

  // 3. Xử lý chiến thắng
  const handleVictory = () => {
    setIsVictory(true);
    victoryScale.setValue(0.3);
    Animated.spring(victoryScale, {
      toValue: 1,
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  // 4. Xử lý khi bé bấm khám phá trong chế độ Explorer
  const handleExploreAnimal = (animal: AnimalInfo) => {
    setPlayingExplorerId(animal.id);
    triggerSoundAnimation();
    setTimeout(() => {
      setPlayingExplorerId(null);
    }, 1500);
  };

  const cardWidth = Math.min((width - 48) / 2, 160);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#D97706" />

      {/* 1. HEADER CHÍNH */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onClose} activeOpacity={0.7}>
          <Text style={styles.backBtnText}>✕ Đóng</Text>
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>🐶 Đoán Con Vật</Text>
          <Text style={styles.headerSub}>Nghe tiếng kêu đoán con vật nào!</Text>
        </View>

        <TouchableOpacity
          style={styles.restartBtn}
          onPress={startNewQuiz}
          activeOpacity={0.7}
        >
          <Text style={styles.restartBtnText}>🔄 Chơi Lại</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 2. CHUYỂN ĐỔI CHẾ ĐỘ (QUIZ VS EXPLORER) */}
        <View style={styles.modeTabBar}>
          <TouchableOpacity
            style={[styles.modeTab, gameMode === 'quiz' && styles.modeTabActive]}
            onPress={() => setGameMode('quiz')}
            activeOpacity={0.8}
          >
            <Text style={[styles.modeTabText, gameMode === 'quiz' && styles.modeTabTextActive]}>
              🎯 Đố Vui Con Vật ({currentQuestionIndex + 1}/{totalQuestions})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeTab, gameMode === 'explorer' && styles.modeTabActive]}
            onPress={() => setGameMode('explorer')}
            activeOpacity={0.8}
          >
            <Text style={[styles.modeTabText, gameMode === 'explorer' && styles.modeTabTextActive]}>
              🐾 Nông Trại Vui Vẻ
            </Text>
          </TouchableOpacity>
        </View>

        {/* 3. NỘI DUNG CHẾ ĐỘ ĐỐ VUI (QUIZ) */}
        {gameMode === 'quiz' && (
          <View style={styles.quizContainer}>
            {/* HỘP PHÁT ÂM THANH CON VẬT (SOUND PLAYER CARD) */}
            <View style={styles.soundCard}>
              <Text style={styles.soundCardPrompt}>🔊 Con gì kêu thế này nhỉ?</Text>

              {/* NÚT LOA KHỔNG LỒ */}
              <Animated.View
                style={[
                  styles.soundSpeakerCircle,
                  { transform: [{ scale: soundWaveScale }] },
                ]}
              >
                <TouchableOpacity
                  style={styles.speakerTouchable}
                  onPress={triggerSoundAnimation}
                  activeOpacity={0.85}
                >
                  <Text style={styles.speakerIcon}>📢</Text>
                  <Text style={styles.tapToHearText}>Chạm để nghe lại</Text>
                </TouchableOpacity>
              </Animated.View>

              {/* BONG BÓNG LỜI KÊU */}
              <View style={styles.speechBubble}>
                <Text style={styles.speechSoundText}>"{currentAnimal.soundText}"</Text>
                <Text style={styles.speechSubText}>({currentAnimal.soundDescription})</Text>
              </View>

              {/* TIẾN TRÌNH & ĐIỂM SỐ */}
              <View style={styles.progressRow}>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.scoreText}>⭐ {score} Điểm</Text>
              </View>
            </View>

            {/* THÔNG BÁO KẾT QUẢ ĐÚNG / SAI */}
            {isCorrect === true && (
              <Animated.View
                style={[
                  styles.feedbackBanner,
                  styles.correctBanner,
                  { transform: [{ scale: bounceAnim }] },
                ]}
              >
                <Text style={styles.feedbackEmoji}>🎉</Text>
                <Text style={styles.feedbackText}>
                  ĐÚNG RỒI! Đây chính là {currentAnimal.name} ({currentAnimal.emoji})!
                </Text>
              </Animated.View>
            )}

            {isCorrect === false && (
              <Animated.View
                style={[
                  styles.feedbackBanner,
                  styles.wrongBanner,
                  { transform: [{ translateX: shakeAnim }] },
                ]}
              >
                <Text style={styles.feedbackEmoji}>🐾</Text>
                <Text style={styles.feedbackText}>Chưa đúng rồi, bé lắng nghe và thử lại nhé!</Text>
              </Animated.View>
            )}

            {/* LƯỚI 4 CON VẬT ĐỂ BÉ LỰA CHỌN */}
            <View style={styles.optionsGrid}>
              {options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const isThisCorrect = isSelected && isCorrect === true;
                const isThisWrong = isSelected && isCorrect === false;

                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.animalChoiceCard,
                      { width: cardWidth, backgroundColor: opt.color },
                      isThisCorrect && styles.choiceCardCorrect,
                      isThisWrong && styles.choiceCardWrong,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => handleSelectOption(opt)}
                    disabled={isAnswering && isCorrect === true}
                  >
                    <Text style={styles.animalChoiceEmoji}>{opt.emoji}</Text>
                    <Text style={styles.animalChoiceName} numberOfLines={1}>
                      {opt.name}
                    </Text>
                    {isThisCorrect && (
                      <View style={styles.badgeCheck}>
                        <Text style={styles.badgeCheckText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* 4. NỘI DUNG CHẾ ĐỘ KHÁM PHÁ (EXPLORER) */}
        {gameMode === 'explorer' && (
          <View style={styles.explorerContainer}>
            <View style={styles.explorerGuideCard}>
              <Text style={styles.explorerGuideTitle}>🌱 Bách Khoa Toàn Thư Động Vật</Text>
              <Text style={styles.explorerGuideSub}>
                Chạm vào bất kỳ con vật nào để lắng nghe tiếng kêu và cách phát âm nhé bé!
              </Text>
            </View>

            <View style={styles.explorerGrid}>
              {ANIMAL_LIST.map((item) => {
                const isPlaying = playingExplorerId === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.explorerCard,
                      { width: cardWidth, backgroundColor: item.color },
                      isPlaying && styles.explorerCardPlaying,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => handleExploreAnimal(item)}
                  >
                    <Text style={styles.explorerEmoji}>{item.emoji}</Text>
                    <Text style={styles.explorerName}>{item.name}</Text>
                    <View style={styles.explorerSoundPill}>
                      <Text style={styles.explorerSoundPillText}>🔊 {item.soundText}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* 5. MODAL CHÚC MỪNG CHIẾN THẮNG */}
      <Modal visible={isVictory} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalCard,
              { transform: [{ scale: victoryScale }] },
            ]}
          >
            <Text style={styles.trophyEmoji}>🏆</Text>
            <Text style={styles.modalTitle}>BÉ LÀ CHUYÊN GIA ĐỘNG VẬT! 🐶</Text>
            <Text style={styles.modalSub}>
              Bé đã xuất sắc nghe và đoán đúng tất cả các con vật trong nông trại!
            </Text>

            {/* 3 NGÔI SAO */}
            <View style={styles.starsRow}>
              <Text style={styles.starIcon}>⭐</Text>
              <Text style={styles.starIcon}>⭐</Text>
              <Text style={styles.starIcon}>⭐</Text>
            </View>

            <View style={styles.modalStatsBox}>
              <Text style={styles.modalStatItem}>
                🎯 Số câu đúng: <Text style={{ fontWeight: '800', color: '#15803D' }}>{totalQuestions}/{totalQuestions} câu</Text>
              </Text>
              <Text style={styles.modalStatItem}>
                🌟 Tổng điểm thưởng: <Text style={{ fontWeight: '800', color: '#D97706' }}>+{score} Sao</Text>
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.actionPrimaryBtn}
                onPress={startNewQuiz}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FEF3C7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#D97706',
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
    color: '#FDE68A',
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
    backgroundColor: '#16A34A',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  restartBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  content: {
    padding: 16,
    alignItems: 'center',
    paddingBottom: 40,
  },

  /* MODE TAB BAR */
  modeTabBar: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 4,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  modeTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: 14,
  },
  modeTabActive: {
    backgroundColor: '#D97706',
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#78350F',
  },
  modeTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  /* QUIZ CONTAINER */
  quizContainer: {
    width: '100%',
    alignItems: 'center',
  },
  soundCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  soundCardPrompt: {
    fontSize: 15,
    fontWeight: '800',
    color: '#78350F',
    marginBottom: 14,
  },
  soundSpeakerCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FEF3C7',
    borderWidth: 4,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  speakerTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakerIcon: {
    fontSize: 34,
  },
  tapToHearText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
    marginTop: 2,
  },
  speechBubble: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    alignItems: 'center',
    marginBottom: 14,
  },
  speechSoundText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#92400E',
  },
  speechSubText: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 2,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 10,
  },
  progressBarBg: {
    flex: 1,
    height: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 5,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
  },

  /* FEEDBACK BANNERS */
  feedbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 14,
    width: '100%',
  },
  correctBanner: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
  },
  wrongBanner: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1.5,
    borderColor: '#FECACA',
  },
  feedbackEmoji: {
    fontSize: 20,
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
    flex: 1,
  },

  /* OPTIONS GRID */
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  animalChoiceCard: {
    height: 120,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  choiceCardCorrect: {
    borderColor: '#16A34A',
    borderWidth: 4,
  },
  choiceCardWrong: {
    borderColor: '#DC2626',
    borderWidth: 4,
  },
  animalChoiceEmoji: {
    fontSize: 44,
    marginBottom: 6,
  },
  animalChoiceName: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1F2937',
    textAlign: 'center',
  },
  badgeCheck: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#16A34A',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCheckText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  /* EXPLORER */
  explorerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  explorerGuideCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    alignItems: 'center',
  },
  explorerGuideTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#78350F',
    marginBottom: 4,
  },
  explorerGuideSub: {
    fontSize: 12,
    color: '#92400E',
    textAlign: 'center',
  },
  explorerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  explorerCard: {
    height: 130,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    padding: 6,
  },
  explorerCardPlaying: {
    borderColor: '#D97706',
    borderWidth: 3,
  },
  explorerEmoji: {
    fontSize: 42,
    marginBottom: 4,
  },
  explorerName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  explorerSoundPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  explorerSoundPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400E',
  },

  /* VICTORY MODAL */
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
    fontSize: 19,
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
    backgroundColor: '#D97706',
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
