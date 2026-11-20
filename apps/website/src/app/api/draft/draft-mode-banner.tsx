'use client';

import { DraftModeBanner as DraftModeBannerView } from '@wehrli/design-system';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

export const DraftModeBanner: FC = () => {
  const pathname = usePathname();

  return <DraftModeBannerView disableHref={`/api/draft/disable?url=${pathname}`} />;
};
