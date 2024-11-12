import { FC, ReactNode } from 'react';

type Props = {
  dangerouslySetInnerHTML?: {
    __html: string;
  };
  children?: ReactNode;
};

export const Paragraph: FC<Props> = ({ children, dangerouslySetInnerHTML }) => (
  <p className="peer my-2 md:max-w-prose lg:my-4" dangerouslySetInnerHTML={dangerouslySetInnerHTML}>
    {children}
  </p>
);
