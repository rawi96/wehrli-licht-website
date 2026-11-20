import { JsonLd } from '@/components/seo/json-ld';
import type { ArticleInfo } from '@/domain/content/page';
import { getSiteUrl } from '@/utils/site-url';

type Props = {
  article: ArticleInfo;
  path: string;
};

/** BlogPosting structured data for blog articles (author = the business). */
export const ArticleJsonLd = ({ article: { title, description, imageUrl, publishedAt, updatedAt }, path }: Props) => {
  const url = `${getSiteUrl()}${path}`;

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        url,
        mainEntityOfPage: url,
        inLanguage: 'de-CH',
        ...(description && { description }),
        ...(imageUrl && { image: [imageUrl] }),
        ...(publishedAt && { datePublished: publishedAt }),
        ...(updatedAt && { dateModified: updatedAt }),
        author: { '@id': `${getSiteUrl()}/#business` },
        publisher: { '@id': `${getSiteUrl()}/#business` },
      }}
    />
  );
};
