import PlausibleProvider from 'next-plausible'
import type { AppProps } from 'next/app'
import { ShopContextProvider } from '../context/ShopContext'
import './styles/globals.css'

const PLAUSIBLE_DOMAIN = process.env.DOMAIN || 'wehrli-licht.ch'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlausibleProvider domain={PLAUSIBLE_DOMAIN}>
      <ShopContextProvider>
        <Component {...pageProps} />
      </ShopContextProvider>
    </PlausibleProvider>
  )
}

export default MyApp
