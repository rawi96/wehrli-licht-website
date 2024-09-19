import { FC, PropsWithChildren } from 'react';

export const Heading1: FC<PropsWithChildren> = ({ children }) => (
  <h1 className="my-4 font-anton text-3xl uppercase peer-[p&]:mt-12 md:max-w-prose md:text-4xl lg:text-5xl">{children}</h1>
);
