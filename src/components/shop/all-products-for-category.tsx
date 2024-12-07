import { getLowestPriceFromVariantsOrProductPrice } from '@/utils/price';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import { Product } from 'swell-js';
import { BlockWrapper } from '../block-wrapper';

type Props = {
  products: Product[];
};

export const AllProductsForCategory: FC<Props> = ({ products }) => (
  <BlockWrapper disableMarginTop={true}>
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
        {products?.map((product) => (
          <div key={product.id} className="group relative flex flex-col overflow-hidden rounded bg-white shadow">
            {product.images?.length && product.images[0].file?.url && (
              <div className="relative overflow-hidden">
                <Image
                  src={product.images[0].file.url}
                  alt={product.name}
                  className="w-full object-contain transition-transform duration-300 group-hover:scale-110"
                  width={1000}
                  height={1000}
                />
              </div>
            )}
            <div className="flex flex-1 flex-col justify-between p-4">
              <h3 className="font-medium mt-auto text-sm">
                <Link href={`/shop/produkte/${product.slug}`}>
                  <span aria-hidden="true" className="absolute inset-0" />
                  {product.name}
                </Link>
              </h3>
              <p className="mt-2 text-base font-bold text-wehrli">{getLowestPriceFromVariantsOrProductPrice(product)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </BlockWrapper>
);
