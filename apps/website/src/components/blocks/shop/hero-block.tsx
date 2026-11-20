import { StructuredTextRenderer } from '@/integrations/datocms/blocks/structured-text';
import { SHOP_ALL_PRODUCTS_PATH } from '@/constants/shop-paths';
import { ShopStorefrontHeroFragment } from '@/graphql/generated';
import { toShopCategoryCardData } from '@/utils/shop-cards';
import { shopSectionHeadingId } from '@/utils/shop-page-sections';
import { ShopCategory } from '@/utils/shop';
import { toLink } from '@/integrations/datocms/links';
import { toStructuredTextValue } from '@/utils/shop-structured-text';
import { StorefrontHero } from '@wehrli/design-system';
import { FC } from 'react';

type Props = {
  block: ShopStorefrontHeroFragment;
  fallbackCategories: ShopCategory[];
};

export const ShopHeroBlock: FC<Props> = ({ block, fallbackCategories }) => {
  const categories = block.heroCategories.length > 0 ? block.heroCategories : fallbackCategories.slice(0, 3);
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
