import { FC } from 'react';
import { cn } from '../../fundamentals/cn';
import { ImageData } from '../../content/image/image';
import { TeamMemberCard } from '../../content/team-member-card/team-member-card';
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

/**
 * The team. With 1, 4 or 7 people the first one (e.g. the owner) gets a large card across the full width, so the
 * others fill complete rows of three; otherwise all cards share rows of 2 or 3.
 */
export const TeamBlock: FC<Props> = ({ title, members, priority, marginTop, marginBottom }) => {
  const featureFirst = members.length % 3 === 1;
  const [featured, rest] = featureFirst ? [members[0], members.slice(1)] : [null, members];
  // With a block title the names are its sub headings, otherwise they are the section headings.
  const headingLevel = title ? 'h3' : 'h2';

  return (
    <Section marginBottom={marginBottom} marginTop={marginTop}>
      {title && <Heading level="2">{title}</Heading>}
      <div className="flex flex-col gap-4 lg:gap-6">
        {featured ? (
          <TeamMemberCard {...featured} variant="featured" headingLevel={headingLevel} priority={priority} />
        ) : null}
        {rest.length > 0 ? (
          <ul
            className={cn(
              'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6',
              rest.length % 3 === 0 || rest.length > 4 ? 'lg:grid-cols-3' : undefined,
            )}
          >
            {rest.map((member, index) => (
              <li key={member.name}>
                <TeamMemberCard {...member} headingLevel={headingLevel} priority={priority && !featured && index === 0} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Section>
  );
};
