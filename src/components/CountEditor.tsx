import React, { useRef, useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  PanResponder,
  Animated,
} from 'react-native';
import { useTheme } from '../theme/useTheme';
import { t } from '../i18n';

type Props = {
  visible: boolean;
  date: string | null;
  initialCount: number;
  onClose: () => void;
  onSave: (count: number) => void;
};

// 上下滑動調整：每滑動 DRAG_UNIT 像素 = 1 遍
const DRAG_UNIT = 12;

export function CountEditor({
  visible,
  date,
  initialCount,
  onClose,
  onSave,
}: Props) {
  const { T } = useTheme();
  const [count, setCount] = useState(initialCount);
  const countRef = useRef(initialCount);
  const startCountRef = useRef(initialCount);
  const hintAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setCount(initialCount);
      countRef.current = initialCount;
      // 拖曳提示閃動
      hintAnim.setValue(0);
      Animated.loop(
        Animated.sequence([
          Animated.timing(hintAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(hintAnim, {
            toValue: 0,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 3 }
      ).start();
    }
  }, [visible, initialCount, hintAnim]);

  const updateCount = (n: number) => {
    const clamped = Math.max(0, Math.floor(n));
    countRef.current = clamped;
    setCount(clamped);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 2,
      onPanResponderGrant: () => {
        startCountRef.current = countRef.current;
      },
      onPanResponderMove: (_, g) => {
        // 向上拖 = 增加（dy 為負），向下拖 = 減少
        const delta = Math.round(-g.dy / DRAG_UNIT);
        updateCount(startCountRef.current + delta);
      },
    })
  ).current;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.card,
            { backgroundColor: T.bgElevated, borderColor: T.hairline },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={[styles.label, { color: T.inkMuted }]}>
            {t('countEditor.title')}
          </Text>
          <Text
            style={[
              styles.date,
              { color: T.ink, fontFamily: T.fontSerifMedium },
            ]}
          >
            {date}
          </Text>

          {/* 可拖曳的數字區 */}
          <View
            style={[
              styles.dragArea,
              { backgroundColor: T.bgSunken, borderColor: T.hairline },
            ]}
            {...panResponder.panHandlers}
          >
            <Text style={[styles.dragHintTop, { color: T.inkFaint }]}>▲</Text>
            <Text
              style={[
                styles.countNum,
                { color: T.ink, fontFamily: T.fontSerif },
              ]}
            >
              {count}
            </Text>
            <Text style={[styles.dragHintBot, { color: T.inkFaint }]}>▼</Text>
            <Animated.Text
              style={[
                styles.dragTip,
                { color: T.inkMuted, opacity: hintAnim },
              ]}
            >
              {t('countEditor.dragHint')}
            </Animated.Text>
          </View>

          {/* 微調按鈕 */}
          <View style={styles.stepRow}>
            <Pressable
              onPress={() => updateCount(countRef.current - 1)}
              style={[styles.stepBtn, { borderColor: T.hairlineStrong }]}
            >
              <Text style={{ color: T.ink, fontSize: 20 }}>−1</Text>
            </Pressable>
            <Pressable
              onPress={() => updateCount(countRef.current + 1)}
              style={[styles.stepBtn, { borderColor: T.hairlineStrong }]}
            >
              <Text style={{ color: T.ink, fontSize: 20 }}>+1</Text>
            </Pressable>
          </View>

          {/* 快捷批量 */}
          <View style={styles.quickRow}>
            {[-10, 10, 50, 100].map((n) => (
              <Pressable
                key={n}
                onPress={() => updateCount(countRef.current + n)}
                style={[styles.quickBtn, { borderColor: T.hairlineStrong }]}
              >
                <Text style={[styles.quickText, { color: T.inkSoft }]}>
                  {n > 0 ? `+${n}` : n}
                </Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => updateCount(0)}
              style={[styles.quickBtn, { borderColor: T.hairlineStrong }]}
            >
              <Text style={[styles.quickText, { color: T.inkSoft }]}>{t('countEditor.reset')}</Text>
            </Pressable>
          </View>

          <View style={styles.actionRow}>
            <Pressable
              onPress={onClose}
              style={[styles.cancelBtn, { borderColor: T.hairlineStrong }]}
            >
              <Text style={[styles.cancelText, { color: T.inkMuted }]}>
                {t('common.cancel')}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => onSave(countRef.current)}
              style={[styles.saveBtn, { backgroundColor: T.ink }]}
            >
              <Text
                style={[
                  styles.saveText,
                  { color: T.bg, fontFamily: T.fontSerifMedium },
                ]}
              >
                {t('common.save')}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  card: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
  },
  label: { fontSize: 11, letterSpacing: 6 },
  date: { fontSize: 20, letterSpacing: 2, marginTop: 4 },
  dragArea: {
    marginTop: 16,
    width: '100%',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  dragHintTop: { fontSize: 12, marginBottom: 4 },
  dragHintBot: { fontSize: 12, marginTop: 4 },
  countNum: { fontSize: 54, lineHeight: 60 },
  dragTip: { fontSize: 10, letterSpacing: 3, marginTop: 6 },
  stepRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    width: '100%',
  },
  stepBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1,
    alignItems: 'center',
  },
  quickRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  quickBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 100,
    borderWidth: 1,
  },
  quickText: { fontSize: 11, letterSpacing: 2 },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 100,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelText: { fontSize: 13, letterSpacing: 4 },
  saveBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 100,
    alignItems: 'center',
  },
  saveText: { fontSize: 13, letterSpacing: 4 },
});
