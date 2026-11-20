/** A step of the breadcrumb trail (without the home page). */
export type Breadcrumb = {
  name: string;
  href: string;
};

type MetadataImage = {
  url: string;
  width?: string;
  height?: string;
  type?: string;
};

/** A page's metadata for the document head (title, description, Open Graph, icons), in the shape Next.js uses. */
export type PageMetadata = {
  title?: string | { absolute: string };
  description?: string;
  robots?: string | { index: boolean; follow: boolean };
  alternates?: { canonical: string };
  icons?: {
    icon?: { url: string; sizes?: string; type?: string; rel?: string }[];
    apple?: { url: string; sizes?: string }[];
  };
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    siteName?: string;
    locale?: string;
    type?: string;
    images?: MetadataImage[];
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image';
    title?: string;
    description?: string;
    images?: MetadataImage[];
  };
};

/** Facts about a blog article, for its structured data. */
export type ArticleInfo = {
  title: string;
  description: string | null;
  imageUrl: string | null;
  publishedAt: string | null;
  updatedAt: string | null;
};

/** A published page of the website, for sitemap, robots.txt and prerendering. */
export type PageRoute = {
  path: string;
  lastModified?: string;
  noIndex?: boolean;
};

/** A page with its title and description, for overviews such as llms.txt. */
export type PageSummary = {
  path: string;
  title: string;
  description: string | null;
  noIndex: boolean;
  /** The parent page (sections of the site such as «Angebot» or «Blog»), null for top-level pages. */
  parent: { id: string; title: string } | null;
};

/** A link the CMS shows editors to preview a record on the website. */
export type PreviewLink = {
  label: string;
  url: string;
};
