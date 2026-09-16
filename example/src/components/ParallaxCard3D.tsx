import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import {
  VocabCard,
  getCardRarity,
  getCardRealSfx,
  CardRarityTier,
} from '../data/oxfordKidsVocabulary';
import { soundManager } from './SoundPlayer';
import { VocabCard3DStage } from './VocabCard3DStage';

interface ParallaxCard3DProps {
  card: VocabCard;
  isLight?: boolean;
  langMode?: 'vi' | 'en' | 'bilingual';
  onFlipToggle?: (isFlipped: boolean) => void;
  cardHeight?: number;
}

export const ParallaxCard3D: React.FC<ParallaxCard3DProps> = ({
  card,
  isLight = false,
  langMode = 'bilingual',
  onFlipToggle,
  cardHeight,
}) => {
  const { width, height } = useWindowDimensions();
  const effectiveHeight = cardHeight || Math.min(410, Math.max(270, height - 240));
  const isCompact = effectiveHeight < 350;
  const stageSize = isCompact ? 'medium' : 'hero';

  const rarity: CardRarityTier = getCardRarity(card);
  const isLegendary = rarity === 'legendary';
  const isRare = rarity === 'rare';

  // --- 1. HIỆU ỨNG NGHIÊNG 3D THỜI GIAN THỰC (PARALLAX TILT) ---
  const tiltAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        // Giới hạn góc nghiêng tối đa ±14 độ
        const maxAngle = 14;
        const rotateX = Math.max(-maxAngle, Math.min(maxAngle, -gestureState.dy / 8));
        const rotateY = Math.max(-maxAngle, Math.min(maxAngle, gestureState.dx / 8));
        tiltAnim.setValue({ x: rotateX, y: rotateY });
      },
      onPanResponderRelease: () => {
        // Đàn hồi lò xo tự nhiên về vị trí cân bằng
        Animated.spring(tiltAnim, {
          toValue: { x: 0, y: 0 },
          friction: 6,
          tension: 45,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderTerminate: () => {
        Animated.spring(tiltAnim, {
          toValue: { x: 0, y: 0 },
          friction: 6,
          tension: 45,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  // --- 2. HIỆU ỨNG LẬT THẺ 2 PHA (2-PHASE 3D FLIP) ---
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const isFlippingRef = useRef<boolean>(false);

  const handleFlipCard = () => {
    if (isFlippingRef.current) return;
    isFlippingRef.current = true;

    // Phase 1: Thu thẻ lại theo trục Y từ 0 -> 90 độ
    Animated.timing(flipAnim, {
      toValue: 1,
      duration: 130,
      useNativeDriver: true,
    }).start(() => {
      const nextFlipped = !isFlipped;
      setIsFlipped(nextFlipped);
      onFlipToggle?.(nextFlipped);
      flipAnim.setValue(-1);

      // Phase 2: Bung mở mặt thẻ mới từ -90 độ -> 0 độ
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 130,
        useNativeDriver: true,
      }).start(() => {
        isFlippingRef.current = false;
      });
    });
  };

  // Reset góc lật khi đổi thẻ mới
  useEffect(() => {
    setIsFlipped(false);
    flipAnim.setValue(0);
    tiltAnim.setValue({ x: 0, y: 0 });
    isFlippingRef.current = false;
  }, [card.id]);

  // Nội suy góc lật thẻ
  const rotateYFlip = flipAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-90deg', '0deg', '90deg'],
  });

  const flipScale = flipAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0.94, 1, 0.94],
  });

  // Nội suy góc nghiêng theo ngón tay
  const tiltRotateX = tiltAnim.x.interpolate({
    inputRange: [-14, 0, 14],
    outputRange: ['-14deg', '0deg', '14deg'],
  });

  const tiltRotateY = tiltAnim.y.interpolate({
    inputRange: [-14, 0, 14],
    outputRange: ['-14deg', '0deg', '14deg'],
  });

  // Dải sáng tráng gương Holographic Foil trượt ngang theo góc nghiêng
  const glareTranslateX = tiltAnim.y.interpolate({
    inputRange: [-14, 0, 14],
    outputRange: [-180, 0, 180],
  });

  // --- 3. HỆ THỐNG ÂM THANH ĐA TẦNG ---
  const handlePlayRealSfx = () => {
    const sfxUrl = getCardRealSfx(card);
    if (sfxUrl) {
      soundManager.play(sfxUrl);
    } else {
      // Fallback: phát âm từ
      soundManager.speak(card.english, 'en');
    }
  };

  const speakEnglishSlow = () => {
    // Phát âm chậm 0.75x kèm hướng dẫn phát âm từng âm tiết
    soundManager.speak(card.english, 'en');
  };

  return (
    <View style={[styles.cardOuterWrapper, { height: effectiveHeight }]}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.animatedCardContainer,
          {
            transform: [
              { perspective: 1200 },
              { rotateX: tiltRotateX },
              { rotateY: tiltRotateY },
              { rotateY: rotateYFlip },
              { scale: flipScale },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.cardBase,
            isCompact && styles.cardBaseCompact,
            isLight ? styles.cardBaseLight : styles.cardBaseDark,
            isFlipped && (isLight ? styles.cardBackLight : styles.cardBackDark),
            { borderColor: isLegendary ? '#F59E0B' : isRare ? '#A855F7' : card.color },
            isLegendary && styles.legendaryGlow,
            isRare && styles.rareGlow,
          ]}
          onPress={handleFlipCard}
          activeOpacity={0.96}
        >
          {/* LỚP PHỦ TRÁNG GƯƠNG HOLOGRAPHIC CẦU VỒNG */}
          {(isLegendary || isRare) && (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.holographicGlare,
                isLegendary ? styles.legendaryGlare : styles.rareGlare,
                { transform: [{ translateX: glareTranslateX }, { rotate: '25deg' }] },
              ]}
            />
          )}

          {/* HEADER TAG: ĐỘ HIẾM & NÚT GỢI Ý LẬT */}
          <View
            style={[
              styles.cardHeaderTag,
              { backgroundColor: isLegendary ? '#D97706' : isRare ? '#7E22CE' : card.color },
            ]}
          >
            <View style={styles.rarityBadge}>
              <Text style={styles.rarityText}>
                {isLegendary
                  ? '⭐ HUYỀN THOẠI 3D'
                  : isRare
                  ? '✨ THẺ HIẾM'
                  : '🌿 THỰC TẾ 3D'}
              </Text>
            </View>

            <View style={styles.flipHintRow}>
              <Text style={styles.flipHintText}>🔄 Chạm để lật</Text>
            </View>
          </View>

          {/* KHUNG VẬT THỂ 3D CHÍNH */}
          <View style={[styles.stageWrapper, isCompact && styles.stageWrapperCompact]}>
            <VocabCard3DStage
              card={card}
              isLight={isLight}
              size={stageSize}
              onPress={handlePlayRealSfx}
            />

            {/* Nút bấm nghe âm thanh thực tế nếu có */}
            {getCardRealSfx(card) && (
              <TouchableOpacity
                style={[styles.sfxBadge, isCompact && styles.sfxBadgeCompact]}
                onPress={handlePlayRealSfx}
                activeOpacity={0.8}
              >
                <Text style={styles.sfxBadgeText}>🔊 Tiếng kêu</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* NỘI DUNG TỪ VỰNG: MẶT TRƯỚC HOẶC MẶT SAU */}
          <View style={styles.cardContentBox}>
            {!isFlipped ? (
              /* MẶT TRƯỚC: TỪ VỰNG TIẾNG ANH & PHIÊN ÂM IPA */
              <>
                <Text
                  style={[
                    styles.primaryWord,
                    isLight ? styles.primaryWordLight : styles.primaryWordDark,
                    isCompact && styles.primaryWordCompact,
                  ]}
                  numberOfLines={1}
                >
                  {langMode === 'vi' ? card.vietnamese : card.english}
                </Text>

                {langMode !== 'vi' && (
                  <Text style={[styles.ipaText, isLight && styles.ipaTextLight]}>
                    {card.ipa}
                  </Text>
                )}

                {langMode === 'bilingual' && (
                  <Text
                    style={[
                      styles.bilingualMeaning,
                      isLight ? styles.bilingualMeaningLight : styles.bilingualMeaningDark,
                    ]}
                  >
                    🇻🇳 {card.vietnamese}
                  </Text>
                )}

                {/* VÍ DỤ MINH HỌA */}
                <View
                  style={[
                    styles.exampleBubble,
                    isCompact && styles.exampleBubbleCompact,
                    isLight ? styles.exampleBubbleLight : styles.exampleBubbleDark,
                  ]}
                >
                  <Text
                    style={[
                      styles.exampleText,
                      isLight ? styles.exampleTextLight : styles.exampleTextDark,
                    ]}
                    numberOfLines={isCompact ? 1 : 2}
                  >
                    💬 {langMode === 'vi' ? card.exampleVi : card.exampleEn}
                  </Text>
                </View>
              </>
            ) : (
              /* MẶT SAU: NGHĨA TIẾNG VIỆT CHI TIẾT & SONG NGỮ */
              <>
                <Text
                  style={[
                    styles.primaryWordBack,
                    isLight ? styles.primaryWordBackLight : styles.primaryWordBackDark,
                    isCompact && styles.primaryWordCompact,
                  ]}
                >
                  {card.vietnamese}
                </Text>

                <Text
                  style={[
                    styles.subWordBack,
                    isLight ? styles.subWordBackLight : styles.subWordBackDark,
                  ]}
                >
                  🇬🇧 {card.english} ({card.ipa})
                </Text>

                <View
                  style={[
                    styles.exampleBubbleBack,
                    isCompact && styles.exampleBubbleCompact,
                    isLight ? styles.exampleBubbleBackLight : styles.exampleBubbleBackDark,
                  ]}
                >
                  <Text
                    style={[
                      styles.exampleText,
                      isLight ? styles.exampleTextBackLight : styles.exampleTextBackDark,
                    ]}
                    numberOfLines={1}
                  >
                    💬 {card.exampleVi}
                  </Text>
                  <Text
                    style={[
                      styles.exampleText,
                      { color: isLight ? '#0369A1' : '#38BDF8', marginTop: 2 },
                    ]}
                    numberOfLines={1}
                  >
                    ✨ {card.exampleEn}
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* FOOTER: KIẾN THỨC THÚ VỊ (FUN FACT) & NÚT ĐỌC CHẬM */}
          <View style={[styles.cardFooter, isLight && styles.cardFooterLight]}>
            <Text
              style={[
                styles.funFactText,
                isLight ? styles.funFactTextLight : styles.funFactTextDark,
              ]}
              numberOfLines={isCompact ? 1 : 2}
            >
              💡 {card.funFact}
            </Text>

            <View style={styles.footerActionRow}>
              <TouchableOpacity
                style={[
                  styles.slowSpeechBtn,
                  isLight ? styles.slowSpeechBtnLight : styles.slowSpeechBtnDark,
                ]}
                onPress={speakEnglishSlow}
                activeOpacity={0.8}
              >
                <Text style={styles.slowSpeechText}>🐌 Đọc chậm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardOuterWrapper: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedCardContainer: {
    width: '100%',
    height: '100%',
  },
  cardBase: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
    borderWidth: 3.5,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  cardBaseCompact: {
    borderRadius: 20,
    borderWidth: 2.5,
    padding: 9,
  },
  cardBaseDark: {
    backgroundColor: '#1E293B',
  },
  cardBaseLight: {
    backgroundColor: '#FFFFFF',
    shadowOpacity: 0.12,
  },
  cardBackDark: {
    backgroundColor: '#1E1B4B',
  },
  cardBackLight: {
    backgroundColor: '#FFFBEB',
  },
  legendaryGlow: {
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 14,
  },
  rareGlow: {
    borderColor: '#A855F7',
    shadowColor: '#A855F7',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 12,
  },
  holographicGlare: {
    position: 'absolute',
    top: -50,
    bottom: -50,
    width: 90,
    zIndex: 10,
    borderRadius: 45,
  },
  legendaryGlare: {
    backgroundColor: 'rgba(255, 215, 0, 0.22)',
  },
  rareGlare: {
    backgroundColor: 'rgba(192, 132, 252, 0.2)',
  },
  cardHeaderTag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  rarityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rarityText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  flipHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flipHintText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  stageWrapper: {
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  stageWrapperCompact: {
    marginVertical: 1,
  },
  visualBox3D: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    borderWidth: 2.5,
    position: 'relative',
  },
  visualBoxDark: {
    backgroundColor: '#0F172A',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  visualBoxLight: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  visualBoxLegendary: {
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  image3DRender: {
    width: '85%',
    height: '85%',
  },
  cardEmoji: {
    fontSize: 72,
  },
  sfxBadge: {
    position: 'absolute',
    bottom: -6,
    backgroundColor: '#0284C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  sfxBadgeCompact: {
    bottom: -3,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  sfxBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  cardContentBox: {
    alignItems: 'center',
    width: '100%',
  },
  primaryWord: {
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
  },
  primaryWordCompact: {
    fontSize: 21,
  },
  primaryWordDark: {
    color: '#FFFFFF',
  },
  primaryWordLight: {
    color: '#0F172A',
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
  bilingualMeaning: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  bilingualMeaningDark: {
    color: '#34D399',
  },
  bilingualMeaningLight: {
    color: '#059669',
  },
  primaryWordBack: {
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
  },
  primaryWordBackDark: {
    color: '#FDE047',
  },
  primaryWordBackLight: {
    color: '#B45309',
  },
  subWordBack: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  subWordBackDark: {
    color: '#C7D2FE',
  },
  subWordBackLight: {
    color: '#475569',
  },
  exampleBubble: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 6,
    width: '100%',
    borderWidth: 1,
  },
  exampleBubbleCompact: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 3,
    borderRadius: 8,
  },
  exampleBubbleDark: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
  },
  exampleBubbleLight: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  exampleBubbleBack: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 6,
    width: '100%',
    borderWidth: 1,
  },
  exampleBubbleBackDark: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
  },
  exampleBubbleBackLight: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  exampleText: {
    fontSize: 11.5,
    textAlign: 'center',
    fontWeight: '600',
  },
  exampleTextDark: {
    color: '#F1F5F9',
  },
  exampleTextLight: {
    color: '#1E293B',
  },
  exampleTextBackDark: {
    color: '#FEF3C7',
  },
  exampleTextBackLight: {
    color: '#92400E',
  },
  cardFooter: {
    width: '100%',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardFooterLight: {
    borderTopColor: '#E2E8F0',
  },
  funFactText: {
    fontSize: 10,
    lineHeight: 14,
    flex: 1,
    paddingRight: 6,
  },
  funFactTextDark: {
    color: '#94A3B8',
  },
  funFactTextLight: {
    color: '#64748B',
  },
  footerActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slowSpeechBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  slowSpeechBtnDark: {
    backgroundColor: '#334155',
    borderColor: '#475569',
  },
  slowSpeechBtnLight: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  slowSpeechText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38BDF8',
  },
});
