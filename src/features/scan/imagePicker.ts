import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

const imagePickerOptions = {
  allowsEditing: true,
  aspect: [3, 4] as [number, number],
  mediaTypes: ['images'] as ImagePicker.MediaType[],
  quality: 0.9,
};

export async function pickFaceImage() {
  const result = await ImagePicker.launchImageLibraryAsync(imagePickerOptions);

  if (result.canceled) {
    return null;
  }

  return normalizeScanImage(result.assets[0]);
}

export async function captureFaceImage() {
  const permission = await ImagePicker.requestCameraPermissionsAsync();

  if (!permission.granted) {
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    ...imagePickerOptions,
    cameraType: ImagePicker.CameraType.front,
  });

  if (result.canceled) {
    return null;
  }

  return normalizeScanImage(result.assets[0]);
}

async function normalizeScanImage(asset: ImagePicker.ImagePickerAsset) {
  const image = await ImageManipulator.manipulateAsync(asset.uri, [{ resize: { width: 1440 } }], {
    compress: 0.86,
    format: ImageManipulator.SaveFormat.JPEG,
  });

  return {
    fileName: asset.fileName ?? `scan-${Date.now()}.jpg`,
    height: image.height,
    mimeType: 'image/jpeg',
    uri: image.uri,
    width: image.width,
  };
}
