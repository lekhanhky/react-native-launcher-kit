import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { LauncherGameItem } from '../../data/launcherGamesRegistry';
import type { AppDetail } from 'react-native-launcher-kit/src/interfaces/InstalledApps';
import { ThemeConfig } from '../../services/themes';

interface LauncherGameCardProps {
  game?: LauncherGameItem;
  externalApp?: AppDetail;
  onPress: () => void;
  theme: ThemeConfig;
  cardWidth: number;
}

export const LauncherGameCard: React.FC<LauncherGameCardProps> = ({
  game,
  externalApp,
  onPress,
  theme,
  cardWidth,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 25,
      bounciness: 8,
    }).start();
  };

  // --- TRƯỜNG HỢP 1: TRÒ CHƠI NỘI BỘ (INTERNAL GAME) ---
  if (game) {
    const primaryColor = game.gradientColors[0];
    return (
      <Animated.View style={[{ width: cardWidth }, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          style={[
            styles.cardContainer,
            {
              backgroundColor: '#FFFFFF',
              borderColor: 'rgba(0, 0, 0, 0.06)',
            },
          ]}
          activeOpacity={0.9}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={onPress}
        >
          {/* Huy hiệu góc nếu có */}
          {!!game.badge && (
            <View style={[styles.cornerBadge, { backgroundColor: game.badgeBg || primaryColor }]}>
              <Text style={styles.cornerBadgeText}>{game.badge}</Text>
            </View>
          )}

          {/* ĐĨA ĐỆM CHỨA ICON NỔI KHỐI */}
          <View style={[styles.iconDish, { backgroundColor: primaryColor }]}>
            <Text style={styles.iconEmoji}>{game.iconEmoji}</Text>
          </View>

          {/* TIÊU ĐỀ TRÒ CHƠI */}
          <Text
            style={[styles.titleText, { color: theme.appLabelColor }]}
            numberOfLines={1}
          >
            {game.title}
          </Text>

          {/* SAO ĐÁNH GIÁ NHỎ */}
          <Text style={styles.starsRow}>
            {'★'.repeat(game.rating || 4)}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // --- TRƯỜNG HỢP 2: ỨNG DỤNG BÊN NGOÀI ĐƯỢC PHÉP (EXTERNAL ALLOWED APP) ---
  if (externalApp) {
    const iconUri =
      externalApp.icon?.startsWith('file://') ||
      externalApp.icon?.startsWith('data:') ||
      externalApp.icon?.startsWith('http')
        ? externalApp.icon
        : externalApp.icon
        ? `data:image/png;base64,${externalApp.icon}`
        : null;

    return (
      <Animated.View style={[{ width: cardWidth }, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          style={[
            styles.cardContainer,
            {
              backgroundColor: '#FFFFFF',
              borderColor: 'rgba(0, 0, 0, 0.06)',
            },
          ]}
          activeOpacity={0.9}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={onPress}
        >
          <View style={[styles.cornerBadge, { backgroundColor: '#3B82F6' }]}>
            <Text style={styles.cornerBadgeText}>APP</Text>
          </View>

          {/* ICON ỨNG DỤNG ANDROID */}
          {iconUri ? (
            <Image
              source={{ uri: iconUri }}
              style={styles.externalAppIcon}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.iconDish, { backgroundColor: '#F1F5F9' }]}>
              <Text style={styles.iconEmoji}>📱</Text>
            </View>
          )}

          {/* TÊN ỨNG DỤNG */}
          <Text
            style={[styles.titleText, { color: theme.appLabelColor }]}
            numberOfLines={1}
          >
            {externalApp.label}
          </Text>

          <View style={styles.starsRow}>
            <Text style={styles.appTypeTag}>Android App</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: 6,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    position: 'relative',
    overflow: 'hidden',
  },
  cornerBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
    zIndex: 2,
  },
  cornerBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  iconDish: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 3,
  },
  externalAppIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    marginBottom: 8,
  },
  iconEmoji: {
    fontSize: 28,
  },
  titleText: {
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 2,
  },
  starsRow: {
    color: '#F59E0B',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 1,
  },
  appTypeTag: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
  },
});
