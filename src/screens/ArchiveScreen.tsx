import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme/useTheme';
import { useStore } from '../store';
import { FONT_SERIF, FONT_SERIF_MEDIUM } from '../theme/tokens';
import { PaperBg } from '../components/PaperBg';
import { Seal } from '../components/Seal';
import { Plan } from '../types';
import { PlanStackParamList, DailyStackParamList } from '../navigation/types';

type ArchiveScreenProps =
  | NativeStackScreenProps<PlanStackParamList, 'Archive'>
  | NativeStackScreenProps<DailyStackParamList, 'Archive'>;

const FILTERS = [
  { key: 'all', label: '全部' },
  { key: 'family', label: '為家人' },
  { key: 'self', label: '自迴向' },
  { key: 'beings', label: '為眾生' },
  { key: 'deceased', label: '為亡者' },
  { key: 'other', label: '其他' },
];

export function ArchiveScreen({ navigation }: ArchiveScreenProps) {
  const { T } = useTheme();
  const allPlans = useStore((s) => s.plans);
  const completed = useMemo(() => allPlans.filter((p) => p.status === 'completed'), [allPlans]);
  const dailyLogs = useStore((s) => s.dailyLogs);
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(
    () =>
      filter === 'all'
        ? completed
        : completed.filter((p) => p.dedicationType === filter),
    [completed, filter]
  );

  const renderCard = ({ item: p }: { item: Plan }) => {
    const total = dailyLogs
      .filter((l) => l.planId === p.id)
      .reduce((s, l) => s + l.count, 0);

    return (
      <View
        style={[
          styles.card,
          { backgroundColor: T.bgElevated, borderColor: T.hairline },
        ]}
      >
        {/* 金色頂線 */}
        <View style={[styles.goldLine, { backgroundColor: T.gold }]} />
        <View style={styles.cardContent}>
          <View style={styles.cardRow}>
            <Seal text={p.seal} size={38} color={T.gold} />
            <View style={styles.cardInfo}>
              <Text
                style={[styles.cardName, { color: T.ink, fontFamily: FONT_SERIF_MEDIUM }]}
                numberOfLines={1}
              >
                {p.name}
              </Text>
              <Text style={[styles.cardSub, { color: T.inkMuted }]}>
                為 {p.dedicatedTo}
              </Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={[styles.cardTotal, { color: T.gold, fontFamily: FONT_SERIF_MEDIUM }]}>
                {total.toLocaleString()}
              </Text>
              <Text style={[styles.cardUnit, { color: T.inkMuted }]}>遍</Text>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <Text style={[styles.cardDate, { color: T.inkFaint }]}>
              {p.startDate} → {p.completedDate}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: T.bg }]}>
      <PaperBg />

      {/* 導航 */}
      <View style={styles.nav}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ color: T.inkSoft, fontSize: 14 }}>‹ 返回</Text>
        </Pressable>
      </View>

      <Text style={[styles.title, { color: T.ink, fontFamily: FONT_SERIF_MEDIUM }]}>
        功 德 封 存
      </Text>
      <Text style={[styles.subtitle, { color: T.inkMuted }]}>
        ARCHIVED MERITS
      </Text>

      {/* 篩選 */}
      <FlatList
        horizontal
        data={FILTERS}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        keyExtractor={(f) => f.key}
        renderItem={({ item: f }) => (
          <Pressable
            onPress={() => setFilter(f.key)}
            style={[
              styles.filterChip,
              {
                backgroundColor: filter === f.key ? T.gold + '22' : 'transparent',
                borderColor: filter === f.key ? T.gold : T.hairlineStrong,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: filter === f.key ? T.gold : T.inkMuted,
                  fontFamily: FONT_SERIF,
                },
              ]}
            >
              {f.label}
            </Text>
          </Pressable>
        )}
      />

      {/* 列表 */}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: T.inkFaint, fontFamily: FONT_SERIF }]}>
            尚 無 圓 滿 功 德
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          renderItem={renderCard}
          keyExtractor={(p) => p.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  nav: { paddingHorizontal: 20, paddingTop: 60 },
  backBtn: { padding: 8 },
  title: { fontSize: 24, letterSpacing: 6, paddingHorizontal: 24, marginTop: 8 },
  subtitle: { fontSize: 11, letterSpacing: 6, paddingHorizontal: 24, marginTop: 4 },
  filterRow: { paddingHorizontal: 20, paddingVertical: 16, gap: 8 },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 100,
    borderWidth: 1,
  },
  filterText: { fontSize: 12, letterSpacing: 2 },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  card: { borderWidth: 1, borderRadius: 18, marginBottom: 12, overflow: 'hidden' },
  goldLine: { height: 2 },
  cardContent: { padding: 18 },
  cardRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 16, letterSpacing: 2 },
  cardSub: { fontSize: 12, marginTop: 2, letterSpacing: 1 },
  cardRight: { alignItems: 'flex-end' },
  cardTotal: { fontSize: 18 },
  cardUnit: { fontSize: 10, letterSpacing: 2 },
  cardFooter: { marginTop: 12 },
  cardDate: { fontSize: 11, letterSpacing: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 14, letterSpacing: 4 },
});
