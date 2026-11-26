import { ArrowRightIcon } from '@heroicons/react/20/solid';
import NextLink from 'next/link';
import { createElement, FC } from 'react';
import { Image, ImageData } from '../image/image';

type Props = {
  title: string;
  /** Area and place, e.g. «Gastronomie · Mörschwil». */
  eyebrow?: string | null;
  /** One or two lines; cut after two. */
  description?: string | null;
  href: string;
  linkLabel: string;
  image?: ImageData | null;
  /** Rendered image width, e.g. `gridImageSizes()`. */
  imageSizes: string;
  /** `h2` where no section heading sits above the tiles (e.g. the project overview). */
  headingLevel?: 'h2' | 'h3';
};

/**
 * A reference project as a picture with the text on it, set apart from the white page teasers (`Card`): projects show
 * finished work, so the photo carries the tile. The whole tile is the link.
 */
export const ProjectTile: FC<Props> = ({
  title,
  eyebrow,
  description,
  href,
  linkLabel,
  image,
  imageSizes,
  headingLevel = 'h3',
}) => (
  <NextLink
    href={href}
    prefetch={false}
    className="group surface-dark relative block aspect-[4/5] overflow-hidden rounded-md no-underline ring-1 ring-black/5 transition-shadow hover:shadow-lg sm:aspect-[4/3] md:aspect-[4/5] lg:aspect-[4/5]"
  >
    <Image image={image} sizes={imageSizes} hoverZoom absolute />
    <div className="from-wehrli-dark/95 via-wehrli-dark/40 absolute inset-0 bg-gradient-to-t to-transparent" aria-hidden />
    <div className="absolute inset-x-0 bottom-0 p-5 text-white lg:p-6">
      {eyebrow && <p className="text-xs font-bold text-white/75">{eyebrow}</p>}
      {createElement(
        headingLevel,
        { className: 'mt-1.5 text-lg leading-snug font-bold text-balance break-words hyphens-auto text-white' },
        title,
      )}
      {description && <p className="mt-2 line-clamp-2 text-sm text-white/85">{description}</p>}
      <span className="mt-4 inline-flex items-center gap-1.5 border-b-2 border-white/60 text-sm font-bold text-white transition-colors group-hover:border-white">
        {linkLabel}
        <ArrowRightIcon
          aria-hidden
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
        />
      </span>
    </div>
  </NextLink>
);
