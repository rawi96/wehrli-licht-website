import { FC } from 'react';
import NextImage from 'next/image';
import { SRCImage as DatoSRCImage, ResponsiveImageType } from 'react-datocms';

type ImageProps = {
  image?: {
    responsiveImage?: ResponsiveImageType | null;
    url?: string;
    title?: string | null;
    alt?: string | null;
  } | null;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
};

export const ImageComponent: FC<ImageProps> = ({ image, priority, imgClassName, sizes = '100vw' }) => {
  const responsiveImage = image?.responsiveImage;

  if (!responsiveImage?.src) {
    return null;
  }

  const alt = image?.alt ?? '';
  const srcData = { ...responsiveImage, alt };

  return priority ? (
    <NextImage
      src={responsiveImage.src}
      width={responsiveImage.width ?? 1200}
      height={responsiveImage.height ?? 900}
      sizes={sizes}
      alt={alt}
      priority
      fetchPriority="high"
      className={imgClassName ?? 'object-cover'}
      style={{ width: '100%', height: '100%' }}
    />
  ) : (
    <DatoSRCImage
      data={srcData}
      sizes={sizes}
      imgClassName={imgClassName ?? 'object-cover'}
      imgStyle={{ width: '100%', maxWidth: '100%', height: '100%' }}
    />
  );
};
