import 'server-only';
import { SiteTextsDocument } from '@/graphql/generated';
import { DEFAULT_SITE_TEXTS, type SiteTextKey, type SiteTexts } from '@/domain/content/site-texts';
import { cache } from 'react';
import { queryDatoCMS } from './client';
import { isDraftMode } from './draft';

/** The trimmed text, null if empty. */
const nonEmpty = (text?: string | null): string | null => (text?.trim() ? text.trim() : null);

const loadSiteTexts = cache(async (includeDrafts: boolean): Promise<SiteTexts> => {
  const { siteText, companyProfile } = await queryDatoCMS({ document: SiteTextsDocument, includeDrafts });
  // Fails to compile when a text of site-texts.json is missing in the query (run the migration and `pnpm generate`).
  const fromCms: Partial<Record<SiteTextKey, string | null>> = siteText ?? {};
  const texts = Object.fromEntries(
    (Object.keys(DEFAULT_SITE_TEXTS) as SiteTextKey[]).map((key) => [
      key,
      nonEmpty(fromCms[key]) ?? DEFAULT_SITE_TEXTS[key],
    ]),
  ) as Record<SiteTextKey, string>;

  return { ...texts, bankDetails: nonEmpty(companyProfile?.bankDetails) };
});

/** Texts of «Texte & Beschriftungen», with the defaults for empty ones. Without the CMS: the defaults. */
export const getSiteTexts = async (): Promise<SiteTexts> => {
  try {
    return await loadSiteTexts(await isDraftMode());
  } catch {
    // E.g. the 404 page or an e-mail while DatoCMS is unreachable.
    return { ...DEFAULT_SITE_TEXTS, bankDetails: null };
  }
};
