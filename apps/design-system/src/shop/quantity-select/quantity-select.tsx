import { FC } from 'react';
import { Select } from '../../forms/field/field';

type Props = {
  id: string;
  name?: string;
  value: number;
  onChange: (quantity: number) => void;
  /** Highest quantity offered (the shop's limit per cart line). */
  max: number;
  /** Accessible name (visually hidden), e.g. "Anzahl". */
  label: string;
  /** `bold`: compact bold select in the cart dialog. `field`: full-width form field, as in the checkout. */
  variant?: 'bold' | 'field';
};

/** Select for the quantity of a cart line, 1 to `max`, with a visually hidden label. */
export const QuantitySelect: FC<Props> = ({ id, name, value, onChange, max, label, variant = 'bold' }) => {
  const quantities = Array.from({ length: max }, (_, index) => index + 1);

  return (
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
          options={quantities.map((quantity) => ({ value: String(quantity), label: String(quantity) }))}
        />
      ) : (
        <select
          id={id}
          name={name}
          value={value}
          className="field-focus-plain focus:border-wehrli focus:ring-wehrli block max-w-full rounded-md border border-gray-200 py-1.5 text-left text-base leading-5 font-bold shadow-sm focus:ring-1 focus:outline-none sm:text-sm"
          onChange={(event) => onChange(parseInt(event.target.value, 10))}
        >
          {quantities.map((quantity) => (
            <option key={quantity} value={quantity}>
              {quantity}
            </option>
          ))}
        </select>
      )}
    </>
  );
};
