import { ImageComponent } from '@/components/image';
import { getShopCategoryPath } from '@/constants/shop-paths';
import { ShopCategoryFragment } from '@/graphql/generated';
import { HIGHLIGHT_IMAGE_SIZES, highlightImageAlt } from '@/utils/highlight-teaser';
import { classNames } from '@/utils/css';
import Link from 'next/link';
import { FC } from 'react';

type Props = {
  category: ShopCategoryFragment;
  className?: string;
  compact?: boolean;
  priority?: boolean;
};

export const HighlightShopCategoryTile: FC<Props> = ({ category, className, compact, priority }) => {
  const imageAlt = highlightImageAlt(category.image?.alt, `${category.name} – Leuchten-Kategorie`);

  return (
    <Link
      href={getShopCategoryPath(category.slug)}
      className={classNames(
        'group relative block min-h-0 min-w-0 overflow-hidden rounded bg-gray-900/40 shadow-sm ring-1 ring-white/10',
        'transition-shadow duration-300 hover:ring-white/25 active:scale-[0.99] motion-reduce:active:scale-100',
        'focus-visible:ring-offset-wehrli focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none',
        className,
      )}
    >
      <div className="absolute inset-0">
        {category.image?.responsiveImage ? (
          <ImageComponent
            image={{ ...category.image, alt: imageAlt }}
            priority={priority}
            sizes={compact ? HIGHLIGHT_IMAGE_SIZES.shopTileSmall : HIGHLIGHT_IMAGE_SIZES.shopTileLarge}
            imgClassName="size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
          />
        ) : (
          <div className="bg-wehrli/30 flex size-full items-center justify-center">
            <span className="px-3 text-center text-sm font-bold text-white sm:px-4">{category.name}</span>
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" aria-hidden />
      <div className={classNames('absolute inset-x-0 bottom-0', compact ? 'p-3' : 'p-4 sm:p-5')}>
        <p
          className={classNames(
            'font-bold text-white/75 uppercase',
            compact ? 'text-[10px] tracking-[0.12em]' : 'text-xs tracking-[0.16em]',
          )}
        >
          Kategorie
        </p>
        <p
          className={classNames(
            'mt-0.5 font-bold break-words text-white',
            compact ? 'text-sm leading-snug sm:text-base' : 'text-lg sm:text-xl',
          )}
        >
          {category.name}
        </p>
      </div>
    </Link>
  );
};
