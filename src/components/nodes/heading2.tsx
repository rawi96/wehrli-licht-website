import { FC, PropsWithChildren } from 'react';

export const Heading2: FC<PropsWithChildren> = ({ children }) => (
  <h2 className="my-4 font-anton text-2xl uppercase peer-[p&]:mt-12 md:max-w-prose md:text-3xl lg:text-4xl">{children}</h2>
);
