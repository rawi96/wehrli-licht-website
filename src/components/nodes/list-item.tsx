import { FC, PropsWithChildren } from 'react';

export const ListItem: FC<PropsWithChildren> = ({ children }) => <li className="md:max-w-prose">{children}</li>;
