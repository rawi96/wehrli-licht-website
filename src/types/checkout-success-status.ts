import { SignedCheckoutOrder } from '@/types/checkout';

export type CheckoutSuccessStatus =
  | {
      kind: 'complete';
      channel: 'manual';
      order: SignedCheckoutOrder;
    }
  | {
      kind: 'complete';
      channel: 'stripe';
    }
  | {
      kind: 'email_failed';
      channel: 'stripe';
    }
  | {
      kind: 'invalid';
    };
