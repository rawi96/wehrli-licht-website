import { ContentBlocks } from '@/components/content-blocks';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { HeaderFooterDocument, HeaderFooterRecord, PageModelContentField, ProjectDocument } from '@/graphql/generated';
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
  const { site, project } = await queryDatoCMS({
    document: ProjectDocument,
    variables: { slug },
  });

  return toNextMetadata([...site.favicon, ...(project?.seo ?? [])]);
}

export default async function ContentPage({ params: { slug }, searchParams }: Params) {
  const { project } = await queryDatoCMS({
    document: ProjectDocument,
    variables: { slug },
  });

  const { headerFooter } = await queryDatoCMS({ document: HeaderFooterDocument });

  if (!project || project.slug === 'home') {
    notFound();
  }

  return (
    <main>
      <Header headerFooter={headerFooter as HeaderFooterRecord} backgroundColor={'bg-wehrli'} />
      <ContentBlocks blocks={project.content as PageModelContentField[]} searchParams={searchParams} />
      <Footer headerFooter={headerFooter as HeaderFooterRecord} />
    </main>
  );
}
