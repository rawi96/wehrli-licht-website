'use client';

import { useShopContext } from '@/app/context/shop-context';
import { DirectoryRecord, HeaderFooterRecord, NavigationItemRecord } from '@/graphql/generated';
import { splitHeaderMenu } from '@/utils/navigation';
import { Header as HeaderLayout, HeaderNavigationItem } from '@wehrli/design-system';
import { usePathname } from 'next/navigation';
import { FC } from 'react';
import { ShopCartButton } from '../shop/shop-cart-button';
import { ShopMobileNav } from '../shop/shop-mobile-nav';
import { ShoppingCart } from '../shop/shopping-cart';

type Props = {
  headerFooter: HeaderFooterRecord;
  variant?: 'overlay' | 'solid';
};

const toNavigationItem = (
  item: NavigationItemRecord | DirectoryRecord,
  isActive: (path: string) => boolean,
): HeaderNavigationItem =>
  'navigationItems' in item
    ? {
        label: item.label,
        active: isActive(`/${item.slug}`),
        children: item.navigationItems.map((child) => ({
          label: child.label,
          href: child.link?.slug ? `/${item.slug}/${child.link.slug}` : '/',
        })),
      }
    : { label: item.label, href: `/${item.link?.slug}`, active: isActive(`/${item.link?.slug}`) };

export const Header: FC<Props> = ({ headerFooter: { menu }, variant = 'solid' }) => {
  const { primary, contact } = splitHeaderMenu(menu);
  const { isShowCart, setIsShowCart } = useShopContext();
  const pathname = usePathname();

  const isActive = (path: string) => pathname?.startsWith(path) ?? false;

  const navigation: HeaderNavigationItem[] = [
    ...primary.map((item) => toNavigationItem(item, isActive)),
    { label: 'Shop', href: '/shop', active: isActive('/shop') },
  ];

  return (
    <>
      <HeaderLayout
        variant={variant}
        navigation={navigation}
        contact={contact?.link?.slug ? { label: contact.label, href: `/${contact.link.slug}` } : null}
        cartButton={<ShopCartButton />}
        renderMobileMenuExtra={(closeMobileMenu) => <ShopMobileNav onLinkClick={closeMobileMenu} />}
      />
      <ShoppingCart open={isShowCart} setOpen={setIsShowCart} />
    </>
  );
};
