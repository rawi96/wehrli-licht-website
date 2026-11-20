import 'server-only';
import type { ContentSource } from '@/ports/content-source';
import { getContactPath } from '@/utils/cms-page-path';
import { getHeaderFooter } from '@/utils/get-header-footer';
import { draftMode } from 'next/headers';

export const datocmsContent: ContentSource = {
  getContactPath: async () => {
    const { isEnabled } = await draftMode();

    return getContactPath(await getHeaderFooter(isEnabled));
  },
};
