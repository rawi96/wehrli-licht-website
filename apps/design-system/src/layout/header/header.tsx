'use client';

import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { FC, ReactNode, useState } from 'react';
import { cn } from '../../fundamentals/cn';
import { Logo } from '../../icons/logo/logo';
import { Flyout, NavigationLink } from '../../navigation/flyout/flyout';
import { MegaMenu, NavigationColumn, NavigationFeature } from '../../navigation/mega-menu/mega-menu';
import { MobileMenu } from '../../navigation/mobile-menu/mobile-menu';

export type HeaderNavigationItem = {
  label: string;
  /** Link of an entry without sub pages. */
  href?: string;
  /** Sub pages: the entry opens a flyout (desktop) or an accordion (mobile menu). */
  children?: NavigationLink[];
  /** Titled groups of links: the entry opens a mega menu (desktop) or an accordion with groups (mobile menu). */
  columns?: NavigationColumn[];
  /** Overview page of a mega menu entry, linked at the top of its panel. */
  overview?: NavigationLink | null;
  /** Links below the columns of a mega menu entry. */
  footerLinks?: NavigationLink[];
  /** Image and text of a mega menu entry, shown with its overview link. */
  feature?: NavigationFeature | null;
  /** The current page is (in) this entry: the label is underlined. */
  active?: boolean;
};

type HeaderLabels = {
  /** Screen reader name of the logo link to the start page. */
  home: string;
  openMenu: string;
  closeMenu: string;
  /** Screen reader name of the main navigation. */
  navigation: string;
};

const DEFAULT_LABELS: HeaderLabels = {
  home: 'Wehrli Licht GmbH',
  openMenu: 'Menu öffnen',
  closeMenu: 'Menu schliessen',
  navigation: 'Hauptnavigation',
};

type Props = {
  /** Main navigation, centered on desktop and listed in the mobile menu. */
  navigation: HeaderNavigationItem[];
  /** Highlighted contact link, a white button on the right (desktop) or at the end of the mobile menu. */
  contact?: NavigationLink | null;
  /** The shop, set apart on the right as an outlined button (desktop) and below the navigation (mobile menu). */
  shop?: HeaderNavigationItem | null;
  /** `overlay`: transparent over a stage image; `solid`: brand background. */
  variant?: 'overlay' | 'solid';
  labels?: Partial<HeaderLabels>;
  /** Cart button next to the menu button (mobile) and the contact link (desktop). */
  cartButton?: ReactNode;
  /** Extra links at the end of the mobile menu, above the contact link, e.g. shop categories. Gets a callback that closes the mobile menu. */
  renderMobileMenuExtra?: (closeMobileMenu: () => void) => ReactNode;
};

const desktopNavItemClasses =
  'inline-flex whitespace-nowrap items-center border-b-2 pb-0.5 text-sm font-bold leading-none text-white transition-colors duration-150 hover:border-white';
const contactButtonClasses =
  'inline-flex items-center justify-center rounded-md bg-white px-3 py-1.5 text-sm font-bold leading-none text-wehrli transition-colors hover:bg-gray-100';
const shopButtonClasses =
  'inline-flex items-center rounded-md border-2 border-white px-3 py-1 text-sm font-bold leading-none text-white transition-colors hover:bg-white hover:text-wehrli';
const contactButtonMobileClasses =
  'inline-flex w-full items-center justify-center rounded-md bg-white px-5 py-3 text-base font-bold text-wehrli transition-colors hover:bg-gray-100';

/** Site header: logo, main navigation, contact link and cart; below `lg` a menu button opens a full-screen menu. */
export const Header: FC<Props> = ({
  navigation,
  contact,
  variant = 'solid',
  labels: labelOverrides,
  cartButton,
  renderMobileMenuExtra,
  shop,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Keyed by position and label: labels come from the CMS and need not be unique.
  const renderItem = (item: HeaderNavigationItem, index: number, trigger: 'link' | 'button' = 'link') => {
    const key = `${index}-${item.label}`;

    if (item.columns && item.columns.length > 0) {
      return (
        <MegaMenu
          key={key}
          label={item.label}
          columns={item.columns}
          overview={item.overview}
          feature={item.feature}
          footerLinks={item.footerLinks}
          active={item.active}
          trigger={trigger}
        />
      );
    }

    if (item.children) {
      return <Flyout key={key} label={item.label} items={item.children} active={item.active} />;
    }

    return (
      <Link
        key={key}
        href={item.href ?? '/'}
        className={
          trigger === 'button'
            ? shopButtonClasses
            : cn(desktopNavItemClasses, item.active ? 'border-white' : 'border-transparent')
        }
      >
        {item.label}
      </Link>
    );
  };

  return (
    <header className={cn('surface-dark relative z-20 pt-6 pb-6', variant === 'overlay' ? 'bg-transparent' : 'bg-wehrli')}>
      <div className="px-6 lg:px-8">
        <nav
          className="flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center"
          aria-label={labels.navigation}
        >
          <div className="flex items-center lg:justify-self-start">
            <Link href="/" className="-m-1.5 flex items-center p-1.5">
              <span className="sr-only">{labels.home}</span>
              <Logo />
            </Link>
          </div>

          <div className="flex items-center gap-x-3 lg:hidden">
            {cartButton}
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="sr-only">{labels.openMenu}</span>
              <Bars3Icon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>

          <div className="hidden items-center justify-center gap-x-6 lg:flex xl:gap-x-10">
            {navigation.map((item, index) => renderItem(item, index))}
          </div>

          <div className="hidden items-center justify-end gap-x-5 lg:flex">
            {shop && renderItem(shop, navigation.length, 'button')}
            {contact && (
              <Link href={contact.href} className={contactButtonClasses}>
                {contact.label}
              </Link>
            )}
            {cartButton}
          </div>
        </nav>

        <Dialog as="div" open={isMobileMenuOpen} onClose={setIsMobileMenuOpen}>
          <DialogPanel className="surface-dark bg-wehrli fixed inset-0 z-50 overflow-y-auto px-6 py-6 lg:hidden">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5" onClick={closeMobileMenu}>
                <span className="sr-only">{labels.home}</span>
                <Logo />
              </Link>
              <button type="button" className="-m-2.5 p-2.5 text-gray-400" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="sr-only">{labels.closeMenu}</span>
                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-8">
              <MobileMenu
                items={[...navigation, ...(shop ? [shop] : [])]}
                onNavigate={closeMobileMenu}
                footer={
                  renderMobileMenuExtra || contact ? (
                    <div className="flex flex-col gap-6">
                      {renderMobileMenuExtra?.(closeMobileMenu)}
                      {contact && (
                        <Link href={contact.href} className={contactButtonMobileClasses} onClick={closeMobileMenu}>
                          {contact.label}
                        </Link>
                      )}
                    </div>
                  ) : null
                }
              />
            </div>
          </DialogPanel>
        </Dialog>
      </div>
    </header>
  );
};
