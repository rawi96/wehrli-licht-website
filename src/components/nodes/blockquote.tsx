import { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  attribution?: string;
}>;

export const Blockquote: FC<Props> = ({ children, attribution }) => (
  <div className="bg-white-100 my-4 rounded px-8 py-1 md:max-w-prose lg:my-8">
    {children}
    {attribution && <p className="my-4 text-sm italic opacity-50 lg:my-8">{attribution}</p>}
  </div>
);
