import { FC } from 'react';
import { SRCImage } from 'react-datocms';
import { cn } from '../../fundamentals/cn';

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
   * Above-the-fold (LCP) image: no lazy loading and `fetchpriority="high"`. No `<link rel="preload">`: the image is in
   * the HTML anyway, and React would also emit the preload when Next.js prefetches a page that links here, so every
   * page would download the LCP images of the pages it links to.
   */
  priority?: boolean;
  /**
   * Blurred placeholder behind the image while it loads. It stays as background, so turn it off for `object-contain`
   * images (cut-out product photos), where it would show around the image.
   */
  placeholder?: boolean;
  /** How the image fills its box: crop (`cover`, default), show all (`contain`) or stretch (`fill`). */
  fit?: 'cover' | 'contain' | 'fill';
  rounded?: 'lg' | 'full';
  /** Space around a cut-out image (`fit="contain"`), e.g. product photos on a white card. */
  inset?: boolean;
  /** Zoom when the enclosing `group` (a card link) is hovered. */
  hoverZoom?: keyof typeof HOVER_ZOOM;
  /** Darkened, e.g. under a title set on the image. */
  dimmed?: boolean;
  /** Positioned over its (positioned) parent, e.g. a fixed-size tile. */
  absolute?: boolean;
};

const FIT = { cover: 'object-cover', contain: 'object-contain', fill: '' } as const;

const ROUNDED = { lg: 'rounded-lg', full: 'rounded-full' } as const;

/** Hover zoom presets: duration and scale per card type. Turned off for reduced motion. */
const HOVER_ZOOM = {
  /** Shop tiles and product cards */
  quick: 'transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none',
  /** Large shop category tiles */
  calm: 'transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none',
  /** Teaser cards and gallery images */
  strong: 'transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none',
  /** Highlight offer cards */
  slow: 'transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none',
  /** Highlight project cards */
  'slow-subtle': 'transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none',
} as const;

/** Fills its parent (width and height 100%); the parent decides size and aspect ratio. */
export const Image: FC<Props> = ({
  image,
  sizes = '100vw',
  priority,
  placeholder = true,
  fit = 'cover',
  rounded,
  inset,
  hoverZoom,
  dimmed,
  absolute,
}) => {
  if (!image?.src) {
    return null;
  }

  return (
    <SRCImage
      data={{ ...image, alt: image.alt ?? '' }}
      sizes={sizes}
      priority={priority}
      usePlaceholder={placeholder}
      imgClassName={cn(
        FIT[fit],
        rounded && ROUNDED[rounded],
        inset && 'p-3',
        hoverZoom && HOVER_ZOOM[hoverZoom],
        dimmed && 'brightness-75',
        absolute && 'absolute',
      )}
      imgStyle={{ width: '100%', maxWidth: '100%', height: '100%' }}
    />
  );
};
