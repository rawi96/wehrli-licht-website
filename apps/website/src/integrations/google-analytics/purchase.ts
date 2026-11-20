import type { CheckoutPurchase } from '@/domain/checkout/success-status';
import { trackEvent } from './gtag';

const TRACKED_KEY_PREFIX = 'wehrli-purchase-tracked:';

/**
 * Sends the GA4 purchase event once per order, even if the success page is
 * reloaded (GA also dedupes by transaction_id, this just avoids the noise).
 */
export const trackPurchaseOnce = (purchase: CheckoutPurchase) => {
  const key = `${TRACKED_KEY_PREFIX}${purchase.transactionId}`;

  try {
    if (window.localStorage.getItem(key)) {
      return;
    }
    window.localStorage.setItem(key, '1');
  } catch {
    // Storage blocked: track anyway, GA dedupes by transaction_id.
  }

  trackEvent('purchase', {
    transaction_id: purchase.transactionId,
    currency: 'CHF',
    value: purchase.valueChf,
    items: purchase.items.map((item) => ({
      item_name: item.name,
      quantity: item.quantity,
      price: item.priceChf,
    })),
  });
};
