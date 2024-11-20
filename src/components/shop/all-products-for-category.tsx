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
  <BlockWrapper>
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 pb-20 pt-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
      {products?.map((product) => (
        <Link
          key={product.id}
          href={`/shop/produkte/${product.slug}`}
          className="group flex h-full flex-col justify-between"
        >
          <div className="aspect-h-1 aspect-w-1 xl:aspect-h-8 xl:aspect-w-7 w-full overflow-hidden rounded bg-gray-200">
            {product.images?.length && product.images[0].file?.url && (
              <Image
                src={product.images[0].file.url}
                alt={product.name}
                className="h-full w-full object-cover object-center group-hover:opacity-75"
                width={1000}
                height={1000}
              />
            )}
          </div>
          <div className="mt-4 flex flex-1 flex-col justify-end">
            <h3 className="text-sm text-gray-700">{product.name}</h3>
            <p className="font-medium mt-1 text-lg text-gray-900">{getLowestPriceFromVariantsOrProductPrice(product)}</p>
          </div>
        </Link>
      ))}
    </div>
  </BlockWrapper>
);
