import type { CheckoutCartItemPayload } from '@/domain/checkout/cart-items';
import type {
  CheckoutCustomer,
  CheckoutPaymentMethod,
  CheckoutShippingAddress,
  CheckoutShippingMethod,
} from '@/domain/checkout/order';
import type { VerifiedCheckoutQuote } from '@/domain/checkout/totals';
import type { ProductCommerceMeta } from '@/domain/shop/commerce';

// Request and response bodies of the checkout API (app/api/shop/checkout), shared by the route handlers and the
// checkout page in the browser. The handlers trust the JSON shape as before; the service checks the values.

/** POST /api/shop/checkout */
export type CheckoutRequestBody = {
  items: CheckoutCartItemPayload[];
  customer: CheckoutCustomer;
  shipping: CheckoutShippingMethod;
  paymentMethod: CheckoutPaymentMethod;
  comment?: string;
  shippingAddress?: CheckoutShippingAddress;
};

export type CheckoutApiResponse = {
  type?: string;
  url?: string;
  error?: string;
  code?: string;
};

export const CHECKOUT_API_ERROR_CODE = {
  emailFailed: 'checkout_email_failed',
} as const;

/** POST /api/shop/checkout/quote */
export type QuoteRequestBody = {
  items?: CheckoutCartItemPayload[];
  shipping?: CheckoutShippingMethod;
};

export type QuoteResponse = VerifiedCheckoutQuote & { error?: string };

/** POST /api/shop/checkout/commerce */
export type CommerceRequestBody = { productIds?: string[] };

export type CommerceResponse = { commerce?: ProductCommerceMeta[] };

export const isShippingMethod = (value: unknown): value is CheckoutShippingMethod => value === 'pickup' || value === 'post';
