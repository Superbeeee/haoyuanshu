// 設計 token — 禪意素雅 palette
export const TOKENS = {
  light: {
    bg: '#F5EFE1',
    bgElevated: '#FBF6E9',
    bgSunken: '#EDE4D0',
    ink: '#1a1612',
    inkSoft: '#3d352a',
    inkMuted: 'rgba(26, 22, 18, 0.55)',
    inkFaint: 'rgba(26, 22, 18, 0.28)',
    hairline: 'rgba(26, 22, 18, 0.1)',
    hairlineStrong: 'rgba(26, 22, 18, 0.18)',
    vermilion: '#A3321F',
    vermilionSoft: '#C5543C',
    gold: '#B8933C',
    goldSoft: '#D4B46A',
    sage: '#6B7A5A',
    wood: '#8B6F47',
    woodDeep: '#5C4328',
  },
  dark: {
    bg: '#181410',
    bgElevated: '#221C16',
    bgSunken: '#0F0C08',
    ink: '#EDE4D0',
    inkSoft: '#C9BFA7',
    inkMuted: 'rgba(237, 228, 208, 0.6)',
    inkFaint: 'rgba(237, 228, 208, 0.3)',
    hairline: 'rgba(237, 228, 208, 0.1)',
    hairlineStrong: 'rgba(237, 228, 208, 0.2)',
    vermilion: '#D46A4E',
    vermilionSoft: '#C5543C',
    gold: '#D4B46A',
    goldSoft: '#E8CD8B',
    sage: '#A4B08E',
    wood: '#A88560',
    woodDeep: '#7A5C3C',
  },
} as const;

export type ThemeTokens = {
  bg: string;
  bgElevated: string;
  bgSunken: string;
  ink: string;
  inkSoft: string;
  inkMuted: string;
  inkFaint: string;
  hairline: string;
  hairlineStrong: string;
  vermilion: string;
  vermilionSoft: string;
  gold: string;
  goldSoft: string;
  sage: string;
  wood: string;
  woodDeep: string;
};

// 字體名稱常數
export const FONT_SERIF = 'NotoSerifTC_400Regular';
export const FONT_SERIF_MEDIUM = 'NotoSerifTC_500Medium';
export const FONT_SANS = 'System';
