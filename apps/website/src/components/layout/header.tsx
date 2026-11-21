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
const toOverviewLabel = () => 'Zur Übersicht';

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
  sectionHrefs: string[] = [],
): HeaderNavigationItem => {
  if (item.columns) {
    return {
      label: item.label,
      active: isSectionActive(item, sectionHrefs, isActive),
      columns: item.columns,
      footerLinks: item.footerLinks,
      feature: item.teaser ? { description: item.teaser.description, image: item.teaser.image } : null,
      overview: item.href !== '/' ? { label: toOverviewLabel(), href: item.href } : null,
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
        ...navigation.map((item) =>
          toNavigationItem(
            item,
            isActive,
            navigation.map(({ href }) => href),
          ),
        ),
        ...(shop ? [] : [{ label: 'Shop', href: SHOP_HOME_PATH, active: isActive(SHOP_HOME_PATH) }]),
      ]}
      shop={shop}
      contact={contactLink}
      cartButton={<ShopCartButton />}
      renderMobileMenuExtra={shop ? undefined : (closeMobileMenu) => <ShopMobileNav onLinkClick={closeMobileMenu} />}
    />
  );
};
