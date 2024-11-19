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

  const renderMenuItems = (isMobile = false) => {
    if (isShopPage) {
      return (
        <>
          <Link href="/" className={isMobile ? mobileLinkClasses : desktopLinkClasses} onClick={closeMobileMenu}>
            Zurück zur Website
          </Link>
          <Link href="/shop" className={isMobile ? mobileLinkClasses : desktopLinkClasses} onClick={closeMobileMenu}>
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
          <div key={item.label} className="font-semibold relative">
            <NavigationAccordion
              key={item.label}
              title={item.label}
              items={item.navigationItems}
              prefix={item.slug}
              onLinkClick={closeMobileMenu}
            />
          </div>
        ) : (
          <div key={item.label} className="font-semibold relative">
            <Flyout key={item.label} title={item.label} items={item.navigationItems} prefix={item.slug} />
          </div>
        )
      ) : (
        <Link
          key={item.label}
          href={`/${item.link?.slug}`}
          className={isMobile ? mobileLinkClasses : desktopLinkClasses}
          onClick={closeMobileMenu}
        >
          {item.label}
        </Link>
      ),
    );
  };

  // CSS classes for links
  const desktopLinkClasses = 'text-sm font-semibold leading-6 text-white';
  const mobileLinkClasses =
    '-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-400/10';

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
              className="rounded-lg text-gray-400 -m-2.5 inline-flex items-center justify-center p-2.5"
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
                className="rounded-lg text-gray-400 -m-2.5 p-2.5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="sr-only">Menu schliessen</span>
                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="divide-gray-500/25 -my-6 divide-y">
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
