import React, { useEffect, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  NotoSerifTC_400Regular,
  NotoSerifTC_500Medium,
} from '@expo-google-fonts/noto-serif-tc';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useStore } from './src/store';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ErrorBoundary } from './src/components/ErrorBoundary';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const hydrated = useStore((s) => s.hydrated);
  const hydrate = useStore((s) => s.hydrate);

  const [fontsLoaded] = useFonts({
    NotoSerifTC_400Regular,
    NotoSerifTC_500Medium,
  });

  useEffect(() => {
    hydrate();
  }, [hydrate]);

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
