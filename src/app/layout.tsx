import '@/styles/globals.css';
import PlausibleProvider from 'next-plausible';
import { ReactNode } from 'react';
import { inter } from './fonts';
import { Header } from '@/components/layout/header';

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="de">
      <head>
        <PlausibleProvider domain="wehrli-licht.ch" />
      </head>
      <body className={`${inter.className} h-full bg-gray-50 antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
