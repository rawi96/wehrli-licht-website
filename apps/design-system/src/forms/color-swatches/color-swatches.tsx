import { FC } from 'react';
import { cn } from '../../fundamentals/cn';

export type ColorSwatch = { id: string; label: string; hex: string };

type Props = {
  colors: readonly ColorSwatch[];
  /** Hex colour, e.g. `#214073`. */
  value: string;
  onChange: (hex: string) => void;
  /** Offers a free colour picker after the swatches. */
  custom?: boolean;
  labels?: { custom?: string };
};

/** Round colour swatches (big enough to tap easily) with the colour name as accessible label and tooltip. */
export const ColorSwatches: FC<Props> = ({ colors, value, onChange, custom = true, labels }) => {
  const isCustom = !colors.some(({ hex }) => hex === value);

  return (
    <div className="flex flex-wrap gap-3">
      {colors.map((color) => (
        <button
          key={color.id}
          type="button"
          title={color.label}
          aria-label={color.label}
          aria-pressed={color.hex === value}
          onClick={() => onChange(color.hex)}
          className={cn(
            'size-11 rounded-full border border-black/10 shadow-sm transition-transform hover:scale-110 motion-reduce:transition-none',
            color.hex === value && 'ring-wehrli ring-2 ring-offset-2',
          )}
          // The swatch is the colour itself, a value from the content.
          style={{ backgroundColor: color.hex }}
        />
      ))}
      {custom && (
        <label
          title={labels?.custom ?? 'Eigene Farbe'}
          className={cn(
            'relative size-11 cursor-pointer overflow-hidden rounded-full border border-black/10 shadow-sm',
            isCustom && 'ring-wehrli ring-2 ring-offset-2',
          )}
          style={{
            background: isCustom
              ? value
              : 'conic-gradient(#e44 0deg, #ec3 60deg, #4c5 120deg, #3bd 180deg, #46e 240deg, #c4c 300deg, #e44 360deg)',
          }}
        >
          <span className="sr-only">{labels?.custom ?? 'Eigene Farbe'}</span>
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
