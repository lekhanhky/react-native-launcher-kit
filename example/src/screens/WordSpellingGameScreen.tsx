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
  Platform,
} from 'react-native';
import { soundManager } from '../components/SoundPlayer';

interface WordPuzzle {
  id: string;
  category: 'animals' | 'fruits' | 'objects' | 'nature';
  word: string;
  hint: string;
  emoji: string;
  letters: string[];
}

const PUZZLE_LIST: WordPuzzle[] = [
  // Động vật
  { id: '1', category: 'animals', word: 'MÈO', hint: 'Bé mèo hay kêu meo meo', emoji: '🐱', letters: ['M', 'È', 'O'] },
  { id: '2', category: 'animals', word: 'CÚN', hint: 'Chú cún vẫy đuôi trông nhà', emoji: '🐶', letters: ['C', 'Ú', 'N'] },
  { id: '3', category: 'animals', word: 'VỊT', hint: 'Vịt con bơi lội cạp cạp', emoji: '🦆', letters: ['V', 'Ị', 'T'] },
  { id: '4', category: 'animals', word: 'GÀ', hint: 'Gà trống gáy ò ó o', emoji: '🐔', letters: ['G', 'À'] },
  { id: '5', category: 'animals', word: 'BÒ', hint: 'Bò sữa cho sữa thơm ngon', emoji: '🐮', letters: ['B', 'Ò'] },
  { id: '6', category: 'animals', word: 'VOI', hint: 'Chú voi có chiếc vòi dài', emoji: '🐘', letters: ['V', 'O', 'I'] },
  
  // Trái cây
  { id: '7', category: 'fruits', word: 'TÁO', hint: 'Quả táo đỏ giòn ngọt', emoji: '🍎', letters: ['T', 'Á', 'O'] },
  { id: '8', category: 'fruits', word: 'CAM', hint: 'Quả cam mọng nước nhiều vitamin C', emoji: '🍊', letters: ['C', 'A', 'M'] },
  { id: '9', category: 'fruits', word: 'CHUỐI', hint: 'Quả chuối vàng khỉ rất thích', emoji: '🍌', letters: ['C', 'H', 'U', 'Ố', 'I'] },
  { id: '10', category: 'fruits', word: 'DÂU', hint: 'Quả dâu tây đỏ tươi', emoji: '🍓', letters: ['D', 'Â', 'U'] },

  // Thiên nhiên & Đồ vật
  { id: '11', category: 'nature', word: 'MẶT TRỜI', hint: 'Chiếu ánh sáng ấm áp ban ngày', emoji: '☀️', letters: ['M', 'Ặ', 'T', ' ', 'T', 'R', 'Ờ', 'I'] },
  { id: '12', category: 'nature', word: 'SAO', hint: 'Ngôi sao lấp lánh ban đêm', emoji: '⭐', letters: ['S', 'A', 'O'] },
  { id: '13', category: 'objects', word: 'XE', hint: 'Xe ô tô chạy bon bon', emoji: '🚗', letters: ['X', 'E'] },
  { id: '14', category: 'objects', word: 'NHÀ', hint: 'Mái nhà ấm áp của bé', emoji: '🏠', letters: ['N', 'H', 'À'] },
  { id: '15', category: 'objects', word: 'BÓNG', hint: 'Quả bóng tròn bé đá bóng', emoji: '⚽', letters: ['B', 'Ó', 'N', 'G'] },
];

