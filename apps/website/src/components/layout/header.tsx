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
  /** Overview links of the mega menus («Zur Übersicht», «Zum Online-Shop»). */
  labels: { overview: string; shopOverview: string };
};

/**
 * A mega menu section is active on its own pages (below its overview page). Pages it only links to are counted when
 * no section owns them, e.g. /kontakt in «Über uns», but not the room pages the «Ratgeber» shares with «Licht planen».
 */
const isSectionActive = (item: MenuItem, sectionHrefs: string[], isActive: (path: string) => boolean): boolean => {
  if (item.href !== '/' && isActive(item.href)) {
    return true;
  }

  const ownedByASection = sectionHrefs.some((href) => href !== '/' && isActive(href));
  const links = item.columns?.flatMap(({ links: columnLinks }) => columnLinks.map(({ href }) => href)) ?? [];

  return !ownedByASection && links.some((path) => path !== '/' && isActive(path));
};

const toNavigationItem = (
  item: MenuItem,
  isActive: (path: string) => boolean,
  overviewLabel: string,
  sectionHrefs: string[] = [],
): HeaderNavigationItem => {
  if (item.columns) {
    return {
      label: item.label,
      active: isSectionActive(item, sectionHrefs, isActive),
      columns: item.columns,
      footerLinks: item.footerLinks,
      feature: item.teaser ? { description: item.teaser.description, image: item.teaser.image } : null,
      overview: item.href !== '/' ? { label: overviewLabel, href: item.href } : null,
    };
  }

  return item.children
    ? { label: item.label, active: isActive(item.href), children: item.children }
    : { label: item.label, href: item.href, active: isActive(item.href) };
};

export const Header: FC<Props> = ({ navigation, contactLink, shopMenu, labels, variant = 'solid' }) => {
  const pathname = usePathname();

  // The page part of a link (without anchor or query) is active on itself and below it. «/» (also «/#…») would match
  // every page: the home page never marks a section.
  const isActive = (href: string) => {
    const path = href.split(/[#?]/)[0].replace(/(.)\/+$/, '$1');
    if (!pathname || !path || path === '/') {
      return false;
    }

    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const shop = shopMenu
    ? {
        ...toNavigationItem(shopMenu, isActive, labels.overview),
        // The shop's columns also link content pages (rooms, showroom): it is active on its own pages only.
        active: isActive(shopMenu.href === '/' ? SHOP_HOME_PATH : shopMenu.href),
        // Without its own page or path the shop section links «/»: its overview is the shop home then.
        overview: shopMenu.columns
          ? { label: labels.shopOverview, href: shopMenu.href === '/' ? SHOP_HOME_PATH : shopMenu.href }
          : null,
      }
    : null;

  return (
    <HeaderLayout
      variant={variant}
      navigation={[
        ...navigation.map((item) =>
          toNavigationItem(
            item,
            isActive,
            labels.overview,
            navigation.map(({ href }) => href),
          ),
        ),
        // The shop is the last entry of the main navigation; on the right are only contact and cart.
        shop ?? { label: 'Shop', href: SHOP_HOME_PATH, active: isActive(SHOP_HOME_PATH) },
      ]}
      contact={contactLink}
      cartButton={<ShopCartButton />}
      renderMobileMenuExtra={shop ? undefined : (closeMobileMenu) => <ShopMobileNav onLinkClick={closeMobileMenu} />}
    />
  );
};
