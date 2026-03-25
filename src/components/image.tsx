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
};

export const ImageComponent: FC<ImageProps> = ({ image, priority, imgClassName }) => (
  <>
    {image?.responsiveImage?.src &&
      (priority ? (
        <NextImage
          src={image.responsiveImage.src}
          width={image.responsiveImage.width ?? 1200}
          height={image.responsiveImage.height ?? 900}
          sizes="100vw"
          alt={image.alt ?? ''}
          priority
          fetchPriority="high"
          className={imgClassName ?? 'object-cover'}
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <DatoSRCImage
          data={image.responsiveImage}
          imgClassName={imgClassName ?? 'object-cover'}
          imgStyle={{ width: '100%', maxWidth: '100%', height: '100%' }}
        />
      ))}
  </>
);
