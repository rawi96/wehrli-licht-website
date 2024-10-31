import { FC, PropsWithChildren } from 'react';

export const Heading1: FC<PropsWithChildren> = ({ children }) => (
  <h1 className="text-4xl font-bold tracking-tight text-wehrli-500">{children}</h1>
);
