import React, { useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme/useTheme';
import { useStore } from '../store';
import { PaperBg } from '../components/PaperBg';
import { Hairline } from '../components/Hairline';
import { t } from '../i18n';
import { cancelReminder, scheduleDailyReminder } from '../utils/notifications';
import { PlanStackParamList, DailyStackParamList } from '../navigation/types';

type Props =
  | NativeStackScreenProps<PlanStackParamList, 'Reminder'>
  | NativeStackScreenProps<DailyStackParamList, 'Reminder'>;

export function ReminderScreen({ navigation }: Props) {
  const { T } = useTheme();
  const updatePlan = useStore((s) => s.updatePlan);
  const plans = useStore((s) => s.plans);
  const activePlans = useMemo(
    () => plans.filter((p) => p.status === 'active'),
    [plans]
  );

  const handleToggleReminder = async (planId: string, enable: boolean) => {
    const plan = activePlans.find((p) => p.id === planId);
    if (!plan) return;

    if (enable) {
      const id = await scheduleDailyReminder(plan.id, plan.name, plan.reminder);
      if (id) {
        updatePlan(plan.id, { notificationId: id });
      } else {
        Alert.alert(t('settings.reminderFailTitle'), t('settings.reminderFailMessage'));
      }
    } else {
      if (plan.notificationId) {
        await cancelReminder(plan.notificationId);
      }
      updatePlan(plan.id, { notificationId: undefined });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: T.bg }]}>
      <PaperBg />
      <View style={styles.nav}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ color: T.inkSoft, fontSize: 14 }}>{`‹ ${t('settings.back')}`}</Text>
        </Pressable>
      </View>
      <Text
        style={[
          styles.title,
          { color: T.ink, fontFamily: T.fontSerifMedium, letterSpacing: T.tracking.widest },
        ]}
      >
        {t('settings.sectionReminders')}
      </Text>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: T.bgElevated, borderColor: T.hairline }]}>
          {activePlans.length === 0 ? (
            <View style={styles.row}>
              <Text style={[styles.rowValue, { color: T.inkMuted }]}>
                {t('settings.noActivePlan')}
              </Text>
            </View>
          ) : (
            activePlans.map((p, i) => {
              const enabled = !!p.notificationId;
              return (
                <View key={p.id}>
                  {i > 0 && <Hairline />}
                  <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[styles.rowText, { color: T.ink, fontFamily: T.fontSerif }]}
                        numberOfLines={1}
                      >
                        {p.name}
                      </Text>
                      <Text style={[styles.rowSubText, { color: T.inkMuted }]}>
                        {t('settings.dailyReminder', { time: p.reminder })}
                      </Text>
                    </View>
                    <Switch
                      value={enabled}
                      onValueChange={(v) => handleToggleReminder(p.id, v)}
                      trackColor={{ false: T.hairlineStrong, true: T.vermilion }}
                      thumbColor={T.bg}
                    />
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  nav: { paddingHorizontal: 20, paddingTop: 60 },
  backBtn: { padding: 8 },
  title: { fontSize: 24, paddingHorizontal: 24, marginTop: 8, marginBottom: 20 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  card: { borderWidth: 1, borderRadius: 14, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowText: { fontSize: 15, letterSpacing: 2 },
  rowSubText: { fontSize: 12, letterSpacing: 1, marginTop: 4 },
  rowValue: { fontSize: 13 },
});
