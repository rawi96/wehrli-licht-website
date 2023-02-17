import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { Reviews } from '@/components/Reviews'
import { SecondaryFeatures } from '@/components/SecondaryFeatures'

export default function Home() {
  return (
    <>
      {/* <Header /> */}
      <main>
        <Hero />
        <SecondaryFeatures />
        <Reviews />
      </main>
      <Footer />
    </>
  )
}
