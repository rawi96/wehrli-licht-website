'use client';

import { useShopCategories } from '@/app/context/shop-nav-context';
import { ShopNavLinks } from '@/components/shop/shop-nav-links';
import { FC } from 'react';

type Props = {
  activeCategorySlug?: string;
  showAllProductsActive?: boolean;
};

export const ShopSidebar: FC<Props> = ({ activeCategorySlug, showAllProductsActive }) => {
  const categories = useShopCategories();

  if (categories.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Shop-Kategorien" className="flex flex-col gap-y-5">
      <div>
        <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Kategorien</p>
        <div className="mt-2">
          <ShopNavLinks
            categories={categories}
            activeCategorySlug={activeCategorySlug}
            showAllProductsActive={showAllProductsActive}
          />
        </div>
      </div>
    </nav>
  );
};
