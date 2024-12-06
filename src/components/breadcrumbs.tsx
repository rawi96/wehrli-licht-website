import Link from 'next/link';
import { PageRecord } from '@/graphql/generated';
import { classNames } from '@/utils/css';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

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
      <nav aria-label="Breadcrumb" className="-mb-16 flex font-bold">
        <ol role="list" className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {breadcrumbsWithHome.map((breadcrumb, index) => (
            <li key={breadcrumb.href} className="flex items-center">
              {index !== 0 && <ChevronRightIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-wehrli" />}
              <Link
                href={breadcrumb.href}
                aria-current={index === breadcrumbsWithHome.length - 1 ? 'page' : undefined}
                className={classNames(
                  'ml-2 border-b-2 border-transparent text-sm text-wehrli',
                  index === breadcrumbsWithHome.length - 1 ? 'border-b-2 border-wehrli text-wehrli' : 'hover:border-wehrli',
                )}
              >
                {breadcrumb.name}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(richSnippet),
        }}
      />
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
  const baseUrl = 'https://wehrli-licht.ch';

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
