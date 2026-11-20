type PageRecordParent = {
  slug: string;
  parent?: PageRecordParent | null;
};

export type PageRecord = {
  id: string;
  slug: string;
  parent?: PageRecordParent | null;
};

export type LinkableRecords = 'PageRecord' | undefined;

const buildPathByParents = (page: PageRecord) => {
  const path: string[] = [];
  while (page) {
    path.unshift(page.slug);
    page = page.parent as PageRecord;
  }

  return `/${path.join('/')}`;
};

export const generatePathForRecord = ({
  slug,
  type,
  parent,
}: {
  slug: string | null;
  type: LinkableRecords;
  parent?: PageRecord | null;
}): string => {
  let pagePath = `/${slug}`;
  if (type === 'PageRecord' && parent) {
    const path = buildPathByParents(parent);
    pagePath = `${path}/${slug}`;
  }

  switch (type) {
    case 'PageRecord':
      return pagePath;
    default:
      return '';
  }
};

/** DatoCMS needs a slug for every page: the home page has «home» and is served at / (see next.config.js). */
export const HOME_PAGE_SLUG = 'home';

/** Public path of a DatoCMS page, with the home page at /. */
export const getPublicPagePath = (page: { slug: string; parent?: PageRecord | null }): string =>
  page.slug === HOME_PAGE_SLUG && !page.parent
    ? '/'
    : generatePathForRecord({ slug: page.slug, type: 'PageRecord', parent: page.parent });

/** Path of a page linked in DatoCMS (e.g. «Kontaktseite» in Header & Footer), or null if not set. */
export const getCmsPagePath = (page: { slug: string; parent?: PageRecord | null } | null | undefined): string | null =>
  page?.slug ? generatePathForRecord({ slug: page.slug, type: 'PageRecord', parent: page.parent }) : null;
