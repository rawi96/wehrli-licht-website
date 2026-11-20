import { content } from '@/integrations';
import { SitePage } from '@/components/layout/site-page';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { FaqPageContent } from '@/components/faq/faq-page-content';
import { Container } from '@wehrli/design-system';
import { JsonLd } from '@/components/seo/json-ld';
import { groupFaqsByTopic } from '@/utils/faq/group-by-topic';
import { buildFaqPageJsonLd } from '@/utils/faq/json-ld';
import { buildFaqPageMetadata } from '@/utils/faq/metadata';
import { loadFaqPage } from '@/utils/faq/load-faq-page';
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

  const { faqs, page } = await loadFaqPage(isEnabled);

  if (faqs.length === 0) {
    notFound();
  }

  const groups = groupFaqsByTopic(faqs);
  const pageTitle = page?.title?.trim() ?? 'Häufig gestellte Fragen';

  return (
    <SitePage>
      <JsonLd data={buildFaqPageJsonLd(faqs)} />
      <Container>
        <Breadcrumbs customBreadcrumbs={[{ name: pageTitle, href: '/faq' }]} />
        <FaqPageContent
          title={pageTitle}
          intro={page?.teaserDescription}
          groups={groups}
          contactHref={await content.getContactPath()}
        />
      </Container>
    </SitePage>
  );
}
