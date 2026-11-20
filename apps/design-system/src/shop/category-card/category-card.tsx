/* eslint-disable @eslint-react/dom-no-dangerously-set-innerhtml -- descriptions are HTML from the CMS */
import Link from 'next/link';
import { FC } from 'react';
import { Image, ImageData } from '../../content/image/image';

export type ShopCategoryCardData = {
  id: string;
  name: string;
  href: string;
  /** Short description from the CMS, as HTML (inline markup only, it is rendered inside a `<p>`). */
  descriptionHtml?: string | null;
  image?: ImageData | null;
};

type Props = ShopCategoryCardData & {
  /** Link text below the description. */
  linkLabel?: string;
};

/** A product category in the storefront's category section (4 columns from lg): image, name, description, link. */
export const ShopCategoryCard: FC<Props> = ({ name, href, descriptionHtml, image, linkLabel = 'Produkte ansehen →' }) => (
  <Link href={href} className="group block overflow-hidden rounded-lg bg-white shadow-sm">
    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
      {image && (
        <Image
          image={image}
          sizes="(min-width: 1400px) 310px, (min-width: 1024px) 23vw, (min-width: 640px) 46vw, 92vw"
          hoverZoom="quick"
        />
      )}
    </div>
    <div className="p-4 sm:p-5">
      <h3 className="text-wehrli text-base font-bold sm:text-lg">{name}</h3>
      {descriptionHtml && (
        <p className="mt-2 line-clamp-2 text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
      )}
      <p className="text-wehrli mt-3 text-sm font-bold">{linkLabel}</p>
    </div>
  </Link>
);
