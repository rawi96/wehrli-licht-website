import { getGoogleShoppingFeedXml } from '@/features/google-shopping/service';

export const revalidate = 3600;

export const GET = async (): Promise<Response> =>
  new Response(await getGoogleShoppingFeedXml(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
