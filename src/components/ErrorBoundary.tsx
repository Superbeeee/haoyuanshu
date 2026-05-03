import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { FONT_SERIF, FONT_SERIF_MEDIUM } from '../theme/tokens';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>程 式 暫 遇 阻 滯</Text>
        <Text style={styles.subtitle}>SOMETHING WENT WRONG</Text>
        {__DEV__ && this.state.error && (
          <Text style={styles.detail} numberOfLines={6}>
            {this.state.error.message}
          </Text>
        )}
        <Pressable onPress={this.reset} style={styles.btn}>
          <Text style={styles.btnText}>重 新 開 始</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EFE1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 22,
    letterSpacing: 6,
    color: '#1F1B14',
    fontFamily: FONT_SERIF_MEDIUM,
  },
  subtitle: {
    fontSize: 11,
    letterSpacing: 4,
    color: 'rgba(31,27,20,0.5)',
    marginTop: 6,
  },
  detail: {
    marginTop: 24,
    fontSize: 12,
    color: 'rgba(31,27,20,0.6)',
    fontFamily: FONT_SERIF,
    textAlign: 'center',
    lineHeight: 18,
  },
  btn: {
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderWidth: 1,
    borderColor: '#B33A2B',
    borderRadius: 100,
  },
  btnText: {
    fontSize: 13,
    letterSpacing: 4,
    color: '#B33A2B',
    fontFamily: FONT_SERIF_MEDIUM,
  },
});
