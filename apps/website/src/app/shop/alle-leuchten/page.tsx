import { Breadcrumbs } from '@/components/breadcrumbs';
import { CatalogHeader, Container } from '@wehrli/design-system';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
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
      <Container>
        <div className="mb-20">
          <Breadcrumbs
            customBreadcrumbs={[
              { name: 'Shop', href: '/shop' },
              { name: 'Alle Leuchten', href: SHOP_ALL_PRODUCTS_PATH },
            ]}
          />
        </div>
        <ShopBrowseLayout showAllProductsActive>
          <CatalogHeader
            title="Alle Leuchten"
            description="Entdecken Sie unser gesamtes Sortiment an Pendel-, Decken-, Wand- und Tischleuchten – oder wählen Sie eine Kategorie in der Navigation."
          />
          {products.length > 0 && (
            <ShopProductCatalog
              products={products}
              headingId="all-products-heading"
              heading={`${products.length === 1 ? '1 Leuchte' : `${products.length} Leuchten`} im Shop`}
            />
          )}
        </ShopBrowseLayout>
      </Container>
      <Footer headerFooter={headerFooter} />
    </main>
  );
}
