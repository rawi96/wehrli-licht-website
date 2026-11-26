import { createElement, FC } from 'react';
import { cn } from '../../fundamentals/cn';
import { CONTENT_IMAGE_SIZES } from '../../layout/grid/grid';
import { Image, ImageData } from '../image/image';

type Props = {
  name: string;
  /** Function or role, shown above the name. */
  role?: string | null;
  bio?: string | null;
  /** Portrait. */
  image?: ImageData | null;
  /** `h3` below a block heading, `h2` when the name is the top heading of the section. */
  headingLevel?: 'h2' | 'h3';
  /** `featured`: portrait beside the text, across the full width (e.g. the owner). */
  variant?: 'default' | 'featured';
  priority?: boolean;
};

/** A person of the team: portrait, function, name and a short bio. */
export const TeamMemberCard: FC<Props> = ({
  name,
  role,
  bio,
  image,
  headingLevel = 'h3',
  variant = 'default',
  priority,
}) => {
  const featured = variant === 'featured';

  return (
    <article
      className={cn('card-surface flex h-full flex-col overflow-hidden', featured && 'md:grid md:grid-cols-[2fr_3fr]')}
    >
      <div className={cn('relative w-full', featured ? 'aspect-[4/5] md:aspect-auto md:min-h-120' : 'aspect-[4/5]')}>
        {image ? (
          <Image
            image={image}
            sizes={featured ? CONTENT_IMAGE_SIZES.twoFifths : CONTENT_IMAGE_SIZES.quarters}
            priority={priority}
            absolute
          />
        ) : null}
      </div>
      <div className={cn('flex flex-1 flex-col p-5 lg:p-6', featured && 'justify-center md:p-12 lg:p-16')}>
        {role ? <p className="text-wehrli mb-2 text-xs font-bold">{role}</p> : null}
        {createElement(
          headingLevel,
          { className: cn('text-wehrli font-bold break-words', featured ? 'mb-6 text-lg md:text-xl' : 'mb-3 text-base') },
          name,
        )}
        {bio ? <p className={cn('text-black', featured ? 'text-base' : 'text-sm')}>{bio}</p> : null}
      </div>
    </article>
  );
};
