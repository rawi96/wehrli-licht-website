import { Container } from '../components/Container'
import { Feedback } from '../components/Feedback'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { Offers } from '../components/Offers'
import { Testimonial } from '../components/Testimonial'
import { TitleSection } from '../components/TitleSection'

export default function Home() {
  return (
    <>
      <Hero />
      <Container>
        <TitleSection title="Unser Angebot" />
        <Offers />
        <TitleSection title="Was unsere Kund*innen sagen" />

        <Testimonial />
        <Testimonial />

        <Feedback />
      </Container>
      <Footer />
    </>
  )
}
