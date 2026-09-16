import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import {
  VocabCard,
  VocabCategory,
  getCardRarity,
  CardRarityTier,
} from '../data/oxfordKidsVocabulary';
import { flashcardService } from '../services/flashcardService';
import { soundManager } from './SoundPlayer';

interface CardAlbumModalProps {
  visible: boolean;
  allCategories: VocabCategory[];
  onClose: () => void;
  onSelectCardToExplore?: (card: VocabCard) => void;
}

export const CardAlbumModal: React.FC<CardAlbumModalProps> = ({
  visible,
  allCategories,
  onClose,
  onSelectCardToExplore,
}) => {
  const { width, height } = useWindowDimensions();
  const numColumns = width > 520 ? 4 : (width < 340 ? 2 : 3);
  const isCompact = height < 680 || width < 360;

  const [selectedCatId, setSelectedCatId] = useState<string>('all');
  const unlockedIds = flashcardService.getUnlockedCardIds();

  // Gom toàn bộ thẻ
  const allCards: VocabCard[] = [];
  allCategories.forEach((cat) => {
    cat.cards?.forEach((c) => allCards.push(c));
  });

  const totalCardsCount = allCards.length;
  const unlockedCount = allCards.filter((c) => unlockedIds.has(c.id)).length;
  const completionPercent = totalCardsCount > 0
    ? Math.round((unlockedCount / totalCardsCount) * 100)
    : 0;

  // Lọc theo danh mục
  const displayCards: VocabCard[] = selectedCatId === 'all'
    ? allCards
    : (allCategories.find((c) => c.id === selectedCatId)?.cards || []);

  const handlePressCard = (card: VocabCard) => {
    const isUnlocked = unlockedIds.has(card.id);
    if (isUnlocked) {
      soundManager.speak(card.english, 'en');
      onSelectCardToExplore?.(card);
      onClose();
    } else {
      soundManager.speak('Thẻ này chưa mở khóa. Bé hãy mở túi thẻ để nhận nhé!', 'vi');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.albumContainer, isCompact && styles.albumContainerCompact]}>
          {/* HEADER */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>📖 SỔ TAY THẺ MA THUẬT</Text>
              <Text style={styles.headerSubtitle}>
                Đã sưu tập: {unlockedCount}/{totalCardsCount} thẻ ({completionPercent}%)
              </Text>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* THANH TIẾN TRÌNH TỔNG THỂ */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${completionPercent}%` }]} />
          </View>

          {/* DANH SÁCH TAB DANH MỤC */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            <TouchableOpacity
              style={[
                styles.catPill,
                selectedCatId === 'all' && styles.catPillActive,
              ]}
              onPress={() => setSelectedCatId('all')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.catPillText,
                  selectedCatId === 'all' && styles.catPillTextActive,
                ]}
              >
                🌟 Tất Cả ({allCards.length})
              </Text>
            </TouchableOpacity>

            {allCategories.map((cat) => {
              const isActive = selectedCatId === cat.id;
              const catUnlocked = cat.cards.filter((c) => unlockedIds.has(c.id)).length;
              const isFinished = catUnlocked === cat.cards.length;

              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.catPill,
                    isActive && styles.catPillActive,
                    isFinished && styles.catPillFinished,
                  ]}
                  onPress={() => setSelectedCatId(cat.id)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.catPillText,
                      isActive && styles.catPillTextActive,
                    ]}
                  >
                    {cat.icon} {cat.titleVi} ({catUnlocked}/{cat.cards.length}) {isFinished ? '👑' : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* LƯỚI THẺ BÀI */}
          <FlatList
            data={displayCards}
            numColumns={numColumns}
            key={numColumns}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.cardGrid}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isUnlocked = unlockedIds.has(item.id);
              const rarity: CardRarityTier = getCardRarity(item);
              const isLegendary = rarity === 'legendary';
              const isRare = rarity === 'rare';

              return (
                <TouchableOpacity
                  style={[
                    styles.gridCard,
                    isCompact && styles.gridCardCompact,
                    isUnlocked
                      ? [
                          styles.gridCardUnlocked,
                          { borderColor: isLegendary ? '#F59E0B' : isRare ? '#A855F7' : item.color },
                        ]
                      : styles.gridCardLocked,
                  ]}
                  onPress={() => handlePressCard(item)}
                  activeOpacity={0.8}
                >
                  {isUnlocked ? (
                    <>
                      <View
                        style={[
                          styles.gridRarityBadge,
                          { backgroundColor: isLegendary ? '#F59E0B' : isRare ? '#A855F7' : '#475569' },
                        ]}
                      >
                        <Text style={styles.gridRarityText}>
                          {isLegendary ? '⭐ 3D' : isRare ? '✨' : '🥉'}
                        </Text>
                      </View>
                      <Text style={[styles.gridEmoji, isCompact && styles.gridEmojiCompact]}>
                        {item.emoji}
                      </Text>
                      <Text style={styles.gridWordEn} numberOfLines={1}>
                        {item.english}
                      </Text>
                      <Text style={styles.gridWordVi} numberOfLines={1}>
                        {item.vietnamese}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={[styles.gridLockedIcon, isCompact && styles.gridLockedIconCompact]}>
                        🔒
                      </Text>
                      <Text style={styles.gridLockedText}>Chưa mở</Text>
                    </>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  albumContainer: {
    width: '100%',
    maxWidth: 520,
    height: '88%',
    backgroundColor: '#1E293B',
    borderRadius: 26,
    padding: 16,
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
  albumContainerCompact: {
    padding: 12,
    height: '92%',
    borderRadius: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    color: '#FBBF24',
    fontSize: 16,
    fontWeight: '900',
  },
  headerSubtitle: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: '#0F172A',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  categoryScroll: {
    paddingVertical: 6,
    gap: 8,
  },
  catPill: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#334155',
    marginRight: 6,
  },
  catPillActive: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  catPillFinished: {
    borderColor: '#F59E0B',
  },
  catPillText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '800',
  },
  catPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  cardGrid: {
    paddingTop: 10,
    paddingBottom: 20,
    gap: 10,
  },
  gridCard: {
    flex: 1,
    margin: 4,
    height: 125,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 6,
    borderWidth: 2,
  },
  gridCardCompact: {
    height: 112,
    padding: 4,
    margin: 3,
  },
  gridCardUnlocked: {
    backgroundColor: '#0F172A',
  },
  gridCardLocked: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    opacity: 0.5,
    justifyContent: 'center',
  },
  gridRarityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  gridRarityText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '900',
  },
  gridEmoji: {
    fontSize: 38,
  },
  gridEmojiCompact: {
    fontSize: 32,
  },
  gridWordEn: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
  },
  gridWordVi: {
    color: '#34D399',
    fontSize: 9.5,
    fontWeight: '700',
    textAlign: 'center',
  },
  gridLockedIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  gridLockedIconCompact: {
    fontSize: 24,
    marginBottom: 2,
  },
  gridLockedText: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700',
  },
});
