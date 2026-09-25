import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { ThemeConfig } from '../../services/themes';

interface LauncherHeaderProps {
  theme: ThemeConfig;
  remainingMinutes?: number | null;
  starsCount?: number;
  onOpenThemeModal: () => void;
  onOpenParentGate: () => void;
  onSecretParentTap: () => void;
}

export const LauncherHeader: React.FC<LauncherHeaderProps> = ({
  theme,
  remainingMinutes,
  starsCount = 125,
  onOpenThemeModal,
  onOpenParentGate,
  onSecretParentTap,
}) => {
  const isTimeWarning = remainingMinutes !== null && remainingMinutes !== undefined && remainingMinutes <= 10;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.headerBg,
          borderBottomColor: theme.headerBorderColor,
        },
      ]}
    >
      {/* 1. KHỐI AVATAR & LỜI CHÀO BÉ */}
      <TouchableOpacity
        style={styles.greetingContainer}
        activeOpacity={0.8}
        onPress={onSecretParentTap}
      >
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>{theme.emoji || '👦'}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text
            style={[styles.greetingText, { color: theme.greetingColor }]}
            numberOfLines={1}
          >
            Chào bé yêu!
          </Text>
          <Text
            style={[styles.subtitleText, { color: theme.subtitleColor }]}
            numberOfLines={1}
          >
            {theme.name}
          </Text>
        </View>
      </TouchableOpacity>

      {/* 2. KHỐI TIỆN ÍCH TRẺ EM (WIDGETS) & NÚT ĐIỀU HƯỚNG */}
      <View style={styles.actionsRow}>
        {/* Widget Sao Thưởng */}
        <View style={styles.starBadge}>
          <Text style={styles.starIcon}>⭐</Text>
          <Text style={styles.starText}>{starsCount}</Text>
        </View>

        {/* Widget Thời Gian Còn Lại */}
        {remainingMinutes !== null && remainingMinutes !== undefined && (
          <View
            style={[
              styles.timeBadge,
              isTimeWarning && styles.timeBadgeWarning,
            ]}
          >
            <Text style={styles.timeIcon}>⏳</Text>
            <Text
              style={[
                styles.timeText,
                isTimeWarning && styles.timeTextWarning,
              ]}
            >
              {remainingMinutes > 0 ? `${remainingMinutes}p` : 'Hết giờ'}
            </Text>
          </View>
        )}

        {/* Nút Đổi Giao Diện (Theme) */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: theme.themeBtnBg,
              borderColor: theme.themeBtnBorder,
            },
          ]}
          activeOpacity={0.75}
          onPress={onOpenThemeModal}
        >
          <Text style={styles.actionButtonText}>🎨</Text>
        </TouchableOpacity>

        {/* Nút Chế Độ Phụ Huynh (Parent Lock) */}
        <TouchableOpacity
          style={[styles.actionButton, styles.parentLockBtn]}
          activeOpacity={0.75}
          onPress={onOpenParentGate}
        >
          <Text style={styles.actionButtonText}>🔒</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    zIndex: 10,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  starIcon: {
    fontSize: 13,
    marginRight: 3,
  },
  starText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  timeBadgeWarning: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  timeIcon: {
    fontSize: 12,
    marginRight: 3,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  timeTextWarning: {
    color: '#D97706',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  parentLockBtn: {
    backgroundColor: '#EDE9FE',
    borderColor: '#DDD6FE',
  },
  actionButtonText: {
    fontSize: 16,
  },
});
