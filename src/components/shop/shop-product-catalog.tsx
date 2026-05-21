'use client';

import { BlockWrapper } from '@/components/block-wrapper';
import { ShopProductCard } from '@/components/shop/shop-product-card';
import { ShopProductSort } from '@/components/shop/shop-product-sort';
import { ShopProductListItem } from '@/utils/shop';
import { getVisibleShopProducts, ShopProductSortKey } from '@/utils/shop-product-list';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { FC, useId, useMemo, useState } from 'react';

type Props = {
  products: ShopProductListItem[];
  basePath?: string;
};

export const ShopProductCatalog: FC<Props> = ({ products, basePath = '/shop' }) => {
  const searchId = useId();
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<ShopProductSortKey>('featured');

  const visibleProducts = useMemo(() => getVisibleShopProducts(products, query, sortKey), [products, query, sortKey]);

  const resultMessage =
    visibleProducts.length === products.length
      ? `${products.length} ${products.length === 1 ? 'Produkt' : 'Produkte'}`
      : `${visibleProducts.length} von ${products.length} Produkten`;

  return (
    <BlockWrapper disableMarginTop={true}>
      <search className="mb-6 flex items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-gray-300 px-4 py-2 transition-colors focus-within:border-gray-400">
          <label htmlFor={searchId} className="sr-only">
            Leuchten suchen
          </label>
          <MagnifyingGlassIcon aria-hidden="true" className="size-5 shrink-0 text-gray-400" />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Leuchten suchen…"
            autoComplete="off"
            className="field-focus-plain min-w-0 flex-1 border-0 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 [&::-webkit-search-cancel-button]:hidden"
          />
        </div>
        <ShopProductSort value={sortKey} onChange={setSortKey} />
      </search>

      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {resultMessage}
      </p>

      {visibleProducts.length > 0 ? (
        <ul className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
          {visibleProducts.map((product) => (
            <li key={product.id}>
              <ShopProductCard product={product} basePath={basePath} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-12 text-center text-sm text-gray-600" role="status">
          Keine Leuchten gefunden.
          {query.trim() && (
            <>
              {' '}
              <button type="button" onClick={() => setQuery('')} className="text-wehrli font-medium hover:underline">
                Suche zurücksetzen
              </button>
            </>
          )}
        </p>
      )}
    </BlockWrapper>
  );
};
