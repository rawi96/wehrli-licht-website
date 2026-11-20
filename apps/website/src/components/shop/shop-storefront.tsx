import { ShopCategorySectionBlock } from '@/components/blocks/shop/category-section-block';
import { ShopFeaturedSectionBlock } from '@/components/blocks/shop/featured-section-block';
import { ShopHeroBlock } from '@/components/blocks/shop/hero-block';
import { ShopServiceSectionBlock } from '@/components/blocks/shop/service-section-block';
import { ShopCategory, ShopProductListItem } from '@/utils/shop';
import { ShopPageSection } from '@/utils/shop-page-sections';
import { FC } from 'react';

type Props = {
  sections: ShopPageSection[];
  categories: ShopCategory[];
  featuredProducts: ShopProductListItem[];
};

export const ShopStorefront: FC<Props> = ({ sections, categories, featuredProducts }) => (
  <>
    {sections.map((section) => {
      switch (section.__typename) {
        case 'ShopStorefrontHeroRecord':
          return <ShopHeroBlock key={section.id} block={section} fallbackCategories={categories} />;
        case 'ShopCategorySectionRecord':
          return <ShopCategorySectionBlock key={section.id} block={section} categories={categories} />;
        case 'ShopSfFeaturedRecord':
          return <ShopFeaturedSectionBlock key={section.id} block={section} products={featuredProducts} />;
        case 'ShopServiceSectionRecord':
          return <ShopServiceSectionBlock key={section.id} block={section} />;
        default:
          return null;
      }
    })}
  </>
);
