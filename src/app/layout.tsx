import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { DirectoryRecord, LayoutDocument, NavigationItemRecord } from '@/graphql/generated';
import '@/styles/globals.css';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import PlausibleProvider from 'next-plausible';
import { ReactNode } from 'react';
import { inter } from './fonts';

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const { layout } = await queryDatoCMS({ document: LayoutDocument });
  const {
    menu,
    linkedinUrl,
    instagramUrl,
    facebookUrl,
    companyName,
    street,
    zip,
    place,
    phone,
    email,
    mapsLink,
    openingHours,
    holiday,
  } = layout ?? {};

  return (
    <html lang="de">
      <head>
        <PlausibleProvider domain="wehrli-licht.ch" />
      </head>
      <body className={`${inter.className} h-full bg-gray-50 antialiased`}>
        <Header menu={menu as NavigationItemRecord[] | DirectoryRecord[]} />
        {children}
        <Footer
          menu={menu as NavigationItemRecord[] | DirectoryRecord[]}
          linkedinUrl={linkedinUrl}
          instagramUrl={instagramUrl}
          facebookUrl={facebookUrl}
          companyName={companyName}
          street={street}
          zip={zip}
          place={place}
          phone={phone}
          email={email}
          mapsLink={mapsLink}
          openingHours={openingHours}
          holiday={holiday}
        />
      </body>
    </html>
  );
};

export default RootLayout;
