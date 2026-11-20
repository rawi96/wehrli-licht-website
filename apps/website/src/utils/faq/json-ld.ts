import type { FaqEntry } from '@/utils/faq/group-by-topic';
import { getSiteUrl } from '@/utils/site-url';

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
