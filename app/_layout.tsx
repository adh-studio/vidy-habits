import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { runInitialMigration } from '@/db/client';
import { configureNotifications } from '@/lib/notifications';

export default function RootLayout() {
  useEffect(() => {
    runInitialMigration();
    configureNotifications();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="modals/new-habit"
          options={{ presentation: 'modal', headerShown: true, title: 'Nouvelle habitude' }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
