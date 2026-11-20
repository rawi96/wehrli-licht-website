import { FC } from 'react';
import { TeamMemberCard } from '../../content/team-member-card/team-member-card';
import { ImageData } from '../../content/image/image';
import { Grid } from '../../layout/grid/grid';
import { Section } from '../../layout/section/section';
import { Heading } from '../../typography/heading/heading';
import type { BlockMargins } from '../block-margins';

type Member = {
  name: string;
  role?: string | null;
  bio?: string | null;
  image?: ImageData | null;
};

type Props = BlockMargins & {
  title?: string | null;
  members: Member[];
  /** Loads the first portrait with priority (LCP). */
  priority?: boolean;
};

/** The team as cards in a 3-column grid, with an optional heading. */
export const TeamBlock: FC<Props> = ({ title, members, priority, marginTop, marginBottom }) => (
  <Section marginBottom={marginBottom} marginTop={marginTop}>
    {title && <Heading level="2">{title}</Heading>}
    <Grid cols={3}>
      {members.map((member, index) => (
        <TeamMemberCard
          key={member.name}
          {...member}
          // With a block title the names are its sub headings, otherwise they are the section headings.
          headingLevel={title ? 'h3' : 'h2'}
          priority={priority && index === 0}
        />
      ))}
    </Grid>
  </Section>
);
