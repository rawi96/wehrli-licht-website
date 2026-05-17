export const CHECKOUT_API_ERROR_CODE = {
  emailFailed: 'checkout_email_failed',
} as const;

export type CheckoutErrorAlertVariant = 'order_not_completed' | 'payment_received_no_email';

export const CHECKOUT_ERROR_ALERT_COPY: Record<CheckoutErrorAlertVariant, string> = {
  order_not_completed:
    'Die Bestellung konnte nicht abgeschlossen werden. Bitte melden Sie sich kurz über unsere Kontaktseite – wir erledigen den Rest.',
  payment_received_no_email:
    'Ihre Zahlung ist eingegangen, die Bestätigung per E-Mail hat jedoch nicht funktioniert. Bitte melden Sie sich kurz über unsere Kontaktseite.',
};
