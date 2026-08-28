import React, { useState, useEffect, useCallback, useRef } from 'react';
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

interface MemoryCard {
  id: string;
  emoji: string;
  name: string;
  matched: boolean;
  flipped: boolean;
}

interface MemoryGameScreenProps {
  theme?: ThemeConfig;
  onClose: () => void;
}

type GameThemeType = 'animals' | 'fruits' | 'vehicles';
type GameDifficulty = 'easy' | 'medium' | 'hard';

const THEME_DATA: Record<GameThemeType, { label: string; icon: string; items: { emoji: string; name: string }[] }> = {
  animals: {
    label: 'Động Vật',
    icon: '🐾',
    items: [
      { emoji: '🐶', name: 'Cún Con' },
      { emoji: '🐱', name: 'Mèo Con' },
      { emoji: '🐼', name: 'Gấu Trúc' },
      { emoji: '🦁', name: 'Sư Tử' },
      { emoji: '🐰', name: 'Thỏ Trắng' },
      { emoji: '🦄', name: 'Kỳ Lân' },
      { emoji: '🦊', name: 'Cáo Đỏ' },
      { emoji: '🐵', name: 'Khỉ Vàng' },
    ],
  },
  fruits: {
    label: 'Hoa Quả',
    icon: '🍎',
    items: [
      { emoji: '🍎', name: 'Quả Táo' },
      { emoji: '🍌', name: 'Quả Chuối' },
      { emoji: '🍇', name: 'Chùm Nho' },
      { emoji: '🍓', name: 'Dâu Tây' },
      { emoji: '🍉', name: 'Dưa Hấu' },
      { emoji: '🥑', name: 'Quả Bơ' },
      { emoji: '🍒', name: 'Quả Cherry' },
      { emoji: '🍍', name: 'Quả Dứa' },
    ],
  },
  vehicles: {
    label: 'Xe Cộ',
    icon: '🚗',
    items: [
      { emoji: '🚗', name: 'Ô Tô' },
      { emoji: '🚀', name: 'Tên Lửa' },
      { emoji: '🚁', name: 'Trực Thăng' },
      { emoji: '🚂', name: 'Tàu Hỏa' },
      { emoji: '🚢', name: 'Tàu Thủy' },
      { emoji: '🚒', name: 'Xe Cứu Hỏa' },
      { emoji: '🚑', name: 'Xe Cứu Thương' },
      { emoji: '🚜', name: 'Máy Cày' },
    ],
  },
};

const DIFFICULTY_CONFIG: Record<GameDifficulty, { label: string; pairs: number; cols: number }> = {
  easy: { label: 'Dễ (3 Cặp)', pairs: 3, cols: 3 }, // 6 thẻ (2x3)
  medium: { label: 'Vừa (4 Cặp)', pairs: 4, cols: 4 }, // 8 thẻ (2x4)
  hard: { label: 'Thử Thách (6 Cặp)', pairs: 6, cols: 4 }, // 12 thẻ (3x4)
};

