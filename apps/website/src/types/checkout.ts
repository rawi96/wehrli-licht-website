import { CheckoutCartItemPayload } from '@/utils/cart-checkout';

export type CheckoutStep = 'shipping' | 'details' | 'payment' | 'review';

export type CheckoutCustomer = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type CheckoutShippingMethod = 'pickup' | 'post';

export type CheckoutShippingAddress = {
  street: string;
  postalCode: string;
  city: string;
  country: 'CH';
};

export type CheckoutPaymentMethod = 'prepayment' | 'cash' | 'online';

export type CheckoutRequestBody = {
  items: CheckoutCartItemPayload[];
  customer: CheckoutCustomer;
  shipping: CheckoutShippingMethod;
  paymentMethod: CheckoutPaymentMethod;
  comment?: string;
  shippingAddress?: CheckoutShippingAddress;
};

export type CheckoutOrderItem = {
  productId: string;
  name: string;
  quantity: number;
  unitPriceChf: number;
};

export type SignedCheckoutOrder = {
  orderId: string;
  createdAt: number;
  customer: CheckoutCustomer;
  shipping: CheckoutShippingMethod;
  paymentMethod: 'prepayment' | 'cash';
  items: CheckoutOrderItem[];
  subTotalChf: number;
  shippingCostChf: number;
  grandTotalChf: number;
  /** Summarized from Dato `delivery_time` at checkout, e.g. "2–3 Wochen". */
  deliveryTimeSummary?: string;
  comment?: string;
  shippingAddress?: CheckoutShippingAddress;
};
