import { TeaserRowBlockFragment } from '@/graphql/generated';
import NextLink from 'next/link';
import { FC } from 'react';
import { BlockWrapper } from '../block-wrapper';
import { ImageComponent } from '../image';

type Props = {
  block: TeaserRowBlockFragment;
};

const getBasePath = (typeName?: 'OfferRecord' | 'ProjectRecord') => {
  switch (typeName) {
    case 'OfferRecord':
      return '/angebot';
    case 'ProjectRecord':
      return '/projekte';
    default:
      console.error('Unknown type name in teaser grid block', typeName);

      return '/';
  }
};

export const TeaserRowBlock: FC<Props> = ({ block: { teasers } }) => (
  <BlockWrapper>
    <div className="pb-20 pt-10">
      <div className="flex overflow-x-scroll pb-5">
        <div className="flex flex-nowrap gap-4">
          {teasers.map((teaser) => (
            <NextLink
              href={`${getBasePath(teaser.__typename)}/${teaser.slug}`}
              title={teaser.teaserTitle}
              key={teaser.id}
              className="group relative h-64 w-64 overflow-hidden rounded-lg bg-white shadow transition-shadow duration-300 hover:shadow-xl"
            >
              <div className="relative h-full w-full overflow-hidden">
                <ImageComponent
                  image={{ responsiveImage: teaser.teaserImage.responsiveImage }}
                  imgClassName="absolute h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40" />
                <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-gray-900/10" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-sm leading-6 text-gray-300">
                  <h3 className="text-lg font-semibold leading-6 text-white">{teaser.teaserTitle}</h3>
                  {teaser.teaserDescription && <p className="mt-1 text-sm text-white">{teaser.teaserDescription}</p>}
                  <span className="mt-4 inline-block border-b-2">
                    {teaser.__typename === 'OfferRecord' ? 'Angebot ansehen' : 'Projekt ansehen'}
                  </span>
                </div>
              </div>
            </NextLink>
          ))}
        </div>
      </div>
    </div>
  </BlockWrapper>
);
