import { ShopCategory, ShopProduct } from '@/utils/shop';

/** SEO only needs an image URL; works for list, detail and feed image fragments alike. */
type SeoImage = { url: string; responsiveImage?: { src: string } | null };

export type ProductForSeo = Pick<
  ShopProduct,
  | 'name'
  | 'slug'
  | 'seoTitle'
  | 'seoDescription'
  | 'seoNoindex'
  | 'description'
  | 'categories'
  | 'price'
  | 'variants'
  | 'power'
  | 'brightness'
  | 'lightColor'
  | 'deliveryTime'
  | 'dimmable'
> & { images: SeoImage[] };

export type CategoryForSeo = Pick<
  ShopCategory,
  'name' | 'slug' | 'seoTitle' | 'seoDescription' | 'seoNoindex' | 'description' | 'image'
>;

export type ProductListItemForSeo = Pick<ShopProduct, 'name' | 'slug'> & { images: SeoImage[] };
