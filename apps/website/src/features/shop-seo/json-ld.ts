import { SITE_NAME } from '@/constants/site';
import type { Category } from '@/domain/shop/category';
import { imageUrl } from '@/domain/shop/image';
import type { Product, ProductSummary } from '@/domain/shop/product';
import { buildCategoryDescription, buildProductDescription, getProductOfferPrice, primaryCategory } from '@/domain/shop/seo';
import { getSiteUrl } from '@/utils/site-url';

// Structured data (schema.org JSON-LD) of the shop's pages.

/**
 * The business is described once, site-wide (components/seo/site-json-ld.tsx).
 * Shop structured data only references it, so search engines see a single entity.
 */
const businessRef = () => ({ '@id': `${getSiteUrl()}/#business` });
const websiteRef = () => ({ '@id': `${getSiteUrl()}/#website` });

export const buildProductJsonLd = (product: Product): Record<string, unknown> => {
  const url = `${getSiteUrl()}/shop/produkte/${product.slug}`;
  const image = imageUrl(product.images[0]);
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
                seller: businessRef(),
              },
            }
          : {}),
      },
    ],
  };
};

export const buildCategoryJsonLd = (category: Category, products: ProductSummary[]): Record<string, unknown> => {
  const url = `${getSiteUrl()}/shop/kategorien/${category.slug}`;
  const image = imageUrl(category.image);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: category.name,
        description: buildCategoryDescription(category),
        url,
        ...(image ? { image: [image] } : {}),
        isPartOf: websiteRef(),
      },
      {
        '@type': 'ItemList',
        name: `${category.name} – Produkte`,
        numberOfItems: products.length,
        itemListElement: products.map((product, index) => {
          const productUrl = `${getSiteUrl()}/shop/produkte/${product.slug}`;
          const productImage = imageUrl(product.image);

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

export const buildAllProductsJsonLd = (products: ProductSummary[]): Record<string, unknown> => {
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
        isPartOf: websiteRef(),
      },
      {
        '@type': 'ItemList',
        name: 'Alle Leuchten im Shop',
        numberOfItems: products.length,
        itemListElement: products.map((product, index) => {
          const productUrl = `${getSiteUrl()}/shop/produkte/${product.slug}`;
          const productImage = imageUrl(product.image);

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

export const buildShopStorefrontFaqJsonLd = (
  items: { question: string; answer: string }[],
): Record<string, unknown> | null => {
  if (items.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
};

export const buildShopIndexJsonLd = (
  categories: Pick<Category, 'name' | 'slug'>[],
  featuredProducts: Pick<ProductSummary, 'name' | 'slug'>[] = [],
): Record<string, unknown> => {
  const url = `${getSiteUrl()}/shop`;
  const shopDescription =
    'Leuchten online kaufen bei Wehrli Licht in Goldach: Pendelleuchten, Deckenleuchten, Wandleuchten und Tischleuchten. Massgefertigte Lampenschirme nach Mass, Lichtberatung und Lichtplanung in der Schweiz.';

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'CollectionPage',
      name: 'Leuchten Shop | Lampenschirme nach Mass | Wehrli Licht',
      description: shopDescription,
      url,
      isPartOf: websiteRef(),
      provider: businessRef(),
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
