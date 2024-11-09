import { ContentBlocks } from '@/components/content-blocks';
import { Footer } from '@/components/layout/footer';
import { HeaderFooterDocument, HeaderFooterRecord, PageDocument, PageModelContentField } from '@/graphql/generated';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import { notFound } from 'next/navigation';
import { toNextMetadata } from 'react-datocms/seo';

export async function generateMetadata() {
  const { site, page } = await queryDatoCMS({
    document: PageDocument,
    variables: { slug: 'home' },
  });

  return toNextMetadata([...site.favicon, ...(page?.seo ?? [])]);
}

export type SearchParams = {
  searchParams: { categories: string[]; types: string[]; department: string[] };
};

export default async function HomePage({ searchParams }: SearchParams) {
  const { page } = await queryDatoCMS({
    document: PageDocument,
    variables: { slug: 'home' },
  });

  const { headerFooter } = await queryDatoCMS({ document: HeaderFooterDocument });

  if (!page) {
    notFound();
  }

  return (
    <>
      <main>{<ContentBlocks blocks={page.content as PageModelContentField[]} searchParams={searchParams} />}</main>
      <Footer headerFooter={headerFooter as HeaderFooterRecord} />
    </>
  );
}
