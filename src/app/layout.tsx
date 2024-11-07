import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { HeaderFooterDocument, HeaderFooterRecord } from '@/graphql/generated';
import '@/styles/globals.css';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import PlausibleProvider from 'next-plausible';
import { ReactNode } from 'react';
import { inter } from './fonts';

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const { headerFooter } = await queryDatoCMS({ document: HeaderFooterDocument });

  return (
    <html lang="de" className="scroll-smooth">
      <head>
        <PlausibleProvider domain="wehrli-licht.ch" />
      </head>
      <body className={`${inter.className} h-full bg-gray-50 antialiased`}>
        <Header headerFooter={headerFooter as HeaderFooterRecord} />
        {children}
        <Footer headerFooter={headerFooter as HeaderFooterRecord} />
      </body>
    </html>
  );
};

export default RootLayout;
