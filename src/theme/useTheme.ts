import { useStore } from '../store';
import { TOKENS, ThemeTokens } from './tokens';

export function useTheme() {
  const theme = useStore((s) => s.settings.theme);
  const T: ThemeTokens = TOKENS[theme];
  return { T, theme, dark: theme === 'dark' };
}
