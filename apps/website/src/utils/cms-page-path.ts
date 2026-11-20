import { PageRecord } from '@/graphql/generated';
import { generatePathForRecord } from '@/utils/pathnames';

/** Path of a page linked in DatoCMS (e.g. «Kontaktseite» in Header & Footer), or null if not set. */
export const getCmsPagePath = (page: Pick<PageRecord, 'slug' | 'parent'> | null | undefined): string | null =>
  page?.slug ? generatePathForRecord({ slug: page.slug, type: 'PageRecord', parent: page.parent }) : null;

/** Used when no contact page is set in Header & Footer. */
const FALLBACK_CONTACT_PATH = '/kontakt';

/** Path of the contact page set in DatoCMS (Header & Footer → «Kontaktseite»). */
export const getContactPath = (headerFooter: { contactPage?: Pick<PageRecord, 'slug' | 'parent'> | null } | null): string =>
  getCmsPagePath(headerFooter?.contactPage) ?? FALLBACK_CONTACT_PATH;
