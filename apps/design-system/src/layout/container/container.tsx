import { FC, PropsWithChildren } from 'react';

/** The page content column: 11/12 of the viewport, at most 1280px (`max-w-7xl`), with the vertical page margin. */
export const Container: FC<PropsWithChildren> = ({ children }) => (
  <div className="mx-auto my-24 w-11/12 max-w-7xl md:my-36">{children}</div>
);
