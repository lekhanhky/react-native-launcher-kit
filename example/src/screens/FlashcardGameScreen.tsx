import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Animated,
  useWindowDimensions,
  Modal,
  Platform,
} from 'react-native';
import {
  VocabCard,
  VocabCategory,
} from '../data/oxfordKidsVocabulary';
import { vocabularyService } from '../services/vocabularyService';
import { soundManager } from '../components/SoundPlayer';
import { ThemeToggle, ThemeMode } from '../components/ThemeToggle';
import { storage, STORAGE_KEYS } from '../services/storage';

export type LanguageMode = 'vi' | 'en' | 'bilingual';
export type ViewActivity = 'explore' | 'quiz';

export const FlashcardGameScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { width, height } = useWindowDimensions();

  // Chế độ giao diện: Sáng (Light) / Tối (Dark)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = storage.getString(STORAGE_KEYS.CURRENT_THEME);
      return saved === 'light' || saved === 'dark' ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  const isLight = theme === 'light';

  const handleToggleTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    try {
      storage.set(STORAGE_KEYS.CURRENT_THEME, newTheme);
    } catch (e) {
      console.warn('Lỗi lưu theme:', e);
    }
    showToast(`Đã đổi giao diện: ${newTheme === 'light' ? '☀️ Sáng' : '🌙 Tối'}`);
  };

  // Chế độ ngôn ngữ: Tiếng Việt / Tiếng Anh / Song Ngữ
  const [langMode, setLangMode] = useState<LanguageMode>('bilingual');
  const [currentActivity, setCurrentActivity] = useState<ViewActivity>('explore');

  // Danh mục từ vựng động (lấy từ storage qua vocabularyService)
  const [allCategories, setAllCategories] = useState<VocabCategory[]>(() =>
    vocabularyService.getAllCategories()
  );
  const [selectedCategory, setSelectedCategory] = useState<VocabCategory>(
    allCategories[0] || {
      id: 'default',
      titleEn: 'Default',
      titleVi: 'Mặc định',
      icon: '📚',
      color: '#3B82F6',
      cards: [],
    }
  );
  const [cardIndex, setCardIndex] = useState<number>(0);
  const currentCard: VocabCard =
    selectedCategory.cards[cardIndex] ||
    selectedCategory.cards[0] || {
      id: 'dummy',
      english: 'Word',
      ipa: '/wɜːd/',
      vietnamese: 'Từ vựng',
      category: 'default',
      emoji: '📚',
      color: '#3B82F6',
      exampleEn: 'Example',
      exampleVi: 'Ví dụ',
      funFact: 'Chưa có từ vựng nào trong danh mục này.',
    };

  // Trạng thái lật thẻ 3D (Front = English, Back = Vietnamese)
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  // Modal Chọn Chủ Đề (Topic Grid Modal)
  const [isTopicModalVisible, setIsTopicModalVisible] = useState<boolean>(false);

  // Điểm số & Quiz State
  const [quizTarget, setQuizTarget] = useState<VocabCard | null>(null);
  const [quizOptions, setQuizOptions] = useState<VocabCard[]>([]);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizStreak, setQuizStreak] = useState<number>(0);
  const [toastMsg, setToastMsg] = useState<string>('');

  // Modal Chiến Thắng
  const [isVictoryVisible, setIsVictoryVisible] = useState<boolean>(false);
  const victoryScale = useRef(new Animated.Value(0.3)).current;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 1800);
  };

  // Hiệu ứng lật thẻ 3D
  const handleFlipCard = () => {
    const toValue = isFlipped ? 0 : 180;
    Animated.spring(flipAnim, {
      toValue,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  // Reset góc lật khi chuyển thẻ
  const resetFlip = () => {
    setIsFlipped(false);
    flipAnim.setValue(0);
  };

  // Góc xoay mặt trước và mặt sau
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };
  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  // Phát âm tiếng Anh chuẩn bản xứ Oxford (US)
  const speakEnglish = (card: VocabCard) => {
    soundManager.speak(card.english, 'en');
  };

  // Phát âm tiếng Việt
  const speakVietnamese = (card: VocabCard) => {
    soundManager.speak(card.vietnamese, 'vi');
  };

  // Phát âm từ vựng theo ngữ cảnh chế độ đang chọn
  const speakWord = (card: VocabCard) => {
    if (langMode === 'vi') {
      soundManager.speak(card.vietnamese, 'vi');
    } else {
      // Mặc định luôn phát âm tiếng Anh chuẩn US
      soundManager.speak(card.english, 'en');
    }
  };

  // Phát âm toàn bộ song ngữ (Đọc tiếng Anh chuẩn rồi dịch tiếng Việt)
  const speakBilingualFull = (card: VocabCard) => {
    soundManager.speak(card.english, 'en');
    setTimeout(() => {
      soundManager.speak(`Nghĩa là: ${card.vietnamese}`, 'vi');
    }, 1100);
  };

  // Đọc câu ví dụ
  const speakExample = (card: VocabCard) => {
    if (langMode === 'vi') {
      soundManager.speak(card.exampleVi, 'vi');
    } else {
      soundManager.speak(card.exampleEn, 'en');
    }
  };

  // Chuyển thẻ tiếp theo
  const handleNextCard = () => {
    resetFlip();
    const nextIdx = (cardIndex + 1) % selectedCategory.cards.length;
    setCardIndex(nextIdx);
    const nextCard = selectedCategory.cards[nextIdx];
    speakWord(nextCard);
  };

  // Lùi về thẻ trước
  const handlePrevCard = () => {
    resetFlip();
    const prevIdx =
      (cardIndex - 1 + selectedCategory.cards.length) % selectedCategory.cards.length;
    setCardIndex(prevIdx);
    const prevCard = selectedCategory.cards[prevIdx];
    speakWord(prevCard);
  };

  // Chọn danh mục mới
  const handleSelectCategory = (cat: VocabCategory) => {
    setSelectedCategory(cat);
    setCardIndex(0);
    resetFlip();
    setCurrentActivity('explore');
    setIsTopicModalVisible(false);
    showToast(`📚 Đã chọn: ${cat.titleVi}`);
    if (cat.cards && cat.cards.length > 0) {
      speakWord(cat.cards[0]);
    }
  };

  // Khởi tạo câu hỏi đố vui (Quiz)
  const setupQuizQuestion = () => {
    const allCards = selectedCategory.cards;
    const target = allCards[Math.floor(Math.random() * allCards.length)];
    setQuizTarget(target);

    // Tạo 4 đáp án
    const options: VocabCard[] = [target];
    const otherCards = allCards.filter((c) => c.id !== target.id);
    otherCards.sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(3, otherCards.length); i++) {
      options.push(otherCards[i]);
    }
    options.sort(() => Math.random() - 0.5);
    setQuizOptions(options);

    // Phát âm câu hỏi
    if (langMode === 'vi') {
      soundManager.speak(target.vietnamese, 'vi');
    } else {
      soundManager.speak(target.english, 'en');
    }
  };

  // Trả lời câu hỏi Quiz
  const handleQuizAnswer = (card: VocabCard) => {
    if (!quizTarget) return;

    if (card.id === quizTarget.id) {
      const newScore = quizScore + 10;
      const newStreak = quizStreak + 1;
      setQuizScore(newScore);
      setQuizStreak(newStreak);

      if (typeof soundManager.playSuccess === 'function') {
        soundManager.playSuccess();
      } else {
        soundManager.speak('Chính xác! Hoan hô bé', 'vi');
      }
      showToast('🎉 Bé trả lời chính xác! +10 Điểm');

      if (newStreak >= 5) {
        setIsVictoryVisible(true);
        Animated.spring(victoryScale, {
          toValue: 1,
          friction: 4,
          tension: 50,
          useNativeDriver: true,
        }).start();
      } else {
        setTimeout(setupQuizQuestion, 1200);
      }
    } else {
      if (typeof soundManager.playError === 'function') {
        soundManager.playError();
      } else {
        soundManager.speak('Chưa đúng rồi, bé thử lại nhé', 'vi');
      }
      setQuizStreak(0);
      showToast('💡 Chưa đúng rồi, bé thử lại nhé!');
    }
  };

  // Bật màn hình & Đăng ký lắng nghe thay đổi dữ liệu từ vựng
  useEffect(() => {
    speakWord(currentCard);

    const unsubscribe = vocabularyService.subscribe((updated) => {
      setAllCategories(updated);
      const exists = updated.find((c) => c.id === selectedCategory.id);
      if (exists) {
        setSelectedCategory(exists);
      } else if (updated.length > 0) {
        setSelectedCategory(updated[0]);
        setCardIndex(0);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={[styles.container, isLight && styles.containerLight]}>
      <StatusBar
        barStyle={isLight ? 'dark-content' : 'light-content'}
        backgroundColor={isLight ? '#FFFFFF' : '#0F172A'}
      />

      {/* HEADER: Tiêu đề, Chế độ, Nút Sáng/Tối, Đóng */}
      <View style={[styles.header, isLight && styles.headerLight]}>
        <TouchableOpacity
          style={[styles.closeBtn, isLight && styles.closeBtnLight]}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <Text style={[styles.closeText, isLight && styles.closeTextLight]}>✕</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, isLight && styles.headerTitleLight]}>
            🎴 Thẻ Từ Vựng Oxford
          </Text>
          <Text style={[styles.headerSubtitle, isLight && styles.headerSubtitleLight]}>
            {selectedCategory.icon} {selectedCategory.titleVi} ({cardIndex + 1}/
            {selectedCategory.cards.length})
          </Text>
        </View>

        <View style={styles.headerRightActions}>
          {/* Component Chuyển Theme Sáng / Tối */}
          <ThemeToggle
            theme={theme}
            onToggle={handleToggleTheme}
            compact={true}
          />

          {/* Nút mở danh mục Grid */}
          <TouchableOpacity
            style={[styles.topicMenuBtn, isLight && styles.topicMenuBtnLight]}
            onPress={() => setIsTopicModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={[styles.topicMenuText, isLight && styles.topicMenuTextLight]}>
              📚 Chủ Đề
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* THANH CHỌN 3 CHẾ ĐỘ NGÔN NGỮ (VI / EN / SONG NGỮ) */}
      <View style={[styles.langSelectorRow, isLight && styles.langSelectorRowLight]}>
        {[
          { id: 'bilingual', label: '🌐 Song Ngữ', desc: 'Anh ⇄ Việt' },
          { id: 'en', label: '🇬🇧 English', desc: 'Oxford US' },
          { id: 'vi', label: '🇻🇳 Tiếng Việt', desc: 'Chuẩn Việt' },
        ].map((item) => {
          const isSelected = langMode === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.langCard,
                isLight && styles.langCardLight,
                isSelected && (isLight ? styles.langCardActiveLight : styles.langCardActive),
              ]}
              onPress={() => {
                setLangMode(item.id as LanguageMode);
                showToast(`Chế độ: ${item.label}`);
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.langLabel,
                  isLight && styles.langLabelLight,
                  isSelected && styles.langLabelActive,
                ]}
              >
                {item.label}
              </Text>
              <Text
                style={[
                  styles.langDesc,
                  isLight && styles.langDescLight,
                  isSelected && styles.langDescActive,
                ]}
              >
                {item.desc}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* THANH CHUYỂN TABS: KHÁM PHÁ / ĐỐ VUI */}
      <View style={[styles.tabContainer, isLight && styles.tabContainerLight]}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            isLight && styles.tabButtonLight,
            currentActivity === 'explore' && styles.tabButtonActive,
          ]}
          onPress={() => {
            setCurrentActivity('explore');
            resetFlip();
            speakWord(currentCard);
          }}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              isLight && styles.tabTextLight,
              currentActivity === 'explore' && styles.tabTextActive,
            ]}
          >
            🎴 Lướt & Khám Phá Thẻ
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            isLight && styles.tabButtonLight,
            currentActivity === 'quiz' && styles.tabButtonActive,
          ]}
          onPress={() => {
            setCurrentActivity('quiz');
            setupQuizQuestion();
          }}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              isLight && styles.tabTextLight,
              currentActivity === 'quiz' && styles.tabTextActive,
            ]}
          >
            🔍 Thám Tử Đoán Tranh
          </Text>
        </TouchableOpacity>
      </View>

      {/* TOAST THÔNG BÁO */}
      {toastMsg !== '' && (
        <View style={[styles.toastBadge, isLight && styles.toastBadgeLight]}>
          <Text style={styles.toastText}>{toastMsg}</Text>
        </View>
      )}

      {/* ========================================================================= */}
      {/* 1. HOẠT ĐỘNG: LƯỚT THẺ 3D KHÁM PHÁ TỪ VỰNG */}
      {/* ========================================================================= */}
      {currentActivity === 'explore' && (
        <View style={styles.exploreWrapper}>
          {/* KHUNG THẺ BÀI 3D LẬT */}
          <TouchableOpacity
            style={styles.cardContainer}
            onPress={handleFlipCard}
            activeOpacity={0.95}
          >
            {/* MẶT TRƯỚC: TIẾNG ANH HOẶC CHẾ ĐỘ CHÍNH */}
            <Animated.View
              style={[
                styles.flashCard,
                isLight && styles.flashCardLight,
                styles.cardFront,
                { borderColor: currentCard.color },
                frontAnimatedStyle,
              ]}
            >
              <View
                style={[
                  styles.cardHeaderTag,
                  { backgroundColor: currentCard.color },
                ]}
              >
                <Text style={styles.cardHeaderTagText}>
                  {langMode === 'vi' ? '🇻🇳 TIẾNG VIỆT' : '🇬🇧 OXFORD 3000'}
                </Text>
                <Text style={styles.flipHintText}>🔄 Chạm để lật</Text>
              </View>

              <View
                style={[
                  styles.cardVisualBox,
                  isLight && styles.cardVisualBoxLight,
                ]}
              >
                <Text style={styles.cardEmoji}>{currentCard.emoji}</Text>
              </View>

              <View style={styles.cardContent}>
                {langMode === 'vi' ? (
                  <>
                    <Text
                      style={[
                        styles.mainWord,
                        isLight && styles.mainWordLight,
                      ]}
                    >
                      {currentCard.vietnamese}
                    </Text>
                    <Text
                      style={[
                        styles.subWord,
                        isLight && styles.subWordLight,
                      ]}
                    >
                      {currentCard.english}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text
                      style={[
                        styles.mainWord,
                        isLight && styles.mainWordLight,
                      ]}
                    >
                      {currentCard.english}
                    </Text>
                    <Text
                      style={[
                        styles.ipaText,
                        isLight && styles.ipaTextLight,
                      ]}
                    >
                      {currentCard.ipa}
                    </Text>
                    {langMode === 'bilingual' && (
                      <Text
                        style={[
                          styles.bilingualTrans,
                          isLight && styles.bilingualTransLight,
                        ]}
                      >
                        {currentCard.vietnamese}
                      </Text>
                    )}
                  </>
                )}

                <TouchableOpacity
                  style={[
                    styles.exampleBubble,
                    isLight && styles.exampleBubbleLight,
                  ]}
                  onPress={() => speakExample(currentCard)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.exampleText,
                      isLight && styles.exampleTextLight,
                    ]}
                  >
                    💬 {langMode === 'vi' ? currentCard.exampleVi : currentCard.exampleEn}
                  </Text>
                  {langMode === 'bilingual' && (
                    <Text
                      style={[
                        styles.exampleText,
                        { color: isLight ? '#0284C7' : '#38BDF8', marginTop: 4 },
                      ]}
                    >
                      ✨ {currentCard.exampleVi}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.cardFooter,
                  isLight && styles.cardFooterLight,
                ]}
              >
                <Text
                  style={[
                    styles.funFactText,
                    isLight && styles.funFactTextLight,
                  ]}
                >
                  💡 {currentCard.funFact}
                </Text>
              </View>
            </Animated.View>

            {/* MẶT SAU: NGHĨA TIẾNG VIỆT & VÍ DỤ NGỮ CẢNH */}
            <Animated.View
              style={[
                styles.flashCard,
                styles.cardBack,
                isLight && styles.cardBackLight,
                { borderColor: currentCard.color },
                backAnimatedStyle,
              ]}
            >
              <View
                style={[
                  styles.cardHeaderTag,
                  { backgroundColor: currentCard.color },
                ]}
              >
                <Text style={styles.cardHeaderTagText}>
                  {langMode === 'vi' ? '🇬🇧 TIẾNG ANH' : '🇻🇳 NGHĨA TIẾNG VIỆT'}
                </Text>
                <Text style={styles.flipHintText}>🔄 Chạm để lật</Text>
              </View>

              <View
                style={[
                  styles.cardVisualBox,
                  isLight && styles.cardVisualBoxLight,
                ]}
              >
                <Text style={styles.cardEmoji}>{currentCard.emoji}</Text>
              </View>

              <View style={styles.cardContent}>
                <Text
                  style={[
                    styles.mainWord,
                    isLight ? styles.mainWordBackLight : styles.mainWordBack,
                  ]}
                >
                  {currentCard.vietnamese}
                </Text>
                <Text
                  style={[
                    styles.subWord,
                    isLight && styles.subWordBackLight,
                  ]}
                >
                  {currentCard.english} ({currentCard.ipa})
                </Text>

                <View
                  style={[
                    styles.exampleBubble,
                    isLight && styles.exampleBubbleBackLight,
                  ]}
                >
                  <Text
                    style={[
                      styles.exampleText,
                      isLight ? styles.exampleTextBackLight : styles.exampleTextBack,
                    ]}
                  >
                    💬 {currentCard.exampleVi}
                  </Text>
                  <Text
                    style={[
                      styles.exampleText,
                      { color: isLight ? '#0369A1' : '#CBD5E1', marginTop: 4 },
                    ]}
                  >
                    ✨ {currentCard.exampleEn}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.cardFooter,
                  isLight && styles.cardFooterLight,
                ]}
              >
                <Text
                  style={[
                    styles.funFactText,
                    isLight && styles.funFactTextLight,
                  ]}
                >
                  💡 {currentCard.funFact}
                </Text>
              </View>
            </Animated.View>
          </TouchableOpacity>

          {/* CỤM NÚT ĐIỀU KHIỂN & ÂM THANH */}
          <View style={styles.actionControlsRow}>
            {/* Lùi Thẻ */}
            <TouchableOpacity
              style={[styles.navBtn, isLight && styles.navBtnLight]}
              onPress={handlePrevCard}
              activeOpacity={0.8}
            >
              <Text style={[styles.navBtnText, isLight && styles.navBtnTextLight]}>◀ Trước</Text>
            </TouchableOpacity>

            {/* Nút Đọc Tiếng Anh Chuẩn Oxford (US) */}
            <TouchableOpacity
              style={[styles.speakBtn, { backgroundColor: currentCard.color }]}
              onPress={() => speakEnglish(currentCard)}
              activeOpacity={0.8}
            >
              <Text style={styles.speakBtnIcon}>🔊</Text>
              <Text style={styles.speakBtnText}>🇬🇧 Tiếng Anh</Text>
            </TouchableOpacity>

            {/* Nút Đọc Song Ngữ */}
            <TouchableOpacity
              style={styles.bilingualBtn}
              onPress={() => speakBilingualFull(currentCard)}
              activeOpacity={0.8}
            >
              <Text style={styles.bilingualBtnText}>🌐 Song Ngữ</Text>
            </TouchableOpacity>

            {/* Tiến Thẻ */}
            <TouchableOpacity
              style={[styles.navBtn, isLight && styles.navBtnLight]}
              onPress={handleNextCard}
              activeOpacity={0.8}
            >
              <Text style={[styles.navBtnText, isLight && styles.navBtnTextLight]}>Tiếp ▶</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ========================================================================= */}
      {/* 2. HOẠT ĐỘNG: THÁM TỬ ĐOÁN TRANH (QUIZ MODE) */}
      {/* ========================================================================= */}
      {currentActivity === 'quiz' && quizTarget && (
        <View style={styles.quizWrapper}>
          <View
            style={[
              styles.quizHeaderBox,
              isLight && styles.quizHeaderBoxLight,
            ]}
          >
            <Text
              style={[
                styles.quizQuestionPrompt,
                isLight && styles.quizQuestionPromptLight,
              ]}
            >
              {langMode === 'vi'
                ? `🎯 Hãy chạm vào thẻ của từ:`
                : `🎯 Listen and pick the card:`}
            </Text>
            <TouchableOpacity
              style={[
                styles.quizTargetBadge,
                isLight && styles.quizTargetBadgeLight,
              ]}
              onPress={() => {
                if (langMode === 'vi') soundManager.speak(quizTarget.vietnamese, 'vi');
                else soundManager.speak(quizTarget.english, 'en');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.quizTargetText}>
                🔊{' '}
                {langMode === 'vi'
                  ? quizTarget.vietnamese
                  : quizTarget.english}
              </Text>
            </TouchableOpacity>

            <View style={styles.quizScoreRow}>
              <Text
                style={[
                  styles.quizStatBadge,
                  isLight && styles.quizStatBadgeLight,
                ]}
              >
                ⭐ Điểm: {quizScore}
              </Text>
              <Text
                style={[
                  styles.quizStatBadge,
                  isLight && styles.quizStatBadgeLight,
                ]}
              >
                🔥 Chuỗi đúng: {quizStreak}/5
              </Text>
            </View>
          </View>

          {/* LƯỚI 4 THẺ BÀI TRẢ LỜI (2x2 GRID) */}
          <View style={styles.quizGridContainer}>
            {quizOptions.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.quizOptionCard,
                  isLight && styles.quizOptionCardLight,
                  { borderColor: opt.color },
                ]}
                onPress={() => handleQuizAnswer(opt)}
                activeOpacity={0.8}
              >
                <Text style={styles.quizCardEmoji}>{opt.emoji}</Text>
                <Text
                  style={[
                    styles.quizCardLabel,
                    isLight && styles.quizCardLabelLight,
                  ]}
                  numberOfLines={1}
                >
                  {langMode === 'vi' ? opt.vietnamese : opt.english}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CHỌN CHỦ ĐỀ TỪ VỰNG (TOPIC GRID MODAL) */}
      {/* ========================================================================= */}
      <Modal
        visible={isTopicModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsTopicModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.topicModalCard, isLight && styles.topicModalCardLight]}>
            <View style={[styles.modalHeader, isLight && styles.modalHeaderLight]}>
              <Text style={[styles.modalTitle, isLight && styles.modalTitleLight]}>
                📚 Chọn Chủ Đề Từ Vựng ({allCategories.length})
              </Text>
              <TouchableOpacity
                style={[styles.modalCloseBtn, isLight && styles.modalCloseBtnLight]}
                onPress={() => setIsTopicModalVisible(false)}
              >
                <Text style={[styles.modalCloseText, isLight && styles.modalCloseTextLight]}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.topicGridList}>
              {allCategories.map((cat) => {
                const isSelected = selectedCategory.id === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.topicGridCard,
                      isLight && styles.topicGridCardLight,
                      { borderColor: cat.color },
                      isSelected && {
                        backgroundColor: cat.color,
                        borderColor: '#FFFFFF',
                      },
                    ]}
                    onPress={() => handleSelectCategory(cat)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.topicGridIcon}>{cat.icon}</Text>
                    <Text
                      style={[
                        styles.topicGridTitle,
                        isLight && !isSelected && styles.topicGridTitleLight,
                        isSelected && styles.topicGridTitleActive,
                      ]}
                      numberOfLines={1}
                    >
                      {cat.titleVi}
                    </Text>
                    <Text
                      style={[
                        styles.topicGridCount,
                        isLight && !isSelected && styles.topicGridCountLight,
                        isSelected && styles.topicGridCountActive,
                      ]}
                    >
                      {cat.cards.length} thẻ từ
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL: CHIẾN THẮNG QUIZ */}
      {/* ========================================================================= */}
      <Modal
        visible={isVictoryVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVictoryVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.victoryCard,
              isLight && styles.victoryCardLight,
              { transform: [{ scale: victoryScale }] },
            ]}
          >
            <Text style={styles.victoryTrophy}>🏆 🌟 🎴</Text>
            <Text style={[styles.victoryTitle, isLight && styles.victoryTitleLight]}>
              BÉ LÀ THÁM TỬ TỪ VỰNG!
            </Text>
            <Text style={[styles.victorySubtitle, isLight && styles.victorySubtitleLight]}>
              Chúc mừng bé đã trả lời đúng liên tiếp 5 câu hỏi từ vựng xuất sắc!
            </Text>

            <View style={[styles.victoryScoreBox, isLight && styles.victoryScoreBoxLight]}>
              <Text style={styles.victoryFinalScore}>⭐ {quizScore} Điểm Thưởng</Text>
            </View>

            <TouchableOpacity
              style={styles.victoryBtn}
              onPress={() => {
                setIsVictoryVisible(false);
                setupQuizQuestion();
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.victoryBtnText}>🔄 Thử Thách Màn Tiếp Theo</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  containerLight: {
    backgroundColor: '#F1F5F9',
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1.5,
    borderBottomColor: '#334155',
  },
  headerLight: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E2E8F0',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnLight: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  closeText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeTextLight: {
    color: '#475569',
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 6,
  },
  headerTitle: {
    color: '#FBBF24',
    fontSize: 15,
    fontWeight: '900',
  },
  headerTitleLight: {
    color: '#1E293B',
  },
  headerSubtitle: {
    color: '#C7D2FE',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  headerSubtitleLight: {
    color: '#64748B',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  topicMenuBtn: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#93C5FD',
  },
  topicMenuBtnLight: {
    backgroundColor: '#4F46E5',
    borderColor: '#C7D2FE',
  },
  topicMenuText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
  },
  topicMenuTextLight: {
    color: '#FFFFFF',
  },

  /* THANH CHỌN 3 CHẾ ĐỘ NGÔN NGỮ */
  langSelectorRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#1E293B',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  langSelectorRowLight: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E2E8F0',
  },
  langCard: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  langCardLight: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  langCardActive: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
    elevation: 4,
  },
  langCardActiveLight: {
    backgroundColor: '#3B82F6',
    borderColor: '#93C5FD',
    elevation: 4,
  },
  langLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '800',
  },
  langLabelLight: {
    color: '#334155',
  },
  langLabelActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  langDesc: {
    color: '#64748B',
    fontSize: 9,
    marginTop: 1,
  },
  langDescLight: {
    color: '#94A3B8',
  },
  langDescActive: {
    color: '#E0F2FE',
    fontWeight: '700',
  },

  /* THANH CHUYỂN TABS */
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#0F172A',
    gap: 8,
  },
  tabContainerLight: {
    backgroundColor: '#F1F5F9',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  tabButtonLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
  },
  tabButtonActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#A78BFA',
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '800',
  },
  tabTextLight: {
    color: '#475569',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },

  /* KHU VỰC THẺ BÀI 3D */
  exploreWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 380,
    height: 380,
    position: 'relative',
  },
  flashCard: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    backgroundColor: '#1E293B',
    borderWidth: 3,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    backfaceVisibility: 'hidden',
  },
  flashCardLight: {
    backgroundColor: '#FFFFFF',
    shadowOpacity: 0.12,
  },
  cardFront: {
    zIndex: 1,
  },
  cardBack: {
    backgroundColor: '#1E1B4B',
  },
  cardBackLight: {
    backgroundColor: '#FFFBEB',
  },
  cardHeaderTag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  cardHeaderTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  flipHintText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  cardVisualBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardVisualBoxLight: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  cardEmoji: {
    fontSize: 70,
  },
  cardContent: {
    alignItems: 'center',
    width: '100%',
  },
  mainWord: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },
  mainWordLight: {
    color: '#0F172A',
  },
  mainWordBack: {
    color: '#FDE047',
  },
  mainWordBackLight: {
    color: '#B45309',
  },
  ipaText: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  ipaTextLight: {
    color: '#0284C7',
  },
  subWord: {
    color: '#FBBF24',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  subWordLight: {
    color: '#D97706',
  },
  subWordBackLight: {
    color: '#475569',
  },
  bilingualTrans: {
    color: '#34D399',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },
  bilingualTransLight: {
    color: '#059669',
  },
  exampleBubble: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 6,
    width: '100%',
    borderWidth: 1,
    borderColor: '#334155',
  },
  exampleBubbleLight: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  exampleBubbleBackLight: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  exampleText: {
    color: '#F1F5F9',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  exampleTextLight: {
    color: '#1E293B',
  },
  exampleTextBack: {
    color: '#FEF3C7',
  },
  exampleTextBackLight: {
    color: '#92400E',
  },
  cardFooter: {
    width: '100%',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  cardFooterLight: {
    borderTopColor: '#E2E8F0',
  },
  funFactText: {
    color: '#94A3B8',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 14,
  },
  funFactTextLight: {
    color: '#64748B',
  },

  /* CỤM NÚT ĐIỀU KHIỂN */
  actionControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 380,
    marginTop: 12,
    gap: 6,
  },
  navBtn: {
    backgroundColor: '#334155',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  navBtnLight: {
    backgroundColor: '#E2E8F0',
  },
  navBtnText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '800',
  },
  navBtnTextLight: {
    color: '#1E293B',
  },
  speakBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    gap: 4,
    elevation: 4,
  },
  speakBtnIcon: {
    fontSize: 16,
  },
  speakBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  bilingualBtn: {
    backgroundColor: '#059669',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  bilingualBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  /* KHU VỰC QUIZ */
  quizWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  quizHeaderBox: {
    alignItems: 'center',
    width: '100%',
  },
  quizHeaderBoxLight: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quizQuestionPrompt: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '700',
  },
  quizQuestionPromptLight: {
    color: '#475569',
  },
  quizTargetBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F59E0B',
    marginTop: 6,
    elevation: 4,
  },
  quizTargetBadgeLight: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  quizTargetText: {
    color: '#FBBF24',
    fontSize: 22,
    fontWeight: '900',
  },
  quizScoreRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 10,
  },
  quizStatBadge: {
    backgroundColor: '#334155',
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  quizStatBadgeLight: {
    backgroundColor: '#E2E8F0',
    color: '#1E293B',
  },
  quizGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 360,
    gap: 12,
  },
  quizOptionCard: {
    width: '47%',
    height: 120,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    padding: 8,
  },
  quizOptionCardLight: {
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  quizCardEmoji: {
    fontSize: 48,
    marginBottom: 4,
  },
  quizCardLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  quizCardLabelLight: {
    color: '#0F172A',
  },

  /* TOAST */
  toastBadge: {
    position: 'absolute',
    top: 90,
    alignSelf: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    zIndex: 99,
    borderWidth: 1.5,
    borderColor: '#38BDF8',
  },
  toastBadgeLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderColor: '#3B82F6',
  },
  toastText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },

  /* MODAL CHỌN CHỦ ĐỀ */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  topicModalCard: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '80%',
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 16,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  topicModalCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  modalHeaderLight: {
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    color: '#FBBF24',
    fontSize: 17,
    fontWeight: '900',
  },
  modalTitleLight: {
    color: '#0F172A',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseBtnLight: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalCloseText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalCloseTextLight: {
    color: '#475569',
  },
  topicGridList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 12,
    gap: 8,
  },
  topicGridCard: {
    width: '48%',
    backgroundColor: '#0F172A',
    borderRadius: 16,
    borderWidth: 2,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicGridCardLight: {
    backgroundColor: '#F8FAFC',
  },
  topicGridIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  topicGridTitle: {
    color: '#F1F5F9',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  topicGridTitleLight: {
    color: '#1E293B',
  },
  topicGridTitleActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  topicGridCount: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 2,
  },
  topicGridCountLight: {
    color: '#64748B',
  },
  topicGridCountActive: {
    color: '#E0E7FF',
    fontWeight: '700',
  },

  /* VICTORY MODAL */
  victoryCard: {
    backgroundColor: '#1E1B4B',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
    borderWidth: 3,
    borderColor: '#F59E0B',
  },
  victoryCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F59E0B',
  },
  victoryTrophy: {
    fontSize: 54,
    marginBottom: 8,
  },
  victoryTitle: {
    color: '#FBBF24',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 6,
  },
  victoryTitleLight: {
    color: '#0F172A',
  },
  victorySubtitle: {
    color: '#E2E8F0',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  victorySubtitleLight: {
    color: '#475569',
  },
  victoryScoreBox: {
    backgroundColor: '#312E81',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  victoryScoreBoxLight: {
    backgroundColor: '#FEF3C7',
  },
  victoryFinalScore: {
    color: '#FBBF24',
    fontSize: 18,
    fontWeight: '900',
  },
  victoryBtn: {
    backgroundColor: '#EC4899',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 18,
    alignItems: 'center',
    width: '100%',
  },
  victoryBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '900',
  },
});

export default FlashcardGameScreen;
