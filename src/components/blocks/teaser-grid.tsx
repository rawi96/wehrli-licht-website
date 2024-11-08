import { TeaserGridBlockFragment } from '@/graphql/generated';
import { classNames } from '@/utils/css';
import NextLink from 'next/link';
import { FC } from 'react';
import { BlockWrapper } from '../block-wrapper';
import { ImageComponent } from '../image';
import { Heading3 } from '../nodes';

type Props = {
  block: TeaserGridBlockFragment;
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

export const TeaserGridBlock: FC<Props> = ({ block: { teasers } }) => (
  <BlockWrapper>
    <div
      className={classNames(
        'my-8 grid grid-flow-row grid-cols-1 gap-4 md:auto-rows-fr md:gap-8 xl:my-16 xl:gap-16',
        teasers.length === 2 ? 'md:grid-cols-2' : teasers.length >= 3 ? 'md:grid-cols-2 lg:grid-cols-3' : undefined,
      )}
    >
      {teasers.map((teaser, index) => (
        <NextLink
          href={`${getBasePath(teaser.__typename)}/${teaser.slug}`}
          title={teaser.teaserTitle}
          key={index}
          className="group grid w-full grid-rows-[auto,1fr,auto] overflow-hidden rounded bg-white text-black shadow transition-shadow duration-300 hover:shadow-xl"
        >
          <div className="relative h-48 w-full overflow-hidden">
            {teaser.teaserImage && (
              <ImageComponent
                image={{ responsiveImage: teaser.teaserImage.responsiveImage }}
                imgClassName="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            )}
          </div>
          <div className="text-xxs grid grid-rows-[auto,1fr,auto] p-5 font-sans font-normal md:p-6 lg:p-8 lg:text-sm">
            <div>
              <Heading3>{teaser.teaserTitle}</Heading3>
              {teaser.teaserDescription && <p className="mb-2 lg:mb-4">{teaser.teaserDescription}</p>}
            </div>
            <div>
              <span className="border-b-2">Angebot ansehen</span>
            </div>
          </div>
        </NextLink>
      ))}
    </div>
  </BlockWrapper>
);
