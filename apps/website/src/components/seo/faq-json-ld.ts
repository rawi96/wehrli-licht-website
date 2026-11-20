import type { FaqEntry } from '@/domain/content/faq';
import { getSiteUrl } from '@/lib/site-url';

export const buildFaqPageJsonLd = (faqs: FaqEntry[]): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `${getSiteUrl()}/faq`,
  },
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});
