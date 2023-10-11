import Document, { Head, Html, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default class CustomDocument extends Document {
  render() {
    return (
      <Html lang="de">
        <Head>
          <meta name="application-name" content="Wehrli Licht GmbH" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="Wehrli Licht GmbH" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#214073" />

          <link rel="icon" href="/favicon.ico" />
          <link rel="manifest" href="/manifest.json" />
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-0S4X2C3P58"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-0S4X2C3P58');
            `}
          </Script>
        </Head>
        <body className="h-full bg-gray-50 antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
