'use server';

import { sendCheckoutOrderEmails, SendCheckoutEmailsResult } from '@/lib/send-checkout-order-emails';
import { sendStripeCheckoutOrderEmails as sendStripeCheckoutEmails } from '@/lib/send-stripe-checkout-order-emails';
import { orderEmailDataFromSignedOrder } from '@/types/checkout-order-email';
import { SignedCheckoutOrder } from '@/types/checkout';

export type CheckoutEmailResult = SendCheckoutEmailsResult;

export const sendManualCheckoutOrderEmails = async (order: SignedCheckoutOrder): Promise<CheckoutEmailResult> =>
  sendCheckoutOrderEmails(orderEmailDataFromSignedOrder(order));

export const sendStripeCheckoutOrderEmails = async (sessionId: string): Promise<CheckoutEmailResult> =>
  sendStripeCheckoutEmails(sessionId);
