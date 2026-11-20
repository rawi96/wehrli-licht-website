import 'server-only';
import { CheckoutCartItemPayload, VerifiedCheckoutLineItem, verifyCheckoutCartItems } from '@/domain/checkout/cart-items';
import { validateCheckoutCustomer } from '@/domain/checkout/customer';
import { CheckoutOrder, ManualCheckoutOrder, orderFromManualOrder } from '@/domain/checkout/order';
import { normalizeShippingAddress, validateShippingAddress } from '@/domain/checkout/shipping-address';
import type { CheckoutSuccessStatus } from '@/domain/checkout/success-status';
import { computeCheckoutTotals, VerifiedCheckoutQuote } from '@/domain/checkout/totals';
import { catalog, payments } from '@/integrations';
import type { PaymentWebhookEvent } from '@/ports/payment-provider';
import { mapProductsToCommerceMeta, ProductCommerceMeta, summarizeDeliveryTimes } from '@/utils/product-commerce';
import { getSiteUrl } from '@/utils/site-url';
import { randomUUID } from 'crypto';
import {
  isCheckoutEmailDelivered,
  logCheckoutEmailFailure,
  sendCheckoutOrderEmails,
  sendPaidOrderEmails,
} from './order-emails';
import { signCheckoutOrder, verifyCheckoutOrderToken } from './order-token';
import { CheckoutRequestBody, isShippingMethod, QuoteRequestBody } from './schemas';

// Checkout use cases. Expected failures (empty cart, invalid input) are results with the message for the customer;
// unexpected ones (catalog or payment provider unreachable) throw.

type Invalid = { ok: false; error: string };

const toCommerceMeta = (products: Awaited<ReturnType<typeof catalog.getCheckoutProducts>>): ProductCommerceMeta[] =>
  mapProductsToCommerceMeta(
    products.map((product) => ({
      id: product.id,
      name: product.name,
      deliveryTime: product.deliveryTime,
      shippingCost: product.shippingCost,
    })),
  );

/** Shipping cost and delivery time of the products in the cart, for the checkout's sidebar. */
export const getCheckoutCommerce = async (productIds: string[]): Promise<ProductCommerceMeta[]> => {
  if (productIds.length === 0) {
    return [];
  }

  return toCommerceMeta(await catalog.getCheckoutProducts(productIds));
};

/** Checks the cart against the catalog: lines with the catalog's prices, plus shipping cost and delivery times. */
const verifyCart = async (
  items: CheckoutCartItemPayload[],
): Promise<{ ok: true; items: VerifiedCheckoutLineItem[]; commerce: ProductCommerceMeta[] } | Invalid> => {
  const productIds = [...new Set(items.map((item) => item.productId))];
  const products = await catalog.getCheckoutProducts(productIds);
  const verified = verifyCheckoutCartItems(items, products);

  return verified.ok ? { ok: true, items: verified.items, commerce: toCommerceMeta(products) } : verified;
};

/** The verified cart with totals, shown on the review step before the order is placed. */
export const quoteCart = async (body: QuoteRequestBody): Promise<{ ok: true; quote: VerifiedCheckoutQuote } | Invalid> => {
  if (!body.items?.length) {
    return { ok: false, error: 'Der Warenkorb ist leer.' };
  }

  if (!isShippingMethod(body.shipping)) {
    return { ok: false, error: 'Bitte eine Versandart wählen.' };
  }

  const cart = await verifyCart(body.items);

  if (!cart.ok) {
    return cart;
  }

  return {
    ok: true,
    quote: {
      lines: cart.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        unitPriceChf: item.unitPriceChf,
      })),
      totals: computeCheckoutTotals(cart.items, body.shipping, cart.commerce),
      deliveryTimeSummary: summarizeDeliveryTimes(cart.items, cart.commerce) ?? undefined,
    },
  };
};

export type PlaceOrderResult =
  /** Online payment: the provider's payment page. Manual order: the success page with the signed order. */
  | { ok: true; redirectUrl: string }
  | Invalid
  /** A manual order whose e-mails could not be sent: it is not placed. */
  | { ok: false; error: 'email_failed' };

/**
 * Places an order. Online payments go to the payment provider (the e-mails follow from its webhook or the success
 * page); manual orders (Vorauskasse, vor Ort) send the e-mails right away.
 */
