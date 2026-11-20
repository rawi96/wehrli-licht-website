import { FC } from 'react';
import { preload } from 'react-dom';
import { SRCImage as DatoSRCImage, ResponsiveImageType } from 'react-datocms';

type ImageProps = {
  image?: {
    responsiveImage?: ResponsiveImageType | null;
    url?: string;
    title?: string | null;
    alt?: string | null;
  } | null;
  imgClassName?: string;
  /**
   * Above-the-fold / LCP image: no lazy loading, fetchpriority="high" and a <head> preload.
   * The preload needs `srcSet`, so query these images with `priorityResponsiveImageFragment`.
   */
  priority?: boolean;
  sizes?: string;
  /** Use the image title as alt text when alt is missing. Disable where the title is shown as a caption. */
  altFromTitle?: boolean;
  /**
   * Blurred placeholder behind the image while loading. It stays as background, so disable it for
   * object-contain images (e.g. cut-out product photos), where it would show around the image.
   */
  usePlaceholder?: boolean;
};

export const ImageComponent: FC<ImageProps> = ({
  image,
  priority,
  imgClassName,
  sizes = '100vw',
  altFromTitle = true,
  usePlaceholder = true,
}) => {
  const responsiveImage = image?.responsiveImage;

  if (!responsiveImage?.src) {
    return null;
  }

  const alt =
    [image?.alt, responsiveImage.alt, altFromTitle ? image?.title : null].map((text) => text?.trim()).find(Boolean) ?? '';

  // Preload priority images in <head> (as next/image does) so the LCP download starts before the
  // JavaScript bundles. Uses the same srcset/sizes as the rendered <source>, so it is a cache hit.
  if (priority && responsiveImage.srcSet) {
    preload(responsiveImage.src, {
      as: 'image',
      imageSrcSet: responsiveImage.srcSet,
      imageSizes: sizes,
      fetchPriority: 'high',
    });
  }

  // DatoCMS images are already optimized by Dato's CDN, so priority images are served from
  // there too instead of being re-optimized (and counted) by Vercel's next/image optimizer.
  return (
    <DatoSRCImage
      data={{ ...responsiveImage, alt }}
      sizes={sizes}
      priority={priority}
      usePlaceholder={usePlaceholder}
      imgClassName={imgClassName ?? 'object-cover'}
      imgStyle={{ width: '100%', maxWidth: '100%', height: '100%' }}
    />
  );
};
