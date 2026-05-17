import { Breadcrumbs } from '@/components/breadcrumbs';
import { ContentWrapper } from '@/components/layout/content-wrapper';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import NotFound from '@/components/not-found';
import { ProductDetail } from '@/components/shop/product-detail';
import { HeaderFooterDocument, HeaderFooterRecord } from '@/graphql/generated';
import { JsonLd } from '@/components/seo/json-ld';
import { getAllProductSlugs, getProductBySlug } from '@/utils/shop';
import { buildProductJsonLd, buildProductMetadata } from '@/utils/shop-seo';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import { Metadata } from 'next';
import { draftMode } from 'next/headers';

export const revalidate = 60;

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Produkt nicht gefunden' };
  }

  return buildProductMetadata(product);
}

export default async function ShopProductPage({ params }: Props) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const product = await getProductBySlug(slug);

  if (!product) {
    return <NotFound />;
  }

  const { headerFooter } = await queryDatoCMS({
    document: HeaderFooterDocument,
    includeDrafts: isEnabled,
  });

  return (
    <main>
      <JsonLd data={buildProductJsonLd(product)} />
      <Header headerFooter={headerFooter as HeaderFooterRecord} />
      <ContentWrapper>
        <div className="mb-32">
          <Breadcrumbs
            customBreadcrumbs={[
              { name: 'Shop', href: '/shop' },
              { name: product.name, href: `/shop/produkte/${slug}` },
            ]}
          />
        </div>
        <ProductDetail product={product} />
      </ContentWrapper>
      <Footer headerFooter={headerFooter as HeaderFooterRecord} />
    </main>
  );
}
