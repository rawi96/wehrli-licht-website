import { ContentBlocks } from '@/components/content-blocks';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import {
  HeaderFooterDocument,
  HeaderFooterRecord,
  PageDocument,
  PageModelContentField,
  PageRecord,
} from '@/graphql/generated';
import { getAllDatoRoutes } from '@/utils/get-dato-routes';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import { validateRoutes } from '@/utils/validate-dato-routes';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { toNextMetadata } from 'react-datocms/seo';

type Params = {
  params: {
    slugs: string[];
  };
};

const getLastSlug = (slugs: string[]): string => {
  return slugs[slugs.length - 1];
};

export async function generateMetadata({ params: { slugs } }: Params) {
  const { site, page } = await queryDatoCMS({
    document: PageDocument,
    variables: { slug: getLastSlug(slugs) },
    includeDrafts: draftMode().isEnabled,
  });

  return toNextMetadata([...site.favicon, ...(page?.seo ?? [])]);
}

export async function generateStaticParams() {
  const routes = await getAllDatoRoutes({ pagesOnly: true });

  return routes
    .filter(({ path }) => path !== '/') // We filter out the homepage
    .map(({ path }) => ({
      slug: path.split('/').filter(Boolean),
    }));
}

export const dynamicParams = true;

export default async function ContentPage({ params: { slugs } }: Params) {
  const { page } = await queryDatoCMS({
    document: PageDocument,
    variables: { slug: getLastSlug(slugs) },
    includeDrafts: draftMode().isEnabled,
  });

  const { headerFooter } = await queryDatoCMS({
    document: HeaderFooterDocument,
    includeDrafts: draftMode().isEnabled,
  });

  if (!page || page.slug === 'home') {
    notFound();
  }

  if (page.parent) {
    await validateRoutes(page as unknown as PageRecord, slugs);
  }

  return (
    <main>
      <Header headerFooter={headerFooter as HeaderFooterRecord} />
      <ContentBlocks blocks={page.content as PageModelContentField[]} />
      <Footer headerFooter={headerFooter as HeaderFooterRecord} />
    </main>
  );
}
