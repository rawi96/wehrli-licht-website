import { Breadcrumbs } from '@/components/breadcrumbs';
import { FaqPageContent } from '@/components/faq/faq-page-content';
import { ContentWrapper } from '@/components/layout/content-wrapper';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { JsonLd } from '@/components/seo/json-ld';
import { HeaderFooterDocument, HeaderFooterRecord } from '@/graphql/generated';
import { groupFaqsByTopic } from '@/utils/faq/group-by-topic';
import { buildFaqPageJsonLd } from '@/utils/faq/json-ld';
import { buildFaqPageMetadata } from '@/utils/faq/metadata';
import { loadFaqPage } from '@/utils/faq/load-faq-page';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { toNextMetadata } from 'react-datocms/seo';

export const revalidate = 3600;

export async function generateMetadata() {
  const { isEnabled } = await draftMode();
  const { page, site } = await loadFaqPage(isEnabled);

  if (page?.seo?.length) {
    return toNextMetadata([...(site?.favicon ?? []), ...page.seo]);
  }

  return buildFaqPageMetadata({
    title: page?.title,
    description: page?.teaserDescription,
  });
}

export default async function FaqPage() {
  const { isEnabled } = await draftMode();

  const [{ faqs, page }, { headerFooter }] = await Promise.all([
    loadFaqPage(isEnabled),
    queryDatoCMS({ document: HeaderFooterDocument, includeDrafts: isEnabled }),
  ]);

  if (faqs.length === 0) {
    notFound();
  }

  const groups = groupFaqsByTopic(faqs);
  const pageTitle = page?.title?.trim() ?? 'Häufig gestellte Fragen';

  return (
    <main>
      <JsonLd data={buildFaqPageJsonLd(faqs)} />
      <Header headerFooter={headerFooter as HeaderFooterRecord} />
      <ContentWrapper>
        <Breadcrumbs customBreadcrumbs={[{ name: pageTitle, href: '/faq' }]} />
        <FaqPageContent title={pageTitle} intro={page?.teaserDescription} groups={groups} />
      </ContentWrapper>
      <Footer headerFooter={headerFooter as HeaderFooterRecord} />
    </main>
  );
}
