import Link from 'next/link';
import { FC } from 'react';

export type FilterChipOption = {
  id: string;
  label: string;
  /** Page of the filtered list, e.g. /projekte/zuhause. */
  href: string;
  /** E.g. the number of results. */
  count?: number;
};

type Props = {
  options: FilterChipOption[];
  /** Id of the current option, null for «all». */
  value: string | null;
  /** Option that clears the filter: its label and the page of the unfiltered list. */
  all: { label: string; href: string };
  /** Screen reader name of the navigation. */
  label?: string;
};

const chipClasses = {
  idle: 'hover:border-wehrli hover:bg-wehrli-50 text-wehrli bg-white inline-flex whitespace-nowrap items-center gap-x-2 rounded-md border border-gray-200 px-4 py-2 text-sm font-bold transition-colors',
  active:
    'bg-wehrli border-wehrli inline-flex whitespace-nowrap items-center gap-x-2 rounded-md border px-4 py-2 text-sm font-bold text-white transition-colors',
};

const toState = (active: boolean): 'active' | 'idle' => (active ? 'active' : 'idle');

/**
 * A row of chips that link to filtered pages of a list (each filter has its own URL), the current one highlighted.
 */
export const FilterChips: FC<Props> = ({ options, value, all, label = 'Filter' }) => (
  <nav aria-label={label}>
    {/* One scrollable row on small screens, wrapped from sm on. */}
    <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
      {[{ id: null, ...all }, ...options].map((option) => {
        const active = option.id === value;

        return (
          <li key={option.id ?? 'all'} className="shrink-0">
            <Link
              href={option.href}
              scroll={false}
              aria-current={active ? 'page' : undefined}
              className={chipClasses[toState(active)]}
            >
              {option.label}
              {'count' in option && typeof option.count === 'number' && (
                <span className="text-xs font-normal opacity-80">{option.count}</span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  </nav>
);
