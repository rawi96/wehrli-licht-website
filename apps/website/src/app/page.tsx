import { HomeStageBlock } from '@/components/blocks/home-stage';
import { ContentBlocks } from '@/components/content-blocks';
import { Container } from '@wehrli/design-system';
import { Footer } from '@/components/layout/footer';
import { HeaderFooterDocument, HeaderFooterRecord, PageDocument } from '@/graphql/generated';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { buildDatoPageMetadata } from '@/utils/dato-metadata';

export async function generateMetadata() {
  const { isEnabled } = await draftMode();
  const { site, page } = await queryDatoCMS({
    document: PageDocument,
    variables: { slug: 'home' },
    includeDrafts: isEnabled,
  });

  return buildDatoPageMetadata([...site.favicon, ...(page?.seo ?? [])], '/');
}

export default async function HomePage() {
  const { isEnabled } = await draftMode();
  const { page } = await queryDatoCMS({
    document: PageDocument,
    variables: { slug: 'home' },
    includeDrafts: isEnabled,
  });

  const { headerFooter } = await queryDatoCMS({
    document: HeaderFooterDocument,
    includeDrafts: isEnabled,
  });

  if (!page) {
    notFound();
  }

  const content = page.content ?? [];
  const homeStageBlock = content.find((block) => block.__typename === 'HomeStageRecord');
  const pageBlocks = content.filter((block) => block.__typename !== 'HomeStageRecord');

  return (
    <>
      <main>
        {homeStageBlock && <HomeStageBlock key={homeStageBlock.id} block={homeStageBlock} />}
        <Container>
          <ContentBlocks blocks={pageBlocks} eagerBlockCount={0} />
        </Container>
      </main>
      <Footer headerFooter={headerFooter as HeaderFooterRecord} />
    </>
  );
}
