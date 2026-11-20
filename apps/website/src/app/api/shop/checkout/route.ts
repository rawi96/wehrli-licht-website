import { CHECKOUT_API_ERROR_CODE } from '@/constants/checkout-errors';
import { logCheckoutEmailFailure } from '@/lib/checkout-email-log';
import { createStripeCheckoutSessionWithFallback, buildStripeLineItems } from '@/lib/shop-checkout-stripe';
import { isCheckoutEmailDelivered, sendCheckoutOrderEmails } from '@/lib/send-checkout-order-emails';
import { CheckoutRequestBody, CheckoutShippingAddress } from '@/types/checkout';
import { orderEmailDataFromSignedOrder } from '@/types/checkout-order-email';
import { validateCheckoutCustomer } from '@/utils/checkout-customer';
import { formatShippingAddress, validateShippingAddress } from '@/utils/checkout-shipping-address';
import { signCheckoutOrder } from '@/utils/checkout-order-token';
import { computeCheckoutTotals, fetchCheckoutCommerceMeta, verifyCheckoutCartItems } from '@/utils/cart-checkout';
import { summarizeDeliveryTimes } from '@/utils/product-commerce';
import { getSiteUrl } from '@/utils/site-url';
import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const assertValidCustomer = (customer: CheckoutRequestBody['customer']): void => {
  const error = validateCheckoutCustomer({
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phone: customer.phone,
  });

  if (error) {
    throw new Error(error);
  }
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const body = (await req.json()) as CheckoutRequestBody;

    if (!body.items?.length) {
      return NextResponse.json({ error: 'Der Warenkorb ist leer.' }, { status: 400 });
    }

    assertValidCustomer(body.customer);

    if (body.shipping !== 'pickup' && body.shipping !== 'post') {
      return NextResponse.json({ error: 'Bitte eine Versandart wählen.' }, { status: 400 });
    }

    let normalizedShippingAddress: CheckoutShippingAddress | undefined;

    if (body.shipping === 'post') {
      if (!body.shippingAddress) {
        return NextResponse.json({ error: 'Bitte die Lieferadresse angeben.' }, { status: 400 });
      }

      normalizedShippingAddress = {
        street: body.shippingAddress.street.trim(),
        postalCode: body.shippingAddress.postalCode.trim(),
        city: body.shippingAddress.city.trim(),
        country: 'CH',
      };

      const addressError = validateShippingAddress(normalizedShippingAddress);

      if (addressError) {
        return NextResponse.json({ error: addressError }, { status: 400 });
      }
    }

    const verifiedItems = await verifyCheckoutCartItems(body.items);
    const productIds = [...new Set(body.items.map((item) => item.productId))];
    const productCommerce = await fetchCheckoutCommerceMeta(productIds);
    const totals = computeCheckoutTotals(verifiedItems, body.shipping, productCommerce);
    const deliveryTimeSummary = summarizeDeliveryTimes(verifiedItems, productCommerce) ?? undefined;
    const siteUrl = getSiteUrl();
    const customerName = `${body.customer.firstName.trim()} ${body.customer.lastName.trim()}`;
    const comment = body.comment?.trim() ?? '';
    const orderId = randomUUID();

    const metadata: Record<string, string> = {
      order_id: orderId,
      source: 'shop',
      customer_name: customerName,
      customer_email: body.customer.email.trim(),
      customer_phone: body.customer.phone.trim(),
      shipping: body.shipping,
      payment_method: body.paymentMethod,
    };

    if (comment) {
      metadata.comment = comment.slice(0, 500);
    }

    if (deliveryTimeSummary) {
      metadata.delivery_time = deliveryTimeSummary.slice(0, 200);
    }

    if (normalizedShippingAddress) {
      metadata.shipping_address = formatShippingAddress(normalizedShippingAddress).slice(0, 500);
    }

    if (body.paymentMethod === 'online') {
      const session = await createStripeCheckoutSessionWithFallback({
        mode: 'payment',
        currency: 'chf',
        locale: 'de',
        customer_email: body.customer.email.trim(),
        line_items: buildStripeLineItems(verifiedItems, totals.shippingCostChf),
        success_url: `${siteUrl}/shop/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/shop/checkout/cancelled`,
        metadata,
      });

      if (!session.url) {
        return NextResponse.json({ error: 'Checkout konnte nicht gestartet werden.' }, { status: 400 });
      }

      return NextResponse.json({ type: 'redirect', url: session.url });
    }

    if (body.paymentMethod !== 'prepayment' && body.paymentMethod !== 'cash') {
      return NextResponse.json({ error: 'Ungültige Zahlungsart.' }, { status: 400 });
    }

    const signedOrder = {
      orderId,
      createdAt: Date.now(),
      customer: {
        firstName: body.customer.firstName.trim(),
        lastName: body.customer.lastName.trim(),
        email: body.customer.email.trim(),
        phone: body.customer.phone.trim(),
      },
      shipping: body.shipping,
      paymentMethod: body.paymentMethod,
      items: verifiedItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        unitPriceChf: item.unitPriceChf,
      })),
      subTotalChf: totals.subTotalChf,
      shippingCostChf: totals.shippingCostChf,
      grandTotalChf: totals.grandTotalChf,
      ...(deliveryTimeSummary ? { deliveryTimeSummary } : {}),
      ...(comment ? { comment } : {}),
      ...(normalizedShippingAddress ? { shippingAddress: normalizedShippingAddress } : {}),
    } as const;

    const orderEmailData = orderEmailDataFromSignedOrder(signedOrder);
    const emailResult = await sendCheckoutOrderEmails(orderEmailData);

    if (!isCheckoutEmailDelivered(emailResult)) {
      logCheckoutEmailFailure('manual checkout API', emailResult.message, orderEmailData, {
        skipped: emailResult.skipped,
      });

      return NextResponse.json({ code: CHECKOUT_API_ERROR_CODE.emailFailed }, { status: 500 });
    }

    const orderToken = signCheckoutOrder(signedOrder);

    return NextResponse.json({
      type: 'redirect',
      url: `${siteUrl}/shop/checkout/success?order_token=${encodeURIComponent(orderToken)}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Checkout fehlgeschlagen.';

    return NextResponse.json({ error: message }, { status: 400 });
  }
};
