'use client';

import { useShopContext } from '@/app/context/shop-context';
import { Button } from '@/components/button';
import { CheckoutErrorAlert } from '@/components/shop/checkout-error-alert';
import { CheckoutCartSidebar } from '@/components/shop/checkout-cart-sidebar';
import { CheckoutContactFields } from '@/components/shop/checkout-contact-fields';
import { CheckoutPaymentStep } from '@/components/shop/checkout-payment-step';
import { CheckoutReviewStep } from '@/components/shop/checkout-review-step';
import { CheckoutShippingAddressForm } from '@/components/shop/checkout-shipping-address-form';
import { CheckoutShippingStep } from '@/components/shop/checkout-shipping-step';
import { CheckoutStepIndicator } from '@/components/shop/checkout-step-indicator';
import { useCheckoutCommerce } from '@/components/shop/hooks/use-checkout-commerce';
import { useCheckoutDraft } from '@/components/shop/hooks/use-checkout-draft';
import { useCheckoutNavigation } from '@/components/shop/hooks/use-checkout-navigation';
import { useCheckoutQuote } from '@/components/shop/hooks/use-checkout-quote';
import { checkoutInlineErrorClass, checkoutLabelClass, checkoutTextareaClass } from '@/components/shop/checkout-styles';
import { CHECKOUT_STEP_HEADINGS } from '@/constants/checkout-labels';
import { CHECKOUT_API_ERROR_CODE } from '@/constants/checkout-errors';
import { CheckoutStep } from '@/types/checkout';
import { validateCheckoutCustomer } from '@/utils/checkout-customer';
import { validateShippingAddress } from '@/utils/checkout-shipping-address';
import { buildCheckoutItemsFromCart } from '@/utils/build-checkout-payload';
import { clearCheckoutDraft } from '@/utils/checkout-storage';
import { resolveCartShippingCostChf } from '@/utils/product-commerce';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';

type CheckoutApiResponse = {
  type?: string;
  url?: string;
  error?: string;
  code?: string;
};

