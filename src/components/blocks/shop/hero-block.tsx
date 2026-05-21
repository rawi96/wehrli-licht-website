import { ImageComponent } from '@/components/image';
import { Heading } from '@/components/nodes';
import { ShopCmsButton } from '@/components/shop/shop-cms-button';
import { ShopStructuredText } from '@/components/shop/shop-structured-text';
import { ShopTextLink } from '@/components/shop/shop-text-link';
import { getShopCategoryPath, SHOP_ALL_PRODUCTS_PATH } from '@/constants/shop-paths';
import { ShopStorefrontHeroFragment } from '@/graphql/generated';
import { classNames } from '@/utils/css';
import { shopSectionHeadingId } from '@/utils/shop-page-sections';
import { toStructuredTextValue } from '@/utils/shop-structured-text';
import { ShopCategory } from '@/utils/shop';
import Link from 'next/link';
import { FC } from 'react';

type Props = {
  block: ShopStorefrontHeroFragment;
  fallbackCategories: ShopCategory[];
};

export const ShopHeroBlock: FC<Props> = ({ block, fallbackCategories }) => {
  const headingId = shopSectionHeadingId('shop-hero', block.id);
  const categories = block.heroCategories.length > 0 ? block.heroCategories : fallbackCategories.slice(0, 3);
  const [primary, secondary, tertiary] = categories;
  const intro = toStructuredTextValue(block.intro);

  return (
    <section aria-labelledby={headingId} className="border-b border-gray-200 bg-white">
      <div className="mx-auto grid w-11/12 max-w-7xl gap-8 py-8 sm:gap-10 sm:py-12 md:gap-12 md:py-16 lg:grid-cols-12 lg:items-center lg:gap-16 lg:py-20">
        <div className="lg:col-span-5 [&_h1]:mb-4 sm:[&_h1]:mb-6 lg:[&_h1]:mb-8">
          <p className="text-wehrli text-xs font-bold tracking-wide sm:text-sm">{block.eyebrow}</p>
          <Heading level="1" id={headingId}>
            {block.title}
          </Heading>
          <ShopStructuredText data={intro} className="text-sm leading-relaxed text-gray-600 lg:text-base" />

          <div className="mt-6 hidden flex-wrap gap-3 lg:mt-8 lg:flex">
            <ShopCmsButton link={block.primaryCta} type="primary" />
            <ShopCmsButton link={block.secondaryCta} type="secondary" />
          </div>
        </div>

        {categories.length > 0 && (
          <div className="lg:col-span-7">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-bold tracking-wide text-gray-500 uppercase">Top-Kategorien</p>
              <ShopTextLink href={SHOP_ALL_PRODUCTS_PATH} label="Alle Leuchten" />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:hidden">
              {primary && (
                <CategoryTile
                  category={primary}
                  className="col-span-2 aspect-[5/3] min-h-[10.5rem] sm:min-h-52"
                  compact
                  priority
                />
              )}
              {secondary && <CategoryTile category={secondary} className="aspect-[4/5] min-h-36 sm:min-h-40" compact />}
              {tertiary && <CategoryTile category={tertiary} className="aspect-[4/5] min-h-36 sm:min-h-40" compact />}
            </div>

            <div className="hidden h-[min(28rem,52vw)] grid-cols-12 grid-rows-6 gap-3 lg:grid">
              {primary && <CategoryTile category={primary} className="col-span-7 row-span-6" priority />}
              {secondary && <CategoryTile category={secondary} className="col-span-5 row-span-3" />}
              {tertiary && <CategoryTile category={tertiary} className="col-span-5 row-span-3" />}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 lg:hidden">
          <ShopCmsButton link={block.primaryCta} type="primary" fullWidth />
          <ShopCmsButton link={block.secondaryCta} type="secondary" fullWidth />
        </div>
      </div>
    </section>
  );
};

const CategoryTile = ({
  category,
  className,
  compact,
  priority,
}: {
  category: ShopCategory;
  className?: string;
  compact?: boolean;
  priority?: boolean;
}) => (
  <Link
    href={getShopCategoryPath(category.slug)}
    aria-label={`${category.name} – Leuchten-Kategorie`}
    className={classNames('group relative block min-h-0 overflow-hidden rounded bg-gray-100 shadow-sm', className)}
  >
    <div className="absolute inset-0">
      {category.image?.responsiveImage ? (
        <ImageComponent
          image={category.image}
          priority={priority}
          imgClassName="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="bg-wehrli/10 flex size-full items-center justify-center">
          <span className="text-wehrli px-4 text-center text-sm font-bold">{category.name}</span>
        </div>
      )}
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" aria-hidden="true" />
    <div className={classNames('absolute inset-x-0 bottom-0', compact ? 'p-3' : 'p-4')}>
      <p className={classNames('font-bold text-white/80 uppercase', compact ? 'text-[10px]' : 'text-xs')}>
        Leuchten-Kategorie
      </p>
      <p className={classNames('mt-0.5 font-bold text-white', compact ? 'text-sm sm:text-base' : 'text-lg')}>
        {category.name}
      </p>
    </div>
  </Link>
);
