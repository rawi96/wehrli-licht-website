import { content } from '@/integrations';
import { FC, ReactNode } from 'react';
import { Footer } from './footer';
import { Header } from './header';

/** A standard page: header, the page's content and the footer. */
export const SitePage: FC<{ children: ReactNode }> = async ({ children }) => {
  const [layout, texts] = await Promise.all([content.getSiteLayout(), content.getSiteTexts()]);

  return (
    <main>
      <Header
        navigation={layout.navigation}
        contactLink={layout.contactLink}
        shopMenu={layout.shopMenu}
        labels={{ overview: texts.menuOverviewLabel, shopOverview: texts.menuShopOverviewLabel }}
      />
      {children}
      <Footer layout={layout} rightsReserved={texts.footerRights} />
    </main>
  );
};
