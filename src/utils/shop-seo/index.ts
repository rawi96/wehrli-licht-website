export {
  buildCategoryDescription,
  buildCategoryTitle,
  buildProductDescription,
  buildProductTitle,
  getProductOfferPrice,
  primaryCategory,
} from '@/utils/shop-seo/copy';
export {
  buildCategoryMetadata,
  buildProductMetadata,
  shopAllProductsMetadata,
  shopIndexMetadata,
} from '@/utils/shop-seo/metadata';
export {
  buildAllProductsJsonLd,
  buildCategoryJsonLd,
  buildProductJsonLd,
  buildShopIndexJsonLd,
  buildShopOrganizationJsonLd,
  buildShopStorefrontFaqJsonLd,
} from '@/utils/shop-seo/json-ld';
export type { CategoryForSeo, ProductForSeo, ProductListItemForSeo } from '@/utils/shop-seo/types';
