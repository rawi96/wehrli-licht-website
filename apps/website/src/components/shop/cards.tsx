import { CmsHtml } from '@/components/cms-html';
import { toImageData } from '@/components/shop/catalog-image';
import type { Category } from '@/domain/shop/category';
import { getShopCategoryPath, getShopProductPath } from '@/domain/shop/paths';
import { getLowestPriceFromProduct } from '@/domain/shop/price';
import type { ProductSummary } from '@/domain/shop/product';
import type { ProductCardData, ShopCategoryCardData } from '@wehrli/design-system';

/** A product of a list as the design system's ProductCard. The image's alt text falls back to the product name. */
export const toProductCardData = (product: ProductSummary, basePath?: string): ProductCardData => ({
  id: product.id,
  name: product.name,
  href: getShopProductPath(product.slug, basePath),
  price: getLowestPriceFromProduct(product),
  image: toImageData(product.image, { fallbackAlt: product.name }),
});

/** A category as the design system's category cards; the description is HTML. */
export const toShopCategoryCardData = (category: Category): ShopCategoryCardData => ({
  id: category.id,
  name: category.name,
  href: getShopCategoryPath(category.slug),
  description: category.descriptionHtml ? <CmsHtml html={category.descriptionHtml} /> : null,
  image: toImageData(category.image),
});
