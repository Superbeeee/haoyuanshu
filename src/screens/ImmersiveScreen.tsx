import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useStore } from '../store';
import { FONT_SERIF, FONT_SERIF_MEDIUM } from '../theme/tokens';
import { Woodfish } from '../components/Woodfish';
import { PlanStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<PlanStackParamList, 'Immersive'>;

const today = () => new Date().toISOString().split('T')[0];

export function ImmersiveScreen({ navigation, route }: Props) {
  const { planId, currentCount, goal } = route.params;
  const addDailyLog = useStore((s) => s.addDailyLog);
  const muted = useStore((s) => s.muted);
  const setMuted = useStore((s) => s.setMuted);

  const [count, setCount] = useState(currentCount);

  const updateCount = useCallback(
    (delta: number) => {
      const newCount = Math.max(0, count + delta);
      setCount(newCount);
      addDailyLog({
        id: `${planId}-${today()}`,
        planId,
        date: today(),
        count: newCount,
      });
    },
    [count, planId, addDailyLog]
  );

  return (
    <View style={styles.container}>
      {/* 頂部 */}
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.exitBtn}>
          <Text style={styles.exitText}>✕ 退 出</Text>
        </Pressable>
        <Pressable onPress={() => setMuted(!muted)}>
          <Text style={styles.muteIcon}>{muted ? '🔇' : '🔈'}</Text>
        </Pressable>
      </View>

      {/* 中央 */}
      <View style={styles.center}>
        <View style={styles.countSection}>
          <Text style={styles.todayLabel}>TODAY</Text>
          <Text style={styles.countNum}>
            {count}
            {goal > 0 && <Text style={styles.countGoal}>/{goal}</Text>}
          </Text>
          <Text style={styles.bian}>遍</Text>
        </View>

        <Woodfish size={260} muted={muted} />

        {/* 計次按鈕 */}
        <View style={styles.counterPill}>
          <Pressable
            onPress={() => updateCount(-1)}
            style={styles.pillBtn}
          >
            <Text style={styles.pillMinus}>−</Text>
          </Pressable>
          <Text style={styles.pillLabel}>計 次</Text>
          <Pressable
            onPress={() => updateCount(1)}
            style={styles.pillBtnPlus}
          >
            <Text style={styles.pillPlusText}>+</Text>
          </Pressable>
        </View>
      </View>

      {/* 底部 */}
      <Text style={styles.zenText}>心 · 無 · 罣 · 礙</Text>
    </View>
  );
}

const INK = '#EDE4D0';
const FAINT = 'rgba(237,228,208,0.5)';
const VERY_FAINT = 'rgba(237,228,208,0.35)';
const BORDER = 'rgba(237,228,208,0.15)';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1612',
    paddingTop: 58,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exitBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  exitText: { color: 'rgba(237,228,208,0.7)', fontSize: 13, letterSpacing: 2 },
  muteIcon: { color: 'rgba(237,228,208,0.7)', fontSize: 18 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 50,
  },
  countSection: { alignItems: 'center' },
  todayLabel: {
    fontStyle: 'italic',
    fontSize: 12,
    color: FAINT,
    letterSpacing: 8,
  },
  countNum: {
    fontFamily: FONT_SERIF,
    fontSize: 96,
    fontWeight: '300',
    color: INK,
    lineHeight: 100,
    marginTop: 8,
  },
  countGoal: { fontSize: 28, color: 'rgba(237,228,208,0.4)' },
  bian: {
    fontFamily: FONT_SERIF,
    fontSize: 12,
    color: FAINT,
    letterSpacing: 6,
    marginTop: 6,
  },
  counterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(237,228,208,0.08)',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 100,
    padding: 4,
  },
  pillBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillMinus: { color: INK, fontSize: 22 },
  pillLabel: {
    paddingHorizontal: 20,
    fontFamily: FONT_SERIF,
    fontSize: 14,
    color: 'rgba(237,228,208,0.6)',
    letterSpacing: 4,
  },
  pillBtnPlus: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: INK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillPlusText: { color: '#1a1612', fontSize: 22 },
  zenText: {
    textAlign: 'center',
    fontFamily: FONT_SERIF,
    fontSize: 12,
    color: VERY_FAINT,
    letterSpacing: 8,
  },
});
