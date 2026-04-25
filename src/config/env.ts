const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export const env = {
  apiUrl: trimTrailingSlash(process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'),
  cloudinary: {
    cloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '',
    uploadPreset: process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? '',
    uploadFolder: process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_FOLDER ?? 'glowscan/scans',
  },
};

export const isCloudinaryConfigured =
  env.cloudinary.cloudName.length > 0 && env.cloudinary.uploadPreset.length > 0;
