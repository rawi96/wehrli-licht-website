export {
  buildCategoryDescription,
  buildCategoryTitle,
  buildProductDescription,
  buildProductTitle,
  getProductOfferPrice,
  primaryCategory,
} from '@/utils/shop-seo/copy';
export { buildCategoryMetadata, buildProductMetadata, shopIndexMetadata } from '@/utils/shop-seo/metadata';
export {
  buildCategoryJsonLd,
  buildProductJsonLd,
  buildShopIndexJsonLd,
  buildShopOrganizationJsonLd,
} from '@/utils/shop-seo/json-ld';
export type { CategoryForSeo, ProductForSeo, ProductListItemForSeo } from '@/utils/shop-seo/types';
