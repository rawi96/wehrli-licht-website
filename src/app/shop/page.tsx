import { Breadcrumbs } from '@/components/breadcrumbs';
import { ContentWrapper } from '@/components/layout/content-wrapper';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Heading } from '@/components/nodes';
import { AllCategoriesGrid } from '@/components/shop/all-categories-grid';
import { HeaderFooterDocument, HeaderFooterRecord } from '@/graphql/generated';
import { getAllCategories } from '@/utils/shop';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import { JsonLd } from '@/components/seo/json-ld';
import { buildShopOrganizationJsonLd, shopIndexMetadata } from '@/utils/shop-seo';
import { draftMode } from 'next/headers';

import { CONTENT_REVALIDATE_SECONDS } from '@/constants/cache-revalidation';

export const revalidate = CONTENT_REVALIDATE_SECONDS;

export const metadata = shopIndexMetadata;

export default async function ShopPage() {
  const { isEnabled } = await draftMode();
  const categories = await getAllCategories();

  const { headerFooter } = await queryDatoCMS({
    document: HeaderFooterDocument,
    includeDrafts: isEnabled,
  });

  return (
    <main>
      <JsonLd data={buildShopOrganizationJsonLd()} />
      <Header headerFooter={headerFooter as HeaderFooterRecord} />
      <ContentWrapper>
        <div className="mb-20">
          <Breadcrumbs customBreadcrumbs={[{ name: 'Shop', href: '/shop' }]} />
        </div>
        <Heading level="1">Shop</Heading>
        <AllCategoriesGrid categories={categories} disableMarginTop />
      </ContentWrapper>
      <Footer headerFooter={headerFooter as HeaderFooterRecord} />
    </main>
  );
}
