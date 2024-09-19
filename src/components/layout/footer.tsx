import { ResponsiveImageFragmentFragment } from '@/graphql/generated';
import { FC } from 'react';

type Props = {
  contact?: {
    employeeImage?: ResponsiveImageFragmentFragment;
    heading?: string | null;
    text?: string | null;
  };
};

export const Footer: FC<Props> = () => <>Footer</>;
