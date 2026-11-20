import { SitePage } from '@/components/layout/site-page';
import { CheckoutCancelled, Container } from '@wehrli/design-system';
import { SHOP_HOME_PATH } from '@/domain/shop/paths';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zahlung abgebrochen',
  robots: { index: false, follow: false },
};

export default function CheckoutCancelledPage() {
  return (
    <SitePage>
      <Container>
        <CheckoutCancelled shopHref={SHOP_HOME_PATH} />
      </Container>
    </SitePage>
  );
}
