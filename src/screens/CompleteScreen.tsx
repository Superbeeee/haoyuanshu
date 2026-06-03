import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme/useTheme';
import { useStore } from '../store';
import { t } from '../i18n';
import { PaperBg } from '../components/PaperBg';
import { Seal } from '../components/Seal';
import { cancelReminder } from '../utils/notifications';
import { formatLocalDate } from '../utils/date';
import { PlanStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<PlanStackParamList, 'Complete'>;

const DEDICATIONS = [
  { key: 'family', icon: '🏠' },
  { key: 'self', icon: '🙏' },
  { key: 'beings', icon: '🌍' },
  { key: 'deceased', icon: '🪷' },
  { key: 'other', icon: '✦' },
] as const;

export function CompleteScreen({ navigation, route }: Props) {
  const { T } = useTheme();
  const plan = useStore((s) => s.plans.find((p) => p.id === route.params.planId));
  const updatePlan = useStore((s) => s.updatePlan);
  const dailyLogs = useStore((s) => s.dailyLogs);

  const [selectedDedication, setSelectedDedication] = useState<string>(
    plan?.dedicationType ?? 'family'
  );

  if (!plan) return null;

  const totalDone = dailyLogs
    .filter((l) => l.planId === plan.id)
    .reduce((s, l) => s + l.count, 0);

  const handleArchive = async () => {
    updatePlan(plan.id, {
      status: 'completed',
      dedicationType: selectedDedication,
      completedDate: formatLocalDate(),
      notificationId: undefined,
    });
    // 取消提醒通知（用排程時記下的 expo notification id）
    if (plan.notificationId) {
      try {
        await cancelReminder(plan.notificationId);
      } catch {}
    }
    navigation.popToTop();
  };

  return (
    <View style={[styles.container, { backgroundColor: T.bg }]}>
      <PaperBg />
      <ScrollView contentContainerStyle={styles.content}>
        {/* 頂部裝飾 */}
        <View style={styles.header}>
          <Seal text="圓" size={56} color={T.gold} />
          <Text
            style={[styles.title, { color: T.ink, fontFamily: T.fontSerifMedium }]}
          >
            {t('complete.title')}
          </Text>
          <Text style={[styles.subtitle, { color: T.inkMuted }]}>
            {t('complete.subtitle')}
          </Text>
        </View>

        {/* 計劃摘要 */}
        <View style={[styles.summaryCard, { backgroundColor: T.bgElevated, borderColor: T.hairline }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: T.inkMuted }]}>{t('complete.planName')}</Text>
            <Text style={[styles.summaryValue, { color: T.ink, fontFamily: T.fontSerif }]}>
              {plan.name}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: T.hairline }]} />
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: T.inkMuted }]}>{t('complete.dedicatedTo')}</Text>
            <Text style={[styles.summaryValue, { color: T.ink, fontFamily: T.fontSerif }]}>
              {plan.dedicatedTo}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: T.hairline }]} />
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: T.inkMuted }]}>{t('complete.totalCount')}</Text>
            <Text style={[styles.summaryValue, { color: T.vermilion, fontFamily: T.fontSerifMedium }]}>
              {`${totalDone.toLocaleString()} ${t('common.times')}`}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: T.hairline }]} />
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: T.inkMuted }]}>{t('complete.duration')}</Text>
            <Text style={[styles.summaryValue, { color: T.ink, fontFamily: T.fontSerif }]}>
              {`${plan.duration} ${t('common.day')}`}
            </Text>
          </View>
        </View>

        {/* 回向分類 */}
        <Text style={[styles.sectionTitle, { color: T.ink, fontFamily: T.fontSerifMedium }]}>
          {t('complete.dedication')}
        </Text>
        <View style={styles.dedicationGrid}>
          {DEDICATIONS.map((d) => (
            <Pressable
              key={d.key}
              onPress={() => setSelectedDedication(d.key)}
              style={[
                styles.dedicationItem,
                {
                  backgroundColor: selectedDedication === d.key ? T.gold + '22' : T.bgElevated,
                  borderColor: selectedDedication === d.key ? T.gold : T.hairline,
                },
              ]}
            >
              <Text style={styles.dedicationIcon}>{d.icon}</Text>
              <Text
                style={[
                  styles.dedicationLabel,
                  {
                    color: selectedDedication === d.key ? T.gold : T.ink,
                    fontFamily: T.fontSerif,
                  },
                ]}
              >
                {t(`dedication.${d.key}`)}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* 發願文 */}
        {plan.note ? (
          <View style={[styles.noteCard, { backgroundColor: T.bgSunken }]}>
            <Text style={[styles.noteLabel, { color: T.inkMuted }]}>{t('complete.vowText')}</Text>
            <Text style={[styles.noteText, { color: T.ink, fontFamily: T.fontSerif }]}>
              {plan.note}
            </Text>
          </View>
        ) : null}

        {/* 封存按鈕 */}
        <Pressable onPress={handleArchive} style={[styles.archiveBtn, { backgroundColor: T.gold }]}>
          <Text style={[styles.archiveBtnText, { fontFamily: T.fontSerifMedium }]}>
            {t('complete.archiveButton')}
          </Text>
        </Pressable>

        <Pressable onPress={() => navigation.goBack()} style={styles.backLink}>
          <Text style={[styles.backLinkText, { color: T.inkMuted, fontFamily: T.fontSerif }]}>
            {t('complete.backContinue')}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 28, letterSpacing: 8, marginTop: 16 },
  subtitle: { fontSize: 12, letterSpacing: 6, marginTop: 4 },
  summaryCard: { borderWidth: 1, borderRadius: 18, padding: 20, marginBottom: 28 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  summaryLabel: { fontSize: 12, letterSpacing: 3 },
  summaryValue: { fontSize: 16 },
  divider: { height: 1 },
  sectionTitle: { fontSize: 18, letterSpacing: 4, marginBottom: 14 },
  dedicationGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  dedicationItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dedicationIcon: { fontSize: 16 },
  dedicationLabel: { fontSize: 13, letterSpacing: 2 },
  noteCard: { padding: 16, borderRadius: 14, marginBottom: 24 },
  noteLabel: { fontSize: 11, letterSpacing: 3, marginBottom: 8 },
  noteText: { fontSize: 15, lineHeight: 26, letterSpacing: 1 },
  archiveBtn: { padding: 16, borderRadius: 100, alignItems: 'center', marginBottom: 12 },
  archiveBtnText: { color: '#1a1612', fontSize: 16, letterSpacing: 6 },
  backLink: { alignItems: 'center', padding: 12 },
  backLinkText: { fontSize: 13, letterSpacing: 3 },
});
