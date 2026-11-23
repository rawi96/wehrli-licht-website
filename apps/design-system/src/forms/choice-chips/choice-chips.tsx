import { cn } from '../../fundamentals/cn';

export type ChoiceChip<T extends string> = { id: T; label: string };

type Props<T extends string> = {
  options: readonly ChoiceChip<T>[];
  /** The chosen option; without it the chips are plain buttons (e.g. presets). */
  value?: T;
  onChange: (value: T) => void;
  /** One scrolling row instead of wrapping lines. */
  scroll?: boolean;
  /** Accessible name of the group. */
  label?: string;
};

/** A choice from a few options as round chips; the chosen one is filled. */
export const ChoiceChips = <T extends string>({ options, value, onChange, scroll = false, label }: Props<T>) => (
  <div
    role="group"
    aria-label={label}
    className={cn('flex gap-2', scroll ? '-mx-5 overflow-x-auto px-5 pb-1' : 'flex-wrap')}
  >
    {options.map((option) => (
      <button
        key={option.id}
        type="button"
        aria-pressed={value === undefined ? undefined : option.id === value}
        onClick={() => onChange(option.id)}
        className={cn(
          'shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-bold transition-colors',
          option.id === value
            ? 'border-wehrli bg-wehrli text-white'
            : 'hover:border-wehrli border-gray-200 bg-white text-black',
        )}
      >
        {option.label}
      </button>
    ))}
  </div>
);
