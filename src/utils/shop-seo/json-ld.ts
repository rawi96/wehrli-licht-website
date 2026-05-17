import { buildProductDescription, getProductOfferPrice, primaryCategory } from '@/utils/shop-seo/copy';
import type { ProductForSeo } from '@/utils/shop-seo/types';
import { getSiteUrl } from '@/utils/site-url';

const SITE_NAME = 'Wehrli Licht GmbH';
const DEFAULT_DESCRIPTION =
  'Wehrli Licht GmbH – Lichtberatung, Lichtplanung und hochwertige Leuchten in Goldach. Massgefertigte Lampenschirme und individuelle Lichtlösungen.';

const productOgImage = (product: ProductForSeo): string | undefined => {
  const image = product.images[0];

  return image?.responsiveImage?.src ?? image?.url ?? undefined;
};

export const buildProductJsonLd = (product: ProductForSeo): Record<string, unknown> => {
  const url = `${getSiteUrl()}/shop/produkte/${product.slug}`;
  const image = productOgImage(product);
  const price = getProductOfferPrice(product);
  const category = primaryCategory(product);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: product.name,
        description: buildProductDescription(product),
        sku: product.slug,
        mpn: product.slug,
        brand: {
          '@type': 'Brand',
          name: SITE_NAME,
        },
        ...(image ? { image: [image] } : {}),
        ...(category ? { category: category.name } : {}),
        ...(typeof price === 'number'
          ? {
              offers: {
                '@type': 'Offer',
                url,
                priceCurrency: 'CHF',
                price: price.toFixed(2),
                availability: 'https://schema.org/InStock',
                seller: {
                  '@type': 'Organization',
                  name: SITE_NAME,
                },
              },
            }
          : {}),
      },
    ],
  };
};

export const buildShopOrganizationJsonLd = (): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'LightingStore',
  name: SITE_NAME,
  url: getSiteUrl(),
  description: DEFAULT_DESCRIPTION,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Goldach',
    addressCountry: 'CH',
  },
});
