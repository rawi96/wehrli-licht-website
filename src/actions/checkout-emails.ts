'use server';

import { sendCheckoutOrderEmails, SendCheckoutEmailsResult } from '@/lib/send-checkout-order-emails';
import { sendStripeCheckoutOrderEmails as sendStripeCheckoutEmails } from '@/lib/send-stripe-checkout-order-emails';
import { orderEmailDataFromSignedOrder } from '@/types/checkout-order-email';
import { SignedCheckoutOrder } from '@/types/checkout';

export type CheckoutEmailResult = SendCheckoutEmailsResult;

export async function sendManualCheckoutOrderEmails(order: SignedCheckoutOrder): Promise<CheckoutEmailResult> {
  return sendCheckoutOrderEmails(orderEmailDataFromSignedOrder(order));
}

export async function sendStripeCheckoutOrderEmails(sessionId: string): Promise<CheckoutEmailResult> {
  return sendStripeCheckoutEmails(sessionId);
}
