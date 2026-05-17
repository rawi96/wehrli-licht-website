import { STRIPE_CHECKOUT_PAYMENT_METHODS } from '@/constants/stripe-payment-methods';
import { getStripe } from '@/lib/stripe';
import type { VerifiedCheckoutLineItem } from '@/utils/cart-checkout';
import { chfToStripeAmount } from '@/utils/cart-checkout';
import type Stripe from 'stripe';

export const buildStripeLineItems = (
  items: VerifiedCheckoutLineItem[],
  shippingCostChf: number,
): Stripe.Checkout.SessionCreateParams['line_items'] => {
  const lineItems: NonNullable<Stripe.Checkout.SessionCreateParams['line_items']> = items.map((item) => ({
    quantity: item.quantity,
    price_data: {
      currency: 'chf',
      unit_amount: chfToStripeAmount(item.unitPriceChf),
      product_data: {
        name: item.name,
        ...(item.imageUrl ? { images: [item.imageUrl] } : {}),
      },
    },
  }));

  if (shippingCostChf > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: 'chf',
        unit_amount: chfToStripeAmount(shippingCostChf),
        product_data: { name: 'Versand per Post' },
      },
    });
  }

  return lineItems;
};

const createStripeCheckoutSession = async (
  stripe: Stripe,
  params: Omit<Stripe.Checkout.SessionCreateParams, 'payment_method_types'>,
  paymentMethodTypes: Stripe.Checkout.SessionCreateParams['payment_method_types'],
): Promise<Stripe.Checkout.Session> =>
  stripe.checkout.sessions.create({
    ...params,
    payment_method_types: paymentMethodTypes,
  });

export const createStripeCheckoutSessionWithFallback = async (
  params: Omit<Stripe.Checkout.SessionCreateParams, 'payment_method_types'>,
): Promise<Stripe.Checkout.Session> => {
  const stripe = getStripe();
  const fallbackMethods: Stripe.Checkout.SessionCreateParams['payment_method_types'][] = [
    STRIPE_CHECKOUT_PAYMENT_METHODS,
    ['card', 'twint', 'link', 'paypal'],
    ['card', 'twint'],
  ];

  let lastError: unknown;

  for (const paymentMethodTypes of fallbackMethods) {
    try {
      return await createStripeCheckoutSession(stripe, params, paymentMethodTypes);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Checkout konnte nicht gestartet werden.');
};
