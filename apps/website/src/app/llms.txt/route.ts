import { DEDICATED_ROUTES, isDedicatedRoute } from '@/constants/dedicated-routes';
import { SITE_NAME } from '@/constants/site';
import { SHOP_HOME_PATH, getShopCategoryPath } from '@/domain/shop/paths';
import { LlmsPagesDocument } from '@/graphql/generated';
import { getCompanyProfile } from '@/utils/company-profile';
import { catalog } from '@/integrations';
import { getHeaderFooter } from '@/utils/get-header-footer';
import { getPublicPagePath } from '@/utils/pathnames';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import { getSiteUrl } from '@/utils/site-url';

/**
 * llms.txt (https://llmstxt.org): a compact Markdown overview of the business and its pages for
 * AI assistants. Fully generated from DatoCMS: texts from «Firmenprofil (SEO & KI)», sections from
 * the page tree (every parent page with child pages becomes a section).
 */
// Same interval as the content pages; the DatoCMS webhook also revalidates it on changes.
export const revalidate = 3600;

type LinkItem = { title: string; url: string; description?: string };

/** Markdown-safe single line: no link-breaking brackets, no line breaks in list items. */
const clean = (text: string) => text.replace(/[[\]]/g, '').replace(/\s+/g, ' ').trim();

const line = ({ title, url, description }: LinkItem) => `- [${title}](${url})${description ? `: ${description}` : ''}`;

const section = (title: string, items: LinkItem[]) =>
  items.length > 0 ? `## ${clean(title)}\n\n${items.map(line).join('\n')}` : '';

export const GET = async (): Promise<Response> => {
  const siteUrl = getSiteUrl();
  const [{ allPages }, categories, headerFooter, profile] = await Promise.all([
    queryDatoCMS({ document: LlmsPagesDocument }),
    catalog.listCategories(),
    getHeaderFooter(),
    getCompanyProfile(),
  ]);

  const pages = allPages
    .map((page) => ({ page, path: getPublicPagePath(page) }))
    // the home page is the site itself, dedicated routes (shop, FAQ) are listed separately below
    .filter(({ page, path }) => !page.seometatags?.noIndex && !isDedicatedRoute(path))
    .map(({ page, path }) => ({
      parent: page.parent,
      item: {
        title: clean(page.title),
        description: page.seometatags?.description ? clean(page.seometatags.description) : undefined,
        url: `${siteUrl}${path}`,
      },
    }));

  // Parent pages (e.g. «Angebot», «Projekte», «Blog») become sections listing their child pages.
  const parents = new Map<string, { id: string; title: string }>();
  for (const { parent } of pages) {
    if (parent) {
      parents.set(parent.id, parent);
    }
  }
  const sections = [...parents.values()].map((parent) =>
    section(
      parent.title,
      pages.filter((page) => page.parent?.id === parent.id).map(({ item }) => item),
    ),
  );
  const topLevelPages = pages.filter(({ parent }) => !parent).map(({ item }) => item);

  const contact = [
    headerFooter.street &&
      headerFooter.zip &&
      `${headerFooter.street}, ${headerFooter.zip} ${headerFooter.place ?? ''}`.trim(),
    headerFooter.phone && `Telefon ${headerFooter.phone}`,
    headerFooter.email && `E-Mail ${headerFooter.email}`,
  ].filter(Boolean);

  const body = [
    `# ${headerFooter.companyName ?? SITE_NAME}`,
    profile?.description ? `> ${clean(profile.description)}` : '',
    profile?.llmsIntro?.trim() ?? '',
    contact.length > 0 ? `Kontakt: ${contact.join(' · ')}.` : '',
    ...sections,
    section('Shop', [
      { title: 'Online-Shop', url: `${siteUrl}${SHOP_HOME_PATH}` },
      ...categories.map((category) => ({
        title: clean(category.name),
        url: `${siteUrl}${getShopCategoryPath(category.slug)}`,
      })),
    ]),
    section('Weitere Seiten', [
      ...topLevelPages,
      ...DEDICATED_ROUTES.filter((route) => route.path !== SHOP_HOME_PATH).map((route) => ({
        title: route.title,
        url: `${siteUrl}${route.path}`,
      })),
    ]),
  ]
    .filter(Boolean)
    .join('\n\n');

  return new Response(`${body}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
