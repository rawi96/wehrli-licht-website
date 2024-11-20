'use client';

import { useShopContext } from '@/app/context/shop-context';
import { DirectoryRecord, HeaderFooterRecord, NavigationItemRecord } from '@/graphql/generated';
import { classNames } from '@/utils/css';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, useState } from 'react';
import { Flyout } from '../flyout';
import { ShoppingCart } from '../shop/shopping-cart';
import { Logo } from './logo';
import { NavigationAccordion } from './navigation-accordion';

type Props = {
  headerFooter: HeaderFooterRecord;
};

export const Header: FC<Props> = ({ headerFooter: { menu } }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const { shoppingCart, isShowCart, setIsShowCart } = useShopContext();
  const pathname = usePathname();
  const isShopPage = pathname.includes('/shop');
  const isHomePage = pathname === '/';

  const desktopLinkClasses =
    'font-bold text-xs text-white border-b-2 hover:border-white transition-colors duration-150 border-transparent';
  const mobileLinkClasses = 'rounded -mx-3 block font-bold text-xs px-3 py-2 text-white hover:bg-wehrli-400';
  const activeLinkClasses = 'border-white';

  const isActive = (path: string) => pathname.startsWith(path);

  const renderMenuItems = (isMobile = false) => {
    if (isShopPage) {
      return (
        <>
          <Link
            href="/"
            className={classNames(isMobile ? mobileLinkClasses : desktopLinkClasses, pathname === '/' && activeLinkClasses)}
            onClick={closeMobileMenu}
          >
            Zurück zur Website
          </Link>
          <Link
            href="/shop"
            className={classNames(isMobile ? mobileLinkClasses : desktopLinkClasses, isActive('/shop') && activeLinkClasses)}
            onClick={closeMobileMenu}
          >
            Shop
          </Link>
          <button className={isMobile ? mobileLinkClasses : desktopLinkClasses} onClick={() => setIsShowCart(true)}>
            Warenkorb{' '}
            {shoppingCart?.item_quantity && shoppingCart.item_quantity > 0 ? `(${shoppingCart.item_quantity})` : ''}
          </button>
        </>
      );
    }

    return menu.map((item: NavigationItemRecord | DirectoryRecord) =>
      'navigationItems' in item ? (
        isMobile ? (
          <div key={item.label} className="relative font-bold">
            <NavigationAccordion
              key={item.label}
              title={item.label}
              items={item.navigationItems}
              prefix={item.slug}
              onLinkClick={closeMobileMenu}
            />
          </div>
        ) : (
          <div key={item.label} className="relative font-bold">
            <Flyout key={item.label} title={item.label} items={item.navigationItems} prefix={item.slug} />
          </div>
        )
      ) : (
        <Link
          key={item.label}
          href={`/${item.link?.slug}`}
          className={classNames(
            isMobile ? mobileLinkClasses : desktopLinkClasses,
            isActive(`/${item.link?.slug}`) && activeLinkClasses,
          )}
          onClick={closeMobileMenu}
        >
          {item.label}
        </Link>
      ),
    );
  };

  return (
    <div className={classNames('pt-6', isHomePage ? 'bg-transparent' : 'bg-wehrli')}>
      <div className="px-6 lg:px-8">
        {/* Desktop Navigation */}
        <nav className="flex items-center justify-between pb-6" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Wehrli Licht GmbH</span>
              <Logo />
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded p-2.5 text-gray-400"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="sr-only">Menu öffnen</span>
              <Bars3Icon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">{renderMenuItems()}</div>
        </nav>

        {/* Mobile Navigation */}
        <Dialog as="div" open={isMobileMenuOpen} onClose={setIsMobileMenuOpen}>
          <Dialog.Panel className="fixed inset-0 z-10 overflow-y-auto bg-wehrli px-6 py-6 lg:hidden">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Wehrli Licht GmbH</span>
                <Logo />
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-lg p-2.5 text-gray-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="sr-only">Menu schliessen</span>
                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/25">
                <div className="space-y-2 py-6">{renderMenuItems(true)}</div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
        <ShoppingCart open={isShowCart} setOpen={setIsShowCart} />
      </div>
    </div>
  );
};
