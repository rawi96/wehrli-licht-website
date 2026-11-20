import '@/styles/globals.css';
import '@/styles/highlight-teaser.css';
import { ContactClickTracking } from '@/components/analytics/contact-click-tracking';
import { CookieBanner } from '@/components/analytics/cookie-banner';
import { GoogleTag } from '@/components/analytics/google-tag';
import { SITE_DESCRIPTION, SiteJsonLd } from '@/components/seo/site-json-ld';
import { isTrackingEnabled } from '@/lib/analytics/config';
import { getSiteUrl } from '@/utils/site-url';
import { classNames } from '@/utils/css';
import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { ReactNode } from 'react';
import { DraftModeBanner } from './api/draft/draft-mode-banner';
import { ShopContextProvider } from './context/shop-context';
import { jost } from './fonts';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'Wehrli Licht GmbH',
    template: '%s | Wehrli Licht GmbH',
  },
  description: SITE_DESCRIPTION,
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
    // data-consent is set on <html> by the Google tag init script before hydration.
    <html lang="de" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.datocms-assets.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://www.datocms-assets.com" />
        <GoogleTag />
      </head>
      <body className={classNames(jost.className, 'bg-white-200 h-full antialiased')}>
        {isEnabled && <DraftModeBanner />}
        <SiteJsonLd />
        <ShopContextProvider>{children}</ShopContextProvider>
        {isTrackingEnabled && (
          <>
            <CookieBanner />
            <ContactClickTracking />
          </>
        )}
      </body>
    </html>
  );
};

export default RootLayout;
