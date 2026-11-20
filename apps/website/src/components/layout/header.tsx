'use client';

import type { MenuItem, MenuLink } from '@/domain/content/site-layout';
import { Header as HeaderLayout, HeaderNavigationItem } from '@wehrli/design-system';
import { usePathname } from 'next/navigation';
import { FC } from 'react';
import { ShopCartButton } from '../shop/shop-cart-button';
import { ShopMobileNav } from '../shop/shop-mobile-nav';

type Props = {
  navigation: MenuItem[];
  /** Shown as a button next to the navigation. */
  contactLink: MenuLink | null;
  variant?: 'overlay' | 'solid';
};

const toNavigationItem = (item: MenuItem, isActive: (path: string) => boolean): HeaderNavigationItem =>
  item.children
    ? { label: item.label, active: isActive(item.href), children: item.children }
    : { label: item.label, href: item.href, active: isActive(item.href) };

export const Header: FC<Props> = ({ navigation, contactLink, variant = 'solid' }) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname?.startsWith(path) ?? false;

  return (
    <HeaderLayout
      variant={variant}
      navigation={[
        ...navigation.map((item) => toNavigationItem(item, isActive)),
        { label: 'Shop', href: '/shop', active: isActive('/shop') },
      ]}
      contact={contactLink}
      cartButton={<ShopCartButton />}
      renderMobileMenuExtra={(closeMobileMenu) => <ShopMobileNav onLinkClick={closeMobileMenu} />}
    />
  );
};
