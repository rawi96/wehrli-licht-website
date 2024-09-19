'use client';

import { DirectoryRecord, NavigationItemRecord } from '@/graphql/generated';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { FC, useState } from 'react';
import { Flyout } from '../flyout';
import { Logo } from './logo';
import { NavigationAccordion } from './navigation-accordion';

type Props = {
  items: NavigationItemRecord[] | DirectoryRecord[];
};

export const Navigation: FC<Props> = ({ items }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="mb-20 bg-wehrli">
        <div className="px-6 lg:px-8">
          <nav className="flex items-center justify-between py-6" aria-label="Global">
            <div className="flex lg:flex-1">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Wehrli Licht GmbH</span>
                <Logo />
              </Link>
            </div>
            <div className="flex lg:hidden">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-lg p-2.5 text-gray-400"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <span className="sr-only">Menu öffnen</span>
                <Bars3Icon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            <div className="hidden lg:flex lg:gap-x-12">
              {items.map((item: NavigationItemRecord | DirectoryRecord) =>
                'navigationItems' in item ? (
                  <div key={item.label} className="relative font-semibold">
                    <Flyout key={item.label} title={item.label} items={item.navigationItems} prefix={item.slug} />
                  </div>
                ) : (
                  <Link key={item.label} href={`/${item.link?.slug}`} className="text-sm font-semibold leading-6 text-white">
                    {item.label}
                  </Link>
                ),
              )}
            </div>
          </nav>
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
                  <div className="space-y-2 py-6">
                    {items.map((item: NavigationItemRecord | DirectoryRecord) =>
                      'navigationItems' in item ? (
                        <div key={item.label} className="relative font-semibold">
                          <NavigationAccordion
                            key={item.label}
                            title={item.label}
                            items={item.navigationItems}
                            prefix={item.slug}
                          />
                        </div>
                      ) : (
                        <Link
                          key={item.label}
                          href={`/${item.link?.slug}`}
                          className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-400/10"
                        >
                          {item.label}
                        </Link>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Dialog>
        </div>
      </div>
    </>
  );
};
