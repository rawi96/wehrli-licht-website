import { PageRecord } from '@/graphql/generated';
import { generatePathForRecord } from '@/utils/pathnames';

/** Path of a page linked in DatoCMS (e.g. «Kontaktseite» in Header & Footer), or null if not set. */
export const getCmsPagePath = (page: Pick<PageRecord, 'slug' | 'parent'> | null | undefined): string | null =>
  page?.slug ? generatePathForRecord({ slug: page.slug, type: 'PageRecord', parent: page.parent }) : null;
