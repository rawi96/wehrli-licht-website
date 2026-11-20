import type { CompanyProfile } from '@/domain/content/company-profile';
import type { FaqEntry } from '@/domain/content/faq';
import type { ArticleInfo, Breadcrumb, PageMetadata, PageRoute, PageSummary, PreviewLink } from '@/domain/content/page';
import type { SiteLayout } from '@/domain/content/site-layout';
import type { ReactNode } from 'react';

/** A content page, its blocks already rendered (the blocks are the CMS's content model, see ADR 0001). */
export type ContentPage = {
  title: string;
  breadcrumbs: Breadcrumb[];
  /** Set for blog articles. */
  article: ArticleInfo | null;
  content: ReactNode;
};

export type HomePage = {
  /** The stage at the top, with the header on top of it; null if the home page has none. */
  stage: ReactNode;
  content: ReactNode;
};

export type FaqPage = {
  /** Title and intro of the FAQ page, null if not set. */
  title: string | null;
  intro: string | null;
  metadata: PageMetadata;
  faqs: FaqEntry[];
};

/** What a change notification of the CMS revalidated. */
export type ContentRevalidation = {
  paths: string[];
  /** The changed content type and the kind of change, as the CMS names them. */
  model: string | null;
  eventType: string | null;
};

/**
 * The website's content: pages, navigation and site settings, wherever they are maintained (today DatoCMS).
 * In draft mode the functions return unpublished content.
 */
export type ContentSource = {
  /** Origin the content's images are served from (the document head preconnects to it). */
  assetOrigin: string;
  /** Path of the contact page, with a fallback when none is set or the CMS cannot be reached. */
  getContactPath(): Promise<string>;
  /** Navigation, contact data and footer around every page. */
  getSiteLayout(): Promise<SiteLayout>;
  /** Business facts for structured data and llms.txt, null if not maintained. */
  getCompanyProfile(): Promise<CompanyProfile | null>;
  /** Metadata of the page at `path` (`/` for the home page); site-wide defaults if there is no such page. */
  getPageMetadata(path: string): Promise<PageMetadata>;
  /** The content page at `path` (not the home page), null if there is none at exactly this path. */
  getPage(path: string): Promise<ContentPage | null>;
  getHomePage(): Promise<HomePage | null>;
  getFaqPage(): Promise<FaqPage>;
  /** Published pages with their path, for sitemap, robots.txt and prerendering. */
  listRoutes(): Promise<PageRoute[]>;
  /** Published pages with title and description, for llms.txt. */
  listPages(): Promise<PageSummary[]>;
  /** Preview links for a record, from a request of the CMS's preview plugin. */
  getPreviewLinks(request: unknown, token: string): Promise<PreviewLink[]>;
  /** Revalidates the cached pages affected by a change notification (webhook) of the CMS. */
  revalidateChangedContent(notification: unknown): ContentRevalidation;
};
