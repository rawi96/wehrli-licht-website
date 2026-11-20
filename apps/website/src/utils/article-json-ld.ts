import { getSiteUrl } from '@/utils/site-url';

type SeoTag = { tag: string; attributes?: Record<string, string> | null; content?: string | null };

const metaContent = (tags: SeoTag[], key: string): string | undefined =>
  tags.find((tag) => tag.tag === 'meta' && (tag.attributes?.property === key || tag.attributes?.name === key))?.attributes
    ?.content;

type ArticleInput = {
  title: string;
  path: string;
  seo: SeoTag[];
  publishedAt?: string | null;
  updatedAt?: string | null;
};

/** BlogPosting structured data for blog articles (author = the business). */
export const buildBlogPostingJsonLd = ({ title, path, seo, publishedAt, updatedAt }: ArticleInput) => {
  const url = `${getSiteUrl()}${path}`;
  const image = metaContent(seo, 'og:image');
  const description = metaContent(seo, 'description') ?? metaContent(seo, 'og:description');

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    url,
    mainEntityOfPage: url,
    inLanguage: 'de-CH',
    ...(description && { description }),
    ...(image && { image: [image] }),
    ...(publishedAt && { datePublished: publishedAt }),
    ...(updatedAt && { dateModified: updatedAt }),
    author: { '@id': `${getSiteUrl()}/#business` },
    publisher: { '@id': `${getSiteUrl()}/#business` },
  };
};
