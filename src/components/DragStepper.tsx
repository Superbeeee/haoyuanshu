import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  PanResponder,
  Animated,
} from 'react-native';
import { useTheme } from '../theme/useTheme';
import { FONT_SERIF, FONT_SERIF_MEDIUM } from '../theme/tokens';

// 每 DRAG_UNIT 像素 = 1 個單位
const DRAG_UNIT = 10;

type Props = {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  suffix: string;
  label?: string;
};

export function DragStepper({
  value,
  onChange,
  min = 1,
  max = 999,
  suffix,
  label,
}: Props) {
  const { T } = useTheme();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const draftRef = useRef(value);
  const startRef = useRef(value);
  const hintAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) {
      setDraft(value);
      draftRef.current = value;
      hintAnim.setValue(0);
      Animated.loop(
        Animated.sequence([
          Animated.timing(hintAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(hintAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 3 }
      ).start();
    }
  }, [open, value, hintAnim]);

  const setDraftSafe = (n: number) => {
    const clamped = Math.max(min, Math.min(max, Math.floor(n)));
    draftRef.current = clamped;
    setDraft(clamped);
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 2,
      onPanResponderGrant: () => {
        startRef.current = draftRef.current;
      },
      onPanResponderMove: (_, g) => {
        const delta = Math.round(-g.dy / DRAG_UNIT);
        setDraftSafe(startRef.current + delta);
      },
    })
  ).current;

  const confirm = () => {
    onChange(draftRef.current);
    setOpen(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={[
          styles.display,
          { backgroundColor: T.bgSunken, borderColor: T.hairline },
        ]}
      >
        <Text
          style={[
            styles.displayNum,
            { color: T.ink, fontFamily: FONT_SERIF_MEDIUM },
          ]}
        >
          {value}
        </Text>
        <Text
          style={[
            styles.displaySuffix,
            { color: T.inkMuted, fontFamily: FONT_SERIF },
          ]}
        >
          {suffix}
        </Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={[
              styles.card,
              { backgroundColor: T.bgElevated, borderColor: T.hairline },
            ]}
          >
            {label && (
              <Text style={[styles.cardLabel, { color: T.inkMuted }]}>
                {label}
              </Text>
            )}

            <View
              style={[
                styles.dragArea,
                { backgroundColor: T.bgSunken, borderColor: T.hairline },
              ]}
              {...pan.panHandlers}
            >
              <Text style={[styles.arrow, { color: T.inkFaint }]}>▲</Text>
              <View style={styles.numRow}>
                <Text
                  style={[
                    styles.bigNum,
                    { color: T.ink, fontFamily: FONT_SERIF_MEDIUM },
                  ]}
                >
                  {draft}
                </Text>
                <Text
                  style={[
                    styles.bigSuffix,
                    { color: T.inkMuted, fontFamily: FONT_SERIF },
                  ]}
                >
                  {suffix}
                </Text>
              </View>
              <Text style={[styles.arrow, { color: T.inkFaint }]}>▼</Text>
              <Animated.Text
                style={[
                  styles.tip,
                  { color: T.inkMuted, opacity: hintAnim },
                ]}
              >
                上下滑動調整
              </Animated.Text>
            </View>

            <View style={styles.btnRow}>
              <Pressable
                onPress={() => setOpen(false)}
                style={[styles.cancelBtn, { borderColor: T.hairlineStrong }]}
              >
                <Text style={[styles.cancelText, { color: T.inkMuted }]}>
                  取 消
                </Text>
              </Pressable>
              <Pressable
                onPress={confirm}
                style={[styles.confirmBtn, { backgroundColor: T.ink }]}
              >
                <Text
                  style={[
                    styles.confirmText,
                    { color: T.bg, fontFamily: FONT_SERIF_MEDIUM },
                  ]}
                >
                  確 認
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  display: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 6,
  },
  displayNum: { fontSize: 28, lineHeight: 32 },
  displaySuffix: { fontSize: 13, letterSpacing: 2 },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  card: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 11,
    letterSpacing: 6,
    marginBottom: 12,
  },
  dragArea: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 20,
    alignItems: 'center',
  },
  arrow: { fontSize: 12, lineHeight: 14 },
  numRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    paddingVertical: 6,
  },
  bigNum: { fontSize: 56, lineHeight: 60 },
  bigSuffix: { fontSize: 16, letterSpacing: 2 },
  tip: { fontSize: 10, letterSpacing: 3, marginTop: 6 },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 100,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelText: { fontSize: 13, letterSpacing: 4 },
  confirmBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 100,
    alignItems: 'center',
  },
  confirmText: { fontSize: 13, letterSpacing: 4 },
});
