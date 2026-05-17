import { ShopCategory, ShopProduct } from '@/utils/shop';

export type ProductForSeo = Pick<
  ShopProduct,
  | 'name'
  | 'slug'
  | 'seoTitle'
  | 'seoDescription'
  | 'seoNoindex'
  | 'description'
  | 'images'
  | 'categories'
  | 'price'
  | 'variants'
  | 'power'
  | 'brightness'
  | 'lightColor'
  | 'deliveryTime'
  | 'dimmable'
>;

export type CategoryForSeo = Pick<
  ShopCategory,
  'name' | 'slug' | 'seoTitle' | 'seoDescription' | 'seoNoindex' | 'description' | 'image'
>;
