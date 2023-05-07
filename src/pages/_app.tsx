import PlausibleProvider from 'next-plausible'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import './styles/globals.css'

const PLAUSIBLE_DOMAIN = process.env.DOMAIN || 'wehrli-licht-website.vercel.app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="description" content="Description" />
        <meta name="keywords" content="Keywords" />
        <title>Wehrli Licht GmbH</title>

        <link rel="manifest" href="/manifest.json" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <link rel="icon" href="/icons/favicon.ico" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <PlausibleProvider domain={PLAUSIBLE_DOMAIN}>
        <Component {...pageProps} />
      </PlausibleProvider>
    </>
  )
}

export default MyApp
