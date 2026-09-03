import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  StatusBar,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { soundManager } from '../components/SoundPlayer';
import {
  dynamicGameService,
  MathGrade,
  MathQuestion,
  DEFAULT_MATH_TOPICS,
} from '../services/dynamicGameService';

const GRADE_CONFIGS = [
  { id: 'preschool', label: 'Mầm Non', age: '3-5t', icon: '🎈', desc: 'Đếm hình & Nhận biết số 1-10', color: '#EC4899' },
  { id: 'grade1', label: 'Lớp 1', age: '6-7t', icon: '🌱', desc: 'Cộng trừ phạm vi 10 & 20', color: '#10B981' },
  { id: 'grade2', label: 'Lớp 2', age: '7-8t', icon: '🚀', desc: 'Bảng nhân 2-5 & Cộng có nhớ', color: '#3B82F6' },
  { id: 'grade3', label: 'Lớp 3', age: '8-9t', icon: '👑', desc: 'Bảng cửu chương & Chia nhẩm', color: '#8B5CF6' },
];

export const MathQuizGameScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [selectedGrade, setSelectedGrade] = useState<MathGrade>('preschool');
  const [questionsList, setQuestionsList] = useState<MathQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<MathQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [stars, setStars] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Bắt đầu game mới & Tải câu hỏi từ dynamicGameService
  const startGame = async (grade: MathGrade) => {
    setSelectedGrade(grade);
    setScore(0);
    setStreak(0);
    setStars(0);
    setQuestionIndex(0);
    setShowSummary(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsLoading(true);

    try {
      const questions = await dynamicGameService.getMathQuestions(grade, 10);
      setQuestionsList(questions);
      if (questions.length > 0) {
        setCurrentQuestion(questions[0]);
        setQuestionIndex(1);
        setTimeLeft(questions[0].time_limit_sec || 15);
        soundManager.speak(questions[0].question_text);
      }
    } catch (err) {
      console.warn('Error loading dynamic math questions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Khởi động câu hỏi tiếp theo
  const nextQuestion = () => {
    if (questionIndex >= questionsList.length || questionIndex >= 10) {
      setShowSummary(true);
      soundManager.speak('Chúc mừng bé đã hoàn thành bài tập toán!');
      // Lưu tiến độ lên Supabase & Offline Cache
      dynamicGameService.saveProgress('default_child', 'math_quiz', selectedGrade, stars, score);
      return;
    }

    const nextIdx = questionIndex + 1;
    setQuestionIndex(nextIdx);
    const q = questionsList[nextIdx - 1] || dynamicGameService.generateLocalMathQuestion(selectedGrade);
    setCurrentQuestion(q);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setTimeLeft(q.time_limit_sec || 15);

    // Đọc đề bài
    soundManager.speak(q.question_text);
  };

  // Đếm ngược thời gian
  useEffect(() => {
    if (isAnswered || showSummary || !currentQuestion) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestion, isAnswered, showSummary]);

  const handleTimeOut = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setIsCorrect(false);
    setStreak(0);
    soundManager.speak('Hết giờ rồi bé ơi!');
  };

  // Xử lý chọn đáp án
  const handleSelectOption = (option: number) => {
    if (isAnswered || !currentQuestion) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedOption(option);
    setIsAnswered(true);

    const correctAnswer = currentQuestion.correct_answer ?? (currentQuestion as any).correctAnswer;
    const correct = option === correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      const points = 10 + Math.min(newStreak * 2, 10);
      setScore((prev) => prev + points);
      setStars((prev) => prev + 1);
      soundManager.play('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3', 'Đúng rồi! Bé giỏi quá!');

      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -15, duration: 150, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      ]).start();
    } else {
      setStreak(0);
      soundManager.speak('Chưa đúng rồi, bé xem đáp án nhé!');
    }
  };

  useEffect(() => {
    startGame(selectedGrade);
  }, []);

  // Render lưới 4 đáp án
  const renderOptionsGrid = () => {
    if (!currentQuestion) return null;
    const correctAnswer = currentQuestion.correct_answer ?? (currentQuestion as any).correctAnswer;

    return (
      <View style={isLandscape ? styles.landscapeOptionsGrid : styles.optionsGrid}>
        {currentQuestion.options.map((opt, idx) => {
          let btnBg = '#312E81';
          let borderColor = '#4F46E5';

          if (isAnswered) {
            if (opt === correctAnswer) {
              btnBg = '#10B981';
              borderColor = '#34D399';
            } else if (opt === selectedOption) {
              btnBg = '#EF4444';
              borderColor = '#F87171';
            }
          }

          return (
            <TouchableOpacity
              key={idx}
              style={[
                isLandscape ? styles.landscapeOptionButton : styles.optionButton,
                { backgroundColor: btnBg, borderColor },
              ]}
              onPress={() => handleSelectOption(opt)}
              disabled={isAnswered}
              activeOpacity={0.7}
            >
              <Text style={isLandscape ? styles.landscapeOptionNumber : styles.optionNumber}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // Render Hộp câu hỏi
  const renderQuestionCard = () => {
    if (!currentQuestion) return null;
    const qText = currentQuestion.question_text || (currentQuestion as any).text;
    const icons = currentQuestion.emoji_icons || (currentQuestion as any).emojiIcons;

    return (
      <Animated.View style={[styles.questionCard, { transform: [{ translateY: bounceAnim }] }]}>
        <Text style={styles.questionCounter}>Câu hỏi {questionIndex}/10</Text>
        <Text style={isLandscape ? styles.landscapeQuestionText : styles.questionText}>
          {qText}
        </Text>

        {/* Hiển thị Emoji đếm nếu có */}
        {icons && icons.length > 0 && (
          <View style={styles.emojiGrid}>
            {icons.map((emoji: string, idx: number) => (
              <Text key={idx} style={isLandscape ? styles.landscapeEmojiItem : styles.emojiItem}>
                {emoji}
              </Text>
            ))}
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1B4B" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>🧮 Bé Vui Học Toán</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statBadge}>⭐ {score} điểm</Text>
            <Text style={styles.statBadge}>🔥 Combo {streak}</Text>
            <Text style={styles.statBadge}>⏱️ {timeLeft}s</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.speakBtn}
          onPress={() => {
            if (currentQuestion) {
              const qText = currentQuestion.question_text || (currentQuestion as any).text;
              soundManager.speak(qText);
            }
          }}
        >
          <Text style={styles.speakIcon}>🔊</Text>
        </TouchableOpacity>
      </View>

      {/* LƯỚI CHỌN CẤP ĐỘ LỚP HỌC (GRID ITEMS CÂN ĐỐI) */}
      <View style={styles.gradeGridContainer}>
        {GRADE_CONFIGS.map((g) => {
          const isSelected = selectedGrade === g.id;
          return (
            <TouchableOpacity
              key={g.id}
              style={[
                styles.gradeGridCard,
                isSelected && {
                  backgroundColor: g.color,
                  borderColor: '#FFFFFF',
                  borderWidth: 2,
                  elevation: 5,
                },
              ]}
              onPress={() => startGame(g.id as MathGrade)}
              activeOpacity={0.8}
            >
              <Text style={styles.gradeGridIcon}>{g.icon}</Text>
              <View style={styles.gradeGridTextCol}>
                <Text
                  style={[styles.gradeGridTitle, isSelected && styles.gradeGridTitleActive]}
                  numberOfLines={1}
                >
                  {g.label}
                </Text>
                <Text
                  style={[styles.gradeGridSub, isSelected && styles.gradeGridSubActive]}
                  numberOfLines={1}
                >
                  {g.age}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* GIAO DIỆN CHÍNH */}
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#EC4899" />
          <Text style={{ color: '#E2E8F0', marginTop: 12, fontSize: 16, fontWeight: '600' }}>
            Đang tải bộ đề toán... 🎈
          </Text>
        </View>
      ) : showSummary ? (
        /* Màn hình tổng kết nhận cúp */
        <View style={styles.summaryCard}>
          <Text style={styles.trophyIcon}>🏆</Text>
          <Text style={styles.summaryTitle}>Chúc Mừng Bé Hoàn Thành!</Text>
          <Text style={styles.summarySubtitle}>Bé đã giải xuất sắc các bài toán</Text>

          <View style={styles.summaryScoreBox}>
            <Text style={styles.finalScore}>⭐ {score} Điểm</Text>
            <Text style={styles.finalStars}>Đúng {stars}/10 câu</Text>
          </View>

          <TouchableOpacity style={styles.playAgainBtn} onPress={() => startGame(selectedGrade)}>
            <Text style={styles.playAgainText}>🔄 Chơi Lại Màn Này</Text>
          </TouchableOpacity>
        </View>
      ) : isLandscape ? (
        /* GIAO DIỆN XOAY NGANG (LANDSCAPE SPLIT-SCREEN) */
        <View style={styles.landscapeMainContainer}>
          {/* Cột Trái: Đề bài & Phản hồi */}
          <View style={styles.landscapeLeftColumn}>
            {renderQuestionCard()}

            {isAnswered && currentQuestion && (
              <View style={styles.feedbackContainer}>
                <Text style={[styles.feedbackText, { color: isCorrect ? '#34D399' : '#F87171' }]}>
                  {isCorrect
                    ? '🎉 Đúng rồi! Bé giỏi quá!'
                    : `💡 Đáp án đúng: ${currentQuestion.correct_answer ?? (currentQuestion as any).correctAnswer}`}
                </Text>
                <TouchableOpacity style={styles.nextBtn} onPress={nextQuestion}>
                  <Text style={styles.nextBtnText}>Câu Tiếp Theo ➔</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Cột Phải: 4 Đáp án */}
          <View style={styles.landscapeRightColumn}>
            {renderOptionsGrid()}
          </View>
        </View>
      ) : (
        /* GIAO DIỆN DỌC (PORTRAIT) */
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {currentQuestion && (
            <View style={styles.quizArea}>
              {renderQuestionCard()}
              {renderOptionsGrid()}

              {isAnswered && (
                <View style={styles.feedbackContainer}>
                  <Text style={[styles.feedbackText, { color: isCorrect ? '#34D399' : '#F87171' }]}>
                    {isCorrect
                      ? '🎉 Tuyệt vời! Bé chọn đúng rồi!'
                      : `💡 Đáp án đúng là: ${currentQuestion.correct_answer ?? (currentQuestion as any).correctAnswer}`}
                  </Text>
                  <TouchableOpacity style={styles.nextBtn} onPress={nextQuestion}>
                    <Text style={styles.nextBtnText}>Câu Tiếp Theo ➔</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  landscapeMainContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 16,
  },
  landscapeLeftColumn: {
    flex: 1.1,
    justifyContent: 'center',
    gap: 6,
  },
  landscapeRightColumn: {
    flex: 0.9,
    justifyContent: 'center',
  },
  landscapeQuestionText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  landscapeEmojiItem: {
    fontSize: 26,
  },
  landscapeOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  landscapeOptionButton: {
    width: '48%',
    height: 70,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  landscapeOptionNumber: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E1B4B',
    borderBottomWidth: 2,
    borderBottomColor: '#312E81',
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#F9FAFB',
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
  statsRow: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 8,
  },
  statBadge: {
    color: '#E0E7FF',
    fontSize: 12,
    fontWeight: '700',
    backgroundColor: '#312E81',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  speakBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakIcon: {
    fontSize: 20,
  },
  gradeGridContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#16143A',
    borderBottomWidth: 1.5,
    borderBottomColor: '#2E2A68',
    gap: 6,
  },
  gradeGridCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 14,
    backgroundColor: '#231F53',
    borderWidth: 1.5,
    borderColor: '#4338CA',
    gap: 4,
  },
  gradeGridIcon: {
    fontSize: 16,
  },
  gradeGridTextCol: {
    alignItems: 'flex-start',
  },
  gradeGridTitle: {
    color: '#C7D2FE',
    fontSize: 11,
    fontWeight: '800',
  },
  gradeGridTitleActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  gradeGridSub: {
    color: '#818CF8',
    fontSize: 9,
    fontWeight: '600',
  },
  gradeGridSubActive: {
    color: '#FDF4FF',
    fontWeight: '700',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'android' ? 60 : 36,
  },
  quizArea: {
    width: '100%',
  },
  questionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#38BDF8',
    elevation: 8,
    shadowColor: '#38BDF8',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  questionCounter: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  questionText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
    gap: 12,
  },
  emojiItem: {
    fontSize: 34,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginVertical: 16,
  },
  optionButton: {
    width: '48%',
    height: 80,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  optionNumber: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
  },
  feedbackContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  nextBtn: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 24,
    elevation: 4,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  summaryCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  trophyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  summaryTitle: {
    color: '#FBBF24',
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
  },
  summarySubtitle: {
    color: '#94A3B8',
    fontSize: 15,
    marginTop: 6,
  },
  summaryScoreBox: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 24,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  finalScore: {
    color: '#FBBF24',
    fontSize: 32,
    fontWeight: '900',
  },
  finalStars: {
    color: '#34D399',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  playAgainBtn: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 36,
    paddingVertical: 16,
    borderRadius: 28,
  },
  playAgainText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
});

export default MathQuizGameScreen;
