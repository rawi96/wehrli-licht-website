import { HomeStageBlock } from '@/components/blocks/home-stage';
import { ContentBlocks } from '@/components/content-blocks';
import { ContentWrapper } from '@/components/layout/content-wrapper';
import { Footer } from '@/components/layout/footer';
import {
  HeaderFooterDocument,
  HeaderFooterRecord,
  HomeStageBlockFragment,
  PageDocument,
  PageModelContentField,
} from '@/graphql/generated';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { toNextMetadata } from 'react-datocms/seo';

export const revalidate = 60;

export async function generateMetadata() {
  const { site, page } = await queryDatoCMS({
    document: PageDocument,
    variables: { slug: 'home' },
    includeDrafts: draftMode().isEnabled,
  });

  return toNextMetadata([...site.favicon, ...(page?.seo ?? [])]);
}

export default async function HomePage() {
  const { page } = await queryDatoCMS({
    document: PageDocument,
    variables: { slug: 'home' },
    includeDrafts: draftMode().isEnabled,
  });

  const { headerFooter } = await queryDatoCMS({
    document: HeaderFooterDocument,
    includeDrafts: draftMode().isEnabled,
  });

  if (!page) {
    notFound();
  }

  const homeStageBlock = page.content?.find((block) => block.__typename === 'HomeStageRecord');

  return (
    <>
      <main>
        {/* Home Contains a Component which contains a Header */}
        {homeStageBlock && <HomeStageBlock key={homeStageBlock.id} block={homeStageBlock as HomeStageBlockFragment} />}
        <ContentWrapper>
          <ContentBlocks blocks={page.content as PageModelContentField[]} />
        </ContentWrapper>
      </main>
      <Footer headerFooter={headerFooter as HeaderFooterRecord} />
    </>
  );
}
