import { SignedCheckoutOrder } from '@/types/checkout';
import { createHmac, timingSafeEqual } from 'crypto';

const TOKEN_MAX_AGE_MS = 1000 * 60 * 60 * 24;

function getSecret(): string {
  const secret = process.env.CHECKOUT_ORDER_SECRET ?? process.env.STRIPE_SECRET_KEY;

  if (!secret) {
    throw new Error('Missing CHECKOUT_ORDER_SECRET or STRIPE_SECRET_KEY');
  }

  return secret;
}

export function signCheckoutOrder(order: SignedCheckoutOrder): string {
  const data = Buffer.from(JSON.stringify(order)).toString('base64url');
  const signature = createHmac('sha256', getSecret()).update(data).digest('base64url');

  return `${data}.${signature}`;
}

export function verifyCheckoutOrderToken(token: string): SignedCheckoutOrder | null {
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
    const order = JSON.parse(Buffer.from(data, 'base64url').toString('utf8')) as SignedCheckoutOrder;

    if (Date.now() - order.createdAt > TOKEN_MAX_AGE_MS) {
      return null;
    }

    return order;
  } catch {
    return null;
  }
}
