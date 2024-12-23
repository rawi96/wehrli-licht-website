import '@/styles/globals.css';
import { classNames } from '@/utils/css';
import PlausibleProvider from 'next-plausible';
import { draftMode } from 'next/headers';
import { ReactNode } from 'react';
import { DraftModeBanner } from './api/draft/draft-mode-banner';
import { ShopContextProvider } from './context/shop-context';
import { jost } from './fonts';

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="de" className="scroll-smooth">
    <head>
      <PlausibleProvider domain="wehrli-licht.ch" />
    </head>
    <body className={classNames(jost.className, 'h-full bg-white-200 antialiased')}>
      {draftMode().isEnabled && <DraftModeBanner />}
      <ShopContextProvider>{children}</ShopContextProvider>
    </body>
  </html>
);

export default RootLayout;
