import { getStripe } from '@/lib/stripe';
import { CheckoutOrderEmailData } from '@/types/checkout-order-email';
import { CheckoutCustomer, CheckoutOrderItem, CheckoutShippingAddress, CheckoutShippingMethod } from '@/types/checkout';

const SHIPPING_LINE_NAME = 'Versand per Post';

const parseShippingMethod = (value: string | undefined): CheckoutShippingMethod => (value === 'post' ? 'post' : 'pickup');

const parseCustomerName = (fullName: string): Pick<CheckoutCustomer, 'firstName' | 'lastName'> => {
  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 0) {
    return { firstName: '', lastName: '' };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
};

const parseShippingAddress = (metadataAddress: string | undefined): CheckoutShippingAddress | undefined => {
  if (!metadataAddress) {
    return undefined;
  }

  const match = metadataAddress.match(/^(.+),\s*(\d{4})\s+(.+),\s*Schweiz$/);

  if (!match) {
    return undefined;
  }

  return {
    street: match[1].trim(),
    postalCode: match[2],
    city: match[3].trim(),
    country: 'CH',
  };
};

export const loadCheckoutOrderEmailDataFromStripe = async (sessionId: string): Promise<CheckoutOrderEmailData | null> => {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== 'paid') {
    return null;
  }

  const metadata = session.metadata ?? {};
  const customerEmail = session.customer_email ?? metadata.customer_email;

  if (!customerEmail) {
    return null;
  }

  const lineItemsResponse = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 100 });
  const items: CheckoutOrderItem[] = [];
  let shippingCostChf = 0;

  for (const line of lineItemsResponse.data) {
    const name =
      line.description ??
      (typeof line.price?.product === 'object' && line.price.product && 'name' in line.price.product
        ? String(line.price.product.name)
        : 'Artikel');
    const quantity = line.quantity ?? 1;
    const lineTotalChf = (line.amount_total ?? 0) / 100;

    if (name === SHIPPING_LINE_NAME) {
      shippingCostChf = lineTotalChf;

      continue;
    }

    items.push({
      productId: line.id,
      name,
      quantity,
      unitPriceChf: lineTotalChf / quantity,
    });
  }

  const subTotalChf = items.reduce((sum, item) => sum + item.unitPriceChf * item.quantity, 0);
  const grandTotalChf = (session.amount_total ?? 0) / 100;
  const customerName = metadata.customer_name ?? session.customer_details?.name ?? '';
  const { firstName, lastName } = parseCustomerName(customerName);
  const shipping = parseShippingMethod(metadata.shipping);
  const shippingAddressRaw = metadata.shipping_address;

  return {
    orderId: metadata.order_id ?? sessionId,
    customer: {
      firstName,
      lastName,
      email: customerEmail,
      phone: metadata.customer_phone ?? session.customer_details?.phone ?? '',
    },
    shipping,
    paymentMethod: 'online',
    items,
    subTotalChf,
    shippingCostChf,
    grandTotalChf,
    comment: metadata.comment || undefined,
    deliveryTimeSummary: metadata.delivery_time || undefined,
    shippingAddress:
      shipping === 'post' && shippingAddressRaw
        ? (parseShippingAddress(shippingAddressRaw) ?? {
            street: shippingAddressRaw,
            postalCode: '',
            city: '',
            country: 'CH',
          })
        : undefined,
  };
};
