import type { CartItem } from '@/domain/shop/cart';
import { formatCartSelections } from '@/domain/shop/cart';
import { getShopProductPath } from '@/domain/shop/paths';
import { formatPriceToCHF } from '@/domain/shop/price';
import type { CartLine } from '@wehrli/design-system';

/** A cart line as the design system's CartLine. */
export const toCartLine = (item: CartItem): CartLine => ({
  id: item.id,
  name: item.productName,
  href: getShopProductPath(item.productSlug),
  imageUrl: item.imageUrl,
  selectionsLabel: formatCartSelections(item.selections),
  price: formatPriceToCHF(item.price),
  quantity: item.quantity,
});
