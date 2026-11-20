import { SitePage } from '@/components/layout/site-page';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { CatalogHeader, Container } from '@wehrli/design-system';
import { ShopProductCatalog } from '@/components/shop/shop-product-catalog';
import { ShopBrowseLayout } from '@/components/shop/shop-browse-layout';
import { SHOP_ALL_PRODUCTS_PATH } from '@/domain/shop/paths';
import { buildAllProductsJsonLd } from '@/features/shop-seo/json-ld';
import { shopAllProductsMetadata } from '@/features/shop-seo/metadata';
import { catalog } from '@/integrations';
import { JsonLd } from '@/components/seo/json-ld';

export const revalidate = 3600;

export const metadata = shopAllProductsMetadata;

export default async function ShopAllProductsPage() {
  const products = await catalog.listProducts();

  return (
    <SitePage>
      <JsonLd data={buildAllProductsJsonLd(products)} />
      <Container>
        <Breadcrumbs
          spacing="tight"
          customBreadcrumbs={[
            { name: 'Shop', href: '/shop' },
            { name: 'Alle Leuchten', href: SHOP_ALL_PRODUCTS_PATH },
          ]}
        />
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
    </SitePage>
  );
}
