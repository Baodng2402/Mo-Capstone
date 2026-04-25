import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { isCloudinaryConfigured } from '@/config/env';
import { captureFaceImage, pickFaceImage } from '@/features/scan/imagePicker';
import { CloudinaryConfigError, uploadImageToCloudinary } from '@/lib/cloudinary/upload';

type ScanImage = Awaited<ReturnType<typeof pickFaceImage>>;

export default function ScanScreen() {
  const [image, setImage] = useState<ScanImage>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('Cloudinary upload is ready for BE integration.');

  const handlePick = async () => {
    setImage(await pickFaceImage());
  };

  const handleCapture = async () => {
    setImage(await captureFaceImage());
  };

  const handleUpload = async () => {
    if (!image) {
      return;
    }

    try {
      setIsUploading(true);
      const result = await uploadImageToCloudinary(image, {
        tags: ['glowscan', 'skin-scan'],
      });
      setMessage(`Uploaded: ${result.public_id}`);
    } catch (error) {
      if (error instanceof CloudinaryConfigError) {
        setMessage('Add Cloudinary env values before direct mobile uploads.');
      } else {
        setMessage('Upload failed. Check network, preset, or backend upload flow.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerClassName="gap-4 p-4">
      <AppCard className="gap-3">
        <Text className="text-lg font-semibold text-slate-950">Face image</Text>
        <View className="aspect-[3/4] overflow-hidden rounded-lg bg-slate-100">
          {image ? (
            <Image source={{ uri: image.uri }} className="h-full w-full" resizeMode="cover" />
          ) : (
            <View className="h-full items-center justify-center px-6">
              <Text className="text-center text-sm text-slate-500">
                Select or capture a face image to prepare an AI scan request.
              </Text>
            </View>
          )}
        </View>

        <View className="flex-row gap-3">
          <Pressable className="flex-1 rounded-lg bg-slate-900 px-4 py-3" onPress={handleCapture}>
            <Text className="text-center font-semibold text-white">Camera</Text>
          </Pressable>
          <Pressable className="flex-1 rounded-lg bg-white px-4 py-3" onPress={handlePick}>
            <Text className="text-center font-semibold text-slate-950">Gallery</Text>
          </Pressable>
        </View>
      </AppCard>

      <AppCard className="gap-3">
        <Text className="text-base font-semibold text-slate-950">Cloudinary handoff</Text>
        <Text className="text-sm text-slate-600">{message}</Text>
        <Pressable
          className={`rounded-lg px-4 py-3 ${
            image && !isUploading ? 'bg-emerald-600' : 'bg-slate-300'
          }`}
          disabled={!image || isUploading}
          onPress={handleUpload}>
          {isUploading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-center font-semibold text-white">
              {isCloudinaryConfigured ? 'Upload image' : 'Waiting for env'}
            </Text>
          )}
        </Pressable>
      </AppCard>
    </ScrollView>
  );
}
