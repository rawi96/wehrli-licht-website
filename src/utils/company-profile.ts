import { CompanyProfileDocument, CompanyProfileQuery } from '@/graphql/generated';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import { cache } from 'react';

export type CompanyProfile = NonNullable<CompanyProfileQuery['companyProfile']>;

/** Business facts for structured data and llms.txt, maintained in DatoCMS («Firmenprofil»). */
export const getCompanyProfile = cache(async (): Promise<CompanyProfile | null> => {
  const { companyProfile } = await queryDatoCMS({ document: CompanyProfileDocument });

  return companyProfile;
});

/** Multi-line CMS text field («one entry per line») to a list. */
export const toLines = (text: string | null | undefined): string[] =>
  (text ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
