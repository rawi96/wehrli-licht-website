'use client';

import { useShopContext } from '@/app/context/shop-context';
import { Button } from '@/components/button';
import { CheckoutErrorAlert } from '@/components/shop/checkout-error-alert';
import { CheckoutCartSidebar } from '@/components/shop/checkout-cart-sidebar';
import { CheckoutContactFields } from '@/components/shop/checkout-contact-fields';
import { CheckoutReviewStep } from '@/components/shop/checkout-review-step';
import { CheckoutShippingAddressForm } from '@/components/shop/checkout-shipping-address-form';
import { CheckoutShippingStep } from '@/components/shop/checkout-shipping-step';
import { CheckoutStepIndicator } from '@/components/shop/checkout-step-indicator';
import {
  checkoutInlineErrorClass,
  checkoutLabelClass,
  checkoutRadioCardClass,
  checkoutTextareaClass,
} from '@/components/shop/checkout-styles';
import { CHECKOUT_PAYMENT_LABELS, CHECKOUT_STEP_HEADINGS } from '@/constants/checkout-labels';
import { CHECKOUT_API_ERROR_CODE } from '@/constants/checkout-errors';
import { CheckoutPaymentMethod, CheckoutShippingAddress, CheckoutShippingMethod, CheckoutStep } from '@/types/checkout';
import { validateCheckoutCustomer } from '@/utils/checkout-customer';
import { emptyShippingAddress, validateShippingAddress } from '@/utils/checkout-shipping-address';
import { buildCheckoutItemsFromCart, cartCheckoutFingerprint } from '@/utils/build-checkout-payload';
import { clearCheckoutDraft, defaultCheckoutDraft, loadCheckoutDraft, saveCheckoutDraft } from '@/utils/checkout-storage';
import { ProductCommerceMeta, resolveCartShippingCostChf } from '@/utils/product-commerce';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';

type VerifiedCheckoutQuote = {
  lines: {
    productId: string;
    name: string;
    quantity: number;
    unitPriceChf: number;
  }[];
  totals: {
    subTotalChf: number;
    shippingCostChf: number;
    grandTotalChf: number;
  };
  deliveryTimeSummary?: string;
};

const isCheckoutStep = (value: string | null): value is CheckoutStep =>
  value === 'shipping' || value === 'details' || value === 'payment' || value === 'review';

