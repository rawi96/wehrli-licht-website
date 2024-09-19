import { classNames } from '@/utils/css';
import { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  className?: string;
  largeMargin?: boolean;
}>;

export const BlockWrapper: FC<Props> = ({ children, className, largeMargin = false }) => (
  <div className={classNames(className, largeMargin ? 'my-24 lg:my-32' : 'my-12 lg:my-16')}>{children}</div>
);
