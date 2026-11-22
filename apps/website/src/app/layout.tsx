import '@/styles/globals.css';
import { ContactClickTracking } from '@/components/analytics/contact-click-tracking';
import { CookieBanner } from '@/components/analytics/cookie-banner';
import { SiteJsonLd } from '@/components/seo/site-json-ld';
import { analytics } from '@/integrations/client';
import { getSiteUrl } from '@/lib/site-url';
import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { ReactNode } from 'react';
import { DraftModeBanner } from '@/components/layout/draft-mode-banner';
import { ShopContextProvider } from '@/components/shop/shop-context';
import { ShoppingCart } from '@/components/shop/shopping-cart';
import { jost } from './fonts';
import { SITE_NAME } from '@/lib/site';
import { content } from '@/integrations';
import { cn } from '@wehrli/design-system';

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
  // Only needed for the cookie banner; the banner still works without the link if the CMS fails.
  const privacyHref = analytics.isEnabled
    ? await content.getSiteLayout().then(
        ({ privacyPath }) => privacyPath,
        () => null,
      )
    : null;

  return (
    // data-consent is set on <html> by the Google tag init script before hydration.
    <html lang="de" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href={content.assetOrigin} crossOrigin="" />
        <link rel="dns-prefetch" href={content.assetOrigin} />
        <analytics.HeadScripts />
      </head>
      <body className={cn(jost.className, 'h-full bg-gray-50 antialiased')}>
        {isEnabled && <DraftModeBanner />}
        <SiteJsonLd />
        <ShopContextProvider>
          {children}
          <ShoppingCart />
        </ShopContextProvider>
        {analytics.isEnabled && (
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
