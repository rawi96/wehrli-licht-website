import { CommerceRequestBody } from '@/features/checkout/schemas';
import { getCheckoutCommerce } from '@/features/checkout/service';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const body = (await req.json()) as CommerceRequestBody;
    const commerce = await getCheckoutCommerce(body.productIds ?? []);

    return NextResponse.json({ commerce });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Commerce-Daten konnten nicht geladen werden.';

    return NextResponse.json({ error: message }, { status: 400 });
  }
};
