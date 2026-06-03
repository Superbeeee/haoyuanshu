import { useStore } from '../store';
import { TOKENS, TRACKING, type Theme } from './tokens';
import { LANG_FONTS } from './fonts';
import { resolveLanguage, type Language } from '../i18n';

export function useTheme() {
  const theme = useStore((s) => s.settings.theme);
  // 訂閱 language：語言切換時，所有使用 useTheme 的元件會 re-render（字型 / 字距 / t() 同步更新）
  const language = useStore((s) => s.settings.language);
  const lang: Language = resolveLanguage(language);
  const fonts = LANG_FONTS[lang];

  const T: Theme = {
    ...TOKENS[theme],
    fontSerif: fonts.regular,
    fontSerifMedium: fonts.medium,
    tracking: lang === 'en' ? TRACKING.latin : TRACKING.cjk,
  };

  return { T, theme, dark: theme === 'dark', language: lang };
}
