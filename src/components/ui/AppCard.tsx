import { PropsWithChildren } from 'react';
import { View } from 'react-native';

type AppCardProps = PropsWithChildren<{
  className?: string;
}>;

export function AppCard({ children, className = '' }: AppCardProps) {
  return (
    <View className={`rounded-lg border border-zinc-200 bg-white p-4 shadow-sm ${className}`}>
      {children}
    </View>
  );
}
