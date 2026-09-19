export const COLORS = {
  bgDark: '#090d16',
  surfaceDark: '#0f172a',
  cardDark: '#131d34',
  cardBorder: '#1e293b',
  cardBorderHover: '#334155',

  primary: '#6366f1', // Indigo
  primaryLight: '#818cf8',
  primaryDark: '#4338ca',

  accentPink: '#ec4899',
  accentEmerald: '#10b981',
  accentAmber: '#f59e0b',
  accentSky: '#0284c7',
  accentRose: '#f43f5e',

  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',

  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  }),
};
