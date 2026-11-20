import { HeaderFooterDocument, HeaderFooterRecord } from '@/graphql/generated';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import { cache } from 'react';

export const getHeaderFooter = cache(async (includeDrafts = false): Promise<HeaderFooterRecord> => {
  const { headerFooter } = await queryDatoCMS({
    document: HeaderFooterDocument,
    includeDrafts,
  });

  return headerFooter as HeaderFooterRecord;
});
