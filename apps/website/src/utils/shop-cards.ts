import { getShopCategoryPath, getShopProductPath } from '@/constants/shop-paths';
import { toImage } from '@/utils/image';
import { getLowestPriceFromProduct } from '@/utils/price';
import { ShopCategory, ShopProductListItem } from '@/utils/shop';
import type { ProductCardData, ShopCategoryCardData } from '@wehrli/design-system';

/** A product of a list as the design system's ProductCard. The image's alt text falls back to the product name. */
export const toProductCardData = (product: ShopProductListItem, basePath?: string): ProductCardData => {
  const image = product.images[0];

  return {
    id: product.id,
    name: product.name,
    href: getShopProductPath(product.slug, basePath),
    price: getLowestPriceFromProduct(product),
    image: image ? toImage({ ...image, alt: image.alt?.trim() ? image.alt : product.name }) : undefined,
  };
};

/** A category as the design system's category cards (description is HTML from the CMS). */
export const toShopCategoryCardData = (category: ShopCategory): ShopCategoryCardData => ({
  id: category.id,
  name: category.name,
  href: getShopCategoryPath(category.slug),
  descriptionHtml: category.description,
  image: toImage(category.image),
});
