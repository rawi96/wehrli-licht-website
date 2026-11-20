'use client';

import { toProductCardData } from '@/components/shop/cards';
import type { ProductSummary } from '@/domain/shop/product';
import { getVisibleShopProducts, SHOP_PRODUCT_SORT_OPTIONS, ShopProductSortKey } from '@/domain/shop/product-list';
import { ProductCatalog, SortMenu } from '@wehrli/design-system';
import { FC, useMemo, useState } from 'react';

type Props = {
  products: ProductSummary[];
  /** Visually hidden heading of the list. */
  heading: string;
  headingId: string;
  basePath?: string;
};

export const ShopProductCatalog: FC<Props> = ({ products, heading, headingId, basePath = '/shop' }) => {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<ShopProductSortKey>('featured');

  const visibleProducts = useMemo(() => getVisibleShopProducts(products, query, sortKey), [products, query, sortKey]);

  const resultMessage =
    visibleProducts.length === products.length
      ? `${products.length} ${products.length === 1 ? 'Produkt' : 'Produkte'}`
      : `${visibleProducts.length} von ${products.length} Produkten`;

  return (
    <ProductCatalog
      heading={heading}
      headingId={headingId}
      products={visibleProducts.map((product) => toProductCardData(product, basePath))}
      query={query}
      onQueryChange={setQuery}
      sort={<SortMenu<ShopProductSortKey> options={SHOP_PRODUCT_SORT_OPTIONS} value={sortKey} onChange={setSortKey} />}
      resultMessage={resultMessage}
    />
  );
};
