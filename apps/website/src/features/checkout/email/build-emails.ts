import type { SiteTexts } from '@/domain/content/site-texts';
import { toCheckoutLabels } from '@/domain/checkout/labels';
import { CheckoutOrder, formatOrderReference } from '@/domain/checkout/order';
import { EMAIL_BRAND } from '@/features/mail/brand';
import { emailLayout } from '@/features/mail/layout';
import type { EmailSender } from '@/features/mail/sender';
import { escapeHtml } from '@/lib/text';
import { renderLineItems, renderOrderDetails } from './sections';

const { surface: brandSurface, primary: brandColor } = EMAIL_BRAND;

type CheckoutOrderEmail = { subject: string; html: string };

/** Texts from DatoCMS and the sender in the footer. */
type EmailContext = { texts: SiteTexts; sender: EmailSender };

export const buildCustomerOrderEmail = (order: CheckoutOrder, { texts, sender }: EmailContext): CheckoutOrderEmail => {
  const reference = formatOrderReference(order.orderId);
  const labels = toCheckoutLabels(texts);
  const payment = labels.payment[order.paymentMethod];

  let paymentNote = `<p style="margin:0 0 16px;">Zahlungsart: <strong>${escapeHtml(payment.title)}</strong></p>`;

  if (order.paymentMethod === 'prepayment') {
    paymentNote += `
      <p style="margin:0 0 8px;">${escapeHtml(texts.orderEmailPrepayment)}</p>${
        texts.bankDetails
          ? `
      <pre style="margin:0 0 16px;padding:16px;background:${brandSurface};border-left:4px solid ${brandColor};font-family:inherit;font-size:13px;white-space:pre-wrap;border-radius:4px;">${escapeHtml(texts.bankDetails)}</pre>`
          : ''
      }`;
  } else if (order.paymentMethod === 'cash') {
    paymentNote += `<p style="margin:0 0 16px;">${escapeHtml(texts.orderEmailCash)}</p>`;
  } else {
    paymentNote += `<p style="margin:0 0 16px;">${escapeHtml(texts.orderEmailOnline)}</p>`;
  }

  const body = `
    <p style="margin:0 0 16px;">Guten Tag ${escapeHtml(order.customer.firstName)}</p>
    <p style="margin:0 0 24px;">${escapeHtml(texts.orderEmailIntro)}</p>
    ${paymentNote}
    ${renderOrderDetails(order, toCheckoutLabels(texts))}
    ${renderLineItems(order)}`;

  return {
    subject: `Bestellbestätigung ${reference} – Wehrli Licht`,
    html: emailLayout('Bestellung erhalten', body, sender),
  };
};

export const buildShopOrderEmail = (order: CheckoutOrder, { texts, sender }: EmailContext): CheckoutOrderEmail => {
  const reference = formatOrderReference(order.orderId);
  const customerName = `${order.customer.firstName} ${order.customer.lastName}`.trim();

  const body = `
    <p style="margin:0 0 16px;">Neue Bestellung von <strong>${escapeHtml(customerName)}</strong> (${escapeHtml(order.customer.email)}).</p>
    ${renderOrderDetails(order, toCheckoutLabels(texts))}
    ${renderLineItems(order)}`;

  return {
    subject: `Neue Shop-Bestellung ${reference}`,
    html: emailLayout('Neue Bestellung im Shop', body, sender),
  };
};
