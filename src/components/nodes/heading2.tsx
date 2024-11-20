import { FC, PropsWithChildren } from 'react';

export const Heading2: FC<PropsWithChildren> = ({ children }) => (
  <h2 className="font-sans text-base font-bold text-wehrli md:text-lg lg:text-xl">{children}</h2>
);
