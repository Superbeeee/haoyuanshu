import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme/useTheme';
import { useStore } from '../store';
import { t } from '../i18n';
import { PaperBg } from '../components/PaperBg';
import { Seal } from '../components/Seal';
import { Plan } from '../types';
import { PlanStackParamList, DailyStackParamList } from '../navigation/types';

type ArchiveScreenProps =
  | NativeStackScreenProps<PlanStackParamList, 'Archive'>
  | NativeStackScreenProps<DailyStackParamList, 'Archive'>;

const FILTERS = [
  { key: 'all' },
  { key: 'family' },
  { key: 'self' },
  { key: 'beings' },
  { key: 'deceased' },
  { key: 'other' },
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
                style={[styles.cardName, { color: T.ink, fontFamily: T.fontSerifMedium }]}
                numberOfLines={1}
              >
                {p.name}
              </Text>
              <Text style={[styles.cardSub, { color: T.inkMuted }]}>
                {t('archive.forWhom', { name: p.dedicatedTo })}
              </Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={[styles.cardTotal, { color: T.gold, fontFamily: T.fontSerifMedium }]}>
                {total.toLocaleString()}
              </Text>
              <Text style={[styles.cardUnit, { color: T.inkMuted }]}>{t('common.times')}</Text>
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
          <Text style={{ color: T.inkSoft, fontSize: 14 }}>{`‹ ${t('settings.back')}`}</Text>
        </Pressable>
      </View>

      <Text style={[styles.title, { color: T.ink, fontFamily: T.fontSerifMedium }]}>
        {t('archive.title')}
      </Text>
      <Text style={[styles.subtitle, { color: T.inkMuted }]}>
        {t('archive.subtitle')}
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
                  fontFamily: T.fontSerif,
                },
              ]}
            >
              {t(`dedication.${f.key}`)}
            </Text>
          </Pressable>
        )}
      />

      {/* 列表 */}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: T.inkFaint, fontFamily: T.fontSerif }]}>
            {t('archive.empty')}
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
