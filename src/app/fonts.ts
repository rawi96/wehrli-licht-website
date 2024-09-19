import { Anton, Inter } from 'next/font/google';

export const inter = Inter({
  variable: '--inter-font',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

export const anton = Anton({
  variable: '--anton-font',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});
