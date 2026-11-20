'use client';

import { useShopCategories } from '@/components/shop/shop-nav-context';
import { getShopCategoryPath, SHOP_ALL_PRODUCTS_PATH } from '@/domain/shop/paths';
import type { CategoryNavLink } from '@wehrli/design-system';
import { usePathname } from 'next/navigation';

type Options = {
  activeCategorySlug?: string;
  showAllProductsActive?: boolean;
};

/** «Alle Leuchten» and the shop categories as navigation links, the current page marked active. Empty without categories. */
export const useCategoryNavLinks = ({ activeCategorySlug, showAllProductsActive }: Options = {}): CategoryNavLink[] => {
  const categories = useShopCategories();
  const pathname = usePathname();

  if (categories.length === 0) {
    return [];
  }

  return [
    {
      id: 'all-products',
      label: 'Alle Leuchten',
      href: SHOP_ALL_PRODUCTS_PATH,
      active: showAllProductsActive ?? pathname === SHOP_ALL_PRODUCTS_PATH,
    },
    ...categories.map((category) => {
      const href = getShopCategoryPath(category.slug);

      return {
        id: category.id,
        label: category.name,
        href,
        active: activeCategorySlug === category.slug || pathname === href,
        thumbnailSrc: category.image?.responsive?.src,
      };
    }),
  ];
};
