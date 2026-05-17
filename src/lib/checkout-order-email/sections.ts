import { CHECKOUT_EMAIL_BRAND } from '@/constants/checkout-email-brand';
import { CHECKOUT_PAYMENT_LABELS, CHECKOUT_SHIPPING_LABELS } from '@/constants/checkout-labels';
import { CheckoutOrderEmailData, formatOrderReference } from '@/types/checkout-order-email';
import { formatShippingAddress } from '@/utils/checkout-shipping-address';
import { formatShippingCostLabel } from '@/utils/product-commerce';
import { formatPriceToCHF } from '@/utils/price';
import { escapeHtml } from '@/utils/text';

const { primary: brandColor } = CHECKOUT_EMAIL_BRAND;

export const renderLineItems = (order: CheckoutOrderEmailData): string => {
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

  const shippingLabel = formatShippingCostLabel(order.shipping, order.shippingCostChf);

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
};

export const renderOrderDetails = (order: CheckoutOrderEmailData): string => {
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
};
