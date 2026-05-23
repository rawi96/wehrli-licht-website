import { AllFaqsDocument, FaqPageMetaDocument } from '@/graphql/generated';
import type { FaqEntry } from '@/utils/faq/group-by-topic';
import { queryDatoCMS } from '@/utils/query-dato-cms';

const FAQ_PAGE_SLUG = 'faq';

export const loadFaqPage = async (includeDrafts: boolean) => {
  const [faqsData, metaData] = await Promise.all([
    queryDatoCMS({ document: AllFaqsDocument, includeDrafts }),
    queryDatoCMS({
      document: FaqPageMetaDocument,
      variables: { slug: FAQ_PAGE_SLUG },
      includeDrafts,
    }),
  ]);

  const faqs: FaqEntry[] = faqsData.allFaqs.map((faq) => ({
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
    faqs,
    page: metaData.page,
    site: metaData.site,
  };
};
