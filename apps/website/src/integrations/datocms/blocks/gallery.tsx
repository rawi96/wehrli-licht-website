import { GalleryBlockFragment } from '@/graphql/generated';
import { toImage } from '../image';
import { GalleryBlock as GalleryBlockView, GalleryItem } from '@wehrli/design-system';
import { FC } from 'react';

type Props = {
  block: GalleryBlockFragment;
  /** Block is near the top of the page: load the first image eagerly (LCP). */
  aboveFold?: boolean;
};

export const GalleryBlock: FC<Props> = ({
  block: { gallery, disableMarginBottom, disableMarginTop, showImageTitles },
  aboveFold = false,
}) => (
  <GalleryBlockView
    marginTop={!disableMarginTop}
    marginBottom={!disableMarginBottom}
    showTitles={showImageTitles}
    priority={aboveFold}
    items={gallery.flatMap(({ id, smallSize, largeSize }): GalleryItem[] => {
      const image = toImage({ responsiveImage: smallSize });

      if (!image) {
        return [];
      }

      // Image titles are written as «eyebrow - title».
      const [eyebrow, title] = (smallSize?.title ?? '').split('-').map((part) => part.trim());

      return [
        { id, image, large: { src: largeSize.src, width: largeSize.width, height: largeSize.height }, eyebrow, title },
      ];
    })}
  />
);
