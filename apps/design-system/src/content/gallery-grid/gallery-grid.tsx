import NextLink from 'next/link';
import { FC, Suspense } from 'react';
import { cn } from '../../fundamentals/cn';
import { Image, ImageData } from '../image/image';
import { Lightbox, LightboxSlide } from '../lightbox/lightbox';

export type GalleryItem = {
  id: string;
  /** Thumbnail, shown 339px high from md. */
  image: ImageData;
  /** Large version for the lightbox. */
  large: Omit<LightboxSlide, 'key'>;
  /** Small line above the title, shown with `showTitles`. */
  eyebrow?: string | null;
  title?: string | null;
};

type Props = {
  items: GalleryItem[];
  /** Darkens the images and shows eyebrow and title on them. */
  showTitles?: boolean;
  /** Loads the first image with priority (LCP). */
  priority?: boolean;
};

/**
 * Justified image gallery: on mobile one image per row, from md rows of 339px high images in their own aspect ratio.
 * A click opens the image in the lightbox.
 */
export const GalleryGrid: FC<Props> = ({ items, showTitles, priority }) => (
  <>
    <Suspense fallback={null}>
      <Lightbox slides={items.map(({ id, large }) => ({ key: id, ...large }))} />
    </Suspense>
    <div className="space-y-1 md:flex md:flex-wrap md:gap-1 md:space-y-0">
      {items.map(({ id, image, eyebrow, title }, index) => (
        <NextLink
          key={id}
          href={`?image=${id}`}
          scroll={false}
          className="group relative block grow overflow-hidden text-center md:h-[339px]"
          // eslint-disable-next-line @smartive-eslint/forbid-component-props -- width follows the image's aspect ratio
          style={{ flexBasis: (image.width / (image.height ?? image.width)) * 339 }}
        >
          {showTitles && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-base font-bold text-white transition-opacity duration-300 group-hover:opacity-100">
              {eyebrow && <span className="text-sm">{eyebrow}</span>}
              {title && <span className="text-lg">{title}</span>}
            </div>
          )}

          <Image
            image={image}
            sizes={image.sizes ?? undefined}
            priority={priority && index === 0}
            imgClassName={cn(
              'object-cover transition-transform duration-300 group-hover:scale-110',
              showTitles && 'brightness-75',
            )}
          />
        </NextLink>
      ))}
    </div>
  </>
);
