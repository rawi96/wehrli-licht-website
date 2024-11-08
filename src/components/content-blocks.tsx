import { SearchParams } from '@/app/page';
import { GalleryBlockFragment, PageModelContentField, TeaserGridBlockFragment } from '@/graphql/generated';
import { FC } from 'react';
import { GalleryBlock } from './blocks/gallery';
import { HeaderSectionBlock } from './blocks/header-section';
import { HistoryBlock } from './blocks/history';
import { HomeStageBlock } from './blocks/home-stage';
import { IframeBlock } from './blocks/iframe';
import { ImageGridBlock } from './blocks/image-grid';
import { LogoGridBlock } from './blocks/logo-grid';
import { QuoteBlock } from './blocks/quote';
import { TeamBlock } from './blocks/team';
import { TeaserGridBlock } from './blocks/teaser-grid';
import { TextBlock } from './blocks/text';
import { TextImageBlock } from './blocks/text-image';

type Props = {
  blocks: PageModelContentField[];
} & SearchParams;

const Wrapper: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="max-w-content mx-auto my-24 w-11/12 peer-[]/hero-video:mt-16 md:my-36">{children}</div>
);

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
          case 'HistoryRecord':
            content = <HistoryBlock key={block.id} block={block} />;
            break;
          case 'IframeRecord':
            content = <IframeBlock key={block.id} block={block} />;
            break;
          case 'HeaderSectionRecord':
            content = <HeaderSectionBlock key={block.id} block={block} />;
            break;
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
          case 'HomeStageRecord':
            return <HomeStageBlock key={block.id} block={block} />;
          default:
            return null;
        }

        return <Wrapper key={block.id}>{content}</Wrapper>;
      })}
    </>
  );
};
