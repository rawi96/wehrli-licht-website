import 'server-only';
import type { ContentSource } from '@/ports/content-source';
import { getFaqPage } from './faq';
import { getHomePage, getPage, getPageMetadata } from './pages';
import { getProjectPage, getProjectPageMetadata, listProjectAreas, listProjects } from './projects';
import { getPreviewLinks, listPages, listRoutes } from './routes';
import { getCompanyProfile, getContactPath, getSiteLayout } from './site-layout';
import { getSiteTexts } from './site-texts';
import { revalidateChangedContent } from './webhooks';

export const datocmsContent: ContentSource = {
  assetOrigin: 'https://www.datocms-assets.com',
  getContactPath,
  getSiteLayout,
  getCompanyProfile,
  getSiteTexts,
  getPageMetadata,
  getPage,
  getHomePage,
  getFaqPage,
  listProjects,
  listProjectAreas,
  getProjectPage,
  getProjectPageMetadata,
  listRoutes,
  listPages,
  getPreviewLinks,
  revalidateChangedContent,
};
