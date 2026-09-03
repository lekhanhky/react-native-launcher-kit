import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
  StyleProp,
  View,
} from 'react-native';

export type ThemeMode = 'dark' | 'light';

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggle: (newTheme: ThemeMode) => void;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onToggle,
  style,
  compact = false,
}) => {
  const isLight = theme === 'light';
  const slideAnim = useRef(new Animated.Value(isLight ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isLight ? 1 : 0,
      friction: 6,
      tension: 50,
      useNativeDriver: false,
    }).start();
  }, [isLight, slideAnim]);

  const handlePress = () => {
    const nextTheme: ThemeMode = isLight ? 'dark' : 'light';
    onToggle(nextTheme);
  };

  const indicatorLeft = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, compact ? 30 : 44],
  });

  const activeBgColor = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#312E81', '#F59E0B'],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      style={[
        styles.container,
        compact ? styles.containerCompact : styles.containerNormal,
        isLight ? styles.containerLight : styles.containerDark,
        style,
      ]}
    >
      {/* Sliding Active Pill */}
      <Animated.View
        style={[
          styles.activePill,
          compact ? styles.activePillCompact : styles.activePillNormal,
          {
            left: indicatorLeft,
            backgroundColor: activeBgColor,
          },
        ]}
      />

      {/* Moon / Dark Icon */}
      <View style={[styles.optionItem, compact ? styles.optionCompact : styles.optionNormal]}>
        <Text style={[styles.iconText, compact && styles.iconCompact]}>🌙</Text>
        {!compact && (
          <Text style={[styles.labelText, !isLight && styles.labelActive]}>
            Tối
          </Text>
        )}
      </View>

      {/* Sun / Light Icon */}
      <View style={[styles.optionItem, compact ? styles.optionCompact : styles.optionNormal]}>
        <Text style={[styles.iconText, compact && styles.iconCompact]}>☀️</Text>
        {!compact && (
          <Text style={[styles.labelText, isLight && styles.labelActive]}>
            Sáng
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1.5,
    position: 'relative',
    overflow: 'hidden',
  },
  containerNormal: {
    height: 34,
    width: 92,
    paddingHorizontal: 2,
  },
  containerCompact: {
    height: 30,
    width: 64,
    paddingHorizontal: 2,
  },
  containerDark: {
    backgroundColor: '#1E1B4B',
    borderColor: '#4338CA',
  },
  containerLight: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  activePill: {
    position: 'absolute',
    borderRadius: 16,
    zIndex: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
  activePillNormal: {
    width: 44,
    height: 28,
  },
  activePillCompact: {
    width: 30,
    height: 24,
  },
  optionItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    gap: 3,
  },
  optionNormal: {
    height: 30,
  },
  optionCompact: {
    height: 26,
  },
  iconText: {
    fontSize: 13,
  },
  iconCompact: {
    fontSize: 12,
  },
  labelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  labelActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
});
