import { QuoteRequestBody } from '@/features/checkout/schemas';
import { quoteCart } from '@/features/checkout/service';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const result = await quoteCart((await req.json()) as QuoteRequestBody);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.quote);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Warenkorb konnte nicht geprüft werden.';

    return NextResponse.json({ error: message }, { status: 400 });
  }
};
