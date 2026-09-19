import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { COLORS, SHADOWS } from '../styles/theme';

interface ModuleHubCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  accentColor?: string;
  onPress: () => void;
}

export const ModuleHubCard: React.FC<ModuleHubCardProps> = ({
  title,
  subtitle,
  icon,
  badge,
  badgeColor = COLORS.accentPink,
  accentColor = COLORS.primary,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, SHADOWS.sm]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: `${accentColor}25`, borderColor: `${accentColor}40` },
          ]}
        >
          {icon}
        </View>
        {badge && (
          <View
            style={[
              styles.badge,
              { backgroundColor: `${badgeColor}20`, borderColor: `${badgeColor}50` },
            ]}
          >
            <Text style={[styles.badgeText, { color: badgeColor }]}>{badge}</Text>
          </View>
        )}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {subtitle}
        </Text>
      </View>

      <View style={styles.bottomRow}>
        <Text style={[styles.actionText, { color: accentColor }]}>Truy cập</Text>
        <ChevronRight size={16} color={accentColor} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: COLORS.cardDark,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 14,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  infoSection: {
    marginBottom: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: `${COLORS.cardBorder}80`,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
