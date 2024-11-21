import { AllCategoriesBlockFragment } from '@/graphql/generated';
import { getAllCategories } from '@/utils/shop';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import { BlockWrapper } from '../../block-wrapper';

type Props = {
  block: AllCategoriesBlockFragment;
};

export const AllCategoriesBlock: FC<Props> = async ({ block: { disableMarginBottom, disableMarginTop } }) => {
  const categories = await getAllCategories();

  return (
    <BlockWrapper disableMarginBottom={disableMarginBottom} disableMarginTop={disableMarginTop}>
      <div className="mx-auto max-w-2xl pb-20 lg:max-w-none">
        <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
          {categories.map((category) => (
            <Link key={category.slug} href={`/shop/kategorien/${category.slug}`} className="group block">
              <div key={category.name} className="group relative cursor-pointer">
                <div className="sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 relative mt-12 h-80 w-full overflow-hidden rounded bg-white sm:h-64">
                  {category.images?.length && category.images[0].file?.url && (
                    <Image
                      src={category.images[0].file.url}
                      alt={category.name}
                      className="h-full w-full transform object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      height={100}
                      width={1000}
                    />
                  )}
                </div>
                <h3 className="my-4 font-sans text-sm font-bold text-wehrli peer-[p&]:mt-6 md:text-base lg:text-lg lg:peer-[p&]:mt-8">
                  {category.name}
                </h3>
                <p
                  className="mt-2 text-xs"
                  dangerouslySetInnerHTML={{
                    __html: category.description,
                  }}
                ></p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </BlockWrapper>
  );
};
