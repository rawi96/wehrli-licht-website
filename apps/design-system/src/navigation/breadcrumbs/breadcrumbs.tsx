import { ChevronRightIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { FC } from 'react';
import type { NavigationLink } from '../flyout/flyout';

type Props = {
  /** From the start page to the current page; the last item is the current page. */
  items: NavigationLink[];
};

/** Path to the current page, above the page title. */
export const Breadcrumbs: FC<Props> = ({ items }) => {
  if (!items.length) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="-mb-16 flex font-bold">
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
