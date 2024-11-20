import React, { FC } from 'react';

type Props = {
  children: React.ReactNode;
};

export const Decoration: FC<Props> = ({ children }) => <em className="font-serif font-normal italic">{children}</em>;
