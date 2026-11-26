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
    members={employees.map((employee) => {
      // Trimmed: stray spaces in the CMS fields would show as double spaces.
      const name = [employee.firstname, employee.lastname]
        .map((part) => part?.trim())
        .filter(Boolean)
        .join(' ');

      return {
        id: employee.id,
        name,
        role: employee.function,
        bio: employee.bio,
        image: toImage({ responsiveImage: employee.image?.responsiveImage, title: name }),
      };
    })}
  />
);
