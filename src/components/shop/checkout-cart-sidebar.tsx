'use client';

import { useShopContext } from '@/app/context/shop-context';
import { CheckoutCommerceHints } from '@/components/shop/checkout-commerce-hints';
import { checkoutInputClass } from '@/components/shop/checkout-styles';
import { CheckoutShippingMethod, CheckoutStep } from '@/types/checkout';
import { computeCheckoutTotals } from '@/utils/cart-checkout';
import { ProductCommerceMeta, formatShippingCostLabel } from '@/utils/product-commerce';
import { formatPriceToCHF } from '@/utils/price';
import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent, useMemo } from 'react';

type Props = {
  shipping: CheckoutShippingMethod;
  step: CheckoutStep;
  productCommerce: ProductCommerceMeta[];
};

export const CheckoutCartSidebar = ({ shipping, step, productCommerce }: Props) => {
  const { shoppingCart, updateItemQuantity, removeItem, isHydrated } = useShopContext();

  const verifiedItems = useMemo(
    () =>
      shoppingCart.items.map((item) => ({
        productId: item.productId,
        name: item.productName,
        quantity: item.quantity,
        unitPriceChf: item.price,
      })),
    [shoppingCart.items],
  );

  const totals = useMemo(
    () => computeCheckoutTotals(verifiedItems, shipping, productCommerce),
    [verifiedItems, shipping, productCommerce],
  );

  const showFullTotals = step !== 'shipping';
  const showShippingLine = shipping === 'post' || showFullTotals;

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>, lineId: string) => {
    updateItemQuantity(lineId, parseInt(event.target.value, 10));
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <aside className="lg:sticky lg:top-8">
      <p className="text-sm font-bold">Warenkorb</p>

      <ul role="list" className="mt-4 space-y-4">
        {shoppingCart.items.map((item) => (
          <li key={item.id} className="flex gap-3 text-sm">
            {item.imageUrl && (
              <Image
                src={item.imageUrl}
                alt={item.productName}
                className="h-14 w-14 flex-none object-cover"
                width={56}
                height={56}
              />
            )}
            <div className="min-w-0 flex-1">
              <Link href={`/shop/produkte/${item.productSlug}`} className="font-bold underline-offset-2 hover:underline">
                {item.productName}
              </Link>
              {item.selections && item.selections.length > 0 && (
                <p className="mt-0.5 text-gray-500">
                  {item.selections.map((selection) => `${selection.option}: ${selection.value}`).join(', ')}
                </p>
              )}
              <p className="mt-1">{formatPriceToCHF(item.price)}</p>
              <div className="mt-2 flex items-center gap-3">
                <label htmlFor={`checkout-qty-${item.id}`} className="sr-only">
                  Anzahl
                </label>
                <select
                  id={`checkout-qty-${item.id}`}
                  value={item.quantity}
                  className={`${checkoutInputClass} w-14 py-1`}
                  onChange={(event) => handleSelectChange(event, item.id)}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((qty) => (
                    <option key={qty} value={qty}>
                      {qty}
                    </option>
                  ))}
                </select>
                <button type="button" className="text-sm underline" onClick={() => removeItem(item.id)}>
                  Entfernen
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <dl className="mt-6 space-y-1 border-t border-gray-200 pt-4 text-sm">
        <div className="flex justify-between">
          <dt>Zwischentotal</dt>
          <dd>{formatPriceToCHF(totals.subTotalChf)}</dd>
        </div>
        {showShippingLine && (
          <div className="flex justify-between">
            <dt>Versand</dt>
            <dd>{formatShippingCostLabel(shipping, totals.shippingCostChf)}</dd>
          </div>
        )}
        {showFullTotals && (
          <div className="flex justify-between font-bold">
            <dt>Total</dt>
            <dd>{formatPriceToCHF(totals.grandTotalChf)}</dd>
          </div>
        )}
      </dl>

      <CheckoutCommerceHints lineItems={verifiedItems} productCommerce={productCommerce} />
    </aside>
  );
};