export const MemoryGameScreen: React.FC<MemoryGameScreenProps> = ({ onClose }) => {
  const { width } = useWindowDimensions();
  const [selectedTheme, setSelectedTheme] = useState<GameThemeType>('animals');
  const [difficulty, setDifficulty] = useState<GameDifficulty>('easy');

  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Hiệu ứng pháo hoa / nảy sao
  const victoryScale = useRef(new Animated.Value(0.3)).current;

  // 1. Hàm khởi tạo ván bài mới
  const startNewGame = useCallback(() => {
    const config = DIFFICULTY_CONFIG[difficulty];
    const themePool = THEME_DATA[selectedTheme].items;

    // Chọn ngẫu nhiên N cặp từ bộ chủ đề
    const shuffledItems = [...themePool].sort(() => Math.random() - 0.5).slice(0, config.pairs);

    // Nhân đôi để tạo các cặp
    const cardPairs: MemoryCard[] = [];
    shuffledItems.forEach((item, index) => {
      cardPairs.push({
        id: `${item.name}-1-${index}`,
        emoji: item.emoji,
        name: item.name,
        matched: false,
        flipped: false,
      });
      cardPairs.push({
        id: `${item.name}-2-${index}`,
        emoji: item.emoji,
        name: item.name,
        matched: false,
        flipped: false,
      });
    });

    // Xáo trộn ngẫu nhiên vị trí các thẻ
    const randomized = cardPairs.sort(() => Math.random() - 0.5);

    setCards(randomized);
    setSelectedIndices([]);
    setMoves(0);
    setScore(0);
    setMatchedPairs(0);
    setSeconds(0);
    setIsVictory(false);
    setIsProcessing(false);
    setIsGameActive(true);
  }, [difficulty, selectedTheme]);

  // Khởi chạy game khi mở màn hình hoặc đổi theme/độ khó
  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // Bộ đếm thời gian
  useEffect(() => {
    let timer: any = null;
    if (isGameActive && !isVictory) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isGameActive, isVictory]);

  // 2. Xử lý khi bé chạm vào một thẻ bài
  const handleCardPress = (index: number) => {
    if (isProcessing) return;
    const clickedCard = cards[index];

    // Bỏ qua nếu thẻ đã lật hoặc đã ghép cặp thành công
    if (clickedCard.flipped || clickedCard.matched) return;

    // Lật thẻ đang chọn
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newSelected = [...selectedIndices, index];
    setSelectedIndices(newSelected);

    // Khi đã lật đủ 2 thẻ
    if (newSelected.length === 2) {
      setIsProcessing(true);
      setMoves((m) => m + 1);

      const [firstIdx, secondIdx] = newSelected;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.emoji === secondCard.emoji) {
        // GHÉP ĐÚNG CẶP 🎉
        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[firstIdx].matched = true;
          updatedCards[secondIdx].matched = true;
          setCards(updatedCards);
          setSelectedIndices([]);
          setScore((s) => s + 100);
          const nextMatched = matchedPairs + 1;
          setMatchedPairs(nextMatched);
          setIsProcessing(false);

          // Kiểm tra xem đã thắng toàn bộ màn chơi chưa
          if (nextMatched === DIFFICULTY_CONFIG[difficulty].pairs) {
            handleVictory();
          }
        }, 500);
      } else {
        // GHÉP SAI -> Úp lại sau 0.9 giây
        setTimeout(() => {
          const revertedCards = [...newCards];
          revertedCards[firstIdx].flipped = false;
          revertedCards[secondIdx].flipped = false;
          setCards(revertedCards);
          setSelectedIndices([]);
          setIsProcessing(false);
        }, 900);
      }
    }
  };

  // 3. Xử lý chiến thắng
  const handleVictory = () => {
    setIsVictory(true);
    setIsGameActive(false);
    victoryScale.setValue(0.3);
    Animated.spring(victoryScale, {
      toValue: 1,
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  // Tính số sao đạt được
  const calculateStars = () => {
    const config = DIFFICULTY_CONFIG[difficulty];
    const perfectMoves = config.pairs + 2;
    if (moves <= perfectMoves) return 3;
    if (moves <= perfectMoves + 4) return 2;
    return 1;
  };

  // Định dạng thời gian mm:ss
  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentCols = DIFFICULTY_CONFIG[difficulty].cols;
  const cardSize = Math.min((width - 48 - (currentCols - 1) * 12) / currentCols, 110);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

      {/* 1. HEADER CHÍNH */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onClose} activeOpacity={0.7}>
          <Text style={styles.backBtnText}>✕ Đóng</Text>
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>🃏 Lật Thẻ Trí Nhớ</Text>
          <Text style={styles.headerSub}>Tìm các cặp hình giống nhau nhé bé!</Text>
        </View>

        <TouchableOpacity style={styles.restartBtn} onPress={startNewGame} activeOpacity={0.7}>
          <Text style={styles.restartBtnText}>🔄 Chơi Lại</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 2. THANH CHỌN CHỦ ĐỀ & ĐỘ KHÓ */}
        <View style={styles.filterSection}>
          {/* Chọn Chủ Đề */}
          <View style={styles.themeSelectorRow}>
            {(Object.keys(THEME_DATA) as GameThemeType[]).map((tKey) => {
              const item = THEME_DATA[tKey];
              const isSelected = selectedTheme === tKey;
              return (
                <TouchableOpacity
                  key={tKey}
                  style={[styles.themePill, isSelected && styles.themePillActive]}
                  onPress={() => setSelectedTheme(tKey)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.themePillIcon}>{item.icon}</Text>
                  <Text style={[styles.themePillText, isSelected && styles.themePillTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Chọn Độ Khó */}
          <View style={styles.difficultyRow}>
            {(Object.keys(DIFFICULTY_CONFIG) as GameDifficulty[]).map((dKey) => {
              const item = DIFFICULTY_CONFIG[dKey];
              const isSelected = difficulty === dKey;
              return (
                <TouchableOpacity
                  key={dKey}
                  style={[styles.diffPill, isSelected && styles.diffPillActive]}
                  onPress={() => setDifficulty(dKey)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.diffPillText, isSelected && styles.diffPillTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 3. BẢNG THỐNG KÊ (SCORE, MOVES, TIME) */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>⏱️ Thời Gian</Text>
            <Text style={styles.statValue}>{formatTime(seconds)}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>🎯 Lượt Lật</Text>
            <Text style={styles.statValue}>{moves}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>✨ Đã Tìm Được</Text>
            <Text style={[styles.statValue, { color: '#16A34A' }]}>
              {matchedPairs}/{DIFFICULTY_CONFIG[difficulty].pairs} Cặp
            </Text>
          </View>
        </View>

        {/* 4. LƯỚI THẺ BÀI TRÒ CHƠI */}
        <View style={styles.boardContainer}>
          <View style={[styles.grid, { maxWidth: currentCols * (cardSize + 12) }]}>
            {cards.map((card, index) => {
              const isFlipped = card.flipped || card.matched;
              return (
                <TouchableOpacity
                  key={card.id}
                  style={[
                    styles.cardWrapper,
                    { width: cardSize, height: cardSize * 1.2 },
                    isFlipped ? styles.cardFlipped : styles.cardBack,
                    card.matched && styles.cardMatched,
                  ]}
                  activeOpacity={0.85}
                  onPress={() => handleCardPress(index)}
                  disabled={isFlipped || isProcessing}
                >
                  {isFlipped ? (
                    <View style={styles.cardFrontContent}>
                      <Text style={styles.cardEmoji}>{card.emoji}</Text>
                      <Text style={styles.cardName} numberOfLines={1}>
                        {card.name}
                      </Text>
                      {card.matched && (
                        <View style={styles.matchedBadge}>
                          <Text style={styles.matchedCheck}>✓</Text>
                        </View>
                      )}
                    </View>
                  ) : (
                    <View style={styles.cardBackContent}>
                      <Text style={styles.cardBackPattern}>⭐</Text>
                      <Text style={styles.cardBackSubPattern}>❓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* 5. MODAL CHÚC MỪNG CHIẾN THẮNG */}
      <Modal visible={isVictory} transparent animationType="fade">
        <View style={styles.victoryModalOverlay}>
          <Animated.View
            style={[
              styles.victoryModalCard,
              {
                transform: [{ scale: victoryScale }],
              },
            ]}
          >
            <Text style={styles.victoryTrophy}>🏆</Text>
            <Text style={styles.victoryTitle}>BÉ TUYỆT VỜI QUÁ! 🎉</Text>
            <Text style={styles.victorySub}>
              Bé đã tìm đúng tất cả các cặp thẻ trong chủ đề "{THEME_DATA[selectedTheme].label}"!
            </Text>

            {/* XẾP HẠNG NGÔI SAO */}
            <View style={styles.starsRow}>
              {Array.from({ length: 3 }).map((_, i) => (
                <Text
                  key={i}
                  style={[
                    styles.starIcon,
                    { opacity: i < calculateStars() ? 1 : 0.25 },
                  ]}
                >
                  ⭐
                </Text>
              ))}
            </View>

            {/* TỔNG KẾT */}
            <View style={styles.victoryStatsBox}>
              <Text style={styles.victoryStatText}>
                ⏱️ Thời gian: <Text style={{ fontWeight: '800', color: '#4F46E5' }}>{formatTime(seconds)}</Text>
              </Text>
              <Text style={styles.victoryStatText}>
                🎯 Số lượt lật: <Text style={{ fontWeight: '800', color: '#4F46E5' }}>{moves} lượt</Text>
              </Text>
              <Text style={styles.victoryStatText}>
                🌟 Điểm thưởng: <Text style={{ fontWeight: '800', color: '#EAB308' }}>+{score} Sao</Text>
              </Text>
            </View>

            {/* NÚT THAO TÁC */}
            <View style={styles.victoryActions}>
              <TouchableOpacity
                style={styles.playAgainBtn}
                onPress={startNewGame}
                activeOpacity={0.8}
              >
                <Text style={styles.playAgainBtnText}>🎮 Chơi Tiếp</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.leaveBtn}
                onPress={() => {
                  setIsVictory(false);
                  onClose();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.leaveBtnText}>🏠 Về Trang Chủ</Text>
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
    backgroundColor: '#EEF2FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#4F46E5',
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
    color: '#E0E7FF',
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
    backgroundColor: '#F59E0B',
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

  /* FILTER SECTION */
  filterSection: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  themeSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    gap: 8,
  },
  themePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  themePillActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  themePillIcon: {
    fontSize: 16,
  },
  themePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  themePillTextActive: {
    color: '#4F46E5',
  },
  difficultyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
  diffPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  diffPillActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#22C55E',
  },
  diffPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  diffPillTextActive: {
    color: '#15803D',
  },

  /* STATS CARD */
  statsCard: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1F2937',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
  },

  /* BOARD & CARDS */
  boardContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  cardWrapper: {
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },
  cardBack: {
    backgroundColor: '#6366F1',
    borderWidth: 3,
    borderColor: '#818CF8',
  },
  cardBackContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBackPattern: {
    fontSize: 26,
  },
  cardBackSubPattern: {
    fontSize: 14,
    marginTop: 2,
    color: '#C7D2FE',
    fontWeight: 'bold',
  },
  cardFlipped: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#A5B4FC',
  },
  cardMatched: {
    backgroundColor: '#F0FDF4',
    borderColor: '#22C55E',
    borderWidth: 3,
  },
  cardFrontContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  cardEmoji: {
    fontSize: 34,
    marginBottom: 4,
  },
  cardName: {
    fontSize: 10,
    fontWeight: '800',
    color: '#374151',
    textAlign: 'center',
  },
  matchedBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#22C55E',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchedCheck: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },

  /* VICTORY MODAL */
  victoryModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  victoryModalCard: {
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
  victoryTrophy: {
    fontSize: 56,
    marginBottom: 8,
  },
  victoryTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1E1B4B',
    textAlign: 'center',
    marginBottom: 6,
  },
  victorySub: {
    fontSize: 13,
    color: '#6B7280',
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
  victoryStatsBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    gap: 6,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  victoryStatText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
  victoryActions: {
    width: '100%',
    gap: 10,
  },
  playAgainBtn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: 'center',
  },
  playAgainBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  leaveBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  leaveBtnText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '700',
  },
});
