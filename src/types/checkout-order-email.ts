import {
  CheckoutCustomer,
  CheckoutOrderItem,
  CheckoutPaymentMethod,
  CheckoutShippingAddress,
  CheckoutShippingMethod,
  SignedCheckoutOrder,
} from '@/types/checkout';

export type CheckoutOrderEmailData = {
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

export function orderEmailDataFromSignedOrder(order: SignedCheckoutOrder): CheckoutOrderEmailData {
  return {
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
  };
}

export function formatOrderReference(orderId: string): string {
  return orderId.slice(0, 8).toUpperCase();
}
