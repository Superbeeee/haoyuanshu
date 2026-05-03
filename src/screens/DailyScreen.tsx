import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme/useTheme';
import { useStore } from '../store';
import { FONT_SERIF, FONT_SERIF_MEDIUM } from '../theme/tokens';
import { PaperBg } from '../components/PaperBg';
import { Woodfish } from '../components/Woodfish';
import { SutraSheet } from '../components/SutraSheet';
import { CountEditor } from '../components/CountEditor';
import { DatePickerSheet } from '../components/DatePickerSheet';
import { DailyStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<DailyStackParamList, 'DailyMain'>;

const todayStr = () => new Date().toISOString().split('T')[0];
const dingWav = require('../../assets/ding.wav');

export function DailyScreen({ navigation }: Props) {
  const { T } = useTheme();
  const allDailyLogs = useStore((s) => s.dailyLogs);
  const addDailyLog = useStore((s) => s.addDailyLog);
  const dailyLogs = useMemo(() => allDailyLogs.filter((l) => l.planId === 'daily'), [allDailyLogs]);

  const todayLog = dailyLogs.find((l) => l.date === todayStr());
  const [count, setCount] = useState(todayLog?.count ?? 0);
  const [muted, setMuted] = useState(false);
  const [sutraOpen, setSutraOpen] = useState(false);
  const [editDate, setEditDate] = useState<string | null>(null);
  const [editCount, setEditCount] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);

  const totalCount = dailyLogs.reduce((s, l) => s + l.count, 0);

  // 叮聲
  const dingRef = useRef<Audio.Sound | null>(null);
  useEffect(() => {
    let mounted = true;
    Audio.Sound.createAsync(dingWav)
      .then(({ sound }) => {
        if (mounted) dingRef.current = sound;
        else sound.unloadAsync();
      })
      .catch(() => {});
    return () => {
      mounted = false;
      dingRef.current?.unloadAsync();
      dingRef.current = null;
    };
  }, []);
  const playDing = useCallback(async () => {
    if (muted) return;
    try {
      const s = dingRef.current;
      if (!s) return;
      await s.setPositionAsync(0);
      await s.playAsync();
    } catch {}
  }, [muted]);

  // 近 7 日
  const last7 = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      const log = dailyLogs.find((l) => l.date === dateStr);
      return {
        date: dateStr,
        count: log?.count ?? 0,
        day: ['日', '一', '二', '三', '四', '五', '六'][d.getDay()],
        month: d.getMonth() + 1,
        dayNum: d.getDate(),
        isToday: dateStr === todayStr(),
      };
    });
  }, [dailyLogs]);

  const countsByDate = useMemo(() => {
    const map: Record<string, number> = {};
    for (const l of dailyLogs) map[l.date] = l.count;
    return map;
  }, [dailyLogs]);

  const maxCount = Math.max(1, ...last7.map((d) => d.count));

  const updateCount = useCallback(
    (delta: number) => {
      const newCount = Math.max(0, count + delta);
      setCount(newCount);
      addDailyLog({
        id: `daily-${todayStr()}`,
        planId: 'daily',
        date: todayStr(),
        count: newCount,
      });
      if (delta > 0) playDing();
    },
    [count, addDailyLog, playDing]
  );

  const openEdit = useCallback((date: string, current: number) => {
    setEditDate(date);
    setEditCount(current);
  }, []);

  const saveEdit = useCallback(
    (newCount: number) => {
      if (!editDate) return;
      addDailyLog({
        id: `daily-${editDate}`,
        planId: 'daily',
        date: editDate,
        count: newCount,
      });
      if (editDate === todayStr()) setCount(newCount);
      setEditDate(null);
    },
    [editDate, addDailyLog]
  );

  return (
    <View style={[styles.container, { backgroundColor: T.bg }]}>
      <PaperBg />

      {/* 頂部 */}
      <View style={styles.topBar}>
        <View>
          <Text style={[styles.subtitle, { color: T.inkMuted }]}>
            DAILY PRACTICE
          </Text>
          <Text
            style={[
              styles.title,
              { color: T.ink, fontFamily: FONT_SERIF_MEDIUM },
            ]}
          >
            日 常 記 錄
          </Text>
        </View>
        <Pressable
          onPress={() => setMuted((m) => !m)}
          style={[styles.muteBtn, { borderColor: T.hairlineStrong }]}
        >
          <Text style={{ color: T.inkSoft, fontSize: 14 }}>
            {muted ? '🔇' : '🔈'}
          </Text>
        </Pressable>
      </View>

      {/* 遍數 */}
      <View style={styles.countArea}>
        <Text
          style={[
            styles.countNum,
            { color: T.ink, fontFamily: FONT_SERIF },
          ]}
        >
          {count}
        </Text>
        <Text style={[styles.todayLabel, { color: T.inkMuted }]}>
          今日遍數
        </Text>
        <View style={[styles.totalBox, { backgroundColor: T.bgSunken }]}>
          <Text style={[styles.totalLabel, { color: T.inkMuted }]}>
            累計
          </Text>
          <Text
            style={[
              styles.totalNum,
              { color: T.vermilion, fontFamily: FONT_SERIF_MEDIUM },
            ]}
          >
            {totalCount.toLocaleString()}
          </Text>
          <Text style={[styles.totalUnit, { color: T.inkMuted }]}>遍</Text>
        </View>
      </View>

      {/* 近 7 日長條圖（含日期，可點擊編輯） */}
      <View style={[styles.chartCard, { backgroundColor: T.bgElevated, borderColor: T.hairline }]}>
        <View style={styles.chartHeader}>
          <Text style={[styles.chartTitle, { color: T.inkMuted }]}>
            近 七 日
          </Text>
          <Pressable onPress={() => setPickerOpen(true)}>
            <Text style={[styles.moreText, { color: T.inkMuted, fontFamily: FONT_SERIF }]}>
              更 多 日 期 ›
            </Text>
          </Pressable>
        </View>
        <View style={styles.chartRow}>
          {last7.map((d, i) => (
            <Pressable
              key={i}
              onPress={() => openEdit(d.date, d.count)}
              style={styles.chartCol}
            >
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      backgroundColor: d.count > 0 ? T.vermilion : T.hairline,
                      height: `${Math.max(4, (d.count / maxCount) * 100)}%`,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.chartDay, { color: d.isToday ? T.ink : T.inkFaint }]}>
                {d.day}
              </Text>
              <Text
                style={[
                  styles.chartDate,
                  { color: d.isToday ? T.ink : T.inkMuted, fontFamily: FONT_SERIF },
                ]}
              >
                {d.month}/{d.dayNum}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* 木魚 */}
      <View style={styles.woodfishArea}>
        <Woodfish size={180} muted={muted} />
      </View>

      {/* 控制 */}
      <View style={styles.controls}>
        <View style={styles.counterRow}>
          <Pressable
            onPress={() => updateCount(-1)}
            style={[
              styles.roundBtn,
              { backgroundColor: T.bgElevated, borderColor: T.hairlineStrong },
            ]}
          >
            <Text style={{ color: T.ink, fontSize: 22 }}>−</Text>
          </Pressable>
          <Pressable
            onPress={() => updateCount(1)}
            style={[styles.mainBtn, { backgroundColor: T.ink }]}
          >
            <Text
              style={[
                styles.mainBtnText,
                { color: T.bg, fontFamily: FONT_SERIF_MEDIUM },
              ]}
            >
              +1 遍
            </Text>
          </Pressable>
        </View>

        <View style={styles.actionRow}>
          <Pressable
            onPress={() => setSutraOpen(true)}
            style={[styles.actionBtn, { borderColor: T.hairlineStrong }]}
          >
            <Text style={[styles.actionBtnText, { color: T.ink, fontFamily: FONT_SERIF }]}>
              心 經 經 文
            </Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('Archive')}
            style={[styles.actionBtn, { borderColor: T.hairlineStrong }]}
          >
            <Text style={[styles.actionBtnText, { color: T.ink, fontFamily: FONT_SERIF }]}>
              功 德 封 存
            </Text>
          </Pressable>
        </View>

        {/* 切換模式 */}
        <Pressable
          onPress={() => useStore.getState().updateSettings({ appMode: 'plan' })}
          style={[styles.switchBtn, { borderColor: T.hairlineStrong }]}
        >
          <Text style={[styles.switchBtnText, { color: T.inkMuted, fontFamily: FONT_SERIF }]}>
            切 換 至 發 願 計 劃
          </Text>
        </Pressable>
      </View>

      <SutraSheet visible={sutraOpen} onClose={() => setSutraOpen(false)} />

      {/* 編輯過往日期（上下滑動） */}
      <CountEditor
        visible={editDate !== null}
        date={editDate}
        initialCount={editCount}
        onClose={() => setEditDate(null)}
        onSave={saveEdit}
      />

      {/* 90 日選擇 */}
      <DatePickerSheet
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={(date, c) => {
          setPickerOpen(false);
          openEdit(date, c);
        }}
        counts={countsByDate}
        days={90}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  subtitle: { fontSize: 11, letterSpacing: 6 },
  title: { fontSize: 22, letterSpacing: 4, marginTop: 2 },
  muteBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countArea: { alignItems: 'center', paddingTop: 24 },
  countNum: { fontSize: 72, fontWeight: '300', lineHeight: 72 },
  todayLabel: { fontSize: 12, letterSpacing: 4, marginTop: 4 },
  totalBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    marginTop: 12,
  },
  totalLabel: { fontSize: 11, letterSpacing: 2 },
  totalNum: { fontSize: 18 },
  totalUnit: { fontSize: 11 },
  chartCard: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
    borderRadius: 14,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartTitle: { fontSize: 11, letterSpacing: 4 },
  moreText: { fontSize: 11, letterSpacing: 2 },
  chartRow: { flexDirection: 'row', justifyContent: 'space-around', height: 70 },
  chartCol: { alignItems: 'center', flex: 1 },
  barContainer: { flex: 1, justifyContent: 'flex-end', width: 12 },
  bar: { width: '100%', borderRadius: 3, minHeight: 2 },
  chartDay: { fontSize: 10, marginTop: 4, letterSpacing: 1 },
  chartDate: { fontSize: 10, marginTop: 1 },
  woodfishArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  controls: { paddingHorizontal: 24, paddingBottom: 24 },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
  },
  roundBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainBtn: {
    flex: 1,
    height: 56,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainBtnText: { fontSize: 16, letterSpacing: 4 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  actionBtn: {
    flex: 1,
    padding: 11,
    borderRadius: 100,
    borderWidth: 1,
    alignItems: 'center',
  },
  actionBtnText: { fontSize: 13, letterSpacing: 4 },
  switchBtn: {
    marginTop: 10,
    padding: 10,
    borderRadius: 100,
    borderWidth: 1,
    alignItems: 'center',
  },
  switchBtnText: { fontSize: 12, letterSpacing: 3 },
});
