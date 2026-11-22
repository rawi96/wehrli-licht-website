import type { SiteTexts } from '../content/site-texts';
import type { CheckoutPaymentMethod, CheckoutShippingMethod } from './order';

/** Names and descriptions of shipping and payment options, maintained in DatoCMS («Texte & Beschriftungen»). */
export type CheckoutLabels = {
  shipping: Record<CheckoutShippingMethod, string>;
  /** Shown below the pickup option. */
  pickupDescription: string;
  payment: Record<CheckoutPaymentMethod, { title: string; description: string }>;
};

export const toCheckoutLabels = (texts: SiteTexts): CheckoutLabels => ({
  shipping: { pickup: texts.shippingPickupLabel, post: texts.shippingPostLabel },
  pickupDescription: texts.shippingPickupText,
  payment: {
    prepayment: { title: texts.paymentPrepaymentLabel, description: texts.paymentPrepaymentText },
    cash: { title: texts.paymentCashLabel, description: texts.paymentCashText },
    online: { title: texts.paymentOnlineLabel, description: texts.paymentOnlineText },
  },
});
