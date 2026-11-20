import { ShopCategoryFragment } from '@/graphql/generated';
import { ShopCategory } from '@/utils/shop';

/**
 * Rendered image widths of the highlight teasers. Content is capped at 1280px (max-w-7xl) from
 * 1400px viewports and is 11/12 of the viewport below, so every entry has a px cap; plain vw
 * values made wide screens download images up to 5x larger than displayed.
 */
export const HIGHLIGHT_IMAGE_SIZES = {
  projectFeatured: '(min-width: 1400px) 750px, (min-width: 1024px) 58vw, 92vw',
  projectCompact: '(min-width: 1400px) 410px, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw',
  offerFeatured: '(min-width: 1400px) 640px, (min-width: 640px) 46vw, 92vw',
  offerCompact: '(min-width: 1400px) 310px, (min-width: 1024px) 23vw, 46vw',
  shopTileLarge: '(min-width: 1400px) 420px, (min-width: 1024px) 32vw, 92vw',
  shopTileSmall: '(min-width: 1400px) 300px, (min-width: 1024px) 22vw, 46vw',
} as const;

const DEFAULT_SHOP_CATEGORY_SLUGS = ['pendelleuchte', 'deckenleuchte', 'stehleuchte'] as const;

export const pickHighlightShopCategories = (
  cmsCategories: ShopCategoryFragment[],
  fallbackCategories: ShopCategory[],
): ShopCategoryFragment[] => {
  if (cmsCategories.length > 0) {
    return cmsCategories.slice(0, 3);
  }

  const bySlug = new Map(fallbackCategories.map((category) => [category.slug, category]));
  const featured = DEFAULT_SHOP_CATEGORY_SLUGS.map((slug) => bySlug.get(slug)).filter((category): category is ShopCategory =>
    Boolean(category),
  );

  if (featured.length >= 3) {
    return featured.slice(0, 3);
  }

  const used = new Set(featured.map((category) => category.id));

  return [...featured, ...fallbackCategories.filter((category) => !used.has(category.id))].slice(0, 3);
};

export const highlightImageAlt = (alt: string | null | undefined, fallback: string): string => {
  const trimmed = alt?.trim();

  return trimmed && trimmed.length > 0 ? trimmed : fallback;
};

type HighlightTeaserImage =
  | {
      alt?: string | null;
      title?: string | null;
      responsiveImage?: {
        src: string;
        width: number;
        height: number;
        alt?: string | null;
        title?: string | null;
        base64?: string | null;
        sizes: string;
      } | null;
    }
  | null
  | undefined;

type HighlightItemLink =
  | {
      link?: {
        teaserImage?: HighlightTeaserImage;
      } | null;
    }
  | null
  | undefined;

export const getHighlightLinkedTeaserImage = (link: HighlightItemLink): HighlightTeaserImage =>
  link?.link?.teaserImage ?? null;
