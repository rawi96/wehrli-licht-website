import { AllRoutesDocument } from '@/graphql/generated';
import { queryDatoCMS } from './query-dato-cms';

type Route = {
  path: string;
  lastModified: string;
  noIndex?: boolean;
};

type Options = {
  includeDrafts?: boolean;
  pagesOnly?: boolean;
};

export const getAllDatoRoutes = async ({ includeDrafts = true }: Options = {}): Promise<Route[]> => {
  const data = await queryDatoCMS({
    document: AllRoutesDocument,
    includeDrafts,
  });

  const pages =
    data.allPages.map(({ slug, lastModified, seometatags }) => ({
      path: `/${slug}`,
      lastModified,
      noIndex: seometatags?.noIndex ?? undefined,
    })) || [];

  // We replace the /home path with / because the homepage is redirected in next.config.js
  const homeIndex = pages.findIndex(({ path }) => path === '/home');
  if (homeIndex > -1) {
    pages[homeIndex].path = '/';
  }

  return pages;
};
