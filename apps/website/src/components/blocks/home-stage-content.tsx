'use client';

import { classNames } from '@/utils/css';
import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export const HeroReveal: FC<Props> = ({ children, className, delay = 0 }) => (
  <div
    className={classNames('animate-hero-reveal opacity-0 motion-reduce:animate-none motion-reduce:opacity-100', className)}
    style={{ animationDelay: `${delay}ms` }}
  >
    {children}
  </div>
);
