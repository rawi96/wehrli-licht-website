import type { CheckoutPaymentMethod, CheckoutShippingMethod } from './order';

export const CHECKOUT_SHIPPING_LABELS: Record<CheckoutShippingMethod, string> = {
  pickup: 'Abholung in Goldach',
  post: 'Versand per Post',
};

export const CHECKOUT_PAYMENT_LABELS: Record<CheckoutPaymentMethod, { title: string; description: string }> = {
  prepayment: {
    title: 'Vorauskasse',
    description: 'Überweisung vor Lieferung oder Abholung',
  },
  cash: {
    title: 'Bezahlung vor Ort',
    description: 'Bar oder mit Karte bei Abholung in Goldach',
  },
  online: {
    title: 'Online bezahlen',
    description: 'Karte, TWINT, Apple Pay und weitere Methoden',
  },
};
