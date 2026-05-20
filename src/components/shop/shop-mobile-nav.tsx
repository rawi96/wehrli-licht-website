'use client';

import { useShopCategories } from '@/app/context/shop-nav-context';
import { ShopNavLinks } from '@/components/shop/shop-nav-links';
import { classNames } from '@/utils/css';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

type Props = {
  onLinkClick?: () => void;
};

const mobileLinkClasses =
  'group -mx-3 flex gap-x-3 rounded-md px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-wehrli-400';
const mobileActiveClasses = 'bg-wehrli-400';

export const ShopMobileNav: FC<Props> = ({ onLinkClick }) => {
  const categories = useShopCategories();
  const pathname = usePathname();
  const isShopPage = pathname?.startsWith('/shop') ?? false;
  const isCheckoutPage = pathname?.startsWith('/shop/checkout') ?? false;

  if (!isShopPage || isCheckoutPage || categories.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-white/20 pt-4">
      <p className="mb-2 px-3 text-xs font-bold tracking-wide text-white/70 uppercase">Shop-Kategorien</p>
      <ShopNavLinks
        categories={categories}
        linkClassName={mobileLinkClasses}
        activeLinkClassName={classNames(mobileLinkClasses, mobileActiveClasses)}
        onLinkClick={onLinkClick}
        showIcons={false}
      />
    </div>
  );
};
