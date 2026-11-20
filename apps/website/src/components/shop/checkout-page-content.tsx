'use client';

import { MAX_LINE_QUANTITY } from '@/constants/shop-commerce';
import { useShopContext } from '@/app/context/shop-context';
import { useCheckoutCommerce } from '@/components/shop/hooks/use-checkout-commerce';
import { useCheckoutDraft } from '@/components/shop/hooks/use-checkout-draft';
import { useCheckoutNavigation } from '@/components/shop/hooks/use-checkout-navigation';
import { useCheckoutQuote } from '@/components/shop/hooks/use-checkout-quote';
import { CHECKOUT_ERROR_ALERT_COPY, CHECKOUT_API_ERROR_CODE } from '@/constants/checkout-errors';
import {
  CHECKOUT_PAYMENT_LABELS,
  CHECKOUT_SHIPPING_LABELS,
  CHECKOUT_STEP_HEADINGS,
  CHECKOUT_STEP_TITLES,
} from '@/constants/checkout-labels';
import { SHOP_HOME_PATH } from '@/constants/shop-paths';
import { CheckoutPaymentMethod, CheckoutStep } from '@/types/checkout';
import { toCartLine } from '@/utils/cart';
import { computeCheckoutTotals } from '@/utils/cart-checkout';
import { validateCheckoutCustomer } from '@/utils/checkout-customer';
import {
  CHECKOUT_SHIPPING_COUNTRY,
  CHECKOUT_SHIPPING_COUNTRY_LABEL,
  formatShippingAddress,
  validateShippingAddress,
} from '@/utils/checkout-shipping-address';
import { buildCheckoutItemsFromCart } from '@/utils/build-checkout-payload';
import { clearCheckoutDraft } from '@/utils/checkout-storage';
import { formatPriceToCHF } from '@/utils/price';
import { formatShippingCostLabel, resolveCartShippingCostChf, summarizeDeliveryTimes } from '@/utils/product-commerce';
import {
  CheckoutCartSummary,
  CheckoutDetailsStep,
  CheckoutErrorAlert,
  CheckoutLayout,
  CheckoutLoading,
  CheckoutPaymentStep,
  CheckoutReview,
  CheckoutShippingStep,
  CheckoutSteps,
} from '@wehrli/design-system';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';

const CHECKOUT_STEPS = (Object.keys(CHECKOUT_STEP_TITLES) as CheckoutStep[]).map((id) => ({
  id,
  title: CHECKOUT_STEP_TITLES[id],
}));

const PAYMENT_OPTIONS = (Object.keys(CHECKOUT_PAYMENT_LABELS) as CheckoutPaymentMethod[]).map((method) => ({
  value: method,
  ...CHECKOUT_PAYMENT_LABELS[method],
}));

type CheckoutApiResponse = {
  type?: string;
  url?: string;
  error?: string;
  code?: string;
};

type Props = {
  /** Contact page from DatoCMS (Header & Footer). */
  contactHref: string;
};

