import 'server-only';
import { SITE_NAME } from '@/lib/site';
import { AllFaqsDocument, AllFaqsQuery, FaqPageMetaDocument } from '@/graphql/generated';
import type { FaqEntry } from '@/domain/content/faq';
import type { PageMetadata } from '@/domain/content/page';
import type { FaqPage } from '@/ports/content-source';
import { getSiteUrl } from '@/lib/site-url';
import { cache } from 'react';
import { queryDatoCMS } from './client';
import { isDraftMode } from './draft';
import { toPageMetadata } from './metadata';

/** The FAQ page's title, intro and SEO are maintained on the DatoCMS page with this slug. */
const FAQ_PAGE_SLUG = 'faq';
const FAQ_PATH = '/faq';

const DEFAULT_TITLE = 'Häufig gestellte Fragen | Wehrli Licht';
const DEFAULT_DESCRIPTION =
  'Antworten zu Lichtberatung, Lichtplanung, Lampenschirmen nach Mass und dem Leuchten-Shop von Wehrli Licht in Goldach – Ostschweiz und ganze Schweiz.';

/** Metadata when the FAQ page has no SEO tags in DatoCMS. */
const buildFaqPageMetadata = ({
  title,
  description,
}: {
  title?: string | null;
  description?: string | null;
}): PageMetadata => {
  const pageTitle = title?.trim() ?? DEFAULT_TITLE;
  const pageDescription = description?.trim() ?? DEFAULT_DESCRIPTION;
  const url = `${getSiteUrl()}${FAQ_PATH}`;

  return {
    title: { absolute: pageTitle },
    description: pageDescription,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName: SITE_NAME,
      locale: 'de_CH',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: pageTitle,
      description: pageDescription,
    },
  };
};

/** DatoCMS returns at most 100 records per request: pages through all questions. */
const listAllFaqs = async (includeDrafts: boolean) => {
  const faqs: AllFaqsQuery['allFaqs'] = [];

  for (let skip = 0; ; skip += 100) {
    const { allFaqs } = await queryDatoCMS({ document: AllFaqsDocument, variables: { skip }, includeDrafts });
    faqs.push(...allFaqs);

    if (allFaqs.length < 100) {
      return faqs;
    }
  }
};

/** Deduplicated per request (metadata and page both need it). */
export const getFaqPage = cache(async (): Promise<FaqPage> => {
  const includeDrafts = await isDraftMode();
  const [allFaqs, { page, site }] = await Promise.all([
    listAllFaqs(includeDrafts),
    queryDatoCMS({
      document: FaqPageMetaDocument,
      variables: { slug: FAQ_PAGE_SLUG },
      includeDrafts,
    }),
  ]);

  const faqs: FaqEntry[] = allFaqs.map((faq) => ({
    id: faq.id,
    question: faq.question,
    slug: faq.slug,
    answer: faq.answer,
    sortOrder: faq.sortOrder ?? 0,
    topic: {
      id: faq.topic.id,
      title: faq.topic.title,
      slug: faq.topic.slug,
      sortOrder: faq.topic.sortOrder ?? 0,
    },
  }));

  return {
    title: page?.title ?? null,
    intro: page?.teaserDescription ?? null,
    metadata: page?.seo?.length
      ? toPageMetadata([...(site?.favicon ?? []), ...page.seo])
      : buildFaqPageMetadata({ title: page?.title, description: page?.teaserDescription }),
    faqs,
  };
});
