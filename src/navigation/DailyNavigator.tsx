import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DailyStackParamList } from './types';
import { DailyScreen } from '../screens/DailyScreen';
import { ArchiveScreen } from '../screens/ArchiveScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { LanguageScreen } from '../screens/LanguageScreen';

const Stack = createNativeStackNavigator<DailyStackParamList>();

export function DailyNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DailyMain" component={DailyScreen} />
      <Stack.Screen name="Archive" component={ArchiveScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
    </Stack.Navigator>
  );
}
