import { SITE_NAME } from '@/constants/site';
import type { PageMetadata } from '@/domain/content/page';
import { getSiteUrl } from '@/utils/site-url';
import { toNextMetadata } from 'react-datocms/seo';

export type SeoTags = Parameters<typeof toNextMetadata>[0];

/** DatoCMS SEO and favicon tags as page metadata. */
export const toPageMetadata = (tags: SeoTags): PageMetadata => toNextMetadata(tags);

/**
 * Metadata for DatoCMS pages. DatoCMS already appends the site name to the SEO
 * title, so the title is marked absolute (the layout template would add it a
 * second time). Adds a canonical URL and keeps og:url in sync with it.
 */
export const buildDatoPageMetadata = (tags: SeoTags, path: string): PageMetadata => {
  const metadata = toPageMetadata(tags);
  const url = `${getSiteUrl()}${path === '/' ? '' : path}`;
  const title = typeof metadata.title === 'string' ? { absolute: metadata.title } : metadata.title;

  return {
    ...metadata,
    title,
    alternates: { canonical: url },
    openGraph: { ...metadata.openGraph, url, siteName: metadata.openGraph?.siteName ?? SITE_NAME, locale: 'de_CH' },
  };
};
