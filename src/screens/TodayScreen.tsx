import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme/useTheme';
import { useStore } from '../store';
import { FONT_SERIF, FONT_SERIF_MEDIUM } from '../theme/tokens';
import { PaperBg } from '../components/PaperBg';
import { Woodfish } from '../components/Woodfish';
import { SutraSheet } from '../components/SutraSheet';
import { CountEditor } from '../components/CountEditor';
import { DatePickerSheet } from '../components/DatePickerSheet';
import { PlanStackParamList } from '../navigation/types';
import { getCurrentDay } from '../utils/planDay';
import { formatLocalDate } from '../utils/date';

type Props = NativeStackScreenProps<PlanStackParamList, 'Today'>;

const today = () => formatLocalDate();
const dingWav = require('../../assets/ding.wav');

export function TodayScreen({ navigation, route }: Props) {
  const { T } = useTheme();
  const plan = useStore((s) => s.plans.find((p) => p.id === route.params.planId));
  const addDailyLog = useStore((s) => s.addDailyLog);
  const dailyLogs = useStore((s) => s.dailyLogs);
  const todayDate = today();
  const todayLog = dailyLogs.find((l) => l.planId === route.params.planId && l.date === todayDate);
  const todayCount = todayLog?.count ?? 0;

  const [count, setCount] = useState(todayCount);
  // 沉浸模式回來或外部更新 dailyLogs 時，把本地 count 同步成最新 store 值
  useEffect(() => {
    setCount(todayCount);
  }, [todayCount]);
  const muted = useStore((s) => s.muted);
  const setMuted = useStore((s) => s.setMuted);
  const [sutraOpen, setSutraOpen] = useState(false);
  const [editDate, setEditDate] = useState<string | null>(null);
  const [editCount, setEditCount] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);

  // 「叮」音效（+1 按鈕用）
  const dingRef = useRef<AudioPlayer | null>(null);
  useEffect(() => {
    const player = createAudioPlayer(dingWav);
    dingRef.current = player;
    return () => {
      player.remove();
      dingRef.current = null;
    };
  }, []);
  const playDing = useCallback(() => {
    if (muted) return;
    try {
      const s = dingRef.current;
      if (!s) return;
      s.seekTo(0);
      s.play();
    } catch {}
  }, [muted]);

  // 近 7 日打卡紀錄
  const last7 = useMemo(() => {
    const now = new Date();
    const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      const dateStr = formatLocalDate(d);
      const log = dailyLogs.find((l) => l.planId === route.params.planId && l.date === dateStr);
      return {
        date: dateStr,
        count: log?.count ?? 0,
        day: dayNames[d.getDay()],
        month: d.getMonth() + 1,
        dayNum: d.getDate(),
        isToday: dateStr === todayDate,
      };
    });
  }, [dailyLogs, route.params.planId, todayDate]);

  // 給 DatePickerSheet 用：planId 的 date -> count
  const countsByDate = useMemo(() => {
    const map: Record<string, number> = {};
    for (const l of dailyLogs) {
      if (l.planId === route.params.planId) map[l.date] = l.count;
    }
    return map;
  }, [dailyLogs, route.params.planId]);

  // 計劃是否整個完成：從 startDate 起算，count >= daily 的「不同日期」達到 duration 天
  const fullyCompleted = useMemo(() => {
    if (!plan) return false;
    if (plan.planType === 'casual' || plan.daily === 0) return false;
    const metDays = new Set(
      dailyLogs
        .filter(
          (l) =>
            l.planId === plan.id &&
            l.date >= plan.startDate &&
            l.count >= plan.daily
        )
        .map((l) => l.date)
    );
    return metDays.size >= plan.duration;
  }, [plan, dailyLogs]);

  if (!plan) return null;

  const isCasual = plan.planType === 'casual' || plan.daily === 0;
  const goal = plan.daily;
  const pct = isCasual ? 0 : Math.min(100, (count / goal) * 100);

  const updateCount = (delta: number) => {
    const newCount = Math.max(0, count + delta);
    setCount(newCount);
    addDailyLog({
      id: `${plan.id}-${today()}`,
      planId: plan.id,
      date: today(),
      count: newCount,
    });
    if (delta > 0) playDing();
  };

  const handleComplete = () => {
    navigation.navigate('Complete', { planId: plan.id });
  };

  const openEdit = (date: string, current: number) => {
    setEditDate(date);
    setEditCount(current);
  };

  const saveEdit = (newCount: number) => {
    if (!editDate) return;
    addDailyLog({
      id: `${plan.id}-${editDate}`,
      planId: plan.id,
      date: editDate,
      count: newCount,
    });
    if (editDate === todayDate) setCount(newCount);
    setEditDate(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: T.bg }]}>
      <PaperBg />

      {/* 頂部導航 */}
      <View style={styles.nav}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ color: T.inkSoft, fontSize: 14 }}>‹ 計 劃</Text>
        </Pressable>
        <Pressable
          onPress={() => setMuted(!muted)}
          style={[styles.muteBtn, { borderColor: T.hairlineStrong }]}
        >
          <Text style={{ color: T.inkSoft, fontSize: 14 }}>
            {muted ? '🔇' : '🔈'}
          </Text>
        </Pressable>
      </View>

      {/* 計劃名稱 */}
      <View style={styles.planInfo}>
        {!isCasual && (
          <Text style={[styles.dayLabel, { color: T.inkMuted }]}>
            DAY {getCurrentDay(plan.startDate, plan.duration)} OF {plan.duration}
          </Text>
        )}
        {isCasual && (
          <Text style={[styles.dayLabel, { color: T.inkMuted }]}>
            DAILY PRACTICE
          </Text>
        )}
        <Text
          style={[
            styles.planName,
            { color: T.ink, fontFamily: FONT_SERIF_MEDIUM },
          ]}
        >
          {plan.name}
        </Text>
        <Text style={[styles.forWhom, { color: T.inkMuted }]}>
          為 {plan.dedicatedTo} 而念
        </Text>
      </View>

      {/* 遍數顯示 */}
      <View style={styles.countDisplay}>
        <View style={styles.countRow}>
          <Text
            style={[
              styles.countNum,
              { color: T.ink, fontFamily: FONT_SERIF },
            ]}
          >
            {count}
          </Text>
          {!isCasual && (
            <Text
              style={[
                styles.countGoal,
                { color: T.inkMuted, fontFamily: FONT_SERIF },
              ]}
            >
              / {goal} 遍
            </Text>
          )}
          {isCasual && (
            <Text
              style={[
                styles.countGoal,
                { color: T.inkMuted, fontFamily: FONT_SERIF },
              ]}
            >
              遍
            </Text>
          )}
        </View>
        {!isCasual && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressTrack, { backgroundColor: T.hairline }]}>
              <View
                style={[
                  styles.progressBar,
                  {
                    backgroundColor: plan.color,
                    width: `${pct}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressPct, { color: T.inkMuted }]}>
              {Math.round(pct)}%
            </Text>
          </View>
        )}

        {/* 近 7 日打卡格子（可點擊編輯，顯示日期） */}
        <View style={styles.weekGrid}>
          {last7.map((d, i) => {
            const done = isCasual ? d.count > 0 : d.count >= goal;
            return (
              <Pressable
                key={i}
                onPress={() => openEdit(d.date, d.count)}
                style={styles.weekCell}
              >
                <Text
                  style={[
                    styles.weekDay,
                    { color: d.isToday ? T.ink : T.inkFaint },
                  ]}
                >
                  {d.day}
                </Text>
                <View
                  style={[
                    styles.weekDot,
                    {
                      backgroundColor: done ? plan.color : T.hairline,
                      borderColor: d.isToday ? plan.color : 'transparent',
                    },
                  ]}
                >
                  {done && <Text style={styles.weekCheck}>✓</Text>}
                </View>
                <Text
                  style={[
                    styles.weekDate,
                    {
                      color: d.isToday ? T.ink : T.inkMuted,
                      fontFamily: FONT_SERIF,
                    },
                  ]}
                >
                  {d.month}/{d.dayNum}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* 更多日期入口 */}
        <Pressable
          onPress={() => setPickerOpen(true)}
          style={[styles.moreBtn, { borderColor: T.hairlineStrong }]}
        >
          <Text style={[styles.moreBtnText, { color: T.inkMuted, fontFamily: FONT_SERIF }]}>
            編 輯 其 他 日 期 ›
          </Text>
        </Pressable>
      </View>

      {/* 木魚 */}
      <View style={styles.woodfishArea}>
        <Woodfish size={220} muted={muted} />
      </View>

      {/* 控制區 */}
      <View style={styles.controls}>
        <Text style={[styles.hint, { color: T.inkFaint }]}>
          輕 觸 木 魚 · 不 計 入 遍 數
        </Text>

        {/* 計次按鈕 */}
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
              唸 了 一 遍
            </Text>
          </Pressable>
        </View>

        {/* 功能按鈕 */}
        <View style={styles.actionRow}>
          <Pressable
            onPress={() => setSutraOpen(true)}
            style={[styles.actionBtn, { borderColor: T.hairlineStrong }]}
          >
            <Text
              style={[
                styles.actionBtnText,
                { color: T.ink, fontFamily: FONT_SERIF },
              ]}
            >
              心 經 經 文
            </Text>
          </Pressable>
          <Pressable
            onPress={() =>
              navigation.navigate('Immersive', {
                planId: plan.id,
                currentCount: count,
                goal,
              })
            }
            style={[styles.actionBtn, { borderColor: T.hairlineStrong }]}
          >
            <Text
              style={[
                styles.actionBtnText,
                { color: T.ink, fontFamily: FONT_SERIF },
              ]}
            >
              沉 浸 模 式
            </Text>
          </Pressable>
        </View>

        {/* 整個計劃完成才顯示封存入口 */}
        {fullyCompleted && (
          <Pressable
            onPress={handleComplete}
            style={[styles.completeBtn, { backgroundColor: T.gold }]}
          >
            <Text
              style={[
                styles.completeBtnText,
                { fontFamily: FONT_SERIF_MEDIUM },
              ]}
            >
              功 德 圓 滿 · 封 存
            </Text>
          </Pressable>
        )}
      </View>

      {/* 心經 */}
      <SutraSheet visible={sutraOpen} onClose={() => setSutraOpen(false)} />

      {/* 編輯過往日期（上下滑動） */}
      <CountEditor
        visible={editDate !== null}
        date={editDate}
        initialCount={editCount}
        onClose={() => setEditDate(null)}
        onSave={saveEdit}
      />

      {/* 90 日日期選擇 */}
      <DatePickerSheet
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={(date, c) => {
          setPickerOpen(false);
          openEdit(date, c);
        }}
        counts={countsByDate}
        days={90}
        accentColor={plan.color}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  backBtn: { padding: 8 },
  muteBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planInfo: { paddingHorizontal: 24, paddingTop: 20 },
  dayLabel: { fontSize: 11, letterSpacing: 6 },
  planName: { fontSize: 26, letterSpacing: 3, marginTop: 4 },
  forWhom: { fontSize: 12, marginTop: 4, letterSpacing: 2 },
  countDisplay: { alignItems: 'center', paddingTop: 28, paddingBottom: 12 },
  countRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  countNum: { fontSize: 76, fontWeight: '300', lineHeight: 76 },
  countGoal: { fontSize: 22, letterSpacing: 2 },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
    width: 220,
  },
  progressTrack: { flex: 1, height: 2, borderRadius: 2, overflow: 'hidden' },
  progressBar: { height: '100%' },
  progressPct: { fontSize: 12 },
  weekGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
  },
  weekCell: { alignItems: 'center', gap: 3 },
  weekDot: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekCheck: { color: '#fff', fontSize: 12, fontWeight: '600' },
  weekDay: { fontSize: 10, letterSpacing: 1 },
  weekDate: { fontSize: 11, letterSpacing: 0.5 },
  moreBtn: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 100,
    borderWidth: 1,
  },
  moreBtnText: { fontSize: 11, letterSpacing: 3 },
  woodfishArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: { paddingHorizontal: 24, paddingBottom: 24 },
  hint: { textAlign: 'center', fontSize: 11, letterSpacing: 4, marginBottom: 16 },
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
  mainBtnText: { fontSize: 16, letterSpacing: 6 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  actionBtn: {
    flex: 1,
    padding: 11,
    borderRadius: 100,
    borderWidth: 1,
    alignItems: 'center',
  },
  actionBtnText: { fontSize: 13, letterSpacing: 4 },
  completeBtn: {
    marginTop: 12,
    padding: 14,
    borderRadius: 100,
    alignItems: 'center',
  },
  completeBtnText: { color: '#1a1612', fontSize: 14, letterSpacing: 6 },
});
