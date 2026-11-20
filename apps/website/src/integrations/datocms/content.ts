import 'server-only';
import type { ContentSource } from '@/ports/content-source';
import { getFaqPage } from './faq';
import { getHomePage, getPage, getPageMetadata } from './pages';
import { getPreviewLinks, listPages, listRoutes } from './routes';
import { getCompanyProfile, getContactPath, getSiteLayout } from './site-layout';
import { revalidateChangedContent } from './webhooks';

export const datocmsContent: ContentSource = {
  assetOrigin: 'https://www.datocms-assets.com',
  getContactPath,
  getSiteLayout,
  getCompanyProfile,
  getPageMetadata,
  getPage,
  getHomePage,
  getFaqPage,
  listRoutes,
  listPages,
  getPreviewLinks,
  revalidateChangedContent,
};
