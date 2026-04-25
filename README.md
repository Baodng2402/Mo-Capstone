# GlowScan Mobile

GlowScan is a React Native mobile application for AI-assisted skin analysis,
skincare recommendations, scan history tracking, and nearby clinic/spa
discovery. This repository contains the end-user mobile client for the
GlowScan capstone project.

## Features

- User-facing mobile experience for iOS, Android, and web through Expo.
- Face image capture and gallery selection for skin scan workflows.
- Local image compression before upload or backend handoff.
- Cloudinary image upload and delivery URL helpers.
- Secure token storage for future Keycloak/OIDC authentication.
- API client foundation with runtime response validation.
- Query caching and network/focus awareness for mobile data fetching.
- Location support for clinic/spa discovery.
- Test, lint, typecheck, export, and EAS build scripts.

## Tech Stack

| Area               | Technology                                             |
| ------------------ | ------------------------------------------------------ |
| Runtime            | React Native, Expo SDK 54, TypeScript                  |
| Routing            | Expo Router                                            |
| Styling            | NativeWind, React Native CSS                           |
| Server State       | TanStack Query                                         |
| Client State       | Zustand                                                |
| Forms & Validation | React Hook Form, Zod                                   |
| Auth Foundation    | Expo AuthSession, Expo SecureStore                     |
| Media              | Expo Image Picker, Expo Camera, Expo Image Manipulator |
| Location           | Expo Location, React Native Maps                       |
| Storage            | Expo SQLite, AsyncStorage, SecureStore                 |
| Cloud Media        | Cloudinary URL Gen, Cloudinary unsigned upload helper  |
| Testing            | Jest, Jest Expo, Testing Library for React Native      |
| Build              | Expo CLI, EAS Build                                    |

## Requirements

- Node.js 20 or newer is recommended.
- npm 10 or newer.
- Expo account for cloud/internal builds.
- Android Studio for Android emulator builds.
- Xcode on macOS for iOS simulator/device builds.
- A Cloudinary account for image upload and delivery.

## Getting Started

Install dependencies:

```bash
npm install
```

Create your local environment file:

```bash
cp .env.example .env
```

Update `.env` with your local backend and Cloudinary values:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
EXPO_PUBLIC_CLOUDINARY_UPLOAD_FOLDER=glowscan/scans
```

Start the development server:

```bash
npm start
```

Run on Android:

```bash
npm run android
```

Run on iOS:

```bash
npm run ios
```

Run on web:

```bash
npm run web
```

When testing on a physical device, replace `localhost` in
`EXPO_PUBLIC_API_URL` with your machine's LAN IP address or a public tunnel URL.

## Project Structure

```txt
src/
  app/                  Expo Router screens and layouts
  components/           Shared UI components
  config/               Runtime environment config
  features/             Feature-level modules
  lib/
    api/                API request helper
    auth/               Secure token storage
    cloudinary/         Upload and image URL helpers
  providers/            App-level providers
  store/                Zustand stores
  types/                Global TypeScript declarations
docs/
  cloudinary.md         Cloudinary integration notes
