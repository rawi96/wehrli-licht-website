import { SITE_DESCRIPTION } from '@/components/seo/site-json-ld';
import { LlmsPagesDocument, PageRecord } from '@/graphql/generated';
import { getHeaderFooter } from '@/utils/get-header-footer';
import { generatePathForRecord } from '@/utils/pathnames';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import { getAllCategories } from '@/utils/shop';
import { getShopCategoryPath } from '@/constants/shop-paths';
import { getSiteUrl } from '@/utils/site-url';

/**
 * llms.txt (https://llmstxt.org): a compact, Markdown overview of the business
 * and its most important pages for AI assistants and LLM-based search.
 */
export const revalidate = 86400;

type Section = { title: string; parentSlug: string | null };

const SECTIONS: Section[] = [
  { title: 'Angebot', parentSlug: 'angebot' },
  { title: 'Projekte', parentSlug: 'projekte' },
  { title: 'Blog', parentSlug: 'blog' },
];

export const GET = async (): Promise<Response> => {
  const siteUrl = getSiteUrl();
  const [{ allPages }, categories, headerFooter] = await Promise.all([
    queryDatoCMS({ document: LlmsPagesDocument }),
    getAllCategories(),
    getHeaderFooter(),
  ]);

  // Markdown-safe single line: no link-breaking brackets, no line breaks in list items.
  const clean = (text: string) => text.replace(/[[\]]/g, '').replace(/\s+/g, ' ').trim();

  const pages = allPages
    // home is the site itself, shop is listed in its own section below
    .filter((page) => !page.seometatags?.noIndex && page.slug !== 'home' && page.slug !== 'shop')
    .map((page) => ({
      title: clean(page.title),
      description: page.seometatags?.description ? clean(page.seometatags.description) : undefined,
      parentSlug: page.parent?.slug ?? null,
      url: `${siteUrl}${generatePathForRecord({ slug: page.slug, type: 'PageRecord', parent: page.parent as PageRecord | null })}`,
    }));

  const line = ({ title, url, description }: { title: string; url: string; description?: string }) =>
    `- [${title}](${url})${description ? `: ${description}` : ''}`;

  const sectionBlocks = SECTIONS.map(({ title, parentSlug }) => {
    const items = pages.filter((page) => page.parentSlug === parentSlug);

    return items.length > 0 ? `## ${title}\n\n${items.map(line).join('\n')}` : '';
  }).filter(Boolean);

  const otherPages = pages.filter((page) => !SECTIONS.some(({ parentSlug }) => parentSlug === page.parentSlug));
  const contact = [
    headerFooter.street &&
      headerFooter.zip &&
      `${headerFooter.street}, ${headerFooter.zip} ${headerFooter.place ?? ''}`.trim(),
    headerFooter.phone && `Telefon ${headerFooter.phone}`,
    headerFooter.email && `E-Mail ${headerFooter.email}`,
  ].filter(Boolean);

  const body = [
    `# ${headerFooter.companyName ?? 'Wehrli Licht GmbH'}`,
    `> ${SITE_DESCRIPTION}`,
    [
      'Seit 1947 (früher Wehrli Lampenatelier) fertigt das Familienunternehmen Lampenschirme in Handarbeit, heute in dritter Generation.',
      'Kernkompetenz sind Lampenschirme nach Mass sowie das Neu-Überziehen und Reparieren bestehender Lampenschirme im eigenen Atelier.',
      'Dazu kommen persönliche Lichtberatung und Lichtplanung sowie ausgewählte Leuchten im Showroom und im Online-Shop (Lieferung innerhalb der Schweiz).',
      'Beratung im Atelier in Goldach nach Terminvereinbarung.',
    ].join(' '),
    contact.length > 0 ? `Kontakt: ${contact.join(' · ')}. Termin online: ${siteUrl}/kontakt` : '',
    ...sectionBlocks,
    `## Shop\n\n${[
      line({ title: 'Online-Shop', url: `${siteUrl}/shop` }),
      ...categories.map((category) =>
        line({ title: clean(category.name), url: `${siteUrl}${getShopCategoryPath(category.slug)}` }),
      ),
    ].join('\n')}`,
    `## Weitere Seiten\n\n${[...otherPages.map(line), line({ title: 'Häufige Fragen (FAQ)', url: `${siteUrl}/faq` })].join('\n')}`,
  ]
    .filter(Boolean)
    .join('\n\n');

  return new Response(`${body}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
