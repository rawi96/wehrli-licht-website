import { FC } from 'react';

export type SpecRow = { label: string; value: string };

type Props = {
  rows: SpecRow[];
  title?: string;
};

/** Technical data of a product as a two-column list. Renders nothing without rows. */
export const ProductSpecs: FC<Props> = ({ rows, title = 'Technische Daten' }) => {
  if (rows.length === 0) {
    return null;
  }

  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold">{title}</h2>
      <dl className="mt-4 divide-y divide-gray-200 border-t border-gray-200">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-2 gap-x-4 py-3 text-sm">
            <dt className="text-gray-600">{row.label}</dt>
            <dd className="text-black">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
