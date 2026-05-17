import { handleStripeCheckoutWebhookEvent } from '@/lib/handle-stripe-checkout-webhook';
import { getStripe, getStripeWebhookSecret } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';

export const runtime = 'nodejs';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const body = await req.text();
    const stripe = getStripe();
    const webhookSecret = getStripeWebhookSecret();

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook signature verification failed';

    console.error('[stripe-webhook]', message);

    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    const result = await handleStripeCheckoutWebhookEvent(event);

    if (result.status === 'failed') {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

    return NextResponse.json({ received: true, status: result.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook handler failed';

    console.error('[stripe-webhook]', message);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
