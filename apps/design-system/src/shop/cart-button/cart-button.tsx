import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { FC } from 'react';

type Props = {
  /** Number of items; a badge shows it when above 0 (99+ from 100). */
  quantity: number;
  onClick: () => void;
  labels?: {
    /** Accessible name when the cart is empty. */
    open: string;
    /** Accessible name with items, `{count}` is replaced: "Warenkorb, {count} Artikel". */
    withItems: string;
  };
};

const DEFAULT_LABELS = { open: 'Warenkorb öffnen', withItems: 'Warenkorb, {count} Artikel' };

/** The cart icon in the header (white, on the brand color) with the number of items. */
export const CartButton: FC<Props> = ({ quantity, onClick, labels = DEFAULT_LABELS }) => (
  <button
    type="button"
    className="relative inline-flex items-center text-sm font-bold text-white transition-colors hover:text-white/90"
    onClick={onClick}
    aria-label={quantity > 0 ? labels.withItems.replace('{count}', String(quantity)) : labels.open}
  >
    <span className="relative inline-flex shrink-0">
      <ShoppingBagIcon className="h-6 w-6" aria-hidden="true" />
      {quantity > 0 && (
        <span className="text-wehrli text-xxxs absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-0.5 leading-none font-bold tabular-nums">
          {quantity > 99 ? '99+' : quantity}
        </span>
      )}
    </span>
  </button>
);
