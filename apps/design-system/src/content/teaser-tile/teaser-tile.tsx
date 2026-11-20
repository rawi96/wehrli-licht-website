import NextLink from 'next/link';
import { FC } from 'react';
import { Image, ImageData } from '../image/image';

type Props = {
  title?: string | null;
  eyebrow?: string | null;
  linkLabel?: string | null;
  href: string;
  image?: ImageData | null;
};

/** Square 256px teaser of a page with the text on the darkened image, for horizontally scrolling rows. */
export const TeaserTile: FC<Props> = ({ title, eyebrow, linkLabel, href, image }) => (
  <NextLink href={href} title={title ?? ''} className="group relative h-64 w-64 overflow-hidden rounded-lg bg-white">
    <div className="relative h-full w-full overflow-hidden">
      {image && <Image image={image} sizes="256px" absolute dimmed hoverZoom="strong" />}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40" />
      <div className="absolute inset-0 rounded-lg ring-1 ring-gray-900/10 ring-inset" />
      <div className="absolute right-0 bottom-0 left-0 p-4 text-sm leading-6 text-white">
        <h3 className="mt-4 inline-block text-sm text-white">{eyebrow ?? ''}</h3>
        <p className="mt-2 mb-4 text-sm font-bold text-white peer-[p&]:mt-6 md:text-base lg:text-lg lg:peer-[p&]:mt-8">
          {title}
        </p>
        <p className="mt-4 inline-block border-b-2 text-sm text-white">{linkLabel ?? ''}</p>
      </div>
    </div>
  </NextLink>
);
