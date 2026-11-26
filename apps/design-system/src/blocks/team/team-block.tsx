import { createElement, FC } from 'react';
import { Image, ImageData } from '../../content/image/image';
import { Section } from '../../layout/section/section';
import { Heading } from '../../typography/heading/heading';
import type { BlockMargins } from '../block-margins';

type Member = {
  /** Unique per person (two people may share a name). */
  id: string;
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

/** One person: function, name and text on the left, the portrait on the right (above the text on phones). */
const Profile: FC<{ member: Member; headingLevel: 'h2' | 'h3'; priority?: boolean }> = ({
  member,
  headingLevel,
  priority,
}) => (
  <article className="card-surface grid h-full overflow-hidden sm:grid-cols-[3fr_2fr]">
    <div className="flex flex-col justify-center p-6 lg:p-8">
      {member.role && <p className="text-xs font-bold text-gray-600">{member.role}</p>}
      {createElement(headingLevel, { className: 'text-wehrli mt-2 text-lg font-bold break-words' }, member.name)}
      {member.bio && <p className="mt-4 text-sm whitespace-pre-line text-black">{member.bio}</p>}
    </div>
    {/* Portrait on the right, like all pictures beside text; first on phones. */}
    <div className="relative -order-1 aspect-[4/5] w-full sm:order-none">
      {member.image && <Image image={member.image} sizes={PORTRAIT_SIZES} priority={priority} absolute />}
    </div>
  </article>
);

/** Rendered portrait width: 2/5 of a card, cards in two columns from lg. */
const PORTRAIT_SIZES = '(min-width: 1400px) 250px, (min-width: 1024px) 18vw, (min-width: 640px) 37vw, 92vw';

/** The team: a profile per person, two per row from lg. */
export const TeamBlock: FC<Props> = ({ title, members, priority, marginTop, marginBottom }) => {
  // With a block title the names are its sub headings, otherwise they are the section headings.
  const headingLevel = title ? 'h3' : 'h2';

  return (
    <Section marginBottom={marginBottom} marginTop={marginTop}>
      {title && <Heading level="2">{title}</Heading>}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
        {members.map((member, index) => (
          <Profile key={member.id} member={member} headingLevel={headingLevel} priority={priority && index === 0} />
        ))}
      </div>
    </Section>
  );
};
