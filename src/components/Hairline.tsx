import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/useTheme';

type Props = {
  vertical?: boolean;
  style?: ViewStyle;
};

export function Hairline({ vertical = false, style }: Props) {
  const { T } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: T.hairline,
          ...(vertical
            ? { width: 1, alignSelf: 'stretch' as const }
            : { height: 1, width: '100%' }),
        },
        style,
      ]}
    />
  );
}
