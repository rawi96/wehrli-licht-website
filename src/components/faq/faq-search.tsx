'use client';

import { checkoutInputClass, checkoutLabelClass } from '@/components/shop/checkout-styles';
import { formatFaqSearchStatus } from '@/utils/faq/format-faq-count';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { FC } from 'react';

type Props = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
  totalCount: number;
};

export const FaqSearch: FC<Props> = ({ id, value, onChange, resultCount, totalCount }) => {
  const hasQuery = value.trim().length > 0;

  return (
    <div>
      <label htmlFor={id} className={checkoutLabelClass}>
        FAQ durchsuchen
      </label>
      <div className="relative mt-1 max-w-xl">
        <MagnifyingGlassIcon
          className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-gray-400"
          aria-hidden
        />
        <input
          id={id}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Stichwort, z. B. Lampenschirm, Lieferung, Lichtplanung…"
          autoComplete="off"
          className={`${checkoutInputClass} pl-10`}
        />
      </div>
      <p className="mt-2 text-sm text-gray-600" role="status" aria-live="polite">
        {formatFaqSearchStatus(resultCount, totalCount, hasQuery)}
      </p>
    </div>
  );
};
