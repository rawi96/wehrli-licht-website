import { FC, PropsWithChildren } from 'react';

export const Serif: FC<PropsWithChildren> = ({ children }) => <em className="italic">{children}</em>;
