import '@/styles/globals.css';
import PlausibleProvider from 'next-plausible';
import { ReactNode } from 'react';
import { inter } from './fonts';

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="de" className="scroll-smooth">
    <head>
      <PlausibleProvider domain="wehrli-licht.ch" />
    </head>
    <body className={`${inter.className} h-full bg-gray-100 antialiased`}>{children}</body>
  </html>
);

export default RootLayout;