export const CheckoutPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { shoppingCart, isHydrated } = useShopContext();
  const stepParam = searchParams.get('step');

  const draft = useCheckoutDraft();
  const step = useCheckoutNavigation(router, stepParam, shoppingCart, isHydrated, draft.draftLoaded);
  const productCommerce = useCheckoutCommerce(shoppingCart, isHydrated, draft.draftLoaded);
  const { verifiedQuote, isQuoteLoading, quoteError, setQuoteError } = useCheckoutQuote(
    shoppingCart,
    draft.shipping,
    step,
    isHydrated,
    draft.draftLoaded,
  );

  const [error, setError] = useState<string | null>(null);
  const [orderFailure, setOrderFailure] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cartLineItems = useMemo(
    () =>
      shoppingCart.items.map((item) => ({
        productId: item.productId,
        name: item.productName,
        quantity: item.quantity,
        unitPriceChf: item.price,
      })),
    [shoppingCart.items],
  );

  const reviewCartLines = useMemo(
    () =>
      verifiedQuote?.lines.map((line, index) => ({
        id: `${line.productId}-${index}`,
        name: line.name,
        quantity: line.quantity,
        unitPriceChf: line.unitPriceChf,
      })) ?? [],
    [verifiedQuote],
  );

  const reviewTotals = verifiedQuote?.totals ?? { subTotalChf: 0, shippingCostChf: 0, grandTotalChf: 0 };
  const displayError = error ?? quoteError;

  const postShippingCostChf = useMemo(
    () => resolveCartShippingCostChf('post', cartLineItems, productCommerce),
    [cartLineItems, productCommerce],
  );

  const goToStep = (nextStep: CheckoutStep): void => {
    setError(null);
    setQuoteError(null);
    setOrderFailure(false);
    router.push(`/shop/checkout?step=${nextStep}`);
  };

  const validateDetailsStep = (): boolean => {
    const customerError = validateCheckoutCustomer(draft.customer);

    if (customerError) {
      setError(customerError);

      return false;
    }

    if (draft.shipping === 'post') {
      const addressError = validateShippingAddress(draft.shippingAddress);

      if (addressError) {
        setError(addressError);

        return false;
      }
    }

    setError(null);

    return true;
  };

  const handleDetailsNext = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!event.currentTarget.reportValidity()) {
      return;
    }

    if (!validateDetailsStep()) {
      return;
    }

    goToStep('payment');
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateDetailsStep()) {
      goToStep('details');

      return;
    }

    const items = buildCheckoutItemsFromCart(shoppingCart);

    if (items.length === 0) {
      setError('Der Warenkorb ist leer.');
      router.replace('/shop');

      return;
    }

    setIsSubmitting(true);
    setError(null);
    setOrderFailure(false);

    try {
      const response = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customer: {
            firstName: draft.customer.firstName.trim(),
            lastName: draft.customer.lastName.trim(),
            email: draft.customer.email.trim(),
            phone: draft.customer.phone.trim(),
          },
          shipping: draft.shipping,
          paymentMethod: draft.paymentMethod,
          comment: draft.comment.trim() || undefined,
          shippingAddress:
            draft.shipping === 'post'
              ? {
                  street: draft.shippingAddress.street.trim(),
                  postalCode: draft.shippingAddress.postalCode.trim(),
                  city: draft.shippingAddress.city.trim(),
                  country: 'CH',
                }
              : undefined,
        }),
      });

      const data = (await response.json()) as CheckoutApiResponse;

      if (!response.ok || data.type !== 'redirect' || !data.url) {
        if (data.code === CHECKOUT_API_ERROR_CODE.emailFailed) {
          setOrderFailure(true);
        } else {
          setError(data.error ?? 'Fehler beim Abschliessen. Bitte prüfen Sie Ihre Angaben.');
        }

        return;
      }

      clearCheckoutDraft();
      window.location.href = data.url;
    } catch {
      setError('Fehler beim Abschliessen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isHydrated || !draft.draftLoaded) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Kasse</h1>
        <p className="mt-4 text-sm text-gray-500">Laden…</p>
      </div>
    );
  }

  if (shoppingCart.items.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
        <aside className="order-1 lg:order-2 lg:col-span-2">
          <CheckoutCartSidebar shipping={draft.shipping} step={step} productCommerce={productCommerce} />
        </aside>

        <div className="order-2 lg:order-1 lg:col-span-3">
          <h1 className="mb-6 text-2xl font-bold">{CHECKOUT_STEP_HEADINGS[step]}</h1>

          {orderFailure && (
            <div className="mb-6">
              <CheckoutErrorAlert variant="order_not_completed" />
            </div>
          )}

          <CheckoutStepIndicator currentStep={step} />

          {step === 'shipping' && (
            <CheckoutShippingStep
              shipping={draft.shipping}
              onShippingChange={draft.setShipping}
              postShippingCostChf={postShippingCostChf}
              lineItems={cartLineItems}
              productCommerce={productCommerce}
              onContinue={() => goToStep('details')}
            />
          )}

          {step === 'details' && (
            <form onSubmit={handleDetailsNext} className="space-y-6">
              <CheckoutContactFields customer={draft.customer} onCustomerChange={draft.setCustomer} />

              {draft.shipping === 'post' && (
                <CheckoutShippingAddressForm address={draft.shippingAddress} onChange={draft.setShippingAddress} />
              )}

              <div>
                <label htmlFor="checkout-comment" className={checkoutLabelClass}>
                  Kommentar
                </label>
                <textarea
                  id="checkout-comment"
                  name="comment"
                  rows={2}
                  className={checkoutTextareaClass}
                  value={draft.comment}
                  onChange={(event) => draft.setComment(event.target.value)}
                />
              </div>

              {displayError && <p className={checkoutInlineErrorClass}>{displayError}</p>}
              <div className="flex justify-between gap-4">
                <Button type="secondary" text="Zurück" showArrow={false} onClick={() => goToStep('shipping')} />
                <Button type="primary" text="Weiter" submit />
              </div>
            </form>
          )}

          {step === 'payment' && (
            <CheckoutPaymentStep
              paymentMethod={draft.paymentMethod}
              error={displayError}
              onPaymentMethodChange={draft.setPaymentMethod}
              onBack={() => goToStep('details')}
              onContinue={() => goToStep('review')}
            />
          )}

          {step === 'review' && (
            <CheckoutReviewStep
              customer={draft.customer}
              shipping={draft.shipping}
              shippingAddress={draft.shippingAddress}
              paymentMethod={draft.paymentMethod}
              comment={draft.comment}
              cartLines={reviewCartLines}
              subTotalChf={reviewTotals.subTotalChf}
              shippingCostChf={reviewTotals.shippingCostChf}
              grandTotalChf={reviewTotals.grandTotalChf}
              deliveryTimeSummary={verifiedQuote?.deliveryTimeSummary}
              error={orderFailure ? null : displayError}
              isQuoteLoading={isQuoteLoading}
              isSubmitting={isSubmitting}
              onBack={() => goToStep('payment')}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};
