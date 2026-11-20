import { Breadcrumbs } from '@/components/breadcrumbs';
import { FaqPageContent } from '@/components/faq/faq-page-content';
import { SitePage } from '@/components/layout/site-page';
import { buildFaqPageJsonLd } from '@/components/seo/faq-json-ld';
import { JsonLd } from '@/components/seo/json-ld';
import { groupFaqsByTopic } from '@/domain/content/faq';
import { content } from '@/integrations';
import { Container } from '@wehrli/design-system';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return (await content.getFaqPage()).metadata;
}

export default async function FaqPage() {
  const { faqs, title, intro } = await content.getFaqPage();

  if (faqs.length === 0) {
    notFound();
  }

  const pageTitle = title?.trim() ?? 'Häufig gestellte Fragen';

  return (
    <SitePage>
      <JsonLd data={buildFaqPageJsonLd(faqs)} />
      <Container>
        <Breadcrumbs customBreadcrumbs={[{ name: pageTitle, href: '/faq' }]} />
        <FaqPageContent
          title={pageTitle}
          intro={intro}
          groups={groupFaqsByTopic(faqs)}
          contactHref={await content.getContactPath()}
        />
      </Container>
    </SitePage>
  );
}
