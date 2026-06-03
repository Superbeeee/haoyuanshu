import React, { useEffect, useCallback, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useStore } from './src/store';
import { resolveLanguage } from './src/i18n';
import { ensureFontsLoaded } from './src/theme/fonts';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ErrorBoundary } from './src/components/ErrorBoundary';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const hydrated = useStore((s) => s.hydrated);
  const hydrate = useStore((s) => s.hydrate);
  // 訂閱 language：切換語言時自動補載對應字型（按需載入）
  const language = useStore((s) => s.settings.language);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // hydrate 完成後才知道當前語言。始終載入繁中（漢字書法基底，供 Seal / 心經 / 品牌標題），
  // 再按需載入當前語言字型；語言變更時補載新字型。
  useEffect(() => {
    if (!hydrated) return;
    const lang = resolveLanguage(language);
    Promise.all([ensureFontsLoaded('zh'), ensureFontsLoaded(lang)])
      .then(() => setFontsLoaded(true))
      .catch(() => setFontsLoaded(true)); // 字型載入失敗仍放行，fallback 系統字型
  }, [hydrated, language]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && hydrated) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, hydrated]);

  if (!fontsLoaded || !hydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root} onLayout={onLayoutRootView}>
      <ErrorBoundary>
        <RootNavigator />
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5EFE1' },
});
