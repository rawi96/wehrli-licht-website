import 'server-only';
import { PageCandidatesDocument, PageCandidatesQuery, PageDocument, PageQuery } from '@/graphql/generated';
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

const toSlugs = (path: string): string[] => path.split('/').filter(Boolean);

type Candidate = PageCandidatesQuery['allPages'][number];
type CandidateParent = { slug: string; parent?: CandidateParent | null } | null | undefined;

const candidateSlugs = (candidate: Candidate): string[] => {
  const slugs = [candidate.slug];
  for (let parent: CandidateParent = candidate.parent; parent; parent = parent.parent) {
    slugs.unshift(parent.slug);
  }

  return slugs;
};

/**
 * Id of the page at `path` (`/` is the home page). Slugs only need to be unique below the same parent (e.g.
 * /lampenschirme/leistungen and /licht-planen/leistungen), so the page whose parents match the path wins.
 */
const resolvePageId = cache(async (path: string, includeDrafts: boolean): Promise<string | null> => {
  const slugs = path === '/' ? [HOME_PAGE_SLUG] : toSlugs(path);
  const slug = slugs.at(-1);

  if (!slug) {
    return null;
  }

  const { allPages } = await queryDatoCMS({ document: PageCandidatesDocument, variables: { slug }, includeDrafts });
  const match = allPages.find((candidate) => {
    const hierarchy = candidateSlugs(candidate);

    return hierarchy.length === slugs.length && hierarchy.every((part, index) => part === slugs[index]);
  });

  return match?.id ?? null;
});

/** Page at `path`, deduplicated per request (metadata and page both need it). Null page if there is none. */
const getPageByPath = cache(async (path: string, includeDrafts: boolean) => {
  const id = await resolvePageId(path, includeDrafts);

  // Without a page the query still returns the site's favicon tags for the metadata.
  return queryDatoCMS({ document: PageDocument, variables: { id: id ?? '0' }, includeDrafts });
});

export const getPageMetadata = async (path: string): Promise<PageMetadata> => {
  const { site, page } = await getPageByPath(path, await isDraftMode());

  return buildDatoPageMetadata([...site.favicon, ...(page?.seo ?? [])], path);
};

type HierarchyPage = { slug: string; title: string; parent?: HierarchyPage | null };

/** The page and its parents, from the top-level page down to the page. */
const toHierarchy = (page: HierarchyPage): HierarchyPage[] => [...(page.parent ? toHierarchy(page.parent) : []), page];

/**
 * A page is only served at its own path: the slugs before its own must be exactly its parents (a top-level page has
 * none), otherwise any prefix would serve the same page. The queries load four levels of parents, like the links.
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

  const { page } = await getPageByPath(path, await isDraftMode());

  // The home page is served at / only (a child page may still be called «home»).
  if (!page || (page.slug === HOME_PAGE_SLUG && !page.parent)) {
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
  const { page } = await getPageByPath('/', await isDraftMode());

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
