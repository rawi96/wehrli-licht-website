import type Stripe from 'stripe';

/**
 * All Checkout methods we request for CH. Stripe shows only what is enabled
 * in your Dashboard. Apple Pay & Google Pay appear via `card` when wallets are on.
 */
export const STRIPE_CHECKOUT_PAYMENT_METHODS = [
  'card',
  'twint',
  'link',
  'paypal',
  'klarna',
] as Stripe.Checkout.SessionCreateParams['payment_method_types'];
