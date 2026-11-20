import { buildContactRequestEmail } from '@/lib/contact-form/email';
import {
  ContactFormValues,
  HONEYPOT_FIELD,
  MIN_FILL_TIME_MS,
  isContactTopic,
  validateContactForm,
} from '@/lib/contact-form/schema';
import { getShopNotificationEmails } from '@/lib/resend';
import { getSiteUrl } from '@/utils/site-url';
import { checkBotId } from 'botid/server';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

type ContactRequestBody = Partial<Record<keyof ContactFormValues | typeof HONEYPOT_FIELD | 'pagePath', unknown>> & {
  fillTimeMs?: unknown;
};

const asString = (value: unknown): string => (typeof value === 'string' ? value : '');

const getRecipients = (): string[] => {
  const contactEmails = (process.env.CONTACT_FORM_EMAIL ?? '')
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);

  return contactEmails.length > 0 ? contactEmails : getShopNotificationEmails();
};

/**
 * Bots get the same success answer as humans, so they cannot tell that they
 * were filtered out and adapt.
 */
const silentlyAccept = (reason: string) => {
  console.warn('[contact-form] spam rejected', { reason });

  return NextResponse.json({ ok: true });
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const verification = await checkBotId();
  if (verification.isBot) {
    return silentlyAccept('botid');
  }

  let body: ContactRequestBody;
  try {
    body = (await req.json()) as ContactRequestBody;
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  if (asString(body[HONEYPOT_FIELD])) {
    return silentlyAccept('honeypot');
  }

  if (typeof body.fillTimeMs !== 'number' || body.fillTimeMs < MIN_FILL_TIME_MS) {
    return silentlyAccept('too-fast');
  }

  const topic = asString(body.topic);
  const values: ContactFormValues = {
    name: asString(body.name),
    email: asString(body.email),
    phone: asString(body.phone),
    topic: isContactTopic(topic) ? topic : 'anderes',
    message: asString(body.message),
  };

  const fieldErrors = validateContactForm(values);
  if (!isContactTopic(topic)) {
    fieldErrors.topic = 'Bitte wählen Sie ein Anliegen.';
  }
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json({ error: 'Bitte prüfen Sie Ihre Angaben.', fieldErrors }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const recipients = getRecipients();

  if (!apiKey || !from || recipients.length === 0) {
    console.error('[contact-form] e-mail not configured (RESEND_API_KEY, RESEND_FROM_EMAIL, CONTACT_FORM_EMAIL)');

    return NextResponse.json({ error: 'Die Anfrage konnte nicht gesendet werden.' }, { status: 500 });
  }

  const pagePath = asString(body.pagePath);
  const pageUrl = pagePath.startsWith('/') && pagePath.length <= 300 ? `${getSiteUrl()}${pagePath}` : undefined;
  const email = buildContactRequestEmail(values, pageUrl);

  const { error } = await new Resend(apiKey).emails.send({
    from,
    to: recipients,
    replyTo: values.email.trim(),
    subject: email.subject,
    html: email.html,
  });

  if (error) {
    console.error('[contact-form] sending failed', { message: error.message });

    return NextResponse.json({ error: 'Die Anfrage konnte nicht gesendet werden.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
};
