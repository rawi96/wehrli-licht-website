import PlausibleProvider from 'next-plausible'
import type { AppProps } from 'next/app'
import './styles/globals.css'

const PLAUSIBLE_DOMAIN = process.env.DOMAIN || 'wehrli-licht-website.vercel.app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlausibleProvider domain={PLAUSIBLE_DOMAIN}>
      <Component {...pageProps} />
    </PlausibleProvider>
  )
}

export default MyApp
