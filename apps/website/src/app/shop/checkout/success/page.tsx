import { content } from '@/integrations';
import { SitePage } from '@/components/layout/site-page';
import { Container } from '@wehrli/design-system';
import { CheckoutSuccess } from '@/components/checkout/checkout-success';
import { resolveCheckoutSuccessStatus } from '@/features/checkout/service';
import { Metadata } from 'next';

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
  const status = await resolveCheckoutSuccessStatus(sessionId, orderToken);

  return (
    <SitePage>
      <Container>
        <CheckoutSuccess status={status} contactHref={await content.getContactPath()} />
      </Container>
    </SitePage>
  );
}
