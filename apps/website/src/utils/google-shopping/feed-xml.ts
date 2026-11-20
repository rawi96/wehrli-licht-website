import type { GoogleShoppingFeedItem } from '@/utils/google-shopping/types';
import { getSiteUrl } from '@/utils/site-url';
import { escapeXml } from '@/utils/text';

const GOOGLE_PRODUCT_CATEGORY = '594';
const BRAND = 'Wehrli Licht';

const formatPriceChf = (amount: number): string => `${amount.toFixed(2)} CHF`;

export const buildGoogleShoppingFeedXml = (items: GoogleShoppingFeedItem[]): string => {
  const siteUrl = getSiteUrl();
  const channelTitle = escapeXml('Wehrli Licht – Shop');
  const channelDescription = escapeXml('Leuchten und Lampen von Wehrli Licht GmbH, Goldach (Schweiz).');

  const itemXml = items
    .map((item) => {
      const shippingXml = `
      <g:shipping>
        <g:country>CH</g:country>
        <g:service>Standard</g:service>
        <g:price>${escapeXml(formatPriceChf(item.shippingCostChf))}</g:price>
      </g:shipping>`;

      const itemGroupXml = item.itemGroupId
        ? `\n      <g:item_group_id>${escapeXml(item.itemGroupId)}</g:item_group_id>`
        : '';

      const productTypeXml = item.productType
        ? `\n      <g:product_type>${escapeXml(item.productType)}</g:product_type>`
        : '';

      return `
    <item>
      <g:id>${escapeXml(item.id)}</g:id>${itemGroupXml}
      <g:title>${escapeXml(item.title)}</g:title>
      <g:description>${escapeXml(item.description)}</g:description>
      <g:link>${escapeXml(item.link)}</g:link>
      <g:image_link>${escapeXml(item.imageLink)}</g:image_link>
      <g:availability>in_stock</g:availability>
      <g:price>${escapeXml(formatPriceChf(item.priceChf))}</g:price>
      <g:brand>${escapeXml(BRAND)}</g:brand>
      <g:condition>new</g:condition>
      <g:identifier_exists>false</g:identifier_exists>
      <g:mpn>${escapeXml(item.mpn)}</g:mpn>
      <g:google_product_category>${GOOGLE_PRODUCT_CATEGORY}</g:google_product_category>${productTypeXml}${shippingXml}
    </item>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${channelTitle}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${channelDescription}</description>${itemXml}
  </channel>
</rss>`;
};
