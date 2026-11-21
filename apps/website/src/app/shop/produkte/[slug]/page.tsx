import { catalog, content } from '@/integrations';
import { SitePage } from '@/components/layout/site-page';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Container } from '@wehrli/design-system';
import { ProductDetail } from '@/components/shop/product-detail';
import { ShopBrowseLayout } from '@/components/shop/shop-browse-layout';
import { JsonLd } from '@/components/seo/json-ld';
import { buildProductJsonLd } from '@/features/shop-seo/json-ld';
import { buildProductMetadata } from '@/features/shop-seo/metadata';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
  const slugs = await catalog.listProductSlugs();

  return slugs.map((slug) => ({ slug }));
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  const found = await catalog.getProduct(slug);

  if (!found) {
    return { title: 'Produkt nicht gefunden' };
  }

  return buildProductMetadata(found.product);
};

export default async function ShopProductPage({ params }: Props) {
  const { slug } = await params;
  const found = await catalog.getProduct(slug);

  if (!found) {
    notFound();
  }

  const { product, description } = found;

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
          <ProductDetail
            product={product}
            description={description}
            contactHref={contactPath}
            viewingHref={`${contactPath}#termin`}
          />
        </ShopBrowseLayout>
      </Container>
    </SitePage>
  );
}
