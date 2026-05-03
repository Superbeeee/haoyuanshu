import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme/useTheme';
import { useStore } from '../store';
import { FONT_SERIF, FONT_SERIF_MEDIUM } from '../theme/tokens';
import { PaperBg } from '../components/PaperBg';
import { DragStepper } from '../components/DragStepper';
import { scheduleDailyReminder } from '../utils/notifications';
import { PlanStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<PlanStackParamList, 'CreatePlan'>;

const COLORS = [
  { key: 'vermilion', name: '朱砂' },
  { key: 'gold', name: '赭金' },
  { key: 'sage', name: '茶綠' },
  { key: 'wood', name: '木棕' },
  { key: 'ink', name: '墨黑' },
] as const;

const SEAL_MAP: Record<string, string> = {
  vermilion: '願',
  gold: '智',
  sage: '眾',
  wood: '行',
  ink: '定',
};

// 對應封存分類：label 是 chip 顯示、name 是實際存進 dedicatedTo（即「為 {name} 而念」）
const DEDICATIONS = [
  { key: 'family', label: '為家人', name: '家人', icon: '🏠' },
  { key: 'self', label: '自迴向', name: '自己', icon: '🙏' },
  { key: 'beings', label: '為眾生', name: '眾生', icon: '🌍' },
  { key: 'deceased', label: '為亡者', name: '亡者', icon: '🪷' },
  { key: 'other', label: '其他自訂', name: '', icon: '✦' },
] as const;

const TIME_RE = /^([01]?\d|2[0-3]):([0-5]?\d)$/;

// 把 "6:30" / "06:30" 之類的合法輸入正規化成 "06:30"；不合法回 null
function normalizeTime(raw: string): string | null {
  const m = raw.trim().match(TIME_RE);
  if (!m) return null;
  const h = String(Number(m[1])).padStart(2, '0');
  const min = String(Number(m[2])).padStart(2, '0');
  return `${h}:${min}`;
}

export function CreatePlanScreen({ navigation }: Props) {
  const { T } = useTheme();
  const addPlan = useStore((s) => s.addPlan);

  const [planType, setPlanType] = useState<'goal' | 'casual'>('goal');
  const [name, setName] = useState('');
  const [dedicationType, setDedicationType] = useState<string>('family');
  const [customName, setCustomName] = useState('');
  const [daily, setDaily] = useState(7);
  const [duration, setDuration] = useState(49);
  const [reminder, setReminder] = useState('06:30');
  const [colorKey, setColorKey] = useState<string>('vermilion');
  const [note, setNote] = useState('');

  const total = daily * duration;
  const colorValue = T[colorKey as keyof typeof T] as string;

  const selectedDed = DEDICATIONS.find((d) => d.key === dedicationType)!;
  const dedicatedToValue =
    dedicationType === 'other' ? customName.trim() : selectedDed.name;

  const normalizedReminder = normalizeTime(reminder);
  const reminderValid = normalizedReminder !== null;
  const canSubmit = name.trim().length > 0 && reminderValid;

  const handleCreate = async () => {
    if (!canSubmit || !normalizedReminder) return;
    // 若選其他但沒填名字，以「自己」fallback
    const finalDedicatedTo =
      dedicationType === 'other' && !customName.trim()
        ? '自己'
        : dedicatedToValue;
    const planId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

    await scheduleDailyReminder(planId, name, normalizedReminder);

    addPlan({
      id: planId,
      name: name.trim(),
      dedicatedTo: finalDedicatedTo,
      daily: planType === 'casual' ? 0 : daily,
      duration: planType === 'casual' ? 0 : duration,
      currentDay: 1,
      color: colorValue,
      seal: SEAL_MAP[colorKey] || '願',
      note,
      startDate: new Date().toISOString().split('T')[0],
      reminder: normalizedReminder,
      status: 'active',
      planType,
      dedicationType,
    });
    navigation.goBack();
  };

  const inputStyle = [
    styles.input,
    {
      color: T.ink,
      borderBottomColor: T.hairlineStrong,
      fontFamily: FONT_SERIF,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: T.bg }]}>
      <PaperBg />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* 標題 */}
          <Text style={[styles.subtitle, { color: T.inkMuted }]}>
            NEW VOW
          </Text>
          <Text
            style={[
              styles.pageTitle,
              { color: T.ink, fontFamily: FONT_SERIF_MEDIUM },
            ]}
          >
            發 願
          </Text>

          {/* 類型選擇 */}
          <View style={styles.typeRow}>
            <Pressable
              onPress={() => setPlanType('goal')}
              style={[
                styles.typeBtn,
                {
                  backgroundColor: planType === 'goal' ? T.ink : 'transparent',
                  borderColor: T.hairlineStrong,
                },
              ]}
            >
              <Text
                style={[
                  styles.typeBtnText,
                  {
                    color: planType === 'goal' ? T.bg : T.inkMuted,
                    fontFamily: FONT_SERIF,
                  },
                ]}
              >
                目 標
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setPlanType('casual')}
              style={[
                styles.typeBtn,
                {
                  backgroundColor: planType === 'casual' ? T.ink : 'transparent',
                  borderColor: T.hairlineStrong,
                },
              ]}
            >
              <Text
                style={[
                  styles.typeBtnText,
                  {
                    color: planType === 'casual' ? T.bg : T.inkMuted,
                    fontFamily: FONT_SERIF,
                  },
                ]}
              >
                日 常
              </Text>
            </Pressable>
          </View>

          {/* 願名 */}
          <Text style={[styles.label, { color: T.inkMuted }]}>願名 · TITLE</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="為誰而願"
            placeholderTextColor={T.inkFaint}
            style={inputStyle}
          />

          {/* 發願對象 — chip 分類 */}
          <Text style={[styles.label, { color: T.inkMuted }]}>
            發願對象 · FOR WHOM
          </Text>
          <View style={styles.dedRow}>
            {DEDICATIONS.map((d) => {
              const active = dedicationType === d.key;
              return (
                <Pressable
                  key={d.key}
                  onPress={() => setDedicationType(d.key)}
                  style={[
                    styles.dedChip,
                    {
                      backgroundColor: active ? T.gold + '22' : 'transparent',
                      borderColor: active ? T.gold : T.hairlineStrong,
                    },
                  ]}
                >
                  <Text style={styles.dedIcon}>{d.icon}</Text>
                  <Text
                    style={[
                      styles.dedLabel,
                      {
                        color: active ? T.gold : T.inkSoft,
                        fontFamily: FONT_SERIF,
                      },
                    ]}
                  >
                    {d.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {dedicationType === 'other' && (
            <TextInput
              value={customName}
              onChangeText={setCustomName}
              placeholder="輸入對象（例：媽媽）"
              placeholderTextColor={T.inkFaint}
              style={inputStyle}
            />
          )}

          {/* Stepper 列（僅目標模式） */}
          {planType === 'goal' && (
            <>
              <View style={styles.stepRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.label, { color: T.inkMuted }]}>
                    每日 · DAILY
                  </Text>
                  <DragStepper
                    value={daily}
                    onChange={setDaily}
                    max={108}
                    suffix="遍"
                    label="每 日 遍 數"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.label, { color: T.inkMuted }]}>
                    持續 · DURATION
                  </Text>
                  <DragStepper
                    value={duration}
                    onChange={setDuration}
                    max={365}
                    suffix="日"
                    label="持 續 天 數"
                  />
                </View>
              </View>

              {/* 總計 */}
              <View style={[styles.totalBox, { backgroundColor: T.bgSunken }]}>
                <Text style={[styles.totalLabel, { color: T.inkMuted }]}>
                  總 計 · TOTAL
                </Text>
                <Text
                  style={[
                    styles.totalValue,
                    { fontFamily: FONT_SERIF_MEDIUM },
                  ]}
                >
                  <Text style={{ color: T.vermilion }}>
                    {total.toLocaleString()}
                  </Text>
                  <Text style={{ color: T.inkMuted, fontSize: 13 }}> 遍</Text>
                </Text>
              </View>
            </>
          )}

          {/* 提醒 */}
          <Text style={[styles.label, { color: T.inkMuted }]}>
            每日提醒 · REMINDER
          </Text>
          <TextInput
            value={reminder}
            onChangeText={setReminder}
            placeholder="06:30"
            placeholderTextColor={T.inkFaint}
            keyboardType="numbers-and-punctuation"
            style={inputStyle}
          />
          {!reminderValid && reminder.trim().length > 0 && (
            <Text style={[styles.hint, { color: T.vermilion }]}>
              時間格式：HH:MM（例：06:30）
            </Text>
          )}

          {/* 封面色 */}
          <Text style={[styles.label, { color: T.inkMuted }]}>
            封面色 · COVER
          </Text>
          <View style={styles.colorRow}>
            {COLORS.map((c) => {
              const cv = T[c.key as keyof typeof T] as string;
              return (
                <Pressable
                  key={c.key}
                  onPress={() => setColorKey(c.key)}
                  style={[
                    styles.colorDot,
                    {
                      backgroundColor: cv,
                      borderColor: colorKey === c.key ? T.ink : 'transparent',
                    },
                  ]}
                  accessibilityLabel={c.name}
                />
              );
            })}
          </View>

          {/* 發願文 */}
          <Text style={[styles.label, { color: T.inkMuted }]}>
            發願文 · VOW (OPTIONAL)
          </Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="願以此功德⋯⋯"
            placeholderTextColor={T.inkFaint}
            multiline
            numberOfLines={3}
            style={[
              ...inputStyle,
              { height: 80, textAlignVertical: 'top' },
            ]}
          />

          {/* 建立按鈕 */}
          <Pressable
            onPress={handleCreate}
            disabled={!canSubmit}
            style={[
              styles.createBtn,
              { backgroundColor: T.ink, opacity: canSubmit ? 1 : 0.35 },
            ]}
          >
            <Text
              style={[
                styles.createBtnText,
                { color: T.bg, fontFamily: FONT_SERIF_MEDIUM },
              ]}
            >
              立 下 此 願
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 40 },
  subtitle: { fontSize: 12, letterSpacing: 6, marginTop: 8 },
  pageTitle: { fontSize: 30, letterSpacing: 6, marginTop: 4, marginBottom: 24 },
  label: {
    fontSize: 11,
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    fontSize: 17,
    paddingVertical: 10,
    borderBottomWidth: 1,
    letterSpacing: 1,
  },
  hint: { fontSize: 12, letterSpacing: 1, marginTop: 6 },
  dedRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 100,
    borderWidth: 1,
  },
  dedIcon: { fontSize: 14 },
  dedLabel: { fontSize: 13, letterSpacing: 2 },
  stepRow: { flexDirection: 'row', gap: 20, marginTop: 8 },
  totalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    marginTop: 16,
  },
  totalLabel: { fontSize: 12, letterSpacing: 4 },
  totalValue: { fontSize: 22 },
  colorRow: { flexDirection: 'row', gap: 14, paddingVertical: 10 },
  colorDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 100,
    borderWidth: 1,
    alignItems: 'center',
  },
  typeBtnText: { fontSize: 14, letterSpacing: 4 },
  createBtn: {
    marginTop: 24,
    padding: 16,
    borderRadius: 100,
    alignItems: 'center',
  },
  createBtnText: { fontSize: 16, letterSpacing: 6 },
});
