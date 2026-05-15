import React, { useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../theme/useTheme';
import { FONT_SERIF, FONT_SERIF_MEDIUM } from '../theme/tokens';
import { formatLocalDate } from '../utils/date';

type Props = {
  visible: boolean;
  onClose: () => void;
  onPick: (date: string, count: number) => void;
  counts: Record<string, number>; // date -> count
  days?: number; // 預設 90
  accentColor?: string;
};

const DAY_NAMES = ['日', '一', '二', '三', '四', '五', '六'];

export function DatePickerSheet({
  visible,
  onClose,
  onPick,
  counts,
  days = 90,
  accentColor,
}: Props) {
  const { T } = useTheme();
  const todayStr = formatLocalDate();
  const accent = accentColor ?? T.vermilion;

  const list = useMemo(() => {
    const now = new Date();
    return Array.from({ length: days }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = formatLocalDate(d);
      return {
        date: dateStr,
        count: counts[dateStr] ?? 0,
        month: d.getMonth() + 1,
        day: d.getDate(),
        weekday: DAY_NAMES[d.getDay()],
        isToday: dateStr === todayStr,
      };
    });
  }, [counts, days, todayStr]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            { backgroundColor: T.bgElevated, borderColor: T.hairline },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={[styles.handle, { backgroundColor: T.hairlineStrong }]} />
          <View style={styles.header}>
            <Text style={[styles.title, { color: T.ink, fontFamily: FONT_SERIF_MEDIUM }]}>
              選 擇 日 期
            </Text>
            <Text style={[styles.subtitle, { color: T.inkMuted }]}>
              近 {days} 日 · 點選以編輯遍數
            </Text>
          </View>

          <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
            {list.map((d) => (
              <Pressable
                key={d.date}
                onPress={() => onPick(d.date, d.count)}
                style={[styles.row, { borderColor: T.hairline }]}
              >
                <View style={styles.rowLeft}>
                  <View
                    style={[
                      styles.dot,
                      {
                        backgroundColor:
                          d.count > 0 ? accent : T.hairline,
                        borderColor: d.isToday ? accent : 'transparent',
                      },
                    ]}
                  />
                  <View>
                    <Text
                      style={[
                        styles.dateText,
                        {
                          color: T.ink,
                          fontFamily: FONT_SERIF_MEDIUM,
                        },
                      ]}
                    >
                      {d.month}/{d.day}
                      {d.isToday && (
                        <Text style={{ color: accent, fontSize: 11 }}>  · 今日</Text>
                      )}
                    </Text>
                    <Text style={[styles.weekday, { color: T.inkFaint }]}>
                      週{d.weekday} · {d.date}
                    </Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.countText,
                    { color: T.ink, fontFamily: FONT_SERIF },
                  ]}
                >
                  {d.count}
                  <Text style={{ color: T.inkFaint, fontSize: 11 }}> 遍</Text>
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <Pressable
            onPress={onClose}
            style={[styles.closeBtn, { borderColor: T.hairlineStrong }]}
          >
            <Text style={[styles.closeText, { color: T.inkMuted }]}>關 閉</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    maxHeight: '85%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 12,
  },
  header: { alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 18, letterSpacing: 4 },
  subtitle: { fontSize: 11, letterSpacing: 3, marginTop: 2 },
  list: { flexGrow: 0 },
  listContent: { paddingVertical: 8 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  dateText: { fontSize: 15, letterSpacing: 1 },
  weekday: { fontSize: 10, letterSpacing: 1, marginTop: 2 },
  countText: { fontSize: 18, letterSpacing: 1 },
  closeBtn: {
    marginTop: 10,
    padding: 12,
    borderRadius: 100,
    borderWidth: 1,
    alignItems: 'center',
  },
  closeText: { fontSize: 13, letterSpacing: 4 },
});
