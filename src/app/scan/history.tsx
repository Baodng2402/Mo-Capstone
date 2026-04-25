import { ScrollView, Text, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { ScanResultSummary } from '@/features/scan/types';

const sampleScans: ScanResultSummary[] = [
  {
    createdAt: '2026-05-01',
    indicators: [
      { label: 'Acne', score: 42, status: 'stable' },
      { label: 'Dark spots', score: 35, status: 'improving' },
      { label: 'Dryness', score: 28, status: 'worsening' },
    ],
    scanId: 'sample-1',
  },
];

export default function ScanHistoryScreen() {
  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerClassName="gap-4 p-4">
      {sampleScans.map((scan) => (
        <AppCard className="gap-3" key={scan.scanId}>
          <Text className="text-base font-semibold text-slate-950">{scan.createdAt}</Text>
          <View className="gap-2">
            {scan.indicators.map((indicator) => (
              <View className="flex-row items-center justify-between" key={indicator.label}>
                <Text className="text-sm text-slate-700">{indicator.label}</Text>
                <Text className="text-sm font-semibold text-slate-950">
                  {indicator.score} · {indicator.status}
                </Text>
              </View>
            ))}
          </View>
        </AppCard>
      ))}
    </ScrollView>
  );
}
