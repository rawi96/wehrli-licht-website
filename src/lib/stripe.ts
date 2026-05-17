import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

export const getStripe = (): Stripe => {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY');
  }

  stripeClient ??= new Stripe(secretKey);

  return stripeClient;
};

export const getStripeWebhookSecret = (): string => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error('Missing STRIPE_WEBHOOK_SECRET');
  }

  return secret;
};
