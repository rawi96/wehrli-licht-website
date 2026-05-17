import { CartSelection } from '@/utils/cart';

type CheckoutProduct = {
  id: string;
  name: string;
  slug: string;
  price?: number | null;
  images: { url: string }[];
  variants: {
    price: number;
    selections: CartSelection[];
  }[];
};

export const selectionsMatch = (a: CartSelection[], b: CartSelection[]): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  const normalized = (selections: CartSelection[]): CartSelection[] =>
    [...selections].sort((left, right) => left.option.localeCompare(right.option));

  const sortedA = normalized(a);
  const sortedB = normalized(b);

  return sortedA.every((selection, index) => {
    const other = sortedB[index];

    return selection.option === other?.option && selection.value === other?.value;
  });
};

export const resolveUnitPrice = (product: CheckoutProduct, selections?: CartSelection[]): number | null => {
  if (product.variants.length > 0) {
    if (!selections || selections.length === 0) {
      return null;
    }

    const variant = product.variants.find((entry) => selectionsMatch(entry.selections, selections));

    return variant?.price ?? null;
  }

  return typeof product.price === 'number' ? product.price : null;
};

export const formatLineItemName = (productName: string, selections?: CartSelection[]): string => {
  if (!selections || selections.length === 0) {
    return productName;
  }

  const variantLabel = selections.map((selection) => `${selection.option}: ${selection.value}`).join(', ');

  return `${productName} (${variantLabel})`;
};

export type { CheckoutProduct };
