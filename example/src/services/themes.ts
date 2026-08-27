/**
 * 5 Kids Theme System
 * Definition of theme styles, color palettes, and persistence helpers
 */
import { storage, STORAGE_KEYS } from './storage';

export type ThemeId = 'candy' | 'space' | 'safari' | 'ocean' | 'superhero';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  subtitle: string;
  emoji: string;
  previewColor: string;
  previewSecondary: string;

  // Background & Header
  backgroundColor: string;
  headerBg: string;
  headerBorderColor: string;
  greetingColor: string;
  subtitleColor: string;
  statusBarStyle: 'dark-content' | 'light-content';

  // App Grid & Cards
  cardBg: string;
  cardBorderColor: string;
  cardBorderWidth: number;
  cardShadowColor: string;
  appLabelColor: string;
  appLabelFontWeight: '600' | '700' | '800';

  // App Icon Styles
  iconBorderRadius: number;
  iconBorderWidth: number;
  iconBorderColor: string;
  iconPlaceholderBg: string;
  iconPlaceholderText: string;

  // Theme Action Button on Header
  themeBtnBg: string;
  themeBtnText: string;
  themeBtnBorder: string;

  // Parent Action Button on Header
  parentBtnBg: string;
  parentBtnText: string;
  parentBtnBorder: string;

  // Empty state & Badges
  emptyIcon: string;
  emptyTitleColor: string;
  emptySubtitleColor: string;
  accentBadgeColor: string;
}

