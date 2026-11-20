import { Button, Container } from '@wehrli/design-system';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { HeaderFooterDocument, HeaderFooterRecord } from '@/graphql/generated';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import { Metadata } from 'next';
import { draftMode } from 'next/headers';

export const metadata: Metadata = {
  title: 'Zahlung abgebrochen',
  robots: { index: false, follow: false },
};

export default async function CheckoutCancelledPage() {
  const { isEnabled } = await draftMode();

  const { headerFooter } = await queryDatoCMS({
    document: HeaderFooterDocument,
    includeDrafts: isEnabled,
  });

  return (
    <main>
      <Header headerFooter={headerFooter as HeaderFooterRecord} />
      <Container>
        <div className="mx-auto max-w-lg py-12">
          <h1 className="text-xl font-bold">Zahlung abgebrochen</h1>
          <p className="mt-2 text-sm">Warenkorb ist noch da.</p>
          <div className="mt-8">
            <Button variant="primary" href="/shop" showArrow={false}>
              Zum Shop
            </Button>
          </div>
        </div>
      </Container>
      <Footer headerFooter={headerFooter as HeaderFooterRecord} />
    </main>
  );
}
