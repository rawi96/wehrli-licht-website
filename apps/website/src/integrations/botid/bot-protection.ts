import 'server-only';
import type { BotProtection } from '@/ports/bot-protection';
import { checkBotId } from 'botid/server';

/** Vercel BotID; the browser side is set up in src/instrumentation-client.ts. */
export const botIdProtection: BotProtection = {
  isBot: async () => (await checkBotId()).isBot,
};
