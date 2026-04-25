# Cloudinary Setup

GlowScan mobile currently uses `@cloudinary/url-gen` plus a direct upload helper.
The React Native SDK package `cloudinary-react-native` was not installed because
its current peer dependency range does not include this Expo SDK version.

## Environment

Create a local `.env` from `.env.example`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
EXPO_PUBLIC_CLOUDINARY_UPLOAD_FOLDER=glowscan/scans
```

Only values prefixed with `EXPO_PUBLIC_` are exposed to the app bundle. Do not
put Cloudinary `api_secret`, Keycloak secrets, or backend secrets in mobile env.

## Recommended Flow

For MVP, direct unsigned upload is acceptable if the Cloudinary upload preset is
locked down:

- restrict file formats to images
- set max file size
- set target folder
- prevent public ID overwrite
- optionally add incoming transformations to limit image dimensions

Mobile flow:

1. User captures or selects an image.
2. Mobile compresses/resizes it with `expo-image-manipulator`.
3. Mobile uploads it through `uploadImageToCloudinary`.
4. Mobile sends `public_id`, `secure_url`, image size, and scan metadata to BE.
5. BE stores scan metadata and returns analysis/history data.

Production flow can move to signed uploads:

1. Mobile requests an upload signature from BE.
2. BE signs the upload with Cloudinary `api_secret`.
3. Mobile uploads using the short-lived signature.
4. BE persists the Cloudinary asset metadata.

## Mobile Helpers

- `src/lib/cloudinary/upload.ts`: direct unsigned image upload.
- `src/lib/cloudinary/client.ts`: Cloudinary delivery URL builder.
- `src/features/scan/imagePicker.ts`: image capture/pick and compression.

When BE returns a Cloudinary `public_id`, render it with:

```ts
import { buildCloudinaryImageUrl } from '@/lib/cloudinary/client';

const imageUrl = buildCloudinaryImageUrl(publicId, {
  width: 640,
  height: 640,
  mode: 'cover',
});
```
