import { ContentBlocks } from '@/components/content-blocks';
import { Footer } from '@/components/layout/footer';
import { HeaderFooterDocument, HeaderFooterRecord, PageDocument, PageModelContentField } from '@/graphql/generated';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { toNextMetadata } from 'react-datocms/seo';

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

  return (
    <>
      {/* Home Contains a Component which contains a Header */}
      <main>{<ContentBlocks blocks={page.content as PageModelContentField[]} />}</main>
      <Footer headerFooter={headerFooter as HeaderFooterRecord} />
    </>
  );
}
