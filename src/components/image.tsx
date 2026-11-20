import { FC } from 'react';
import { SRCImage as DatoSRCImage, ResponsiveImageType } from 'react-datocms';

type ImageProps = {
  image?: {
    responsiveImage?: ResponsiveImageType | null;
    url?: string;
    title?: string | null;
    alt?: string | null;
  } | null;
  imgClassName?: string;
  /** Above-the-fold / LCP image: no lazy loading and fetchpriority="high". */
  priority?: boolean;
  sizes?: string;
  /** Use the image title as alt text when alt is missing. Disable where the title is shown as a caption. */
  altFromTitle?: boolean;
};

export const ImageComponent: FC<ImageProps> = ({ image, priority, imgClassName, sizes = '100vw', altFromTitle = true }) => {
  const responsiveImage = image?.responsiveImage;

  if (!responsiveImage?.src) {
    return null;
  }

  const alt = [image?.alt, altFromTitle ? image?.title : null].map((text) => text?.trim()).find(Boolean) ?? '';

  // DatoCMS images are already optimized by Dato's CDN, so priority images are served from
  // there too instead of being re-optimized (and counted) by Vercel's next/image optimizer.
  return (
    <DatoSRCImage
      data={{ ...responsiveImage, alt }}
      sizes={sizes}
      priority={priority}
      imgClassName={imgClassName ?? 'object-cover'}
      imgStyle={{ width: '100%', maxWidth: '100%', height: '100%' }}
    />
  );
};
