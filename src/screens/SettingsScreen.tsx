import React, { useMemo } from 'react';
import { View, Text, Pressable, Alert, ScrollView, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme/useTheme';
import { useStore } from '../store';
import { FONT_HANZI } from '../theme/tokens';
import { t, LANGUAGE_NATIVE_NAMES } from '../i18n';
import { PaperBg } from '../components/PaperBg';
import { Hairline } from '../components/Hairline';
import { cancelAllReminders } from '../utils/notifications';
import { PlanStackParamList, DailyStackParamList } from '../navigation/types';

type SettingsScreenProps =
  | NativeStackScreenProps<PlanStackParamList, 'Settings'>
  | NativeStackScreenProps<DailyStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { T, theme } = useTheme();
  const updateSettings = useStore((s) => s.updateSettings);
  const clearAll = useStore((s) => s.clearAll);
  const currentLanguage = useStore((s) => s.settings.language);
  // 兩個 stack 都有 Language route，統一型別以便 navigate（union navigation 無法直接調用）
  const nav = navigation as NativeStackScreenProps<PlanStackParamList, 'Settings'>['navigation'];
  const plans = useStore((s) => s.plans);
  const activePlans = useMemo(
    () => plans.filter((p) => p.status === 'active'),
    [plans]
  );
  const enabledReminders = useMemo(
    () => activePlans.filter((p) => p.notificationId).length,
    [activePlans]
  );

  const handleThemeChange = (next: 'light' | 'dark') => {
    updateSettings({ theme: next });
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
          <Pressable onPress={() => nav.navigate('Language')} style={styles.row}>
            <Text style={[styles.rowText, { color: T.ink, fontFamily: T.fontSerif }]}>
              {t('settings.sectionLanguage')}
            </Text>
            <View style={styles.rowValueGroup}>
              <Text style={[styles.rowValue, { color: T.inkMuted }]}>
                {currentLanguage
                  ? LANGUAGE_NATIVE_NAMES[currentLanguage]
                  : t('settings.systemDefault')}
              </Text>
              <Text style={{ color: T.inkFaint, fontSize: 16 }}>›</Text>
            </View>
          </Pressable>
        </View>

        {/* 提醒 */}
        <Text style={[styles.sectionLabel, { color: T.inkMuted }]}>
          {t('settings.sectionReminders')}
        </Text>
        <View style={[styles.card, { backgroundColor: T.bgElevated, borderColor: T.hairline }]}>
          <Pressable onPress={() => nav.navigate('Reminder')} style={styles.row}>
            <Text style={[styles.rowText, { color: T.ink, fontFamily: T.fontSerif }]}>
              {t('settings.sectionReminders')}
            </Text>
            <View style={styles.rowValueGroup}>
              <Text style={[styles.rowValue, { color: T.inkMuted }]}>
                {activePlans.length === 0
                  ? '—'
                  : t('settings.reminderEnabled', { count: enabledReminders })}
              </Text>
              <Text style={{ color: T.inkFaint, fontSize: 16 }}>›</Text>
            </View>
          </Pressable>
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
  rowValueGroup: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
