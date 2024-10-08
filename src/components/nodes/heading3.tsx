import { FC, PropsWithChildren } from 'react';

export const Heading3: FC<PropsWithChildren> = ({ children }) => (
  <h3 className="font-anton my-4 text-xl uppercase peer-[p&]:mt-12 md:max-w-prose md:text-2xl lg:text-3xl">{children}</h3>
);
