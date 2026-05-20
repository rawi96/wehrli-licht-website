'use client';

import { useShopContext } from '@/app/context/shop-context';
import { DirectoryRecord, HeaderFooterRecord, NavigationItemRecord } from '@/graphql/generated';
import { classNames } from '@/utils/css';
import { splitHeaderMenu } from '@/utils/navigation';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, useState } from 'react';
import { Flyout } from '../flyout';
import { ShopCartButton } from '../shop/shop-cart-button';
import { ShopMobileNav } from '../shop/shop-mobile-nav';
import { ShoppingCart } from '../shop/shopping-cart';
import { Logo } from './logo';
import { NavigationAccordion } from './navigation-accordion';

type Props = {
  headerFooter: HeaderFooterRecord;
  variant?: 'overlay' | 'solid';
};

export const Header: FC<Props> = ({ headerFooter: { menu }, variant = 'solid' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { primary, contact } = splitHeaderMenu(menu);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const { isShowCart, setIsShowCart } = useShopContext();
  const pathname = usePathname();

  const desktopNavItemClasses =
    'inline-flex items-center border-b-2 border-transparent pb-0.5 text-sm font-bold leading-none text-white transition-colors duration-150 hover:border-white';
  const mobileLinkClasses = 'rounded -mx-3 block font-bold text-sm px-3 py-2 text-white hover:bg-wehrli-400';
  const activeNavClasses = 'border-white';
  const contactButtonClasses =
    'inline-flex items-center justify-center rounded bg-white px-3 py-1.5 text-sm font-bold leading-none text-wehrli transition-colors hover:bg-gray-100';
  const contactButtonMobileClasses =
    'inline-flex w-full items-center justify-center rounded bg-white px-5 py-2.5 text-sm font-bold text-wehrli transition-colors hover:bg-gray-100';

  const isActive = (path: string) => pathname?.startsWith(path) ?? false;

  const renderPrimaryItem = (item: NavigationItemRecord | DirectoryRecord, isMobile = false) =>
    'navigationItems' in item ? (
      isMobile ? (
        <div key={item.label} className="relative font-bold">
          <NavigationAccordion
            title={item.label}
            items={item.navigationItems}
            prefix={item.slug}
            onLinkClick={closeMobileMenu}
          />
        </div>
      ) : (
        <Flyout key={item.label} title={item.label} items={item.navigationItems} prefix={item.slug} />
      )
    ) : (
      <Link
        key={item.label}
        href={`/${item.link?.slug}`}
        className={classNames(
          isMobile ? mobileLinkClasses : desktopNavItemClasses,
          isActive(`/${item.link?.slug}`) && activeNavClasses,
        )}
        onClick={closeMobileMenu}
      >
        {item.label}
      </Link>
    );

  const renderShopLink = (isMobile = false) => (
    <Link
      href="/shop"
      className={classNames(isMobile ? mobileLinkClasses : desktopNavItemClasses, isActive('/shop') && activeNavClasses)}
      onClick={closeMobileMenu}
    >
      Shop
    </Link>
  );

  const contactHref = contact?.link?.slug ? `/${contact.link.slug}` : '/kontakt';

  return (
    <header className={classNames('pt-6 pb-6', variant === 'overlay' ? 'bg-transparent' : 'bg-wehrli')}>
      <div className="px-6 lg:px-8">
        <nav
          className="flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center"
          aria-label="Global"
        >
          <div className="flex items-center lg:justify-self-start">
            <Link href="/" className="-m-1.5 flex items-center p-1.5">
              <span className="sr-only">Wehrli Licht GmbH</span>
              <Logo />
            </Link>
          </div>

          <div className="flex items-center gap-x-3 lg:hidden">
            <ShopCartButton onClick={closeMobileMenu} />
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded p-2.5 text-gray-400"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="sr-only">Menu öffnen</span>
              <Bars3Icon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>

          <div className="hidden items-center justify-center gap-x-10 lg:flex">
            {primary.map((item) => renderPrimaryItem(item))}
            {renderShopLink()}
          </div>

          <div className="hidden items-center justify-end gap-x-5 lg:flex">
            {contact && (
              <Link href={contactHref} className={contactButtonClasses}>
                {contact.label}
              </Link>
            )}
            <ShopCartButton />
          </div>
        </nav>

        <Dialog as="div" open={isMobileMenuOpen} onClose={setIsMobileMenuOpen}>
          <Dialog.Panel className="bg-wehrli fixed inset-0 z-10 overflow-y-auto px-6 py-6 lg:hidden">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5" onClick={closeMobileMenu}>
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
              <div className="space-y-2 py-6">
                {primary.map((item) => renderPrimaryItem(item, true))}
                {renderShopLink(true)}
                <ShopMobileNav onLinkClick={closeMobileMenu} />
                {contact && (
                  <div className="border-t border-white/20 pt-4">
                    <Link href={contactHref} className={contactButtonMobileClasses} onClick={closeMobileMenu}>
                      {contact.label}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
        <ShoppingCart open={isShowCart} setOpen={setIsShowCart} />
      </div>
    </header>
  );
};
