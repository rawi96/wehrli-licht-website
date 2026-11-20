import 'server-only';
import type { PaymentProvider } from '@/ports/payment-provider';
import { createCheckoutSession } from './checkout-session';
import { loadPaidOrder, loadPaymentStatus } from './order-from-session';
import { parseStripeWebhook } from './webhook';

export const stripePayments: PaymentProvider = {
  createPaymentSession: createCheckoutSession,
  getPaymentStatus: loadPaymentStatus,
  getPaidOrder: loadPaidOrder,
  parseWebhook: parseStripeWebhook,
};
