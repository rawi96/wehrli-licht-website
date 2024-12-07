import { Jost } from 'next/font/google';

export const jost = Jost({
  variable: '--jost-font',
  subsets: ['latin'],
  weight: ['400', '600', '700'], // Adjust weights as needed
  display: 'swap',
});
