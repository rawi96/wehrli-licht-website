import { FC, PropsWithChildren } from 'react';

export const Code: FC<PropsWithChildren> = ({ children }) => (
  <code className="bg-cornflower-500 bg-opacity-20 rounded-sm p-1 font-mono text-[0.9em]">{children}</code>
);
