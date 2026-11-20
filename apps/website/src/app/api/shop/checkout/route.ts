import { CHECKOUT_API_ERROR_CODE, CheckoutRequestBody } from '@/features/checkout/schemas';
import { placeOrder } from '@/features/checkout/service';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const result = await placeOrder((await req.json()) as CheckoutRequestBody);

    if (result.ok) {
      return NextResponse.json({ type: 'redirect', url: result.redirectUrl });
    }

    if (result.error === 'email_failed') {
      return NextResponse.json({ code: CHECKOUT_API_ERROR_CODE.emailFailed }, { status: 500 });
    }

    return NextResponse.json({ error: result.error }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Checkout fehlgeschlagen.';

    return NextResponse.json({ error: message }, { status: 400 });
  }
};
