import 'server-only';
import type { ManualCheckoutOrder } from '@/domain/checkout/order';
import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Manual orders are not stored: the success page gets the order in an HMAC-signed token (valid for a day),
 * so it can show the order without a database.
 */
const TOKEN_MAX_AGE_MS = 1000 * 60 * 60 * 24;

const getSecret = (): string => {
  const secret = process.env.CHECKOUT_ORDER_SECRET ?? process.env.STRIPE_SECRET_KEY;

  if (!secret) {
    throw new Error('Missing CHECKOUT_ORDER_SECRET or STRIPE_SECRET_KEY');
  }

  return secret;
};

export const signCheckoutOrder = (order: ManualCheckoutOrder): string => {
  const data = Buffer.from(JSON.stringify(order)).toString('base64url');
  const signature = createHmac('sha256', getSecret()).update(data).digest('base64url');

  return `${data}.${signature}`;
};

export const verifyCheckoutOrderToken = (token: string): ManualCheckoutOrder | null => {
  const [data, signature] = token.split('.');

  if (!data || !signature) {
    return null;
  }

  const expectedSignature = createHmac('sha256', getSecret()).update(data).digest('base64url');
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const order = JSON.parse(Buffer.from(data, 'base64url').toString('utf8')) as ManualCheckoutOrder;

    if (Date.now() - order.createdAt > TOKEN_MAX_AGE_MS) {
      return null;
    }

    return order;
  } catch {
    return null;
  }
};
