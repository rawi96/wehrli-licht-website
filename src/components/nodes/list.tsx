import { FC, PropsWithChildren } from 'react';

export const UnorderedList: FC<PropsWithChildren> = ({ children }) => (
  <ul className="marker:text-signal my-2 ml-5 list-outside list-disc space-y-2 lg:my-4">{children}</ul>
);

export const OrderedList: FC<PropsWithChildren> = ({ children }) => (
  <ol className="my-2 ml-7 list-outside list-decimal space-y-2 lg:my-4">{children}</ol>
);
