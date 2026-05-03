import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlanStackParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { CreatePlanScreen } from '../screens/CreatePlanScreen';
import { TodayScreen } from '../screens/TodayScreen';
import { ImmersiveScreen } from '../screens/ImmersiveScreen';
import { CompleteScreen } from '../screens/CompleteScreen';
import { ArchiveScreen } from '../screens/ArchiveScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator<PlanStackParamList>();

export function PlanNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CreatePlan" component={CreatePlanScreen} />
      <Stack.Screen name="Today" component={TodayScreen} />
      <Stack.Screen
        name="Immersive"
        component={ImmersiveScreen}
        options={{ presentation: 'fullScreenModal', animation: 'fade' }}
      />
      <Stack.Screen name="Complete" component={CompleteScreen} />
      <Stack.Screen name="Archive" component={ArchiveScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
