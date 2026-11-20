import { classNames } from '@/utils/css';
import { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  className?: string;
  largeMargin?: boolean;
  disableMarginTop?: boolean;
  disableMarginBottom?: boolean;
  anchorId?: string | null;
}>;

export const BlockWrapper: FC<Props> = ({ children, className, disableMarginTop, disableMarginBottom, anchorId }) => (
  <section
    id={anchorId ?? undefined}
    className={classNames(className, !disableMarginTop && 'mt-24', !disableMarginBottom && 'mb-24')}
  >
    {children}
  </section>
);
