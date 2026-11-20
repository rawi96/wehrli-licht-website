import { toLink } from '@/utils/cms-link';
import { HeaderFooterDocument, HeaderFooterRecord, HomeStageBlockFragment } from '@/graphql/generated';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import { HomeStageBlock as HomeStageBlockView, HomeStageSlide } from '@wehrli/design-system';
import { draftMode } from 'next/headers';
import { FC } from 'react';
import { Header } from '../layout/header';

type Props = {
  block: HomeStageBlockFragment;
};

type ResponsiveImage = NonNullable<HomeStageBlockFragment['image']>['responsiveImage'] | null | undefined;

const toSlide = (id: string, responsiveImage: ResponsiveImage): HomeStageSlide[] =>
  responsiveImage?.src ? [{ id, src: responsiveImage.src, blurDataURL: responsiveImage.base64 }] : [];

/** The block's image first, then the slideshow images. */
const buildSlides = (block: HomeStageBlockFragment): HomeStageSlide[] => [
  ...toSlide('primary-image', block.image?.responsiveImage),
  ...(block.slideshowImages ?? []).flatMap((image) =>
    image?.responsiveImage ? toSlide(image.id ?? image.responsiveImage.src, image.responsiveImage) : [],
  ),
];

export const HomeStageBlock: FC<Props> = async ({ block }) => {
  const { isEnabled } = await draftMode();
  const { headerFooter } = await queryDatoCMS({
    document: HeaderFooterDocument,
    includeDrafts: isEnabled,
  });

  return (
    <HomeStageBlockView
      title={block.title}
      intro={block.intro}
      ctas={block.callToActions.slice(0, 2).map(toLink)}
      slides={buildSlides(block)}
      header={<Header headerFooter={headerFooter as HeaderFooterRecord} variant="overlay" />}
    />
  );
};
