import { ComponentProps, FC } from 'react';
import { Card } from '../../content/card/card';
import { Grid, gridImageSizes } from '../../layout/grid/grid';
import { Section } from '../../layout/section/section';
import type { BlockMargins } from '../block-margins';

type Teaser = Omit<ComponentProps<typeof Card>, 'imageSizes'> & { id: string };

type Props = BlockMargins & {
  teasers: Teaser[];
};

/** Page teasers as cards: one column on mobile, as many as teasers (at most 3) from md/lg. */
export const TeaserGridBlock: FC<Props> = ({ teasers, marginTop, marginBottom }) => (
  <Section marginBottom={marginBottom} marginTop={marginTop}>
    <Grid cols={teasers.length}>
      {teasers.map(({ id, ...teaser }) => (
        <Card key={id} {...teaser} imageSizes={gridImageSizes(teasers.length)} />
      ))}
    </Grid>
  </Section>
);
