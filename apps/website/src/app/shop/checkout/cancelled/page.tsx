import { CheckoutCancelled, Container } from '@wehrli/design-system';
import { SHOP_HOME_PATH } from '@/constants/shop-paths';
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
        <CheckoutCancelled shopHref={SHOP_HOME_PATH} />
      </Container>
      <Footer headerFooter={headerFooter as HeaderFooterRecord} />
    </main>
  );
}
