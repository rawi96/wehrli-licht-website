import { Heading } from '@/components/nodes';
import { FC, ReactNode } from 'react';

type Props = {
  headingId: string;
  title: string;
  description: ReactNode;
  action?: ReactNode;
  headingColor?: 'white' | 'wehrli';
};

export const ShopSectionHeader: FC<Props> = ({ headingId, title, description, action, headingColor }) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
    <div className="max-w-2xl [&_h2]:mb-3 sm:[&_h2]:mb-6">
      <Heading level="2" id={headingId} color={headingColor}>
        {title}
      </Heading>
      <div className="-mt-1 text-sm leading-relaxed md:-mt-2 md:text-base">{description}</div>
    </div>
    {action}
  </div>
);
