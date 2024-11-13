'use client';

import { usePathname } from 'next/navigation';
import { FC } from 'react';

export const DraftModeBanner: FC = () => {
  const pathname = usePathname();

  return (
    <div className="text-xxs sticky top-0 z-50 flex flex-row items-center justify-center gap-2 bg-wehrli-100 p-2 font-bold">
      <span>Draft Mode is enabled</span>
      <a
        href={`/api/draft/disable?url=${pathname}`}
        className="rounded bg-wehrli-200 px-2 transition-colors hover:bg-wehrli-300"
        title="Disable Draft Mode"
      >
        Disable
      </a>
    </div>
  );
};
