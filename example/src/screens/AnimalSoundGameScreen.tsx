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
  Image,
} from 'react-native';
import { ThemeConfig } from '../services/themes';
import {
  animalSoundService,
  KidsAnimal,
  KidsColor,
  KidsHabitat,
  LanguageMode,
  QuizType,
} from '../services/animalSoundService';
import { SoundPlayer, soundManager } from '../components/SoundPlayer';

interface AnimalSoundGameScreenProps {
  theme?: ThemeConfig;
  onClose: () => void;
}

export const AnimalSoundGameScreen: React.FC<AnimalSoundGameScreenProps> = ({ onClose }) => {
  const { width } = useWindowDimensions();

  // Dữ liệu từ Service
  const [animals, setAnimals] = useState<KidsAnimal[]>([]);
  const [colors, setColors] = useState<KidsColor[]>([]);
  const [habitats, setHabitats] = useState<KidsHabitat[]>([]);

  // Chế độ & Ngôn ngữ
  const [languageMode, setLanguageModeState] = useState<LanguageMode>('bilingual');
  const [gameMode, setGameMode] = useState<'quiz' | 'explorer'>('quiz');
  const [quizType, setQuizType] = useState<QuizType>('sound');
  const [selectedHabitatFilter, setSelectedHabitatFilter] = useState<string>('all');

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentAnimal, setCurrentAnimal] = useState<KidsAnimal | null>(null);
  const [options, setOptions] = useState<any[]>([]);
  const [score, setScore] = useState<number>(0);
  const totalQuestions = 8;
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isAnswering, setIsAnswering] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);

  // Tracking cho logs
  const [correctList, setCorrectList] = useState<string[]>([]);
  const [wrongList, setWrongList] = useState<Array<{ target: string; chosen: string }>>([]);
  const startTimeRef = useRef<number>(Date.now());

  // Explorer State & Detail Modal
  const [playingExplorerId, setPlayingExplorerId] = useState<string | null>(null);
  const [detailAnimal, setDetailAnimal] = useState<KidsAnimal | null>(null);

  // Animations
  const soundWaveScale = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const victoryScale = useRef(new Animated.Value(0.3)).current;

  // Hiệu ứng sóng âm thanh & phát audio
  const triggerSoundAnimation = useCallback((soundUrl?: string, textFallback?: string) => {
    Animated.sequence([
      Animated.timing(soundWaveScale, { toValue: 1.25, duration: 150, useNativeDriver: true }),
      Animated.timing(soundWaveScale, { toValue: 0.95, duration: 150, useNativeDriver: true }),
      Animated.timing(soundWaveScale, { toValue: 1.15, duration: 150, useNativeDriver: true }),
      Animated.timing(soundWaveScale, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();

    animalSoundService.playSound(soundUrl, textFallback);
  }, [soundWaveScale]);

  // Khởi tạo và nạp dữ liệu (Local Cache + Sync Cloud Supabase)
  useEffect(() => {
    const savedLang = animalSoundService.getLanguageMode();
    setLanguageModeState(savedLang);

    const initialAnimals = animalSoundService.getAnimals();
    const initialColors = animalSoundService.getColors();
    const initialHabitats = animalSoundService.getHabitats();

    setAnimals(initialAnimals);
    setColors(initialColors);
    setHabitats(initialHabitats);

    // Tải trước (Preload) toàn bộ âm thanh vào RAM để bấm là phát tức thì 0s
    const urlsToPreload: string[] = [];
    initialAnimals.forEach((a) => {
      if (a.sound_mp3_url) urlsToPreload.push(a.sound_mp3_url);
      if (a.voice_en_url) urlsToPreload.push(a.voice_en_url);
      if (a.voice_vi_url) urlsToPreload.push(a.voice_vi_url);
    });
    soundManager.preload(urlsToPreload);

    // Đồng bộ từ Supabase chạy ngầm
    animalSoundService
      .syncWithCloud()
      .then(() => {
        const syncedAnimals = animalSoundService.getAnimals();
        setAnimals(syncedAnimals);
        setColors(animalSoundService.getColors());
        setHabitats(animalSoundService.getHabitats());
        
        const freshUrls: string[] = [];
        syncedAnimals.forEach((a) => {
          if (a.sound_mp3_url) freshUrls.push(a.sound_mp3_url);
        });
        soundManager.preload(freshUrls);
      })
      .catch(() => {});
  }, []);

  // Thay đổi ngôn ngữ
  const handleLanguageChange = (mode: LanguageMode) => {
    setLanguageModeState(mode);
    animalSoundService.setLanguageMode(mode);
  };

  // 1. Sinh câu hỏi mới tùy theo quizType
  const generateQuestion = useCallback(
    (index: number, animalList: KidsAnimal[], colorList: KidsColor[], habitatList: KidsHabitat[]) => {
      if (!animalList || animalList.length === 0) return;

      const target = animalList[index % animalList.length];
      setCurrentAnimal(target);
      setSelectedOptionId(null);
      setIsCorrect(null);
      setIsAnswering(false);

      if (quizType === 'sound') {
        // Đố tiếng kêu: Chọn con vật
        const distractors = animalList
          .filter((a) => a.id !== target.id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        const allChoices = [target, ...distractors].sort(() => Math.random() - 0.5);
        setOptions(allChoices);
      } else if (quizType === 'color') {
        // Đố màu sắc: Chọn màu sắc của con vật
        const targetColor = colorList.find((c) => c.id === target.primary_color_id) || colorList[0];
        const distractorColors = colorList
          .filter((c) => c.id !== targetColor.id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        const allColors = [targetColor, ...distractorColors].sort(() => Math.random() - 0.5);
        setOptions(allColors);
      } else if (quizType === 'habitat') {
        // Đố nơi sống: Chọn môi trường của con vật
        const targetHab = habitatList.find((h) => h.id === target.habitat_id) || habitatList[0];
        const distractorHabs = habitatList
          .filter((h) => h.id !== targetHab.id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        const allHabs = [targetHab, ...distractorHabs].sort(() => Math.random() - 0.5);
        setOptions(allHabs);
      }

      setTimeout(() => {
        triggerSoundAnimation(target.sound_mp3_url);
      }, 300);
    },
    [quizType, triggerSoundAnimation]
  );

  // Khởi động lượt chơi mới
  const startNewQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsVictory(false);
    setCorrectList([]);
    setWrongList([]);
    startTimeRef.current = Date.now();
    if (animals.length > 0) {
      generateQuestion(0, animals, colors, habitats);
    }
  }, [animals, colors, habitats, generateQuestion]);

  useEffect(() => {
    if (gameMode === 'quiz' && animals.length > 0) {
      startNewQuiz();
    }
  }, [gameMode, quizType, animals, startNewQuiz]);

  // 2. Xử lý khi bé chọn đáp án
  const handleSelectOption = (choice: any) => {
    if (isAnswering || !currentAnimal) return;
    setIsAnswering(true);
    setSelectedOptionId(choice.id);

    let isMatch = false;
    if (quizType === 'sound') {
      isMatch = choice.id === currentAnimal.id;
    } else if (quizType === 'color') {
      isMatch = choice.id === currentAnimal.primary_color_id;
    } else if (quizType === 'habitat') {
      isMatch = choice.id === currentAnimal.habitat_id;
    }

    if (isMatch) {
      // ĐÚNG 🎉
      setIsCorrect(true);
      setScore((s) => s + 100);
      setCorrectList((prev) => [...prev, currentAnimal.id]);

      // Phát giọng đọc bản xứ nếu có
      if (languageMode === 'en' && currentAnimal.voice_en_url) {
        animalSoundService.playSound(currentAnimal.voice_en_url);
      } else if (languageMode === 'vi' && currentAnimal.voice_vi_url) {
        animalSoundService.playSound(currentAnimal.voice_vi_url);
      } else {
        animalSoundService.playSound(currentAnimal.sound_mp3_url);
      }

      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: 1.2, duration: 200, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();

      setTimeout(() => {
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex >= totalQuestions) {
          handleVictory();
        } else {
          setCurrentQuestionIndex(nextIndex);
          generateQuestion(nextIndex, animals, colors, habitats);
        }
      }, 1500);
    } else {
      // SAI -> Rung nhẹ và cho thử lại
      setIsCorrect(false);
      setWrongList((prev) => [...prev, { target: currentAnimal.id, chosen: choice.id }]);

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

  // 3. Xử lý chiến thắng & Lưu tiến độ
  const handleVictory = () => {
    setIsVictory(true);
    victoryScale.setValue(0.3);
    Animated.spring(victoryScale, {
      toValue: 1,
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    }).start();

    // Lưu Log
    const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
    animalSoundService.saveLearningLog({
      language_mode: languageMode,
      quiz_type: quizType,
      game_mode: 'quiz',
      score: score + 100,
      total_questions: totalQuestions,
      correct_animals: correctList,
      wrong_animals: wrongList,
      duration_seconds: duration,
    });
  };

  // 4. Explorer Mode: Khám phá từng con vật
  const handleExploreAnimal = (animal: KidsAnimal) => {
    setPlayingExplorerId(animal.id);
    triggerSoundAnimation(animal.sound_mp3_url, animal.sound_text_vi);
    setTimeout(() => {
      setPlayingExplorerId(null);
    }, 1500);
  };

  // Lọc con vật trong Explorer theo môi trường
  const filteredAnimals = animals.filter((a) => {
    if (selectedHabitatFilter === 'all') return true;
    return a.habitat_id === selectedHabitatFilter;
  });

  const cardWidth = Math.min((width - 56) / 2, 160);

  // Helper hiển thị tên động vật theo ngôn ngữ
  const renderAnimalName = (animal: KidsAnimal) => {
    if (languageMode === 'vi') return animal.name_vi;
    if (languageMode === 'en') return animal.name_en;
    return `${animal.name_vi} (${animal.name_en})`;
  };

  // Helper hiển thị tiếng kêu theo ngôn ngữ
  const renderSoundText = (animal: KidsAnimal) => {
    if (languageMode === 'vi') return animal.sound_text_vi;
    if (languageMode === 'en') return animal.sound_text_en;
    return `${animal.sound_text_vi} / ${animal.sound_text_en}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#B45309" />
      <SoundPlayer />

      {/* 1. HEADER CHÍNH & BỘ CHỌN NGÔN NGỮ */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.backBtn} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.backBtnText}>✕ Đóng</Text>
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>🐾 Thám Hiểm Động Vật Song Ngữ</Text>
            <Text style={styles.headerSub}>Bilingual Animal Sound & Colors</Text>
          </View>

          <TouchableOpacity style={styles.restartBtn} onPress={startNewQuiz} activeOpacity={0.7}>
            <Text style={styles.restartBtnText}>🔄 Làm Lại</Text>
          </TouchableOpacity>
        </View>

        {/* BỘ CHỌN 3 CHẾ ĐỘ NGÔN NGỮ */}
        <View style={styles.languageBar}>
          <TouchableOpacity
            style={[styles.langBtn, languageMode === 'vi' && styles.langBtnActive]}
            onPress={() => handleLanguageChange('vi')}
          >
            <Text style={[styles.langBtnText, languageMode === 'vi' && styles.langBtnTextActive]}>
              🇻🇳 Tiếng Việt
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.langBtn, languageMode === 'en' && styles.langBtnActive]}
            onPress={() => handleLanguageChange('en')}
          >
            <Text style={[styles.langBtnText, languageMode === 'en' && styles.langBtnTextActive]}>
              🇬🇧 English
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.langBtn, languageMode === 'bilingual' && styles.langBtnActive]}
            onPress={() => handleLanguageChange('bilingual')}
          >
            <Text style={[styles.langBtnText, languageMode === 'bilingual' && styles.langBtnTextActive]}>
              🌐 Song Ngữ
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 2. CHUYỂN ĐỔI TAB (ĐỐ VUI VS BÁCH KHOA TOÀN THƯ) */}
        <View style={styles.modeTabBar}>
          <TouchableOpacity
            style={[styles.modeTab, gameMode === 'quiz' && styles.modeTabActive]}
            onPress={() => setGameMode('quiz')}
            activeOpacity={0.8}
          >
            <Text style={[styles.modeTabText, gameMode === 'quiz' && styles.modeTabTextActive]}>
              🎯 Đố Vui ({currentQuestionIndex + 1}/{totalQuestions})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeTab, gameMode === 'explorer' && styles.modeTabActive]}
            onPress={() => setGameMode('explorer')}
            activeOpacity={0.8}
          >
            <Text style={[styles.modeTabText, gameMode === 'explorer' && styles.modeTabTextActive]}>
              📖 Bách Khoa Khám Phá
            </Text>
          </TouchableOpacity>
        </View>

        {/* 3. NỘI DUNG CHẾ ĐỘ ĐỐ VUI (QUIZ) */}
        {gameMode === 'quiz' && currentAnimal && (
          <View style={styles.quizContainer}>
            {/* THANH CHỌN DẠNG ĐỐ VUI (SOUND / COLOR / HABITAT) */}
            <View style={styles.quizTypeBar}>
              <TouchableOpacity
                style={[styles.quizTypePill, quizType === 'sound' && styles.quizTypePillActive]}
                onPress={() => setQuizType('sound')}
              >
                <Text
                  style={[
                    styles.quizTypePillText,
                    quizType === 'sound' && styles.quizTypePillTextActive,
                  ]}
                >
                  🔊 Tiếng Kêu
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.quizTypePill, quizType === 'color' && styles.quizTypePillActive]}
                onPress={() => setQuizType('color')}
              >
                <Text
                  style={[
                    styles.quizTypePillText,
                    quizType === 'color' && styles.quizTypePillTextActive,
                  ]}
                >
                  🎨 Màu Sắc
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.quizTypePill, quizType === 'habitat' && styles.quizTypePillActive]}
                onPress={() => setQuizType('habitat')}
              >
                <Text
                  style={[
                    styles.quizTypePillText,
                    quizType === 'habitat' && styles.quizTypePillTextActive,
                  ]}
                >
                  🏡 Nơi Sống
                </Text>
              </TouchableOpacity>
            </View>

            {/* HỘP CÂU HỎI */}
            <View style={styles.soundCard}>
              {quizType === 'sound' && (
                <Text style={styles.soundCardPrompt}>
                  {languageMode === 'vi' && '🔊 Con gì kêu thế này nhỉ?'}
                  {languageMode === 'en' && '🔊 Which animal makes this sound?'}
                  {languageMode === 'bilingual' && '🔊 Con gì kêu thế này? (Which animal?)'}
                </Text>
              )}

              {quizType === 'color' && (
                <Text style={styles.soundCardPrompt}>
                  {languageMode === 'vi' && `🎨 Bạn ${currentAnimal.name_vi} ${currentAnimal.emoji} có màu gì?`}
                  {languageMode === 'en' && `🎨 What color is ${currentAnimal.name_en} ${currentAnimal.emoji}?`}
                  {languageMode === 'bilingual' && `🎨 ${currentAnimal.name_vi} (${currentAnimal.name_en}) màu gì?`}
                </Text>
              )}

              {quizType === 'habitat' && (
                <Text style={styles.soundCardPrompt}>
                  {languageMode === 'vi' && `🏡 Bạn ${currentAnimal.name_vi} ${currentAnimal.emoji} sống ở đâu?`}
                  {languageMode === 'en' && `🏡 Where does ${currentAnimal.name_en} ${currentAnimal.emoji} live?`}
                  {languageMode === 'bilingual' && `🏡 ${currentAnimal.name_vi} sống ở đâu? (Habitat)`}
                </Text>
              )}

              {/* NÚT LOA / ICON TRỌNG TÂM */}
              <Animated.View
                style={[
                  styles.soundSpeakerCircle,
                  { transform: [{ scale: soundWaveScale }] },
                ]}
              >
                <TouchableOpacity
                  style={styles.speakerTouchable}
                  onPress={() => triggerSoundAnimation(currentAnimal.sound_mp3_url, currentAnimal.sound_text_vi)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.speakerIcon}>
                    {quizType === 'sound' ? '📢' : currentAnimal.emoji}
                  </Text>
                  <Text style={styles.tapToHearText}>
                    {quizType === 'sound' ? 'Chạm nghe lại' : 'Nhấn để nghe'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              {/* BÓNG THOẠI LỜI KÊU & PHIÊN ÂM */}
              <View style={styles.speechBubble}>
                <Text style={styles.speechSoundText}>"{renderSoundText(currentAnimal)}"</Text>
                {languageMode !== 'vi' && currentAnimal.phonetic_en && (
                  <Text style={styles.phoneticText}>IPA: {currentAnimal.phonetic_en}</Text>
                )}
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

            {/* THÔNG BÁO PHẢN HỒI ĐÚNG / SAI */}
            {isCorrect === true && (
              <Animated.View
                style={[
                  styles.feedbackBanner,
                  styles.correctBanner,
                  { transform: [{ scale: bounceAnim }] },
                ]}
              >
                <Text style={styles.feedbackEmoji}>🎉</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.feedbackText}>
                    {languageMode === 'vi' && `CHÍNH XÁC! Bé giỏi quá!`}
                    {languageMode === 'en' && `EXCELLENT! You got it right!`}
                    {languageMode === 'bilingual' && `ĐÚNG RỒI! ${renderAnimalName(currentAnimal)} 🎉`}
                  </Text>
                  <Text style={styles.funFactFeedbackText}>
                    💡 {languageMode === 'en' ? currentAnimal.fun_fact_en : currentAnimal.fun_fact_vi}
                  </Text>
                </View>
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
                <Text style={styles.feedbackText}>
                  {languageMode === 'en'
                    ? 'Not quite! Listen carefully and try again!'
                    : 'Chưa đúng rồi, bé lắng nghe và thử lại nhé!'}
                </Text>
              </Animated.View>
            )}

            {/* LƯỚI ĐÁP ÁN CHO BÉ LỰA CHỌN */}
            <View style={styles.optionsGrid}>
              {options.map((opt: any) => {
                const isSelected = selectedOptionId === opt.id;
                const isThisCorrect = isSelected && isCorrect === true;
                const isThisWrong = isSelected && isCorrect === false;

                // 1. Dạng Đố Con Vật
                if (quizType === 'sound') {
                  const animalOpt = opt as KidsAnimal;
                  return (
                    <TouchableOpacity
                      key={animalOpt.id}
                      style={[
                        styles.choiceCard,
                        { width: cardWidth, backgroundColor: animalOpt.color_hex || '#FEF3C7' },
                        isThisCorrect && styles.choiceCardCorrect,
                        isThisWrong && styles.choiceCardWrong,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => handleSelectOption(animalOpt)}
                      disabled={isAnswering && isCorrect === true}
                    >
                      <Text style={styles.choiceEmoji}>{animalOpt.emoji}</Text>
                      <Text style={styles.choiceName} numberOfLines={2}>
                        {renderAnimalName(animalOpt)}
                      </Text>
                      {isThisCorrect && (
                        <View style={styles.badgeCheck}>
                          <Text style={styles.badgeCheckText}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                }

                // 2. Dạng Đố Màu Sắc
                if (quizType === 'color') {
                  const colorOpt = opt as KidsColor;
                  return (
                    <TouchableOpacity
                      key={colorOpt.id}
                      style={[
                        styles.choiceCard,
                        { width: cardWidth, backgroundColor: colorOpt.hex_code },
                        isThisCorrect && styles.choiceCardCorrect,
                        isThisWrong && styles.choiceCardWrong,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => handleSelectOption(colorOpt)}
                      disabled={isAnswering && isCorrect === true}
                    >
                      <View
                        style={[
                          styles.colorCircleInside,
                          { backgroundColor: colorOpt.hex_code },
                        ]}
                      >
                        <Text style={styles.colorPaletteEmoji}>🎨</Text>
                      </View>
                      <Text
                        style={[
                          styles.choiceName,
                          { color: colorOpt.text_color || '#FFFFFF', fontWeight: '900' },
                        ]}
                        numberOfLines={2}
                      >
                        {languageMode === 'vi' && colorOpt.name_vi}
                        {languageMode === 'en' && colorOpt.name_en}
                        {languageMode === 'bilingual' && `${colorOpt.name_vi} (${colorOpt.name_en})`}
                      </Text>
                      {isThisCorrect && (
                        <View style={styles.badgeCheck}>
                          <Text style={styles.badgeCheckText}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                }

                // 3. Dạng Đố Nơi Sống
                if (quizType === 'habitat') {
                  const habOpt = opt as KidsHabitat;
                  return (
                    <TouchableOpacity
                      key={habOpt.id}
                      style={[
                        styles.choiceCard,
                        { width: cardWidth, backgroundColor: '#E0F2FE' },
                        isThisCorrect && styles.choiceCardCorrect,
                        isThisWrong && styles.choiceCardWrong,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => handleSelectOption(habOpt)}
                      disabled={isAnswering && isCorrect === true}
                    >
                      <Text style={styles.choiceEmoji}>{habOpt.emoji}</Text>
                      <Text style={styles.choiceName} numberOfLines={2}>
                        {languageMode === 'vi' && habOpt.name_vi}
                        {languageMode === 'en' && habOpt.name_en}
                        {languageMode === 'bilingual' && `${habOpt.name_vi} (${habOpt.name_en})`}
                      </Text>
                      {isThisCorrect && (
                        <View style={styles.badgeCheck}>
                          <Text style={styles.badgeCheckText}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                }

                return null;
              })}
            </View>
          </View>
        )}

        {/* 4. NỘI DUNG CHẾ ĐỘ KHÁM PHÁ (EXPLORER) */}
        {gameMode === 'explorer' && (
          <View style={styles.explorerContainer}>
            <View style={styles.explorerGuideCard}>
              <Text style={styles.explorerGuideTitle}>🌱 Bách Khoa Toàn Thư Động Vật & Màu Sắc</Text>
              <Text style={styles.explorerGuideSub}>
                Chạm vào bất kỳ con vật nào để lắng nghe tiếng kêu, học phát âm IPA và mở hộp tri thức nhé!
              </Text>
            </View>

            {/* BỘ LỌC THEO MÔI TRƯỜNG */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScroll}
            >
              <TouchableOpacity
                style={[
                  styles.filterPill,
                  selectedHabitatFilter === 'all' && styles.filterPillActive,
                ]}
                onPress={() => setSelectedHabitatFilter('all')}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    selectedHabitatFilter === 'all' && styles.filterPillTextActive,
                  ]}
                >
                  🌈 Tất Cả ({animals.length})
                </Text>
              </TouchableOpacity>
              {habitats.map((h) => (
                <TouchableOpacity
                  key={h.id}
                  style={[
                    styles.filterPill,
                    selectedHabitatFilter === h.id && styles.filterPillActive,
                  ]}
                  onPress={() => setSelectedHabitatFilter(h.id)}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      selectedHabitatFilter === h.id && styles.filterPillTextActive,
                    ]}
                  >
                    {h.emoji} {languageMode === 'en' ? h.name_en : h.name_vi}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* LƯỚI KHÁM PHÁ CON VẬT */}
            <View style={styles.explorerGrid}>
              {filteredAnimals.map((item) => {
                const isPlaying = playingExplorerId === item.id;
                const itemColor = colors.find((c) => c.id === item.primary_color_id);

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.explorerCard,
                      { width: cardWidth, backgroundColor: item.color_hex || '#FFFBEB' },
                      isPlaying && styles.explorerCardPlaying,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => {
                      handleExploreAnimal(item);
                      setDetailAnimal(item);
                    }}
                  >
                    <Text style={styles.explorerEmoji}>{item.emoji}</Text>
                    <Text style={styles.explorerName} numberOfLines={1}>
                      {languageMode === 'en' ? item.name_en : item.name_vi}
                    </Text>

                    {languageMode !== 'vi' && item.phonetic_en && (
                      <Text style={styles.explorerPhonetic}>{item.phonetic_en}</Text>
                    )}

                    <View style={styles.explorerSoundPill}>
                      <Text style={styles.explorerSoundPillText} numberOfLines={1}>
                        🔊 {languageMode === 'en' ? item.sound_text_en : item.sound_text_vi}
                      </Text>
                    </View>

                    {itemColor && (
                      <View style={styles.colorTagRow}>
                        <View
                          style={[styles.colorMiniDot, { backgroundColor: itemColor.hex_code }]}
                        />
                        <Text style={styles.colorTagText}>
                          {languageMode === 'en' ? itemColor.name_en : itemColor.name_vi}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* 5. MODAL CHI TIẾT FLASHCARD ĐỘNG VẬT & MÀU SẮC */}
      <Modal visible={detailAnimal !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          {detailAnimal && (
            <View style={styles.detailCard}>
              <TouchableOpacity
                style={styles.detailCloseBtn}
                onPress={() => setDetailAnimal(null)}
              >
                <Text style={styles.detailCloseBtnText}>✕</Text>
              </TouchableOpacity>

              <Text style={styles.detailEmoji}>{detailAnimal.emoji}</Text>
              <Text style={styles.detailTitleVi}>{detailAnimal.name_vi}</Text>
              <Text style={styles.detailTitleEn}>
                {detailAnimal.name_en} <Text style={styles.detailIpa}>{detailAnimal.phonetic_en}</Text>
              </Text>

              <View style={styles.detailInfoBox}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>🔊 Tiếng kêu:</Text>
                  <Text style={styles.detailValue}>
                    {detailAnimal.sound_text_vi} / {detailAnimal.sound_text_en}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>🎨 Màu chủ đạo:</Text>
                  <View style={styles.colorBadgeWithDot}>
                    <View
                      style={[
                        styles.colorMiniDot,
                        {
                          backgroundColor:
                            colors.find((c) => c.id === detailAnimal.primary_color_id)?.hex_code ||
                            '#F59E0B',
                        },
                      ]}
                    />
                    <Text style={styles.detailValue}>
                      {colors.find((c) => c.id === detailAnimal.primary_color_id)?.name_vi} (
                      {colors.find((c) => c.id === detailAnimal.primary_color_id)?.name_en})
                    </Text>
                  </View>
                </View>

                {detailAnimal.favorite_food_vi && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>🥕 Thức ăn:</Text>
                    <Text style={styles.detailValue}>{detailAnimal.favorite_food_vi}</Text>
                  </View>
                )}

                <View style={styles.funFactBox}>
                  <Text style={styles.funFactTitle}>💡 Sự Thật Thú Vị:</Text>
                  <Text style={styles.funFactText}>{detailAnimal.fun_fact_vi}</Text>
                  <Text style={styles.funFactTextEn}>"{detailAnimal.fun_fact_en}"</Text>
                </View>
              </View>

              {/* NÚT PHÁT ÂM THANH THEO TỪNG LOẠI */}
              <View style={styles.audioActionRow}>
                <TouchableOpacity
                  style={styles.audioActionBtn}
                  onPress={() => animalSoundService.playSound(detailAnimal.sound_mp3_url)}
                >
                  <Text style={styles.audioActionText}>🔊 Tiếng Kêu</Text>
                </TouchableOpacity>

                {detailAnimal.voice_en_url && (
                  <TouchableOpacity
                    style={[styles.audioActionBtn, { backgroundColor: '#3B82F6' }]}
                    onPress={() => animalSoundService.playSound(detailAnimal.voice_en_url)}
                  >
                    <Text style={styles.audioActionText}>🇬🇧 Giọng Anh</Text>
                  </TouchableOpacity>
                )}

                {detailAnimal.voice_vi_url && (
                  <TouchableOpacity
                    style={[styles.audioActionBtn, { backgroundColor: '#10B981' }]}
                    onPress={() => animalSoundService.playSound(detailAnimal.voice_vi_url)}
                  >
                    <Text style={styles.audioActionText}>🇻🇳 Giọng Việt</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>
      </Modal>

      {/* 6. MODAL CHÚC MỪNG CHIẾN THẮNG */}
      <Modal visible={isVictory} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalCard, { transform: [{ scale: victoryScale }] }]}>
            <Text style={styles.trophyEmoji}>🏆</Text>
            <Text style={styles.modalTitle}>BÉ LÀ THIÊN TÀI SONG NGỮ! 🌟</Text>
            <Text style={styles.modalSub}>
              {languageMode === 'en'
                ? 'Awesome job! You answered all the questions correctly!'
                : 'Bé đã xuất sắc hoàn thành trọn vẹn thử thách khám phá con vật!'}
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
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: '#B45309',
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  headerSub: {
    fontSize: 11,
    color: '#FDE68A',
    marginTop: 1,
    fontWeight: '600',
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
  restartBtn: {
    backgroundColor: '#16A34A',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  restartBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  /* LANGUAGE BAR */
  languageBar: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    borderRadius: 14,
    padding: 3,
    gap: 4,
  },
  langBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 10,
  },
  langBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  langBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FEF3C7',
  },
  langBtnTextActive: {
    color: '#B45309',
    fontWeight: '900',
  },

  content: {
    padding: 16,
    alignItems: 'center',
    paddingBottom: 70,
  },

  /* MODE TAB BAR */
  modeTabBar: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 4,
    marginBottom: 12,
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
  quizTypeBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    width: '100%',
    justifyContent: 'center',
  },
  quizTypePill: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
  },
  quizTypePillActive: {
    backgroundColor: '#D97706',
    borderColor: '#B45309',
  },
  quizTypePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  quizTypePillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  soundCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  soundCardPrompt: {
    fontSize: 14,
    fontWeight: '800',
    color: '#78350F',
    marginBottom: 12,
    textAlign: 'center',
  },
  soundSpeakerCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#FEF3C7',
    borderWidth: 4,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
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
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  speechSoundText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#92400E',
    textAlign: 'center',
  },
  phoneticText: {
    fontSize: 12,
    color: '#B45309',
    marginTop: 2,
    fontWeight: '600',
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
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 12,
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
    fontSize: 22,
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
  },
  funFactFeedbackText: {
    fontSize: 11,
    color: '#15803D',
    marginTop: 2,
    fontWeight: '600',
  },

  /* CHOICES GRID */
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  choiceCard: {
    height: 120,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    padding: 6,
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
  choiceEmoji: {
    fontSize: 40,
    marginBottom: 4,
  },
  colorCircleInside: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  colorPaletteEmoji: {
    fontSize: 20,
  },
  choiceName: {
    fontSize: 12,
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
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  explorerGuideTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#78350F',
    marginBottom: 2,
  },
  explorerGuideSub: {
    fontSize: 11,
    color: '#92400E',
    textAlign: 'center',
  },
  filterScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 6,
    marginBottom: 10,
  },
  filterPill: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: '#D97706',
    borderColor: '#B45309',
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  explorerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  explorerCard: {
    height: 140,
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
    fontSize: 38,
    marginBottom: 2,
  },
  explorerName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1F2937',
  },
  explorerPhonetic: {
    fontSize: 10,
    color: '#B45309',
    fontWeight: '600',
    marginBottom: 2,
  },
  explorerSoundPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
    marginTop: 2,
  },
  explorerSoundPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#92400E',
  },
  colorTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  colorMiniDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  colorTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },

  /* DETAIL FLASHCARD MODAL */
  detailCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  detailCloseBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: '#F1F5F9',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailCloseBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#64748B',
  },
  detailEmoji: {
    fontSize: 64,
    marginBottom: 6,
  },
  detailTitleVi: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  detailTitleEn: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D97706',
    marginBottom: 12,
  },
  detailIpa: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  detailInfoBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    gap: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },
  colorBadgeWithDot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  funFactBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 10,
    marginTop: 4,
  },
  funFactTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
    marginBottom: 2,
  },
  funFactText: {
    fontSize: 11,
    color: '#78350F',
    lineHeight: 16,
    fontWeight: '600',
  },
  funFactTextEn: {
    fontSize: 10,
    color: '#92400E',
    fontStyle: 'italic',
    marginTop: 2,
  },
  audioActionRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  audioActionBtn: {
    flex: 1,
    backgroundColor: '#D97706',
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
  },
  audioActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
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
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  modalSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
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
    padding: 12,
    gap: 6,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalStatItem: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  modalActions: {
    width: '100%',
    gap: 10,
  },
  actionPrimaryBtn: {
    backgroundColor: '#D97706',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },
  actionPrimaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  actionSecondaryBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 11,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },
  actionSecondaryText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
  },
});
