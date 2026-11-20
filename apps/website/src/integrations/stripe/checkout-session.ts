import 'server-only';
import { CHECKOUT_SHIPPING_LABELS } from '@/domain/checkout/labels';
import { formatShippingAddress } from '@/domain/checkout/shipping-address';
import type { PaymentLineItem, PaymentSessionRequest } from '@/ports/payment-provider';
import type Stripe from 'stripe';
import { getStripe } from './client';
import { STRIPE_CHECKOUT_PAYMENT_METHODS } from './payment-methods';

/** Name of the Stripe line item that carries the shipping cost (told apart from products by it). */
export const STRIPE_SHIPPING_LINE_NAME = CHECKOUT_SHIPPING_LABELS.post;

/** Marks sessions started by the shop, so the webhook ignores other Checkout sessions of the account. */
export const SHOP_CHECKOUT_SOURCE = 'shop';

const chfToStripeAmount = (chf: number): number => Math.round(chf * 100);

const buildStripeLineItems = (
  items: PaymentLineItem[],
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
        product_data: { name: STRIPE_SHIPPING_LINE_NAME },
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

const createStripeCheckoutSessionWithFallback = async (
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

/** Session metadata: read back by the webhook and for the order e-mails (see order-from-session.ts). */
const buildMetadata = ({ order }: PaymentSessionRequest): Record<string, string> => {
  const metadata: Record<string, string> = {
    order_id: order.orderId,
    source: SHOP_CHECKOUT_SOURCE,
    customer_name: `${order.customer.firstName} ${order.customer.lastName}`,
    customer_email: order.customer.email,
    customer_phone: order.customer.phone,
    shipping: order.shipping,
    payment_method: order.paymentMethod,
  };

  if (order.comment) {
    metadata.comment = order.comment.slice(0, 500);
  }

  if (order.deliveryTimeSummary) {
    metadata.delivery_time = order.deliveryTimeSummary.slice(0, 200);
  }

  if (order.shippingAddress) {
    metadata.shipping_address = formatShippingAddress(order.shippingAddress).slice(0, 500);
  }

  return metadata;
};

export const createCheckoutSession = async (request: PaymentSessionRequest): Promise<string | null> => {
  const session = await createStripeCheckoutSessionWithFallback({
    mode: 'payment',
    currency: 'chf',
    locale: 'de',
    customer_email: request.order.customer.email,
    line_items: buildStripeLineItems(request.order.items, request.order.shippingCostChf),
    success_url: `${request.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: request.cancelUrl,
    metadata: buildMetadata(request),
  });

  return session.url;
};
