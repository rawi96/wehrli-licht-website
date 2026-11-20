import { FC } from 'react';
import { preload } from 'react-dom';
import { SRCImage } from 'react-datocms';

/**
 * A responsive image: the shape DatoCMS returns for `responsiveImage`, with the alt text already resolved by the caller.
 * Other sources (a plain URL with its size) work too, `srcSet` and `base64` are optional.
 */
export type ImageData = {
  src: string;
  width: number;
  height?: number | null;
  alt?: string | null;
  title?: string | null;
  srcSet?: string | null;
  webpSrcSet?: string | null;
  sizes?: string | null;
  aspectRatio?: number;
  base64?: string | null;
  bgColor?: string | null;
};

type Props = {
  image: ImageData | null | undefined;
  /** Rendered width for the browser's choice from `srcSet`, e.g. `(min-width: 1024px) 50vw, 100vw`. */
  sizes?: string;
  /**
   * Above-the-fold (LCP) image: no lazy loading, `fetchpriority="high"` and a `<link rel="preload">` in `<head>`.
   * The preload needs `srcSet`.
   */
  priority?: boolean;
  /**
   * Blurred placeholder behind the image while it loads. It stays as background, so turn it off for `object-contain`
   * images (cut-out product photos), where it would show around the image.
   */
  placeholder?: boolean;
  /** Classes of the `<img>`, `object-cover` by default. Set by design system components only. */
  imgClassName?: string;
};

/** Fills its parent (width and height 100%); the parent decides size and aspect ratio. */
export const Image: FC<Props> = ({ image, sizes = '100vw', priority, placeholder = true, imgClassName }) => {
  if (!image?.src) {
    return null;
  }

  // Preload priority images in <head> (as next/image does) so the LCP download starts before the JavaScript bundles.
  // Same srcset/sizes as the rendered <source>, so it is a cache hit.
  if (priority && image.srcSet) {
    preload(image.src, { as: 'image', imageSrcSet: image.srcSet, imageSizes: sizes, fetchPriority: 'high' });
  }

  return (
    <SRCImage
      data={{ ...image, alt: image.alt ?? '' }}
      sizes={sizes}
      priority={priority}
      usePlaceholder={placeholder}
      imgClassName={imgClassName ?? 'object-cover'}
      imgStyle={{ width: '100%', maxWidth: '100%', height: '100%' }}
    />
  );
};
