import { ContentWrapper } from '@/components/layout/content-wrapper';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Heading } from '@/components/nodes';
import NotFound from '@/components/not-found';
import { AllProductsForCategory } from '@/components/shop/all-products-for-category';
import { HeaderFooterDocument, HeaderFooterRecord } from '@/graphql/generated';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import { getAllCategories, getCategoryBySlug, getProductsByCategory } from '@/utils/shop';
import { Metadata } from 'next';
import { draftMode } from 'next/headers';

type Props = {
  params: {
    slug: string;
  };
};

export const revalidate = 60;

export async function generateStaticParams() {
  const allCategories = await getAllCategories();

  return allCategories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params: { slug } }: Props): Promise<Metadata> {
  const category = await getCategoryBySlug(slug);

  return {
    title: category?.name ?? 'Kategorie',
    description: category?.description ?? 'Beschreibung',
  };
}

export default async function CategoryPage({ params: { slug } }: Props) {
  const category = await getCategoryBySlug(slug);
  const products = await getProductsByCategory(slug);
  // const bestsellers = await getBestsellers();

  if (!category) {
    return <NotFound />;
  }

  const { headerFooter } = await queryDatoCMS({
    document: HeaderFooterDocument,
    includeDrafts: draftMode().isEnabled,
  });

  return (
    <main>
      <Header headerFooter={headerFooter as HeaderFooterRecord} />
      <ContentWrapper>
        <Heading level="1">{category.name}</Heading>
        <p className="peer my-2 md:max-w-prose lg:my-4" dangerouslySetInnerHTML={{ __html: category.description }} />
        {products && <AllProductsForCategory products={products} />}

        {/* {bestsellers && bestsellers?.length > 0 && <Bestsellers bestsellers={bestsellers} />} */}
      </ContentWrapper>
      <Footer headerFooter={headerFooter as HeaderFooterRecord} />
    </main>
  );
}
