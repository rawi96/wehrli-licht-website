import 'server-only';
import { AllRoutesDocument, LlmsPagesDocument } from '@/graphql/generated';
import type { PageRoute, PageSummary, PreviewLink } from '@/domain/content/page';
import { queryDatoCMS } from './client';
import { getPublicPagePath } from './paths';
import { getProjectAreaPath, getProjectPath } from '@/domain/content/project';
import { listProjectAreas, listProjects } from './projects';

const getPageRoutes = async (includeDrafts: boolean): Promise<PageRoute[]> => {
  const { allPages } = await queryDatoCMS({ document: AllRoutesDocument, includeDrafts });

  return allPages.map(({ slug, lastModified, seometatags, parent }) => ({
    path: getPublicPagePath({ slug, parent }),
    lastModified,
    noIndex: seometatags?.noIndex ?? undefined,
  }));
};

/** Published pages, projects and project areas. */
export const listRoutes = async (): Promise<PageRoute[]> => {
  const [pages, projects, areas] = await Promise.all([getPageRoutes(false), listProjects(), listProjectAreas()]);

  return [
    ...pages,
    ...projects.map(({ slug, lastModified }) => ({ path: getProjectPath(slug), lastModified })),
    ...areas.map(({ slug, lastModified }) => ({ path: getProjectAreaPath(slug), lastModified })),
  ];
};

export const listPages = async (): Promise<PageSummary[]> => {
  const { allPages } = await queryDatoCMS({ document: LlmsPagesDocument });

  return allPages.map((page) => ({
    path: getPublicPagePath(page),
    title: page.title,
    description: page.seometatags?.description ?? null,
    noIndex: Boolean(page.seometatags?.noIndex),
    parent: page.parent ? { id: page.parent.id, title: page.parent.title } : null,
  }));
};

/** Request of the DatoCMS «Web Previews» plugin. */
type PreviewLinksRequest = {
  item: { attributes: { slug: string; parent_id: string }; meta: { status: string } };
  itemType: { attributes: { api_key: string } };
};

const getPreviewPath = async ({ item, itemType }: PreviewLinksRequest): Promise<string | null> => {
  switch (itemType.attributes.api_key) {
    case 'page':
      if (item.attributes.parent_id) {
        // page is a child of another page, so let's find the full slug (e.g. /agentur/lohnrechner)
        const routes = await getPageRoutes(true);
        const route = routes.find(({ path }) => path.endsWith(`/${item.attributes.slug}`));

        return route?.path ?? null;
      }

      return `/${item.attributes.slug}`;
    default:
      return null;
  }
};

export const getPreviewLinks = async (request: unknown, token: string): Promise<PreviewLink[]> => {
  const previewRequest = request as PreviewLinksRequest;
  const url = await getPreviewPath(previewRequest);

  if (!url) {
    return [];
  }

  const baseUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/api/draft`;
  const previewLinks: PreviewLink[] = [];

  if (previewRequest.item.meta.status !== 'draft') {
    previewLinks.push({
      label: 'Live Version 🚀',
      url: `${baseUrl}/disable?url=${url}`,
    });
  }

  if (previewRequest.item.meta.status !== 'published') {
    previewLinks.push({
      label: 'Draft Version 🚧',
      url: `${baseUrl}/enable?url=${url}&token=${token}`,
    });
  }

  return previewLinks;
};
