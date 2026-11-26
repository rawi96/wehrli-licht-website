import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { FC } from 'react';
import { cn } from '../../fundamentals/cn';
import type { NavigationLink } from '../flyout/flyout';

type Props = {
  /** From the start page to the current page; the last item is the current page. */
  items: NavigationLink[];
  /**
   * Space to the content below. `overlap` (content pages): the next section's top margin starts at the breadcrumbs.
   * `tight`: 16px, above a catalog. `loose`: 64px, above the product detail.
   */
  spacing?: keyof typeof SPACING;
  /** Accessible name of the navigation. */
  label?: string;
};

const SPACING = { overlap: '-mb-16', tight: 'mb-4', loose: 'mb-16' } as const;

const linkClass =
  'text-wehrli hover:border-wehrli border-b-2 border-transparent text-sm in-[.surface-dark]:text-white/80 in-[.surface-dark]:hover:border-white in-[.surface-dark]:hover:text-white';
const chevronClass = 'text-wehrli h-4 w-4 shrink-0 in-[.surface-dark]:text-white/60';

/**
 * Path to the current page, above the page title. On phones a single «‹ parent» link (the page itself is the title
 * right below), from sm the whole trail on one line where it fits. White inside a dark surface (`surface-dark`).
 */
export const Breadcrumbs: FC<Props> = ({ items, spacing = 'overlap', label = 'Breadcrumb' }) => {
  if (!items.length) {
    return null;
  }

  const parent = items.length > 1 ? items[items.length - 2] : null;

  return (
    <nav aria-label={label} className={cn('font-bold', SPACING[spacing])}>
      {parent && (
        <Link href={parent.href} className={cn(linkClass, 'inline-flex items-center gap-1 sm:hidden')}>
          <ChevronLeftIcon aria-hidden="true" className={cn(chevronClass, '-ml-1')} />
          {parent.label}
        </Link>
      )}
      <ol role="list" className={cn('flex-wrap items-center gap-x-2 gap-y-2', parent ? 'hidden sm:flex' : 'flex')}>
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            {index !== 0 && <ChevronRightIcon aria-hidden="true" className={chevronClass} />}
            {index === items.length - 1 ? (
              <span
                aria-current="page"
                className="border-wehrli text-wehrli border-b-2 text-sm font-bold in-[.surface-dark]:border-white in-[.surface-dark]:text-white"
              >
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className={linkClass}>
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