export const KIDS_THEMES: Record<ThemeId, ThemeConfig> = {
  candy: {
    id: 'candy',
    name: 'Kẹo Ngọt Cầu Vồng',
    subtitle: 'Hồng pastel ngọt ngào, mềm mại & dễ thương',
    emoji: '🌈',
    previewColor: '#FDA4AF',
    previewSecondary: '#FFF1F2',

    backgroundColor: '#FFF1F2',
    headerBg: '#FFFFFF',
    headerBorderColor: '#FFE4E6',
    greetingColor: '#9F1239',
    subtitleColor: '#BE123C',
    statusBarStyle: 'dark-content',

    cardBg: '#FFFFFF',
    cardBorderColor: '#FECDD3',
    cardBorderWidth: 1.5,
    cardShadowColor: '#FDA4AF',
    appLabelColor: '#881337',
    appLabelFontWeight: '700',

    iconBorderRadius: 20,
    iconBorderWidth: 2,
    iconBorderColor: '#FDA4AF',
    iconPlaceholderBg: '#FB7185',
    iconPlaceholderText: '#FFFFFF',

    themeBtnBg: '#FFE4E6',
    themeBtnText: '#BE123C',
    themeBtnBorder: '#FDA4AF',

    parentBtnBg: '#FFF1F2',
    parentBtnText: '#9F1239',
    parentBtnBorder: '#FECDD3',

    emptyIcon: '🍭',
    emptyTitleColor: '#881337',
    emptySubtitleColor: '#9F1239',
    accentBadgeColor: '#F43F5E',
  },

  space: {
    id: 'space',
    name: 'Vũ Trụ Huyền Bí',
    subtitle: 'Màn đêm vô tận, neon sáng chói và phi thuyền',
    emoji: '🚀',
    previewColor: '#06B6D4',
    previewSecondary: '#0F172A',

    backgroundColor: '#0B0F19',
    headerBg: '#111827',
    headerBorderColor: '#1F2937',
    greetingColor: '#38BDF8',
    subtitleColor: '#94A3B8',
    statusBarStyle: 'light-content',

    cardBg: '#1E293B',
    cardBorderColor: '#0EA5E9',
    cardBorderWidth: 1.5,
    cardShadowColor: '#38BDF8',
    appLabelColor: '#F1F5F9',
    appLabelFontWeight: '600',

    iconBorderRadius: 14,
    iconBorderWidth: 2,
    iconBorderColor: '#38BDF8',
    iconPlaceholderBg: '#0284C7',
    iconPlaceholderText: '#FFFFFF',

    themeBtnBg: '#1E293B',
    themeBtnText: '#38BDF8',
    themeBtnBorder: '#0284C7',

    parentBtnBg: '#1F2937',
    parentBtnText: '#E2E8F0',
    parentBtnBorder: '#374151',

    emptyIcon: '🪐',
    emptyTitleColor: '#38BDF8',
    emptySubtitleColor: '#94A3B8',
    accentBadgeColor: '#06B6D4',
  },

  safari: {
    id: 'safari',
    name: 'Rừng Xanh Safari',
    subtitle: 'Thiên nhiên hoang dã, muông thú & cây cỏ',
    emoji: '🦁',
    previewColor: '#16A34A',
    previewSecondary: '#F0FDF4',

    backgroundColor: '#F0FDF4',
    headerBg: '#FFFFFF',
    headerBorderColor: '#DCFCE7',
    greetingColor: '#14532D',
    subtitleColor: '#15803D',
    statusBarStyle: 'dark-content',

    cardBg: '#FFFFFF',
    cardBorderColor: '#86EFAC',
    cardBorderWidth: 1.5,
    cardShadowColor: '#4ADE80',
    appLabelColor: '#14532D',
    appLabelFontWeight: '700',

    iconBorderRadius: 16,
    iconBorderWidth: 2,
    iconBorderColor: '#4ADE80',
    iconPlaceholderBg: '#16A34A',
    iconPlaceholderText: '#FFFFFF',

    themeBtnBg: '#DCFCE7',
    themeBtnText: '#15803D',
    themeBtnBorder: '#86EFAC',

    parentBtnBg: '#F0FDF4',
    parentBtnText: '#166534',
    parentBtnBorder: '#BBF7D0',

    emptyIcon: '🐾',
    emptyTitleColor: '#14532D',
    emptySubtitleColor: '#166534',
    accentBadgeColor: '#16A34A',
  },

  ocean: {
    id: 'ocean',
    name: 'Đại Dương Kỳ Thú',
    subtitle: 'Xanh mát biển sâu, bọt sóng & cá heo',
    emoji: '🌊',
    previewColor: '#0284C7',
    previewSecondary: '#F0F9FF',

    backgroundColor: '#F0F9FF',
    headerBg: '#FFFFFF',
    headerBorderColor: '#E0F2FE',
    greetingColor: '#0369A1',
    subtitleColor: '#0284C7',
    statusBarStyle: 'dark-content',

    cardBg: '#FFFFFF',
    cardBorderColor: '#7DD3FC',
    cardBorderWidth: 1.5,
    cardShadowColor: '#38BDF8',
    appLabelColor: '#0C4A6E',
    appLabelFontWeight: '700',

    iconBorderRadius: 24,
    iconBorderWidth: 2,
    iconBorderColor: '#38BDF8',
    iconPlaceholderBg: '#0284C7',
    iconPlaceholderText: '#FFFFFF',

    themeBtnBg: '#E0F2FE',
    themeBtnText: '#0284C7',
    themeBtnBorder: '#7DD3FC',

    parentBtnBg: '#F0F9FF',
    parentBtnText: '#0369A1',
    parentBtnBorder: '#BAE6FD',

    emptyIcon: '🐬',
    emptyTitleColor: '#0369A1',
    emptySubtitleColor: '#0284C7',
    accentBadgeColor: '#0EA5E9',
  },

  superhero: {
    id: 'superhero',
    name: 'Siêu Anh Hùng',
    subtitle: 'Năng lượng bùng nổ, đỏ & vàng phong cách truyện tranh',
    emoji: '⚡',
    previewColor: '#DC2626',
    previewSecondary: '#FEF9C3',

    backgroundColor: '#FEF9C3',
    headerBg: '#FFFFFF',
    headerBorderColor: '#FDE047',
    greetingColor: '#991B1B',
    subtitleColor: '#B91C1C',
    statusBarStyle: 'dark-content',

    cardBg: '#FFFFFF',
    cardBorderColor: '#DC2626',
    cardBorderWidth: 2,
    cardShadowColor: '#EF4444',
    appLabelColor: '#7F1D1D',
    appLabelFontWeight: '800',

    iconBorderRadius: 12,
    iconBorderWidth: 2.5,
    iconBorderColor: '#DC2626',
    iconPlaceholderBg: '#DC2626',
    iconPlaceholderText: '#FEF08A',

    themeBtnBg: '#FEE2E2',
    themeBtnText: '#DC2626',
    themeBtnBorder: '#FCA5A5',

    parentBtnBg: '#FEF9C3',
    parentBtnText: '#991B1B',
    parentBtnBorder: '#FDE047',

    emptyIcon: '🦸',
    emptyTitleColor: '#7F1D1D',
    emptySubtitleColor: '#991B1B',
    accentBadgeColor: '#DC2626',
  },
};

export const DEFAULT_THEME_ID: ThemeId = 'candy';

export const themeService = {
  getSavedTheme(): ThemeConfig {
    try {
      const savedId = storage.getString(STORAGE_KEYS.CURRENT_THEME) as ThemeId;
      if (savedId && KIDS_THEMES[savedId]) {
        return KIDS_THEMES[savedId];
      }
    } catch (e) {
      console.warn('Error reading saved theme:', e);
    }
    return KIDS_THEMES[DEFAULT_THEME_ID];
  },

  saveTheme(themeId: ThemeId): ThemeConfig {
    const selected = KIDS_THEMES[themeId] || KIDS_THEMES[DEFAULT_THEME_ID];
    try {
      storage.set(STORAGE_KEYS.CURRENT_THEME, selected.id);
    } catch (e) {
      console.warn('Error saving theme:', e);
    }
    return selected;
  },

  getAllThemes(): ThemeConfig[] {
    return Object.values(KIDS_THEMES);
  },
};
