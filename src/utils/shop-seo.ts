import { ShopCategory, ShopProduct } from '@/utils/shop';
import { getSiteUrl } from '@/utils/site-url';
import type { Metadata } from 'next';

const SITE_NAME = 'Wehrli Licht GmbH';
const DEFAULT_DESCRIPTION =
  'Wehrli Licht GmbH – Lichtberatung, Lichtplanung und hochwertige Leuchten in Goldach. Massgefertigte Lampenschirme und individuelle Lichtlösungen.';

type ProductForSeo = Pick<
  ShopProduct,
  | 'name'
  | 'slug'
  | 'seoTitle'
  | 'seoDescription'
  | 'seoNoindex'
  | 'description'
  | 'images'
  | 'categories'
  | 'price'
  | 'variants'
  | 'power'
  | 'brightness'
  | 'lightColor'
  | 'deliveryTime'
  | 'dimmable'
>;

type CategoryForSeo = Pick<
  ShopCategory,
  'name' | 'slug' | 'seoTitle' | 'seoDescription' | 'seoNoindex' | 'description' | 'image'
>;

function truncate(text: string, max: number): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= max) {
    return normalized;
  }

  return `${normalized.slice(0, max - 1).trimEnd()}…`;
}

function plainTextFromStructured(value: unknown): string {
  if (!value || typeof value !== 'object') {
    return '';
  }
  const doc =
    'document' in value && (value as { document?: unknown }).document ? (value as { document: unknown }).document : value;

  const parts: string[] = [];
  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') {
      return;
    }
    const n = node as { type?: string; value?: string; children?: unknown[] };
    if (n.type === 'span' && n.value) {
      parts.push(n.value);
    }
    for (const child of n.children ?? []) {
      walk(child);
    }
  };
  walk(doc);

  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

function primaryCategory(product: ProductForSeo) {
  return product.categories.find((c) => c.slug !== 'wohnraumleuchte') ?? product.categories[0];
}

function productTechnicalSnippet(product: ProductForSeo): string {
  const parts: string[] = [];
  if (product.power) {
    parts.push(`Leistung ${product.power}`);
  }
  if (product.brightness) {
    parts.push(product.brightness);
  }
  if (product.lightColor) {
    parts.push(product.lightColor);
  }
  if (product.dimmable) {
    parts.push('dimmbar');
  }
  if (product.deliveryTime) {
    parts.push(`Lieferzeit ${product.deliveryTime}`);
  }

  return parts.join(', ');
}

export function buildProductTitle(product: ProductForSeo): string {
  if (product.seoTitle?.trim()) {
    return product.seoTitle.trim();
  }
  const category = primaryCategory(product);
  const categoryPart = category ? ` – ${category.name}` : '';

  return truncate(`${product.name}${categoryPart}`, 60);
}

export function buildProductDescription(product: ProductForSeo): string {
  if (product.seoDescription?.trim()) {
    return truncate(product.seoDescription.trim(), 160);
  }

  const prose = plainTextFromStructured(product.description?.value);
  const tech = productTechnicalSnippet(product);
  let description = prose;
  if (tech && description.length < 120) {
    description = description ? `${description} ${tech}` : tech;
  }
  if (!description) {
    description = `${product.name} – hochwertige Leuchte bei Wehrli Licht in Goldach. Beratung, Planung und Lieferung in der Schweiz.`;
  }

  return truncate(description, 160);
}

export function buildCategoryTitle(category: CategoryForSeo): string {
  if (category.seoTitle?.trim()) {
    return category.seoTitle.trim();
  }

  return truncate(`${category.name} – Leuchten online kaufen`, 60);
}

export function buildCategoryDescription(category: CategoryForSeo): string {
  if (category.seoDescription?.trim()) {
    return truncate(category.seoDescription.trim(), 160);
  }
  const trimmedDescription = category.description?.trim();
  const defaultDescription = `${category.name} entdecken bei Wehrli Licht: Pendel-, Decken-, Wand- und Tischleuchten. Lichtberatung in Goldach.`;
  const fallback = trimmedDescription?.length ? trimmedDescription : defaultDescription;

  return truncate(fallback, 160);
}

function productOgImage(product: ProductForSeo): string | undefined {
  const image = product.images[0];

  return image?.responsiveImage?.src ?? image?.url ?? undefined;
}

function categoryOgImage(category: CategoryForSeo): string | undefined {
  const image = category.image;

  return image?.responsiveImage?.src ?? image?.url ?? undefined;
}

function baseMetadata({
  title,
  description,
  path,
  imageUrl,
  noIndex,
}: {
  title: string;
  description: string;
  path: string;
  imageUrl?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${getSiteUrl()}${path}`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'de_CH',
      type: 'website',
      ...(imageUrl ? { images: [{ url: imageUrl, alt: title }] } : {}),
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}

export function buildProductMetadata(product: ProductForSeo): Metadata {
  const title = buildProductTitle(product);
  const description = buildProductDescription(product);

  return baseMetadata({
    title,
    description,
    path: `/shop/produkte/${product.slug}`,
    imageUrl: productOgImage(product),
    noIndex: product.seoNoindex ?? false,
  });
}

export function buildCategoryMetadata(category: CategoryForSeo): Metadata {
  const title = buildCategoryTitle(category);
  const description = buildCategoryDescription(category);

  return baseMetadata({
    title,
    description,
    path: `/shop/kategorien/${category.slug}`,
    imageUrl: categoryOgImage(category),
    noIndex: category.seoNoindex ?? false,
  });
}

export const shopIndexMetadata: Metadata = {
  ...baseMetadata({
    title: 'Shop – Leuchten & Lampen',
    description:
      'Entdecken Sie Pendel-, Decken-, Wand- und Tischleuchten im Online-Shop von Wehrli Licht. Lichtberatung und Lieferung in der Schweiz.',
    path: '/shop',
  }),
};

export function getProductOfferPrice(product: ProductForSeo): number | null {
  const variantPrices = product.variants.map((v) => v.price).filter((p): p is number => typeof p === 'number');
  if (variantPrices.length > 0) {
    return Math.min(...variantPrices);
  }

  return typeof product.price === 'number' ? product.price : null;
}

export function buildProductJsonLd(product: ProductForSeo) {
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
        ...(category
          ? {
              category: category.name,
            }
          : {}),
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
}

export function buildShopOrganizationJsonLd() {
  return {
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
  };
}
