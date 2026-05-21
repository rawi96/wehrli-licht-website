import { BlockWrapper } from '@/components/block-wrapper';
import { ShopProductCard } from '@/components/shop/shop-product-card';
import { ShopProductListItem } from '@/utils/shop';
import { FC } from 'react';

type Props = {
  products: ShopProductListItem[];
  basePath?: string;
};

export const AllProductsForCategory: FC<Props> = ({ products, basePath = '/shop' }) => (
  <BlockWrapper disableMarginTop={true}>
    <ul className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
      {products.map((product) => (
        <li key={product.id}>
          <ShopProductCard product={product} basePath={basePath} />
        </li>
      ))}
    </ul>
  </BlockWrapper>
);
