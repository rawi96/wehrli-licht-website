import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import NextLink from 'next/link';
import { FC, Suspense } from 'react';
import { cn } from '../../fundamentals/cn';
import { Image, ImageData } from '../image/image';
import { Lightbox, LightboxSlide } from '../lightbox/lightbox';

export type GalleryItem = {
  id: string;
  /** Thumbnail, shown 300px high from md. */
  image: ImageData;
  /** Large version for the lightbox. */
  large: Omit<LightboxSlide, 'key'>;
  /** Small line above the title, shown with `showTitles`. */
  eyebrow?: string | null;
  title?: string | null;
};

type Props = {
  items: GalleryItem[];
  /** Shows eyebrow and title at the bottom of each image. */
  showTitles?: boolean;
  /** Loads the first image with priority (LCP). */
  priority?: boolean;
  labels?: { enlarge: string };
};

/** Height of a row from md, in px; widths follow each image's aspect ratio. */
const ROW_HEIGHT = 300;

/**
 * Image gallery with rounded tiles. On phones two square tiles per row (the first one wide), from md justified rows
 * of equal height, each image in its own aspect ratio. Hover zooms the image and shows an enlarge symbol; a click
 * opens the image in the lightbox.
 */
export const GalleryGrid: FC<Props> = ({ items, showTitles, priority, labels = { enlarge: 'Bild vergrössern' } }) => {
  const ratio = (image: ImageData) => image.width / (image.height ?? image.width);
  // Pictures of one format (e.g. renderings) look calmer in an even grid: 3 per row when that fills the rows, else 4.
  const uniform = items.length > 1 && items.every(({ image }) => Math.abs(ratio(image) - ratio(items[0].image)) < 0.01);
  const columns = items.length % 3 === 0 ? 'md:grid-cols-3' : 'md:grid-cols-4';

  return (
    <>
      <Suspense fallback={null}>
        <Lightbox slides={items.map(({ id, large }) => ({ key: id, ...large }))} />
      </Suspense>
      <div className={cn('grid grid-cols-2 gap-2 sm:gap-3', uniform ? columns : 'md:flex md:flex-wrap')}>
        {items.map(({ id, image, eyebrow, title }, index) => (
          <NextLink
            key={id}
            href={`?image=${id}`}
            scroll={false}
            aria-label={title ? `${title}: ${labels.enlarge}` : labels.enlarge}
            className={cn(
              'group relative block aspect-square overflow-hidden rounded-md bg-gray-200 first:col-span-2 first:aspect-[16/10]',
              uniform
                ? 'md:aspect-[6/5] md:first:col-span-1 md:first:aspect-[6/5]'
                : 'md:aspect-auto md:h-[300px] md:grow md:first:aspect-auto',
            )}
            // eslint-disable-next-line @smartive-eslint/forbid-component-props -- width follows the image's aspect ratio
            style={uniform ? undefined : { flexBasis: ratio(image) * ROW_HEIGHT }}
          >
            <Image image={image} sizes={image.sizes ?? undefined} priority={priority && index === 0} hoverZoom absolute />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity group-hover:opacity-100"
            />
            <span
              aria-hidden="true"
              className="text-wehrli absolute top-3 right-3 flex size-10 scale-90 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-md transition group-hover:scale-100 group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              <ArrowsPointingOutIcon className="size-5" />
            </span>
            {showTitles && (eyebrow || title) ? (
              <span className="absolute inset-x-0 bottom-0 flex flex-col bg-gradient-to-t from-black/70 to-black/0 px-4 pt-10 pb-4 text-left text-white">
                {eyebrow ? <span className="text-xxs font-bold text-white/80">{eyebrow}</span> : null}
                {title ? <span className="text-sm font-bold">{title}</span> : null}
              </span>
            ) : null}
          </NextLink>
        ))}
        {/* Keeps the images of a short last row at their natural width instead of stretching them. */}
        {!uniform && <span aria-hidden="true" className="hidden md:block md:grow-[10]" />}
      </div>
    </>
  );
};
