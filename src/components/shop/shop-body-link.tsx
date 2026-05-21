import { classNames } from '@/utils/css';
import Link from 'next/link';
import { FC, ReactNode } from 'react';

type Props = {
  href: string;
  children: ReactNode;
  inverted?: boolean;
};

export const ShopBodyLink: FC<Props> = ({ href, children, inverted }) => (
  <Link
    href={href}
    className={classNames('font-bold underline-offset-2 hover:underline', inverted ? 'text-white' : 'text-wehrli')}
  >
    {children}
  </Link>
);
