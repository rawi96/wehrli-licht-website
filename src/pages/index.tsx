import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { Offers } from '../components/Offers'
import { Reviews } from '../components/Reviews'
import { TitleSection } from '../components/TitleSection'

export default function Home() {
  return (
    <>
      <Hero />
       <TitleSection />
      <Offers />
      <Reviews />
      <Footer />
    </>
  )
}
