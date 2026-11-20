import { handlePaymentWebhook } from '@/features/checkout/service';
import { NextRequest, NextResponse } from 'next/server';

// Webhook of the payment provider (URL registered in the Stripe dashboard).
export const runtime = 'nodejs';

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const result = await handlePaymentWebhook(await req.text(), req.headers);

    if (result.status === 'rejected') {
      console.error('[stripe-webhook]', result.message);

      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    if (result.status === 'failed') {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

    return NextResponse.json({ received: true, status: result.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook handler failed';

    console.error('[stripe-webhook]', message);

    return NextResponse.json({ error: message }, { status: 500 });
  }
};
