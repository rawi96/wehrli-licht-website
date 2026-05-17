import { BlockWrapper } from '@/components/block-wrapper';
import { ImageComponent } from '@/components/image';
import { ShopCategory } from '@/utils/shop';
import Link from 'next/link';
import { FC } from 'react';

type Props = {
  categories: ShopCategory[];
  layout?: 'grid' | 'row';
  basePath?: string;
  disableMarginBottom?: boolean;
  disableMarginTop?: boolean;
};

const gridColsClass = (count: number) =>
  count > 2 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : `grid-cols-${count} sm:grid-cols-${count === 1 ? '1' : '2'}`;

const CategoryCard = ({ category, href, compact }: { category: ShopCategory; href: string; compact?: boolean }) => (
  <Link href={href} className="group block">
    <div className={`group relative cursor-pointer ${compact ? 'w-64' : ''}`}>
      <div className="relative h-80 w-full overflow-hidden rounded bg-white sm:h-64">
        {category.image?.responsiveImage && (
          <ImageComponent
            image={category.image}
            imgClassName="h-full w-full transform object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <h3 className="text-wehrli my-4 text-sm font-bold md:text-base lg:text-lg">{category.name}</h3>
      {category.description && (
        <p
          className={compact ? 'peer my-4 text-sm md:max-w-prose' : 'mt-2 text-sm'}
          dangerouslySetInnerHTML={{ __html: category.description }}
        />
      )}
    </div>
  </Link>
);

export const AllCategoriesGrid: FC<Props> = ({
  categories,
  layout = 'grid',
  basePath = '/shop',
  disableMarginBottom,
  disableMarginTop,
}) => (
  <BlockWrapper disableMarginBottom={disableMarginBottom} disableMarginTop={disableMarginTop}>
    <div className="my-8">
      {layout === 'grid' && (
        <div className={`grid gap-4 ${gridColsClass(categories.length)}`}>
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} href={`${basePath}/kategorien/${category.slug}`} />
          ))}
        </div>
      )}

      {layout === 'row' && (
        <div className="flex overflow-x-scroll pb-5">
          <div className="flex flex-nowrap gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.slug}
                category={category}
                href={`${basePath}/kategorien/${category.slug}`}
                compact
              />
            ))}
          </div>
        </div>
      )}
    </div>
  </BlockWrapper>
);
