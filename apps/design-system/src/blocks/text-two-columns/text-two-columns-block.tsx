import { FC, ReactNode } from 'react';
import { Grid } from '../../layout/grid/grid';
import { Section } from '../../layout/section/section';
import type { BlockMargins } from '../block-margins';

type Props = BlockMargins & {
  /** Rich text of the left column; an empty column leaves its grid cell to the next one. */
  left?: ReactNode;
  right?: ReactNode;
  anchorId?: string | null;
};

/** Two rich text columns side by side from md, stacked on mobile. */
export const TextTwoColumnsBlock: FC<Props> = ({ left, right, anchorId, marginTop, marginBottom }) => (
  <Section lead id={anchorId} marginTop={marginTop} marginBottom={marginBottom}>
    <Grid cols={2}>
      {left}
      {right}
    </Grid>
  </Section>
);
