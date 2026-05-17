import { sendStripeCheckoutOrderEmails } from '@/actions/checkout-emails';
import { ContentWrapper } from '@/components/layout/content-wrapper';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { CheckoutSuccess } from '@/components/shop/checkout-success';
import { HeaderFooterDocument, HeaderFooterRecord } from '@/graphql/generated';
import { isCheckoutEmailDelivered } from '@/lib/send-checkout-order-emails';
import { getStripe } from '@/lib/stripe';
import { CheckoutSuccessStatus } from '@/types/checkout-success-status';
import { verifyCheckoutOrderToken } from '@/utils/checkout-order-token';
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

async function resolveCheckoutSuccessStatus(
  sessionId: string | undefined,
  orderToken: string | undefined,
): Promise<CheckoutSuccessStatus> {
  const manualOrder = orderToken ? verifyCheckoutOrderToken(orderToken) : null;

  if (manualOrder) {
    return { kind: 'complete', channel: 'manual', order: manualOrder };
  }

  if (!sessionId) {
    return { kind: 'invalid' };
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const stripePaymentVerified = session.payment_status === 'paid';

    if (!stripePaymentVerified) {
      return { kind: 'invalid' };
    }

    const emailResult = await sendStripeCheckoutOrderEmails(sessionId);

    if (!isCheckoutEmailDelivered(emailResult)) {
      console.error('[checkout-email]', {
        context: 'stripe checkout success page',
        sessionId,
        technicalError: emailResult.message,
        skipped: emailResult.skipped,
      });

      return {
        kind: 'email_failed',
        channel: 'stripe',
      };
    }

    return { kind: 'complete', channel: 'stripe' };
  } catch {
    return { kind: 'invalid' };
  }
}

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