export const placeOrder = async (body: CheckoutRequestBody): Promise<PlaceOrderResult> => {
  if (!body.items?.length) {
    return { ok: false, error: 'Der Warenkorb ist leer.' };
  }

  const customerError = validateCheckoutCustomer({
    firstName: body.customer.firstName,
    lastName: body.customer.lastName,
    email: body.customer.email,
    phone: body.customer.phone,
  });

  if (customerError) {
    return { ok: false, error: customerError };
  }

  if (!isShippingMethod(body.shipping)) {
    return { ok: false, error: 'Bitte eine Versandart wählen.' };
  }

  const shippingAddress =
    body.shipping === 'post' && body.shippingAddress ? normalizeShippingAddress(body.shippingAddress) : undefined;

  if (body.shipping === 'post') {
    if (!shippingAddress) {
      return { ok: false, error: 'Bitte die Lieferadresse angeben.' };
    }

    const addressError = validateShippingAddress(shippingAddress);

    if (addressError) {
      return { ok: false, error: addressError };
    }
  }

  const cart = await verifyCart(body.items);

  if (!cart.ok) {
    return cart;
  }

  const totals = computeCheckoutTotals(cart.items, body.shipping, cart.commerce);
  const deliveryTimeSummary = summarizeDeliveryTimes(cart.items, cart.commerce) ?? undefined;
  const siteUrl = getSiteUrl();
  const comment = body.comment?.trim() ?? '';
  const order: CheckoutOrder = {
    orderId: randomUUID(),
    customer: {
      firstName: body.customer.firstName.trim(),
      lastName: body.customer.lastName.trim(),
      email: body.customer.email.trim(),
      phone: body.customer.phone.trim(),
    },
    shipping: body.shipping,
    paymentMethod: body.paymentMethod,
    items: cart.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      unitPriceChf: item.unitPriceChf,
    })),
    ...totals,
    ...(deliveryTimeSummary ? { deliveryTimeSummary } : {}),
    ...(comment ? { comment } : {}),
    ...(shippingAddress ? { shippingAddress } : {}),
  };

  if (body.paymentMethod === 'online') {
    const url = await payments.createPaymentSession({
      order: { ...order, items: cart.items },
      successUrl: `${siteUrl}/shop/checkout/success`,
      cancelUrl: `${siteUrl}/shop/checkout/cancelled`,
    });

    return url ? { ok: true, redirectUrl: url } : { ok: false, error: 'Checkout konnte nicht gestartet werden.' };
  }

  if (body.paymentMethod !== 'prepayment' && body.paymentMethod !== 'cash') {
    return { ok: false, error: 'Ungültige Zahlungsart.' };
  }

  const manualOrder: ManualCheckoutOrder = {
    orderId: order.orderId,
    createdAt: Date.now(),
    customer: order.customer,
    shipping: order.shipping,
    paymentMethod: body.paymentMethod,
    items: order.items,
    subTotalChf: order.subTotalChf,
    shippingCostChf: order.shippingCostChf,
    grandTotalChf: order.grandTotalChf,
    ...(deliveryTimeSummary ? { deliveryTimeSummary } : {}),
    ...(comment ? { comment } : {}),
    ...(shippingAddress ? { shippingAddress } : {}),
  };

  const orderEmail = orderFromManualOrder(manualOrder);
  const emailResult = await sendCheckoutOrderEmails(orderEmail);

  if (!isCheckoutEmailDelivered(emailResult)) {
    logCheckoutEmailFailure('manual checkout API', emailResult.message, orderEmail, {
      skipped: emailResult.skipped,
    });

    return { ok: false, error: 'email_failed' };
  }

  return {
    ok: true,
    redirectUrl: `${siteUrl}/shop/checkout/success?order_token=${encodeURIComponent(signCheckoutOrder(manualOrder))}`,
  };
};

export type PaymentWebhookResult =
  | { status: 'rejected'; message: string }
  | { status: 'ignored' }
  | { status: 'sent' }
  | { status: 'failed'; message: string };

/** The payment provider reports a completed payment: send the order e-mails (idempotent with the success page). */
export const handlePaymentWebhook = async (body: string, headers: Headers): Promise<PaymentWebhookResult> => {
  let event: PaymentWebhookEvent;

  try {
    event = await payments.parseWebhook(body, headers);
  } catch (error) {
    return { status: 'rejected', message: error instanceof Error ? error.message : 'Webhook signature verification failed' };
  }

  if (event.type === 'ignored') {
    return { status: 'ignored' };
  }

  const { sessionId } = event;

  if (!sessionId) {
    return { status: 'failed', message: 'Stripe session id missing' };
  }

  const emailResult = await sendPaidOrderEmails(sessionId);

  if (!isCheckoutEmailDelivered(emailResult)) {
    const message = emailResult.message ?? 'E-Mail-Versand fehlgeschlagen.';

    logCheckoutEmailFailure(
      'stripe webhook',
      message,
      {
        orderId: event.orderId,
        customer: { firstName: '', lastName: '', email: event.customerEmail, phone: event.customerPhone },
        paymentMethod: 'online',
      },
      { sessionId, skipped: emailResult.skipped },
    );

    return { status: 'failed', message };
  }

  return { status: 'sent' };
};

/**
 * What the success page shows. A manual order comes as a signed token; an online payment as the provider's session,
 * whose e-mails are sent here too (in case the webhook has not arrived yet; the mailer dedupes them).
 */
export const resolveCheckoutSuccessStatus = async (
  sessionId: string | undefined,
  orderToken: string | undefined,
): Promise<CheckoutSuccessStatus> => {
  const manualOrder = orderToken ? verifyCheckoutOrderToken(orderToken) : null;

  if (manualOrder) {
    return {
      kind: 'complete',
      channel: 'manual',
      order: manualOrder,
      purchase: {
        transactionId: manualOrder.orderId,
        valueChf: manualOrder.grandTotalChf,
        items: manualOrder.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          priceChf: item.unitPriceChf,
        })),
      },
    };
  }

  if (!sessionId) {
    return { kind: 'invalid' };
  }

  try {
    const payment = await payments.getPaymentStatus(sessionId);

    if (!payment.paid) {
      return { kind: 'invalid' };
    }

    const emailResult = await sendPaidOrderEmails(sessionId);

    if (!isCheckoutEmailDelivered(emailResult)) {
      console.error('[checkout-email]', {
        context: 'stripe checkout success page',
        sessionId,
        technicalError: emailResult.message,
        skipped: emailResult.skipped,
      });

      return { kind: 'email_failed', channel: 'online', purchase: payment.purchase };
    }

    return { kind: 'complete', channel: 'online', purchase: payment.purchase };
  } catch {
    return { kind: 'invalid' };
  }
};
