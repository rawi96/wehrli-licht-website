import { ShopCategoryFragment } from '@/graphql/generated';
import { ShopCategory } from '@/utils/shop';

export const HIGHLIGHT_IMAGE_SIZES = {
  projectFeatured: '(max-width: 1024px) 100vw, 62vw',
  projectCompact: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
  offerFeatured: '(max-width: 640px) 100vw, 50vw',
  offerCompact: '(max-width: 640px) 50vw, 25vw',
  shopTileLarge: '(max-width: 1024px) 100vw, 42vw',
  shopTileSmall: '(max-width: 1024px) 50vw, 21vw',
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