export const CheckoutPageContent = ({ contactHref }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { shoppingCart, isHydrated, updateItemQuantity, removeItem } = useShopContext();
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
        total: formatPriceToCHF(line.unitPriceChf * line.quantity),
      })) ?? [],
    [verifiedQuote],
  );

  const reviewTotals = verifiedQuote?.totals ?? { subTotalChf: 0, shippingCostChf: 0, grandTotalChf: 0 };
  const displayError = error ?? quoteError;

  const sidebarTotals = useMemo(
    () => computeCheckoutTotals(cartLineItems, draft.shipping, productCommerce),
    [cartLineItems, draft.shipping, productCommerce],
  );

  const deliveryTimeSummary = summarizeDeliveryTimes(cartLineItems, productCommerce);

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
    return <CheckoutLoading title="Kasse" text="Laden…" />;
  }

  if (shoppingCart.items.length === 0) {
    return null;
  }

  const showFullTotals = step !== 'shipping';
  const submitLabel = draft.paymentMethod === 'online' ? 'Jetzt bezahlen' : 'Bestellung abschliessen';

  return (
    <CheckoutLayout
      title={CHECKOUT_STEP_HEADINGS[step]}
      sidebar={
        <CheckoutCartSummary
          items={shoppingCart.items.map(toCartLine)}
          maxQuantity={MAX_LINE_QUANTITY}
          subtotal={formatPriceToCHF(sidebarTotals.subTotalChf)}
          shippingCost={
            draft.shipping === 'post' || showFullTotals
              ? formatShippingCostLabel(draft.shipping, sidebarTotals.shippingCostChf)
              : null
          }
          total={showFullTotals ? formatPriceToCHF(sidebarTotals.grandTotalChf) : null}
          deliveryTime={deliveryTimeSummary}
          onQuantityChange={updateItemQuantity}
          onRemove={removeItem}
        />
      }
      alert={
        orderFailure ? (
          <CheckoutErrorAlert message={CHECKOUT_ERROR_ALERT_COPY.order_not_completed} contactHref={contactHref} />
        ) : null
      }
      steps={<CheckoutSteps steps={CHECKOUT_STEPS} currentStep={step} />}
    >
      {step === 'shipping' && (
        <CheckoutShippingStep
          options={[
            { value: 'pickup', title: CHECKOUT_SHIPPING_LABELS.pickup, description: 'Gratis während den Öffnungszeiten' },
            {
              value: 'post',
              title: CHECKOUT_SHIPPING_LABELS.post,
              description: `In die Schweiz · ${formatShippingCostLabel('post', postShippingCostChf)}`,
            },
          ]}
          value={draft.shipping}
          onChange={draft.setShipping}
          deliveryTime={deliveryTimeSummary}
          backHref={SHOP_HOME_PATH}
          onContinue={() => goToStep('details')}
        />
      )}

      {step === 'details' && (
        <CheckoutDetailsStep
          contact={draft.customer}
          onContactChange={draft.setCustomer}
          showAddress={draft.shipping === 'post'}
          address={draft.shippingAddress}
          onAddressChange={(address) =>
            draft.setShippingAddress({
              ...draft.shippingAddress,
              ...address,
              postalCode: address.postalCode.replace(/\D/g, '').slice(0, 4),
            })
          }
          country={{ code: CHECKOUT_SHIPPING_COUNTRY, label: CHECKOUT_SHIPPING_COUNTRY_LABEL }}
          contactHref={contactHref}
          comment={draft.comment}
          onCommentChange={draft.setComment}
          error={displayError}
          onBack={() => goToStep('shipping')}
          onSubmit={handleDetailsNext}
        />
      )}

      {step === 'payment' && (
        <CheckoutPaymentStep
          options={PAYMENT_OPTIONS}
          value={draft.paymentMethod}
          onChange={draft.setPaymentMethod}
          error={displayError}
          onBack={() => goToStep('details')}
          onContinue={() => goToStep('review')}
        />
      )}

      {step === 'review' && (
        <CheckoutReview
          intro={`Bitte prüfen Sie Ihre Angaben. Mit «${submitLabel}» wird die Bestellung verbindlich ausgelöst.`}
          contact={{
            name: `${draft.customer.firstName} ${draft.customer.lastName}`,
            email: draft.customer.email,
            phone: draft.customer.phone,
          }}
          shipping={{
            method: CHECKOUT_SHIPPING_LABELS[draft.shipping],
            address: draft.shipping === 'post' ? formatShippingAddress(draft.shippingAddress) : null,
            deliveryTime: verifiedQuote?.deliveryTimeSummary,
          }}
          payment={CHECKOUT_PAYMENT_LABELS[draft.paymentMethod]}
          comment={draft.comment.trim()}
          lines={reviewCartLines}
          subtotal={formatPriceToCHF(reviewTotals.subTotalChf)}
          shippingCost={formatShippingCostLabel(draft.shipping, reviewTotals.shippingCostChf)}
          total={formatPriceToCHF(reviewTotals.grandTotalChf)}
          checking={isQuoteLoading}
          error={orderFailure ? null : displayError}
          submitting={isSubmitting}
          submitLabel={submitLabel}
          onBack={() => goToStep('payment')}
          onSubmit={handleSubmit}
        />
      )}
    </CheckoutLayout>
  );
};
