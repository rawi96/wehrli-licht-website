import { PRODUCT_TECHNICAL_FIELDS } from '@/constants/product-technical-fields';
import { ShopProduct } from '@/utils/shop';

type SpecRow = { label: string; value: string };

type Props = {
  product: ShopProduct;
};

export const ProductSpecs = ({ product }: Props) => {
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

  if (rows.length === 0) {
    return null;
  }

  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold">Technische Daten</h2>
      <dl className="mt-4 divide-y divide-gray-200 border-t border-gray-200">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-2 gap-x-4 py-3 text-sm">
            <dt className="text-gray-600">{row.label}</dt>
            <dd className="text-gray-900">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
