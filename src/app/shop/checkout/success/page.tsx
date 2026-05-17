import { ContentWrapper } from '@/components/layout/content-wrapper';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { CheckoutSuccess } from '@/components/shop/checkout-success';
import { HeaderFooterDocument, HeaderFooterRecord } from '@/graphql/generated';
import { resolveCheckoutSuccessStatus } from '@/lib/resolve-checkout-success-status';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import { Metadata } from 'next';
import { draftMode } from 'next/headers';

export const metadata: Metadata = {
  title: 'Bestellung erfolgreich',
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{
    session_id?: string;
    order_token?: string;
  }>;
};

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { session_id: sessionId, order_token: orderToken } = await searchParams;
  const { isEnabled } = await draftMode();
  const status = await resolveCheckoutSuccessStatus(sessionId, orderToken);

  const { headerFooter } = await queryDatoCMS({
    document: HeaderFooterDocument,
    includeDrafts: isEnabled,
  });

  return (
    <main>
      <Header headerFooter={headerFooter as HeaderFooterRecord} />
      <ContentWrapper>
        <CheckoutSuccess status={status} />
      </ContentWrapper>
      <Footer headerFooter={headerFooter as HeaderFooterRecord} />
    </main>
  );
}
