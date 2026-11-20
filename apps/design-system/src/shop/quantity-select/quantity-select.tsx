import { FC } from 'react';
import { Select } from '../../forms/field/field';

const QUANTITIES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

type Props = {
  id: string;
  name?: string;
  value: number;
  onChange: (quantity: number) => void;
  /** Accessible name (visually hidden), e.g. "Anzahl". */
  label: string;
  /** `bold`: compact bold select in the cart dialog. `field`: full-width form field, as in the checkout. */
  variant?: 'bold' | 'field';
};

/** Select for the quantity of a cart line, 1 to 10, with a visually hidden label. */
export const QuantitySelect: FC<Props> = ({ id, name, value, onChange, label, variant = 'bold' }) => (
  <>
    <label htmlFor={id} className="sr-only">
      {label}
    </label>
    {variant === 'field' ? (
      <Select
        id={id}
        name={name}
        value={String(value)}
        onChange={(quantity) => onChange(parseInt(quantity, 10))}
        options={QUANTITIES.map((quantity) => ({ value: String(quantity), label: String(quantity) }))}
      />
    ) : (
      <select
        id={id}
        name={name}
        value={value}
        className="focus:border-wehrli-500 focus:ring-wehrli-500 block max-w-full rounded-lg border border-gray-300 py-1.5 text-left text-base leading-5 font-bold shadow-sm focus:ring-1 focus:outline-none sm:text-sm"
        onChange={(event) => onChange(parseInt(event.target.value, 10))}
      >
        {QUANTITIES.map((quantity) => (
          <option key={quantity} value={quantity}>
            {quantity}
          </option>
        ))}
      </select>
    )}
  </>
);
