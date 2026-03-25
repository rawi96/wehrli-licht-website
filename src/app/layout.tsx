import '@/styles/globals.css';
import { classNames } from '@/utils/css';
import PlausibleProvider from 'next-plausible';
import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { ReactNode } from 'react';
import { DraftModeBanner } from './api/draft/draft-mode-banner';
import { ShopContextProvider } from './context/shop-context';
import { jost } from './fonts';

export const metadata: Metadata = {
  metadataBase: new URL('https://wehrli-licht.ch'),
  title: {
    default: 'Wehrli Licht GmbH',
    template: '%s | Wehrli Licht GmbH',
  },
  description:
    'Wehrli Licht GmbH – Lichtberatung, Lichtplanung und hochwertige Leuchten in Goldach. Massgefertigte Lampenschirme und individuelle Lichtlösungen.',
  openGraph: {
    type: 'website',
    locale: 'de_CH',
    siteName: 'Wehrli Licht GmbH',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const { isEnabled } = await draftMode();

  return (
    <html lang="de" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://www.datocms-assets.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://www.datocms-assets.com" />
        <PlausibleProvider domain="wehrli-licht.ch" />
      </head>
      <body className={classNames(jost.className, 'bg-white-200 h-full antialiased')}>
        {isEnabled && <DraftModeBanner />}
        <ShopContextProvider>{children}</ShopContextProvider>
      </body>
    </html>
  );
};

export default RootLayout;
