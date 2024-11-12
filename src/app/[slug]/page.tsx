import { ContentBlocks } from '@/components/content-blocks';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { HeaderFooterDocument, HeaderFooterRecord, PageDocument, PageModelContentField } from '@/graphql/generated';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import { notFound } from 'next/navigation';
import { toNextMetadata } from 'react-datocms/seo';

type Params = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params: { slug } }: Params) {
  const { site, page } = await queryDatoCMS({
    document: PageDocument,
    variables: { slug },
  });

  return toNextMetadata([...site.favicon, ...(page?.seo ?? [])]);
}

export default async function ContentPage({ params: { slug } }: Params) {
  const { page } = await queryDatoCMS({
    document: PageDocument,
    variables: { slug },
  });

  const { headerFooter } = await queryDatoCMS({ document: HeaderFooterDocument });

  if (!page || page.slug === 'home') {
    notFound();
  }

  return (
    <main>
      <Header headerFooter={headerFooter as HeaderFooterRecord} backgroundColor={'bg-wehrli'} />
      <ContentBlocks blocks={page.content as PageModelContentField[]} />
      <Footer headerFooter={headerFooter as HeaderFooterRecord} />
    </main>
  );
}
