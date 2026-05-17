import { CHECKOUT_EMAIL_BRAND } from '@/constants/checkout-email-brand';
import { CHECKOUT_PAYMENT_LABELS } from '@/constants/checkout-labels';
import { PREPAYMENT_BANK_DETAILS } from '@/constants/prepayment-bank-details';
import { emailLayout } from '@/lib/checkout-order-email/layout';
import { renderLineItems, renderOrderDetails } from '@/lib/checkout-order-email/sections';
import { CheckoutOrderEmailData, formatOrderReference } from '@/types/checkout-order-email';
import { escapeHtml } from '@/utils/text';

const { surface: brandSurface, primary: brandColor } = CHECKOUT_EMAIL_BRAND;

export type CheckoutOrderEmail = { subject: string; html: string };

export const buildCustomerOrderEmail = (order: CheckoutOrderEmailData): CheckoutOrderEmail => {
  const reference = formatOrderReference(order.orderId);
  const payment = CHECKOUT_PAYMENT_LABELS[order.paymentMethod];

  let paymentNote = `<p style="margin:0 0 16px;">Zahlungsart: <strong>${escapeHtml(payment.title)}</strong></p>`;

  if (order.paymentMethod === 'prepayment') {
    paymentNote += `
      <p style="margin:0 0 8px;">Bitte überweisen Sie den Betrag vor Lieferung oder Abholung:</p>
      <pre style="margin:0 0 16px;padding:16px;background:${brandSurface};border-left:4px solid ${brandColor};font-family:inherit;font-size:13px;white-space:pre-wrap;border-radius:4px;">${escapeHtml(PREPAYMENT_BANK_DETAILS)}</pre>`;
  } else if (order.paymentMethod === 'cash') {
    paymentNote += `<p style="margin:0 0 16px;">Bezahlung bei Abholung in Goldach (bar oder mit Karte).</p>`;
  } else {
    paymentNote += `<p style="margin:0 0 16px;">Ihre Zahlung wurde erfolgreich entgegengenommen.</p>`;
  }

  const body = `
    <p style="margin:0 0 16px;">Guten Tag ${escapeHtml(order.customer.firstName)}</p>
    <p style="margin:0 0 24px;">vielen Dank für Ihre Bestellung. Wir haben diese erhalten und melden uns bei Rückfragen.</p>
    ${paymentNote}
    ${renderOrderDetails(order)}
    ${renderLineItems(order)}`;

  return {
    subject: `Bestellbestätigung ${reference} – Wehrli Licht`,
    html: emailLayout('Bestellung erhalten', body),
  };
};

export const buildShopOrderEmail = (order: CheckoutOrderEmailData): CheckoutOrderEmail => {
  const reference = formatOrderReference(order.orderId);
  const customerName = `${order.customer.firstName} ${order.customer.lastName}`.trim();

  const body = `
    <p style="margin:0 0 16px;">Neue Bestellung von <strong>${escapeHtml(customerName)}</strong> (${escapeHtml(order.customer.email)}).</p>
    ${renderOrderDetails(order)}
    ${renderLineItems(order)}`;

  return {
    subject: `Neue Shop-Bestellung ${reference}`,
    html: emailLayout('Neue Bestellung im Shop', body),
  };
};
