import { TeamBlockFragment } from '@/graphql/generated';
import { toImage } from '../image';
import { TeamBlock as TeamBlockView } from '@wehrli/design-system';
import { FC } from 'react';

type Props = {
  block: TeamBlockFragment;
  /** Block is near the top of the page: load the first portrait eagerly (LCP). */
  aboveFold?: boolean;
};

export const TeamBlock: FC<Props> = ({
  block: { teamTitle, employees, disableMarginBottom, disableMarginTop },
  aboveFold = false,
}) => (
  <TeamBlockView
    title={teamTitle}
    marginTop={!disableMarginTop}
    marginBottom={!disableMarginBottom}
    priority={aboveFold}
    members={employees.map(({ firstname, lastname, bio, image, function: role }) => ({
      name: `${firstname} ${lastname}`,
      role,
      bio,
      image: toImage({ responsiveImage: image?.responsiveImage, title: `${firstname} ${lastname}` }),
    }))}
  />
);
