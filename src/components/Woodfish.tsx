import React, { useCallback, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Animated } from 'react-native';
import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import { useTheme } from '../theme/useTheme';
import { t } from '../i18n';

const woodfishImg = require('../../assets/woodfish-cutout.png');
const woodfishWav = require('../../assets/woodfish.wav');

type Props = {
  size?: number;
  muted?: boolean;
};

// 漣漪池：3 個漣漪輪流使用，連續快點不會卡住
const RIPPLE_COUNT = 3;
const RIPPLE_DURATION = 650;

export function Woodfish({ size = 220, muted = false }: Props) {
  const { dark } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const ripples = useRef(
    Array.from({ length: RIPPLE_COUNT }, () => ({
      scale: new Animated.Value(0.35),
      opacity: new Animated.Value(0),
    }))
  ).current;
  const rippleIdx = useRef(0);

  const soundRef = useRef<AudioPlayer | null>(null);

  // 卸載時釋放音訊資源
  useEffect(() => {
    return () => {
      soundRef.current?.remove();
      soundRef.current = null;
    };
  }, []);

  const loadAndPlay = useCallback(() => {
    if (muted) return;
    try {
      if (!soundRef.current) {
        soundRef.current = createAudioPlayer(woodfishWav);
      }
      // 從頭播放，連續快點時打斷前一聲重來
      soundRef.current.seekTo(0);
      soundRef.current.play();
    } catch {}
  }, [muted]);

  const handlePress = useCallback(() => {
    // 縮放脈衝（短促不阻塞）
    scaleAnim.stopAnimation();
    scaleAnim.setValue(0.94);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 180,
      useNativeDriver: true,
    }).start();

    // 光暈閃爍
    glowAnim.stopAnimation();
    glowAnim.setValue(1);
    Animated.timing(glowAnim, {
      toValue: 0,
      duration: 280,
      useNativeDriver: true,
    }).start();

    // 從池子挑下一個漣漪（即使前一個還沒結束也沒關係）
    const r = ripples[rippleIdx.current];
    rippleIdx.current = (rippleIdx.current + 1) % RIPPLE_COUNT;
    r.scale.stopAnimation();
    r.opacity.stopAnimation();
    r.scale.setValue(0.35);
    r.opacity.setValue(0.9);
    Animated.parallel([
      Animated.timing(r.scale, {
        toValue: 2.2,
        duration: RIPPLE_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(r.opacity, {
        toValue: 0,
        duration: RIPPLE_DURATION,
        useNativeDriver: true,
      }),
    ]).start();

    loadAndPlay();
  }, [loadAndPlay, scaleAnim, glowAnim, ripples]);

  const rippleColor = dark
    ? 'rgba(212,180,106,0.45)'
    : 'rgba(163,50,31,0.38)';
  const glowColor = dark
    ? 'rgba(212,180,106,0.25)'
    : 'rgba(163,50,31,0.22)';

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.container, { width: size, height: size }]}
      accessibilityLabel={t('woodfish.tapLabel')}
      accessibilityRole="button"
    >
      {/* 柔光（每次敲擊閃一下） */}
      <Animated.View
        style={[
          styles.glow,
          {
            width: size * 1.05,
            height: size * 1.05,
            backgroundColor: glowColor,
            opacity: glowAnim,
          },
        ]}
        pointerEvents="none"
      />

      {/* 漣漪池 */}
      {ripples.map((r, i) => (
        <Animated.View
          key={i}
          style={[
            styles.ripple,
            {
              width: size * 0.9,
              height: size * 0.9,
              borderColor: rippleColor,
              transform: [{ scale: r.scale }],
              opacity: r.opacity,
            },
          ]}
          pointerEvents="none"
        />
      ))}

      {/* 木魚圖片 */}
      <Animated.Image
        source={woodfishImg}
        style={{
          width: size,
          height: size,
          resizeMode: 'contain',
          transform: [{ scale: scaleAnim }],
        }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 1.5,
  },
  glow: {
    position: 'absolute',
    borderRadius: 9999,
  },
});
