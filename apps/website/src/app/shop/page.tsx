import { SitePage } from '@/components/layout/site-page';
import { JsonLd } from '@/components/seo/json-ld';
import { ShopStorefront } from '@/components/shop/shop-storefront';
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

  const [categories, featuredProducts, { shopPage }] = await Promise.all([
    getAllCategories(),
    getFeaturedShopProducts(),
    getShopPage(isEnabled),
  ]);

  if (!shopPage?.sections.length) {
    notFound();
  }

  const serviceSection = findShopServiceSection(shopPage.sections);
  const faqJsonLd = serviceSection ? buildShopStorefrontFaqJsonLd(serviceSection.items) : null;

  return (
    <SitePage>
      <JsonLd data={buildShopIndexJsonLd(categories, featuredProducts)} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <ShopStorefront sections={shopPage.sections} categories={categories} featuredProducts={featuredProducts} />
    </SitePage>
  );
}
