import { SitePage } from '@/components/layout/site-page';
import { JsonLd } from '@/components/seo/json-ld';
import { buildShopIndexJsonLd, buildShopStorefrontFaqJsonLd } from '@/features/shop-seo/json-ld';
import { shopIndexMetadata } from '@/features/shop-seo/metadata';
import { catalog } from '@/integrations';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await catalog.getShopStartPage();

  return page?.metadata ?? shopIndexMetadata;
}

export default async function ShopPage() {
  const [categories, featuredProducts, page] = await Promise.all([
    catalog.listCategories(),
    catalog.listFeaturedProducts(),
    catalog.getShopStartPage(),
  ]);

  if (!page) {
    notFound();
  }

  const faqJsonLd = buildShopStorefrontFaqJsonLd(page.faq);

  return (
    <SitePage>
      <JsonLd data={buildShopIndexJsonLd(categories, featuredProducts)} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      {page.content}
    </SitePage>
  );
}
