import { DatoWebhookPayload, revalidateFromDatoWebhook } from '@/lib/revalidate-dato-webhook';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const token = req.nextUrl.searchParams.get('token');

  if (token !== process.env.CACHE_INVALIDATION_SECRET_TOKEN) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const payload = (await req.json()) as DatoWebhookPayload;
    const paths = revalidateFromDatoWebhook(payload);

    return NextResponse.json({
      revalidated: true,
      paths,
      model: payload.item_type ?? null,
      event_type: payload.event_type ?? null,
      now: Date.now(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to revalidate cache';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
