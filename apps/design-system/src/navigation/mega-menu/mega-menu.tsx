'use client';

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { ArrowRightIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { cn } from '../../fundamentals/cn';
import { FC } from 'react';
import { Image, ImageData } from '../../content/image/image';
import type { NavigationLink } from '../flyout/flyout';

/** A titled group of links in the mega menu. */
export type NavigationColumn = {
  title: string;
  links: NavigationLink[];
  /** Link to the group's overview, shown quietly below its links (e.g. «Alle Leistungen»). */
  overview?: NavigationLink | null;
};

/** Image and short text of a section, shown next to the columns with the section's overview link. */
export type NavigationFeature = {
  description?: string | null;
  image?: ImageData | null;
};

type Props = {
  label: string;
  columns: NavigationColumn[];
  /** The section's overview page: the one highlighted link of the panel («Übersicht …»). */
  overview?: NavigationLink | null;
  /** Image and text next to the columns; without them the overview link stands alone in the side panel. */
  feature?: NavigationFeature | null;
  /** Further links, quietly below the columns. */
  footerLinks?: NavigationLink[];
  /** The current page is in this section: the label is underlined. */
  active?: boolean;
  /** `link`: a header navigation entry; `button`: an outlined button (e.g. the shop next to the contact button). */
  trigger?: 'link' | 'button';
};

const triggerClasses = {
  link: {
    idle: 'group inline-flex items-center whitespace-nowrap gap-x-1 border-b-2 border-transparent pb-0.5 text-sm leading-none font-bold text-white transition-colors hover:border-white',
    active:
      'group inline-flex items-center gap-x-1 whitespace-nowrap border-b-2 border-white pb-0.5 text-sm leading-none font-bold text-white transition-colors',
  },
  button: {
    idle: 'group inline-flex items-center whitespace-nowrap gap-x-1 rounded-md border-2 border-white px-3 py-1 text-sm leading-none font-bold text-white transition-colors hover:bg-white hover:text-wehrli',
    active:
      'group inline-flex items-center gap-x-1 whitespace-nowrap rounded-md border-2 border-white bg-white px-3 py-1 text-sm leading-none font-bold text-wehrli transition-colors',
  },
};

const toState = (active?: boolean): 'active' | 'idle' => (active ? 'active' : 'idle');

/**
 * A main navigation entry that opens a wide panel: a side panel with the section's image, text and overview link,
 * and titled columns of links. The panel stays in the document when closed (hidden), so search engines see all links.
 */
export const MegaMenu: FC<Props> = ({ label, columns, overview, feature, footerLinks = [], active, trigger = 'link' }) => {
  // The side panel needs something to show besides the label; without it the columns use the full width.
  const hasSidePanel = Boolean(overview ?? feature?.image ?? feature?.description);

  return (
    <Popover>
      {({ close }) => (
        <>
          <PopoverButton className={triggerClasses[trigger][toState(active)]}>
            <span>{label}</span>
            <ChevronDownIcon
              className="size-4 shrink-0 transition-transform group-data-open:rotate-180 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </PopoverButton>

          <PopoverPanel
            unmount={false}
            transition
            className="absolute inset-x-0 top-full z-20 px-6 pt-3 transition duration-200 ease-out data-closed:-translate-y-2 data-closed:opacity-0 lg:px-8"
          >
            <div
              className={cn(
                'surface-light mx-auto grid max-w-7xl overflow-hidden rounded-md bg-white shadow-lg',
                hasSidePanel && 'lg:grid-cols-[18rem_1fr]',
              )}
            >
              {hasSidePanel && (
                <div className="surface-dark bg-wehrli flex flex-col gap-4 p-6 text-white">
                  {feature?.image && (
                    <div className="relative aspect-[4/3] overflow-hidden rounded-md">
                      <Image image={feature.image} sizes="18rem" absolute />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-2">
                    <p className="text-base font-bold">{label}</p>
                    {feature?.description && <p className="line-clamp-4 text-xs text-white/80">{feature.description}</p>}
                  </div>
                  {overview && (
                    <Link
                      href={overview.href}
                      className="group text-wehrli inline-flex items-center justify-between gap-x-2 rounded-md bg-white px-4 py-2.5 text-sm font-bold transition-colors hover:bg-gray-100"
                      onClick={() => close()}
                    >
                      {overview.label}
                      <ArrowRightIcon
                        className="size-4 shrink-0 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                        aria-hidden="true"
                      />
                    </Link>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-6 p-8">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(11rem,1fr))] gap-8">
                  {columns.map((column, index) => (
                    // Column titles come from the CMS and need not be unique.
                    // eslint-disable-next-line @eslint-react/no-array-index-key
                    <div key={`${index}-${column.title}`} className="flex flex-col">
                      <p className="text-wehrli mb-3 border-b border-gray-200 pb-2 text-xs font-bold">{column.title}</p>
                      <ul className="space-y-0.5">
                        {column.links.map((link) => (
                          <li key={`${link.href}-${link.label}`}>
                            <Link
                              href={link.href}
                              className="group hover:bg-wehrli-50 hover:text-wehrli -mx-2 flex items-center justify-between gap-x-2 rounded-md px-2 py-1.5 text-sm text-black transition-colors"
                              onClick={() => close()}
                            >
                              <span>{link.label}</span>
                              <ChevronRightIcon
                                className="size-4 shrink-0 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none"
                                aria-hidden="true"
                              />
                            </Link>
                          </li>
                        ))}
                      </ul>
                      {column.overview && (
                        <Link
                          href={column.overview.href}
                          className="group hover:text-wehrli mt-3 inline-flex items-center gap-x-1 text-xs text-gray-600 transition-colors"
                          onClick={() => close()}
                        >
                          {column.overview.label}
                          <ArrowRightIcon
                            className="size-3 shrink-0 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                            aria-hidden="true"
                          />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
                {footerLinks.length > 0 && (
                  <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-200 pt-4">
                    {footerLinks.map((link) => (
                      <Link
                        key={`${link.href}-${link.label}`}
                        href={link.href}
                        className="hover:text-wehrli text-xs text-gray-600 transition-colors"
                        onClick={() => close()}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
};
