/** Tells bots from humans on protected endpoints (today Vercel BotID). */
export type BotProtection = {
  /** Whether the current request comes from a bot. Call it inside a route handler or Server Action. */
  isBot(): Promise<boolean>;
};
