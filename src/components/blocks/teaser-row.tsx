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
              className="group relative h-64 w-64 overflow-hidden rounded bg-white"
            >
              <div className="relative h-full w-full overflow-hidden">
                {teaser.teaserImage && (
                  <ImageComponent
                    image={{ responsiveImage: teaser.teaserImage.responsiveImage }}
                    imgClassName="absolute h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40" />
                <div className="absolute inset-0 rounded ring-1 ring-inset ring-gray-900/10" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-sm leading-6 text-gray-300">
                  <h3 className="my-4 font-sans text-sm font-bold text-white peer-[p&]:mt-6 md:text-base lg:text-lg lg:peer-[p&]:mt-8">
                    {teaser.teaserTitle}
                  </h3>
                  <p className="mt-4 inline-block border-b-2">{teaser.teaserLinkText ?? ''}</p>
                </div>
              </div>
            </NextLink>
          ))}
        </div>
      </div>
    </div>
  </BlockWrapper>
);
