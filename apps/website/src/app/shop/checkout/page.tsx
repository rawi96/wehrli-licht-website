import { CheckoutLoading, Container } from '@wehrli/design-system';
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
      <Container>
        <Suspense fallback={<CheckoutLoading text="Kasse wird geladen…" />}>
          <CheckoutPageContent />
        </Suspense>
      </Container>
      <Footer headerFooter={headerFooter as HeaderFooterRecord} />
    </main>
  );
}
