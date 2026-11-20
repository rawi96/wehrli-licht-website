import { HeaderFooterRecord } from '@/graphql/generated';
import { getHeaderFooter } from '@/utils/get-header-footer';
import { draftMode } from 'next/headers';
import { FC, ReactNode } from 'react';
import { Footer } from './footer';
import { Header } from './header';

/** A standard page: header, the page's content and the footer. */
export const SitePage: FC<{ children: ReactNode }> = async ({ children }) => {
  const { isEnabled } = await draftMode();
  const headerFooter: HeaderFooterRecord = await getHeaderFooter(isEnabled);

  return (
    <main>
      <Header headerFooter={headerFooter} />
      {children}
      <Footer headerFooter={headerFooter} />
    </main>
  );
};
