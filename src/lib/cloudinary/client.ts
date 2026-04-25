import { Cloudinary } from '@cloudinary/url-gen';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import { fill, limitFit } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';

import { env } from '@/config/env';

export const cloudinary = new Cloudinary({
  cloud: {
    cloudName: env.cloudinary.cloudName || 'demo',
  },
  url: {
    secure: true,
  },
});

type ImageUrlOptions = {
  height?: number;
  mode?: 'contain' | 'cover';
  width?: number;
};

export function buildCloudinaryImageUrl(publicId: string, options: ImageUrlOptions = {}) {
  const image = cloudinary.image(publicId).delivery(format('auto')).delivery(quality('auto'));

  if (options.width || options.height) {
    const resize = options.mode === 'cover' ? fill().gravity(autoGravity()) : limitFit();

    if (typeof options.width === 'number') {
      resize.width(options.width);
    }

    if (typeof options.height === 'number') {
      resize.height(options.height);
    }

    image.resize(resize);
  }

  return image.toURL();
}
