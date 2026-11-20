/** An e-mail to send. Without `from`, the mailer's configured sender is used. */
export type MailMessage = {
  to: string | string[];
  from?: string;
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
  /** Sending the same key twice delivers the e-mail once (retries, webhooks). */
  idempotencyKey?: string;
};

export type MailResult = { ok: true } | { ok: false; error: string };

/** Sends e-mails (today Resend). */
export type Mailer = {
  /** False when the mailer lacks its credentials or sender; nothing can be sent then. */
  isConfigured(): boolean;
  /** Expected delivery failures are a result; unexpected ones (network) throw. */
  send(message: MailMessage): Promise<MailResult>;
};
