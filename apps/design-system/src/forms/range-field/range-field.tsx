import { FC, useId } from 'react';
import { cn } from '../../fundamentals/cn';

type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  /** Shown after the value, e.g. `cm`; without it the value is hidden (compact). */
  unit?: string;
  onChange: (value: number) => void;
  /** Label only for screen readers, e.g. next to an icon. */
  hideLabel?: boolean;
};

/** A slider with its label and current value. */
export const RangeField: FC<Props> = ({ label, value, min, max, step = 1, unit, onChange, hideLabel = false }) => {
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <div className={cn('flex items-baseline justify-between', hideLabel && 'sr-only')}>
        <label htmlFor={id} className="text-sm text-black">
          {label}
        </label>
        {unit && (
          <span className="text-wehrli text-sm font-bold tabular-nums">
            {value} {unit}
          </span>
        )}
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="accent-wehrli h-2 w-full cursor-pointer"
      />
    </div>
  );
};
