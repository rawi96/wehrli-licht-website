import { ContentBlocks } from '@/components/content-blocks';
import { OfferDocument, PageModelContentField } from '@/graphql/generated';
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

  if (!offer || offer.slug === 'home') {
    notFound();
  }

  return (
    <>
      <main>
        <ContentBlocks blocks={offer.content as PageModelContentField[]} searchParams={searchParams} />
      </main>
    </>
  );
}
