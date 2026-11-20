import NextLink from 'next/link';
import { FC } from 'react';
import { cn } from '../../fundamentals/cn';
import { HIGHLIGHT_IMAGE_SIZES } from '../highlight-section/highlight-section';
import { Image, ImageData } from '../image/image';

type Props = {
  name: string;
  href: string;
  /** Without an image the tile shows the name on a brand-colored surface. */
  image?: ImageData | null;
  /** Lead tile (full width on mobile, large on desktop) or one of the smaller tiles. */
  size: 'large' | 'small';
  /** Small label above the name. */
  label?: string;
  priority?: boolean;
};

const SIZE_CLASSES = {
  large: 'aspect-[16/10] min-h-[11rem] sm:min-h-[12.5rem] lg:aspect-auto lg:size-full lg:min-h-0',
  small: 'aspect-[3/4] min-h-[9.5rem] sm:min-h-[10.5rem] lg:aspect-auto lg:size-full lg:min-h-0',
} as const;

/** A shop category on the brand-colored band. Text is compact below lg and larger from lg, where the tiles get bigger. */
export const HighlightCategoryTile: FC<Props> = ({ name, href, image, size, label = 'Kategorie', priority }) => (
  <NextLink
    href={href}
    className={cn(
      'group relative block min-h-0 min-w-0 overflow-hidden rounded-lg bg-gray-900/40 shadow-sm ring-1 ring-white/10',
      'transition-shadow duration-300 hover:ring-white/25 active:scale-[0.99] motion-reduce:active:scale-100',
      'focus-visible:ring-offset-wehrli focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none',
      SIZE_CLASSES[size],
    )}
  >
    <div className="absolute inset-0">
      {image ? (
        <Image
          image={image}
          priority={priority}
          sizes={size === 'large' ? HIGHLIGHT_IMAGE_SIZES.shopTileLarge : HIGHLIGHT_IMAGE_SIZES.shopTileSmall}
          imgClassName="size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
        />
      ) : (
        <div className="bg-wehrli/30 flex size-full items-center justify-center">
          <span className="px-3 text-center text-sm font-bold text-white sm:px-4">{name}</span>
        </div>
      )}
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" aria-hidden />
    <div className="absolute inset-x-0 bottom-0 p-3 lg:p-5">
      <p className="text-xxxs tracking-label-tight lg:tracking-label-wide font-bold text-white/75 uppercase lg:text-xs">
        {label}
      </p>
      <p className="mt-0.5 text-sm leading-snug font-bold break-words text-white sm:text-base lg:text-xl lg:leading-normal">
        {name}
      </p>
    </div>
  </NextLink>
);
