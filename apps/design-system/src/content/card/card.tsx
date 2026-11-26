import NextLink from 'next/link';
import { FC } from 'react';
import { Image, ImageData } from '../image/image';

type Props = {
  title: string;
  description?: string | null;
  eyebrow?: string | null;
  href: string;
  linkLabel: string;
  /** Link title, the card title by default. */
  linkTitle?: string;
  /** Turns off Next.js prefetching, e.g. for long lists of rarely visited pages. */
  prefetch?: false;
  image?: ImageData | null;
  /** Rendered image width, e.g. `gridImageSizes()`. */
  imageSizes: string;
};

/** Teaser of a page: image, eyebrow, title, text and a link label. The whole card is the link. */
export const Card: FC<Props> = ({
  title,
  description,
  href,
  linkLabel,
  linkTitle,
  prefetch,
  image,
  imageSizes,
  eyebrow,
}) => (
  <NextLink
    href={href}
    title={linkTitle ?? title}
    prefetch={prefetch}
    className="group card-surface grid w-full grid-rows-[auto_1fr_auto] overflow-hidden text-black transition-[transform,box-shadow] hover:shadow-md active:scale-[.99]"
    target="_self"
  >
    {/* Fixed 23:12, the crop of teaser images (460 × 240): equal image heights in a row, whatever the source size. */}
    <div className="relative aspect-[23/12] overflow-hidden">
      <Image image={image} sizes={imageSizes} hoverZoom absolute />
    </div>
    <div className="grid grid-rows-[auto_1fr_auto] p-5 text-sm font-normal md:p-6 lg:p-8 lg:text-sm">
      {/* Always three rows (eyebrow, text, link), so the link sits at the bottom of equal-height cards. */}
      {eyebrow ? <p>{eyebrow}</p> : <span aria-hidden="true" />}
      <div>
        <h2 className="text-wehrli my-4 text-lg font-bold break-words hyphens-auto peer-[p&]:mt-6 md:text-base lg:text-lg lg:peer-[p&]:mt-8">
          {title}
        </h2>
        {description && <p className="mb-2 lg:mb-4">{description}</p>}
      </div>
      <div>
        <span className="text-wehrli border-wehrli group-hover:text-wehrli-dark group-hover:border-wehrli-dark border-b-2 font-bold transition-colors">
          {linkLabel}
        </span>
      </div>
    </div>
  </NextLink>
);
