import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/useTheme';

// 宣紙漸層背景，使用純 View 模擬
// React Native 不支援 CSS radial-gradient，以米色半透明 View 替代
export function PaperBg() {
  const { T, dark } = useTheme();
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: T.bg,
        },
      ]}
      pointerEvents="none"
    >
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: dark
              ? 'rgba(200,170,130,0.04)'
              : 'rgba(139,115,85,0.06)',
          },
        ]}
      />
    </View>
  );
}
