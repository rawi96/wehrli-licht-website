import {
  buildCategoryDescription,
  buildCategoryTitle,
  buildProductDescription,
  buildProductTitle,
} from '@/utils/shop-seo/copy';
import type { CategoryForSeo, ProductForSeo } from '@/utils/shop-seo/types';
import { getSiteUrl } from '@/utils/site-url';
import type { Metadata } from 'next';

const SITE_NAME = 'Wehrli Licht GmbH';

const productOgImage = (product: ProductForSeo): string | undefined => {
  const image = product.images[0];

  return image?.responsiveImage?.src ?? image?.url ?? undefined;
};

const categoryOgImage = (category: CategoryForSeo): string | undefined => {
  const image = category.image;

  return image?.responsiveImage?.src ?? image?.url ?? undefined;
};

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

export const buildProductMetadata = (product: ProductForSeo): Metadata =>
  baseMetadata({
    title: buildProductTitle(product),
    description: buildProductDescription(product),
    path: `/shop/produkte/${product.slug}`,
    imageUrl: productOgImage(product),
    noIndex: product.seoNoindex ?? false,
  });

export const buildCategoryMetadata = (category: CategoryForSeo): Metadata =>
  baseMetadata({
    title: buildCategoryTitle(category),
    description: buildCategoryDescription(category),
    path: `/shop/kategorien/${category.slug}`,
    imageUrl: categoryOgImage(category),
    noIndex: category.seoNoindex ?? false,
  });

export const shopIndexMetadata: Metadata = {
  ...baseMetadata({
    title: 'Shop – Leuchten & Lampen',
    description:
      'Entdecken Sie Pendel-, Decken-, Wand- und Tischleuchten im Online-Shop von Wehrli Licht. Lichtberatung und Lieferung in der Schweiz.',
    path: '/shop',
  }),
};
