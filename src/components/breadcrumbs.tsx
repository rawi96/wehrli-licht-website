import Link from 'next/link';
import { PageRecord } from '@/graphql/generated';
import { classNames } from '@/utils/css';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

type Props = {
  page?: PageRecord | null;
};

export const Breadcrumbs = ({ page }: Props) => {
  const breadcrumbs = useBreadcrumbs(page);
  const richSnippet = useRichSnippet(breadcrumbs);

  if (!breadcrumbs.length) {
    return null;
  }

  return (
    <>
      <nav aria-label="Breadcrumb" className="flex font-bold">
        <ol role="list" className="flex items-center space-x-4">
          <li>
            <div>
              <Link
                href="/"
                className={classNames('border-b-2 border-transparent text-sm text-wehrli', 'hover:border-wehrli')}
              >
                Home
              </Link>
            </div>
          </li>
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.href}>
              <div className="flex items-center">
                <ChevronRightIcon aria-hidden="true" className="size-5 shrink-0 text-wehrli" />
                <Link
                  href={breadcrumb.href}
                  aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
                  className={classNames(
                    'ml-4 border-b-2 border-transparent text-sm text-wehrli',
                    index === breadcrumbs.length - 1 ? 'border-b-2 border-wehrli text-wehrli' : 'hover:border-wehrli',
                  )}
                >
                  {breadcrumb.name}
                </Link>
              </div>
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

const useBreadcrumbs = (page?: PageRecord | null) => {
  if (!page) {
    return [];
  }

  const getBreadcrumbs = (
    currentPage: PageRecord,
    breadcrumbs: { name: string; href: string }[] = [],
  ): { name: string; href: string }[] => {
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

// Rich Snippet Hook
const useRichSnippet = (breadcrumbs: { name: string; href: string }[]) => {
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
