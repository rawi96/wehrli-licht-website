import type { CatalogImage } from '@/domain/shop/image';
import type { ImageData } from '@wehrli/design-system';

type Options = {
  /** Alt text when the image has none set where it is used, e.g. the product name; wins over the file's own texts. */
  fallbackAlt?: string;
};

/**
 * A catalog image as the design system's ImageData; undefined without a resized image. Alt text comes from the image's
 * alt, `fallbackAlt`, the resized image's alt or the file's title.
 */
export const toImageData = (
  image: CatalogImage | null | undefined,
  { fallbackAlt }: Options = {},
): ImageData | undefined => {
  const responsive = image?.responsive;

  if (!responsive?.src) {
    return undefined;
  }

  const alt = [image?.alt, fallbackAlt, responsive.alt, image?.title].map((text) => text?.trim()).find(Boolean) ?? '';

  return { ...responsive, src: responsive.src, alt };
};
