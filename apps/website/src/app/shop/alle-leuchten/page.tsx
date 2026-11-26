import { SitePage } from '@/components/layout/site-page';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { CatalogHeader, Container, PageHeadBreadcrumbs } from '@wehrli/design-system';
import { ShopProductCatalog } from '@/components/shop/shop-product-catalog';
import { ShopBrowseLayout } from '@/components/shop/shop-browse-layout';
import { SHOP_ALL_PRODUCTS_PATH } from '@/domain/shop/paths';
import { buildAllProductsJsonLd } from '@/features/shop-seo/json-ld';
import { shopAllProductsMetadata } from '@/features/shop-seo/metadata';
import { catalog, content } from '@/integrations';
import { JsonLd } from '@/components/seo/json-ld';

export const revalidate = 3600;

export async function generateMetadata() {
  const texts = await content.getSiteTexts();

  return shopAllProductsMetadata({ title: texts.allLightsSeoTitle, description: texts.allLightsSeoDescription });
}

export default async function ShopAllProductsPage() {
  const [products, texts] = await Promise.all([catalog.listProducts(), content.getSiteTexts()]);

  return (
    <SitePage>
      <JsonLd data={buildAllProductsJsonLd(products)} />
      <Container>
        <PageHeadBreadcrumbs>
          <Breadcrumbs
            spacing="tight"
            customBreadcrumbs={[
              { name: 'Shop', href: '/shop' },
              { name: texts.allLightsTitle, href: SHOP_ALL_PRODUCTS_PATH },
            ]}
          />
        </PageHeadBreadcrumbs>
        <ShopBrowseLayout showAllProductsActive>
          <CatalogHeader title={texts.allLightsTitle} description={texts.allLightsIntro} />
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
