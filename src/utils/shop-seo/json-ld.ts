import {
  buildCategoryDescription,
  buildProductDescription,
  getProductOfferPrice,
  primaryCategory,
} from '@/utils/shop-seo/copy';
import type { CategoryForSeo, ProductForSeo, ProductListItemForSeo } from '@/utils/shop-seo/types';
import { getSiteUrl } from '@/utils/site-url';

const SITE_NAME = 'Wehrli Licht GmbH';
const DEFAULT_DESCRIPTION =
  'Wehrli Licht GmbH – Lichtberatung, Lichtplanung und hochwertige Leuchten in Goldach. Massgefertigte Lampenschirme und individuelle Lichtlösungen.';

const productOgImage = (product: Pick<ProductForSeo, 'images'>): string | undefined => {
  const image = product.images[0];

  return image?.responsiveImage?.src ?? image?.url ?? undefined;
};

const categoryOgImage = (category: CategoryForSeo): string | undefined => {
  const image = category.image;

  return image?.responsiveImage?.src ?? image?.url ?? undefined;
};

const shopOrganizationNode = () => ({
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
        url,
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
  ...shopOrganizationNode(),
});

export const buildCategoryJsonLd = (
  category: CategoryForSeo,
  products: ProductListItemForSeo[],
): Record<string, unknown> => {
  const url = `${getSiteUrl()}/shop/kategorien/${category.slug}`;
  const image = categoryOgImage(category);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: category.name,
        description: buildCategoryDescription(category),
        url,
        ...(image ? { image: [image] } : {}),
        isPartOf: {
          '@type': 'WebSite',
          name: SITE_NAME,
          url: getSiteUrl(),
        },
      },
      {
        '@type': 'ItemList',
        name: `${category.name} – Produkte`,
        numberOfItems: products.length,
        itemListElement: products.map((product, index) => {
          const productUrl = `${getSiteUrl()}/shop/produkte/${product.slug}`;
          const productImage = productOgImage(product);

          return {
            '@type': 'ListItem',
            position: index + 1,
            name: product.name,
            url: productUrl,
            item: {
              '@type': 'Product',
              name: product.name,
              url: productUrl,
              ...(productImage ? { image: [productImage] } : {}),
            },
          };
        }),
      },
    ],
  };
};

export const buildAllProductsJsonLd = (products: ProductListItemForSeo[]): Record<string, unknown> => {
  const url = `${getSiteUrl()}/shop/alle-leuchten`;
  const description =
    'Alle Leuchten im Online-Shop von Wehrli Licht: Pendelleuchten, Deckenleuchten, Wandleuchten und Tischleuchten.';

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: 'Alle Leuchten',
        description,
        url,
        isPartOf: {
          '@type': 'WebSite',
          name: SITE_NAME,
          url: getSiteUrl(),
        },
      },
      {
        '@type': 'ItemList',
        name: 'Alle Leuchten im Shop',
        numberOfItems: products.length,
        itemListElement: products.map((product, index) => {
          const productUrl = `${getSiteUrl()}/shop/produkte/${product.slug}`;
          const productImage = productOgImage(product);

          return {
            '@type': 'ListItem',
            position: index + 1,
            name: product.name,
            url: productUrl,
            item: {
              '@type': 'Product',
              name: product.name,
              url: productUrl,
              ...(productImage ? { image: [productImage] } : {}),
            },
          };
        }),
      },
    ],
  };
};

type ShopFaqItem = {
  title: string;
  description: string;
};

export const buildShopStorefrontFaqJsonLd = (items: ShopFaqItem[]): Record<string, unknown> | null => {
  if (items.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.title,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.description,
      },
    })),
  };
};

export const buildShopIndexJsonLd = (
  categories: Pick<CategoryForSeo, 'name' | 'slug'>[],
  featuredProducts: ProductListItemForSeo[] = [],
): Record<string, unknown> => {
  const url = `${getSiteUrl()}/shop`;
  const shopDescription =
    'Leuchten online kaufen bei Wehrli Licht in Goldach: Pendelleuchten, Deckenleuchten, Wandleuchten und Tischleuchten. Massgefertigte Lampenschirme nach Mass, Lichtberatung und Lichtplanung in der Schweiz.';

  const graph: Record<string, unknown>[] = [
    shopOrganizationNode(),
    {
      '@type': 'CollectionPage',
      name: 'Leuchten Shop | Lampenschirme nach Mass | Wehrli Licht',
      description: shopDescription,
      url,
      isPartOf: {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: getSiteUrl(),
      },
    },
    {
      '@type': 'ItemList',
      name: 'Leuchten-Kategorien',
      numberOfItems: categories.length,
      itemListElement: categories.map((category, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: category.name,
        url: `${getSiteUrl()}/shop/kategorien/${category.slug}`,
      })),
    },
  ];

  if (featuredProducts.length > 0) {
    graph.push({
      '@type': 'ItemList',
      name: 'Auswahl Leuchten im Shop',
      numberOfItems: featuredProducts.length,
      itemListElement: featuredProducts.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: product.name,
        url: `${getSiteUrl()}/shop/produkte/${product.slug}`,
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
};
