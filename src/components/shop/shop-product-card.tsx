import { getShopProductPath } from '@/constants/shop-paths';
import { ShopProductListItem } from '@/utils/shop';
import { getLowestPriceFromProduct } from '@/utils/price';
import { ImageComponent } from '@/components/image';
import Link from 'next/link';
import { FC } from 'react';

type Props = {
  product: ShopProductListItem;
  basePath?: string;
  compact?: boolean;
  /** First card of a listing near the top of the page (LCP on category pages). */
  priority?: boolean;
};

/** Catalog grid: 1 column, 2 from sm, 3 from lg (next to the shop sidebar). */
const CATALOG_IMAGE_SIZES = '(min-width: 1024px) 300px, (min-width: 640px) 46vw, 92vw';

export const ShopProductCard: FC<Props> = ({ product, basePath, compact, priority = false }) => {
  const productHref = getShopProductPath(product.slug, basePath);
  const image = product.images[0];

  if (compact) {
    return (
      <article className="group relative flex h-full w-56 shrink-0 flex-col overflow-hidden rounded bg-white shadow transition-shadow hover:shadow-md sm:w-64">
        <div className="relative h-52 w-full shrink-0 overflow-hidden bg-white">
          {image?.responsiveImage?.src ? (
            <div className="absolute inset-0">
              <ImageComponent
                image={{ ...image, alt: image.alt ?? product.name }}
                sizes="256px"
                priority={priority}
                usePlaceholder={false}
                imgClassName="object-contain object-center p-3 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ) : null}
        </div>
        <div className="flex min-h-0 flex-1 flex-col p-4">
          <h3 className="line-clamp-2 min-h-[2.75rem] text-sm font-bold">
            <Link href={productHref} className="text-wehrli hover:underline">
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </Link>
          </h3>
          <p className="text-wehrli mt-auto pt-4 text-sm font-bold">{getLowestPriceFromProduct(product)}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg bg-white shadow">
      {image?.responsiveImage?.src && (
        <div className="relative w-full shrink-0 overflow-hidden bg-white" style={{ paddingTop: '100%' }}>
          <div className="absolute inset-0">
            <ImageComponent
              image={{ ...image, alt: image.alt ?? product.name }}
              sizes={CATALOG_IMAGE_SIZES}
              priority={priority}
              usePlaceholder={false}
              imgClassName="object-contain object-center p-3 transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
      )}
      <div className="flex flex-1 flex-col justify-between p-4">
        <h3 className="text-sm font-medium">
          <Link href={productHref} className="text-wehrli font-bold hover:underline">
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <p className="text-wehrli mt-2 text-base font-bold">{getLowestPriceFromProduct(product)}</p>
      </div>
    </article>
  );
};
