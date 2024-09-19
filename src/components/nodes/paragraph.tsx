import { FC, PropsWithChildren } from 'react';

export const Paragraph: FC<PropsWithChildren> = ({ children }) => (
  <p className="peer my-2 md:max-w-prose lg:my-4">{children}</p>
);
