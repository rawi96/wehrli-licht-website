'use client';

import { useCategoryNavLinks } from '@/components/shop/hooks/use-category-nav-links';
import { CategoryNav } from '@wehrli/design-system';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

type Props = {
  onLinkClick?: () => void;
};

export const ShopMobileNav: FC<Props> = ({ onLinkClick }) => {
  const links = useCategoryNavLinks();
  const pathname = usePathname();
  const isShopPage = pathname?.startsWith('/shop') ?? false;
  const isCheckoutPage = pathname?.startsWith('/shop/checkout') ?? false;

  if (!isShopPage || isCheckoutPage) {
    return null;
  }

  return <CategoryNav variant="mobile" links={links} onLinkClick={onLinkClick} />;
};
