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

export const orderEmailDataFromSignedOrder = (order: SignedCheckoutOrder): CheckoutOrderEmailData => ({
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

export const formatOrderReference = (orderId: string): string => orderId.slice(0, 8).toUpperCase();
