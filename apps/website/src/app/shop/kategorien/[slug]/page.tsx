import { SitePage } from '@/components/layout/site-page';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { CatalogHeader, Container } from '@wehrli/design-system';
import { CmsHtml } from '@/components/cms-html';
import NotFound from '@/components/not-found';
import { ShopProductCatalog } from '@/components/shop/shop-product-catalog';
import { ShopBrowseLayout } from '@/components/shop/shop-browse-layout';
import { getAllCategorySlugs, getCategoryBySlug, getProductsByCategory } from '@/utils/shop';
import { JsonLd } from '@/components/seo/json-ld';
import { buildCategoryJsonLd, buildCategoryMetadata } from '@/utils/shop-seo';
import { Metadata } from 'next';

export const revalidate = 3600;

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
  const slugs = await getAllCategorySlugs();

  return slugs.map((slug) => ({ slug }));
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: 'Kategorie nicht gefunden' };
  }

  return buildCategoryMetadata(category);
};

export default async function ShopCategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return <NotFound />;
  }

  const products = await getProductsByCategory(category.id);

  return (
    <SitePage>
      <JsonLd data={buildCategoryJsonLd(category, products)} />
      <Container>
        <Breadcrumbs
          spacing="tight"
          customBreadcrumbs={[
            { name: 'Shop', href: '/shop' },
            { name: category.name, href: `/shop/kategorien/${slug}` },
          ]}
        />
        <ShopBrowseLayout activeCategorySlug={slug}>
          <CatalogHeader
            title={category.name}
            description={category.description ? <CmsHtml html={category.description} /> : null}
          />
          {products.length > 0 && (
            <ShopProductCatalog
              products={products}
              headingId="category-products-heading"
              heading={`${products.length === 1 ? '1 Produkt' : `${products.length} Produkte`} in ${category.name}`}
            />
          )}
        </ShopBrowseLayout>
      </Container>
    </SitePage>
  );
}
