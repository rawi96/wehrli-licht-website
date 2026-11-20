import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { JsonLd } from '@/components/seo/json-ld';
import { ShopStorefront } from '@/components/shop/shop-storefront';
import { HeaderFooterDocument, HeaderFooterRecord } from '@/graphql/generated';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import { findShopServiceSection } from '@/utils/shop-page-sections';
import { getAllCategories, getFeaturedShopProducts, getShopPage } from '@/utils/shop';
import { buildShopIndexJsonLd, buildShopStorefrontFaqJsonLd, shopIndexMetadata } from '@/utils/shop-seo';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { toNextMetadata } from 'react-datocms/seo';

export const revalidate = 3600;

export async function generateMetadata() {
  const { isEnabled } = await draftMode();
  const { site, shopPage } = await getShopPage(isEnabled);

  if (shopPage?.seo?.length) {
    return toNextMetadata([...site.favicon, ...shopPage.seo]);
  }

  return shopIndexMetadata;
}

export default async function ShopPage() {
  const { isEnabled } = await draftMode();

  const [categories, featuredProducts, { headerFooter }, { shopPage }] = await Promise.all([
    getAllCategories(),
    getFeaturedShopProducts(),
    queryDatoCMS({
      document: HeaderFooterDocument,
      includeDrafts: isEnabled,
    }),
    getShopPage(isEnabled),
  ]);

  if (!shopPage?.sections.length) {
    notFound();
  }

  const serviceSection = findShopServiceSection(shopPage.sections);
  const faqJsonLd = serviceSection ? buildShopStorefrontFaqJsonLd(serviceSection.items) : null;

  return (
    <main>
      <JsonLd data={buildShopIndexJsonLd(categories, featuredProducts)} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <Header headerFooter={headerFooter as HeaderFooterRecord} />
      <ShopStorefront sections={shopPage.sections} categories={categories} featuredProducts={featuredProducts} />
      <Footer headerFooter={headerFooter as HeaderFooterRecord} />
    </main>
  );
}
