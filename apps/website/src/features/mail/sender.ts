import 'server-only';
import { content } from '@/integrations';
import { SITE_NAME } from '@/lib/site';

/** Company name and address in the footer of every e-mail. */
export type EmailSender = { companyName: string; address: string | null };

/** From «Kopf- & Fusszeile» in DatoCMS; the company name alone if the address is not available. */
export const getEmailSender = async (): Promise<EmailSender> => {
  try {
    const { contact } = await content.getSiteLayout();
    const place = [contact.zip, contact.place].filter(Boolean).join(' ');

    return {
      companyName: contact.companyName?.trim() ? contact.companyName.trim() : SITE_NAME,
      address: contact.street || place ? [contact.street, place].filter(Boolean).join(' · ') : null,
    };
  } catch {
    return { companyName: SITE_NAME, address: null };
  }
};
