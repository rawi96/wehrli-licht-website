import { Breadcrumbs } from '@/components/breadcrumbs';
import { ContentWrapper } from '@/components/layout/content-wrapper';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Heading } from '@/components/nodes';
import { ShopProductCatalog } from '@/components/shop/shop-product-catalog';
import { ShopBrowseLayout } from '@/components/shop/shop-browse-layout';
import { SHOP_ALL_PRODUCTS_PATH } from '@/constants/shop-paths';
import { getHeaderFooter } from '@/utils/get-header-footer';
import { getAllShopProducts } from '@/utils/shop';
import { buildAllProductsJsonLd, shopAllProductsMetadata } from '@/utils/shop-seo';
import { JsonLd } from '@/components/seo/json-ld';
import { draftMode } from 'next/headers';

export const revalidate = 3600;

export const metadata = shopAllProductsMetadata;

export default async function ShopAllProductsPage() {
  const { isEnabled } = await draftMode();
  const [products, headerFooter] = await Promise.all([getAllShopProducts(), getHeaderFooter(isEnabled)]);

  return (
    <main>
      <JsonLd data={buildAllProductsJsonLd(products)} />
      <Header headerFooter={headerFooter} />
      <ContentWrapper>
        <div className="mb-20">
          <Breadcrumbs
            customBreadcrumbs={[
              { name: 'Shop', href: '/shop' },
              { name: 'Alle Leuchten', href: SHOP_ALL_PRODUCTS_PATH },
            ]}
          />
        </div>
        <ShopBrowseLayout showAllProductsActive>
          <header className="mb-8 max-w-3xl">
            <Heading level="1">Alle Leuchten</Heading>
            <p className="mt-4 text-sm lg:text-base">
              Entdecken Sie unser gesamtes Sortiment an Pendel-, Decken-, Wand- und Tischleuchten – oder wählen Sie eine
              Kategorie in der Navigation.
            </p>
          </header>
          {products.length > 0 && (
            <section aria-labelledby="all-products-heading">
              <h2 id="all-products-heading" className="sr-only">
                {products.length === 1 ? '1 Leuchte' : `${products.length} Leuchten`} im Shop
              </h2>
              <ShopProductCatalog products={products} />
            </section>
          )}
        </ShopBrowseLayout>
      </ContentWrapper>
      <Footer headerFooter={headerFooter} />
    </main>
  );
}
