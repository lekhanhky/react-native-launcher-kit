import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import {
  WorldId,
  RiddleItem,
  RiddleOption3D,
  RIDDLE_WORLDS_CONFIG,
  getRiddlesByWorld,
  createSyntheticVocabCard,
} from '../data/riddles100Data';
import { riddleService, RiddleGameProgress } from '../services/riddleService';
import { Riddle3DStageGrid } from '../components/riddles/Riddle3DStageGrid';
import { RiddleLetterScramble } from '../components/riddles/RiddleLetterScramble';
import { RiddleWorldMapModal } from '../components/riddles/RiddleWorldMapModal';
import { RiddleTreasureModal } from '../components/riddles/RiddleTreasureModal';
import { VocabCard3DStage } from '../components/VocabCard3DStage';

const { width } = Dimensions.get('window');

interface RiddlesGameScreenProps {
  onClose: () => void;
}

export const RiddlesGameScreen: React.FC<RiddlesGameScreenProps> = ({ onClose }) => {
  const [isLight, setIsLight] = useState(false);
  const [progress, setProgress] = useState<RiddleGameProgress>(() => riddleService.getProgress());

  const [currentWorldId, setCurrentWorldId] = useState<WorldId>(progress.lastPlayedWorldId || 'animals');
  const [currentIndexInWorld, setCurrentIndexInWorld] = useState<number>(progress.lastPlayedIndex || 1);
  const [gameMode, setGameMode] = useState<'preschool' | 'detective'>(progress.preferredMode || 'preschool');

  // Trạng thái chơi câu đố hiện tại
  const [eliminatedOptionIds, setEliminatedOptionIds] = useState<string[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [hintLetterTrigger, setHintLetterTrigger] = useState<number>(0);
  const [isHintShown, setIsHintShown] = useState<boolean>(false);
  const [hintsUsedCount, setHintsUsedCount] = useState<number>(0);

  // Modals
  const [showWorldMap, setShowWorldMap] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showTreasureModal, setShowTreasureModal] = useState<boolean>(false);
  const [mascotMessage, setMascotMessage] = useState<string>('Bé hãy lắng nghe câu thơ đố và tìm câu trả lời nhé!');

  // Animation đọc thơ
  const [isReadingPoem, setIsReadingPoem] = useState<boolean>(false);
  const poemScaleAnim = useRef(new Animated.Value(1)).current;

  const currentWorldConfig = RIDDLE_WORLDS_CONFIG[currentWorldId];
  const worldRiddles = getRiddlesByWorld(currentWorldId);
  const currentRiddle: RiddleItem =
    worldRiddles.find((r) => r.indexInWorld === currentIndexInWorld) || worldRiddles[0];

  // Khi chuyển câu đố, reset trạng thái
  useEffect(() => {
    setEliminatedOptionIds([]);
    setSelectedOptionId(null);
    setIsAnswerChecked(false);
    setIsHintShown(false);
    setHintsUsedCount(0);
    setHintLetterTrigger(0);
    setMascotMessage(
      gameMode === 'preschool'
        ? 'Bé ơi, hãy nhìn 4 bục 3D và chọn đáp án đúng nhé!'
        : 'Thám tử nhí ơi, hãy xếp các viên kẹo chữ cái nhé!'
    );
    riddleService.setLastPlayed(currentWorldId, currentIndexInWorld);
  }, [currentWorldId, currentIndexInWorld, gameMode]);

  // Đổi chế độ chơi
  const handleToggleMode = (mode: 'preschool' | 'detective') => {
    setGameMode(mode);
    riddleService.setPreferredMode(mode);
  };

  // Hiệu ứng đọc thơ
  const handleReadPoem = () => {
    setIsReadingPoem(true);
    Animated.sequence([
      Animated.timing(poemScaleAnim, {
        toValue: 1.03,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(poemScaleAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    setMascotMessage(`"${currentRiddle.poem.join(' / ')}"`);
    setTimeout(() => {
      setIsReadingPoem(false);
    }, 2500);
  };

  // 1. Xử lý chọn đáp án ở chế độ Mầm Non
  const handleSelect3DOption = (option: RiddleOption3D) => {
    if (isAnswerChecked) return;

    setSelectedOptionId(option.id);
    setIsAnswerChecked(true);

    if (option.isCorrect) {
      handleSuccess();
    } else {
      setMascotMessage('Chưa đúng rồi bé ơi! Bé thử suy nghĩ lại hoặc bấm gợi ý nhé! 💡');
      setTimeout(() => {
        setIsAnswerChecked(false);
        setSelectedOptionId(null);
      }, 1200);
    }
  };

  // 2. Xử lý kiểm tra đáp án ở chế độ Thám Tử
  const handleCheckScrambleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      handleSuccess();
    } else {
      setMascotMessage('Chữ cái chưa đúng thứ tự rồi bé ơi! Bé thử xếp lại nhé!');
    }
  };

  // Xử lý khi giải đúng câu đố
  const handleSuccess = () => {
    // Tính số sao: 3 sao nếu không dùng gợi ý, 2 sao nếu dùng 1 lần, 1 sao nếu dùng nhiều lần
    const starsEarned = hintsUsedCount === 0 ? 3 : hintsUsedCount === 1 ? 2 : 1;
    const { progress: updated, chestUnlockedJustNow } = riddleService.markRiddleSolved(
      currentRiddle.id,
      currentWorldId,
      starsEarned
    );
    setProgress(updated);
    setMascotMessage('🎉 XUẤT SẮC QUÁ BÉ ƠI! Bé đã giải đúng rồi!');
    setShowSuccessModal(true);

    if (chestUnlockedJustNow) {
      setTimeout(() => {
        setShowSuccessModal(false);
        setShowTreasureModal(true);
      }, 2000);
    }
  };

  // Xử lý bấm Gợi Ý
  const handleUseHint = () => {
    if (isHintShown && hintsUsedCount > 1) return;

    setIsHintShown(true);
    setHintsUsedCount((prev) => prev + 1);

    if (gameMode === 'preschool') {
      // Loại bỏ 2 đáp án sai
      const wrongOptions = currentRiddle.options3D.filter((o) => !o.isCorrect);
      const toEliminate = wrongOptions.slice(0, 2).map((o) => o.id);
      setEliminatedOptionIds(toEliminate);
      setMascotMessage(`Gợi ý: ${currentRiddle.hintPoem}`);
    } else {
      // Thám tử: điền 1 chữ cái
      setHintLetterTrigger((prev) => prev + 1);
      setMascotMessage(`Gợi ý: ${currentRiddle.hintPoem}`);
    }
  };

  // Chuyển sang câu đố tiếp theo
  const handleNextRiddle = () => {
    setShowSuccessModal(false);
    if (currentIndexInWorld < 20) {
      setCurrentIndexInWorld((prev) => prev + 1);
    } else {
      // Hết 20 câu của world này, chuyển sang world tiếp theo
      const worldKeys: WorldId[] = ['animals', 'fruits', 'household', 'vehicles', 'nature'];
      const currentIdx = worldKeys.indexOf(currentWorldId);
      const nextWorld = worldKeys[(currentIdx + 1) % worldKeys.length];
      setCurrentWorldId(nextWorld);
      setCurrentIndexInWorld(1);
    }
  };

  // Chuyển câu trước đó
  const handlePrevRiddle = () => {
    if (currentIndexInWorld > 1) {
      setCurrentIndexInWorld((prev) => prev - 1);
    }
  };

  // Lựa chọn câu đố từ Modal Bản Đồ
  const handleSelectFromMap = (worldId: WorldId, indexInWorld: number) => {
    setCurrentWorldId(worldId);
    setCurrentIndexInWorld(indexInWorld);
  };

  const isCurrentSolved = progress.solvedRiddleIds.includes(currentRiddle.id);
  const correctOption = currentRiddle.options3D.find((o) => o.isCorrect) || currentRiddle.options3D[0];

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: isLight ? '#F8FAFC' : '#0B132B' },
      ]}
    >
      <StatusBar
        barStyle={isLight ? 'dark-content' : 'light-content'}
        backgroundColor={isLight ? '#F8FAFC' : '#0B132B'}
      />

      {/* 1. Header Trò Chơi */}
      <View style={styles.header}>
        {/* Nút Đóng */}
        <TouchableOpacity
          style={[
            styles.iconButton,
            { backgroundColor: isLight ? '#E2E8F0' : '#1E293B' },
          ]}
          onPress={onClose}
        >
          <Text style={[styles.iconButtonText, { color: isLight ? '#1E293B' : '#F8FAFC' }]}>
            ✕
          </Text>
        </TouchableOpacity>

        {/* Tiêu đề & Thế giới */}
        <View style={styles.headerCenter}>
          <Text
            style={[
              styles.headerTitle,
              { color: isLight ? '#0F172A' : '#F8FAFC' },
            ]}
            numberOfLines={1}
          >
            100 Câu Đố Kỳ Thú
          </Text>
          <TouchableOpacity
            style={[
              styles.worldBadge,
              { backgroundColor: currentWorldConfig.themeColor + '25' },
            ]}
            onPress={() => setShowWorldMap(true)}
          >
            <Text style={styles.worldBadgeText}>
              {currentWorldConfig.iconEmoji} {currentWorldConfig.name} ({currentIndexInWorld}/20)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Các nút góc phải: Bản đồ & Đổi Theme */}
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.starPill, { backgroundColor: '#FEF3C7' }]}
            onPress={() => setShowWorldMap(true)}
          >
            <Text style={styles.starPillText}>⭐ {progress.totalStars}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.mapButton,
              { backgroundColor: currentWorldConfig.themeColor },
            ]}
            onPress={() => setShowWorldMap(true)}
          >
            <Text style={styles.mapButtonText}>🗺️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Thanh Chuyển Đổi Chế Độ (Dual Mode Tabs) */}
      <View style={styles.modeTabBar}>
        <TouchableOpacity
          style={[
            styles.modeTab,
            gameMode === 'preschool' && {
              backgroundColor: currentWorldConfig.themeColor,
              borderColor: currentWorldConfig.themeColor,
            },
            {
              backgroundColor:
                gameMode === 'preschool'
                  ? currentWorldConfig.themeColor
                  : isLight
                  ? '#E2E8F0'
                  : '#1E293B',
            },
          ]}
          onPress={() => handleToggleMode('preschool')}
        >
          <Text
            style={[
              styles.modeTabText,
              {
                color:
                  gameMode === 'preschool'
                    ? '#FFFFFF'
                    : isLight
                    ? '#475569'
                    : '#94A3B8',
              },
            ]}
          >
            🌸 Mầm Non (Chạm 3D)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeTab,
            gameMode === 'detective' && {
              backgroundColor: currentWorldConfig.themeColor,
              borderColor: currentWorldConfig.themeColor,
            },
            {
              backgroundColor:
                gameMode === 'detective'
                  ? currentWorldConfig.themeColor
                  : isLight
                  ? '#E2E8F0'
                  : '#1E293B',
            },
          ]}
          onPress={() => handleToggleMode('detective')}
        >
          <Text
            style={[
              styles.modeTabText,
              {
                color:
                  gameMode === 'detective'
                    ? '#FFFFFF'
                    : isLight
                    ? '#475569'
                    : '#94A3B8',
              },
            ]}
          >
            🔍 Thám Tử (Ghép Chữ)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Nội dung chính có thể cuộn */}
      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 3. Cuộn Giấy Cổ Tích (Parchment Card) */}
        <Animated.View
          style={[
            styles.parchmentCard,
            {
              backgroundColor: isLight ? '#FFFDF7' : '#1E293B',
              borderColor: isLight ? '#FDE68A' : '#334155',
              transform: [{ scale: poemScaleAnim }],
            },
          ]}
        >
          {/* Tag số câu đố */}
          <View style={styles.parchmentHeader}>
            <View style={styles.levelTag}>
              <Text style={styles.levelTagText}>
                Trạm {currentIndexInWorld}/20 {isCurrentSolved ? '✓ Đã Giải' : ''}
              </Text>
            </View>

            {/* Nút Loa Đọc Thơ */}
            <TouchableOpacity
              style={[
                styles.audioButton,
                isReadingPoem && { backgroundColor: '#FDE047' },
              ]}
              onPress={handleReadPoem}
            >
              <Text style={styles.audioButtonText}>
                {isReadingPoem ? '🔊 Đang Đọc...' : '🔊 Nghe Thơ'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tiêu đề câu đố */}
          <Text
            style={[
              styles.riddleTitle,
              { color: isLight ? '#B45309' : '#FBBF24' },
            ]}
          >
            {currentRiddle.title}
          </Text>

          {/* Các dòng thơ câu đố */}
          <View style={styles.poemLinesContainer}>
            {currentRiddle.poem.map((line, idx) => (
              <Text
                key={`poem_${idx}`}
                style={[
                  styles.poemLine,
                  { color: isLight ? '#1E293B' : '#F8FAFC' },
                ]}
              >
                "{line}"
              </Text>
            ))}
          </View>

          {/* Dòng thơ gợi ý khi kích hoạt */}
          {isHintShown && (
            <View style={styles.hintPoemBox}>
              <Text style={styles.hintPoemTitle}>💡 Manh Mối:</Text>
              <Text style={styles.hintPoemText}>{currentRiddle.hintPoem}</Text>
            </View>
          )}
        </Animated.View>

        {/* 4. Vùng Tương Tác Trả Lời (Tùy theo Mode) */}
        {gameMode === 'preschool' ? (
          <Riddle3DStageGrid
            options={currentRiddle.options3D}
            eliminatedOptionIds={eliminatedOptionIds}
            selectedOptionId={selectedOptionId}
            isAnswerChecked={isAnswerChecked}
            isLight={isLight}
            onSelectOption={handleSelect3DOption}
          />
        ) : (
          <RiddleLetterScramble
            answer={currentRiddle.answer}
            scrambleLetters={currentRiddle.scrambleLetters}
            isLight={isLight}
            onCheckAnswer={handleCheckScrambleAnswer}
            hintLetterTrigger={hintLetterTrigger}
          />
        )}

        {/* 5. Thanh Điều Hướng & Nút Gợi Ý */}
        <View style={styles.actionToolbar}>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentIndexInWorld === 1 && { opacity: 0.4 },
            ]}
            disabled={currentIndexInWorld === 1}
            onPress={handlePrevRiddle}
          >
            <Text style={styles.navButtonText}>◀ Câu Trước</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.hintButton,
              { backgroundColor: currentWorldConfig.themeColor },
            ]}
            onPress={handleUseHint}
          >
            <Text style={styles.hintButtonText}>💡 Gợi Ý</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} onPress={handleNextRiddle}>
            <Text style={styles.navButtonText}>Câu Sau ▶</Text>
          </TouchableOpacity>
        </View>

        {/* 6. Trợ Lý Mascot (Tom & MiMi) */}
        <View
          style={[
            styles.mascotBar,
            { backgroundColor: isLight ? '#FFFFFF' : '#1E293B' },
          ]}
        >
          <Text style={styles.mascotAvatars}>👦✨👧</Text>
          <View style={styles.mascotBubble}>
            <Text
              style={[
                styles.mascotMessageText,
                { color: isLight ? '#1E293B' : '#F8FAFC' },
              ]}
            >
              {mascotMessage}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* 7. Modal Chúc Mừng Khi Giải Đúng */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <Text style={styles.successHeaderEmoji}>🎉 🌟 🎊</Text>
            <Text style={styles.successCongrats}>CHÍNH XÁC QUÁ BÉ ƠI!</Text>
            <Text style={styles.successAnswerText}>Đáp án: {currentRiddle.answer}</Text>

            {/* Mô hình 3D đáp án phóng to */}
            <View style={styles.successStageBox}>
              <VocabCard3DStage
                card={createSyntheticVocabCard(correctOption)}
                isLight={true}
                size="hero"
                interactive={false}
              />
            </View>

            {/* Fun fact */}
            <View style={styles.funFactBox}>
              <Text style={styles.funFactTitle}>📖 Bé Có Biết Không?</Text>
              <Text style={styles.funFactContent}>{currentRiddle.funFact}</Text>
            </View>

            {/* Nút sang câu tiếp */}
            <TouchableOpacity
              style={[
                styles.nextQuestionButton,
                { backgroundColor: currentWorldConfig.themeColor },
              ]}
              onPress={handleNextRiddle}
            >
              <Text style={styles.nextQuestionButtonText}>
                🌟 Câu Đố Tiếp Theo ➔
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 8. Modal Bản Đồ Thế Giới */}
      <RiddleWorldMapModal
        visible={showWorldMap}
        currentWorldId={currentWorldId}
        currentIndexInWorld={currentIndexInWorld}
        isLight={isLight}
        onSelectRiddle={handleSelectFromMap}
        onClose={() => setShowWorldMap(false)}
      />

      {/* 9. Modal Rương Kho Báu */}
      <RiddleTreasureModal
        visible={showTreasureModal}
        worldId={currentWorldId}
        onClose={() => setShowTreasureModal(false)}
        onNextWorld={() => {
          setShowTreasureModal(false);
          const worldKeys: WorldId[] = ['animals', 'fruits', 'household', 'vehicles', 'nature'];
          const nextWorld = worldKeys[(worldKeys.indexOf(currentWorldId) + 1) % worldKeys.length];
          setCurrentWorldId(nextWorld);
          setCurrentIndexInWorld(1);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  worldBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 2,
  },
  worldBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  starPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B45309',
  },
  mapButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapButtonText: {
    fontSize: 18,
  },
  modeTabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 14,
    alignItems: 'center',
  },
  modeTabText: {
    fontSize: 13,
    fontWeight: '700',
  },
  mainScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  parchmentCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 24,
    borderWidth: 2,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  parchmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  levelTagText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  audioButton: {
    backgroundColor: '#FEF08A',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  audioButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#854D0E',
  },
  riddleTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  poemLinesContainer: {
    marginVertical: 6,
    alignItems: 'center',
  },
  poemLine: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 26,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  hintPoemBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  hintPoemTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
    marginBottom: 2,
  },
  hintPoemText: {
    fontSize: 13,
    color: '#78350F',
    fontWeight: '600',
  },
  actionToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  navButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
  },
  navButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  hintButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  hintButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  mascotBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 10,
    padding: 12,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  mascotAvatars: {
    fontSize: 24,
    marginRight: 10,
  },
  mascotBubble: {
    flex: 1,
  },
  mascotMessageText: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    alignItems: 'center',
  },
  successHeaderEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  successCongrats: {
    fontSize: 20,
    fontWeight: '900',
    color: '#10B981',
    marginBottom: 4,
  },
  successAnswerText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 10,
  },
  successStageBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  funFactBox: {
    width: '100%',
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginVertical: 12,
  },
  funFactTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1D4ED8',
    marginBottom: 4,
  },
  funFactContent: {
    fontSize: 13,
    color: '#1E3A8A',
    lineHeight: 18,
  },
  nextQuestionButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
  },
  nextQuestionButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
