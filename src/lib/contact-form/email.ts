import { CHECKOUT_EMAIL_BRAND } from '@/constants/checkout-email-brand';
import { emailLayout } from '@/lib/checkout-order-email/layout';
import { escapeHtml } from '@/utils/text';
import { CONTACT_TOPICS, ContactFormValues } from './schema';

const { primary: brandColor } = CHECKOUT_EMAIL_BRAND;

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:6px 16px 6px 0;color:#666;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td>
    <td style="padding:6px 0;">${value}</td>
  </tr>`;

export const buildContactRequestEmail = (values: ContactFormValues, pageUrl: string | undefined) => {
  const topic = CONTACT_TOPICS[values.topic];
  const email = escapeHtml(values.email.trim());
  const phone = values.phone.trim();

  const body = `
    <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;margin:0 0 24px;">
      ${row('Anliegen', escapeHtml(topic))}
      ${row('Name', escapeHtml(values.name.trim()))}
      ${row('E-Mail', `<a href="mailto:${email}" style="color:${brandColor};">${email}</a>`)}
      ${phone ? row('Telefon', `<a href="tel:${escapeHtml(phone)}" style="color:${brandColor};">${escapeHtml(phone)}</a>`) : ''}
      ${pageUrl ? row('Gesendet von', escapeHtml(pageUrl)) : ''}
    </table>
    <div style="padding:16px;background:#f7f7f7;border-left:3px solid ${brandColor};font-size:14px;white-space:pre-wrap;">${escapeHtml(values.message.trim())}</div>
    <p style="margin:24px 0 0;font-size:13px;color:#666;">Mit «Antworten» geht Ihre Antwort direkt an ${escapeHtml(values.name.trim())}.</p>`;

  return {
    subject: `Kontaktanfrage: ${topic} – ${values.name.trim()}`,
    html: emailLayout('Neue Kontaktanfrage', body),
  };
};
