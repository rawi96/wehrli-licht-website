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

/**
 * Slugs are unique in DatoCMS, so a page is found by its last slug. The ones before must be its parents: a page with
 * a parent is not served without it, and every slug must be the parent of the next one.
 */
const hasValidParents = async (page: Page, slugs: string[], includeDrafts: boolean): Promise<boolean> => {
  // From the page up to the top-level page; easier to compare with the page hierarchy.
  const upwards = [...slugs].reverse();

  if (page.parent && upwards.length === 1) {
    return false;
  }

  if (upwards.length === 2) {
    return upwards[1] === page.parent?.slug;
  }

  // Deeper pages: we do not know the complete hierarchy, so each slug is checked against its parent.
  for (let i = 0; i < upwards.length - 1; i++) {
    const { page: current } = await getPageBySlug(upwards[i], includeDrafts);

    if (current?.parent?.slug !== upwards[i + 1]) {
      return false;
    }
  }

  return true;
};

type BreadcrumbPage = { slug: string; title: string; parent?: BreadcrumbPage | null };

const toBreadcrumbs = (page: BreadcrumbPage): Breadcrumb[] => [
  ...(page.parent ? toBreadcrumbs(page.parent) : []),
  { name: page.title || page.slug, href: `/${page.slug}` },
];

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

  if (page.parent && !(await hasValidParents(page, slugs, includeDrafts))) {
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
