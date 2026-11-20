import { ShopCategoryFragment } from '@/graphql/generated';
import { toImage } from '../../image';
import { ShopCategory } from '@/utils/shop';
import type { ImageData } from '@wehrli/design-system';

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

type HighlightTeaserImage = NonNullable<Parameters<typeof toImage>[0]> | null;

type HighlightItemLink =
  | {
      link?: {
        teaserImage?: HighlightTeaserImage;
      } | null;
    }
  | null
  | undefined;

/** Teaser image of the page a highlight item links to, with `fallbackAlt` when the image has no alt text. */
export const highlightLinkedImage = (link: HighlightItemLink, fallbackAlt: string): ImageData | undefined => {
  const teaserImage = link?.link?.teaserImage;

  return toImage(teaserImage, { fallbackAlt });
};
