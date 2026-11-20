import { TeaserGridBlockFragment } from '@/graphql/generated';
import { toImage } from '@/utils/image';
import { Card, Grid, gridImageSizes, Section } from '@wehrli/design-system';
import { FC } from 'react';

type Props = {
  block: TeaserGridBlockFragment;
};

export const TeaserGridBlock: FC<Props> = ({ block: { teasers, disableMarginBottom, disableMarginTop } }) => (
  <Section marginBottom={!disableMarginBottom} marginTop={!disableMarginTop}>
    <Grid cols={teasers?.length ?? 3}>
      {teasers?.map((teaser) => {
        const href = `${teaser.parent?.slug ? `/${teaser.parent?.slug}` : ''}/${teaser.slug}`;

        return (
          <Card
            key={teaser.id}
            title={teaser.teaserTitle ?? ''}
            description={teaser.teaserDescription}
            href={href}
            // Project pages are many and rarely opened from the grid: no prefetch.
            prefetch={href.startsWith('/projekte/') ? false : undefined}
            linkLabel={teaser.teaserLinkText ?? 'Anschauen'}
            image={toImage({ responsiveImage: teaser.teaserImage?.responsiveImage })}
            imageSizes={gridImageSizes(teasers.length)}
            eyebrow={teaser.teaserEyebrow}
          />
        );
      })}
    </Grid>
  </Section>
);
