import { Header } from '@/components/layout/header';
import { HomeStageBlockFragment } from '@/graphql/generated';
import { HomeStageBlock as HomeStageBlockView, HomeStageSlide } from '@wehrli/design-system';
import { FC } from 'react';
import { toLink } from '../links';
import { getSiteLayout } from '../site-layout';
import { getSiteTexts } from '../site-texts';

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
  const [{ navigation, contactLink, shopMenu }, texts] = await Promise.all([getSiteLayout(), getSiteTexts()]);

  return (
    <HomeStageBlockView
      title={block.title}
      intro={block.intro}
      ctas={block.callToActions.slice(0, 2).map(toLink)}
      slides={buildSlides(block)}
      header={
        <Header
          navigation={navigation}
          contactLink={contactLink}
          shopMenu={shopMenu}
          labels={{ overview: texts.menuOverviewLabel, shopOverview: texts.menuShopOverviewLabel }}
          variant="overlay"
        />
      }
    />
  );
};
