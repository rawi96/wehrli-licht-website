import { cn } from '../../fundamentals/cn';

export type Silhouette<T extends string> = {
  id: T;
  label: string;
  /** SVG path in a 100 × 100 box. */
  path: string;
};

type Props<T extends string> = {
  options: readonly Silhouette<T>[];
  value: T;
  onChange: (value: T) => void;
};

/** A choice of shapes, each shown as a small silhouette with its name (e.g. lampshade forms). */
export const SilhouettePicker = <T extends string>({ options, value, onChange }: Props<T>) => (
  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
    {options.map((option) => {
      const selected = option.id === value;

      return (
        <button
          key={option.id}
          type="button"
          aria-pressed={selected}
          onClick={() => onChange(option.id)}
          className={cn(
            'flex flex-col items-center gap-1 rounded-md border p-2 text-center transition-colors',
            selected ? 'border-wehrli bg-wehrli-50' : 'hover:border-wehrli border-gray-200 bg-white',
          )}
        >
          <svg viewBox="0 0 100 100" className="size-12" aria-hidden="true">
            <path d={option.path} className={selected ? 'fill-wehrli' : 'fill-gray-400'} />
          </svg>
          <span className="text-xxs leading-tight font-bold text-black">{option.label}</span>
        </button>
      );
    })}
  </div>
);
