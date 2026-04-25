import * as Location from 'expo-location';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';

export default function ClinicsScreen() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [message, setMessage] = useState('Location is ready for clinic/spa discovery.');

  const requestLocation = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();

    if (!permission.granted) {
      setMessage('Location permission was not granted.');
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation.coords);
    setMessage('Location captured. Send lat/lng to BE for nearby providers.');
  };

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerClassName="gap-4 p-4">
      <AppCard className="gap-3">
        <Text className="text-lg font-semibold text-slate-950">Nearby providers</Text>
        <Text className="text-sm text-slate-600">{message}</Text>
        {location ? (
          <View className="rounded-lg bg-slate-100 p-3">
            <Text className="text-sm text-slate-700">Lat: {location.latitude}</Text>
            <Text className="text-sm text-slate-700">Lng: {location.longitude}</Text>
          </View>
        ) : null}
        <Pressable className="rounded-lg bg-slate-900 px-4 py-3" onPress={requestLocation}>
          <Text className="text-center font-semibold text-white">Use current location</Text>
        </Pressable>
      </AppCard>
    </ScrollView>
  );
}
