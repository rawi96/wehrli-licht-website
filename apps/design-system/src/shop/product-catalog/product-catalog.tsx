'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ReactNode, useId } from 'react';
import { Section } from '../../layout/section/section';
import { ProductCard, ProductCardData } from '../product-card/product-card';

type Props = {
  /** Visually hidden heading of the list, e.g. "12 Leuchten im Shop". */
  heading: string;
  headingId: string;
  /** The products to show, already filtered and sorted. */
  products: ProductCardData[];
  query: string;
  onQueryChange: (query: string) => void;
  /** The sort control, e.g. a SortMenu. */
  sort?: ReactNode;
  /** Read out to screen readers when the result changes, e.g. "3 von 12 Produkten". */
  resultMessage: string;
  labels?: {
    search: string;
    searchPlaceholder: string;
    empty: string;
    resetSearch: string;
  };
};

const DEFAULT_LABELS = {
  search: 'Leuchten suchen',
  searchPlaceholder: 'Leuchten suchen…',
  empty: 'Keine Leuchten gefunden.',
  resetSearch: 'Suche zurücksetzen',
};

/** Product list with a search field and sorting: 1 column, 2 from sm, 3 from lg. The first card is the LCP image. */
export const ProductCatalog = ({
  heading,
  headingId,
  products,
  query,
  onQueryChange,
  sort,
  resultMessage,
  labels = DEFAULT_LABELS,
}: Props) => {
  const searchId = useId();

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="sr-only">
        {heading}
      </h2>
      <Section marginTop={false}>
        <search className="mb-6 flex items-center gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-gray-300 px-4 py-2 transition-colors focus-within:border-gray-400">
            <label htmlFor={searchId} className="sr-only">
              {labels.search}
            </label>
            <MagnifyingGlassIcon aria-hidden="true" className="size-5 shrink-0 text-gray-400" />
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder={labels.searchPlaceholder}
              autoComplete="off"
              className="field-focus-plain min-w-0 flex-1 border-0 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 [&::-webkit-search-cancel-button]:hidden"
            />
          </div>
          {sort}
        </search>

        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {resultMessage}
        </p>

        {products.length > 0 ? (
          <ul className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
            {products.map((product, index) => (
              <li key={product.id}>
                {/* The first card is the LCP element on category pages. */}
                <ProductCard {...product} priority={index === 0} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-12 text-center text-sm text-gray-600" role="status">
            {labels.empty}
            {query.trim() && (
              <>
                {' '}
                <button type="button" onClick={() => onQueryChange('')} className="text-wehrli hover:underline">
                  {labels.resetSearch}
                </button>
              </>
            )}
          </p>
        )}
      </Section>
    </section>
  );
};
