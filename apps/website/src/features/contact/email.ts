import { EMAIL_BRAND } from '@/features/mail/brand';
import { emailLayout } from '@/features/mail/layout';
import { escapeHtml } from '@/lib/text';
import { ContactFormValues } from './schema';

const { primary: brandColor } = EMAIL_BRAND;

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:6px 16px 6px 0;color:#666;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td>
    <td style="padding:6px 0;">${value}</td>
  </tr>`;

export const buildContactRequestEmail = (values: ContactFormValues, pageUrl: string | undefined) => {
  const topic = values.topic.trim();
  const email = escapeHtml(values.email.trim());
  const phone = values.phone.trim();

  const body = `
    <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;margin:0 0 24px;">
      ${topic ? row('Anliegen', escapeHtml(topic)) : ''}
      ${row('Name', escapeHtml(values.name.trim()))}
      ${row('E-Mail', `<a href="mailto:${email}" style="color:${brandColor};">${email}</a>`)}
      ${phone ? row('Telefon', `<a href="tel:${escapeHtml(phone)}" style="color:${brandColor};">${escapeHtml(phone)}</a>`) : ''}
      ${pageUrl ? row('Gesendet von', escapeHtml(pageUrl)) : ''}
    </table>
    <div style="padding:16px;background:#f7f7f7;border-left:3px solid ${brandColor};font-size:14px;white-space:pre-wrap;">${escapeHtml(values.message.trim())}</div>
    <p style="margin:24px 0 0;font-size:13px;color:#666;">Mit «Antworten» geht Ihre Antwort direkt an ${escapeHtml(values.name.trim())}.</p>`;

  return {
    // Free-text values: keep the subject on one line.
    subject: (topic ? `Kontaktanfrage: ${topic} – ${values.name}` : `Kontaktanfrage – ${values.name}`)
      .replace(/\s+/g, ' ')
      .trim(),
    html: emailLayout('Neue Kontaktanfrage', body),
  };
};
