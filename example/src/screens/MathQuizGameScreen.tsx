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
  Platform,
} from 'react-native';
import { soundManager } from '../components/SoundPlayer';

type MathGrade = 'preschool' | 'grade1' | 'grade2' | 'grade3';

interface Question {
  text: string;
  subText?: string;
  emojiIcons?: string[];
  options: number[];
  correctAnswer: number;
  explanation: string;
}

const GRADE_CONFIGS = [
  { id: 'preschool', label: 'Mầm Non (3-5t)', icon: '🎈', desc: 'Đếm hình & Nhận biết số 1-10', color: '#EC4899' },
  { id: 'grade1', label: 'Lớp 1 (6-7t)', icon: '🌱', desc: 'Cộng trừ phạm vi 10 & 20', color: '#10B981' },
  { id: 'grade2', label: 'Lớp 2 (7-8t)', icon: '🚀', desc: 'Bảng nhân 2-5 & Cộng có nhớ', color: '#3B82F6' },
  { id: 'grade3', label: 'Lớp 3 (8-9t)', icon: '👑', desc: 'Bảng cửu chương & Chia nhẩm', color: '#8B5CF6' },
];

export const MathQuizGameScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [selectedGrade, setSelectedGrade] = useState<MathGrade>('preschool');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
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

  // Sinh câu hỏi theo cấp lớp
  const generateQuestion = (grade: MathGrade): Question => {
    let q: Question;
    if (grade === 'preschool') {
      const count = Math.floor(Math.random() * 8) + 2; // 2 đến 9
      const emojis = ['🍎', '⭐️', '🚗', '🐱', '🍦', '🎈', '🐥', '🍓'];
      const chosenEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      const icons = Array(count).fill(chosenEmoji);
      
      const wrong1 = Math.max(1, count + (Math.random() > 0.5 ? 1 : -1));
      const wrong2 = Math.max(1, count + (Math.random() > 0.5 ? 2 : -2));
      const wrong3 = Math.max(1, count + (Math.random() > 0.5 ? 3 : -3));
      const options = Array.from(new Set([count, wrong1, wrong2, wrong3])).slice(0, 4);
      while (options.length < 4) {
        options.push(options.length + 1);
      }
      options.sort(() => Math.random() - 0.5);

      q = {
        text: `Bé hãy đếm xem có bao nhiêu ${chosenEmoji} nhé?`,
        emojiIcons: icons,
        options,
        correctAnswer: count,
        explanation: `Chính xác! Có tất cả ${count} ${chosenEmoji} nè!`,
      };
    } else if (grade === 'grade1') {
      const isAdd = Math.random() > 0.4;
      if (isAdd) {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const correct = a + b;
        const options = [correct, correct + 1, Math.max(0, correct - 1), correct + 2].sort(() => Math.random() - 0.5);
        q = {
          text: `${a} + ${b} = ?`,
          options: Array.from(new Set(options)).slice(0, 4),
          correctAnswer: correct,
          explanation: `${a} cộng ${b} bằng ${correct}!`,
        };
      } else {
        const a = Math.floor(Math.random() * 15) + 5;
        const b = Math.floor(Math.random() * (a - 1)) + 1;
        const correct = a - b;
        const options = [correct, correct + 1, Math.max(0, correct - 1), correct + 2].sort(() => Math.random() - 0.5);
        q = {
          text: `${a} - ${b} = ?`,
          options: Array.from(new Set(options)).slice(0, 4),
          correctAnswer: correct,
          explanation: `${a} trừ ${b} bằng ${correct}!`,
        };
      }
    } else if (grade === 'grade2') {
      const num1 = Math.floor(Math.random() * 4) + 2; // 2, 3, 4, 5
      const num2 = Math.floor(Math.random() * 9) + 1; // 1 đến 9
      const correct = num1 * num2;
      const options = [correct, correct + num1, Math.max(0, correct - num1), correct + 2].sort(() => Math.random() - 0.5);
      q = {
        text: `${num1} × ${num2} = ?`,
        options: Array.from(new Set(options)).slice(0, 4),
        correctAnswer: correct,
        explanation: `${num1} nhân ${num2} bằng ${correct}!`,
      };
    } else {
      const isMult = Math.random() > 0.4;
      if (isMult) {
        const a = Math.floor(Math.random() * 7) + 3; // 3 đến 9
        const b = Math.floor(Math.random() * 8) + 2; // 2 đến 9
        const correct = a * b;
        const options = [correct, correct + a, Math.max(1, correct - a), correct + 4].sort(() => Math.random() - 0.5);
        q = {
          text: `${a} × ${b} = ?`,
          options: Array.from(new Set(options)).slice(0, 4),
          correctAnswer: correct,
          explanation: `${a} nhân ${b} bằng ${correct}!`,
        };
      } else {
        const b = Math.floor(Math.random() * 6) + 2; // chia cho 2-7
        const correct = Math.floor(Math.random() * 8) + 2;
        const a = b * correct;
        const options = [correct, correct + 1, Math.max(1, correct - 1), correct + 2].sort(() => Math.random() - 0.5);
        q = {
          text: `${a} ÷ ${b} = ?`,
          options: Array.from(new Set(options)).slice(0, 4),
          correctAnswer: correct,
          explanation: `${a} chia ${b} bằng ${correct}!`,
        };
      }
    }
    return q;
  };

  // Khởi động câu hỏi
  const nextQuestion = () => {
    if (questionIndex >= 9) {
      setShowSummary(true);
      soundManager.speak('Chúc mừng bé đã hoàn thành bài tập toán!');
      return;
    }

    const nextIdx = questionIndex + 1;
    setQuestionIndex(nextIdx);
    const q = generateQuestion(selectedGrade);
    setCurrentQuestion(q);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setTimeLeft(15);

    // Đọc đề bài
    soundManager.speak(q.text);
  };

  // Bắt đầu game mới
  const startGame = (grade: MathGrade) => {
    setSelectedGrade(grade);
    setScore(0);
    setStreak(0);
    setStars(0);
    setQuestionIndex(1);
    setShowSummary(false);
    setSelectedOption(null);
    setIsAnswered(false);

    const q = generateQuestion(grade);
    setCurrentQuestion(q);
    setTimeLeft(15);
    soundManager.speak(q.text);
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

    const correct = option === currentQuestion.correctAnswer;
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
    return (
      <View style={isLandscape ? styles.landscapeOptionsGrid : styles.optionsGrid}>
        {currentQuestion.options.map((opt, idx) => {
          let btnBg = '#312E81';
          let borderColor = '#4F46E5';

          if (isAnswered) {
            if (opt === currentQuestion.correctAnswer) {
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
    return (
      <Animated.View style={[styles.questionCard, { transform: [{ translateY: bounceAnim }] }]}>
        <Text style={styles.questionCounter}>Câu hỏi {questionIndex}/10</Text>
        <Text style={isLandscape ? styles.landscapeQuestionText : styles.questionText}>
          {currentQuestion.text}
        </Text>

        {/* Hiển thị Emoji đếm nếu có */}
        {currentQuestion.emojiIcons && (
          <View style={styles.emojiGrid}>
            {currentQuestion.emojiIcons.map((emoji, idx) => (
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
          onPress={() => currentQuestion && soundManager.speak(currentQuestion.text)}
        >
          <Text style={styles.speakIcon}>🔊</Text>
        </TouchableOpacity>
      </View>

      {/* Chọn cấp lớp */}
      <View style={styles.gradeContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gradeScroll}>
          {GRADE_CONFIGS.map((g) => (
            <TouchableOpacity
              key={g.id}
              style={[
                styles.gradeTab,
                selectedGrade === g.id && { backgroundColor: g.color, borderColor: '#FFFFFF' },
              ]}
              onPress={() => startGame(g.id as MathGrade)}
            >
              <Text style={styles.gradeIcon}>{g.icon}</Text>
              <Text style={[styles.gradeText, selectedGrade === g.id && styles.gradeTextActive]}>
                {g.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* GIAO DIỆN CHÍNH */}
      {showSummary ? (
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
                  {isCorrect ? '🎉 Đúng rồi! Bé giỏi quá!' : `💡 Đáp án đúng: ${currentQuestion.correctAnswer}`}
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
                    {isCorrect ? '🎉 Tuyệt vời! Bé chọn đúng rồi!' : `💡 Đáp án đúng là: ${currentQuestion.correctAnswer}`}
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
    gap: 10,
  },
  landscapeOptionButton: {
    width: '48%',
    height: 62,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    elevation: 5,
  },
  landscapeOptionNumber: {
    color: '#FFFFFF',
    fontSize: 26,
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
  gradeContainer: {
    paddingVertical: 8,
    backgroundColor: '#1E1B4B',
  },
  gradeScroll: {
    paddingHorizontal: 12,
    gap: 8,
  },
  gradeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#312E81',
    borderWidth: 1.5,
    borderColor: '#4338CA',
  },
  gradeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  gradeText: {
    color: '#C7D2FE',
    fontWeight: '700',
    fontSize: 13,
  },
  gradeTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
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
    height: 84,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    elevation: 6,
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
