import Link from 'next/link';
import { FC } from 'react';
import { Image, ImageData } from '../../content/image/image';

export type ProductCardData = {
  id: string;
  name: string;
  href: string;
  /** Formatted price, e.g. "Ab CHF 290.00". */
  price: string;
  /** Product photo; its alt text falls back to the product name (set by the caller). */
  image?: ImageData | null;
};

type Props = ProductCardData & {
  /**
   * `catalog`: square image in the product grid (1 column, 2 from sm, 3 from lg).
   * `compact`: fixed-width card for a horizontal scroll row.
   */
  variant?: 'catalog' | 'compact';
  /** First card of a listing near the top of the page (LCP on category pages). */
  priority?: boolean;
};

/** Catalog grid: 1 column, 2 from sm, 3 from lg (next to the shop sidebar). */
const CATALOG_IMAGE_SIZES = '(min-width: 1024px) 300px, (min-width: 640px) 46vw, 92vw';

/** A product in a list: cut-out product photo, name and price. The whole card is clickable through the name link. */
export const ProductCard: FC<Props> = ({ name, href, price, image, variant = 'catalog', priority = false }) => {
  if (variant === 'compact') {
    return (
      <article className="group surface-light card-surface relative flex h-full w-56 shrink-0 flex-col overflow-hidden transition-shadow hover:shadow-md sm:w-64">
        <div className="relative h-52 w-full shrink-0 overflow-hidden bg-white">
          {image?.src ? (
            <div className="absolute inset-0">
              <Image image={image} sizes="256px" priority={priority} placeholder={false} fit="contain" inset hoverZoom />
            </div>
          ) : null}
        </div>
        <div className="flex min-h-0 flex-1 flex-col p-4">
          <h3 className="line-clamp-2 min-h-[2.75rem] text-sm font-bold">
            <Link href={href} className="text-wehrli hover:underline">
              <span aria-hidden="true" className="absolute inset-0" />
              {name}
            </Link>
          </h3>
          <p className="text-wehrli mt-auto pt-4 text-sm font-bold">{price}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="group surface-light card-surface relative flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
      {image?.src && (
        <div className="relative w-full shrink-0 overflow-hidden bg-white pt-[100%]">
          <div className="absolute inset-0">
            <Image
              image={image}
              sizes={CATALOG_IMAGE_SIZES}
              priority={priority}
              placeholder={false}
              fit="contain"
              inset
              hoverZoom
            />
          </div>
        </div>
      )}
      <div className="flex flex-1 flex-col justify-between p-4">
        <h3 className="text-sm">
          <Link href={href} className="text-wehrli font-bold hover:underline">
            <span aria-hidden="true" className="absolute inset-0" />
            {name}
          </Link>
        </h3>
        <p className="text-wehrli mt-2 text-base font-bold">{price}</p>
      </div>
    </article>
  );
};
