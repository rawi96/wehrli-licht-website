import { CheckoutShippingMethod } from '@/types/checkout';
import {
  CheckoutCartItemPayload,
  computeCheckoutTotals,
  fetchCheckoutCommerceMeta,
  verifyCheckoutCartItems,
} from '@/utils/cart-checkout';
import { summarizeDeliveryTimes } from '@/utils/product-commerce';
import { NextRequest, NextResponse } from 'next/server';

type QuoteRequestBody = {
  items?: CheckoutCartItemPayload[];
  shipping?: CheckoutShippingMethod;
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as QuoteRequestBody;

    if (!body.items?.length) {
      return NextResponse.json({ error: 'Der Warenkorb ist leer.' }, { status: 400 });
    }

    if (body.shipping !== 'pickup' && body.shipping !== 'post') {
      return NextResponse.json({ error: 'Bitte eine Versandart wählen.' }, { status: 400 });
    }

    const verifiedItems = await verifyCheckoutCartItems(body.items);
    const productIds = [...new Set(body.items.map((item) => item.productId))];
    const productCommerce = await fetchCheckoutCommerceMeta(productIds);
    const totals = computeCheckoutTotals(verifiedItems, body.shipping, productCommerce);

    const deliveryTimeSummary = summarizeDeliveryTimes(verifiedItems, productCommerce) ?? undefined;

    return NextResponse.json({
      lines: verifiedItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        unitPriceChf: item.unitPriceChf,
      })),
      totals,
      deliveryTimeSummary,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Warenkorb konnte nicht geprüft werden.';

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
