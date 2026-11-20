import type { CheckoutOrder, CheckoutOrderItem } from '@/domain/checkout/order';
import type { CheckoutPurchase } from '@/domain/checkout/success-status';

/** An order line with the product image to show on the payment page. */
export type PaymentLineItem = CheckoutOrderItem & { imageUrl?: string };

/** An online order to be paid. */
export type PaymentSessionRequest = {
  order: Omit<CheckoutOrder, 'items'> & { items: PaymentLineItem[] };
  /** Where the provider sends the customer after paying; it appends `session_id=<session id>`. */
  successUrl: string;
  /** Where the provider sends the customer when they cancel. */
  cancelUrl: string;
};

export type PaymentStatus = { paid: false } | { paid: true; purchase: CheckoutPurchase };

/** What the provider tells the shop through its webhook, already verified. */
export type PaymentWebhookEvent =
  | {
      type: 'checkout_completed';
      sessionId: string;
      /** From the session as far as known, for logging when the e-mails fail. */
      orderId: string;
      customerEmail: string;
      customerPhone: string;
    }
  /** Another event or a payment not started by the shop. */
  | { type: 'ignored' };

/** Online payments (today Stripe Checkout): card, TWINT, wallets and what else the provider offers. */
export type PaymentProvider = {
  /** Starts a hosted payment for the order. Returns the URL to send the customer to, or null if there is none. */
  createPaymentSession(request: PaymentSessionRequest): Promise<string | null>;
  /** Whether a payment session is paid, with the purchase for analytics. Throws if the session cannot be loaded. */
  getPaymentStatus(sessionId: string): Promise<PaymentStatus>;
  /** The order of a paid session (for the e-mails); null if unpaid or incomplete. Throws if it cannot be loaded. */
  getPaidOrder(sessionId: string): Promise<CheckoutOrder | null>;
  /** Verifies a webhook request (raw body and headers) and maps it to a domain event. Throws if it is not genuine. */
  parseWebhook(body: string, headers: Headers): Promise<PaymentWebhookEvent>;
};
