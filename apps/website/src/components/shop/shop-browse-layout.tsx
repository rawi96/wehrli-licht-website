'use client';

import { useCategoryNavLinks } from '@/components/shop/hooks/use-category-nav-links';
import { CategoryNav, ShopBrowseLayout as ShopBrowseLayoutView } from '@wehrli/design-system';
import { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  activeCategorySlug?: string;
  showAllProductsActive?: boolean;
}>;

export const ShopBrowseLayout: FC<Props> = ({ activeCategorySlug, showAllProductsActive, children }) => {
  const links = useCategoryNavLinks({ activeCategorySlug, showAllProductsActive });

  return <ShopBrowseLayoutView sidebar={<CategoryNav variant="sidebar" links={links} />}>{children}</ShopBrowseLayoutView>;
};
