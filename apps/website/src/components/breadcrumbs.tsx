import { JsonLd } from '@/components/seo/json-ld';
import { PageRecord } from '@/graphql/generated';
import { getSiteUrl } from '@/utils/site-url';
import { Breadcrumbs as BreadcrumbsView } from '@wehrli/design-system';

type BreadcrumbItem = {
  name: string;
  href: string;
};

type Props = {
  page?: PageRecord | null;
  customBreadcrumbs?: BreadcrumbItem[];
  homeText?: string;
};

export const Breadcrumbs = ({ page, customBreadcrumbs, homeText = 'Home' }: Props) => {
  const generatedBreadcrumbs = useBreadcrumbs(page);

  const breadcrumbs = customBreadcrumbs ?? generatedBreadcrumbs;

  const breadcrumbsWithHome = [{ name: homeText, href: '/' }, ...breadcrumbs];

  const richSnippet = useRichSnippet(breadcrumbsWithHome);

  if (!breadcrumbsWithHome.length) {
    return null;
  }

  return (
    <>
      <BreadcrumbsView items={breadcrumbsWithHome.map(({ name, href }) => ({ label: name, href }))} />
      <JsonLd data={richSnippet} />
    </>
  );
};

const useBreadcrumbs = (page?: PageRecord | null): BreadcrumbItem[] => {
  if (!page) {
    return [];
  }

  const getBreadcrumbs = (currentPage: PageRecord, breadcrumbs: BreadcrumbItem[] = []): BreadcrumbItem[] => {
    const breadcrumb = {
      name: currentPage.title || currentPage.slug,
      href: `/${currentPage.slug}`,
    };
    breadcrumbs.unshift(breadcrumb);

    if (currentPage.parent) {
      return getBreadcrumbs(currentPage.parent, breadcrumbs);
    }

    return breadcrumbs;
  };

  return getBreadcrumbs(page);
};

const useRichSnippet = (breadcrumbs: BreadcrumbItem[]) => {
  const baseUrl = getSiteUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: `${baseUrl}${breadcrumb.href}`,
    })),
  };
};
