import { content } from '@/integrations';
import { SitePage } from '@/components/layout/site-page';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Container } from '@wehrli/design-system';
import NotFound from '@/components/not-found';
import { ProductDetail } from '@/components/shop/product-detail';
import { ShopBrowseLayout } from '@/components/shop/shop-browse-layout';
import { JsonLd } from '@/components/seo/json-ld';
import { getAllProductSlugs, getProductBySlug } from '@/utils/shop';
import { buildProductJsonLd, buildProductMetadata } from '@/utils/shop-seo';
import { Metadata } from 'next';

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
  const product = await getProductBySlug(slug);

  if (!product) {
    return <NotFound />;
  }

  const contactPath = await content.getContactPath();

  return (
    <SitePage>
      <JsonLd data={buildProductJsonLd(product)} />
      <Container>
        <Breadcrumbs
          spacing="loose"
          customBreadcrumbs={[
            { name: 'Shop', href: '/shop' },
            { name: product.name, href: `/shop/produkte/${slug}` },
          ]}
        />
        <ShopBrowseLayout>
          <ProductDetail product={product} contactHref={contactPath} viewingHref={`${contactPath}#termin`} />
        </ShopBrowseLayout>
      </Container>
    </SitePage>
  );
}
