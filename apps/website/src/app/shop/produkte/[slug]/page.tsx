import { Breadcrumbs } from '@/components/breadcrumbs';
import { Container } from '@wehrli/design-system';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import NotFound from '@/components/not-found';
import { ProductDetail } from '@/components/shop/product-detail';
import { ShopBrowseLayout } from '@/components/shop/shop-browse-layout';
import { JsonLd } from '@/components/seo/json-ld';
import { getHeaderFooter } from '@/utils/get-header-footer';
import { getAllProductSlugs, getProductBySlug } from '@/utils/shop';
import { buildProductJsonLd, buildProductMetadata } from '@/utils/shop-seo';
import { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { getCmsPagePath, getContactPath } from '@/utils/cms-page-path';

export const revalidate = 3600;

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
  const slugs = await getAllProductSlugs();

  return slugs.map((slug) => ({ slug }));
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Produkt nicht gefunden' };
  }

  return buildProductMetadata(product);
};

export default async function ShopProductPage({ params }: Props) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const product = await getProductBySlug(slug);

  if (!product) {
    return <NotFound />;
  }

  const headerFooter = await getHeaderFooter(isEnabled);

  return (
    <main>
      <JsonLd data={buildProductJsonLd(product)} />
      <Header headerFooter={headerFooter} />
      <Container>
        <div className="mb-32">
          <Breadcrumbs
            customBreadcrumbs={[
              { name: 'Shop', href: '/shop' },
              { name: product.name, href: `/shop/produkte/${slug}` },
            ]}
          />
        </div>
        <ShopBrowseLayout>
          <ProductDetail
            product={product}
            contactHref={getCmsPagePath(headerFooter.contactPage)}
            viewingHref={`${getContactPath(headerFooter)}#termin`}
          />
        </ShopBrowseLayout>
      </Container>
      <Footer headerFooter={headerFooter} />
    </main>
  );
}
