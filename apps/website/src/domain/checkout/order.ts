/** Who orders: contact details from the checkout's details step. */
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

/** prepayment and cash are settled outside the shop (manual orders), online through the payment provider. */
export type CheckoutPaymentMethod = 'prepayment' | 'cash' | 'online';

export type CheckoutOrderItem = {
  productId: string;
  name: string;
  quantity: number;
  unitPriceChf: number;
};

/** A placed order, as the order e-mails show it. */
export type CheckoutOrder = {
  orderId: string;
  customer: CheckoutCustomer;
  shipping: CheckoutShippingMethod;
  paymentMethod: CheckoutPaymentMethod;
  items: CheckoutOrderItem[];
  subTotalChf: number;
  shippingCostChf: number;
  grandTotalChf: number;
  deliveryTimeSummary?: string;
  comment?: string;
  shippingAddress?: CheckoutShippingAddress;
};

/** An order paid outside the shop (Vorauskasse, vor Ort), carried to the success page in a signed token. */
export type ManualCheckoutOrder = {
  orderId: string;
  createdAt: number;
  customer: CheckoutCustomer;
  shipping: CheckoutShippingMethod;
  paymentMethod: 'prepayment' | 'cash';
  items: CheckoutOrderItem[];
  subTotalChf: number;
  shippingCostChf: number;
  grandTotalChf: number;
  /** Summarized from the products' delivery times at checkout, e.g. "2–3 Wochen". */
  deliveryTimeSummary?: string;
  comment?: string;
  shippingAddress?: CheckoutShippingAddress;
};

export const orderFromManualOrder = (order: ManualCheckoutOrder): CheckoutOrder => ({
  orderId: order.orderId,
  customer: order.customer,
  shipping: order.shipping,
  paymentMethod: order.paymentMethod,
  items: order.items,
  subTotalChf: order.subTotalChf,
  shippingCostChf: order.shippingCostChf,
  grandTotalChf: order.grandTotalChf,
  deliveryTimeSummary: order.deliveryTimeSummary,
  comment: order.comment,
  shippingAddress: order.shippingAddress,
});

/** Short order number shown to customers. */
export const formatOrderReference = (orderId: string): string => orderId.slice(0, 8).toUpperCase();
