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

/**
 * Maps a DatoCMS file onto the design system's ImageData. Alt text comes from the field's alt, the asset's alt or, with
 * `altFromTitle`, the asset's title (turn it off where the title is shown as a caption).
 */
export const toImage = (file: DatoFile, { altFromTitle = true } = {}): ImageData | undefined => {
  const responsiveImage = file?.responsiveImage;

  if (!responsiveImage?.src) {
    return undefined;
  }

  const alt =
    [file?.alt, responsiveImage.alt, altFromTitle ? file?.title : null].map((text) => text?.trim()).find(Boolean) ?? '';

  return { ...responsiveImage, src: responsiveImage.src, alt };
};
