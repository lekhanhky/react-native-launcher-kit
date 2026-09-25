import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { HERO_FEATURED_GAMES } from '../../data/launcherGamesRegistry';

interface LauncherHeroBannerProps {
  onLaunchGame: (gameId: string) => void;
  disabledGameIds?: string[];
}

export const LauncherHeroBanner: React.FC<LauncherHeroBannerProps> = ({
  onLaunchGame,
  disabledGameIds,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const allowedFeaturedGames = useMemo(() => {
    const list = HERO_FEATURED_GAMES.filter(
      (g) => !disabledGameIds || !disabledGameIds.includes(g.id)
    );
    return list;
  }, [disabledGameIds]);

  // Lặp chu kỳ đổi game nổi bật mỗi 12 giây
  useEffect(() => {
    if (allowedFeaturedGames.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allowedFeaturedGames.length);
    }, 12000);
    return () => clearInterval(timer);
  }, [allowedFeaturedGames.length]);

  // Animation nảy nhẹ cho nút Chơi Ngay
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  if (allowedFeaturedGames.length === 0) {
    return null;
  }

  const featured = allowedFeaturedGames[currentIndex % allowedFeaturedGames.length];

  return (
    <View style={styles.outerContainer}>
      <View
        style={[
          styles.bannerCard,
          { backgroundColor: featured.colors[0] },
        ]}
      >
        {/* HỌA TIẾT NỀN BONG BÓNG MỜ */}
        <View style={styles.bubbleDecor1} />
        <View style={styles.bubbleDecor2} />

        {/* NỘI DUNG CHÍNH */}
        <View style={styles.contentRow}>
          {/* CỘT TRÁI: THÔNG TIN NHIỆM VỤ */}
          <View style={styles.infoCol}>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{featured.badge}</Text>
              </View>
            </View>

            <Text style={styles.titleText} numberOfLines={1}>
              {featured.title}
            </Text>

            <Text style={styles.questText} numberOfLines={2}>
              {featured.quest}
            </Text>

            {/* Nút Chơi Ngay Kêu Gọi Hành Động */}
            <Animated.View style={{ transform: [{ scale: pulseAnim }], alignSelf: 'flex-start' }}>
              <TouchableOpacity
                style={styles.playButton}
                activeOpacity={0.85}
                onPress={() => onLaunchGame(featured.id)}
              >
                <Text style={styles.playButtonText}>CHƠI NGAY ▶</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* CỘT PHẢI: ICON / HÌNH ẢNH 3D NỔI BẬT */}
          <TouchableOpacity
            style={styles.iconCol}
            activeOpacity={0.85}
            onPress={() => onLaunchGame(featured.id)}
          >
            <View style={styles.emojiDisc}>
              <Text style={styles.emojiText}>{featured.emoji}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* CHỈ BÁO TRANG (DOT INDICATORS) */}
        <View style={styles.dotsRow}>
          {HERO_FEATURED_GAMES.map((_, idx) => (
            <TouchableOpacity
              key={`dot_${idx}`}
              onPress={() => setCurrentIndex(idx)}
              style={[
                styles.dot,
                idx === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
  },
  bannerCard: {
    borderRadius: 22,
    padding: 14,
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  bubbleDecor1: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  bubbleDecor2: {
    position: 'absolute',
    bottom: -30,
    left: '40%',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoCol: {
    flex: 1,
    paddingRight: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  questText: {
    color: '#FFF7ED',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    marginBottom: 10,
  },
  playButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  playButtonText: {
    color: '#1E293B',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  iconCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiDisc: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
  emojiText: {
    fontSize: 36,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  dotActive: {
    width: 16,
    backgroundColor: '#FFFFFF',
  },
});
