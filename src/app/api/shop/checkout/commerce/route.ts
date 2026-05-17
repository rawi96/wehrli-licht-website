import { fetchCheckoutCommerceMeta } from '@/utils/cart-checkout';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as { productIds?: string[] };

    if (!body.productIds?.length) {
      return NextResponse.json({ commerce: [] });
    }

    const commerce = await fetchCheckoutCommerceMeta(body.productIds);

    return NextResponse.json({ commerce });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Commerce-Daten konnten nicht geladen werden.';

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
