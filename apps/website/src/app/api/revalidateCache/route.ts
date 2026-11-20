import { content } from '@/integrations';
import { NextRequest, NextResponse } from 'next/server';

/** Webhook of the CMS: revalidates the pages affected by a change. */
export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const token = req.nextUrl.searchParams.get('token');

  if (token !== process.env.CACHE_INVALIDATION_SECRET_TOKEN) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const { paths, model, eventType } = content.revalidateChangedContent(await req.json());

    return NextResponse.json({
      revalidated: true,
      paths,
      model,
      event_type: eventType,
      now: Date.now(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to revalidate cache';

    return NextResponse.json({ error: message }, { status: 500 });
  }
};
