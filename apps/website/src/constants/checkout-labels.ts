import { CheckoutPaymentMethod, CheckoutShippingMethod, CheckoutStep } from '@/types/checkout';

export const CHECKOUT_STEP_HEADINGS: Record<CheckoutStep, string> = {
  shipping: 'Versandart',
  details: 'Kontakt & Lieferung',
  payment: 'Zahlung',
  review: 'Bestellung prüfen',
};

export const CHECKOUT_SHIPPING_LABELS: Record<CheckoutShippingMethod, string> = {
  pickup: 'Abholung in Goldach',
  post: 'Versand per Post',
};

/** Name of the Stripe line item that carries the shipping cost (told apart from products by it). */
export const STRIPE_SHIPPING_LINE_NAME = CHECKOUT_SHIPPING_LABELS.post;

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

/** Titles in the checkout's progress indicator, in step order. */
export const CHECKOUT_STEP_TITLES: Record<CheckoutStep, string> = {
  shipping: 'Versand',
  details: 'Angaben',
  payment: 'Zahlung',
  review: 'Übersicht',
};
