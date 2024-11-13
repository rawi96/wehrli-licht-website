'use client';

import { usePathname } from 'next/navigation';
import { FC } from 'react';

export const DraftModeBanner: FC = () => {
  const pathname = usePathname();

  return (
    <div className="bg-apricot-500 text-xxs sticky top-0 z-50 flex flex-row items-center justify-center gap-2 p-2 font-bold">
      <span>Draft Mode is enabled –</span>
      <a
        href={`/api/draft/disable?url=${pathname}`}
        className="bg-apricot-200 hover:bg-white-200 rounded px-2 transition-colors"
        title="Disable Draft Mode"
      >
        Disable
      </a>
    </div>
  );
};
