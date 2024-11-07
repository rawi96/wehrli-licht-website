import { classNames } from '@/utils/css';
import { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  className?: string;
  largeMargin?: boolean;
  anchorId?: string | null;
}>;

export const BlockWrapper: FC<Props> = ({ children, className, anchorId }) => (
  <section id={anchorId ?? undefined} className={classNames(className, 'my-24')}>
    {children}
  </section>
);
