import { getSiteUrl } from '@/utils/site-url';
import type { Metadata } from 'next';
import { toNextMetadata } from 'react-datocms/seo';

type DatoTags = Parameters<typeof toNextMetadata>[0];

/**
 * Metadata for DatoCMS pages. DatoCMS already appends the site name to the SEO
 * title, so the title is marked absolute (the layout template would add it a
 * second time). Adds a canonical URL and keeps og:url in sync with it.
 */
export const buildDatoPageMetadata = (tags: DatoTags, path: string): Metadata => {
  const metadata = toNextMetadata(tags);
  const url = `${getSiteUrl()}${path === '/' ? '' : path}`;
  const title = typeof metadata.title === 'string' ? { absolute: metadata.title } : metadata.title;

  return {
    ...metadata,
    title,
    alternates: { canonical: url },
    openGraph: { ...metadata.openGraph, url, siteName: 'Wehrli Licht GmbH', locale: 'de_CH' },
  };
};
