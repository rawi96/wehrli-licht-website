import { buildGoogleShoppingFeedXml, getAllGoogleShoppingFeedItems } from '@/utils/google-shopping';

export const revalidate = 3600;

export const GET = async (): Promise<Response> => {
  const items = await getAllGoogleShoppingFeedItems();
  const xml = buildGoogleShoppingFeedXml(items);

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
};
