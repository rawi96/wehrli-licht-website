import type { Product, ProductVariant } from '@/domain/shop/product';
import { PRODUCT_TECHNICAL_FIELDS } from '@/domain/shop/technical-fields';

/** An option of a product's variants (e.g. "Farbe") with its values. */
export type VariationOption = { option: string; values: string[] };

/** The chosen value per option. */
export type SelectedOptions = Record<string, string>;

/** A row of a product's technical data, e.g. "Leistung": "12 W". */
export type SpecRow = { label: string; value: string };

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

/**
 * The picked values after the customer chose `value` for `option`. If that combination does not exist as a variant,
 * the other options switch to the variant with this value that keeps most of the current picks, so a picked
 * combination always exists (and can be added to the cart).
 */
export const pickVariantOptions = (
  variants: ProductVariant[],
  picked: SelectedOptions,
  option: string,
  value: string,
): SelectedOptions => {
  const next = { ...picked, [option]: value };
  const candidates = variants.filter((variant) =>
    variant.selections.some((selection) => selection.option === option && selection.value === value),
  );
  const matches = (variant: ProductVariant) =>
    variant.selections.filter((selection) => next[selection.option] === selection.value).length;
  const [best] = [...candidates].sort((a, b) => matches(b) - matches(a));

  if (!best || matches(best) === best.selections.length) {
    return next;
  }

  return Object.fromEntries(best.selections.map((selection) => [selection.option, selection.value]));
};

export const findMatchingVariant = (variants: ProductVariant[], selected: SelectedOptions): ProductVariant | null =>
  variants.find((variant) => variant.selections.every((selection) => selected[selection.option] === selection.value)) ??
  null;

/** The product's technical data that is set, with German labels. */
export const getProductSpecRows = (product: Pick<Product, 'technical'>): SpecRow[] => {
  const rows: SpecRow[] = [];

  for (const field of PRODUCT_TECHNICAL_FIELDS) {
    const value = product.technical[field.key];

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
