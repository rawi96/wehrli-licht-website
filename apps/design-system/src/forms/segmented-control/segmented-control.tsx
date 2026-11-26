import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { cn } from '../../fundamentals/cn';

const ICONS = { sun: SunIcon, moon: MoonIcon } as const;

export type Segment<T extends string | number> = {
  id: T;
  label: string;
  icon?: keyof typeof ICONS;
  /** Tooltip, e.g. a longer name. */
  title?: string;
};

type Props<T extends string | number> = {
  options: readonly Segment<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name of the group. */
  label: string;
  /** `small`: tight segments that share the width (e.g. four colour temperatures). */
  size?: 'default' | 'small';
};

/** One choice from a few options as a pill bar, e.g. on top of a 3D view. */
export const SegmentedControl = <T extends string | number>({
  options,
  value,
  onChange,
  label,
  size = 'default',
}: Props<T>) => (
  <div
    role="group"
    aria-label={label}
    className={cn(
      'flex max-w-full gap-1 overflow-x-auto rounded-full',
      size === 'default' && 'bg-white/85 p-1 shadow-md backdrop-blur-sm',
    )}
  >
    {options.map((option) => {
      const Icon = option.icon ? ICONS[option.icon] : null;
      const selected = option.id === value;

      return (
        <button
          key={option.id}
          type="button"
          title={option.title}
          aria-pressed={selected}
          onClick={() => onChange(option.id)}
          className={cn(
            'flex shrink-0 items-center justify-center gap-1.5 rounded-full font-bold whitespace-nowrap transition-colors',
            size === 'small' ? 'text-xxs flex-1 px-0.5 py-1 tabular-nums' : 'px-3 py-1.5 text-sm',
            selected ? 'bg-wehrli text-white' : 'text-wehrli hover:bg-white',
          )}
        >
          {Icon && <Icon className="size-4" aria-hidden="true" />}
          {option.label}
        </button>
      );
    })}
  </div>
);
