import { ContentBlocks } from '@/components/content-blocks';
import { PageDocument, PageModelContentField } from '@/graphql/generated';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import { notFound } from 'next/navigation';
import { toNextMetadata } from 'react-datocms/seo';
import { SearchParams } from '../page';

type Params = {
  params: {
    slug: string;
  };
} & SearchParams;

export async function generateMetadata({ params: { slug } }: Params) {
  const { site, page } = await queryDatoCMS({
    document: PageDocument,
    variables: { slug },
  });

  return toNextMetadata([...site.favicon, ...(page?.seo ?? [])]);
}

export default async function ContentPage({ params: { slug }, searchParams }: Params) {
  const { page } = await queryDatoCMS({
    document: PageDocument,
    variables: { slug },
  });

  if (!page || page.slug === 'home') {
    notFound();
  }

  return (
    <main>
      <ContentBlocks blocks={page.content as PageModelContentField[]} searchParams={searchParams} />
    </main>
  );
}
