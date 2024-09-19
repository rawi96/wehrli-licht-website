import '@/styles/globals.css';
import { ReactNode } from 'react';
import { Header } from '../components/layout/header';
import { classNames } from '../utils/css';
import { anton, inter } from './fonts';

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html
      lang="de"
      className={classNames(
        'bg-dark font-inter text-sm text-white antialiased md:text-base',
        inter.variable,
        anton.variable,
      )}
    >
      <head>{/* <PlausibleProvider domain="wehrli-licht.ch" /> */}</head>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
