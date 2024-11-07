import { FC, PropsWithChildren } from 'react';

export const Heading3: FC<PropsWithChildren> = ({ children }) => (
  <h3 className="text-2xl font-bold tracking-tight text-wehrli-500">{children}</h3>
);
