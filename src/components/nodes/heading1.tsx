import { FC, PropsWithChildren } from 'react';

export const Heading1: FC<PropsWithChildren> = ({ children }) => (
  <h1 className="my-8 font-sans text-lg font-bold text-wehrli peer-[p&]:mt-8 md:max-w-prose md:text-xl lg:text-xxl lg:peer-[p&]:mt-12">
    {children}
  </h1>
);
