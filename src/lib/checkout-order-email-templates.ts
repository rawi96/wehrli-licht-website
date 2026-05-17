import { CHECKOUT_EMAIL_BRAND, getCheckoutEmailLogoUrl, getCheckoutEmailSiteUrl } from '@/constants/checkout-email-brand';
import { CHECKOUT_PAYMENT_LABELS, CHECKOUT_SHIPPING_LABELS } from '@/constants/checkout-labels';
import { PREPAYMENT_BANK_DETAILS } from '@/constants/prepayment-bank-details';
import { CheckoutOrderEmailData, formatOrderReference } from '@/types/checkout-order-email';
import { formatShippingAddress } from '@/utils/checkout-shipping-address';
import { formatOrderShippingCostLabel } from '@/utils/product-commerce';
import { formatPriceToCHF } from '@/utils/price';

const { primary: brandColor, surface: brandSurface } = CHECKOUT_EMAIL_BRAND;

function escapeHtml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function renderLineItems(order: CheckoutOrderEmailData): string {
  const rows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">${escapeHtml(item.name)}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${escapeHtml(formatPriceToCHF(item.unitPriceChf * item.quantity))}</td>
        </tr>`,
    )
    .join('');

  const shippingLabel = formatOrderShippingCostLabel(order.shipping, order.shippingCostChf);

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
      <thead>
        <tr>
          <th align="left" style="padding:8px 0;border-bottom:2px solid ${brandColor};font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:${brandColor};">Artikel</th>
          <th align="center" style="padding:8px 0;border-bottom:2px solid ${brandColor};font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:${brandColor};">Anz.</th>
          <th align="right" style="padding:8px 0;border-bottom:2px solid ${brandColor};font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:${brandColor};">Preis</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
        <tr>
          <td colspan="2" style="padding:12px 0 4px;">Zwischentotal</td>
          <td align="right" style="padding:12px 0 4px;">${escapeHtml(formatPriceToCHF(order.subTotalChf))}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding:4px 0;">Versand</td>
          <td align="right" style="padding:4px 0;">${escapeHtml(shippingLabel)}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding:8px 0;font-weight:bold;font-size:16px;">Total</td>
          <td align="right" style="padding:8px 0;font-weight:bold;font-size:16px;">${escapeHtml(formatPriceToCHF(order.grandTotalChf))}</td>
        </tr>
      </tbody>
    </table>`;
}

function renderOrderDetails(order: CheckoutOrderEmailData): string {
  const customerName = `${order.customer.firstName} ${order.customer.lastName}`.trim();

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;margin:24px 0;">
      <tr><td style="padding:4px 0;color:#666;width:140px;">Bestell-Nr.</td><td style="padding:4px 0;font-family:monospace;">${escapeHtml(formatOrderReference(order.orderId))}</td></tr>
      <tr><td style="padding:4px 0;color:#666;">Name</td><td style="padding:4px 0;">${escapeHtml(customerName)}</td></tr>
      <tr><td style="padding:4px 0;color:#666;">E-Mail</td><td style="padding:4px 0;"><a href="mailto:${escapeHtml(order.customer.email)}">${escapeHtml(order.customer.email)}</a></td></tr>
      <tr><td style="padding:4px 0;color:#666;">Telefon</td><td style="padding:4px 0;">${escapeHtml(order.customer.phone)}</td></tr>
      <tr><td style="padding:4px 0;color:#666;">Versand</td><td style="padding:4px 0;">${escapeHtml(CHECKOUT_SHIPPING_LABELS[order.shipping])}</td></tr>
      ${
        order.deliveryTimeSummary
          ? `<tr><td style="padding:4px 0;color:#666;">Lieferzeit</td><td style="padding:4px 0;">${escapeHtml(order.deliveryTimeSummary)}</td></tr>`
          : ''
      }
      ${
        order.shipping === 'post' && order.shippingAddress
          ? `<tr><td style="padding:4px 0;color:#666;">Adresse</td><td style="padding:4px 0;">${escapeHtml(formatShippingAddress(order.shippingAddress))}</td></tr>`
          : ''
      }
      <tr><td style="padding:4px 0;color:#666;">Zahlung</td><td style="padding:4px 0;">${escapeHtml(CHECKOUT_PAYMENT_LABELS[order.paymentMethod].title)}</td></tr>
      ${
        order.comment
          ? `<tr><td style="padding:4px 0;color:#666;vertical-align:top;">Kommentar</td><td style="padding:4px 0;white-space:pre-wrap;">${escapeHtml(order.comment)}</td></tr>`
          : ''
      }
    </table>`;
}

function renderEmailHeader(): string {
  const logoUrl = getCheckoutEmailLogoUrl();
  const siteUrl = getCheckoutEmailSiteUrl();

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border-collapse:collapse;">
      <tr>
        <td style="padding:0 0 20px;border-bottom:3px solid ${brandColor};">
          <a href="${escapeHtml(siteUrl)}" style="text-decoration:none;">
            <img
              src="${escapeHtml(logoUrl)}"
              alt="Wehrli Licht GmbH"
              width="200"
              height="50"
              style="display:block;border:0;height:auto;max-width:200px;width:200px;"
            />
          </a>
        </td>
      </tr>
    </table>`;
}

function emailLayout(title: string, body: string): string {
  const siteUrl = getCheckoutEmailSiteUrl();

  return `<!DOCTYPE html>
<html lang="de">
  <body style="margin:0;padding:0;background:#f5f5f5;font-family:Helvetica,Arial,sans-serif;color:#1a1a1a;line-height:1.5;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;padding:32px;border-radius:4px;">
            <tr>
              <td>
                ${renderEmailHeader()}
                <h1 style="margin:0 0 24px;font-size:22px;line-height:1.3;color:${brandColor};">${escapeHtml(title)}</h1>
                ${body}
                <p style="margin:32px 0 0;padding-top:20px;border-top:1px solid #eee;font-size:13px;color:#666;">
                  <a href="${escapeHtml(siteUrl)}" style="color:${brandColor};text-decoration:none;font-weight:bold;">Wehrli Licht GmbH</a><br />
                  Blumenstrasse 66 · 9403 Goldach
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildCustomerOrderEmail(order: CheckoutOrderEmailData): { subject: string; html: string } {
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
}

export function buildShopOrderEmail(order: CheckoutOrderEmailData): { subject: string; html: string } {
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
}
