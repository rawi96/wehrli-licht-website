import { getLowestPriceFromVariantsOrProductPrice } from '@/utils/price';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import { Product } from 'swell-js';
import { BlockWrapper } from '../block-wrapper';
import { Grid } from '../grid';

type Props = {
  products: Product[];
};

export const AllProductsForCategory: FC<Props> = ({ products }) => (
  <BlockWrapper disableMarginTop={true}>
    <Grid cols={products?.length ?? 4}>
      {products?.map((product) => (
        <Link
          key={product.id}
          href={`/shop/produkte/${product.slug}`}
          className="group flex h-full flex-col justify-between"
        >
          <div className="relative overflow-hidden rounded bg-gray-200">
            {product.images?.length && product.images[0].file?.url && (
              <Image
                src={product.images[0].file.url}
                alt={product.name}
                className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                width={1000}
                height={1000}
              />
            )}
          </div>
          <div className="mt-4 flex flex-1 flex-col justify-end">
            <h3 className="text-lg font-bold text-wehrli">{product.name}</h3>
            <p className="mt-1 text-xs">{getLowestPriceFromVariantsOrProductPrice(product)}</p>
          </div>
        </Link>
      ))}
    </Grid>
  </BlockWrapper>
);
