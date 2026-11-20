import type { ManualCheckoutOrder } from './order';

/** A completed purchase, for the analytics purchase event. */
export type CheckoutPurchase = {
  transactionId: string;
  valueChf: number;
  items: { name: string; quantity: number; priceChf: number }[];
};

/** What the success page shows: a manual order, a paid online order, or nothing valid. */
export type CheckoutSuccessStatus =
  | {
      kind: 'complete';
      channel: 'manual';
      order: ManualCheckoutOrder;
      purchase: CheckoutPurchase;
    }
  | {
      kind: 'complete';
      channel: 'online';
      purchase: CheckoutPurchase;
    }
  | {
      kind: 'email_failed';
      channel: 'online';
      purchase: CheckoutPurchase;
    }
  | {
      kind: 'invalid';
    };
