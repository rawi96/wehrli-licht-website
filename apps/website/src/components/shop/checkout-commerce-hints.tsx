import { ProductCommerceMeta, summarizeDeliveryTimes } from '@/utils/product-commerce';

type Props = {
  lineItems: { productId: string }[];
  productCommerce: ProductCommerceMeta[];
};

export const CheckoutCommerceHints = ({ lineItems, productCommerce }: Props) => {
  const deliverySummary = summarizeDeliveryTimes(lineItems, productCommerce);

  if (!deliverySummary) {
    return null;
  }

  return <p className="mt-4 text-sm text-gray-500">Lieferzeit: {deliverySummary}</p>;
};
