/**
 * Metadata of a page maintained in a CMS (its SEO settings and the site's favicons), as plain data in the shape of
 * Next.js' `Metadata`, so the app can return it from `generateMetadata` as it is.
 */
export type PageMetadata = {
  title?: string;
  description?: string;
  icons?: {
    icon?: { rel: string; sizes: string; type: string; url: string }[];
    apple?: { sizes: string; url: string }[];
  };
  openGraph?: {
    title?: string;
    description?: string;
    locale?: string;
    type?: string;
    siteName?: string;
    images?: { url: string; type?: string; width?: string; height?: string }[];
  };
  twitter?: {
    title?: string;
    description?: string;
    images?: { url: string; type?: string; width?: string; height?: string }[];
  };
};