export const WordSpellingGameScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [slots, setSlots] = useState<(string | null)[]>([]);
  const [availableTiles, setAvailableTiles] = useState<{ id: number; char: string; used: boolean }[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showVictory, setShowVictory] = useState<boolean>(false);

  const bounceAnim = useRef(new Animated.Value(0)).current;

  const filteredPuzzles = selectedCategory === 'all' 
    ? PUZZLE_LIST 
    : PUZZLE_LIST.filter(p => p.category === selectedCategory);

  const currentPuzzle = filteredPuzzles[currentIndex] || filteredPuzzles[0];

  // Khởi tạo màn chơi mới
  const loadPuzzle = (puzzle: WordPuzzle) => {
    if (!puzzle) return;

    const slotArray = puzzle.letters.map(char => (char === ' ' ? ' ' : null));
    setSlots(slotArray);

    const letterChars = puzzle.letters.filter(c => c !== ' ');
    const noiseChars = ['A', 'O', 'E', 'N', 'T', 'H'];
    if (letterChars.length <= 3) {
      letterChars.push(noiseChars[Math.floor(Math.random() * noiseChars.length)]);
    }

    const shuffled = letterChars
      .map((char, index) => ({ id: index, char, used: false }))
      .sort(() => Math.random() - 0.5);

    setAvailableTiles(shuffled);
    setIsCompleted(false);

    soundManager.speak(`Bé hãy ghép từ: ${puzzle.word}`);
  };

  useEffect(() => {
    loadPuzzle(currentPuzzle);
  }, [currentIndex, selectedCategory]);

  const handleSelectTile = (tileId: number, char: string) => {
    if (isCompleted) return;

    const firstEmptyIndex = slots.findIndex(s => s === null);
    if (firstEmptyIndex === -1) return;

    const nextSlots = [...slots];
    nextSlots[firstEmptyIndex] = char;
    setSlots(nextSlots);

    setAvailableTiles(prev =>
      prev.map(t => (t.id === tileId ? { ...t, used: true } : t))
    );

    soundManager.play('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', char);
    checkWordComplete(nextSlots);
  };

  const handleRemoveFromSlot = (slotIndex: number) => {
    if (isCompleted) return;
    const charToRemove = slots[slotIndex];
    if (!charToRemove || charToRemove === ' ') return;

    const nextSlots = [...slots];
    nextSlots[slotIndex] = null;
    setSlots(nextSlots);

    setAvailableTiles(prev => {
      const idx = prev.findIndex(t => t.char === charToRemove && t.used);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], used: false };
        return next;
      }
      return prev;
    });

    soundManager.play('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3');
  };

  const checkWordComplete = (currentSlots: (string | null)[]) => {
    if (currentSlots.some(s => s === null)) return;

    const spelledWord = currentSlots.join('');
    const correctWord = currentPuzzle.letters.join('');

    if (spelledWord === correctWord) {
      setIsCompleted(true);
      setScore(prev => prev + 15);

      soundManager.play(
        'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
        `Chính xác! ${currentPuzzle.word}`
      );

      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -20, duration: 150, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      ]).start();
    } else {
      soundManager.speak('Chưa đúng thứ tự rồi, bé sửa lại nhé!');
    }
  };

  const handleNextWord = () => {
    if (currentIndex < filteredPuzzles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowVictory(true);
      soundManager.speak('Chúc mừng bé đã ghép xong tất cả các từ!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#064E3B" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>📝 Ghép Vần Tiếng Việt</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statBadge}>⭐ {score} điểm</Text>
            <Text style={styles.statBadge}>
              Từ {currentIndex + 1}/{filteredPuzzles.length}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.speakBtn}
          onPress={() => soundManager.speak(currentPuzzle.word)}
        >
          <Text style={styles.speakIcon}>🔊</Text>
        </TouchableOpacity>
      </View>

      {/* Bộ lọc danh mục */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {[
            { id: 'all', label: 'Tất Cả', icon: '🌟' },
            { id: 'animals', label: 'Con Vật', icon: '🐱' },
            { id: 'fruits', label: 'Trái Cây', icon: '🍎' },
            { id: 'nature', label: 'Tự Nhiên', icon: '☀️' },
            { id: 'objects', label: 'Đồ Vật', icon: '🚗' },
          ].map(c => (
            <TouchableOpacity
              key={c.id}
              style={[
                styles.categoryTab,
                selectedCategory === c.id && styles.categoryTabActive,
              ]}
              onPress={() => {
                setSelectedCategory(c.id);
                setCurrentIndex(0);
              }}
            >
              <Text style={styles.categoryIcon}>{c.icon}</Text>
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === c.id && styles.categoryTextActive,
                ]}
              >
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Vùng cuộn mượt cho bài ghép từ */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!showVictory && currentPuzzle ? (
          <View style={styles.gameBody}>
            {/* Card Hình ảnh minh họa */}
            <Animated.View
              style={[styles.illustrationCard, { transform: [{ translateY: bounceAnim }] }]}
            >
              <Text style={styles.bigEmoji}>{currentPuzzle.emoji}</Text>
              <Text style={styles.hintText}>{currentPuzzle.hint}</Text>
            </Animated.View>

            {/* Hàng Ô Chữ Cần Điền */}
            <View style={styles.slotsRow}>
              {slots.map((slotChar, idx) => {
                if (slotChar === ' ') {
                  return <View key={idx} style={styles.spaceSlot} />;
                }
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.slotBox,
                      slotChar ? styles.slotBoxFilled : styles.slotBoxEmpty,
                      isCompleted && styles.slotBoxCorrect,
                    ]}
                    onPress={() => handleRemoveFromSlot(idx)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.slotText}>{slotChar || ''}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Lưới các mảnh chữ cái để chọn */}
            <View style={styles.tilesContainer}>
              <Text style={styles.tilesGuide}>Chạm vào chữ cái để ghép:</Text>
              <View style={styles.tilesGrid}>
                {availableTiles.map(tile => (
                  <TouchableOpacity
                    key={tile.id}
                    style={[
                      styles.tileButton,
                      tile.used && styles.tileButtonUsed,
                    ]}
                    onPress={() => handleSelectTile(tile.id, tile.char)}
                    disabled={tile.used || isCompleted}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.tileText, tile.used && styles.tileTextUsed]}>
                      {tile.char}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Nút Từ Tiếp Theo */}
            {isCompleted && (
              <View style={styles.nextContainer}>
                <Text style={styles.celebrateText}>🎉 Giỏi Lắm! Đúng Từ "{currentPuzzle.word}" Rồi!</Text>
                <TouchableOpacity style={styles.nextWordBtn} onPress={handleNextWord}>
                  <Text style={styles.nextWordBtnText}>Ghép Từ Tiếp Theo ➔</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : showVictory ? (
          /* Màn hình chiến thắng */
          <View style={styles.victoryContainer}>
            <Text style={styles.victoryEmoji}>👑</Text>
            <Text style={styles.victoryTitle}>Bé Thật Tuyệt Vời!</Text>
            <Text style={styles.victorySubtitle}>Đã xuất sắc ghép đúng tất cả các từ</Text>
            <View style={styles.victoryScore}>
              <Text style={styles.victoryScoreText}>⭐ Tổng điểm: {score}</Text>
            </View>
            <TouchableOpacity
              style={styles.replayBtn}
              onPress={() => {
                setCurrentIndex(0);
                setShowVictory(false);
              }}
            >
              <Text style={styles.replayBtnText}>🔄 Chơi Lại Từ Đầu</Text>
            </TouchableOpacity>
          </View>
        ) : null}
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
    paddingVertical: 12,
    backgroundColor: '#065F46',
    borderBottomWidth: 2,
    borderBottomColor: '#047857',
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FEF08A',
    fontSize: 20,
    fontWeight: '900',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 8,
  },
  statBadge: {
    color: '#D1FAE5',
    fontSize: 12,
    fontWeight: '700',
    backgroundColor: '#047857',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  speakBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakIcon: {
    fontSize: 20,
  },
  categoryContainer: {
    paddingVertical: 8,
    backgroundColor: '#065F46',
  },
  categoryScroll: {
    paddingHorizontal: 12,
    gap: 8,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#047857',
    borderWidth: 1.5,
    borderColor: '#059669',
  },
  categoryTabActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#FFFFFF',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    color: '#D1FAE5',
    fontWeight: '700',
    fontSize: 13,
  },
  categoryTextActive: {
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
  gameBody: {
    width: '100%',
  },
  illustrationCard: {
    backgroundColor: '#065F46',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#34D399',
    elevation: 6,
  },
  bigEmoji: {
    fontSize: 68,
    marginBottom: 8,
  },
  hintText: {
    color: '#A7F3D0',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  slotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 16,
  },
  spaceSlot: {
    width: 16,
  },
  slotBox: {
    width: 52,
    height: 60,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
  },
  slotBoxEmpty: {
    backgroundColor: 'rgba(6, 95, 70, 0.6)',
    borderColor: '#34D399',
    borderStyle: 'dashed',
  },
  slotBoxFilled: {
    backgroundColor: '#10B981',
    borderColor: '#6EE7B7',
    elevation: 4,
  },
  slotBoxCorrect: {
    backgroundColor: '#F59E0B',
    borderColor: '#FDE68A',
  },
  slotText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
  },
  tilesContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  tilesGuide: {
    color: '#D1FAE5',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  tilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  tileButton: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#38BDF8',
    elevation: 4,
  },
  tileButtonUsed: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    opacity: 0.3,
  },
  tileText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },
  tileTextUsed: {
    color: '#64748B',
  },
  nextContainer: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  celebrateText: {
    color: '#FDE68A',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
  },
  nextWordBtn: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
    elevation: 6,
  },
  nextWordBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },
  victoryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  victoryEmoji: {
    fontSize: 80,
    marginBottom: 12,
  },
  victoryTitle: {
    color: '#FDE68A',
    fontSize: 28,
    fontWeight: '900',
  },
  victorySubtitle: {
    color: '#A7F3D0',
    fontSize: 16,
    marginTop: 6,
  },
  victoryScore: {
    backgroundColor: '#065F46',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 20,
    marginVertical: 20,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  victoryScoreText: {
    color: '#FDE68A',
    fontSize: 24,
    fontWeight: '900',
  },
  replayBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 36,
    paddingVertical: 16,
    borderRadius: 28,
  },
  replayBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
});

export default WordSpellingGameScreen;
