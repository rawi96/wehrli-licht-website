import { TeaserRowBlockFragment } from '@/graphql/generated';
import NextLink from 'next/link';
import { FC } from 'react';
import { BlockWrapper } from '../block-wrapper';
import { ImageComponent } from '../image';

type Props = {
  block: TeaserRowBlockFragment;
};

export const TeaserRowBlock: FC<Props> = ({ block: { teasers } }) => (
  <BlockWrapper>
    <div className="pb-20 pt-10">
      <div className="flex overflow-x-scroll pb-5">
        <div className="flex flex-nowrap gap-4">
          {teasers.map((teaser) => (
            <NextLink
              href={`${teaser.parent?.slug ? `/${teaser.parent?.slug}` : ''}/${teaser.slug}`}
              title={teaser.teaserTitle ?? ''}
              key={teaser.id}
              className="group relative h-64 w-64 overflow-hidden rounded bg-white shadow transition-shadow duration-300 hover:shadow-xl"
            >
              <div className="relative h-full w-full overflow-hidden">
                {teaser.teaserImage && (
                  <ImageComponent
                    image={{ responsiveImage: teaser.teaserImage.responsiveImage }}
                    imgClassName="absolute h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                )}
                <div className="from-gray-900 via-gray-900/40 absolute inset-0 bg-gradient-to-t" />
                <div className="ring-gray-900/10 absolute inset-0 rounded ring-1 ring-inset" />
                <div className="text-gray-300 absolute bottom-0 left-0 right-0 p-4 text-sm leading-6">
                  <h3 className="text-lg font-bold leading-6 text-white">{teaser.teaserTitle}</h3>
                  {teaser.teaserDescription && <p className="mt-1 text-sm text-white">{teaser.teaserDescription}</p>}
                  <span className="mt-4 inline-block border-b-2">{teaser.teaserLinkText ?? ''}</span>
                </div>
              </div>
            </NextLink>
          ))}
        </div>
      </div>
    </div>
  </BlockWrapper>
);
