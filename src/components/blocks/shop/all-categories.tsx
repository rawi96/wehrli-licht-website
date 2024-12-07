import { BlockWrapper } from '@/components/block-wrapper';
import { AllCategoriesBlockFragment } from '@/graphql/generated';
import { getAllCategories } from '@/utils/shop';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

type Props = {
  block: AllCategoriesBlockFragment;
};

export const AllCategoriesBlock: FC<Props> = async ({ block: { disableMarginBottom, disableMarginTop, layout } }) => {
  const categories = await getAllCategories();

  const isGrid = layout === 'grid';
  const isRow = layout === 'row';

  return (
    <BlockWrapper disableMarginBottom={disableMarginBottom} disableMarginTop={disableMarginTop}>
      <div className="my-8">
        {isGrid && (
          <div
            className={`grid gap-4 ${
              categories.length > 2
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : `grid-cols-${categories.length} sm:grid-cols-${categories.length === 1 ? '1' : '2'}`
            }`}
          >
            {categories.map((category) => (
              <Link key={category.slug} href={`/shop/kategorien/${category.slug}`} className="group block">
                <div className="group relative cursor-pointer">
                  <div className="relative h-80 w-full overflow-hidden rounded bg-white sm:h-64">
                    {category.images?.length && category.images[0].file?.url && (
                      <Image
                        src={category.images[0].file.url}
                        alt={'Übersichtsbild für die Shop Kategorie ' + category.name}
                        className="h-full w-full transform object-cover object-center transition-transform duration-300 group-hover:scale-105"
                        height={100}
                        width={1000}
                      />
                    )}
                  </div>
                  <h3 className="my-4 text-sm font-bold text-wehrli md:text-base lg:text-lg">{category.name}</h3>
                  <p
                    className="mt-2 text-sm"
                    dangerouslySetInnerHTML={{
                      __html: category.description,
                    }}
                  ></p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {isRow && (
          <div className="flex overflow-x-scroll pb-5">
            <div className="flex flex-nowrap gap-4">
              {categories.map((category) => (
                <Link key={category.slug} href={`/shop/kategorien/${category.slug}`} className="group block">
                  <div className="group relative w-64 cursor-pointer">
                    <div className="relative h-80 w-full overflow-hidden rounded bg-white sm:h-64">
                      {category.images?.length && category.images[0].file?.url && (
                        <Image
                          src={category.images[0].file.url}
                          alt={'Übersichtsbild für die Shop Kategorie ' + category.name}
                          className="h-full w-full transform object-cover object-center transition-transform duration-300 group-hover:scale-105"
                          height={100}
                          width={1000}
                        />
                      )}
                    </div>
                    <h3 className="my-4 text-sm font-bold text-wehrli md:text-base lg:text-lg">{category.name}</h3>
                    <p
                      className="peer my-4 text-sm md:max-w-prose"
                      dangerouslySetInnerHTML={{
                        __html: category.description,
                      }}
                    ></p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </BlockWrapper>
  );
};
