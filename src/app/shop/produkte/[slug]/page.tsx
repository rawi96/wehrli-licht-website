import { Breadcrumbs } from '@/components/breadcrumbs';
import { ContentWrapper } from '@/components/layout/content-wrapper';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import NotFound from '@/components/not-found';
import { ProductDetail } from '@/components/shop/product-detail';
import { HeaderFooterDocument, HeaderFooterRecord } from '@/graphql/generated';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import { getAllProducts, getProductBySlug } from '@/utils/shop';
import { Metadata } from 'next';
import { draftMode } from 'next/headers';

export const revalidate = 60;

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const allProducts = await getAllProducts();

  return allProducts.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params: { slug } }: Props): Promise<Metadata> {
  const product = await getProductBySlug(slug);

  return {
    title: product?.name ?? 'Produkt',
    description: product?.description ?? 'Beschreibung',
  };
}

export default async function ProductPage({ params: { slug } }: Props) {
  const product = await getProductBySlug(slug);
  // const bestsellers = await getBestsellers();

  if (!product) {
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
        <div className="mb-32">
          <Breadcrumbs
            customBreadcrumbs={[
              { name: 'Shop', href: '/shop' },
              { name: product.name ?? 'Prodikt', href: `/shop/produkte/${slug}` },
            ]}
          />
        </div>
        <ProductDetail product={product} />
        {/* {bestsellers && bestsellers?.length > 0 && <Bestsellers bestsellers={bestsellers} />} */}
      </ContentWrapper>
      <Footer headerFooter={headerFooter as HeaderFooterRecord} />
    </main>
  );
}
