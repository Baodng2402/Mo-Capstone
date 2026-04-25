import { Link } from 'expo-router';
import { CalendarCheck, Camera, History, MapPinned, ShieldCheck } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';

const quickActions = [
  {
    href: '/scan',
    icon: Camera,
    label: 'Scan skin',
    value: 'AI-assisted face analysis',
  },
  {
    href: '/scan/history',
    icon: History,
    label: 'Progress',
    value: 'Track skin indicators',
  },
  {
    href: '/clinics',
    icon: MapPinned,
    label: 'Clinics',
    value: 'Find nearby providers',
  },
  {
    href: '/profile',
    icon: ShieldCheck,
    label: 'Privacy',
    value: 'Secure preferences',
  },
] as const;

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerClassName="gap-4 p-4">
      <View className="gap-1">
        <Text className="text-2xl font-semibold text-slate-950">GlowScan</Text>
        <Text className="text-sm text-slate-600">
          Skin analysis, beauty recommendations, and clinic discovery.
        </Text>
      </View>

      <AppCard className="gap-3 bg-emerald-50">
        <View className="flex-row items-center gap-3">
          <View className="h-11 w-11 items-center justify-center rounded-lg bg-emerald-600">
            <CalendarCheck color="#ffffff" size={22} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-emerald-950">MVP workspace ready</Text>
            <Text className="text-sm text-emerald-800">
              Camera, image upload, auth storage, API cache, maps, and Cloudinary helpers are wired.
            </Text>
          </View>
        </View>
      </AppCard>

      <View className="gap-3">
        {quickActions.map((item) => {
          const Icon = item.icon;

          return (
            <Link href={item.href} key={item.href} asChild>
              <Pressable>
                <AppCard>
                  <View className="flex-row items-center gap-3">
                    <View className="h-10 w-10 items-center justify-center rounded-lg bg-slate-900">
                      <Icon color="#ffffff" size={20} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-slate-950">{item.label}</Text>
                      <Text className="text-sm text-slate-600">{item.value}</Text>
                    </View>
                  </View>
                </AppCard>
              </Pressable>
            </Link>
          );
        })}
      </View>
    </ScrollView>
  );
}
