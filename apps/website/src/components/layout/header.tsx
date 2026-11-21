'use client';

import type { MenuItem, MenuLink } from '@/domain/content/site-layout';
import { SHOP_HOME_PATH } from '@/domain/shop/paths';
import { Header as HeaderLayout, HeaderNavigationItem } from '@wehrli/design-system';
import { usePathname } from 'next/navigation';
import { FC } from 'react';
import { ShopCartButton } from '../shop/shop-cart-button';
import { ShopMobileNav } from '../shop/shop-mobile-nav';

type Props = {
  navigation: MenuItem[];
  /** Shown as a button next to the navigation. */
  contactLink: MenuLink | null;
  /** The shop as a mega menu on the right; without it the header links the shop. */
  shopMenu?: MenuItem | null;
  variant?: 'overlay' | 'solid';
};

/** Label of the overview link at the top of a mega menu. */
const toOverviewLabel = (label: string) => `Übersicht ${label}`;

const toNavigationItem = (item: MenuItem, isActive: (path: string) => boolean): HeaderNavigationItem => {
  if (item.columns) {
    const paths = [item.href, ...item.columns.flatMap(({ links }) => links.map(({ href }) => href))];

    return {
      label: item.label,
      active: paths.some((path) => path !== '/' && isActive(path)),
      columns: item.columns,
      footerLinks: item.footerLinks,
      overview: item.href !== '/' ? { label: toOverviewLabel(item.label), href: item.href } : null,
    };
  }

  return item.children
    ? { label: item.label, active: isActive(item.href), children: item.children }
    : { label: item.label, href: item.href, active: isActive(item.href) };
};

export const Header: FC<Props> = ({ navigation, contactLink, shopMenu, variant = 'solid' }) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname?.startsWith(path.split('#')[0]) ?? false;

  const shop = shopMenu
    ? {
        ...toNavigationItem(shopMenu, isActive),
        // The shop's columns also link content pages (rooms, showroom): it is active on its own pages only.
        active: isActive(shopMenu.href === '/' ? SHOP_HOME_PATH : shopMenu.href),
        overview: shopMenu.columns ? { label: `Zum ${shopMenu.label}`, href: shopMenu.href } : null,
      }
    : null;

  return (
    <HeaderLayout
      variant={variant}
      navigation={[
        ...navigation.map((item) => toNavigationItem(item, isActive)),
        ...(shop ? [] : [{ label: 'Shop', href: SHOP_HOME_PATH, active: isActive(SHOP_HOME_PATH) }]),
      ]}
      shop={shop}
      contact={contactLink}
      cartButton={<ShopCartButton />}
      renderMobileMenuExtra={shop ? undefined : (closeMobileMenu) => <ShopMobileNav onLinkClick={closeMobileMenu} />}
    />
  );
};
