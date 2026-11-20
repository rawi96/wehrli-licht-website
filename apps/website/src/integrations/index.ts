import 'server-only';
import type { BotProtection } from '@/ports/bot-protection';
import type { Catalog } from '@/ports/catalog';
import type { ContentSource } from '@/ports/content-source';
import type { Mailer } from '@/ports/mailer';
import type { PaymentProvider } from '@/ports/payment-provider';
import { botIdProtection } from './botid/bot-protection';
import { datocmsCatalog } from './datocms/catalog';
import { datocmsContent } from './datocms/content';
import { resendMailer } from './resend/mailer';
import { stripePayments } from './stripe/payments';

// Composition root: which integration implements which port. To replace a system, implement the port in a new
// folder under src/integrations and change the line here; nothing else in the app imports an integration directly.

export const content: ContentSource = datocmsContent;

export const catalog: Catalog = datocmsCatalog;

export const payments: PaymentProvider = stripePayments;

export const mailer: Mailer = resendMailer;

export const botProtection: BotProtection = botIdProtection;
