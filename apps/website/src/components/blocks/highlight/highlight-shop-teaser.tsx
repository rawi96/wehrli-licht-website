import { getShopCategoryPath } from '@/constants/shop-paths';
import { HighlightShopTeaserFragment } from '@/graphql/generated';
import { toLink } from '@/utils/cms-link';
import { highlightImageAlt, pickHighlightShopCategories } from '@/utils/highlight-teaser';
import { toImage } from '@/utils/image';
import { getAllCategories } from '@/utils/shop';
import { HighlightShopTeaserBlock as HighlightShopTeaserBlockView } from '@wehrli/design-system';

type Props = {
  block: HighlightShopTeaserFragment;
  /** Block is near the top of the page: load its lead image eagerly (LCP). */
  aboveFold?: boolean;
};

export const HighlightShopTeaserBlock = async ({ block, aboveFold = false }: Props) => {
  const { primaryCta, secondaryCta, featuredCategories } = block;

  if (!primaryCta || !secondaryCta) {
    return null;
  }

  const fallbackCategories = await getAllCategories();
  const featured = pickHighlightShopCategories(featuredCategories, fallbackCategories);

  if (featured.length === 0 && fallbackCategories.length === 0) {
    return null;
  }

  const featuredIds = new Set(featured.map((category) => category.id));

  return (
    <HighlightShopTeaserBlockView
      id={block.id}
      eyebrow={block.eyebrow}
      title={block.title}
      subline={block.subline}
      primaryCta={toLink(primaryCta)}
      secondaryCta={toLink(secondaryCta)}
      popularCategoriesLabel={block.popularCategoriesLabel ?? 'Beliebte Kategorien'}
      moreCategoriesLabel={block.moreCategoriesLabel ?? 'Weitere Kategorien'}
      priority={aboveFold}
      featuredCategories={featured.map((category) => ({
        id: category.id,
        name: category.name,
        href: getShopCategoryPath(category.slug),
        image: category.image?.responsiveImage
          ? toImage({
              ...category.image,
              alt: highlightImageAlt(category.image.alt, `${category.name} – Leuchten-Kategorie`),
            })
          : undefined,
      }))}
      moreCategories={fallbackCategories
        .filter((category) => !featuredIds.has(category.id))
        .map((category) => ({ id: category.id, name: category.name, href: getShopCategoryPath(category.slug) }))}
    />
  );
};
