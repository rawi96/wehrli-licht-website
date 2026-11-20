import { PRODUCT_TECHNICAL_FIELDS } from '@/constants/product-technical-fields';
import { ShopProduct } from '@/utils/shop';
import type { SpecRow, VariationOption } from '@wehrli/design-system';

export type ProductVariant = ShopProduct['variants'][number];
export type SelectedOptions = Record<string, string>;

/** The options of a product's variants (colour, size, ...) with their values, in the order they appear. */
export const getVariationOptions = (variants: ProductVariant[]): VariationOption[] => {
  const groups = new Map<string, Set<string>>();

  for (const variant of variants) {
    for (const selection of variant.selections) {
      const values = groups.get(selection.option) ?? new Set<string>();
      values.add(selection.value);
      groups.set(selection.option, values);
    }
  }

  return [...groups.entries()].map(([option, values]) => ({ option, values: [...values] }));
};

/** The chosen value per option: what the customer picked, else the first value. */
export const resolveSelectedOptions = (options: VariationOption[], picked: SelectedOptions): SelectedOptions => {
  const resolved: SelectedOptions = {};

  for (const group of options) {
    resolved[group.option] = picked[group.option] || (group.values[0] ?? '');
  }

  return resolved;
};

export const findMatchingVariant = (variants: ProductVariant[], selected: SelectedOptions): ProductVariant | null =>
  variants.find((variant) => variant.selections.every((selection) => selected[selection.option] === selection.value)) ??
  null;

/** The product's technical data that is set, with German labels. */
export const getProductSpecRows = (product: ShopProduct): SpecRow[] => {
  const rows: SpecRow[] = [];

  for (const field of PRODUCT_TECHNICAL_FIELDS) {
    const value = product[field.key];

    if (field.type === 'boolean') {
      if (value) {
        rows.push({ label: field.label, value: 'Ja' });
      }
      continue;
    }

    const text = typeof value === 'string' ? value.trim() : '';
    if (text) {
      rows.push({ label: field.label, value: text });
    }
  }

  return rows;
};
