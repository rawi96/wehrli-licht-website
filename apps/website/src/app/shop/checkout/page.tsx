import { toCheckoutLabels } from '@/domain/checkout/labels';
import { content } from '@/integrations';
import { SitePage } from '@/components/layout/site-page';
import { CheckoutLoading, Container } from '@wehrli/design-system';
import { CheckoutPageContent } from '@/components/checkout/checkout-page-content';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Kasse',
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  return (
    <SitePage>
      <Container>
        <Suspense fallback={<CheckoutLoading text="Kasse wird geladen…" />}>
          <CheckoutPageContent
            contactHref={await content.getContactPath()}
            labels={toCheckoutLabels(await content.getSiteTexts())}
          />
        </Suspense>
      </Container>
    </SitePage>
  );
}
