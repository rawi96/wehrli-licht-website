import { BlockWrapper } from '@/components/block-wrapper';
import { ImageComponent } from '@/components/image';
import { ShopHorizontalScroll, ShopHorizontalScrollItem } from '@/components/shop/shop-horizontal-scroll';
import { getShopCategoryPath } from '@/constants/shop-paths';
import { ShopCategory } from '@/utils/shop';
import Link from 'next/link';
import { ComponentProps, FC } from 'react';

type GridItemImage = NonNullable<ComponentProps<typeof ImageComponent>['image']>;

export type CategoryGridItem = {
  id: string;
  name: string;
  href: string;
  description?: string | null;
  image?: GridItemImage | null;
  eyebrow?: string | null;
  linkLabel?: string | null;
};

export const shopCategoryToGridItem = (category: ShopCategory): CategoryGridItem => ({
  id: category.id,
  name: category.name,
  href: getShopCategoryPath(category.slug),
  description: category.description,
  image: category.image,
  linkLabel: 'Kategorie entdecken',
});

type Props = {
  items: CategoryGridItem[];
  layout?: 'grid' | 'row';
  disableMarginBottom?: boolean;
  disableMarginTop?: boolean;
};

const gridColsClass = (count: number) =>
  count > 2 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : `grid-cols-${count} sm:grid-cols-${count === 1 ? '1' : '2'}`;

const SCROLL_CARD_WIDTH = 'w-64';
const SCROLL_CARD_IMAGE_HEIGHT = 'h-52';

const CategoryCard = ({ item, compact }: { item: CategoryGridItem; compact?: boolean }) => {
  if (compact) {
    return (
      <Link
        href={item.href}
        className={`group flex ${SCROLL_CARD_WIDTH} hover:ring-wehrli/30 h-full shrink-0 flex-col overflow-hidden rounded bg-white shadow ring-1 ring-gray-200 transition-shadow hover:shadow-md`}
      >
        <div className={`relative ${SCROLL_CARD_IMAGE_HEIGHT} w-full shrink-0 overflow-hidden bg-gray-100`}>
          {item.image?.responsiveImage && (
            <ImageComponent
              image={item.image}
              imgClassName="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>
        <div className="flex min-h-0 flex-1 flex-col p-4">
          {item.eyebrow ? (
            <p className="text-xs font-medium text-gray-500">{item.eyebrow}</p>
          ) : (
            <span className="block h-[1.125rem]" aria-hidden="true" />
          )}
          <h3 className="text-wehrli mt-1 line-clamp-2 min-h-[2.75rem] text-base font-bold">{item.name}</h3>
          {item.description ? (
            <p
              className="mt-2 line-clamp-3 flex-1 text-sm text-gray-600"
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
          ) : (
            <div className="flex-1" aria-hidden="true" />
          )}
          {item.linkLabel && (
            <span className="text-wehrli group-hover:border-wehrli-400 mt-auto inline-block w-fit border-b-2 border-black pt-4 text-sm font-bold transition-colors">
              {item.linkLabel}
              <span aria-hidden="true"> →</span>
            </span>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link href={item.href} className="group block">
      <div className="group relative cursor-pointer">
        <div className="relative h-80 w-full overflow-hidden rounded bg-white shadow sm:h-64">
          {item.image?.responsiveImage && (
            <ImageComponent
              image={item.image}
              imgClassName="h-full w-full transform object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>
        <h3 className="text-wehrli my-4 text-sm font-bold md:text-base lg:text-lg">{item.name}</h3>
        {item.description && <p className="mt-2 text-sm" dangerouslySetInnerHTML={{ __html: item.description }} />}
      </div>
    </Link>
  );
};

export const AllCategoriesGrid: FC<Props> = ({ items, layout = 'grid', disableMarginBottom, disableMarginTop }) => (
  <BlockWrapper disableMarginBottom={disableMarginBottom} disableMarginTop={disableMarginTop}>
    <div className="my-8">
      {layout === 'grid' && (
        <div className={`grid gap-4 ${gridColsClass(items.length)}`}>
          {items.map((item) => (
            <CategoryCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {layout === 'row' && (
        <ShopHorizontalScroll ariaLabel="Horizontal scrollbare Karten">
          {items.map((item) => (
            <ShopHorizontalScrollItem key={item.id}>
              <CategoryCard item={item} compact />
            </ShopHorizontalScrollItem>
          ))}
        </ShopHorizontalScroll>
      )}
    </div>
  </BlockWrapper>
);
