import type { CatalogImage } from '@/domain/shop/image';
import type { CatalogSeo } from '@/domain/shop/product';

/**
 * A product category of the shop.
 *
 * Its description is short formatted text maintained as HTML (bold, links, line breaks). HTML is kept as it is: it is
 * a neutral format any catalog can provide, the website renders it in one place (components/cms-html).
 */
export type Category = {
  id: string;
  name: string;
  slug: string;
  descriptionHtml: string | null;
  image: CatalogImage | null;
  seo: CatalogSeo;
};
