import { Cart } from '@/utils/cart';
import { CheckoutStep } from '@/types/checkout';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useEffect } from 'react';

const isCheckoutStep = (value: string | null): value is CheckoutStep =>
  value === 'shipping' || value === 'details' || value === 'payment' || value === 'review';

export const useCheckoutNavigation = (
  router: AppRouterInstance,
  stepParam: string | null,
  cart: Cart,
  isHydrated: boolean,
  draftLoaded: boolean,
): CheckoutStep => {
  const step: CheckoutStep = isCheckoutStep(stepParam) ? stepParam : 'shipping';

  useEffect(() => {
    if (!isHydrated || !draftLoaded) {
      return;
    }

    if (cart.items.length === 0) {
      router.replace('/shop');
    }
  }, [isHydrated, draftLoaded, cart.items.length, router]);

  useEffect(() => {
    if (stepParam === 'contact') {
      router.replace('/shop/checkout?step=shipping');

      return;
    }

    if (!isCheckoutStep(stepParam)) {
      router.replace('/shop/checkout?step=shipping');
    }
  }, [stepParam, router]);

  return step;
};
