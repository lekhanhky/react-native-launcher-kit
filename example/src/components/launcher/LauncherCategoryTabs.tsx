import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  LAUNCHER_CATEGORY_TABS,
  LauncherCategoryType,
} from '../../data/launcherGamesRegistry';
import { ThemeConfig } from '../../services/themes';

interface LauncherCategoryTabsProps {
  selectedCategory: LauncherCategoryType;
  onSelectCategory: (category: LauncherCategoryType) => void;
  theme: ThemeConfig;
}

export const LauncherCategoryTabs: React.FC<LauncherCategoryTabsProps> = ({
  selectedCategory,
  onSelectCategory,
  theme,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {LAUNCHER_CATEGORY_TABS.map((tab) => {
          const isSelected = selectedCategory === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabPill,
                isSelected
                  ? [styles.tabPillActive, { backgroundColor: tab.color }]
                  : [styles.tabPillInactive, { backgroundColor: 'rgba(255, 255, 255, 0.75)' }],
              ]}
              activeOpacity={0.8}
              onPress={() => onSelectCategory(tab.id)}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text
                style={[
                  styles.tabLabel,
                  isSelected ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  tabPillActive: {
    elevation: 4,
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tabPillInactive: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  tabIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  tabLabelActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  tabLabelInactive: {
    color: '#475569',
  },
});
