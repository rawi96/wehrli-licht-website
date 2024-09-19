import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

type BodyType = {
  event_type: 'create' | 'update' | 'delete' | 'publish' | 'unpublish';
  entity_slug: string;
  item_type: string;
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  const token = req.nextUrl.searchParams.get('token');

  if (token !== process.env.CACHE_INVALIDATION_SECRET_TOKEN) {
    return NextResponse.json({ status: 401, body: { error: 'Invalid Token' } });
  }

  try {
    const { entity_slug, item_type } = (await req.json()) as BodyType;

    // Revalidate single pages and projects
    if (item_type === 'page') {
      if (entity_slug === 'home') {
        revalidatePath('/');
      } else {
        revalidatePath(`/${entity_slug}`);
      }
    }
  } catch (error: unknown) {
    return NextResponse.json({
      status: 500,
      body: { message: 'Failed to clear the cache', error },
    });
  }

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
