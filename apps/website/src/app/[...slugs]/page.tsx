import { Breadcrumbs } from '@/components/breadcrumbs';
import { SitePage } from '@/components/layout/site-page';
import { ArticleJsonLd } from '@/components/seo/article-json-ld';
import { isDedicatedRoute } from '@/domain/content/dedicated-routes';
import { content } from '@/integrations';
import { Container } from '@wehrli/design-system';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Params = {
  params: Promise<{
    slugs?: string[];
  }>;
};

const toPath = async ({ params }: Params): Promise<string> => {
  const { slugs = [] } = await params;

  if (slugs.length === 0) {
    notFound();
  }

  return `/${slugs.join('/')}`;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  return content.getPageMetadata(await toPath(props));
}

export async function generateStaticParams() {
  const routes = await content.listRoutes();

  // The param must be named like the route segment ([...slugs]), otherwise nothing is prerendered.
  // The homepage and paths served by dedicated Next.js routes are skipped.
  return routes
    .filter(({ path }) => !isDedicatedRoute(path))
    .map(({ path }) => ({
      slugs: path.split('/').filter(Boolean),
    }));
}

export const dynamicParams = true;

export default async function ContentPage(props: Params) {
  const path = await toPath(props);
  const page = await content.getPage(path);

  if (!page) {
    notFound();
  }

  return (
    <SitePage>
      {page.article && <ArticleJsonLd article={page.article} path={path} />}
      <Container>{page.render(<Breadcrumbs customBreadcrumbs={page.breadcrumbs} spacing="tight" />)}</Container>
    </SitePage>
  );
}
