import React, { useMemo } from 'react';
import { View, Text, Pressable, Alert, ScrollView, StyleSheet, Switch } from 'react-native';
import Constants from 'expo-constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme/useTheme';
import { useStore } from '../store';
import { FONT_SERIF, FONT_SERIF_MEDIUM } from '../theme/tokens';
import { PaperBg } from '../components/PaperBg';
import { Hairline } from '../components/Hairline';
import {
  cancelAllReminders,
  cancelReminder,
  scheduleDailyReminder,
} from '../utils/notifications';
import { PlanStackParamList, DailyStackParamList } from '../navigation/types';

type SettingsScreenProps =
  | NativeStackScreenProps<PlanStackParamList, 'Settings'>
  | NativeStackScreenProps<DailyStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { T, theme } = useTheme();
  const updateSettings = useStore((s) => s.updateSettings);
  const updatePlan = useStore((s) => s.updatePlan);
  const clearAll = useStore((s) => s.clearAll);
  const plans = useStore((s) => s.plans);
  const activePlans = useMemo(
    () => plans.filter((p) => p.status === 'active'),
    [plans]
  );

  const handleTheme = (t: 'light' | 'dark') => {
    updateSettings({ theme: t });
  };

  const handleToggleReminder = async (planId: string, enable: boolean) => {
    const plan = activePlans.find((p) => p.id === planId);
    if (!plan) return;

    if (enable) {
      const id = await scheduleDailyReminder(plan.id, plan.name, plan.reminder);
      if (id) {
        updatePlan(plan.id, { notificationId: id });
      } else {
        Alert.alert('無法啟用提醒', '請確認系統通知權限是否開啟。');
      }
    } else {
      if (plan.notificationId) {
        await cancelReminder(plan.notificationId);
      }
      updatePlan(plan.id, { notificationId: undefined });
    }
  };

  const handleClear = () => {
    Alert.alert(
      '清除所有資料',
      '此操作不可復原，所有計劃、記錄與設定將被永久刪除。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '確認清除',
          style: 'destructive',
          onPress: async () => {
            await cancelAllReminders();
            clearAll();
          },
        },
      ]
    );
  };

  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <View style={[styles.container, { backgroundColor: T.bg }]}>
      <PaperBg />

      <View style={styles.nav}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ color: T.inkSoft, fontSize: 14 }}>‹ 返回</Text>
        </Pressable>
      </View>

      <Text style={[styles.title, { color: T.ink, fontFamily: FONT_SERIF_MEDIUM }]}>
        設 定
      </Text>

      <ScrollView contentContainerStyle={styles.content}>
        {/* 外觀 */}
        <Text style={[styles.sectionLabel, { color: T.inkMuted }]}>外觀 · APPEARANCE</Text>
        <View style={[styles.card, { backgroundColor: T.bgElevated, borderColor: T.hairline }]}>
          <Pressable
            onPress={() => handleTheme('light')}
            style={styles.row}
          >
            <Text style={[styles.rowText, { color: T.ink, fontFamily: FONT_SERIF }]}>淺色模式</Text>
            {theme === 'light' && (
              <Text style={{ color: T.vermilion, fontSize: 16 }}>✓</Text>
            )}
          </Pressable>
          <Hairline />
          <Pressable
            onPress={() => handleTheme('dark')}
            style={styles.row}
          >
            <Text style={[styles.rowText, { color: T.ink, fontFamily: FONT_SERIF }]}>深色模式</Text>
            {theme === 'dark' && (
              <Text style={{ color: T.vermilion, fontSize: 16 }}>✓</Text>
            )}
          </Pressable>
        </View>

        {/* 提醒 */}
        <Text style={[styles.sectionLabel, { color: T.inkMuted }]}>
          提醒 · REMINDERS
        </Text>
        <View
          style={[
            styles.card,
            { backgroundColor: T.bgElevated, borderColor: T.hairline },
          ]}
        >
          {activePlans.length === 0 ? (
            <View style={styles.row}>
              <Text style={[styles.rowValue, { color: T.inkMuted }]}>
                目前無進行中計劃
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
                        style={[
                          styles.rowText,
                          { color: T.ink, fontFamily: FONT_SERIF },
                        ]}
                        numberOfLines={1}
                      >
                        {p.name}
                      </Text>
                      <Text style={[styles.rowSubText, { color: T.inkMuted }]}>
                        每日 {p.reminder}
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

        {/* 資料 */}
        <Text style={[styles.sectionLabel, { color: T.inkMuted }]}>資料 · DATA</Text>
        <View style={[styles.card, { backgroundColor: T.bgElevated, borderColor: T.hairline }]}>
          <Pressable onPress={handleClear} style={styles.row}>
            <Text style={[styles.rowText, { color: T.vermilion, fontFamily: FONT_SERIF }]}>
              清除所有資料
            </Text>
          </Pressable>
        </View>

        {/* 關於 */}
        <Text style={[styles.sectionLabel, { color: T.inkMuted }]}>關於 · ABOUT</Text>
        <View style={[styles.card, { backgroundColor: T.bgElevated, borderColor: T.hairline }]}>
          <View style={styles.row}>
            <Text style={[styles.rowText, { color: T.ink, fontFamily: FONT_SERIF }]}>版本</Text>
            <Text style={[styles.rowValue, { color: T.inkMuted }]}>{version}</Text>
          </View>
          <Hairline />
          <View style={styles.row}>
            <Text style={[styles.rowText, { color: T.ink, fontFamily: FONT_SERIF }]}>好願書</Text>
            <Text style={[styles.rowValue, { color: T.inkMuted }]}>一念一功德</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  nav: { paddingHorizontal: 20, paddingTop: 60 },
  backBtn: { padding: 8 },
  title: { fontSize: 24, letterSpacing: 6, paddingHorizontal: 24, marginTop: 8, marginBottom: 20 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionLabel: { fontSize: 11, letterSpacing: 4, marginBottom: 8, marginTop: 16, paddingHorizontal: 4 },
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
