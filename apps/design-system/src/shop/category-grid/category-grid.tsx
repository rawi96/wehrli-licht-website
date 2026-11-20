/* eslint-disable @eslint-react/dom-no-dangerously-set-innerhtml -- descriptions are HTML from the CMS */
import Link from 'next/link';
import { FC } from 'react';
import { Image } from '../../content/image/image';
import { cn } from '../../fundamentals/cn';
import { Section } from '../../layout/section/section';
import { ShopCategoryCardData } from '../category-card/category-card';
import { HorizontalScroll, HorizontalScrollItem } from '../horizontal-scroll/horizontal-scroll';

export type ShopCategoryGridItem = ShopCategoryCardData & {
  /** Small text above the name (row layout only). */
  eyebrow?: string | null;
  /** Link text at the bottom of the card (row layout only). */
  linkLabel?: string | null;
};

type Props = {
  items: ShopCategoryGridItem[];
  /** `grid`: 1 column, 2 from sm, 3 from lg. `row`: fixed-width cards in a horizontal scroll row. */
  layout?: 'grid' | 'row';
  marginTop?: boolean;
  marginBottom?: boolean;
  /** Accessible name of the scroll row. */
  rowLabel?: string;
};

const gridColsClass = (count: number) => {
  if (count > 2) {
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  }

  return count === 2 ? 'grid-cols-2 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-1';
};

/** Two columns from sm (640px), three from lg. */
const CATEGORY_GRID_SIZES = '(min-width: 1400px) 410px, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw';

const RowCard: FC<{ item: ShopCategoryGridItem }> = ({ item }) => (
  <Link
    href={item.href}
    className="group hover:ring-wehrli/30 flex h-full w-64 shrink-0 flex-col overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-md"
  >
    <div className="relative h-52 w-full shrink-0 overflow-hidden bg-gray-100">
      {item.image && <Image sizes="256px" image={item.image} hoverZoom="quick" />}
    </div>
    <div className="flex min-h-0 flex-1 flex-col p-4">
      {item.eyebrow ? (
        <p className="text-xs text-gray-500">{item.eyebrow}</p>
      ) : (
        <span className="block h-[1.125rem]" aria-hidden="true" />
      )}
      <h3 className="text-wehrli mt-1 line-clamp-2 min-h-[2.75rem] text-base font-bold">{item.name}</h3>
      {item.descriptionHtml ? (
        <p
          className="mt-2 line-clamp-3 flex-1 text-sm text-gray-600"
          dangerouslySetInnerHTML={{ __html: item.descriptionHtml }}
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

const GridCard: FC<{ item: ShopCategoryGridItem }> = ({ item }) => (
  <Link href={item.href} className="group block">
    <div className="group relative cursor-pointer">
      <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white shadow-sm sm:h-64">
        {item.image && <Image sizes={CATEGORY_GRID_SIZES} image={item.image} hoverZoom="quick" />}
      </div>
      <h3 className="text-wehrli my-4 text-sm font-bold md:text-base lg:text-lg">{item.name}</h3>
      {item.descriptionHtml && <p className="mt-2 text-sm" dangerouslySetInnerHTML={{ __html: item.descriptionHtml }} />}
    </div>
  </Link>
);

/** All product categories as a content block: a grid of image cards or a horizontal scroll row. */
export const ShopCategoryGrid: FC<Props> = ({
  items,
  layout = 'grid',
  marginTop = true,
  marginBottom = true,
  rowLabel = 'Horizontal scrollbare Karten',
}) => (
  <Section marginBottom={marginBottom} marginTop={marginTop}>
    <div className="my-8">
      {layout === 'grid' && (
        <div className={cn('grid gap-4', gridColsClass(items.length))}>
          {items.map((item) => (
            <GridCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {layout === 'row' && (
        <HorizontalScroll label={rowLabel}>
          {items.map((item) => (
            <HorizontalScrollItem key={item.id}>
              <RowCard item={item} />
            </HorizontalScrollItem>
          ))}
        </HorizontalScroll>
      )}
    </div>
  </Section>
);
