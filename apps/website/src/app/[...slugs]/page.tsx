import { Breadcrumbs } from '@/components/breadcrumbs';
import { ContentBlocks } from '@/components/content-blocks';
import { Container } from '@wehrli/design-system';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { HeaderFooterDocument, HeaderFooterRecord, PageDocument, PageRecord } from '@/graphql/generated';
import { getAllDatoRoutes } from '@/utils/get-dato-routes';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import { validateRoutes } from '@/utils/validate-dato-routes';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/seo/json-ld';
import { buildBlogPostingJsonLd } from '@/utils/article-json-ld';
import { buildDatoPageMetadata } from '@/utils/dato-metadata';
import { isDedicatedRoute } from '@/constants/dedicated-routes';

type Params = {
  params: Promise<{
    slugs?: string[];
  }>;
};

const getLastSlug = (slugs: string[]): string | undefined => {
  return slugs.at(-1);
};

export async function generateMetadata({ params }: Params) {
  const { slugs = [] } = await params;
  const slug = getLastSlug(slugs);

  if (!slug) {
    notFound();
  }

  const { isEnabled } = await draftMode();
  const { site, page } = await queryDatoCMS({
    document: PageDocument,
    variables: { slug },
    includeDrafts: isEnabled,
  });

  return buildDatoPageMetadata([...site.favicon, ...(page?.seo ?? [])], `/${slugs.join('/')}`);
}

export async function generateStaticParams() {
  const routes = await getAllDatoRoutes({ pagesOnly: true, includeDrafts: false });

  // The param must be named like the route segment ([...slugs]), otherwise nothing is prerendered.
  // The homepage and paths served by dedicated Next.js routes are skipped.
  return routes
    .filter(({ path }) => !isDedicatedRoute(path))
    .map(({ path }) => ({
      slugs: path.split('/').filter(Boolean),
    }));
}

export const dynamicParams = true;

export default async function ContentPage({ params }: Params) {
  const { slugs = [] } = await params;
  const slug = getLastSlug(slugs);

  if (!slug) {
    notFound();
  }

  const { isEnabled } = await draftMode();
  const { page } = await queryDatoCMS({
    document: PageDocument,
    variables: { slug },
    includeDrafts: isEnabled,
  });

  const { headerFooter } = await queryDatoCMS({
    document: HeaderFooterDocument,
    includeDrafts: isEnabled,
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
      {page.isArticle && (
        <JsonLd
          data={buildBlogPostingJsonLd({
            title: page.title,
            path: `/${slugs.join('/')}`,
            seo: page.seo,
            publishedAt: page._firstPublishedAt,
            updatedAt: page._updatedAt,
          })}
        />
      )}
      <Container>
        <Breadcrumbs page={page as unknown as PageRecord} />
        <ContentBlocks blocks={page.content} />
      </Container>
      <Footer headerFooter={headerFooter as HeaderFooterRecord} />
    </main>
  );
}
