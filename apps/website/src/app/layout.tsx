import '@/styles/globals.css';
import { ContactClickTracking } from '@/components/analytics/contact-click-tracking';
import { CookieBanner } from '@/components/analytics/cookie-banner';
import { GoogleTag } from '@/components/analytics/google-tag';
import { SiteJsonLd } from '@/components/seo/site-json-ld';
import { isTrackingEnabled } from '@/lib/analytics/config';
import { getSiteUrl } from '@/utils/site-url';
import { classNames } from '@/utils/css';
import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { ReactNode } from 'react';
import { DraftModeBanner } from './api/draft/draft-mode-banner';
import { ShopContextProvider } from './context/shop-context';
import { jost } from './fonts';
import { SITE_NAME } from '@/constants/site';
import { getCmsPagePath } from '@/utils/cms-page-path';
import { getHeaderFooter } from '@/utils/get-header-footer';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  openGraph: {
    type: 'website',
    locale: 'de_CH',
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
  },
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const { isEnabled } = await draftMode();
  // Only needed for the cookie banner; the banner still works without the link if DatoCMS fails.
  const privacyHref = isTrackingEnabled ? getCmsPagePath((await getHeaderFooter().catch(() => null))?.privacyPage) : null;

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
            <CookieBanner privacyHref={privacyHref} />
            <ContactClickTracking />
          </>
        )}
      </body>
    </html>
  );
};

export default RootLayout;
