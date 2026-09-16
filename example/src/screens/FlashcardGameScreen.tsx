import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Image,
} from 'react-native';
import {
  VocabCard,
  VocabCategory,
  getCardRarity,
} from '../data/oxfordKidsVocabulary';
import { vocabularyService } from '../services/vocabularyService';
import { flashcardService } from '../services/flashcardService';
import { soundManager, SoundPlayer } from '../components/SoundPlayer';
import { ThemeToggle, ThemeMode } from '../components/ThemeToggle';
import { storage, STORAGE_KEYS } from '../services/storage';

import { ParallaxCard3D } from '../components/ParallaxCard3D';
import { VocabCard3DStage } from '../components/VocabCard3DStage';
import { vocabImageService } from '../services/vocabImageService';
import { BoosterPackModal } from '../components/BoosterPackModal';
import { CardAlbumModal } from '../components/CardAlbumModal';
import { FlashcardMascot, MascotMood } from '../components/FlashcardMascot';

export type LanguageMode = 'vi' | 'en' | 'bilingual';
export type FlashcardActivity = 'explore' | 'quiz' | 'memory' | 'speed';

export const FlashcardGameScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const isSmallScreen = height < 720;
  const cardHeight = isLandscape
    ? Math.min(280, height - 120)
    : Math.min(380, Math.max(250, height - (isSmallScreen ? 230 : 270)));

  // --- THEME SÁNG / TỐI ---
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
  };

  // --- NGÔN NGỮ & CHẾ ĐỘ CHƠI ---
  const [langMode, setLangMode] = useState<LanguageMode>('bilingual');
  const [currentActivity, setCurrentActivity] = useState<FlashcardActivity>('explore');
  const [mascotMood, setMascotMood] = useState<MascotMood>('idle');
  const [toastMsg, setToastMsg] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2000);
  };

  // --- DANH MỤC & THẺ BÀI ---
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
      funFact: 'Chưa có từ vựng nào.',
    };

  // --- MODAL TRẠNG THÁI: ALBUM, BOOSTER PACK, CHỦ ĐỀ ---
  const [isAlbumVisible, setIsAlbumVisible] = useState<boolean>(false);
  const [isPackModalVisible, setIsPackModalVisible] = useState<boolean>(false);
  const [packTypeToOpen, setPackTypeToOpen] = useState<'common' | 'gold'>('gold');
  const [packInventory, setPackInventory] = useState(() => flashcardService.getPackInventory());
  const [isTopicModalVisible, setIsTopicModalVisible] = useState<boolean>(false);

  // Lắng nghe cập nhật kho túi thẻ và album
  useEffect(() => {
    const unsub = flashcardService.subscribe(() => {
      setPackInventory(flashcardService.getPackInventory());
    });
    return () => unsub();
  }, []);

  // --- SRS DANH MỤC ÔN TẬP ---
  const srsReviewCards = flashcardService.getReviewCards(allCategories);
  const srsCategory: VocabCategory | null = srsReviewCards.length > 0 ? {
    id: 'srs_review',
    titleEn: 'Smart SRS Review',
    titleVi: '💡 Từ Cần Ôn Luyện',
    icon: '🧠',
    color: '#EC4899',
    cards: srsReviewCards,
  } : null;

  // --- CHUYỂN THẺ EXPLORE ---
  const speakCurrentWord = useCallback((card: VocabCard) => {
    if (langMode === 'vi') {
      soundManager.speak(card.vietnamese, 'vi');
    } else {
      soundManager.speak(card.english, 'en');
    }
  }, [langMode]);

  const handleNextCard = () => {
    const nextIdx = (cardIndex + 1) % selectedCategory.cards.length;
    setCardIndex(nextIdx);
    const nextCard = selectedCategory.cards[nextIdx];
    speakCurrentWord(nextCard);
    setMascotMood('idle');
  };

  const handlePrevCard = () => {
    const prevIdx =
      (cardIndex - 1 + selectedCategory.cards.length) % selectedCategory.cards.length;
    setCardIndex(prevIdx);
    const prevCard = selectedCategory.cards[prevIdx];
    speakCurrentWord(prevCard);
    setMascotMood('idle');
  };

  const speakBilingualFull = (card: VocabCard) => {
    soundManager.speak(card.english, 'en');
    setTimeout(() => {
      soundManager.speak(`Nghĩa là: ${card.vietnamese}`, 'vi');
    }, 1100);
  };

  // =========================================================================
  // 1. QUIZ THÁM TỬ ĐOÁN TRANH (MODE 2)
  // =========================================================================
  const [quizTarget, setQuizTarget] = useState<VocabCard | null>(null);
  const [quizOptions, setQuizOptions] = useState<VocabCard[]>([]);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizStreak, setQuizStreak] = useState<number>(0);
  const [isVictoryVisible, setIsVictoryVisible] = useState<boolean>(false);
  const victoryScale = useRef(new Animated.Value(0.3)).current;

  const setupQuizQuestion = useCallback(() => {
    const allCards = selectedCategory.cards.length > 0
      ? selectedCategory.cards
      : (allCategories[0]?.cards || []);
    if (!allCards || allCards.length === 0) return;

    const target = allCards[Math.floor(Math.random() * allCards.length)];
    setQuizTarget(target);

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
    setMascotMood('thinking');
  }, [selectedCategory, allCategories, langMode]);

  const handleQuizAnswer = (card: VocabCard) => {
    if (!quizTarget) return;

    if (card.id === quizTarget.id) {
      // Đúng
      const newScore = quizScore + 10;
      const newStreak = quizStreak + 1;
      setQuizScore(newScore);
      setQuizStreak(newStreak);
      setMascotMood('correct');

      flashcardService.recordAttempt(card.id, true);
      soundManager.speak('Chính xác! Hoan hô bé', 'vi');
      showToast('🎉 Bé trả lời chính xác! +10 Điểm');

      if (newStreak >= 5) {
        setIsVictoryVisible(true);
        setMascotMood('celebrate');
        // Thưởng 1 túi thẻ vàng khi đạt streak 5
        flashcardService.addPacks('gold', 1);
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
      // Sai
      flashcardService.recordAttempt(quizTarget.id, false);
      soundManager.speak('Chưa đúng rồi, bé thử lại nhé', 'vi');
      setQuizStreak(0);
      setMascotMood('wrong');
      showToast('💡 Chưa đúng rồi, bé thử lại nhé!');
    }
  };

  // =========================================================================
  // 2. GHÉP CẶP TRÍ NHỚ 3D (MODE 3: MEMORY MATCH)
  // =========================================================================
  interface MemoryCardItem {
    uid: string;
    card: VocabCard;
    isRevealed: boolean;
    isMatched: boolean;
  }
  const [memoryCards, setMemoryCards] = useState<MemoryCardItem[]>([]);
  const [selectedMemoryUids, setSelectedMemoryUids] = useState<string[]>([]);
  const [memoryMatchedCount, setMemoryMatchedCount] = useState<number>(0);

  const setupMemoryGame = useCallback(() => {
    const pool = selectedCategory.cards.length >= 3
      ? selectedCategory.cards
      : (allCategories[0]?.cards || []);
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);

    const doubled: MemoryCardItem[] = [];
    shuffled.forEach((c, idx) => {
      doubled.push({ uid: `${c.id}_1_${idx}`, card: c, isRevealed: false, isMatched: false });
      doubled.push({ uid: `${c.id}_2_${idx}`, card: c, isRevealed: false, isMatched: false });
    });
    doubled.sort(() => Math.random() - 0.5);

    setMemoryCards(doubled);
    setSelectedMemoryUids([]);
    setMemoryMatchedCount(0);
    setMascotMood('idle');
    soundManager.speak('Lật 2 thẻ giống nhau để ghép cặp nhé bé!', 'vi');
  }, [selectedCategory, allCategories]);

  const handlePressMemoryCard = (item: MemoryCardItem) => {
    if (item.isMatched || item.isRevealed || selectedMemoryUids.length >= 2) return;

    soundManager.speak(item.card.english, 'en');

    // Mở thẻ này
    const nextList = memoryCards.map((c) =>
      c.uid === item.uid ? { ...c, isRevealed: true } : c
    );
    setMemoryCards(nextList);

    const nextSelected = [...selectedMemoryUids, item.uid];
    setSelectedMemoryUids(nextSelected);

    if (nextSelected.length === 2) {
      const first = nextList.find((c) => c.uid === nextSelected[0]);
      const second = nextList.find((c) => c.uid === nextSelected[1]);

      if (first && second && first.card.id === second.card.id) {
        // Khớp cặp!
        setMascotMood('correct');
        soundManager.speak('Ghép cặp chính xác! Tuyệt quá!', 'vi');
        const matchedList = nextList.map((c) =>
          c.card.id === first.card.id ? { ...c, isMatched: true } : c
        );
        setMemoryCards(matchedList);
        setSelectedMemoryUids([]);
        const nextMatched = memoryMatchedCount + 1;
        setMemoryMatchedCount(nextMatched);

        if (nextMatched >= 3) {
          // Hoàn thành cả bàn! Thưởng 1 túi thẻ
          flashcardService.addPacks('common', 1);
          setMascotMood('celebrate');
          showToast('🎁 Bé được thưởng 1 Gói Thẻ Bí Ẩn!');
        }
      } else {
        // Sai cặp
        setMascotMood('wrong');
        setTimeout(() => {
          setMemoryCards((curr) =>
            curr.map((c) =>
              c.isMatched ? c : { ...c, isRevealed: false }
            )
          );
          setSelectedMemoryUids([]);
        }, 900);
      }
    }
  };

  // =========================================================================
  // 3. THỬ THÁCH NHANH TAY 60 GIÂY (MODE 4: SPEED RUSH)
  // =========================================================================
  const [speedTimeLeft, setSpeedTimeLeft] = useState<number>(60);
  const [isSpeedActive, setIsSpeedActive] = useState<boolean>(false);
  const [speedScore, setSpeedScore] = useState<number>(0);
  const [speedCombo, setSpeedCombo] = useState<number>(1);
  const [speedTarget, setSpeedTarget] = useState<VocabCard | null>(null);
  const [speedOptions, setSpeedOptions] = useState<VocabCard[]>([]);
  const speedTimerRef = useRef<any>(null);

  const startSpeedRush = () => {
    setIsSpeedActive(true);
    setSpeedTimeLeft(60);
    setSpeedScore(0);
    setSpeedCombo(1);
    setMascotMood('correct');
    soundManager.speak('Thử thách 60 giây bắt đầu! Nhanh tay nào bé ơi!', 'vi');
    setupSpeedQuestion();
  };

  const setupSpeedQuestion = () => {
    const allCards = selectedCategory.cards.length >= 4
      ? selectedCategory.cards
      : (allCategories[0]?.cards || []);
    const target = allCards[Math.floor(Math.random() * allCards.length)];
    setSpeedTarget(target);

    const opts: VocabCard[] = [target];
    const pool = allCards.filter((c) => c.id !== target.id).sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(3, pool.length); i++) {
      opts.push(pool[i]);
    }
    opts.sort(() => Math.random() - 0.5);
    setSpeedOptions(opts);
  };

  const handleSpeedAnswer = (card: VocabCard) => {
    if (!isSpeedActive || !speedTarget) return;

    if (card.id === speedTarget.id) {
      const added = 10 * speedCombo;
      setSpeedScore((s) => s + added);
      setSpeedCombo((c) => Math.min(5, c + 1));
      flashcardService.recordAttempt(card.id, true);
      soundManager.speak(card.english, 'en');
      setupSpeedQuestion();
    } else {
      setSpeedCombo(1);
      flashcardService.recordAttempt(speedTarget.id, false);
      soundManager.speak('Thử lại nào', 'vi');
    }
  };

  useEffect(() => {
    if (isSpeedActive) {
      speedTimerRef.current = setInterval(() => {
        setSpeedTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(speedTimerRef.current);
            setIsSpeedActive(false);
            flashcardService.saveSpeedRushHighScore(speedScore);
            soundManager.speak(`Hết giờ rồi! Bé đạt ${speedScore} điểm!`, 'vi');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(speedTimerRef.current);
  }, [isSpeedActive, speedScore]);

  // Đổi Activity
  const handleChangeActivity = (act: FlashcardActivity) => {
    setCurrentActivity(act);
    setMascotMood('idle');
    if (act === 'explore') {
      speakCurrentWord(currentCard);
    } else if (act === 'quiz') {
      setupQuizQuestion();
    } else if (act === 'memory') {
      setupMemoryGame();
    } else if (act === 'speed') {
      setIsSpeedActive(false);
      setSpeedTimeLeft(60);
    }
  };

  // Mở gói thẻ
  const handleOpenPack = (type: 'common' | 'gold') => {
    setPackTypeToOpen(type);
    setIsPackModalVisible(true);
  };

  const totalUnopenedPacks = packInventory.commonPacks + packInventory.goldPacks;

  return (
    <SafeAreaView style={[styles.container, isLight && styles.containerLight]}>
      <StatusBar
        barStyle={isLight ? 'dark-content' : 'light-content'}
        backgroundColor={isLight ? '#FFFFFF' : '#0F172A'}
      />
      <SoundPlayer />

      {/* HEADER: Tiêu đề, Album, Túi thẻ, Chủ đề, Theme, Thoát */}
      <View style={[styles.header, isLight && styles.headerLight]}>
        <TouchableOpacity
          style={[styles.closeBtn, isLight && styles.closeBtnLight]}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <Text style={[styles.closeText, isLight && styles.closeTextLight]}>✕</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerCenter}
          onPress={() => setIsTopicModalVisible(true)}
          activeOpacity={0.85}
        >
          <Text style={[styles.headerTitle, isLight && styles.headerTitleLight]} numberOfLines={1}>
            🎴 Thẻ Ma Thuật 3D
          </Text>
          <Text style={[styles.headerSubtitle, isLight && styles.headerSubtitleLight]} numberOfLines={1}>
            {selectedCategory.icon} {selectedCategory.titleVi} ({cardIndex + 1}/{selectedCategory.cards.length}) ▾
          </Text>
        </TouchableOpacity>

        <View style={styles.headerRightActions}>
          {/* Nút Sổ Tay Album */}
          <TouchableOpacity
            style={[styles.headerActionBtn, styles.albumBtn, isLight && styles.albumBtnLight]}
            onPress={() => setIsAlbumVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.headerBtnIcon}>📖</Text>
            {!isSmallScreen && <Text style={styles.headerBtnText}>Album</Text>}
          </TouchableOpacity>

          {/* Nút Mở Túi Thẻ (Kèm Badge số lượng) */}
          <TouchableOpacity
            style={[styles.headerActionBtn, styles.packBtn, isLight && styles.packBtnLight]}
            onPress={() => handleOpenPack(packInventory.goldPacks > 0 ? 'gold' : 'common')}
            activeOpacity={0.8}
          >
            <Text style={styles.headerBtnIcon}>🎁</Text>
            {!isSmallScreen && <Text style={styles.headerBtnText}>Túi</Text>}
            {totalUnopenedPacks > 0 && (
              <View style={styles.packBadge}>
                <Text style={styles.packBadgeText}>{totalUnopenedPacks}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Nút Chủ Đề */}
          <TouchableOpacity
            style={[styles.headerActionBtn, styles.topicMenuBtn, isLight && styles.topicMenuBtnLight]}
            onPress={() => setIsTopicModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.headerBtnIcon}>📚</Text>
            {!isSmallScreen && <Text style={styles.headerBtnText}>Chủ Đề</Text>}
          </TouchableOpacity>

          <ThemeToggle theme={theme} onToggle={handleToggleTheme} compact={true} />
        </View>
      </View>

      {/* THANH CHỌN 3 NGÔN NGỮ (COMPACT PILL STYLE) */}
      <View style={[styles.langSelectorRow, isLight && styles.langSelectorRowLight, isSmallScreen && styles.langSelectorRowCompact]}>
        {[
          { id: 'bilingual', label: '🌐 Song Ngữ' },
          { id: 'en', label: '🇬🇧 English' },
          { id: 'vi', label: '🇻🇳 Tiếng Việt' },
        ].map((item) => {
          const isSelected = langMode === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.langPill,
                isLight && styles.langPillLight,
                isSelected && (isLight ? styles.langPillActiveLight : styles.langPillActive),
              ]}
              onPress={() => {
                setLangMode(item.id as LanguageMode);
                showToast(`Chế độ: ${item.label}`);
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.langPillText,
                  isLight && styles.langPillTextLight,
                  isSelected && styles.langPillTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* THANH CHUYỂN 4 TABS HOẠT ĐỘNG */}
      <View style={[styles.tabContainer, isLight && styles.tabContainerLight, isSmallScreen && styles.tabContainerCompact]}>
        {[
          { id: 'explore', label: '🎴 Thẻ 3D' },
          { id: 'quiz', label: '🔍 Thám Tử' },
          { id: 'memory', label: '🃏 Trí Nhớ' },
          { id: 'speed', label: '⚡ Siêu Tốc' },
        ].map((tab) => {
          const isActive = currentActivity === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabButton,
                isLight && styles.tabButtonLight,
                isActive && styles.tabButtonActive,
              ]}
              onPress={() => handleChangeActivity(tab.id as FlashcardActivity)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  isLight && styles.tabTextLight,
                  isActive && styles.tabTextActive,
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* TOAST THÔNG BÁO */}
      {toastMsg !== '' && (
        <View style={[styles.toastBadge, isLight && styles.toastBadgeLight]}>
          <Text style={styles.toastText}>{toastMsg}</Text>
        </View>
      )}

      {/* ========================================================================= */}
      {/* 1. CHẾ ĐỘ: KHÁM PHÁ THẺ 3D PARALLAX TILT */}
      {/* ========================================================================= */}
      {currentActivity === 'explore' && (
        <ScrollView
          style={styles.activityScroll}
          contentContainerStyle={styles.exploreScrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <ParallaxCard3D
            card={currentCard}
            isLight={isLight}
            langMode={langMode}
            cardHeight={cardHeight}
          />

          {/* CỤM NÚT ĐIỀU KHIỂN & ÂM THANH */}
          <View style={[styles.actionControlsRow, isSmallScreen && styles.actionControlsRowCompact]}>
            <TouchableOpacity
              style={[styles.navBtn, isLight && styles.navBtnLight]}
              onPress={handlePrevCard}
              activeOpacity={0.8}
            >
              <Text style={[styles.navBtnText, isLight && styles.navBtnTextLight]}>◀ Trước</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.speakBtn, { backgroundColor: currentCard.color }]}
              onPress={() => soundManager.speak(currentCard.english, 'en')}
              activeOpacity={0.8}
            >
              <Text style={styles.speakBtnIcon}>🔊</Text>
              <Text style={styles.speakBtnText}>{isSmallScreen ? 'Phát âm' : '🇬🇧 Tiếng Anh'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bilingualBtn}
              onPress={() => speakBilingualFull(currentCard)}
              activeOpacity={0.8}
            >
              <Text style={styles.bilingualBtnText}>{isSmallScreen ? 'Song ngữ' : '🌐 Song Ngữ'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navBtn, isLight && styles.navBtnLight]}
              onPress={handleNextCard}
              activeOpacity={0.8}
            >
              <Text style={[styles.navBtnText, isLight && styles.navBtnTextLight]}>Tiếp ▶</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* ========================================================================= */}
      {/* 2. CHẾ ĐỘ: THÁM TỬ ĐOÁN TRANH (QUIZ) */}
      {/* ========================================================================= */}
      {currentActivity === 'quiz' && quizTarget && (
        <ScrollView
          style={styles.activityScroll}
          contentContainerStyle={styles.quizScrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={[styles.quizHeaderBox, isLight && styles.quizHeaderBoxLight, isSmallScreen && styles.quizHeaderBoxCompact]}>
            <Text style={[styles.quizQuestionPrompt, isLight && styles.quizQuestionPromptLight]}>
              {langMode === 'vi' ? '🎯 Bé hãy chạm vào thẻ của từ:' : '🎯 Listen and pick the card:'}
            </Text>
            <TouchableOpacity
              style={[styles.quizTargetBadge, isLight && styles.quizTargetBadgeLight, isSmallScreen && styles.quizTargetBadgeCompact]}
              onPress={() => {
                if (langMode === 'vi') soundManager.speak(quizTarget.vietnamese, 'vi');
                else soundManager.speak(quizTarget.english, 'en');
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.quizTargetText, isSmallScreen && styles.quizTargetTextCompact]}>
                🔊 {langMode === 'vi' ? quizTarget.vietnamese : quizTarget.english}
              </Text>
            </TouchableOpacity>

            <View style={styles.quizScoreRow}>
              <Text style={[styles.quizStatBadge, isLight && styles.quizStatBadgeLight]}>
                ⭐ Điểm: {quizScore}
              </Text>
              <Text style={[styles.quizStatBadge, isLight && styles.quizStatBadgeLight]}>
                🔥 Chuỗi đúng: {quizStreak}/5
              </Text>
            </View>
          </View>

          {/* LƯỚI 4 THẺ ĐÁP ÁN */}
          <View style={styles.quizGridContainer}>
            {quizOptions.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.quizOptionCard,
                  isSmallScreen && styles.quizOptionCardCompact,
                  isLight && styles.quizOptionCardLight,
                  { borderColor: opt.color },
                ]}
                onPress={() => handleQuizAnswer(opt)}
                activeOpacity={0.8}
              >
                <VocabCard3DStage
                  card={opt}
                  isLight={isLight}
                  size={isSmallScreen ? "small" : "quiz"}
                  interactive={false}
                />
                <Text
                  style={[styles.quizCardLabel, isLight && styles.quizCardLabelLight]}
                  numberOfLines={1}
                >
                  {langMode === 'vi' ? opt.vietnamese : opt.english}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* ========================================================================= */}
      {/* 3. CHẾ ĐỘ: GHÉP CẶP TRÍ NHỚ 3D (MEMORY MATCH) */}
      {/* ========================================================================= */}
      {currentActivity === 'memory' && (
        <ScrollView
          style={styles.activityScroll}
          contentContainerStyle={styles.memoryScrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={[styles.memoryHeaderBox, isSmallScreen && styles.memoryHeaderBoxCompact]}>
            <Text style={[styles.memoryTitle, isLight && styles.memoryTitleLight]}>
              🃏 Ghép Đôi 3 Cặp Thẻ Từ Vựng
            </Text>
            <Text style={styles.memorySubtitle}>
              Khớp: {memoryMatchedCount}/3 cặp {memoryMatchedCount === 3 ? '🎉 Hoàn thành!' : ''}
            </Text>
          </View>

          <View style={styles.memoryGrid}>
            {memoryCards.map((item) => (
              <TouchableOpacity
                key={item.uid}
                style={[
                  styles.memorySlot,
                  isSmallScreen && styles.memorySlotCompact,
                  item.isMatched && styles.memorySlotMatched,
                  item.isRevealed && styles.memorySlotRevealed,
                ]}
                onPress={() => handlePressMemoryCard(item)}
                activeOpacity={0.85}
              >
                {item.isRevealed || item.isMatched ? (
                  <View style={styles.memoryInnerFront}>
                    <VocabCard3DStage
                      card={item.card}
                      isLight={isLight}
                      size="small"
                      interactive={false}
                    />
                    <Text style={styles.memoryWord} numberOfLines={1}>
                      {item.card.english}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.memoryInnerBack}>
                    <Text style={styles.memoryShield}>🛡️</Text>
                    <Text style={styles.memoryQuestion}>❓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={[styles.resetMemoryBtn, isSmallScreen && styles.resetMemoryBtnCompact]} onPress={setupMemoryGame} activeOpacity={0.85}>
            <Text style={styles.resetMemoryBtnText}>🔄 Bàn Chơi Mới</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ========================================================================= */}
      {/* 4. CHẾ ĐỘ: THỬ THÁCH NHANH TAY 60 GIÂY (SPEED RUSH) */}
      {/* ========================================================================= */}
      {currentActivity === 'speed' && (
        <ScrollView
          style={styles.activityScroll}
          contentContainerStyle={styles.speedScrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {!isSpeedActive ? (
            <View style={[styles.speedStartBox, isSmallScreen && styles.speedStartBoxCompact]}>
              <Text style={styles.speedStartEmoji}>⚡ 🔥 🎴</Text>
              <Text style={[styles.speedStartTitle, isLight && styles.speedStartTitleLight]}>
                THỬ THÁCH NHANH TAY 60 GIÂY
              </Text>
              <Text style={[styles.speedStartDesc, isLight && styles.speedStartDescLight]}>
                Chọn đúng thật nhanh để tăng Combo x2, x3, x5 và ghi điểm kỷ lục!
              </Text>

              <View style={styles.highScoreBox}>
                <Text style={styles.highScoreText}>
                  🏆 Kỷ lục: {flashcardService.getSpeedRushHighScore()} Điểm
                </Text>
              </View>

              <TouchableOpacity style={styles.speedStartBtn} onPress={startSpeedRush} activeOpacity={0.85}>
                <Text style={styles.speedStartBtnText}>🚀 BẮT ĐẦU NGAY!</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.speedPlayingBox}>
              <View style={styles.speedStatusBar}>
                <View style={styles.speedTimerBadge}>
                  <Text style={styles.speedTimerText}>⏱️ {speedTimeLeft}s</Text>
                </View>
                <View style={[styles.speedComboBadge, speedCombo >= 3 && styles.speedComboHot]}>
                  <Text style={styles.speedComboText}>🔥 Combo x{speedCombo}</Text>
                </View>
                <View style={styles.speedScoreBadge}>
                  <Text style={styles.speedScoreText}>⭐ {speedScore}</Text>
                </View>
              </View>

              {speedTarget && (
                <View style={styles.speedPromptBox}>
                  <Text style={styles.speedPromptLabel}>Chọn thẻ của từ:</Text>
                  <Text style={styles.speedPromptTarget}>{speedTarget.english}</Text>
                </View>
              )}

              <View style={styles.speedOptionsGrid}>
                {speedOptions.map((opt) => (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.speedOptionBtn,
                      isSmallScreen && styles.speedOptionBtnCompact,
                      { borderColor: opt.color },
                    ]}
                    onPress={() => handleSpeedAnswer(opt)}
                    activeOpacity={0.75}
                  >
                    <VocabCard3DStage
                      card={opt}
                      isLight={isLight}
                      size="small"
                      interactive={false}
                    />
                    <Text style={styles.speedOptionText} numberOfLines={1}>{opt.vietnamese}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      )}

      {/* FOOTER: MASCOT BÉ TOM & BÉ MIMI */}
      <View style={[styles.footerMascotBar, isSmallScreen && styles.footerMascotBarCompact]}>
        <FlashcardMascot mood={mascotMood} isLight={isLight} />
      </View>

      {/* MODAL: SỔ TAY SƯU TẬP THẺ BÀI (POKÉDEX ALBUM) */}
      <CardAlbumModal
        visible={isAlbumVisible}
        allCategories={allCategories}
        onClose={() => setIsAlbumVisible(false)}
        onSelectCardToExplore={(selectedCard) => {
          const foundCat = allCategories.find((c) => c.id === selectedCard.category);
          if (foundCat) {
            setSelectedCategory(foundCat);
            const idx = foundCat.cards.findIndex((c) => c.id === selectedCard.id);
            setCardIndex(idx >= 0 ? idx : 0);
            setCurrentActivity('explore');
          }
        }}
      />

      {/* MODAL: MỞ GÓI THẺ BÍ ẨN (BOOSTER PACK) */}
      <BoosterPackModal
        visible={isPackModalVisible}
        packType={packTypeToOpen}
        allCards={allCategories.flatMap((c) => c.cards)}
        onClose={() => {
          setIsPackModalVisible(false);
          setPackInventory(flashcardService.getPackInventory());
        }}
        onCardsCollected={() => {
          showToast('🎉 Đã thêm các thẻ bài vào Sổ Tay!');
        }}
      />

      {/* MODAL: CHỌN CHỦ ĐỀ (TOPIC GRID MODAL CÓ HỖ TRỢ SRS) */}
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
                📚 Chọn Chủ Đề Từ Vựng
              </Text>
              <TouchableOpacity
                style={[styles.modalCloseBtn, isLight && styles.modalCloseBtnLight]}
                onPress={() => setIsTopicModalVisible(false)}
              >
                <Text style={[styles.modalCloseText, isLight && styles.modalCloseTextLight]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.topicGridList}>
              {/* DANH MỤC ĐẶC BIỆT: TỪ CẦN ÔN LUYỆN (SRS) NẾU CÓ */}
              {srsCategory && (
                <TouchableOpacity
                  style={[styles.topicGridCard, styles.srsCategoryCard]}
                  onPress={() => {
                    setSelectedCategory(srsCategory);
                    setCardIndex(0);
                    setIsTopicModalVisible(false);
                    setCurrentActivity('explore');
                    showToast('🧠 Đã chọn danh mục ôn tập từ khó!');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.topicGridIcon}>💡</Text>
                  <Text style={styles.srsCategoryTitle} numberOfLines={1}>
                    Từ Cần Ôn Luyện
                  </Text>
                  <Text style={styles.srsCategoryCount}>
                    {srsCategory.cards.length} từ cần nhớ
                  </Text>
                </TouchableOpacity>
              )}

              {allCategories.map((cat) => {
                const isSelected = selectedCategory.id === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.topicGridCard,
                      isLight && styles.topicGridCardLight,
                      { borderColor: cat.color },
                      isSelected && { backgroundColor: cat.color, borderColor: '#FFFFFF' },
                    ]}
                    onPress={() => {
                      setSelectedCategory(cat);
                      setCardIndex(0);
                      setIsTopicModalVisible(false);
                      setCurrentActivity('explore');
                      showToast(`📚 Đã chọn: ${cat.titleVi}`);
                    }}
                    activeOpacity={0.8}
                  >
                    {vocabImageService.getCategory3DIcon(cat.icon) ? (
                      <View style={styles.topicGridIconContainer}>
                        <Image
                          source={{ uri: vocabImageService.getCategory3DIcon(cat.icon)! }}
                          style={{ width: 34, height: 34 }}
                          resizeMode="contain"
                        />
                      </View>
                    ) : (
                      <Text style={styles.topicGridIcon}>{cat.icon}</Text>
                    )}
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

      {/* MODAL: CHIẾN THẮNG QUIZ */}
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
              Chúc mừng bé trả lời đúng 5 câu liên tiếp! Bé được tặng 1 Gói Thẻ Vàng Hoàng Gia 🎁
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
  headerActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  headerBtnIcon: {
    fontSize: 14,
  },
  headerBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  albumBtn: {
    backgroundColor: '#7C3AED',
  },
  albumBtnLight: {
    backgroundColor: '#6D28D9',
  },
  packBtn: {
    backgroundColor: '#D97706',
    position: 'relative',
  },
  packBtnLight: {
    backgroundColor: '#B45309',
  },
  packBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  packBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
  },
  topicMenuBtn: {
    backgroundColor: '#3B82F6',
  },
  topicMenuBtnLight: {
    backgroundColor: '#2563EB',
  },
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
  langSelectorRowCompact: {
    paddingVertical: 4,
    gap: 6,
  },
  langPill: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  langPillLight: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
  },
  langPillActive: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  langPillActiveLight: {
    backgroundColor: '#3B82F6',
    borderColor: '#93C5FD',
  },
  langPillText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '800',
  },
  langPillTextLight: {
    color: '#475569',
  },
  langPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#0F172A',
    gap: 6,
  },
  tabContainerLight: {
    backgroundColor: '#F1F5F9',
  },
  tabContainerCompact: {
    paddingVertical: 4,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 7,
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
    fontSize: 11,
    fontWeight: '800',
  },
  tabTextLight: {
    color: '#475569',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  activityScroll: {
    flex: 1,
    width: '100%',
  },
  exploreScrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 380,
    marginTop: 10,
    gap: 6,
  },
  actionControlsRowCompact: {
    marginTop: 6,
    gap: 4,
  },
  navBtn: {
    backgroundColor: '#334155',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  navBtnLight: {
    backgroundColor: '#E2E8F0',
  },
  navBtnText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '800',
  },
  navBtnTextLight: {
    color: '#1E293B',
  },
  speakBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 4,
  },
  speakBtnIcon: {
    fontSize: 14,
  },
  speakBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  bilingualBtn: {
    backgroundColor: '#059669',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  bilingualBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  quizScrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 12,
  },
  quizHeaderBox: {
    alignItems: 'center',
    width: '100%',
  },
  quizHeaderBoxCompact: {
    paddingVertical: 4,
  },
  quizHeaderBoxLight: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 16,
  },
  quizQuestionPrompt: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  },
  quizQuestionPromptLight: {
    color: '#475569',
  },
  quizTargetBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#F59E0B',
    marginTop: 4,
  },
  quizTargetBadgeCompact: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  quizTargetBadgeLight: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  quizTargetText: {
    color: '#FBBF24',
    fontSize: 20,
    fontWeight: '900',
  },
  quizTargetTextCompact: {
    fontSize: 17,
  },
  quizScoreRow: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 8,
  },
  quizStatBadge: {
    backgroundColor: '#334155',
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
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
    gap: 10,
  },
  quizOptionCard: {
    width: '48%',
    height: 115,
    backgroundColor: '#1E293B',
    borderRadius: 18,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  quizOptionCardCompact: {
    height: 98,
    borderRadius: 14,
    padding: 4,
  },
  quizOptionCardLight: {
    backgroundColor: '#FFFFFF',
  },
  quizCardEmoji: {
    fontSize: 44,
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
  memoryScrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 12,
  },
  memoryHeaderBox: {
    alignItems: 'center',
  },
  memoryHeaderBoxCompact: {
    marginBottom: 2,
  },
  memoryTitle: {
    color: '#FBBF24',
    fontSize: 16,
    fontWeight: '900',
  },
  memoryTitleLight: {
    color: '#0F172A',
  },
  memorySubtitle: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
  memoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 340,
    gap: 10,
  },
  memorySlot: {
    width: '30%',
    height: 115,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#475569',
    backgroundColor: '#1E293B',
    overflow: 'hidden',
  },
  memorySlotCompact: {
    height: 95,
    borderRadius: 12,
  },
  memorySlotRevealed: {
    borderColor: '#38BDF8',
  },
  memorySlotMatched: {
    borderColor: '#10B981',
    opacity: 0.85,
  },
  memoryInnerFront: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    padding: 4,
  },
  memoryEmoji: {
    fontSize: 40,
  },
  memoryWord: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
    marginTop: 2,
  },
  memoryInnerBack: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
  },
  memoryShield: {
    fontSize: 22,
  },
  memoryQuestion: {
    fontSize: 24,
    marginTop: 2,
  },
  resetMemoryBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
  },
  resetMemoryBtnCompact: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resetMemoryBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '900',
  },
  speedScrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  speedStartBox: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1E293B',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#F59E0B',
    maxWidth: 360,
  },
  speedStartBoxCompact: {
    padding: 14,
    borderRadius: 18,
  },
  speedStartEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  speedStartTitle: {
    color: '#FBBF24',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  speedStartTitleLight: {
    color: '#0F172A',
  },
  speedStartDesc: {
    color: '#CBD5E1',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 16,
  },
  speedStartDescLight: {
    color: '#475569',
  },
  highScoreBox: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    marginVertical: 12,
  },
  highScoreText: {
    color: '#FBBF24',
    fontSize: 13,
    fontWeight: '800',
  },
  speedStartBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 16,
  },
  speedStartBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
  },
  speedPlayingBox: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  speedStatusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  speedTimerBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  speedTimerText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '900',
  },
  speedComboBadge: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  speedComboHot: {
    backgroundColor: '#EA580C',
  },
  speedComboText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '900',
  },
  speedScoreBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  speedScoreText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '900',
  },
  speedPromptBox: {
    alignItems: 'center',
    marginVertical: 8,
  },
  speedPromptLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  speedPromptTarget: {
    color: '#FBBF24',
    fontSize: 26,
    fontWeight: '900',
    marginTop: 2,
  },
  speedOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
    marginTop: 10,
  },
  speedOptionBtn: {
    width: '48%',
    height: 90,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedOptionBtnCompact: {
    height: 76,
    borderRadius: 12,
  },
  speedOptionEmoji: {
    fontSize: 36,
  },
  speedOptionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
  footerMascotBar: {
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  footerMascotBarCompact: {
    paddingBottom: 2,
    paddingHorizontal: 8,
  },
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
    fontSize: 16,
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
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicGridCardLight: {
    backgroundColor: '#F8FAFC',
  },
  topicGridIconContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  topicGridIcon: {
    fontSize: 28,
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
  srsCategoryCard: {
    borderColor: '#EC4899',
    backgroundColor: 'rgba(236, 72, 153, 0.15)',
    width: '100%',
    marginBottom: 8,
  },
  srsCategoryTitle: {
    color: '#F472B6',
    fontSize: 13,
    fontWeight: '900',
  },
  srsCategoryCount: {
    color: '#FBCFE8',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
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
