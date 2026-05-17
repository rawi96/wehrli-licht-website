import { CheckoutOrderEmailData } from '@/types/checkout-order-email';

export function logCheckoutEmailFailure(
  context: string,
  technicalError: string | undefined,
  order: Pick<CheckoutOrderEmailData, 'orderId' | 'customer' | 'paymentMethod'>,
  extra?: Record<string, unknown>,
): void {
  console.error('[checkout-email]', {
    context,
    technicalError: technicalError ?? 'Unbekannter Fehler',
    orderId: order.orderId,
    customerEmail: order.customer.email,
    paymentMethod: order.paymentMethod,
    ...extra,
  });
}
