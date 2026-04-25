import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import '../../global.css';

import { AppProviders } from '@/providers/AppProviders';

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: '#f8fafc' },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#f8fafc' },
        }}>
        <Stack.Screen name="index" options={{ title: 'GlowScan' }} />
        <Stack.Screen name="scan/index" options={{ title: 'Face Scan' }} />
        <Stack.Screen name="scan/history" options={{ title: 'Scan History' }} />
        <Stack.Screen name="clinics/index" options={{ title: 'Clinics & Spas' }} />
        <Stack.Screen name="profile/index" options={{ title: 'Profile' }} />
      </Stack>
      <StatusBar style="dark" />
    </AppProviders>
  );
}
