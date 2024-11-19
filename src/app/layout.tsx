import '@/styles/globals.css';
import PlausibleProvider from 'next-plausible';
import { draftMode } from 'next/headers';
import { ReactNode } from 'react';
import { DraftModeBanner } from './api/draft/draft-mode-banner';
import { ShopContextProvider } from './context/shop-context';
import { inter } from './fonts';

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="de" className="scroll-smooth">
    <head>
      <PlausibleProvider domain="wehrli-licht.ch" />
    </head>
    <body className={`${inter.className} h-full bg-gray-100 antialiased`}>
      {draftMode().isEnabled && <DraftModeBanner />}
      <ShopContextProvider>{children}</ShopContextProvider>
    </body>
  </html>
);

export default RootLayout;
