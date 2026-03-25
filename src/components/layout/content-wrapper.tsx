import { FC, PropsWithChildren } from 'react';

export const ContentWrapper: FC<PropsWithChildren> = ({ children }) => (
  <div className="peer-[]/hero-video:mt-16 mx-auto my-24 w-11/12 max-w-7xl md:my-36">{children}</div>
);