export const CheckoutPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { shoppingCart, isHydrated } = useShopContext();

  const stepParam = searchParams.get('step');
  const step: CheckoutStep = isCheckoutStep(stepParam) ? stepParam : 'shipping';

  const [customer, setCustomer] = useState(defaultCheckoutDraft().customer);
  const [shipping, setShipping] = useState<CheckoutShippingMethod>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod>('prepayment');
  const [comment, setComment] = useState('');
  const [shippingAddress, setShippingAddress] = useState<CheckoutShippingAddress>(emptyShippingAddress());
  const [productCommerce, setProductCommerce] = useState<ProductCommerceMeta[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [orderFailure, setOrderFailure] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [verifiedQuote, setVerifiedQuote] = useState<VerifiedCheckoutQuote | null>(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const quoteRequestId = useRef(0);

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

  const cartFingerprint = useMemo(() => cartCheckoutFingerprint(shoppingCart), [shoppingCart]);

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

  const postShippingCostChf = useMemo(
    () => resolveCartShippingCostChf('post', cartLineItems, productCommerce),
    [cartLineItems, productCommerce],
  );

  useEffect(() => {
    const draft = loadCheckoutDraft();

    if (draft) {
      setCustomer(draft.customer);
      setShipping(draft.shipping);
      setPaymentMethod(draft.paymentMethod);
      setComment(draft.comment);
      setShippingAddress(draft.shippingAddress);
    }

    setDraftLoaded(true);
  }, []);

  useEffect(() => {
    if (!draftLoaded) {
      return;
    }

    saveCheckoutDraft({ customer, shipping, paymentMethod, comment, shippingAddress });
  }, [customer, shipping, paymentMethod, comment, shippingAddress, draftLoaded]);

  useEffect(() => {
    if (!isHydrated || !draftLoaded || shoppingCart.items.length === 0) {
      return;
    }

    const productIds = [...new Set(shoppingCart.items.map((item) => item.productId))];

    fetch('/api/shop/checkout/commerce', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productIds }),
    })
      .then((response) => response.json())
      .then((data: { commerce?: ProductCommerceMeta[] }) => {
        if (data.commerce) {
          setProductCommerce(data.commerce);
        }
      })
      .catch(() => {
        // Commerce metadata is optional; checkout still works without it.
      });
  }, [isHydrated, draftLoaded, cartFingerprint, shoppingCart.items]);

  useEffect(() => {
    if (step !== 'review') {
      setVerifiedQuote(null);
      setIsQuoteLoading(false);
    }
  }, [step]);

  useEffect(() => {
    if (!isHydrated || !draftLoaded || step !== 'review' || shoppingCart.items.length === 0) {
      return;
    }

    const requestId = ++quoteRequestId.current;
    setIsQuoteLoading(true);

    fetch('/api/shop/checkout/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: buildCheckoutItemsFromCart(shoppingCart),
        shipping,
      }),
    })
      .then(async (response) => {
        const data = (await response.json()) as VerifiedCheckoutQuote & { error?: string };

        if (quoteRequestId.current !== requestId) {
          return;
        }

        if (!response.ok) {
          setVerifiedQuote(null);
          setError(data.error ?? 'Warenkorb konnte nicht geprüft werden.');

          return;
        }

        setVerifiedQuote({
          lines: data.lines,
          totals: data.totals,
          deliveryTimeSummary: data.deliveryTimeSummary,
        });
        setError(null);
      })
      .catch(() => {
        if (quoteRequestId.current !== requestId) {
          return;
        }

        setVerifiedQuote(null);
        setError('Warenkorb konnte nicht geprüft werden.');
      })
      .finally(() => {
        if (quoteRequestId.current === requestId) {
          setIsQuoteLoading(false);
        }
      });
  }, [isHydrated, draftLoaded, step, cartFingerprint, shipping, shoppingCart]);

  useEffect(() => {
    if (!isHydrated || !draftLoaded) {
      return;
    }

    if (shoppingCart.items.length === 0) {
      router.replace('/shop');
    }
  }, [isHydrated, draftLoaded, shoppingCart.items.length, router]);

  useEffect(() => {
    if (stepParam === 'contact') {
      router.replace('/shop/checkout?step=shipping');

      return;
    }

    if (!isCheckoutStep(stepParam)) {
      router.replace('/shop/checkout?step=shipping');
    }
  }, [stepParam, router]);

  const goToStep = (nextStep: CheckoutStep) => {
    setError(null);
    setOrderFailure(false);
    router.push(`/shop/checkout?step=${nextStep}`);
  };

  const validateDetailsStep = (): boolean => {
    const customerError = validateCheckoutCustomer(customer);

    if (customerError) {
      setError(customerError);

      return false;
    }

    if (shipping === 'post') {
      const addressError = validateShippingAddress(shippingAddress);

      if (addressError) {
        setError(addressError);

        return false;
      }
    }

    setError(null);

    return true;
  };

  const handleDetailsNext = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!event.currentTarget.reportValidity()) {
      return;
    }

    if (!validateDetailsStep()) {
      return;
    }

    goToStep('payment');
  };

  const handleSubmit = async () => {
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
            firstName: customer.firstName.trim(),
            lastName: customer.lastName.trim(),
            email: customer.email.trim(),
            phone: customer.phone.trim(),
          },
          shipping,
          paymentMethod,
          comment: comment.trim() || undefined,
          shippingAddress:
            shipping === 'post'
              ? {
                  street: shippingAddress.street.trim(),
                  postalCode: shippingAddress.postalCode.trim(),
                  city: shippingAddress.city.trim(),
                  country: 'CH',
                }
              : undefined,
        }),
      });

      const data = (await response.json()) as { type?: string; url?: string; error?: string; code?: string };

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

  if (!isHydrated || !draftLoaded) {
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
          <CheckoutCartSidebar shipping={shipping} step={step} productCommerce={productCommerce} />
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
              shipping={shipping}
              onShippingChange={setShipping}
              postShippingCostChf={postShippingCostChf}
              lineItems={cartLineItems}
              productCommerce={productCommerce}
              onContinue={() => goToStep('details')}
            />
          )}

          {step === 'details' && (
            <form onSubmit={handleDetailsNext} className="space-y-6">
              <CheckoutContactFields customer={customer} onCustomerChange={setCustomer} />

              {shipping === 'post' && (
                <CheckoutShippingAddressForm address={shippingAddress} onChange={setShippingAddress} />
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
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                />
              </div>

              {error && <p className={checkoutInlineErrorClass}>{error}</p>}
              <div className="flex justify-between gap-4">
                <Button type="secondary" text="Zurück" showArrow={false} onClick={() => goToStep('shipping')} />
                <Button type="primary" text="Weiter" submit />
              </div>
            </form>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              <fieldset className="space-y-3">
                <legend className="sr-only">Zahlungsart</legend>
                {(Object.keys(CHECKOUT_PAYMENT_LABELS) as CheckoutPaymentMethod[]).map((method) => (
                  <label key={method} className={checkoutRadioCardClass}>
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                      className="text-wehrli mt-1"
                    />
                    <span className="text-left">
                      <span className="block font-bold">{CHECKOUT_PAYMENT_LABELS[method].title}</span>
                      <span className="text-sm text-gray-600">{CHECKOUT_PAYMENT_LABELS[method].description}</span>
                    </span>
                  </label>
                ))}
              </fieldset>

              {error && <p className={checkoutInlineErrorClass}>{error}</p>}
              <div className="flex justify-between gap-4">
                <Button type="secondary" text="Zurück" showArrow={false} onClick={() => goToStep('details')} />
                <Button type="primary" text="Weiter zur Zusammenfassung" onClick={() => goToStep('review')} />
              </div>
            </div>
          )}

          {step === 'review' && (
            <CheckoutReviewStep
              customer={customer}
              shipping={shipping}
              shippingAddress={shippingAddress}
              paymentMethod={paymentMethod}
              comment={comment}
              cartLines={reviewCartLines}
              subTotalChf={reviewTotals.subTotalChf}
              shippingCostChf={reviewTotals.shippingCostChf}
              grandTotalChf={reviewTotals.grandTotalChf}
              deliveryTimeSummary={verifiedQuote?.deliveryTimeSummary}
              error={orderFailure ? null : error}
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
