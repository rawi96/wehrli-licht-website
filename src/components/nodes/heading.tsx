import { FC, ReactNode } from 'react';

const HEADING_STYLES = {
  '1': ' font-bold text-xl md:text-xxl lg:text-xxxl mb-8 break-words',
  '2': ' font-bold text-lg md:text-xl lg:text-xl mb-6 break-words',
  '3': ' font-bold text-base md:text-lg lg:text-xl mb-4 break-words',
} as const;

export const Heading: FC<{
  children: ReactNode;
  level: keyof typeof HEADING_STYLES;
  color?: 'white' | 'wehrli';
}> = ({ children, level, color = 'wehrli' }) => {
  const Tag: `h${keyof typeof HEADING_STYLES}` = `h${level}`;
  const colorClass = color === 'white' ? 'text-white' : 'text-wehrli';

  return <Tag className={`${HEADING_STYLES[level]} ${colorClass}`}>{children}</Tag>;
};
