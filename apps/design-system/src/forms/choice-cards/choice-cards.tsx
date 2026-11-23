'use client';

import { Radio, RadioGroup } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { ReactNode } from 'react';
import { cn } from '../../fundamentals/cn';

export type ChoiceCard<T extends string> = {
  id: T;
  label: string;
  description?: string;
  /** A picture of the option, e.g. a pictogram or a colour dot. */
  visual?: ReactNode;
};

type Props<T extends string> = {
  options: readonly ChoiceCard<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
  /** Accessible name of the choice. */
  label: string;
  /** `tile`: picture above the name, two per row; `row`: picture beside name and description, one per row. */
  layout?: 'tile' | 'row';
};

/**
 * One choice from a few options as big cards that are easy to tap, with a picture and a short explanation. The
 * chosen card gets a check mark. Arrow keys move between the cards (Headless UI RadioGroup).
 */
export const ChoiceCards = <T extends string>({ options, value, onChange, label, layout = 'row' }: Props<T>) => (
  <RadioGroup
    value={value ?? null}
    onChange={(next: T | null) => next !== null && onChange(next)}
    aria-label={label}
    className={cn('grid gap-3', layout === 'tile' ? 'grid-cols-2' : 'grid-cols-1')}
  >
    {options.map((option) => (
      <Radio
        key={option.id}
        value={option.id}
        className={cn(
          'group hover:border-wehrli relative flex cursor-pointer rounded-md border-2 border-gray-200 bg-white transition-colors',
          'data-checked:border-wehrli data-checked:bg-wehrli-50 focus-visible:outline-offset-2',
          layout === 'tile' ? 'flex-col items-center gap-2 px-3 py-4 text-center' : 'items-center gap-4 p-4 text-left',
        )}
      >
        {option.visual ? (
          <span className="text-wehrli flex shrink-0 items-center justify-center">{option.visual}</span>
        ) : null}
        <span className="min-w-0 flex-1">
          <span className="block text-base font-bold text-black">{option.label}</span>
          {option.description ? <span className="mt-0.5 block text-sm text-gray-600">{option.description}</span> : null}
        </span>
        <CheckCircleIcon
          aria-hidden
          className={cn(
            'text-wehrli group-data-checked:animate-pop-in hidden size-7 shrink-0 group-data-checked:block',
            layout === 'tile' && 'absolute top-2 right-2 size-6',
          )}
        />
      </Radio>
    ))}
  </RadioGroup>
);
