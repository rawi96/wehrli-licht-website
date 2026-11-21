import { SitePage } from '@/components/layout/site-page';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { CatalogHeader, Container } from '@wehrli/design-system';
import { CmsHtml } from '@/components/cms-html';
import { ShopProductCatalog } from '@/components/shop/shop-product-catalog';
import { ShopBrowseLayout } from '@/components/shop/shop-browse-layout';
import { JsonLd } from '@/components/seo/json-ld';
import { buildCategoryJsonLd } from '@/features/shop-seo/json-ld';
import { buildCategoryMetadata } from '@/features/shop-seo/metadata';
import { catalog } from '@/integrations';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
  const slugs = await catalog.listCategorySlugs();

  return slugs.map((slug) => ({ slug }));
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  const found = await catalog.getCategory(slug);

  if (!found) {
    return { title: 'Kategorie nicht gefunden' };
  }

  return buildCategoryMetadata(found.category);
};

export default async function ShopCategoryPage({ params }: Props) {
  const { slug } = await params;
  const found = await catalog.getCategory(slug);

  if (!found) {
    notFound();
  }

  const { category, products } = found;

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
            description={category.descriptionHtml ? <CmsHtml html={category.descriptionHtml} /> : null}
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
