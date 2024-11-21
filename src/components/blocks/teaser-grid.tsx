import { TeaserGridBlockFragment } from '@/graphql/generated';
import { FC } from 'react';
import { BlockWrapper } from '../block-wrapper';
import { Card } from '../card';
import { Grid } from '../grid';

type Props = {
  block: TeaserGridBlockFragment;
};

export const TeaserGridBlock: FC<Props> = ({ block: { teasers, disableMarginBottom, disableMarginTop } }) => (
  <BlockWrapper disableMarginBottom={disableMarginBottom} disableMarginTop={disableMarginTop}>
    <Grid cols={teasers?.length ?? 3}>
      {teasers?.map((teaser) => (
        <Card
          key={teaser.id}
          title={teaser.teaserTitle ?? ''}
          description={teaser.teaserDescription}
          link={`${teaser.parent?.slug ? `/${teaser.parent?.slug}` : ''}/${teaser.slug}`}
          linkLabel={teaser.teaserLinkText}
          image={teaser.teaserImage?.responsiveImage}
        />
      ))}
    </Grid>
  </BlockWrapper>
);
