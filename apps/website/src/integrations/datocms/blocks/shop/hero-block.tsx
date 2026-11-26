import { StructuredTextRenderer } from '@/integrations/datocms/blocks/structured-text';
import { toShopCategoryCardData } from '@/components/shop/cards';
import type { Category } from '@/domain/shop/category';
import { SHOP_ALL_PRODUCTS_PATH } from '@/domain/shop/paths';
import { ShopStorefrontHeroFragment } from '@/graphql/generated';
import { toLink } from '@/integrations/datocms/links';
import { StorefrontHero } from '@wehrli/design-system';
import { FC } from 'react';
import { toCategory } from '../../catalog/mapping';
import { toStructuredTextValue } from '../../catalog/structured-text';
import { shopSectionHeadingId } from './sections';

type Props = {
  block: ShopStorefrontHeroFragment;
  fallbackCategories: Category[];
};

/** The categories shown as picture tiles in the hero: the chosen ones, else the first three. */
export const getHeroCategories = (block: ShopStorefrontHeroFragment, fallbackCategories: Category[]): Category[] =>
  block.heroCategories.length > 0 ? block.heroCategories.map(toCategory) : fallbackCategories.slice(0, 3);

export const ShopHeroBlock: FC<Props> = ({ block, fallbackCategories }) => {
  const categories = getHeroCategories(block, fallbackCategories);
  const intro = toStructuredTextValue(block.intro);

  return (
    <StorefrontHero
      headingId={shopSectionHeadingId('shop-hero', block.id)}
      eyebrow={block.eyebrow}
      title={block.title}
      intro={intro && <StructuredTextRenderer data={intro} />}
      primaryCta={toLink(block.primaryCta)}
      secondaryCta={toLink(block.secondaryCta)}
      categories={categories.map(toShopCategoryCardData)}
      allProductsLink={{ href: SHOP_ALL_PRODUCTS_PATH, label: 'Alle Leuchten' }}
    />
  );
};
