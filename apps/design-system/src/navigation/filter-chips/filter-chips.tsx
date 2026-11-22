'use client';

import { FC } from 'react';

export type FilterChipOption = {
  id: string;
  label: string;
  /** E.g. the number of results. */
  count?: number;
};

type Props = {
  options: FilterChipOption[];
  /** Id of the selected option, null for «all». */
  value: string | null;
  onChange: (value: string | null) => void;
  /** Label of the option that clears the filter. */
  allLabel?: string;
  /** Screen reader name of the group. */
  label?: string;
};

const chipClasses = {
  idle: 'hover:border-wehrli text-wehrli bg-white-100 inline-flex items-center gap-x-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-bold transition-colors duration-150',
  active:
    'bg-wehrli border-wehrli inline-flex items-center gap-x-2 rounded-full border px-4 py-2 text-sm font-bold text-white transition-colors duration-150',
};

const toState = (active: boolean): 'active' | 'idle' => (active ? 'active' : 'idle');

/** A row of chips that filters a list to one option or shows all. */
export const FilterChips: FC<Props> = ({ options, value, onChange, allLabel = 'Alle', label = 'Filter' }) => (
  <div role="group" aria-label={label} className="flex flex-wrap gap-2">
    {[{ id: null, label: allLabel }, ...options].map((option) => {
      const active = option.id === value;

      return (
        <button
          key={option.id ?? 'all'}
          type="button"
          aria-pressed={active}
          className={chipClasses[toState(active)]}
          onClick={() => onChange(option.id)}
        >
          {option.label}
          {'count' in option && typeof option.count === 'number' && (
            <span className="text-xs font-normal opacity-70">{option.count}</span>
          )}
        </button>
      );
    })}
  </div>
);
