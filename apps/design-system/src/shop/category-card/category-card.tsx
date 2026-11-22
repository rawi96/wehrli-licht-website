import Link from 'next/link';
import { FC, ReactNode } from 'react';
import { Image, ImageData } from '../../content/image/image';

export type ShopCategoryCardData = {
  id: string;
  name: string;
  href: string;
  /** Short description, rendered by the website (e.g. HTML from the CMS); clamped to a few lines. */
  description?: ReactNode;
  image?: ImageData | null;
};

type Props = ShopCategoryCardData & {
  /** Link text below the description. */
  linkLabel?: string;
};

/** A product category in the storefront's category section (4 columns from lg): image, name, description, link. */
export const ShopCategoryCard: FC<Props> = ({ name, href, description, image, linkLabel = 'Produkte ansehen →' }) => (
  <Link href={href} className="group block overflow-hidden rounded-md bg-white shadow-sm">
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
      {description ? <div className="mt-2 line-clamp-2 text-sm text-gray-600">{description}</div> : null}
      <p className="text-wehrli mt-3 text-sm font-bold">{linkLabel}</p>
    </div>
  </Link>
);
