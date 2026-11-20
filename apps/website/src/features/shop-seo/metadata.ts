import { SITE_NAME } from '@/constants/site';
import type { Category } from '@/domain/shop/category';
import { imageUrl } from '@/domain/shop/image';
import type { Product } from '@/domain/shop/product';
import { buildCategoryDescription, buildCategoryTitle, buildProductDescription, buildProductTitle } from '@/domain/shop/seo';
import { getSiteUrl } from '@/utils/site-url';
import type { Metadata } from 'next';

type BaseMetadataInput = {
  title: string;
  description: string;
  path: string;
  imageUrl?: string;
  noIndex?: boolean;
};

const baseMetadata = ({ title, description, path, imageUrl, noIndex }: BaseMetadataInput): Metadata => {
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
};

export const buildProductMetadata = (product: Product): Metadata =>
  baseMetadata({
    title: buildProductTitle(product),
    description: buildProductDescription(product),
    path: `/shop/produkte/${product.slug}`,
    imageUrl: imageUrl(product.images[0]),
    noIndex: product.seo.noIndex,
  });

export const buildCategoryMetadata = (category: Category): Metadata =>
  baseMetadata({
    title: buildCategoryTitle(category),
    description: buildCategoryDescription(category),
    path: `/shop/kategorien/${category.slug}`,
    imageUrl: imageUrl(category.image),
    noIndex: category.seo.noIndex,
  });

export const shopAllProductsMetadata: Metadata = {
  ...baseMetadata({
    title: 'Alle Leuchten – Leuchten Shop | Wehrli Licht',
    description:
      'Alle Leuchten im Online-Shop von Wehrli Licht: Pendelleuchten, Deckenleuchten, Wandleuchten und Tischleuchten für Zuhause und Gewerbe in der Schweiz.',
    path: '/shop/alle-leuchten',
  }),
  keywords: [
    'Alle Leuchten',
    'Leuchten Shop',
    'Pendelleuchte',
    'Deckenleuchte',
    'Wandleuchte',
    'Tischleuchte',
    'Wehrli Licht',
  ],
};

export const shopIndexMetadata: Metadata = {
  ...baseMetadata({
    title: 'Leuchten Shop | Lampenschirme nach Mass & Lichtberatung | Wehrli Licht',
    description:
      'Leuchten online kaufen bei Wehrli Licht in Goldach: Pendelleuchten, Deckenleuchten, Wandleuchten und Tischleuchten. Dazu massgefertigte Lampenschirme nach Mass, Lampenschirm überziehen, Lichtberatung und Lichtplanung in der Schweiz.',
    path: '/shop',
  }),
  keywords: [
    'Leuchten online kaufen',
    'Lampen Shop Schweiz',
    'Pendelleuchte',
    'Deckenleuchte',
    'Wandleuchte',
    'Tischleuchte',
    'Lampenschirme nach Mass',
    'Lampenschirm überziehen',
    'Lampenschirm reparieren',
    'Lampenschirm bedrucken',
    'Lichtberatung Goldach',
    'Lichtplanung',
    'Wehrli Licht',
    'Goldach',
  ],
};
