'use client';

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { ArrowRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { FC } from 'react';
import type { NavigationLink } from '../flyout/flyout';

/** A titled group of links in the mega menu. */
export type NavigationColumn = {
  title: string;
  /** Overview page of the group: the title becomes a link. */
  href?: string | null;
  links: NavigationLink[];
};

type Props = {
  label: string;
  columns: NavigationColumn[];
  /** The section's overview page, linked at the top of the panel («Übersicht …»). */
  overview?: NavigationLink | null;
  /** Further links below the columns. */
  footerLinks?: NavigationLink[];
  /** The current page is in this section: the label is underlined. */
  active?: boolean;
  /** `link`: a header navigation entry; `button`: a white button (e.g. the shop next to the contact button). */
  trigger?: 'link' | 'button';
};

const triggerClasses = {
  link: {
    idle: 'inline-flex items-center gap-x-1 border-b-2 border-transparent pb-0.5 text-sm leading-none font-bold text-white transition-colors duration-150 hover:border-white',
    active:
      'inline-flex items-center gap-x-1 border-b-2 border-white pb-0.5 text-sm leading-none font-bold text-white transition-colors duration-150',
  },
  button: {
    idle: 'inline-flex items-center gap-x-1 rounded-lg border-2 border-white px-3 py-1 text-sm leading-none font-bold text-white transition-colors hover:bg-white hover:text-wehrli',
    active:
      'inline-flex items-center gap-x-1 rounded-lg border-2 border-white bg-white px-3 py-1 text-sm leading-none font-bold text-wehrli transition-colors',
  },
};

const toState = (active?: boolean): 'active' | 'idle' => (active ? 'active' : 'idle');

/**
 * A main navigation entry that opens a wide panel with titled columns of links. The panel stays in the document when
 * closed (hidden), so search engines see all links.
 */
export const MegaMenu: FC<Props> = ({ label, columns, overview, footerLinks = [], active, trigger = 'link' }) => (
  <Popover>
    {({ close }) => (
      <>
        <PopoverButton className={triggerClasses[trigger][toState(active)]}>
          <span>{label}</span>
          <ChevronDownIcon className="size-4 shrink-0" aria-hidden="true" />
        </PopoverButton>

        <PopoverPanel
          unmount={false}
          transition
          className="absolute inset-x-0 top-full z-20 px-6 pt-2 transition duration-200 ease-out data-closed:translate-y-1 data-closed:opacity-0 lg:px-8"
        >
          <div className="mx-auto max-w-7xl rounded-lg bg-white p-8 shadow-lg">
            {overview && (
              <Link
                href={overview.href}
                className="text-wehrli mb-6 inline-flex items-center gap-x-2 text-base font-bold hover:underline"
                onClick={() => close()}
              >
                {overview.label}
                <ArrowRightIcon className="size-5 shrink-0" aria-hidden="true" />
              </Link>
            )}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-x-8 gap-y-6">
              {columns.map((column) => (
                <div key={column.title}>
                  {column.href ? (
                    <Link
                      href={column.href}
                      className="text-xxs hover:text-wehrli mb-2 inline-block font-bold tracking-wide text-gray-500 uppercase hover:underline"
                      onClick={() => close()}
                    >
                      {column.title}
                    </Link>
                  ) : (
                    <p className="text-xxs mb-2 font-bold tracking-wide text-gray-500 uppercase">{column.title}</p>
                  )}
                  <ul className="space-y-1">
                    {column.links.map((link) => (
                      <li key={`${link.href}-${link.label}`}>
                        <Link
                          href={link.href}
                          className="hover:text-wehrli -mx-2 block rounded-sm px-2 py-1.5 text-sm text-black hover:bg-gray-100"
                          onClick={() => close()}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {footerLinks.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-200 pt-4">
                {footerLinks.map((link) => (
                  <Link
                    key={`${link.href}-${link.label}`}
                    href={link.href}
                    className="text-wehrli inline-flex items-center gap-x-1 text-sm font-bold hover:underline"
                    onClick={() => close()}
                  >
                    {link.label}
                    <ArrowRightIcon className="size-4 shrink-0" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </PopoverPanel>
      </>
    )}
  </Popover>
);
