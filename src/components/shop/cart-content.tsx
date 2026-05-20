'use client';

import { useShopContext } from '@/app/context/shop-context';
import { Button } from '@/components/button';
import { formatPriceToCHF } from '@/utils/price';
import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent } from 'react';

type Props = {
  onGoToCheckout?: () => void;
  onShopLinkClick?: () => void;
};

export const CartContent = ({ onGoToCheckout, onShopLinkClick }: Props) => {
  const { shoppingCart, updateItemQuantity, removeItem, isHydrated } = useShopContext();

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>, lineId: string) => {
    updateItemQuantity(lineId, parseInt(event.target.value, 10));
  };

  if (!isHydrated) {
    return <p className="py-4 text-sm text-gray-600">Warenkorb wird geladen…</p>;
  }

  return (
    <>
      <section aria-labelledby="cart-heading">
        <h2 id="cart-heading" className="sr-only">
          Produkte im Warenkorb
        </h2>

        <ul role="list" className="divide-y divide-gray-200 px-4 sm:px-6 lg:px-8">
          {shoppingCart.items.length === 0 && (
            <li className="py-4">
              <p className="text-sm text-gray-600">Sie haben keine Produkte im Warenkorb.</p>
              <div className="mt-4">
                <Button text="Zum Shop" type="primary" href="/shop" showArrow={false} onClick={onShopLinkClick} />
              </div>
            </li>
          )}
          {shoppingCart.items.map((item, productIdx) => (
            <li key={item.id} className="flex py-8 text-sm sm:items-center">
              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.productName}
                  className="h-24 w-24 flex-none rounded border border-gray-200 sm:h-32 sm:w-32"
                  width={1000}
                  height={1000}
                />
              )}

              <div className="ml-4 grid flex-auto grid-cols-1 grid-rows-1 items-start gap-x-5 gap-y-3 sm:ml-6 sm:flex sm:items-center sm:gap-0">
                <div className="row-end-1 flex-auto sm:pr-6">
                  <h3 className="font-bold">
                    <Link href={`/shop/produkte/${item.productSlug}`}>{item.productName}</Link>
                    {item.selections && item.selections.length > 0 && (
                      <p className="pt-3 font-normal">
                        {item.selections.map((selection) => `${selection.option}: ${selection.value}`).join(', ')}
                      </p>
                    )}
                  </h3>
                </div>
                <p className="row-span-2 row-end-2 font-bold sm:order-1 sm:ml-6 sm:w-1/3 sm:flex-none sm:text-right">
                  {formatPriceToCHF(item.price)}
                </p>
                <div className="flex items-center sm:block sm:flex-none sm:text-center">
                  <label htmlFor={`cart-quantity-${productIdx}`} className="sr-only">
                    Anzahl, {item.quantity}
                  </label>
                  <select
                    id={`cart-quantity-${productIdx}`}
                    name={`cart-quantity-${productIdx}`}
                    value={item.quantity}
                    className="focus:border-wehrli-500 focus:ring-wehrli-500 block max-w-full rounded border border-gray-300 py-1.5 text-left text-base leading-5 font-bold shadow-sm focus:ring-1 focus:outline-none sm:text-sm"
                    onChange={(event) => handleSelectChange(event, item.id)}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((qty) => (
                      <option key={qty} value={qty}>
                        {qty}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="text-wehrli hover:text-wehrli-600 ml-4 font-bold sm:mt-2 sm:ml-0"
                    onClick={() => removeItem(item.id)}
                  >
                    Entfernen
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {shoppingCart.items.length > 0 && (
        <section aria-labelledby="cart-summary-heading" className="mt-auto sm:px-6 lg:px-8">
          <div className="bg-gray-50 p-6 sm:mx-4 sm:rounded sm:p-8 lg:mx-8">
            <h2 id="cart-summary-heading" className="sr-only">
              Bestellübersicht
            </h2>
            <dl className="-my-4 divide-y divide-gray-200 text-sm">
              <div className="flex items-center justify-between py-4">
                <dt>Zwischentotal</dt>
                <dd>{formatPriceToCHF(shoppingCart.sub_total)}</dd>
              </div>
              <div className="flex items-center justify-between py-4 font-bold">
                <dt>Total</dt>
                <dd>{formatPriceToCHF(shoppingCart.sub_total)}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 flex justify-end px-4 sm:px-6 lg:px-8">
            <Button type="primary" text="Zur Kasse" onClick={onGoToCheckout} />
          </div>
        </section>
      )}
    </>
  );
};
