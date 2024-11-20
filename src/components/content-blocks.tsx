import {
  GalleryBlockFragment,
  HeaderSectionBlockFragment,
  HomeStageBlockFragment,
  PageModelContentField,
  TeaserGridBlockFragment,
  TeaserRowBlockFragment,
} from '@/graphql/generated';
import { FC } from 'react';
import { GalleryBlock } from './blocks/gallery';
import { HeaderSectionBlock } from './blocks/header-section';
import { HomeStageBlock } from './blocks/home-stage';
import { IframeBlock } from './blocks/iframe';
import { ImageGridBlock } from './blocks/image-grid';
import { LogoGridBlock } from './blocks/logo-grid';
import { QuoteBlock } from './blocks/quote';
import { AllCategoriesBlock } from './blocks/shop/all-categories';
import { TeamBlock } from './blocks/team';
import { TeaserGridBlock } from './blocks/teaser-grid';
import { TeaserRowBlock } from './blocks/teaser-row';
import { TextBlock } from './blocks/text';
import { TextImageBlock } from './blocks/text-image';
import { ContentWrapper } from './layout/content-wrapper';

type Props = {
  blocks: PageModelContentField[];
};

export const ContentBlocks: FC<Props> = ({ blocks }) => {
  return (
    <>
      {blocks.map((block) => {
        let content;

        switch (block.__typename) {
          case 'TextRecord':
            content = <TextBlock key={block.id} block={block} />;
            break;
          case 'TextImageRecord':
            content = <TextImageBlock key={block.id} block={block} />;
            break;
          case 'TeamRecord':
            content = <TeamBlock key={block.id} block={block} />;
            break;
          case 'IframeRecord':
            content = <IframeBlock key={block.id} block={block} />;
            break;
          case 'HeaderSectionRecord':
            content = <HeaderSectionBlock key={block.id} block={block as HeaderSectionBlockFragment} />;
            break;
          case 'HomeStageRecord':
            return <HomeStageBlock key={block.id} block={block as HomeStageBlockFragment} />;
          case 'QuoteRecord':
            content = <QuoteBlock key={block.id} block={block} />;
            break;
          case 'GalleryRecord':
            content = <GalleryBlock key={block.id} block={block as unknown as GalleryBlockFragment} />;
            break;
          case 'ImageGridRecord':
            content = <ImageGridBlock key={block.id} block={block} />;
            break;
          case 'LogoGridRecord':
            content = <LogoGridBlock key={block.id} block={block} />;
            break;
          case 'TeaserGridRecord':
            content = <TeaserGridBlock key={block.id} block={block as TeaserGridBlockFragment} />;
            break;
          case 'TeaserRowRecord':
            content = <TeaserRowBlock key={block.id} block={block as TeaserRowBlockFragment} />;
            break;
          case 'AllCategoriesBlockRecord':
            content = <AllCategoriesBlock key={block.id} block={block} />;
            break;

          default:
            return null;
        }

        return <ContentWrapper key={block.id}>{content}</ContentWrapper>;
      })}
    </>
  );
};
