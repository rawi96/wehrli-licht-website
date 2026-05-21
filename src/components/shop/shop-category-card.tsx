import { ImageComponent } from '@/components/image';
import { getShopCategoryPath } from '@/constants/shop-paths';
import { ShopCategory } from '@/utils/shop';
import Link from 'next/link';
import { FC } from 'react';

type Props = {
  category: ShopCategory;
};

export const ShopCategoryCard: FC<Props> = ({ category }) => (
  <Link href={getShopCategoryPath(category.slug)} className="group block overflow-hidden rounded bg-white shadow">
    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
      {category.image?.responsiveImage && (
        <ImageComponent
          image={category.image}
          imgClassName="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      )}
    </div>
    <div className="p-4 sm:p-5">
      <h3 className="text-wehrli text-base font-bold sm:text-lg">{category.name}</h3>
      {category.description && (
        <p className="mt-2 line-clamp-2 text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: category.description }} />
      )}
      <p className="text-wehrli mt-3 text-sm font-bold">Produkte ansehen →</p>
    </div>
  </Link>
);
