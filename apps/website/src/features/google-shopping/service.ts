import 'server-only';
import { catalog } from '@/integrations';
import { getSiteUrl } from '@/lib/site-url';
import { productToFeedItems } from './feed-items';
import { buildGoogleShoppingFeedXml } from './feed-xml';

/** The Google Shopping feed (RSS 2.0 with the `g:` namespace) of all products that may be indexed. */
export const getGoogleShoppingFeedXml = async (): Promise<string> => {
  const siteUrl = getSiteUrl();
  const products = await catalog.listFeedProducts();

  return buildGoogleShoppingFeedXml(products.flatMap((product) => productToFeedItems(product, siteUrl)));
};
