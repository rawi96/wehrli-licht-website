import { content } from '@/integrations';
import { FC, ReactNode } from 'react';
import { Footer } from './footer';
import { Header } from './header';

/** A standard page: header, the page's content and the footer. */
export const SitePage: FC<{ children: ReactNode }> = async ({ children }) => {
  const layout = await content.getSiteLayout();

  return (
    <main>
      <Header navigation={layout.navigation} contactLink={layout.contactLink} />
      {children}
      <Footer layout={layout} />
    </main>
  );
};
