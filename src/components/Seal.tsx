import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONT_SERIF } from '../theme/tokens';

type Props = {
  text?: string;
  size?: number;
  color: string;
};

export function Seal({ text = '願', size = 32, color }: Props) {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderColor: color,
          backgroundColor: color + '12',
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          { color, fontSize: size * 0.5, fontFamily: FONT_SERIF },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '500',
  },
});
