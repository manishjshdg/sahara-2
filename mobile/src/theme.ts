// SAHARA Mobile Theme & Design Tokens
// Trauma-informed, calm, trustworthy aesthetic with high contrast support

export interface ThemePalette {
  bgPrimary: string;
  bgSecondary: string;
  bgCard: string;
  bgCardHover: string;
  bgInput: string;

  accentTeal: string;
  accentTealSoft: string;
  accentSage: string;
  accentSageSoft: string;
  accentAmber: string;
  accentAmberSoft: string;
  accentRose: string;
  accentRoseSoft: string;
  accentBlue: string;
  accentPurple: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textLight: string;

  borderSubtle: string;
  borderActive: string;
}

const standardPalette: ThemePalette = {
  bgPrimary: '#0b1118',
  bgSecondary: '#131c26',
  bgCard: '#16212e',
  bgCardHover: '#1e2c3d',
  bgInput: '#0f1722',

  accentTeal: '#14b8a6',
  accentTealSoft: 'rgba(20, 184, 166, 0.15)',
  accentSage: '#10b981',
  accentSageSoft: 'rgba(16, 185, 129, 0.15)',
  accentAmber: '#f59e0b',
  accentAmberSoft: 'rgba(245, 158, 11, 0.15)',
  accentRose: '#f43f5e',
  accentRoseSoft: 'rgba(244, 63, 94, 0.18)',
  accentBlue: '#38bdf8',
  accentPurple: '#a855f7',

  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  textLight: '#cbd5e1',

  borderSubtle: 'rgba(148, 163, 184, 0.14)',
  borderActive: 'rgba(20, 184, 166, 0.45)',
};

const highContrastPalette: ThemePalette = {
  bgPrimary: '#000000',
  bgSecondary: '#111111',
  bgCard: '#181818',
  bgCardHover: '#242424',
  bgInput: '#141414',

  accentTeal: '#00ffff',
  accentTealSoft: 'rgba(0, 255, 255, 0.25)',
  accentSage: '#00ff66',
  accentSageSoft: 'rgba(0, 255, 102, 0.25)',
  accentAmber: '#ffff00',
  accentAmberSoft: 'rgba(255, 255, 0, 0.25)',
  accentRose: '#ff0055',
  accentRoseSoft: 'rgba(255, 0, 85, 0.25)',
  accentBlue: '#00ccff',
  accentPurple: '#e066ff',

  textPrimary: '#ffffff',
  textSecondary: '#e2e8f0',
  textMuted: '#cbd5e1',
  textLight: '#ffffff',

  borderSubtle: '#ffffff',
  borderActive: '#00ffff',
};

export const theme = {
  colors: standardPalette,
  highContrast: highContrastPalette,
  radius: {
    sm: 8,
    md: 14,
    lg: 20,
    full: 9999,
  }
};
