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
  /** The section's overview page, the last link («Übersicht …»). */
  overview?: NavigationLink | null;
  footerLinks?: NavigationLink[];
  /** Called when a link is clicked, e.g. to close the mobile menu. */
  onNavigate?: () => void;
};

const linkClasses = 'hover:bg-wehrli-400 -mx-3 block rounded-lg px-3 py-2 text-sm font-normal text-white';
const strongLinkClasses =
  'hover:bg-wehrli-400 -mx-3 mt-2 block rounded-lg border border-white/30 px-3 py-2 text-sm font-bold text-white';

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
          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-xxs text-wehrli-50 mb-1 font-bold tracking-wide uppercase">{column.title}</p>
              {column.links.map((link) => (
                <Link key={`${link.href}-${link.label}`} href={link.href} className={linkClasses} onClick={onNavigate}>
                  {link.label}
                </Link>
              ))}
              {column.overview && (
                <Link
                  href={column.overview.href}
                  className="-mx-3 block rounded-lg px-3 py-1.5 text-xs text-white/60 hover:text-white"
                  onClick={onNavigate}
                >
                  {column.overview.label} →
                </Link>
              )}
            </div>
          ))}
          {[...(overview ? [overview] : []), ...footerLinks].length > 0 && (
            <div>
              {[...(overview ? [overview] : []), ...footerLinks].map((link) => (
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
