import 'server-only';
import { PageDocument, PageQuery } from '@/graphql/generated';
import type { ArticleInfo, Breadcrumb, PageMetadata } from '@/domain/content/page';
import type { ContentPage, HomePage } from '@/ports/content-source';
import { cache } from 'react';
import { ContentBlocks } from './blocks/content-blocks';
import { HomeStageBlock } from './blocks/home-stage';
import { queryDatoCMS } from './client';
import { isDraftMode } from './draft';
import { buildDatoPageMetadata } from './metadata';
import { HOME_PAGE_SLUG } from './paths';

type Page = NonNullable<PageQuery['page']>;
type SeoTag = Page['seo'][number];

/** Page by slug, deduplicated per request (metadata and page both need it). */
const getPageBySlug = cache(async (slug: string, includeDrafts: boolean) =>
  queryDatoCMS({ document: PageDocument, variables: { slug }, includeDrafts }),
);

const toSlugs = (path: string): string[] => path.split('/').filter(Boolean);

export const getPageMetadata = async (path: string): Promise<PageMetadata> => {
  const slug = path === '/' ? HOME_PAGE_SLUG : (toSlugs(path).at(-1) ?? '');
  const { site, page } = await getPageBySlug(slug, await isDraftMode());

  return buildDatoPageMetadata([...site.favicon, ...(page?.seo ?? [])], path);
};

type HierarchyPage = { slug: string; title: string; parent?: HierarchyPage | null };

/** The page and its parents, from the top-level page down to the page. */
const toHierarchy = (page: HierarchyPage): HierarchyPage[] => [...(page.parent ? toHierarchy(page.parent) : []), page];

/**
 * Slugs are unique in DatoCMS, so a page is found by its last slug. It is only served at its own path: the slugs
 * before must be exactly its parents (a top-level page has none), otherwise any prefix would serve the same page.
 * The page query loads three levels of parents, deeper pages are not served.
 */
const isPagePath = (page: Page, slugs: string[]): boolean => {
  const hierarchy = toHierarchy(page).map(({ slug }) => slug);

  return hierarchy.length === slugs.length && hierarchy.every((slug, index) => slug === slugs[index]);
};

const toBreadcrumbs = (page: HierarchyPage): Breadcrumb[] =>
  toHierarchy(page).map((step, index, hierarchy) => ({
    name: step.title || step.slug,
    href: `/${hierarchy
      .slice(0, index + 1)
      .map(({ slug }) => slug)
      .join('/')}`,
  }));

const metaContent = (tags: SeoTag[], key: string): string | null =>
  tags.find((tag) => tag.tag === 'meta' && (tag.attributes?.property === key || tag.attributes?.name === key))?.attributes
    ?.content ?? null;

const toArticle = (page: Page): ArticleInfo | null =>
  page.isArticle
    ? {
        title: page.title,
        description: metaContent(page.seo, 'description') ?? metaContent(page.seo, 'og:description'),
        imageUrl: metaContent(page.seo, 'og:image'),
        publishedAt: page._firstPublishedAt ?? null,
        updatedAt: page._updatedAt ?? null,
      }
    : null;

export const getPage = async (path: string): Promise<ContentPage | null> => {
  const slugs = toSlugs(path);
  const slug = slugs.at(-1);

  if (!slug) {
    return null;
  }

  const includeDrafts = await isDraftMode();
  const { page } = await getPageBySlug(slug, includeDrafts);

  // The home page is served at / only.
  if (!page || page.slug === HOME_PAGE_SLUG) {
    return null;
  }

  if (!isPagePath(page, slugs)) {
    return null;
  }

  return {
    title: page.title,
    breadcrumbs: toBreadcrumbs(page),
    article: toArticle(page),
    content: <ContentBlocks blocks={page.content} />,
  };
};

export const getHomePage = async (): Promise<HomePage | null> => {
  const { page } = await getPageBySlug(HOME_PAGE_SLUG, await isDraftMode());

  if (!page) {
    return null;
  }

  const blocks = page.content ?? [];
  // The home stage is rendered above the content, with the header on top of it.
  const stage = blocks.find((block) => block.__typename === 'HomeStageRecord');

  return {
    stage: stage ? <HomeStageBlock key={stage.id} block={stage} /> : null,
    content: <ContentBlocks blocks={blocks.filter((block) => block.__typename !== 'HomeStageRecord')} eagerBlockCount={0} />,
  };
};
