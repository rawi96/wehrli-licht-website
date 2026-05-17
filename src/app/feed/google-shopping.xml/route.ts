import { buildGoogleShoppingFeedXml, getAllGoogleShoppingFeedItems } from '@/utils/google-shopping-feed';

import { CONTENT_REVALIDATE_SECONDS } from '@/constants/cache-revalidation';

export const revalidate = CONTENT_REVALIDATE_SECONDS;

export async function GET() {
  const items = await getAllGoogleShoppingFeedItems();
  const xml = buildGoogleShoppingFeedXml(items);

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