```

## Available Scripts

| Command                     | Description                                             |
| --------------------------- | ------------------------------------------------------- |
| `npm start`                 | Start Expo development server.                          |
| `npm run android`           | Start Expo and open Android target.                     |
| `npm run ios`               | Start Expo and open iOS target.                         |
| `npm run web`               | Start Expo web target.                                  |
| `npm run typecheck`         | Run TypeScript without emitting files.                  |
| `npm run lint`              | Run ESLint and Prettier checks.                         |
| `npm run lint-staged`       | Run lint-staged on staged files.                        |
| `npm run format`            | Auto-fix ESLint issues and format supported files.      |
| `npm run verify`            | Run typecheck, lint, and tests locally.                 |
| `npm test`                  | Run Jest tests.                                         |
| `npm run export:android`    | Build a production Android JS bundle for smoke testing. |
| `npm run export:web`        | Export the web build.                                   |
| `npm run build:development` | Create an Android development build with EAS.           |
| `npm run build:android`     | Create an internal Android APK preview build with EAS.  |

## CI Pipeline

GitHub Actions workflows are stored in `.github/workflows`.

- `ci.yml` runs on pull requests and pushes to `main`.
- `eas-build.yml` runs manually from the GitHub Actions tab.

The CI quality gate runs:

```bash
npm ci
npm run typecheck
npm run lint
npm test -- --runInBand --passWithNoTests
npm run export:android
```

The EAS build workflow requires a GitHub repository secret named `EXPO_TOKEN`.
Create it from your Expo account access token, then run the workflow manually
with the desired platform and EAS profile.

## Git Hooks

This repository uses Husky and lint-staged.

- `pre-commit` runs `npm run lint-staged`.
- `pre-push` runs TypeScript and Jest checks.

Install hooks after cloning:

```bash
npm install
```

If hooks were not installed, run:

```bash
npm run prepare
```

To intentionally skip hooks for one command:

```bash
HUSKY=0 git commit -m "your message"
```

## Cloudinary Setup

The mobile app supports direct unsigned uploads to Cloudinary through
`src/lib/cloudinary/upload.ts`. This is useful for MVP development and fast
testing.

Recommended unsigned preset restrictions:

- Allow image formats only.
- Set a maximum file size.
- Store uploads under `glowscan/scans`.
- Disable overwrite/public ID replacement.
- Apply incoming transformations if you want to cap image dimensions.

Mobile upload flow:

1. User captures or selects a face image.
2. The app resizes and compresses the image locally.
3. The app uploads to Cloudinary using the configured unsigned preset.
4. The app receives `public_id`, `secure_url`, dimensions, and metadata.
5. The app can send that metadata to the backend for scan analysis/history.

For production, prefer signed uploads:

1. Mobile requests a short-lived upload signature from the backend.
2. Backend signs the request using Cloudinary `api_secret`.
3. Mobile uploads the image using the signature.
4. Backend persists the Cloudinary asset metadata.

Never expose Cloudinary `api_secret`, Keycloak client secrets, or backend
secrets in mobile code or `EXPO_PUBLIC_*` variables.

To render an image returned by the backend:

```ts
import { buildCloudinaryImageUrl } from '@/lib/cloudinary/client';

const imageUrl = buildCloudinaryImageUrl(publicId, {
  width: 640,
  height: 640,
  mode: 'cover',
});
```

More details are available in `docs/cloudinary.md`.

## Backend Integration Notes

The API base URL is configured through `EXPO_PUBLIC_API_URL`.

Use `src/lib/api/client.ts` for typed requests:

```ts
import { z } from 'zod';

import { apiRequest } from '@/lib/api/client';

const ProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
});

const profile = await apiRequest('/me', ProfileSchema, {
  auth: true,
});
```

`auth: true` attaches the access token stored in SecureStore. Token storage is
implemented in `src/lib/auth/tokenStorage.ts`.

## Quality Checks

Before opening a pull request or submitting a milestone build, run:

```bash
npm run typecheck
npm run lint
npm test -- --runInBand --passWithNoTests
npm run export:android
```

`export:android` disables Watchman through `EXPO_USE_WATCHMAN=0` to avoid
macOS permission issues in restricted environments.

## EAS Builds

Login to Expo:

```bash
npx eas login
```

Create a development build:

```bash
npm run build:development
```

Create an internal APK preview build:

```bash
npm run build:android
```

Build profiles are defined in `eas.json`.

## Security and Privacy

- Do not commit `.env` files.
- Do not store original face images by default unless the user explicitly
  permits it.
- Store tokens only in SecureStore.
- Send scan images and results over HTTPS in production.
- Clearly communicate that scan results support skincare decisions and do not
  replace professional medical diagnosis.
- Prefer backend-signed Cloudinary uploads for production environments.

## Troubleshooting

### Expo cannot reach the backend from a phone

Use your computer's LAN IP instead of `localhost`:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.10:3000
```

### Watchman permission errors on macOS

The export scripts already disable Watchman. If Jest fails because of Watchman,
the project also sets `watchman: false` in the Jest config.

### Cloudinary upload says env is missing

Check that `.env` exists and includes:

```env
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=...
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=...
```

Then restart Expo so environment variables are reloaded.

## License

This project is part of the GlowScan capstone project.
