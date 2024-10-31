import { FC, PropsWithChildren } from 'react';

export const Heading2: FC<PropsWithChildren> = ({ children }) => (
  <h2 className="text-3xl font-bold tracking-tight text-wehrli-500">{children}</h2>
);
