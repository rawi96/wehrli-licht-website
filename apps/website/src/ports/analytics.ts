import type { CheckoutPurchase } from '@/domain/checkout/success-status';
import type { FC } from 'react';

/** The visitor's choice in the cookie banner. */
export type ConsentChoice = 'granted' | 'denied';

/** Web analytics and ad conversion tracking in the browser (today Google Analytics 4 and Google Ads). */
export type Analytics = {
  /** False where tracking is not configured (local, previews): no banner, no scripts. */
  isEnabled: boolean;
  /** Script tags for <head> that load the tracker with the visitor's consent defaults. Renders nothing when disabled. */
  HeadScripts: FC;
  /** Sends an event. No-op when tracking is disabled. */
  trackEvent(name: string, params?: Record<string, unknown>): void;
  /** Sends the purchase of a completed order, once per order even if the success page is reloaded. */
  trackPurchase(purchase: CheckoutPurchase): void;
  /** Hands a lead's e-mail address to the tracker for conversion matching, only with ad consent. */
  setLeadEmail(email: string): void;
  /** The stored banner choice, or null if the visitor has not chosen yet. */
  readConsent(): ConsentChoice | null;
  /** Stores the banner choice and applies it to the tracker. */
  applyConsent(choice: ConsentChoice): void;
};
