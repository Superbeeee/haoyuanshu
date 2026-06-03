import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme/useTheme';
import { useStore } from '../store';
import { PaperBg } from '../components/PaperBg';
import { Hairline } from '../components/Hairline';
import {
  t,
  resolveLanguage,
  SUPPORTED_LANGUAGES,
  LANGUAGE_NATIVE_NAMES,
  type Language,
} from '../i18n';
import { ensureFontsLoaded } from '../theme/fonts';
import { PlanStackParamList, DailyStackParamList } from '../navigation/types';

type Props =
  | NativeStackScreenProps<PlanStackParamList, 'Language'>
  | NativeStackScreenProps<DailyStackParamList, 'Language'>;

export function LanguageScreen({ navigation }: Props) {
  const { T } = useTheme();
  const setLanguage = useStore((s) => s.setLanguage);
  const currentLanguage = useStore((s) => s.settings.language);

  // 顯示各語言原生名稱（諺文 / 假名等），預載全部字型以正確渲染
  const [, forceTick] = useState(0);
  useEffect(() => {
    Promise.all(SUPPORTED_LANGUAGES.map((l) => ensureFontsLoaded(l))).then(() =>
      forceTick((n) => n + 1)
    );
  }, []);

  // 先載入目標語言字型再切換，避免字體閃爍；即時套用、不自動返回，方便連續預覽
  const handleLanguage = async (lang: Language | null) => {
    await ensureFontsLoaded(resolveLanguage(lang));
    setLanguage(lang);
  };

  const options: { key: Language | null; label: string }[] = [
    { key: null, label: t('settings.systemDefault') },
    ...SUPPORTED_LANGUAGES.map((l) => ({ key: l, label: LANGUAGE_NATIVE_NAMES[l] })),
  ];

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
        {t('settings.sectionLanguage')}
      </Text>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: T.bgElevated, borderColor: T.hairline }]}>
          {options.map((opt, i) => {
            const selected = currentLanguage === opt.key;
            return (
              <View key={opt.key ?? 'system'}>
                {i > 0 && <Hairline />}
                <Pressable onPress={() => handleLanguage(opt.key)} style={styles.row}>
                  <Text style={[styles.rowText, { color: T.ink, fontFamily: T.fontSerif }]}>
                    {opt.label}
                  </Text>
                  {selected && <Text style={{ color: T.vermilion, fontSize: 16 }}>✓</Text>}
                </Pressable>
              </View>
            );
          })}
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
});
