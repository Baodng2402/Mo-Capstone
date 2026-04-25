import { ScrollView, Text } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { isCloudinaryConfigured } from '@/config/env';

export default function ProfileScreen() {
  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerClassName="gap-4 p-4">
      <AppCard className="gap-2">
        <Text className="text-lg font-semibold text-slate-950">Mobile setup</Text>
        <Text className="text-sm text-slate-600">Auth token storage: SecureStore</Text>
        <Text className="text-sm text-slate-600">API cache: TanStack Query</Text>
        <Text className="text-sm text-slate-600">
          Cloudinary env: {isCloudinaryConfigured ? 'configured' : 'not configured'}
        </Text>
      </AppCard>
    </ScrollView>
  );
}
