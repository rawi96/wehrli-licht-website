import { HeaderFooterDocument, HeaderFooterRecord, HomeStageBlockFragment } from '@/graphql/generated';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import Image from 'next/image';
import { FC } from 'react';
import { Button } from '../button';
import { Header } from '../layout/header';

type Props = {
  block: HomeStageBlockFragment;
};

export const HomeStageBlock: FC<Props> = async ({ block: { title, intro, image, callToActions } }) => {
  const { headerFooter } = await queryDatoCMS({ document: HeaderFooterDocument });

  return (
    <div className="relative isolate mb-20 overflow-hidden bg-gray-900">
      {image?.responsiveImage && (
        <Image
          src={image.responsiveImage.src}
          alt={image.responsiveImage.alt ?? 'Lampen'}
          fill
          style={{ objectFit: 'cover' }}
          className="absolute inset-0 -z-10 blur-sm brightness-50"
          sizes={image.responsiveImage.sizes}
        />
      )}
      <Header headerFooter={headerFooter as HeaderFooterRecord} backgroundColor={'bg-transparent'} />
      <div className="px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">{title}</h1>
            <p className="mt-6 text-lg leading-8 text-white">{intro}</p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {callToActions[0] && <Button type="primary" text={callToActions[0].text} href={callToActions[0].url} />}
              {callToActions[1] && (
                <Button type="secondary" white text={callToActions[1].text} href={callToActions[1].url} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
