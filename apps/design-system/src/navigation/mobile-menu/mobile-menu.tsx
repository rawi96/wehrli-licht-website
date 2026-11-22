'use client';

import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { FC, ReactNode, useEffect, useId, useRef, useState } from 'react';
import { cn } from '../../fundamentals/cn';
import type { NavigationLink } from '../flyout/flyout';
import type { NavigationColumn, NavigationFeature } from '../mega-menu/mega-menu';

export type MobileMenuItem = {
  label: string;
  /** Link of an entry without sub pages. */
  href?: string;
  /** Sub pages, listed in the entry's panel. */
  children?: NavigationLink[];
  /** Titled groups of links, listed in the entry's panel. */
  columns?: NavigationColumn[];
  /** Overview page of the entry, the first link of its panel. */
  overview?: NavigationLink | null;
  /** Links below the groups. */
  footerLinks?: NavigationLink[];
  /** Its text is shown with the overview link. */
  feature?: NavigationFeature | null;
  /** The current page is (in) this entry. */
  active?: boolean;
};

type Props = {
  items: MobileMenuItem[];
  /** Called when a link is clicked, e.g. to close the menu. */
  onNavigate?: () => void;
  /** Below the entries on the first level, e.g. the contact button. */
  footer?: ReactNode;
  labels?: { back?: string };
};

/** Duration of the slide between the levels (duration-300). */
const SLIDE_MS = 300;

const hasPanel = (item: MobileMenuItem): boolean => (item.columns?.length ?? 0) + (item.children?.length ?? 0) > 0;

const rowClasses =
  'flex w-full items-center justify-between gap-x-4 rounded-md px-3 py-3 text-left text-base font-bold text-white transition-colors hover:bg-white/10';
const subLinkClasses = 'block rounded-md px-3 py-2.5 text-base text-white transition-colors hover:bg-white/10';

const ActiveDot: FC<{ active?: boolean }> = ({ active }) =>
  active ? <span className="size-2 shrink-0 rounded-full bg-white" aria-hidden="true" /> : null;

/**
 * Mobile navigation as two levels: the main entries, and per entry a panel that slides in with its overview link
 * first, then its groups of links. Built for quick tapping: large rows, the overview on top, a back button.
 */
export const MobileMenu: FC<Props> = ({ items, onNavigate, footer, labels }) => {
  const [panelIndex, setPanelIndex] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const backRef = useRef<HTMLButtonElement>(null);
  const triggersRef = useRef<(HTMLButtonElement | null)[]>([]);
  const panelId = useId();
  const panelItem = panelIndex === null ? null : items[panelIndex];

  useEffect(() => {
    // preventScroll: the panel is still sliding in, scrolling to it would shift the menu sideways.
    if (open) {
      backRef.current?.focus({ preventScroll: true });
    } else if (panelIndex !== null) {
      triggersRef.current[panelIndex]?.focus({ preventScroll: true });
    }
  }, [open, panelIndex]);

  // Unmount a closed panel after its slide-out. transitionend does not fire without a transition (reduced motion),
  // so a timeout of the transition's length clears it as well.
  useEffect(() => {
    if (open || panelIndex === null) {
      return;
    }
    const timeout = window.setTimeout(() => setPanelIndex(null), SLIDE_MS);

    return () => window.clearTimeout(timeout);
  }, [open, panelIndex]);

  const sliding = 'col-start-1 row-start-1 transition-transform duration-300 ease-out motion-reduce:transition-none';

  return (
    <div className="grid overflow-x-clip">
      {/* First level */}
      <div className={cn(sliding, open ? '-translate-x-full' : 'translate-x-0')} inert={open}>
        <ul className="divide-y divide-white/10">
          {items.map((item, index) => (
            // Labels come from the CMS and need not be unique.
            // eslint-disable-next-line @eslint-react/no-array-index-key
            <li key={`${index}-${item.label}`} className="py-1">
              {hasPanel(item) ? (
                <button
                  ref={(element) => {
                    triggersRef.current[index] = element;
                  }}
                  type="button"
                  className={rowClasses}
                  aria-expanded={open && panelIndex === index}
                  aria-controls={panelId}
                  onClick={() => {
                    setPanelIndex(index);
                    setOpen(true);
                  }}
                >
                  <span className="flex items-center gap-x-3">
                    {item.label}
                    <ActiveDot active={item.active} />
                  </span>
                  <ChevronRightIcon className="size-5 shrink-0 text-white/80" aria-hidden="true" />
                </button>
              ) : (
                <Link
                  href={item.href ?? '/'}
                  className={rowClasses}
                  aria-current={item.active ? 'page' : undefined}
                  onClick={onNavigate}
                >
                  <span className="flex items-center gap-x-3">
                    {item.label}
                    <ActiveDot active={item.active} />
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ul>
        {footer ? <div className="mt-6">{footer}</div> : null}
      </div>

      {/* Second level: the panel of one entry */}
      <div
        id={panelId}
        className={cn(sliding, open ? 'translate-x-0' : 'invisible translate-x-full')}
        inert={!open}
        role="region"
        aria-label={panelItem?.label}
      >
        {panelItem && (
          <div className="flex flex-col gap-6">
            <div>
              <button
                ref={backRef}
                type="button"
                className="-ml-1 inline-flex items-center gap-x-1 rounded-md py-1 pr-2 text-sm font-bold text-white/80 transition-colors hover:text-white"
                onClick={() => setOpen(false)}
              >
                <ChevronLeftIcon className="size-4" aria-hidden="true" />
                {labels?.back ?? 'Zurück'}
              </button>
              <p className="mt-3 text-xl font-bold text-white">{panelItem.label}</p>
            </div>

            {panelItem.overview && (
              <Link
                href={panelItem.overview.href}
                className="group flex items-center justify-between gap-x-4 rounded-md bg-white px-4 py-4 transition-colors hover:bg-gray-100"
                onClick={onNavigate}
              >
                <span className="flex flex-col gap-1">
                  <span className="text-wehrli text-base font-bold">{panelItem.overview.label}</span>
                  {panelItem.feature?.description && (
                    <span className="line-clamp-2 text-sm text-gray-600">{panelItem.feature.description}</span>
                  )}
                </span>
                <ArrowRightIcon
                  className="text-wehrli size-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </Link>
            )}

            {panelItem.columns?.map((column, index) => (
              // Column titles come from the CMS and need not be unique.
              // eslint-disable-next-line @eslint-react/no-array-index-key
              <div key={`${index}-${column.title}`}>
                <p className="mb-1 px-3 text-sm font-bold text-white/80">{column.title}</p>
                <ul>
                  {column.links.map((link) => (
                    <li key={`${link.href}-${link.label}`}>
                      <Link href={link.href} className={subLinkClasses} onClick={onNavigate}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  {column.overview && (
                    <li>
                      <Link
                        href={column.overview.href}
                        className="inline-flex items-center gap-x-1 rounded-md px-3 py-2 text-sm font-bold text-white/80 transition-colors hover:text-white"
                        onClick={onNavigate}
                      >
                        {column.overview.label}
                        <ChevronRightIcon className="size-4" aria-hidden="true" />
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            ))}

            {panelItem.children && panelItem.children.length > 0 && (
              <ul>
                {panelItem.children.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <Link href={link.href} className={subLinkClasses} onClick={onNavigate}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {panelItem.footerLinks && panelItem.footerLinks.length > 0 && (
              <ul className="border-t border-white/10 pt-4">
                {panelItem.footerLinks.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <Link href={link.href} className={cn(subLinkClasses, 'font-bold')} onClick={onNavigate}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
