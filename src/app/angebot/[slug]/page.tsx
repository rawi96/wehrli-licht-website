import { ContentBlocks } from '@/components/content-blocks';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { HeaderFooterDocument, HeaderFooterRecord, OfferDocument, PageModelContentField } from '@/graphql/generated';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import { notFound } from 'next/navigation';
import { toNextMetadata } from 'react-datocms/seo';
import { SearchParams } from '../../page';

type Params = {
  params: {
    slug: string;
  };
} & SearchParams;

export async function generateMetadata({ params: { slug } }: Params) {
  const { site, offer } = await queryDatoCMS({
    document: OfferDocument,
    variables: { slug },
  });

  return toNextMetadata([...site.favicon, ...(offer?.seo ?? [])]);
}

export default async function ContentPage({ params: { slug }, searchParams }: Params) {
  const { offer } = await queryDatoCMS({
    document: OfferDocument,
    variables: { slug },
  });

  const { headerFooter } = await queryDatoCMS({ document: HeaderFooterDocument });

  if (!offer || offer.slug === 'home') {
    notFound();
  }

  return (
    <main>
      <Header headerFooter={headerFooter as HeaderFooterRecord} backgroundColor={'bg-wehrli'} />
      <ContentBlocks blocks={offer.content as PageModelContentField[]} searchParams={searchParams} />
      <Footer headerFooter={headerFooter as HeaderFooterRecord} />
    </main>
  );
}
