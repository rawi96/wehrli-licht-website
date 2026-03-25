import '@/styles/globals.css';
import { classNames } from '@/utils/css';
import PlausibleProvider from 'next-plausible';
import { draftMode } from 'next/headers';
import { ReactNode } from 'react';
import { DraftModeBanner } from './api/draft/draft-mode-banner';
import { ShopContextProvider } from './context/shop-context';
import { jost } from './fonts';

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const { isEnabled } = await draftMode();

  return (
    <html lang="de" className="scroll-smooth">
      <head>
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
