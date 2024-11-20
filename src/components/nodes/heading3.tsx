import { FC, PropsWithChildren } from 'react';

export const Heading3: FC<PropsWithChildren> = ({ children }) => (
  <h3 className="my-4 font-sans text-sm font-bold text-wehrli peer-[p&]:mt-6 md:text-base lg:text-lg lg:peer-[p&]:mt-8">
    {children}
  </h3>
);
