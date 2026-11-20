import { AllRoutesDocument } from '@/graphql/generated';
import { getPublicPagePath } from './pathnames';
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

export const getAllDatoRoutes = async ({ includeDrafts = true, pagesOnly = false }: Options = {}): Promise<Route[]> => {
  const data = await queryDatoCMS({
    document: AllRoutesDocument,
    includeDrafts,
  });

  const pages = data.allPages.map(({ slug, lastModified, seometatags, parent }) => ({
    path: getPublicPagePath({ slug, parent }),
    lastModified,
    noIndex: seometatags?.noIndex ?? undefined,
  }));

  if (pagesOnly) {
    return pages;
  }

  return [...pages];
};
