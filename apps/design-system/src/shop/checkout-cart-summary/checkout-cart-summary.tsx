import NextImage from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import { CartLine } from '../cart-content/cart-content';
import { QuantitySelect } from '../quantity-select/quantity-select';

type Props = {
  items: CartLine[];
  /** Formatted subtotal. */
  subtotal: string;
  /** Formatted shipping cost ("Gratis" for pickup); the line is hidden without it. */
  shippingCost?: string | null;
  /** Formatted total; hidden in the first step, where shipping is not chosen yet. */
  total?: string | null;
  deliveryTime?: string | null;
  onQuantityChange: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
  labels?: {
    heading: string;
    quantity: string;
    remove: string;
    subtotal: string;
    shippingCost: string;
    total: string;
    deliveryTime: string;
  };
};

const DEFAULT_LABELS = {
  heading: 'Warenkorb',
  quantity: 'Anzahl',
  remove: 'Entfernen',
  subtotal: 'Zwischentotal',
  shippingCost: 'Versand',
  total: 'Total',
  deliveryTime: 'Lieferzeit:',
};

/** The cart beside the checkout steps (sticky from lg): lines with quantity, totals and the delivery time. */
export const CheckoutCartSummary: FC<Props> = ({
  items,
  subtotal,
  shippingCost,
  total,
  deliveryTime,
  onQuantityChange,
  onRemove,
  labels = DEFAULT_LABELS,
}) => (
  <aside className="lg:sticky lg:top-8">
    <p className="text-sm font-bold">{labels.heading}</p>

    <ul role="list" className="mt-4 space-y-4">
      {items.map((item) => (
        <li key={item.id} className="flex gap-3 text-sm">
          {item.imageUrl && (
            <NextImage
              src={item.imageUrl}
              alt={item.name}
              // eslint-disable-next-line @smartive-eslint/forbid-component-props -- next/image only takes classes
              className="h-14 w-14 flex-none object-cover"
              width={56}
              height={56}
            />
          )}
          <div className="min-w-0 flex-1">
            <Link href={item.href} className="font-bold underline-offset-2 hover:underline">
              {item.name}
            </Link>
            {item.selectionsLabel && <p className="mt-0.5 text-gray-500">{item.selectionsLabel}</p>}
            <p className="mt-1">{item.price}</p>
            <div className="mt-2 flex items-center gap-3">
              <QuantitySelect
                id={`checkout-qty-${item.id}`}
                value={item.quantity}
                onChange={(quantity) => onQuantityChange(item.id, quantity)}
                label={labels.quantity}
                variant="field"
              />
              <button type="button" className="text-sm underline" onClick={() => onRemove(item.id)}>
                {labels.remove}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>

    <dl className="mt-6 space-y-1 border-t border-gray-200 pt-4 text-sm">
      <div className="flex justify-between">
        <dt>{labels.subtotal}</dt>
        <dd>{subtotal}</dd>
      </div>
      {typeof shippingCost === 'string' && (
        <div className="flex justify-between">
          <dt>{labels.shippingCost}</dt>
          <dd>{shippingCost}</dd>
        </div>
      )}
      {typeof total === 'string' && (
        <div className="flex justify-between font-bold">
          <dt>{labels.total}</dt>
          <dd>{total}</dd>
        </div>
      )}
    </dl>

    {deliveryTime && (
      <p className="mt-4 text-sm text-gray-500">
        {labels.deliveryTime} {deliveryTime}
      </p>
    )}
  </aside>
);
