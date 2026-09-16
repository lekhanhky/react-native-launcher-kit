import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  PanResponder,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import {
  VocabCard,
  getCardRarity,
  CardRarityTier,
} from '../data/oxfordKidsVocabulary';
import { flashcardService } from '../services/flashcardService';
import { soundManager } from './SoundPlayer';

interface BoosterPackModalProps {
  visible: boolean;
  packType: 'common' | 'gold';
  allCards: VocabCard[];
  onClose: () => void;
  onCardsCollected?: (cards: VocabCard[]) => void;
}

export const BoosterPackModal: React.FC<BoosterPackModalProps> = ({
  visible,
  packType,
  allCards,
  onClose,
  onCardsCollected,
}) => {
  const { width, height } = useWindowDimensions();
  const isCompact = height < 680 || width < 360;

  // Trạng thái: 'sealed' (Túi chưa xé) | 'revealing' (Đang mở từng thẻ) | 'summary' (Đã mở hết)
  const [packState, setPackState] = useState<'sealed' | 'revealing' | 'summary'>('sealed');
  const [drawnCards, setDrawnCards] = useState<VocabCard[]>([]);
  const [revealedIndexSet, setRevealedIndexSet] = useState<Set<number>>(new Set());

  // Animation xé túi
  const ripAnim = useRef(new Animated.Value(0)).current;
  const packScale = useRef(new Animated.Value(1)).current;

  // Animation lật từng thẻ bài
  const cardFlipAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  // Khởi tạo túi thẻ khi mở modal
  useEffect(() => {
    if (visible) {
      setPackState('sealed');
      setRevealedIndexSet(new Set());
      ripAnim.setValue(0);
      packScale.setValue(1);
      cardFlipAnims.forEach((anim) => anim.setValue(0));

      // Bốc 3 thẻ
      const cards = flashcardService.drawCardsForPack(packType, allCards);
      setDrawnCards(cards);
    }
  }, [visible, packType]);

  // Hành động xé túi thẻ
  const handleRipPack = () => {
    if (packState !== 'sealed') return;

    soundManager.speak('Xé gói thẻ nào bé ơi!', 'vi');

    Animated.parallel([
      Animated.timing(ripAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(packScale, {
          toValue: 1.15,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(packScale, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setPackState('revealing');
    });
  };

  // Lật mở thẻ thứ i
  const handleRevealCard = (index: number) => {
    if (revealedIndexSet.has(index)) return;

    const targetCard = drawnCards[index];
    const rarity: CardRarityTier = targetCard ? getCardRarity(targetCard) : 'common';

    // Âm thanh theo độ hiếm
    if (rarity === 'legendary') {
      soundManager.speak(`Tuyệt vời! Bé mở trúng thẻ vàng ${targetCard.vietnamese}!`, 'vi');
    } else if (rarity === 'rare') {
      soundManager.speak(`Oa, thẻ hiếm ${targetCard.vietnamese}!`, 'vi');
    } else {
      soundManager.speak(targetCard.english, 'en');
    }

    Animated.timing(cardFlipAnims[index], {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      const nextSet = new Set(revealedIndexSet);
      nextSet.add(index);
      setRevealedIndexSet(nextSet);

      if (nextSet.size === drawnCards.length) {
        setPackState('summary');
        // Tự động mở khóa các thẻ này vào album
        flashcardService.unlockCards(drawnCards.map((c) => c.id));
      }
    });
  };

  const handleFinish = () => {
    onCardsCollected?.(drawnCards);
    onClose();
  };

  const isGold = packType === 'gold';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        {/* NÚT ĐÓNG */}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        <ScrollView
          style={styles.modalScroll}
          contentContainerStyle={styles.scrollOverlayContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* 1. MẶT TÚI THẺ CHƯA XÉ (SEALED PACK) */}
          {packState === 'sealed' && (
            <Animated.View
              style={[
                styles.packCardWrapper,
                { transform: [{ scale: packScale }] },
              ]}
            >
              <View
                style={[
                  styles.packContainer,
                  isGold ? styles.goldPackBg : styles.commonPackBg,
                  isCompact && styles.packContainerCompact,
                ]}
              >
                {/* ĐƯỜNG CHỈ XÉ TÚI */}
                <View style={styles.ripLineRow}>
                  <Text style={styles.ripLineDashes}>- - - - - - - - - - - - - - -</Text>
                  <Text style={styles.ripScissors}>✂️</Text>
                </View>

                {/* LOGO GÓI THẺ */}
                <View style={styles.packCenterBox}>
                  <Text style={[styles.packIcon, isCompact && styles.packIconCompact]}>
                    {isGold ? '👑' : '🎁'}
                  </Text>
                  <Text style={[styles.packTitle, isCompact && styles.packTitleCompact]}>
                    {isGold ? 'GÓI THẺ VÀNG HOÀNG GIA' : 'GÓI THẺ BÍ ẨN'}
                  </Text>
                  <Text style={styles.packSubtitle}>
                    {isGold
                      ? '⭐ Chắc chắn có Thẻ Hiếm & Huyền Thoại 3D!'
                      : '🎴 Khám phá 3 thẻ bài từ vựng Oxford'}
                  </Text>

                  <View style={styles.mascotBadge}>
                    <Text style={styles.mascotText}>👦 Tom & MiMi 👧 chúc bé may mắn!</Text>
                  </View>
                </View>

                {/* NÚT XÉ TÚI THẺ */}
                <TouchableOpacity
                  style={[
                    styles.ripButton,
                    isGold ? styles.goldRipBtn : styles.commonRipBtn,
                    isCompact && styles.ripButtonCompact,
                  ]}
                  onPress={handleRipPack}
                  activeOpacity={0.85}
                >
                  <Text style={styles.ripButtonText}>⚡ CHẠM ĐỂ XÉ GÓI THẺ ⚡</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {/* 2. MÀN HÌNH LẬT MỞ TỪNG THẺ (REVEALING & SUMMARY) */}
          {(packState === 'revealing' || packState === 'summary') && (
            <View style={styles.revealingContainer}>
              <Text style={[styles.revealHeading, isCompact && styles.revealHeadingCompact]}>
                {packState === 'summary'
                  ? '🎉 BÉ ĐÃ THU THẬP ĐỦ 3 THẺ!'
                  : '✨ CHẠM VÀO TỪNG THẺ ĐỂ LẬT MỞ ✨'}
              </Text>

              <View style={styles.cardsRow}>
                {drawnCards.map((card, idx) => {
                  const isRevealed = revealedIndexSet.has(idx);
                  const rarity = getCardRarity(card);
                  const isLegendary = rarity === 'legendary';
                  const isRare = rarity === 'rare';

                  const rotateY = cardFlipAnims[idx].interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                  });

                  return (
                    <TouchableOpacity
                      key={card.id}
                      style={[styles.cardSlot, isCompact && styles.cardSlotCompact]}
                      onPress={() => handleRevealCard(idx)}
                      activeOpacity={0.9}
                    >
                      <Animated.View
                        style={[
                          styles.packCardItem,
                          {
                            transform: [
                              { perspective: 1000 },
                              { rotateY },
                            ],
                          },
                        ]}
                      >
                        {!isRevealed ? (
                          /* MẶT SAU (ÚP THẺ) */
                          <View style={styles.cardBackFace}>
                            <Text style={[styles.shieldIcon, isCompact && styles.shieldIconCompact]}>🛡️</Text>
                            <Text style={[styles.mysteryQuestion, isCompact && styles.mysteryQuestionCompact]}>❓</Text>
                            <Text style={styles.tapToOpenText}>Chạm mở</Text>
                          </View>
                        ) : (
                          /* MẶT TRƯỚC (ĐÃ LẬT) */
                          <View
                            style={[
                              styles.cardFrontFace,
                              { borderColor: isLegendary ? '#F59E0B' : isRare ? '#A855F7' : card.color },
                              isLegendary && styles.legendaryFrontGlow,
                              isRare && styles.rareFrontGlow,
                              { transform: [{ rotateY: '180deg' }] },
                            ]}
                          >
                            <View
                              style={[
                                styles.miniRarityBadge,
                                { backgroundColor: isLegendary ? '#F59E0B' : isRare ? '#A855F7' : '#64748B' },
                              ]}
                            >
                              <Text style={styles.miniRarityText}>
                                {isLegendary ? '⭐ 3D' : isRare ? '✨ Hiếm' : 'Thường'}
                              </Text>
                            </View>

                            <Text style={[styles.cardFrontEmoji, isCompact && styles.cardFrontEmojiCompact]}>
                              {card.emoji}
                            </Text>
                            <Text style={styles.cardFrontEn} numberOfLines={1}>
                              {card.english}
                            </Text>
                            <Text style={styles.cardFrontVi} numberOfLines={1}>
                              {card.vietnamese}
                            </Text>
                          </View>
                        )}
                      </Animated.View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* NÚT HOÀN TẤT THU THẬP */}
              {packState === 'summary' && (
                <TouchableOpacity
                  style={[styles.collectAllBtn, isCompact && styles.collectAllBtnCompact]}
                  onPress={handleFinish}
                  activeOpacity={0.85}
                >
                  <Text style={styles.collectAllText}>📖 CẤT VÀO SỔ TAY SƯU TẬP</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
  },
  modalScroll: {
    flex: 1,
    width: '100%',
  },
  scrollOverlayContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    width: '100%',
  },
  closeBtn: {
    position: 'absolute',
    top: 36,
    right: 20,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  closeText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  packCardWrapper: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  packContainer: {
    width: '100%',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    borderWidth: 4,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
  },
  packContainerCompact: {
    padding: 16,
    borderRadius: 22,
  },
  goldPackBg: {
    backgroundColor: '#1E1B4B',
    borderColor: '#F59E0B',
  },
  commonPackBg: {
    backgroundColor: '#0F172A',
    borderColor: '#38BDF8',
  },
  ripLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    marginBottom: 16,
  },
  ripLineDashes: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
    fontWeight: 'bold',
  },
  ripScissors: {
    fontSize: 20,
    marginLeft: 6,
  },
  packCenterBox: {
    alignItems: 'center',
    marginVertical: 12,
  },
  packIcon: {
    fontSize: 70,
    marginBottom: 10,
  },
  packIconCompact: {
    fontSize: 50,
    marginBottom: 6,
  },
  packTitle: {
    color: '#FBBF24',
    fontSize: 19,
    fontWeight: '900',
    textAlign: 'center',
  },
  packTitleCompact: {
    fontSize: 16,
  },
  packSubtitle: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 6,
  },
  mascotBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 14,
  },
  mascotText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '800',
  },
  ripButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 18,
    elevation: 8,
  },
  ripButtonCompact: {
    paddingVertical: 11,
    marginTop: 12,
  },
  goldRipBtn: {
    backgroundColor: '#F59E0B',
  },
  commonRipBtn: {
    backgroundColor: '#0284C7',
  },
  ripButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  revealingContainer: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
  },
  revealHeading: {
    color: '#FBBF24',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 20,
  },
  revealHeadingCompact: {
    fontSize: 14,
    marginBottom: 12,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  cardSlot: {
    flex: 1,
    height: 190,
  },
  cardSlotCompact: {
    height: 160,
  },
  packCardItem: {
    width: '100%',
    height: '100%',
  },
  cardBackFace: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: '#64748B',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  shieldIcon: {
    fontSize: 28,
  },
  shieldIconCompact: {
    fontSize: 22,
  },
  mysteryQuestion: {
    fontSize: 32,
    marginVertical: 4,
  },
  mysteryQuestionCompact: {
    fontSize: 24,
    marginVertical: 2,
  },
  tapToOpenText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
  },
  cardFrontFace: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 18,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
  },
  legendaryFrontGlow: {
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  rareFrontGlow: {
    borderColor: '#A855F7',
    shadowColor: '#A855F7',
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  miniRarityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  miniRarityText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
  cardFrontEmoji: {
    fontSize: 48,
    marginVertical: 4,
  },
  cardFrontEmojiCompact: {
    fontSize: 38,
    marginVertical: 2,
  },
  cardFrontEn: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
  },
  cardFrontVi: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  collectAllBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 28,
    elevation: 8,
  },
  collectAllBtnCompact: {
    paddingVertical: 11,
    paddingHorizontal: 22,
    marginTop: 16,
    borderRadius: 14,
  },
  collectAllText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
});
