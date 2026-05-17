'use client';

import { Button } from '@/components/button';
import { CheckoutCommerceHints } from '@/components/shop/checkout-commerce-hints';
import { checkoutRadioCardClass } from '@/components/shop/checkout-styles';
import { CheckoutShippingMethod } from '@/types/checkout';
import { ProductCommerceMeta, formatShippingCostLabel } from '@/utils/product-commerce';

type Props = {
  shipping: CheckoutShippingMethod;
  onShippingChange: (shipping: CheckoutShippingMethod) => void;
  postShippingCostChf: number;
  lineItems: { productId: string }[];
  productCommerce: ProductCommerceMeta[];
  onContinue: () => void;
};

export const CheckoutShippingStep = ({
  shipping,
  onShippingChange,
  postShippingCostChf,
  lineItems,
  productCommerce,
  onContinue,
}: Props) => {
  const postLabel = formatShippingCostLabel('post', postShippingCostChf);

  return (
    <div className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="sr-only">Versandart</legend>
        <label className={checkoutRadioCardClass}>
          <input
            type="radio"
            name="shipping"
            value="pickup"
            checked={shipping === 'pickup'}
            onChange={() => onShippingChange('pickup')}
            className="text-wehrli mt-1"
          />
          <span className="text-left">
            <span className="block font-bold">Abholung in Goldach</span>
            <span className="text-sm text-gray-600">Gratis während den Öffnungszeiten</span>
          </span>
        </label>
        <label className={checkoutRadioCardClass}>
          <input
            type="radio"
            name="shipping"
            value="post"
            checked={shipping === 'post'}
            onChange={() => onShippingChange('post')}
            className="text-wehrli mt-1"
          />
          <span className="text-left">
            <span className="block font-bold">Versand per Post</span>
            <span className="text-sm text-gray-600">In die Schweiz · {postLabel}</span>
          </span>
        </label>
      </fieldset>

      <CheckoutCommerceHints lineItems={lineItems} productCommerce={productCommerce} />

      <div className="flex justify-between gap-4">
        <Button type="secondary" text="Zurück" showArrow={false} href="/shop" />
        <Button type="primary" text="Weiter" onClick={onContinue} />
      </div>
    </div>
  );
};
