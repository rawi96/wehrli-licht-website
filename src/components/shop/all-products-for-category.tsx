import { BlockWrapper } from '@/components/block-wrapper';
import { ShopProductListItem } from '@/utils/shop';
import { getLowestPriceFromProduct } from '@/utils/price';
import NextImage from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

type Props = {
  products: ShopProductListItem[];
  basePath?: string;
};

export const AllProductsForCategory: FC<Props> = ({ products, basePath = '/shop' }) => (
  <BlockWrapper disableMarginTop={true}>
    <ul className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
      {products.map((product) => {
        const image = product.images[0];

        return (
          <li key={product.id}>
            <article className="group relative flex h-full flex-col overflow-hidden rounded bg-white shadow">
              {image?.responsiveImage?.src && (
                <div className="relative w-full shrink-0 overflow-hidden rounded bg-white" style={{ paddingTop: '100%' }}>
                  <div className="absolute inset-0">
                    <NextImage
                      src={image.responsiveImage.src}
                      alt={image.alt ?? product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain object-center p-3 transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </div>
              )}
              <div className="flex flex-1 flex-col justify-between p-4">
                <h3 className="mt-auto text-sm font-medium">
                  <Link href={`${basePath}/produkte/${product.slug}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </Link>
                </h3>
                <p className="text-wehrli mt-2 text-base font-bold">{getLowestPriceFromProduct(product)}</p>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  </BlockWrapper>
);
