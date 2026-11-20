import { JsonLd } from '@/components/seo/json-ld';
import type { Breadcrumb } from '@/domain/content/page';
import { getSiteUrl } from '@/lib/site-url';
import { Breadcrumbs as BreadcrumbsView } from '@wehrli/design-system';
import { ComponentProps } from 'react';

type Props = {
  /** The trail after the home page. */
  customBreadcrumbs: Breadcrumb[];
  spacing?: ComponentProps<typeof BreadcrumbsView>['spacing'];
  homeText?: string;
};

const toRichSnippet = (breadcrumbs: Breadcrumb[]) => {
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

/** The breadcrumb trail, starting at the home page, with its structured data. */
export const Breadcrumbs = ({ customBreadcrumbs, homeText = 'Home', spacing }: Props) => {
  const breadcrumbsWithHome = [{ name: homeText, href: '/' }, ...customBreadcrumbs];

  return (
    <>
      <BreadcrumbsView items={breadcrumbsWithHome.map(({ name, href }) => ({ label: name, href }))} spacing={spacing} />
      <JsonLd data={toRichSnippet(breadcrumbsWithHome)} />
    </>
  );
};
