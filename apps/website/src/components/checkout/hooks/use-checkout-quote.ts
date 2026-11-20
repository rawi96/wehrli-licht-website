import { buildCheckoutItemsFromCart, cartCheckoutFingerprint } from '@/domain/checkout/cart-items';
import { CheckoutShippingMethod } from '@/domain/checkout/order';
import type { VerifiedCheckoutQuote } from '@/domain/checkout/totals';
import { QuoteRequestBody, QuoteResponse } from '@/features/checkout/schemas';
import { Cart } from '@/domain/shop/cart';
import { useEffect, useRef, useState } from 'react';
import { CheckoutStep } from '../checkout-copy';

export const useCheckoutQuote = (
  cart: Cart,
  shipping: CheckoutShippingMethod,
  step: CheckoutStep,
  isHydrated: boolean,
  draftLoaded: boolean,
): {
  verifiedQuote: VerifiedCheckoutQuote | null;
  isQuoteLoading: boolean;
  quoteError: string | null;
  setQuoteError: (error: string | null) => void;
} => {
  const [verifiedQuote, setVerifiedQuote] = useState<VerifiedCheckoutQuote | null>(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const quoteRequestId = useRef(0);
  const cartFingerprint = cartCheckoutFingerprint(cart);
  const isReviewStep = step === 'review';
  const shouldFetch = isHydrated && draftLoaded && isReviewStep && cart.items.length > 0;

  useEffect(() => {
    if (!shouldFetch) {
      return;
    }

    const requestId = ++quoteRequestId.current;

    const loadQuote = async (): Promise<void> => {
      setIsQuoteLoading(true);

      try {
        const response = await fetch('/api/shop/checkout/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: buildCheckoutItemsFromCart(cart),
            shipping,
          } satisfies QuoteRequestBody),
        });

        const data = (await response.json()) as QuoteResponse;

        if (quoteRequestId.current !== requestId) {
          return;
        }

        if (!response.ok) {
          setVerifiedQuote(null);
          setQuoteError(data.error ?? 'Warenkorb konnte nicht geprüft werden.');

          return;
        }

        setVerifiedQuote({
          lines: data.lines,
          totals: data.totals,
          deliveryTimeSummary: data.deliveryTimeSummary,
        });
        setQuoteError(null);
      } catch {
        if (quoteRequestId.current !== requestId) {
          return;
        }

        setVerifiedQuote(null);
        setQuoteError('Warenkorb konnte nicht geprüft werden.');
      } finally {
        if (quoteRequestId.current === requestId) {
          setIsQuoteLoading(false);
        }
      }
    };

    void loadQuote();
  }, [shouldFetch, cartFingerprint, shipping, cart]);

  return {
    verifiedQuote: isReviewStep ? verifiedQuote : null,
    isQuoteLoading: isReviewStep ? isQuoteLoading : false,
    quoteError: isReviewStep ? quoteError : null,
    setQuoteError,
  };
};
