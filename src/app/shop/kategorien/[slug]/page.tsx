import { Breadcrumbs } from '@/components/breadcrumbs';
import { ContentWrapper } from '@/components/layout/content-wrapper';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Heading } from '@/components/nodes';
import NotFound from '@/components/not-found';
import { AllProductsForCategory } from '@/components/shop/all-products-for-category';
import { getHeaderFooter } from '@/utils/get-header-footer';
import { getAllCategorySlugs, getCategoryBySlug, getProductsByCategory } from '@/utils/shop';
import { JsonLd } from '@/components/seo/json-ld';
import { buildCategoryJsonLd, buildCategoryMetadata } from '@/utils/shop-seo';
import { Metadata } from 'next';
import { draftMode } from 'next/headers';

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
  const { isEnabled } = await draftMode();
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return <NotFound />;
  }

  const products = await getProductsByCategory(category.id);

  const headerFooter = await getHeaderFooter(isEnabled);

  return (
    <main>
      <JsonLd data={buildCategoryJsonLd(category, products)} />
      <Header headerFooter={headerFooter} />
      <ContentWrapper>
        <div className="mb-20">
          <Breadcrumbs
            customBreadcrumbs={[
              { name: 'Shop', href: '/shop' },
              { name: category.name, href: `/shop/kategorien/${slug}` },
            ]}
          />
        </div>
        <header className="mb-8 max-w-3xl">
          <Heading level="1">{category.name}</Heading>
          {category.description && (
            <p className="mt-4 text-sm lg:text-base" dangerouslySetInnerHTML={{ __html: category.description }} />
          )}
        </header>
        {products.length > 0 && (
          <section aria-labelledby="category-products-heading">
            <h2 id="category-products-heading" className="sr-only">
              {products.length === 1 ? '1 Produkt' : `${products.length} Produkte`} in {category.name}
            </h2>
            <AllProductsForCategory products={products} />
          </section>
        )}
      </ContentWrapper>
      <Footer headerFooter={headerFooter} />
    </main>
  );
}
