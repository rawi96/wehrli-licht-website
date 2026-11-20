import { SignedCheckoutOrder } from '@/types/checkout';

/** Purchase data for the GA4 `purchase` event. */
export type CheckoutPurchase = {
  transactionId: string;
  valueChf: number;
  items: { name: string; quantity: number; priceChf: number }[];
};

export type CheckoutSuccessStatus =
  | {
      kind: 'complete';
      channel: 'manual';
      order: SignedCheckoutOrder;
      purchase: CheckoutPurchase;
    }
  | {
      kind: 'complete';
      channel: 'stripe';
      purchase: CheckoutPurchase;
    }
  | {
      kind: 'email_failed';
      channel: 'stripe';
      purchase: CheckoutPurchase;
    }
  | {
      kind: 'invalid';
    };
