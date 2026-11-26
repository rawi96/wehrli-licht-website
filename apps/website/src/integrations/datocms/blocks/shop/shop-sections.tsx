import type { Category } from '@/domain/shop/category';
import type { ProductSummary } from '@/domain/shop/product';
import { FC } from 'react';
import { ShopCategorySectionBlock } from './category-section-block';
import { ShopFeaturedSectionBlock } from './featured-section-block';
import { getHeroCategories, ShopHeroBlock } from './hero-block';
import { ShopPageSection } from './sections';
import { Container } from '@wehrli/design-system';
import { CardsBlock, ConfiguratorTeaserBlock } from '../rich-blocks';

type Props = {
  sections: ShopPageSection[];
  categories: Category[];
  featuredProducts: ProductSummary[];
};

/** The sections of the shop's start page («Shop» in DatoCMS). */
export const ShopSections: FC<Props> = ({ sections, categories, featuredProducts }) => {
  // The hero's category tiles are not repeated in the category list below: one picture once per page.
  const hero = sections.find((section) => section.__typename === 'ShopStorefrontHeroRecord');
  const heroCategoryIds = new Set(hero ? getHeroCategories(hero, categories).map((category) => category.id) : []);
  const listedCategories = categories.filter((category) => !heroCategoryIds.has(category.id));

  return (
    <>
      {sections.map((section) => {
        switch (section.__typename) {
          case 'ShopStorefrontHeroRecord':
            return <ShopHeroBlock key={section.id} block={section} fallbackCategories={categories} />;
          case 'ShopCategorySectionRecord':
            return <ShopCategorySectionBlock key={section.id} block={section} categories={listedCategories} />;
          case 'ShopSfFeaturedRecord':
            return <ShopFeaturedSectionBlock key={section.id} block={section} products={featuredProducts} />;
          case 'CardsBlockRecord':
            // The same tiles as on every page; shop sections are full width, so the tiles get the page container.
            return (
              <Container key={section.id}>
                <CardsBlock block={section} />
              </Container>
            );
          case 'ConfiguratorTeaserRecord':
            return (
              <Container key={section.id}>
                <ConfiguratorTeaserBlock block={section} />
              </Container>
            );
          default:
            return null;
        }
      })}
    </>
  );
};
