import { BlockWrapper } from '@/components/block-wrapper';
import { ImageComponent } from '@/components/image';
import { ShopProductListItem } from '@/utils/shop';
import { getLowestPriceFromProduct } from '@/utils/price';
import Link from 'next/link';
import { FC } from 'react';

type Props = {
  products: ShopProductListItem[];
  basePath?: string;
};

export const AllProductsForCategory: FC<Props> = ({ products, basePath = '/shop' }) => (
  <BlockWrapper disableMarginTop={true}>
    <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
      {products.map((product) => {
        const image = product.images[0];

        return (
          <div key={product.id} className="group relative flex flex-col overflow-hidden rounded bg-white shadow">
            {image?.responsiveImage && (
              <div className="relative overflow-hidden">
                <ImageComponent
                  image={image}
                  imgClassName="w-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            )}
            <div className="flex flex-1 flex-col justify-between p-4">
              <h2 className="mt-auto text-sm font-medium">
                <Link href={`${basePath}/produkte/${product.slug}`}>
                  <span aria-hidden="true" className="absolute inset-0" />
                  {product.name}
                </Link>
              </h2>
              <p className="text-wehrli mt-2 text-base font-bold">{getLowestPriceFromProduct(product)}</p>
            </div>
          </div>
        );
      })}
    </div>
  </BlockWrapper>
);
