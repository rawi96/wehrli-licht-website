import 'server-only';
import { PageCandidatesDocument, PageCandidatesQuery, PageDocument, PageQuery } from '@/graphql/generated';
import type { ArticleInfo, Breadcrumb, PageMetadata } from '@/domain/content/page';
import type { ContentPage, HomePage } from '@/ports/content-source';
import { cache } from 'react';
import {
  ArticleIndexBlock,
  ChildPagesBlock,
  DetailPage,
  PageHero,
  RelatedPagesBlock,
  type ChildPage,
  type PageLevel,
} from '@wehrli/design-system';
import type { ContentBlock } from './blocks/content-blocks';
import { generatePathForRecord, getPublicPagePath, HOME_PAGE_SLUG } from './paths';
import { ContentBlocks } from './blocks/content-blocks';
import { toImage } from './image';
import { HomeStageBlock } from './blocks/home-stage';
import { queryDatoCMS } from './client';
import { isDraftMode } from './draft';
import { buildDatoPageMetadata } from './metadata';

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

type ChildRecord = NonNullable<Page['children']>[number];
type SiblingRecord = NonNullable<NonNullable<Page['parent']>['children']>[number];

const byPosition = <T extends { position?: number | null }>(pages: T[]): T[] =>
  [...pages].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

/** The trimmed text, or undefined when it is empty. */
const filled = (text: string | null | undefined): string | undefined => {
  const trimmed = text?.trim();

  if (!trimmed) {
    return undefined;
  }

  return trimmed;
};

// The Content Delivery API returns only published sub-pages outside draft mode.
const toChildPage = (page: ChildRecord | SiblingRecord): ChildPage => ({
  id: page.id,
  title: filled(page.teaserTitle) ?? page.title,
  eyebrow: page.teaserEyebrow,
  description: page.teaserDescription,
  href: getPublicPagePath(page),
  linkLabel: filled(page.teaserLinkText) ?? 'Mehr erfahren',
  image: toImage(page.teaserImage),
  children:
    'children' in page && page.children
      ? page.children.map((child) => ({
          id: child.id,
          title: filled(child.teaserTitle) ?? child.title,
          href: getPublicPagePath(child),
        }))
      : undefined,
});

/** Listings of other records: a top-level page with one of them (e.g. /projekte) is an area, not a detail page. */
const LISTING_BLOCKS: ReadonlySet<ContentBlock['__typename']> = new Set([
  'ProjectsOverviewRecord',
  'AllCategoriesBlockRecord',
]);

/** Area: top-level page with sub-pages. Overview: deeper page with sub-pages. Detail: no sub-pages (ADR 0002). */
const toLevel = (page: Page, childCount: number): PageLevel => {
  if (childCount === 0) {
    return 'detail';
  }

  return page.parent ? 'overview' : 'area';
};

export const getPage = async (path: string): Promise<ContentPage | null> => {
  const slugs = toSlugs(path);
  const slug = slugs.at(-1);

  if (!slug) {
    return null;
  }

  const data = await getPageByPath(path, await isDraftMode());
  const { page } = data;

  // The home page is served at / only (a child page may still be called «home»).
  if (!page || (page.slug === HOME_PAGE_SLUG && !page.parent)) {
    return null;
  }

  if (!isPagePath(page, slugs)) {
    return null;
  }

  const children = byPosition(page.children ?? []).map(toChildPage);
  const level = toLevel(page, children.length);
  const title = filled(page.headline) ?? page.title;
  const image = toImage(page.heroImage) ?? toImage(page.teaserImage);

  // Closing contact blocks stay last on areas and overviews; detail pages show the detail contact instead.
  const blocks = page.content;
  const lastNonContact = [...blocks].reverse().findIndex((block) => block.__typename !== 'ContactRecord');
  const contactStart = lastNonContact === -1 ? 0 : blocks.length - lastNonContact;
  const [mainBlocks, contactBlocks] = [blocks.slice(0, contactStart), blocks.slice(contactStart)];

  const base = { title: page.title, breadcrumbs: toBreadcrumbs(page), article: toArticle(page) };
  const siblings = page.parent
    ? byPosition((page.parent.children ?? []).filter((sibling) => sibling.id !== page.id)).map(toChildPage)
    : [];
  // End of every detail page: the pages next to it and the way back up one level.
  const related =
    level === 'detail' && page.parent ? (
      <RelatedPagesBlock
        title={siblings.length > 0 ? `Mehr zum Thema ${page.parent.title}` : `Diese Seite gehört zu ${page.parent.title}`}
        pages={siblings}
        back={{ label: page.parent.title, href: getPublicPagePath(page.parent) }}
        last
      />
    ) : null;

  // Every page without sub-pages gets the detail layout, whatever its blocks; only a top-level listing page
  // (e.g. /projekte) is shown as an area.
  const isListing = !page.parent && mainBlocks.some((block) => LISTING_BLOCKS.has(block.__typename));
  const isMagazine = (page.children ?? []).length > 0 && (page.children ?? []).every((child) => child.isArticle);

  if (level !== 'detail' || isListing) {
    return {
      ...base,
      render: (breadcrumbs) => (
        <>
          <PageHero
            level={level === 'detail' ? 'area' : level}
            breadcrumbs={breadcrumbs}
            title={title}
            intro={page.intro}
            image={image}
          />
          {isMagazine ? (
            // A page whose sub-pages are all articles is a magazine: lead story and article list.
            <ArticleIndexBlock articles={children} moreTitle="Alle Beiträge" />
          ) : (
            // Large topic cards with their own sub-pages as links where there are any, else plain cards.
            <ChildPagesBlock
              variant={children.some((child) => child.children?.length) ? 'topics' : 'cards'}
              pages={children}
            />
          )}
          <ContentBlocks blocks={mainBlocks} eagerBlockCount={0} />
          {/* The related pages close the page, right above the footer. */}
          <ContentBlocks blocks={contactBlocks} eagerBlockCount={0} />
          {related}
        </>
      ),
    };
  }

  // One contact person on every detail page (setting in «Header & Footer»); the page's own contact blocks are left out.
  const person = data.headerFooter?.detailContact;
  const portrait = toImage({ responsiveImage: person?.image?.responsiveImage });
  const contact = person
    ? {
        name: [person.firstname, person.lastname]
          .map((part) => part?.trim())
          .filter(Boolean)
          .join(' '),
        role: person.function,
        image: portrait && { ...portrait, alt: person.firstname },
        email: person.email,
        phone: person.phone,
        appointment:
          person.appointmentLink?.slug && person.appointmentText
            ? {
                label: person.appointmentText,
                href:
                  generatePathForRecord({
                    slug: person.appointmentLink.slug,
                    type: 'PageRecord',
                    parent: person.appointmentLink.parent,
                  }) + (person.appointmentAnchorLink ?? ''),
              }
            : null,
      }
    : null;

  return {
    ...base,
    render: (breadcrumbs) => (
      <>
        <DetailPage
          breadcrumbs={breadcrumbs}
          title={title}
          intro={page.intro}
          // «Schlichter Seitenkopf» (team, contact …): no contact bar, and a picture only when one is set as «Kopfbild».
          image={page.plainHeader ? toImage(page.heroImage) : image}
          contact={page.plainHeader ? null : contact}
        >
          <ContentBlocks blocks={mainBlocks} eagerBlockCount={0} />
        </DetailPage>
        {related}
      </>
    ),
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
