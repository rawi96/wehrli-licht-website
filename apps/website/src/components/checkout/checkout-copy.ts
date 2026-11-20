export type CheckoutStep = 'shipping' | 'details' | 'payment' | 'review';

export const CHECKOUT_STEP_HEADINGS: Record<CheckoutStep, string> = {
  shipping: 'Versandart',
  details: 'Kontakt & Lieferung',
  payment: 'Zahlung',
  review: 'Bestellung prüfen',
};

/** Titles in the checkout's progress indicator, in step order. */
export const CHECKOUT_STEP_TITLES: Record<CheckoutStep, string> = {
  shipping: 'Versand',
  details: 'Angaben',
  payment: 'Zahlung',
  review: 'Übersicht',
};

type CheckoutErrorAlertVariant = 'order_not_completed' | 'payment_received_no_email';

export const CHECKOUT_ERROR_ALERT_COPY: Record<CheckoutErrorAlertVariant, string> = {
  order_not_completed:
    'Die Bestellung konnte nicht abgeschlossen werden. Bitte melden Sie sich kurz über unsere Kontaktseite – wir erledigen den Rest.',
  payment_received_no_email:
    'Ihre Zahlung ist eingegangen, die Bestätigung per E-Mail hat jedoch nicht funktioniert. Bitte melden Sie sich kurz über unsere Kontaktseite.',
};
