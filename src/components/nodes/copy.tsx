import { classNames } from '@/utils/css';
import React, { FC, ReactNode } from 'react';

type Props = {
  className?: string;
  children?: ReactNode;
};

export const Copy: FC<Props> = ({ children, className = '' }) => (
  <p className={classNames('peer my-4 font-sans text-sm md:max-w-prose lg:my-8 lg:text-base', className)}>{children}</p>
);
