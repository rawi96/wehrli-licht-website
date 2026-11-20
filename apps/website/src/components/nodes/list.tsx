import { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren;

export const UnorderedList: FC<Props> = ({ children }) => (
  <ul className="marker:text-apricot-500 my-4 ml-5 list-outside list-disc space-y-2 lg:my-8">{children}</ul>
);

export const OrderedList: FC<Props> = ({ children }) => (
  <ol className="marker:text-cornflower-500 my-4 ml-7 list-outside list-decimal space-y-2 marker:font-bold lg:my-8">
    {children}
  </ol>
);
