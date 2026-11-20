import type { ImageData } from '@wehrli/design-system';
import type { ResponsiveImageType } from 'react-datocms';

type DatoFile =
  | {
      responsiveImage?: ResponsiveImageType | null;
      title?: string | null;
      alt?: string | null;
    }
  | null
  | undefined;

type Options = {
  /** Use the asset's title as alt text (turn it off where the title is shown as a caption). Default true. */
  altFromTitle?: boolean;
  /** Alt text when the field has none, e.g. the product name; wins over the asset's own alt and title. */
  fallbackAlt?: string;
};

/**
 * Maps a DatoCMS file onto the design system's ImageData. Alt text comes from the field's alt, `fallbackAlt`, the
 * asset's alt or (with `altFromTitle`) the asset's title.
 */
export const toImage = (file: DatoFile, { altFromTitle = true, fallbackAlt }: Options = {}): ImageData | undefined => {
  const responsiveImage = file?.responsiveImage;

  if (!responsiveImage?.src) {
    return undefined;
  }

  const alt =
    [file?.alt, fallbackAlt, responsiveImage.alt, altFromTitle ? file?.title : null]
      .map((text) => text?.trim())
      .find(Boolean) ?? '';

  return { ...responsiveImage, src: responsiveImage.src, alt };
};
