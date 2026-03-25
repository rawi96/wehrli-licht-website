'use client';

import { usePathname } from 'next/navigation';
import { FC } from 'react';

export const DraftModeBanner: FC = () => {
  const pathname = usePathname();

  return (
    <div className="bg-wehrli-100 sticky top-0 z-50 flex flex-row items-center justify-center gap-2 p-2 text-sm font-bold">
      <span>Draft Mode is enabled</span>
      <a
        href={`/api/draft/disable?url=${pathname}`}
        className="bg-wehrli-200 hover:bg-wehrli-300 rounded px-2 transition-colors"
        title="Disable Draft Mode"
      >
        Disable
      </a>
    </div>
  );
};
