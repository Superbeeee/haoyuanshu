import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useStore } from '../store';
import { useTheme } from '../theme/useTheme';
import { TOKENS } from '../theme/tokens';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { PlanNavigator } from './PlanNavigator';
import { DailyNavigator } from './DailyNavigator';

export function RootNavigator() {
  const appMode = useStore((s) => s.settings.appMode);
  const { theme } = useTheme();
  const T = TOKENS[theme];

  const navTheme = {
    dark: theme === 'dark',
    colors: {
      primary: T.vermilion,
      background: T.bg,
      card: T.bgElevated,
      text: T.ink,
      border: T.hairline,
      notification: T.vermilion,
    },
    fonts: {
      regular: { fontFamily: 'System', fontWeight: '400' as const },
      medium: { fontFamily: 'System', fontWeight: '500' as const },
      bold: { fontFamily: 'System', fontWeight: '700' as const },
      heavy: { fontFamily: 'System', fontWeight: '900' as const },
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      {appMode === null && <OnboardingScreen />}
      {appMode === 'plan' && <PlanNavigator />}
      {appMode === 'daily' && <DailyNavigator />}
    </NavigationContainer>
  );
}
