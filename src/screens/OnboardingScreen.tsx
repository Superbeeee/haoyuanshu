import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { useStore } from '../store';
import { FONT_SERIF, FONT_SERIF_MEDIUM } from '../theme/tokens';
import { PaperBg } from '../components/PaperBg';
import { Seal } from '../components/Seal';

export function OnboardingScreen() {
  const { T } = useTheme();
  const updateSettings = useStore((s) => s.updateSettings);

  const select = (mode: 'plan' | 'daily') => {
    updateSettings({ appMode: mode });
  };

  return (
    <View style={[styles.container, { backgroundColor: T.bg }]}>
      <PaperBg />
      <View style={styles.content}>
        {/* 標題區 */}
        <View style={styles.header}>
          <Seal text="願" size={48} color={T.vermilion} />
          <Text
            style={[
              styles.title,
              { color: T.ink, fontFamily: FONT_SERIF_MEDIUM },
            ]}
          >
            好 願 書
          </Text>
          <Text style={[styles.subtitle, { color: T.inkMuted }]}>
            一念一功德
          </Text>
        </View>

        {/* 卡片 */}
        <View style={styles.cards}>
          <Pressable
            onPress={() => select('plan')}
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: T.bgElevated,
                borderColor: pressed ? T.vermilion : T.hairline,
                transform: [{ translateY: pressed ? -2 : 0 }],
              },
            ]}
          >
            <View style={styles.cardRow}>
              <Seal text="願" size={44} color={T.vermilion} />
              <View style={styles.cardText}>
                <Text
                  style={[
                    styles.cardTitle,
                    { color: T.ink, fontFamily: FONT_SERIF_MEDIUM },
                  ]}
                >
                  發願計劃
                </Text>
                <Text style={[styles.cardSub, { color: T.inkMuted }]}>
                  Structured Vow
                </Text>
              </View>
              <Text style={{ color: T.inkFaint, fontSize: 18 }}>›</Text>
            </View>
            <View style={[styles.cardDesc, { borderTopColor: T.hairline }]}>
              <Text
                style={[styles.descText, { color: T.inkMuted }]}
              >
                設定每日遍數、持續天數，以計劃形式記錄念誦功德
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => select('daily')}
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: T.bgElevated,
                borderColor: pressed ? T.sage : T.hairline,
                transform: [{ translateY: pressed ? -2 : 0 }],
              },
            ]}
          >
            <View style={styles.cardRow}>
              <Seal text="日" size={44} color={T.sage} />
              <View style={styles.cardText}>
                <Text
                  style={[
                    styles.cardTitle,
                    { color: T.ink, fontFamily: FONT_SERIF_MEDIUM },
                  ]}
                >
                  日常記錄
                </Text>
                <Text style={[styles.cardSub, { color: T.inkMuted }]}>
                  Daily Practice
                </Text>
              </View>
              <Text style={{ color: T.inkFaint, fontSize: 18 }}>›</Text>
            </View>
            <View style={[styles.cardDesc, { borderTopColor: T.hairline }]}>
              <Text
                style={[styles.descText, { color: T.inkMuted }]}
              >
                隨心記錄每日念誦，無目標約束，純粹修行
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 20, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 48 },
  title: { fontSize: 32, letterSpacing: 12, marginTop: 16 },
  subtitle: { fontSize: 13, letterSpacing: 6, marginTop: 8 },
  cards: { gap: 16 },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 19, letterSpacing: 3, marginBottom: 4 },
  cardSub: { fontSize: 13, letterSpacing: 1 },
  cardDesc: { marginTop: 16, paddingTop: 14, borderTopWidth: 1 },
  descText: { fontSize: 13, lineHeight: 22, letterSpacing: 1 },
});
