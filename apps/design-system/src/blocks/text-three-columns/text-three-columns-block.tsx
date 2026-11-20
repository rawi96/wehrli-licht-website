import { FC, ReactNode } from 'react';
import { Grid } from '../../layout/grid/grid';
import { Section } from '../../layout/section/section';
import type { BlockMargins } from '../block-margins';

type Props = BlockMargins & {
  /** Rich text of the left column; an empty column leaves its grid cell to the next one. */
  left?: ReactNode;
  middle?: ReactNode;
  right?: ReactNode;
  anchorId?: string | null;
};

/** Three rich text columns: 1 on mobile, 2 from md, 3 from lg. */
export const TextThreeColumnsBlock: FC<Props> = ({ left, middle, right, anchorId, marginTop, marginBottom }) => (
  <Section lead id={anchorId} marginTop={marginTop} marginBottom={marginBottom}>
    <Grid cols={3}>
      {left}
      {middle}
      {right}
    </Grid>
  </Section>
);
