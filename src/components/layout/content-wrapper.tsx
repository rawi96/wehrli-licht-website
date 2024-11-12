import { FC, PropsWithChildren } from 'react';

export const ContentWrapper: FC<PropsWithChildren> = ({ children }) => (
  <div className="max-w-content mx-auto my-24 w-11/12 peer-[]/hero-video:mt-16 md:my-36">{children}</div>
);
