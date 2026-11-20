import { CHECKOUT_PAYMENT_LABELS } from '@/domain/checkout/labels';
import { CheckoutOrder, formatOrderReference } from '@/domain/checkout/order';
import { PREPAYMENT_BANK_DETAILS } from '@/domain/checkout/prepayment-bank-details';
import { EMAIL_BRAND } from '@/features/mail/brand';
import { emailLayout } from '@/features/mail/layout';
import { escapeHtml } from '@/utils/text';
import { renderLineItems, renderOrderDetails } from './sections';

const { surface: brandSurface, primary: brandColor } = EMAIL_BRAND;

type CheckoutOrderEmail = { subject: string; html: string };

export const buildCustomerOrderEmail = (order: CheckoutOrder): CheckoutOrderEmail => {
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

export const buildShopOrderEmail = (order: CheckoutOrder): CheckoutOrderEmail => {
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
