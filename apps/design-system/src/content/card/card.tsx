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
  /** Rendered image width, e.g. `gridImageSizes(cols)`. */
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
    className="group bg-white-100 grid w-full grid-rows-[auto,1fr,auto] overflow-hidden rounded-lg text-black transition-transform active:scale-[.99]"
    target="_self"
  >
    <div className="relative overflow-hidden">
      <Image image={image} sizes={imageSizes} fit="fill" hoverZoom="strong" />
    </div>
    <div className="grid grid-rows-[auto,1fr,auto] p-5 text-sm font-normal md:p-6 lg:p-8 lg:text-sm">
      {eyebrow && <p>{eyebrow}</p>}
      <div>
        <h2 className="text-wehrli my-4 text-lg font-bold peer-[p&]:mt-6 md:text-base lg:text-lg lg:peer-[p&]:mt-8">
          {title}
        </h2>
        {description && <p className="mb-2 lg:mb-4">{description}</p>}
      </div>
      <div>
        <span className="border-b-2 border-black">{linkLabel}</span>
      </div>
    </div>
  </NextLink>
);
