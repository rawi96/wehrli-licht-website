import 'server-only';
import { getContactRecipients } from '@/features/mail/recipients';
import { botProtection, mailer } from '@/integrations';
import { getSiteUrl } from '@/utils/site-url';
import { buildContactRequestEmail } from './email';
import { ContactFieldErrors, ContactFormValues, HONEYPOT_FIELD, MIN_FILL_TIME_MS, validateContactForm } from './schema';

export type ContactRequestResult =
  | { ok: true }
  | { ok: false; error: 'invalid_request' }
  | { ok: false; error: 'invalid_fields'; fieldErrors: ContactFieldErrors }
  | { ok: false; error: 'not_configured' }
  | { ok: false; error: 'send_failed' };

type ContactRequestBody = Partial<Record<keyof ContactFormValues | typeof HONEYPOT_FIELD | 'pagePath', unknown>> & {
  fillTimeMs?: unknown;
};

const asString = (value: unknown): string => (typeof value === 'string' ? value : '');

/**
 * Bots get the same success answer as humans, so they cannot tell that they
 * were filtered out and adapt.
 */
const silentlyAccept = (reason: string): ContactRequestResult => {
  console.warn('[contact-form] spam rejected', { reason });

  return { ok: true };
};

/**
 * Sends a contact request to the shop: bot check, spam traps (honeypot, fill time), validation, e-mail.
 * `parsed` is the JSON request body, or null if it is not JSON.
 */
export const submitContactRequest = async (parsed: unknown): Promise<ContactRequestResult> => {
  if (await botProtection.isBot()) {
    return silentlyAccept('botid');
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return { ok: false, error: 'invalid_request' };
  }
  const body = parsed as ContactRequestBody;

  if (asString(body[HONEYPOT_FIELD])) {
    return silentlyAccept('honeypot');
  }

  if (typeof body.fillTimeMs !== 'number' || body.fillTimeMs < MIN_FILL_TIME_MS) {
    return silentlyAccept('too-fast');
  }

  const values: ContactFormValues = {
    name: asString(body.name),
    email: asString(body.email),
    phone: asString(body.phone),
    topic: asString(body.topic),
    message: asString(body.message),
  };

  const fieldErrors = validateContactForm(values);
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: 'invalid_fields', fieldErrors };
  }

  const recipients = getContactRecipients();

  if (!mailer.isConfigured() || recipients.length === 0) {
    console.error('[contact-form] e-mail not configured (RESEND_API_KEY, RESEND_FROM_EMAIL, CONTACT_FORM_EMAIL)');

    return { ok: false, error: 'not_configured' };
  }

  const pagePath = asString(body.pagePath);
  const pageUrl = pagePath.startsWith('/') && pagePath.length <= 300 ? `${getSiteUrl()}${pagePath}` : undefined;
  const email = buildContactRequestEmail(values, pageUrl);

  const result = await mailer.send({
    to: recipients,
    replyTo: values.email.trim(),
    subject: email.subject,
    html: email.html,
  });

  if (!result.ok) {
    console.error('[contact-form] sending failed', { message: result.error });

    return { ok: false, error: 'send_failed' };
  }

  return { ok: true };
};
