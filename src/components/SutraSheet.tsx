import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/useTheme';
import { FONT_SERIF, FONT_SERIF_MEDIUM } from '../theme/tokens';

type SutraLine = { t: string; big?: boolean; mantra?: boolean };

const SUTRA_TEXT: SutraLine[] = [
  { t: '般若波羅蜜多心經', big: true },
  { t: '觀自在菩薩，行深般若波羅蜜多時，照見五蘊皆空，度一切苦厄。' },
  { t: '舍利子，色不異空，空不異色；色即是空,空即是色。受、想、行、識，亦復如是。' },
  { t: '舍利子，是諸法空相，不生不滅，不垢不淨，不增不減。' },
  { t: '是故空中無色，無受、想、行、識；無眼、耳、鼻、舌、身、意；無色、聲、香、味、觸、法；無眼界,乃至無意識界。' },
  { t: '無無明，亦無無明盡；乃至無老死，亦無老死盡。' },
  { t: '無苦、集、滅、道。無智亦無得，以無所得故。' },
  { t: '菩提薩埵，依般若波羅蜜多故，心無罣礙；無罣礙故，無有恐怖，遠離顛倒夢想，究竟涅槃。' },
  { t: '三世諸佛，依般若波羅蜜多故，得阿耨多羅三藐三菩提。' },
  { t: '故知般若波羅蜜多，是大神咒，是大明咒，是無上咒，是無等等咒，能除一切苦，真實不虛。' },
  { t: '故說般若波羅蜜多咒，即說咒曰：' },
  { t: '揭諦揭諦，波羅揭諦，波羅僧揭諦，菩提薩婆訶。', mantra: true },
];

const SCREEN_H = Dimensions.get('window').height;
// 三個吸附高度：峰值、居中、收合（只看標題）
const SNAP_FULL = Math.floor(SCREEN_H * 0.85);
const SNAP_MIDDLE = Math.floor(SCREEN_H * 0.48);
const SNAP_COLLAPSED = 96;

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function SutraSheet({ visible, onClose }: Props) {
  const { T } = useTheme();
  const insets = useSafeAreaInsets();
  const [fontSize, setFontSize] = useState(18);

  const heightAnim = useRef(new Animated.Value(0)).current;
  const heightRef = useRef(0);
  const startHeightRef = useRef(0);

  useEffect(() => {
    const id = heightAnim.addListener(({ value }) => {
      heightRef.current = value;
    });
    return () => heightAnim.removeListener(id);
  }, [heightAnim]);

  useEffect(() => {
    if (visible) {
      Animated.spring(heightAnim, {
        toValue: SNAP_MIDDLE,
        useNativeDriver: false,
        bounciness: 4,
        speed: 16,
      }).start();
    } else {
      Animated.timing(heightAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: false,
      }).start();
    }
  }, [visible, heightAnim]);

  const snapTo = (target: number) => {
    Animated.spring(heightAnim, {
      toValue: target,
      useNativeDriver: false,
      bounciness: 3,
      speed: 18,
    }).start();
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 2,
      onPanResponderGrant: () => {
        startHeightRef.current = heightRef.current;
        heightAnim.stopAnimation();
      },
      onPanResponderMove: (_, g) => {
        // 向下拖 = 展開、向上拖 = 收合
        const next = Math.max(
          0,
          Math.min(SNAP_FULL + 40, startHeightRef.current + g.dy)
        );
        heightAnim.setValue(next);
      },
      onPanResponderRelease: (_, g) => {
        const h = heightRef.current;
        // 快速向上甩動或已拖到很小 → 關閉
        if (g.vy < -0.9 || h < SNAP_COLLAPSED * 0.55) {
          onClose();
          return;
        }
        // 帶速度偏向：向下拉取最近的較大值
        const targets = [SNAP_COLLAPSED, SNAP_MIDDLE, SNAP_FULL];
        let nearest = targets[0];
        let bestDist = Math.abs(h - nearest);
        for (const t of targets) {
          const d = Math.abs(h - t);
          if (d < bestDist) {
            bestDist = d;
            nearest = t;
          }
        }
        if (g.vy > 0.6 && h < SNAP_FULL) {
          nearest = h < SNAP_MIDDLE ? SNAP_MIDDLE : SNAP_FULL;
        } else if (g.vy < -0.6) {
          nearest = h > SNAP_MIDDLE ? SNAP_MIDDLE : SNAP_COLLAPSED;
        }
        snapTo(nearest);
      },
    })
  ).current;

  return (
    <Animated.View
      pointerEvents={visible ? 'box-none' : 'none'}
      style={[
        styles.panel,
        {
          height: heightAnim,
          backgroundColor: T.bg,
          borderBottomColor: T.hairlineStrong,
          shadowColor: '#000',
        },
      ]}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
          <Text style={{ color: T.inkSoft, fontSize: 20 }}>✕</Text>
        </Pressable>
        <Text
          style={[styles.title, { color: T.ink, fontFamily: FONT_SERIF }]}
        >
          心 經
        </Text>
        <View style={styles.fontButtons}>
          <Pressable
            onPress={() => setFontSize((s) => Math.max(14, s - 2))}
            style={[styles.fontBtn, { borderColor: T.hairlineStrong }]}
          >
            <Text
              style={[
                styles.fontBtnText,
                { color: T.inkSoft, fontFamily: FONT_SERIF },
              ]}
            >
              小
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setFontSize((s) => Math.min(26, s + 2))}
            style={[styles.fontBtn, { borderColor: T.hairlineStrong }]}
          >
            <Text
              style={[
                styles.fontBtnText,
                {
                  color: T.inkSoft,
                  fontSize: 16,
                  fontFamily: FONT_SERIF,
                },
              ]}
            >
              大
            </Text>
          </Pressable>
        </View>
      </View>

      {/* 經文（可捲動） */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {SUTRA_TEXT.map((line, i) => (
          <Text
            key={i}
            style={{
              fontFamily: line.big ? FONT_SERIF_MEDIUM : FONT_SERIF,
              fontSize: line.big ? 22 : fontSize,
              color: line.mantra ? T.vermilion : T.ink,
              lineHeight: (line.big ? 22 : fontSize) * 2,
              letterSpacing: 2,
              textAlign: line.big ? 'center' : 'justify',
              marginBottom: line.big ? 22 : 14,
              paddingLeft: line.big ? 0 : 24,
              paddingRight: line.big ? 0 : 16,
            }}
          >
            {line.t}
          </Text>
        ))}
        <Text
          style={[
            styles.endMark,
            { color: T.inkFaint, fontFamily: FONT_SERIF },
          ]}
        >
          · 終 ·
        </Text>
      </ScrollView>

      {/* 拖曳手柄（底部） */}
      <View style={styles.handleArea} {...pan.panHandlers}>
        <View
          style={[styles.handle, { backgroundColor: T.hairlineStrong }]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    overflow: 'hidden',
    zIndex: 100,
    elevation: 12,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  closeBtn: { padding: 4, width: 40 },
  title: { fontSize: 14, letterSpacing: 6 },
  fontButtons: { flexDirection: 'row', gap: 4, width: 72, justifyContent: 'flex-end' },
  fontBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontBtnText: { fontSize: 12 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 20 },
  endMark: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 13,
    letterSpacing: 8,
  },
  handleArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 48,
    height: 5,
    borderRadius: 3,
  },
});
