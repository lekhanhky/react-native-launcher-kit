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

interface DifferenceItem {
  id: string;
  nameVi: string;
  emojiLeft: string;
  emojiRight: string;
  isDifferent: boolean;
}

interface PicturePuzzle {
  id: string;
  themeTitle: string;
  bgTheme: string;
  items: DifferenceItem[];
}

const PUZZLES: PicturePuzzle[] = [
  {
    id: 'farm',
    themeTitle: '🌾 Nông Trại Vui Vẻ',
    bgTheme: '#F59E0B',
    items: [
      { id: 'sun', nameVi: 'Mặt Trời', emojiLeft: '☀️', emojiRight: '😎', isDifferent: true },
      { id: 'tree', nameVi: 'Cây Xanh', emojiLeft: '🌳', emojiRight: '🌳', isDifferent: false },
      { id: 'bird', nameVi: 'Chú Chim', emojiLeft: '🐦', emojiRight: '🦜', isDifferent: true },
      { id: 'house', nameVi: 'Ngôi Nhà', emojiLeft: '🏠', emojiRight: '🏠', isDifferent: false },
      { id: 'cow', nameVi: 'Bò Sữa', emojiLeft: '🐄', emojiRight: '🐄', isDifferent: false },
      { id: 'tractor', nameVi: 'Xe Kéo', emojiLeft: '🚜', emojiRight: '🚗', isDifferent: true },
    ],
  },
  {
    id: 'ocean',
    themeTitle: '🌊 Biển Xanh Đảo Ngọc',
    bgTheme: '#0284C7',
    items: [
      { id: 'island', nameVi: 'Hòn Đảo', emojiLeft: '🏝️', emojiRight: '🏝️', isDifferent: false },
      { id: 'fish', nameVi: 'Chú Cá', emojiLeft: '🐟', emojiRight: '🐡', isDifferent: true },
      { id: 'boat', nameVi: 'Thuyền Buồm', emojiLeft: '⛵', emojiRight: '⛵', isDifferent: false },
      { id: 'starfish', nameVi: 'Sao Biển', emojiLeft: '⭐', emojiRight: '🦀', isDifferent: true },
      { id: 'octopus', nameVi: 'Bạch Tuộc', emojiLeft: '🐙', emojiRight: '🐙', isDifferent: false },
      { id: 'dolphin', nameVi: 'Cá Heo', emojiLeft: '🐬', emojiRight: '🐳', isDifferent: true },
    ],
  },
];

export const SpotDifferenceGameScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const currentPuzzle = PUZZLES[puzzleIdx];
  const totalDiffs = currentPuzzle.items.filter((i) => i.isDifferent).length;

  useEffect(() => {
    soundManager.speak('Chào bé! Hãy tìm những điểm khác biệt giữa 2 bức tranh nhé!', 'vi');
    setFoundIds([]);
    setShowCelebration(false);
  }, [puzzleIdx]);

  const handleTapItem = (item: DifferenceItem) => {
    if (foundIds.includes(item.id)) return;

    if (item.isDifferent) {
      const nextFound = [...foundIds, item.id];
      setFoundIds(nextFound);
      setScore((prev) => prev + 15);
      soundManager.speak(`Giỏi lắm! Điểm khác biệt là ${item.nameVi}!`, 'vi');

      if (nextFound.length === totalDiffs) {
        setShowCelebration(true);
        soundManager.speak('Hoan hô bé! Bé đã tìm đủ mọi điểm khác biệt!', 'vi');
      }
    } else {
      soundManager.speak('Chi tiết này giống nhau rồi bé ơi! Hãy nhìn kỹ lại nhé.', 'vi');
    }
  };

  const useHint = () => {
    const remaining = currentPuzzle.items.filter((i) => i.isDifferent && !foundIds.includes(i.id));
    if (remaining.length > 0) {
      soundManager.speak(`Gợi ý cho bé: Hãy chú ý tới ${remaining[0].nameVi}!`, 'vi');
    }
  };

  const nextPuzzle = () => {
    setShowCelebration(false);
    setFoundIds([]);
    if (puzzleIdx + 1 < PUZZLES.length) {
      setPuzzleIdx((prev) => prev + 1);
    } else {
      setPuzzleIdx(0);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>🔍 Tìm Điểm Khác Biệt</Text>
          <Text style={styles.subtitleText}>{currentPuzzle.themeTitle} • Đã tìm: {foundIds.length}/{totalDiffs}</Text>
        </View>
        <TouchableOpacity style={styles.hintBtn} onPress={useHint} activeOpacity={0.8}>
          <Text style={styles.hintBtnText}>🔍 Gợi Ý</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentArea}>
        {/* PICTURE 1 (REFERENCE) */}
        <View style={styles.pictureCard}>
          <Text style={styles.pictureLabel}>🖼️ Bức Tranh Mẫu:</Text>
          <View style={styles.gridItems}>
            {currentPuzzle.items.map((item) => (
              <View key={item.id} style={styles.itemBox}>
                <Text style={styles.itemEmoji}>{item.emojiLeft}</Text>
                <Text style={styles.itemName}>{item.nameVi}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* PICTURE 2 (PUZZLE - INTERACTIVE) */}
        <View style={styles.pictureCard}>
          <Text style={styles.pictureLabel}>🎯 Bức Tranh Đố (Chạm vào điểm khác):</Text>
          <View style={styles.gridItems}>
            {currentPuzzle.items.map((item) => {
              const isFound = foundIds.includes(item.id);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.itemBox, isFound && styles.itemBoxFound]}
                  activeOpacity={0.7}
                  onPress={() => handleTapItem(item)}
                >
                  <Text style={styles.itemEmoji}>{item.emojiRight}</Text>
                  <Text style={styles.itemName}>{item.nameVi}</Text>
                  {isFound && <Text style={styles.foundStar}>⭐</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* CELEBRATION POPUP */}
      {showCelebration && (
        <View style={styles.celebrationOverlay}>
          <Text style={styles.celebrationEmoji}>🎉 🔍 🌟</Text>
          <Text style={styles.celebrationTitle}>XUẤT SẮC!</Text>
          <Text style={styles.celebrationSub}>Bé có đôi mắt quan sát thật tinh tường!</Text>
          <TouchableOpacity style={styles.nextPuzzleBtn} onPress={nextPuzzle} activeOpacity={0.8}>
            <Text style={styles.nextPuzzleText}>Bức Tranh Tiếp Theo ➡️</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
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
    color: '#BAE6FD',
    marginTop: 2,
  },
  hintBtn: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  hintBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  contentArea: {
    paddingHorizontal: 14,
    paddingBottom: 24,
    gap: 12,
  },
  pictureCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  pictureLabel: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
  },
  gridItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  itemBox: {
    width: '31%',
    backgroundColor: '#334155',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  itemBoxFound: {
    borderColor: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  itemEmoji: {
    fontSize: 34,
  },
  itemName: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  foundStar: {
    position: 'absolute',
    top: 4,
    right: 4,
    fontSize: 14,
  },
  celebrationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
    padding: 20,
  },
  celebrationEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  celebrationTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FDE047',
  },
  celebrationSub: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'center',
  },
  nextPuzzleBtn: {
    marginTop: 20,
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 16,
  },
  nextPuzzleText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});

export default SpotDifferenceGameScreen;
