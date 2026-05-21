import { getShopProductPath } from '@/constants/shop-paths';
import { ShopProductListItem } from '@/utils/shop';
import { getLowestPriceFromProduct } from '@/utils/price';
import NextImage from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

type Props = {
  product: ShopProductListItem;
  basePath?: string;
  compact?: boolean;
};

export const ShopProductCard: FC<Props> = ({ product, basePath, compact }) => {
  const productHref = getShopProductPath(product.slug, basePath);
  const image = product.images[0];

  if (compact) {
    return (
      <article className="group relative flex h-full w-56 shrink-0 flex-col overflow-hidden rounded bg-white shadow transition-shadow hover:shadow-md sm:w-64">
        <div className="relative h-52 w-full shrink-0 overflow-hidden bg-white">
          {image?.responsiveImage?.src ? (
            <NextImage
              src={image.responsiveImage.src}
              alt={image.alt ?? product.name}
              fill
              sizes="256px"
              className="object-contain object-center p-3 transition-transform duration-300 group-hover:scale-105"
            />
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
            <NextImage
              src={image.responsiveImage.src}
              alt={image.alt ?? product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain object-center p-3 transition-transform duration-300 group-hover:scale-105"
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
