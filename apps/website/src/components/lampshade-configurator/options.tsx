'use client';

import { cn } from '@wehrli/design-system';
import { FC, ReactNode, useId } from 'react';

/** Small titled group of controls in the panel. */
export const OptionGroup: FC<{ title: string; hint?: ReactNode; children: ReactNode }> = ({ title, hint, children }) => (
  <fieldset className="flex flex-col gap-3">
    <legend className="mb-3 text-sm font-bold text-black">{title}</legend>
    {children}
    {hint ? <p className="text-sm text-gray-600">{hint}</p> : null}
  </fieldset>
);

/** Chips for a choice from a few options. */
export const ChoiceChips = <T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) => (
  <div className="flex flex-wrap gap-2">
    {options.map((option) => (
      <button
        key={option.id}
        type="button"
        aria-pressed={option.id === value}
        onClick={() => onChange(option.id)}
        className={cn(
          'rounded-full border px-3.5 py-1.5 text-sm font-bold transition-colors',
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

/** Round colour swatches, with the name as accessible label and tooltip. */
export const Swatches: FC<{
  colors: readonly { id: string; label: string; hex: string }[];
  value: string;
  onChange: (hex: string) => void;
  custom?: boolean;
}> = ({ colors, value, onChange, custom = true }) => {
  const isCustom = !colors.some(({ hex }) => hex === value);

  return (
    <div className="flex flex-wrap gap-2.5">
      {colors.map((color) => (
        <button
          key={color.id}
          type="button"
          title={color.label}
          aria-label={color.label}
          aria-pressed={color.hex === value}
          onClick={() => onChange(color.hex)}
          className={cn(
            'size-9 rounded-full border border-black/10 shadow-sm transition-transform hover:scale-110 motion-reduce:transition-none',
            color.hex === value && 'ring-wehrli ring-2 ring-offset-2',
          )}
          style={{ backgroundColor: color.hex }}
        />
      ))}
      {custom && (
        <label
          title="Eigene Farbe"
          className={cn(
            'relative size-9 cursor-pointer overflow-hidden rounded-full border border-black/10 shadow-sm',
            isCustom && 'ring-wehrli ring-2 ring-offset-2',
          )}
          style={{
            background: isCustom
              ? value
              : 'conic-gradient(#e44 0deg, #ec3 60deg, #4c5 120deg, #3bd 180deg, #46e 240deg, #c4c 300deg, #e44 360deg)',
          }}
        >
          <span className="sr-only">Eigene Farbe wählen</span>
          <input
            type="color"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="absolute inset-0 size-full cursor-pointer opacity-0"
          />
        </label>
      )}
    </div>
  );
};

/** Slider with label and value in cm (or %). */
export const SizeSlider: FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  onChange: (value: number) => void;
  disabled?: boolean;
}> = ({ label, value, min, max, unit = 'cm', onChange, disabled }) => {
  const id = useId();

  return (
    <div className={cn('flex flex-col gap-1.5', disabled && 'opacity-40')}>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm text-black">
          {label}
        </label>
        <span className="text-wehrli text-sm font-bold tabular-nums">
          {value} {unit}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="accent-wehrli h-2 w-full cursor-pointer"
      />
    </div>
  );
};
