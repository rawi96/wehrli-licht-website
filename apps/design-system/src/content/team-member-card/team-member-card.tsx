import { createElement, FC } from 'react';
import { CONTENT_IMAGE_SIZES } from '../../layout/grid/grid';
import { Image, ImageData } from '../image/image';

type Props = {
  name: string;
  /** Function or role, shown above the name. */
  role?: string | null;
  bio?: string | null;
  /** Square portrait. */
  image?: ImageData | null;
  /** `h3` below a block heading, `h2` when the name is the top heading of the section. */
  headingLevel?: 'h2' | 'h3';
  priority?: boolean;
};

/** A person of the team: portrait, function, name and a short bio. Sized for a Grid with 3 columns. */
export const TeamMemberCard: FC<Props> = ({ name, role, bio, image, headingLevel = 'h3', priority }) => (
  <div className="bg-white-100 flex flex-col overflow-hidden rounded-lg">
    <div className="w-full">{image && <Image image={image} sizes={CONTENT_IMAGE_SIZES.thirds} priority={priority} />}</div>
    <div className="flex flex-1 flex-col p-8 text-sm font-normal lg:text-sm">
      <p className="mb-6">{role}</p>
      {createElement(headingLevel, { className: 'text-wehrli mb-4 text-base font-bold break-words md:text-lg' }, name)}
      <p>{bio}</p>
      <div className="mt-6 flex flex-1 flex-row flex-wrap content-end gap-x-4 gap-y-2" />
    </div>
  </div>
);
