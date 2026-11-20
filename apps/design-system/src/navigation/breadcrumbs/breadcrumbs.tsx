import { ChevronRightIcon } from '@heroicons/react/20/solid';
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

/** Path to the current page, above the page title. */
export const Breadcrumbs: FC<Props> = ({ items, spacing = 'overlap', label = 'Breadcrumb' }) => {
  if (!items.length) {
    return null;
  }

  return (
    <nav aria-label={label} className={cn('flex font-bold', SPACING[spacing])}>
      <ol role="list" className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index !== 0 && <ChevronRightIcon aria-hidden="true" className="text-wehrli h-4 w-4 shrink-0" />}
            {index === items.length - 1 ? (
              <span aria-current="page" className="border-wehrli text-wehrli ml-2 border-b-2 text-sm font-bold">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="text-wehrli hover:border-wehrli ml-2 border-b-2 border-transparent text-sm">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
