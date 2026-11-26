import 'server-only';
import { AllRoutesDocument, LlmsPagesDocument } from '@/graphql/generated';
import type { PageRoute, PageSummary, PreviewLink } from '@/domain/content/page';
import { queryDatoCMS } from './client';
import { getPublicPagePath } from './paths';
import { getProjectAreaPath, getProjectPath } from '@/domain/content/project';
import { listProjectAreas, listProjects } from './projects';

const getPageRoutes = async (includeDrafts: boolean): Promise<(PageRoute & { id: string })[]> => {
  const { allPages } = await queryDatoCMS({ document: AllRoutesDocument, includeDrafts });

  return allPages.map(({ id, slug, lastModified, seometatags, parent }) => ({
    id,
    path: getPublicPagePath({ slug, parent }),
    lastModified,
    noIndex: seometatags?.noIndex ?? undefined,
  }));
};

/** Published pages, projects and project areas. */
export const listRoutes = async (): Promise<PageRoute[]> => {
  const [pages, projects, areas] = await Promise.all([getPageRoutes(false), listProjects(), listProjectAreas()]);

  return [
    ...pages.map(({ path, lastModified, noIndex }) => ({ path, lastModified, noIndex })),
    ...projects.map(({ slug, lastModified, noIndex }) => ({ path: getProjectPath(slug), lastModified, noIndex })),
    ...areas.map(({ slug, lastModified, noIndex }) => ({ path: getProjectAreaPath(slug), lastModified, noIndex })),
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
  item: { id: string; attributes: { slug: string; parent_id: string | null }; meta: { status: string } };
  itemType: { attributes: { api_key: string } };
};

const getPreviewPath = async ({ item, itemType }: PreviewLinksRequest): Promise<string | null> => {
  switch (itemType.attributes.api_key) {
    case 'page': {
      if (!item.attributes.parent_id) {
        return getPublicPagePath({ slug: item.attributes.slug });
      }

      // Slugs are only unique below the same parent: the record's own id gives its full path.
      const routes = await getPageRoutes(true);

      return routes.find(({ id }) => id === item.id)?.path ?? null;
    }
    case 'project':
      return item.attributes.slug ? getProjectPath(item.attributes.slug) : null;
    case 'project_area':
      return item.attributes.slug ? getProjectAreaPath(item.attributes.slug) : null;
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
