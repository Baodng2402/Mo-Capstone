import { z } from 'zod';

import { env, isCloudinaryConfigured } from '@/config/env';

const CloudinaryUploadResponseSchema = z.object({
  asset_id: z.string(),
  bytes: z.number(),
  created_at: z.string(),
  format: z.string(),
  height: z.number(),
  public_id: z.string(),
  secure_url: z.string().url(),
  signature: z.string().optional(),
  url: z.string().url(),
  version: z.number(),
  width: z.number(),
});

export type CloudinaryUploadResponse = z.infer<typeof CloudinaryUploadResponseSchema>;

type UploadImageAsset = {
  fileName?: string | null;
  mimeType?: string | null;
  uri: string;
};

type UploadOptions = {
  folder?: string;
  tags?: string[];
};

export class CloudinaryConfigError extends Error {}

export class CloudinaryUploadError extends Error {
  constructor(public readonly payload: unknown) {
    super('Cloudinary upload failed');
  }
}

const getFileName = (asset: UploadImageAsset) => asset.fileName ?? `glowscan-${Date.now()}.jpg`;

const getMimeType = (asset: UploadImageAsset) => asset.mimeType ?? 'image/jpeg';

export async function uploadImageToCloudinary(
  asset: UploadImageAsset,
  options: UploadOptions = {}
) {
  if (!isCloudinaryConfigured) {
    throw new CloudinaryConfigError(
      'Missing EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME or EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET.'
    );
  }

  const formData = new FormData();
  formData.append('file', {
    name: getFileName(asset),
    type: getMimeType(asset),
    uri: asset.uri,
  } as unknown as Blob);
  formData.append('upload_preset', env.cloudinary.uploadPreset);
  formData.append('folder', options.folder ?? env.cloudinary.uploadFolder);

  if (options.tags?.length) {
    formData.append('tags', options.tags.join(','));
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${env.cloudinary.cloudName}/image/upload`,
    {
      body: formData,
      method: 'POST',
    }
  );
  const payload: unknown = await response.json();

  if (!response.ok) {
    throw new CloudinaryUploadError(payload);
  }

  return CloudinaryUploadResponseSchema.parse(payload);
}
