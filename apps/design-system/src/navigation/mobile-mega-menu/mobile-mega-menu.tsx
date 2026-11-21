'use client';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { FC } from 'react';
import type { NavigationLink } from '../flyout/flyout';
import type { NavigationColumn } from '../mega-menu/mega-menu';

type Props = {
  label: string;
  columns: NavigationColumn[];
  /** The section's overview page, the first link («Übersicht …»). */
  overview?: NavigationLink | null;
  footerLinks?: NavigationLink[];
  /** Called when a link is clicked, e.g. to close the mobile menu. */
  onNavigate?: () => void;
};

const linkClasses = 'hover:bg-wehrli-400 -mx-3 block rounded-lg px-3 py-2 text-sm font-normal text-white';
const strongLinkClasses = 'hover:bg-wehrli-400 -mx-3 block rounded-lg px-3 py-2 text-sm font-bold text-white';

/** A mega menu entry in the mobile menu: the label expands the overview link and the titled groups of links. */
export const MobileMegaMenu: FC<Props> = ({ label, columns, overview, footerLinks = [], onNavigate }) => (
  <Disclosure as="div">
    {({ open }) => (
      <>
        <DisclosureButton className="hover:bg-wehrli-400 -mx-3 flex w-full items-start justify-between rounded-lg px-3 py-2 text-sm leading-7 font-bold text-white">
          <span>{label}</span>
          <span className="ml-6 flex h-7 items-center">
            {open ? (
              <MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
            ) : (
              <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
            )}
          </span>
        </DisclosureButton>
        <DisclosurePanel unmount={false} className="space-y-4 pt-1 pb-3 pl-3">
          {overview && (
            <Link href={overview.href} className={strongLinkClasses} onClick={onNavigate}>
              {overview.label}
            </Link>
          )}
          {columns.map((column) => (
            <div key={column.title}>
              {column.href ? (
                <Link
                  href={column.href}
                  className="text-xxs text-wehrli-50 mb-1 inline-block font-bold tracking-wide uppercase hover:underline"
                  onClick={onNavigate}
                >
                  {column.title}
                </Link>
              ) : (
                <p className="text-xxs text-wehrli-50 mb-1 font-bold tracking-wide uppercase">{column.title}</p>
              )}
              {column.links.map((link) => (
                <Link key={`${link.href}-${link.label}`} href={link.href} className={linkClasses} onClick={onNavigate}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
          {footerLinks.length > 0 && (
            <div>
              {footerLinks.map((link) => (
                <Link key={`${link.href}-${link.label}`} href={link.href} className={strongLinkClasses} onClick={onNavigate}>
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </DisclosurePanel>
      </>
    )}
  </Disclosure>
);
