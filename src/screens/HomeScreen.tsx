import React, { useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme/useTheme';
import { useStore } from '../store';
import { FONT_SERIF, FONT_SERIF_MEDIUM } from '../theme/tokens';
import { PaperBg } from '../components/PaperBg';
import { Seal } from '../components/Seal';
import { PlanStackParamList } from '../navigation/types';
import { getCurrentDay } from '../utils/planDay';

type Props = NativeStackScreenProps<PlanStackParamList, 'Home'>;

// 熱力圖格子尺寸：13 欄 × 7 列 = 91 格 (含今日)
const HEAT_COLS = 13;
const HEAT_GAP = 4;
const HEAT_CARD_MARGIN = 20;
const HEAT_CARD_PADDING = 16;
const HEAT_CELL_SIZE = Math.floor(
  (Dimensions.get('window').width -
    HEAT_CARD_MARGIN * 2 -
    HEAT_CARD_PADDING * 2 -
    HEAT_GAP * (HEAT_COLS - 1)) /
    HEAT_COLS
);

export function HomeScreen({ navigation }: Props) {
  const { T, dark } = useTheme();
  const allPlans = useStore((s) => s.plans);
  const plans = useMemo(() => allPlans.filter((p) => p.status === 'active'), [allPlans]);
  const dailyLogs = useStore((s) => s.dailyLogs);
  const todayDate = new Date().toISOString().split('T')[0];

  // 90 日熱力圖
  const heat = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 91 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (90 - i));
      const dateStr = d.toISOString().split('T')[0];
      const total = dailyLogs
        .filter((l) => l.date === dateStr)
        .reduce((sum, l) => sum + l.count, 0);
      const isFuture = d > today;
      if (isFuture) return 0;
      if (total === 0) return 0;
      if (total <= 2) return 1;
      if (total <= 5) return 2;
      if (total <= 10) return 3;
      return 4;
    });
  }, [dailyLogs]);

  const heatColor = (v: number) => {
    if (v === 0) return T.hairline;
    const opacities = [0, 0.2, 0.4, 0.65, 0.9];
    const alpha = Math.round(opacities[v] * 255)
      .toString(16)
      .padStart(2, '0');
    return T.vermilion + alpha;
  };

  const totalCount = dailyLogs.reduce((s, l) => s + l.count, 0);

  return (
    <View style={[styles.container, { backgroundColor: T.bg }]}>
      <PaperBg />

      {/* 頂部 */}
      <View style={styles.topBar}>
        <View>
          <Text style={[styles.dateLabel, { color: T.inkMuted }]}>
            APRIL · 廿 · 八
          </Text>
          <Text
            style={[
              styles.greeting,
              { color: T.ink, fontFamily: FONT_SERIF_MEDIUM },
            ]}
          >
            晨 安 · 慧 淨
          </Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate('Settings')}
          style={[styles.avatarBtn, { borderColor: T.hairlineStrong }]}
        >
          <Text style={{ color: T.inkSoft, fontSize: 16 }}>☉</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 熱力圖 */}
        <View
          style={[
            styles.heatCard,
            { backgroundColor: T.bgElevated, borderColor: T.hairline },
          ]}
        >
          <View style={styles.heatHeader}>
            <Text style={[styles.heatLabel, { color: T.inkMuted }]}>
              近 九 十 日
            </Text>
            <Text style={[styles.heatTotal, { fontFamily: FONT_SERIF }]}>
              <Text style={{ color: T.vermilion, fontWeight: '500' }}>
                {totalCount}
              </Text>
              <Text style={{ color: T.inkMuted, fontSize: 11 }}>
                {' '}
                遍 總 計
              </Text>
            </Text>
          </View>
          <View style={styles.heatGrid}>
            {heat.map((v, i) => (
              <View
                key={i}
                style={[styles.heatCell, { backgroundColor: heatColor(v) }]}
              />
            ))}
          </View>
          <View style={styles.heatLegend}>
            <Text style={[styles.legendText, { color: T.inkFaint }]}>少</Text>
            {[0, 1, 2, 3, 4].map((v) => (
              <View
                key={v}
                style={[styles.legendDot, { backgroundColor: heatColor(v) }]}
              />
            ))}
            <Text style={[styles.legendText, { color: T.inkFaint }]}>多</Text>
          </View>
        </View>

        {/* 計劃列表 */}
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              { color: T.ink, fontFamily: FONT_SERIF_MEDIUM },
            ]}
          >
            進 行 中
          </Text>
          <Text style={[styles.sectionCount, { color: T.inkMuted }]}>
            {plans.length} 願
          </Text>
        </View>

        {plans.map((p) => {
          const isCasual = p.planType === 'casual' || p.daily === 0;
          const todayLog = dailyLogs.find((l) => l.planId === p.id && l.date === todayDate);
          const todayDone = todayLog?.count ?? 0;
          const totalDone = dailyLogs
            .filter((l) => l.planId === p.id)
            .reduce((s, l) => s + l.count, 0);
          const pct = isCasual ? 0 : Math.round(
            (totalDone / (p.daily * p.duration)) * 100
          );
          const todayComplete = !isCasual && todayDone >= p.daily;

          return (
            <Pressable
              key={p.id}
              onPress={() => navigation.navigate('Today', { planId: p.id })}
              style={[
                styles.planCard,
                {
                  backgroundColor: T.bgElevated,
                  borderColor: T.hairline,
                },
              ]}
            >
              {/* 左側色條 */}
              <View
                style={[
                  styles.leftAccent,
                  { backgroundColor: p.color },
                ]}
              />

              <View style={styles.planContent}>
                <View style={styles.planRow}>
                  <Seal text={p.seal} size={42} color={p.color} />
                  <View style={styles.planInfo}>
                    <Text
                      style={[
                        styles.planName,
                        { color: T.ink, fontFamily: FONT_SERIF_MEDIUM },
                      ]}
                      numberOfLines={1}
                    >
                      {p.name}
                    </Text>
                    <Text style={[styles.planSub, { color: T.inkMuted }]}>
                      {isCasual
                        ? `為 ${p.dedicatedTo} · 累計 ${totalDone} 遍`
                        : `為 ${p.dedicatedTo} · 第 ${getCurrentDay(p.startDate, p.duration)}/${p.duration} 日`}
                    </Text>
                  </View>
                  <View style={styles.todayCount}>
                    <Text
                      style={[
                        styles.todayNum,
                        { color: T.ink, fontFamily: FONT_SERIF_MEDIUM },
                      ]}
                    >
                      {todayDone}
                      {!isCasual && (
                        <Text style={{ fontSize: 12, color: T.inkMuted }}>
                          /{p.daily}
                        </Text>
                      )}
                    </Text>
                    {todayComplete ? (
                      <View
                        style={[
                          styles.todayBadge,
                          {
                            backgroundColor: T.gold + '22',
                            borderColor: T.gold + '55',
                          },
                        ]}
                      >
                        <Text
                          style={{
                            color: T.gold,
                            fontSize: 9,
                            letterSpacing: 2,
                          }}
                        >
                          今日圓滿
                        </Text>
                      </View>
                    ) : (
                      <Text style={[styles.todayLabel, { color: T.inkFaint }]}>
                        今 日
                      </Text>
                    )}
                  </View>
                </View>

                {/* 進度條（僅目標模式） */}
                {!isCasual && (
                  <View style={styles.progressRow}>
                    <View
                      style={[
                        styles.progressTrack,
                        { backgroundColor: T.hairline },
                      ]}
                    >
                      <View
                        style={[
                          styles.progressBar,
                          {
                            backgroundColor: p.color,
                            width: `${Math.min(100, pct)}%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.progressPct, { color: T.inkMuted }]}>
                      {pct}%
                    </Text>
                  </View>
                )}
              </View>

            </Pressable>
          );
        })}

        {/* 快捷按鈕 */}
        <View style={styles.quickRow}>
          <Pressable
            onPress={() => navigation.navigate('Archive')}
            style={[styles.quickBtn, { borderColor: T.hairlineStrong }]}
          >
            <Text
              style={[
                styles.quickBtnText,
                { color: T.ink, fontFamily: FONT_SERIF },
              ]}
            >
              功 德 封 存
            </Text>
          </Pressable>
          <Pressable
            onPress={() => useStore.getState().updateSettings({ appMode: 'daily' })}
            style={[styles.quickBtn, { borderColor: T.hairlineStrong }]}
          >
            <Text
              style={[
                styles.quickBtnText,
                { color: T.ink, fontFamily: FONT_SERIF },
              ]}
            >
              日 常 記 錄
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* FAB */}
      <Pressable
        onPress={() => navigation.navigate('CreatePlan')}
        style={[
          styles.fab,
          {
            backgroundColor: T.ink,
            shadowColor: dark ? '#000' : '#1a1612',
          },
        ]}
      >
        <Text style={{ color: T.bg, fontSize: 28, marginTop: -2 }}>+</Text>
      </Pressable>
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
    paddingBottom: 8,
  },
  dateLabel: { fontSize: 11, letterSpacing: 4 },
  greeting: { fontSize: 22, letterSpacing: 3, marginTop: 2 },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  heatCard: {
    margin: 20,
    padding: 16,
    borderWidth: 1,
    borderRadius: 18,
  },
  heatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  heatLabel: { fontSize: 11, letterSpacing: 4 },
  heatTotal: { fontSize: 14 },
  heatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: HEAT_GAP,
  },
  heatCell: {
    width: HEAT_CELL_SIZE,
    height: HEAT_CELL_SIZE,
    borderRadius: 3,
  },
  heatLegend: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  legendText: { fontSize: 10, letterSpacing: 2 },
  legendDot: { width: 9, height: 9, borderRadius: 2 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, letterSpacing: 4 },
  sectionCount: { fontSize: 11, letterSpacing: 4 },
  planCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  leftAccent: {
    position: 'absolute',
    left: 0,
    top: 16,
    bottom: 16,
    width: 3,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  planContent: { padding: 18, paddingLeft: 20 },
  planRow: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  planInfo: { flex: 1 },
  planName: { fontSize: 17, letterSpacing: 2 },
  planSub: { fontSize: 12, marginTop: 2, letterSpacing: 1 },
  todayCount: { alignItems: 'flex-end' },
  todayNum: { fontSize: 20, letterSpacing: 1 },
  todayLabel: { fontSize: 10, letterSpacing: 3, marginTop: 1 },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
  },
  progressTrack: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: { height: '100%' },
  progressPct: { fontSize: 13 },
  todayBadge: {
    marginTop: 4,
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 100,
    borderWidth: StyleSheet.hairlineWidth,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  quickBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  quickBtnText: { fontSize: 13, letterSpacing: 4 },
  fab: {
    position: 'absolute',
    bottom: 42,
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  },
});
