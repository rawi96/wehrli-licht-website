import NextImage from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import { Button } from '../../actions/button/button';
import { QuantitySelect } from '../quantity-select/quantity-select';

export type CartLine = {
  id: string;
  name: string;
  /** Product page. */
  href: string;
  /** Plain image URL of the product. */
  imageUrl?: string | null;
  /** The chosen variant, e.g. "Farbe: Weiss, Grösse: M". */
  selectionsLabel?: string | null;
  /** Formatted unit price. */
  price: string;
  quantity: number;
};

type Props = {
  /** The cart is still read from the browser's storage. */
  loading?: boolean;
  items: CartLine[];
  /** Formatted subtotal and total. */
  subtotal: string;
  total: string;
  onQuantityChange: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
  onGoToCheckout?: () => void;
  /** Link of the empty cart. */
  shopHref: string;
  onShopLinkClick?: () => void;
  labels?: {
    loading: string;
    heading: string;
    empty: string;
    toShop: string;
    /** Accessible name of the quantity select, `{quantity}` is replaced. */
    quantity: string;
    remove: string;
    summaryHeading: string;
    subtotal: string;
    total: string;
    checkout: string;
  };
};

const DEFAULT_LABELS = {
  loading: 'Warenkorb wird geladen…',
  heading: 'Produkte im Warenkorb',
  empty: 'Sie haben keine Produkte im Warenkorb.',
  toShop: 'Zum Shop',
  quantity: 'Anzahl, {quantity}',
  remove: 'Entfernen',
  summaryHeading: 'Bestellübersicht',
  subtotal: 'Zwischentotal',
  total: 'Total',
  checkout: 'Zur Kasse',
};

/** The cart's lines, totals and the checkout button, inside the CartDialog. */
export const CartContent: FC<Props> = ({
  loading,
  items,
  subtotal,
  total,
  onQuantityChange,
  onRemove,
  onGoToCheckout,
  shopHref,
  onShopLinkClick,
  labels = DEFAULT_LABELS,
}) => {
  if (loading) {
    return <p className="py-4 text-sm text-gray-600">{labels.loading}</p>;
  }

  return (
    <>
      <section aria-labelledby="cart-heading">
        <h2 id="cart-heading" className="sr-only">
          {labels.heading}
        </h2>

        <ul role="list" className="divide-y divide-gray-200 px-4 sm:px-6 lg:px-8">
          {items.length === 0 && (
            <li className="py-4">
              <p className="text-sm text-gray-600">{labels.empty}</p>
              <div className="mt-4">
                <Button variant="primary" href={shopHref} showArrow={false} onClick={onShopLinkClick}>
                  {labels.toShop}
                </Button>
              </div>
            </li>
          )}
          {items.map((item, index) => (
            <li key={item.id} className="flex py-8 text-sm sm:items-center">
              {item.imageUrl && (
                <NextImage
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-24 w-24 flex-none rounded-lg border border-gray-200 sm:h-32 sm:w-32"
                  width={1000}
                  height={1000}
                />
              )}

              <div className="ml-4 grid flex-auto grid-cols-1 grid-rows-1 items-start gap-x-5 gap-y-3 sm:ml-6 sm:flex sm:items-center sm:gap-0">
                <div className="row-end-1 flex-auto sm:pr-6">
                  <h3 className="font-bold">
                    <Link href={item.href}>{item.name}</Link>
                    {item.selectionsLabel && <p className="pt-3 font-normal">{item.selectionsLabel}</p>}
                  </h3>
                </div>
                <p className="row-span-2 row-end-2 font-bold sm:order-1 sm:ml-6 sm:w-1/3 sm:flex-none sm:text-right">
                  {item.price}
                </p>
                <div className="flex items-center sm:block sm:flex-none sm:text-center">
                  <QuantitySelect
                    id={`cart-quantity-${index}`}
                    name={`cart-quantity-${index}`}
                    value={item.quantity}
                    onChange={(quantity) => onQuantityChange(item.id, quantity)}
                    label={labels.quantity.replace('{quantity}', String(item.quantity))}
                  />

                  <button
                    type="button"
                    className="text-wehrli hover:text-wehrli-600 ml-4 font-bold sm:mt-2 sm:ml-0"
                    onClick={() => onRemove(item.id)}
                  >
                    {labels.remove}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {items.length > 0 && (
        <section aria-labelledby="cart-summary-heading" className="mt-auto sm:px-6 lg:px-8">
          <div className="bg-gray-50 p-6 sm:mx-4 sm:rounded-lg sm:p-8 lg:mx-8">
            <h2 id="cart-summary-heading" className="sr-only">
              {labels.summaryHeading}
            </h2>
            <dl className="-my-4 divide-y divide-gray-200 text-sm">
              <div className="flex items-center justify-between py-4">
                <dt>{labels.subtotal}</dt>
                <dd>{subtotal}</dd>
              </div>
              <div className="flex items-center justify-between py-4 font-bold">
                <dt>{labels.total}</dt>
                <dd>{total}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 flex justify-end px-4 sm:px-6 lg:px-8">
            <Button variant="primary" onClick={onGoToCheckout}>
              {labels.checkout}
            </Button>
          </div>
        </section>
      )}
    </>
  );
};
