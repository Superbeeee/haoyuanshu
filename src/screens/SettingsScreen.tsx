import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, Pressable, Alert, ScrollView, StyleSheet, Switch } from 'react-native';
import Constants from 'expo-constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme/useTheme';
import { useStore } from '../store';
import { FONT_HANZI } from '../theme/tokens';
import { t, resolveLanguage, SUPPORTED_LANGUAGES, type Language } from '../i18n';
import { ensureFontsLoaded } from '../theme/fonts';
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
  const setLanguage = useStore((s) => s.setLanguage);
  const currentLanguage = useStore((s) => s.settings.language);
  const plans = useStore((s) => s.plans);
  const activePlans = useMemo(
    () => plans.filter((p) => p.status === 'active'),
    [plans]
  );

  // 語言列表顯示各語言原生名稱，預載全部字型以正確渲染（諺文 / 假名等）
  const [, forceTick] = useState(0);
  useEffect(() => {
    Promise.all(SUPPORTED_LANGUAGES.map((l) => ensureFontsLoaded(l))).then(() =>
      forceTick((n) => n + 1)
    );
  }, []);

  const handleThemeChange = (next: 'light' | 'dark') => {
    updateSettings({ theme: next });
  };

  // 先載入目標語言字型再切換，避免切換瞬間字體閃爍
  const handleLanguage = async (lang: Language | null) => {
    await ensureFontsLoaded(resolveLanguage(lang));
    setLanguage(lang);
  };

  const LANG_OPTIONS: { key: Language | null; label: string }[] = [
    { key: null, label: t('settings.systemDefault') },
    { key: 'zh', label: '繁體中文' },
    { key: 'en', label: 'English' },
    { key: 'ja', label: '日本語' },
    { key: 'ko', label: '한국어' },
  ];

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

  const handleClear = () => {
    Alert.alert(
      t('settings.clearTitle'),
      t('settings.clearMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('settings.clearConfirm'),
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
          <Text style={{ color: T.inkSoft, fontSize: 14 }}>{`‹ ${t('settings.back')}`}</Text>
        </Pressable>
      </View>

      <Text
        style={[
          styles.title,
          { color: T.ink, fontFamily: T.fontSerifMedium, letterSpacing: T.tracking.widest },
        ]}
      >
        {t('settings.title')}
      </Text>

      <ScrollView contentContainerStyle={styles.content}>
        {/* 外觀 */}
        <Text style={[styles.sectionLabel, { color: T.inkMuted }]}>{t('settings.sectionAppearance')}</Text>
        <View style={[styles.card, { backgroundColor: T.bgElevated, borderColor: T.hairline }]}>
          <Pressable
            onPress={() => handleThemeChange('light')}
            style={styles.row}
          >
            <Text style={[styles.rowText, { color: T.ink, fontFamily: T.fontSerif }]}>{t('settings.light')}</Text>
            {theme === 'light' && (
              <Text style={{ color: T.vermilion, fontSize: 16 }}>✓</Text>
            )}
          </Pressable>
          <Hairline />
          <Pressable
            onPress={() => handleThemeChange('dark')}
            style={styles.row}
          >
            <Text style={[styles.rowText, { color: T.ink, fontFamily: T.fontSerif }]}>{t('settings.dark')}</Text>
            {theme === 'dark' && (
              <Text style={{ color: T.vermilion, fontSize: 16 }}>✓</Text>
            )}
          </Pressable>
        </View>

        {/* 語言 */}
        <Text style={[styles.sectionLabel, { color: T.inkMuted }]}>{t('settings.sectionLanguage')}</Text>
        <View style={[styles.card, { backgroundColor: T.bgElevated, borderColor: T.hairline }]}>
          {LANG_OPTIONS.map((opt, i) => {
            const selected = currentLanguage === opt.key;
            return (
              <View key={opt.key ?? 'system'}>
                {i > 0 && <Hairline />}
                <Pressable onPress={() => handleLanguage(opt.key)} style={styles.row}>
                  <Text style={[styles.rowText, { color: T.ink, fontFamily: T.fontSerif }]}>
                    {opt.label}
                  </Text>
                  {selected && (
                    <Text style={{ color: T.vermilion, fontSize: 16 }}>✓</Text>
                  )}
                </Pressable>
              </View>
            );
          })}
        </View>

        {/* 提醒 */}
        <Text style={[styles.sectionLabel, { color: T.inkMuted }]}>
          {t('settings.sectionReminders')}
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
                        style={[
                          styles.rowText,
                          { color: T.ink, fontFamily: T.fontSerif },
                        ]}
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

        {/* 資料 */}
        <Text style={[styles.sectionLabel, { color: T.inkMuted }]}>{t('settings.sectionData')}</Text>
        <View style={[styles.card, { backgroundColor: T.bgElevated, borderColor: T.hairline }]}>
          <Pressable onPress={handleClear} style={styles.row}>
            <Text style={[styles.rowText, { color: T.vermilion, fontFamily: T.fontSerif }]}>
              {t('settings.clearData')}
            </Text>
          </Pressable>
        </View>

        {/* 關於 */}
        <Text style={[styles.sectionLabel, { color: T.inkMuted }]}>{t('settings.sectionAbout')}</Text>
        <View style={[styles.card, { backgroundColor: T.bgElevated, borderColor: T.hairline }]}>
          <View style={styles.row}>
            <Text style={[styles.rowText, { color: T.ink, fontFamily: T.fontSerif }]}>{t('settings.version')}</Text>
            <Text style={[styles.rowValue, { color: T.inkMuted }]}>{version}</Text>
          </View>
          <Hairline />
          <View style={styles.row}>
            <Text style={[styles.rowText, { color: T.ink, fontFamily: FONT_HANZI }]}>好願書</Text>
            <Text style={[styles.rowValue, { color: T.inkMuted }]}>{t('settings.tagline')}</Text>
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
  title: { fontSize: 24, paddingHorizontal: 24, marginTop: 8, marginBottom: 20 },
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
