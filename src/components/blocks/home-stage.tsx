import { HeaderFooterDocument, HeaderFooterRecord, HomeStageBlockFragment } from '@/graphql/generated';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import { draftMode } from 'next/headers';
import { FC } from 'react';
import { SRCImage as DatoSRCImage } from 'react-datocms';
import { Button } from '../button';
import { Header } from '../layout/header';
import { Heading } from '../nodes';

type Props = {
  block: HomeStageBlockFragment;
};

export const HomeStageBlock: FC<Props> = async ({ block: { title, intro, image, callToActions } }) => {
  const { headerFooter } = await queryDatoCMS({
    document: HeaderFooterDocument,
    includeDrafts: draftMode().isEnabled,
  });

  return (
    <div className="bg-black">
      <div className="relative isolate overflow-hidden">
        {image?.responsiveImage && (
          <DatoSRCImage
            data={image.responsiveImage}
            imgClassName={'absolute inset-0 -z-10 size-full object-cover brightness-50 blur-sm'}
            imgStyle={{ width: '100%', maxWidth: '100%', height: '100%' }}
            priority={true}
          />
        )}
        <Header headerFooter={headerFooter as HeaderFooterRecord} />

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="text-center">
              <Heading color="white" level="1">
                {title}
              </Heading>
              <p className="peer my-4 font-sans text-sm text-white md:max-w-prose lg:my-8 lg:text-base">{intro}</p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                {callToActions[0] && (
                  <Button type="primary" text={callToActions[0].label} href={callToActions[0].link?.slug} />
                )}
                {callToActions[1] && (
                  <Button type="secondary" white text={callToActions[1].label} href={callToActions[1].link?.slug} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
