import { createElement, FC, ReactNode } from 'react';
import { cn } from '../../fundamentals/cn';

const HEADING_STYLES = {
  '1': 'font-bold text-xl md:text-xxl mb-8 break-words',
  '2': 'font-bold text-lg md:text-xl lg:text-xl mb-6 break-words',
  '3': 'font-bold text-base md:text-lg lg:text-xl mb-4 break-words',
} as const;

type Props = {
  children: ReactNode;
  /** Visual style and tag: level `2` renders an `h2` with the h2 style. */
  level: keyof typeof HEADING_STYLES;
  color?: 'white' | 'wehrli';
  id?: string;
};

/** Page and section headings, also used for headings in rich text. */
export const Heading: FC<Props> = ({ children, level, color = 'wehrli', id }) =>
  createElement(
    `h${level}`,
    { id, className: cn(HEADING_STYLES[level], color === 'white' ? 'text-white' : 'text-wehrli') },
    children,
  );
