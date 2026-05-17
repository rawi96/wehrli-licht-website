import { ContentWrapper } from '@/components/layout/content-wrapper';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { CheckoutPageContent } from '@/components/shop/checkout-page-content';
import { HeaderFooterDocument, HeaderFooterRecord } from '@/graphql/generated';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Kasse',
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const { isEnabled } = await draftMode();

  const { headerFooter } = await queryDatoCMS({
    document: HeaderFooterDocument,
    includeDrafts: isEnabled,
  });

  return (
    <main>
      <Header headerFooter={headerFooter as HeaderFooterRecord} />
      <ContentWrapper>
        <Suspense fallback={<p className="text-gray-600">Kasse wird geladen…</p>}>
          <CheckoutPageContent />
        </Suspense>
      </ContentWrapper>
      <Footer headerFooter={headerFooter as HeaderFooterRecord} />
    </main>
  );
}
