import 'server-only';
import type { Mailer } from '@/ports/mailer';
import { Resend } from 'resend';

const getConfig = (): { apiKey: string; from: string } | null => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  return apiKey && from ? { apiKey, from } : null;
};

export const resendMailer: Mailer = {
  isConfigured: () => getConfig() !== null,

  send: async ({ to, from, replyTo, subject, html, text, idempotencyKey }) => {
    const config = getConfig();

    if (!config) {
      return { ok: false, error: 'E-Mail-Versand nicht konfiguriert (RESEND_API_KEY, RESEND_FROM_EMAIL)' };
    }

    const { error } = await new Resend(config.apiKey).emails.send({
      from: from ?? config.from,
      to,
      ...(replyTo ? { replyTo } : {}),
      subject,
      html,
      ...(text ? { text } : {}),
      ...(idempotencyKey ? { headers: { 'Idempotency-Key': idempotencyKey } } : {}),
    });

    return error ? { ok: false, error: error.message } : { ok: true };
  },
};
