import { Button } from '../components/Button'
import { CallToAction } from '../components/CallToAction'
import { Container } from '../components/Container'
import { Footer } from '../components/Footer'
import { Projects } from '../components/Projects'

export default function AboutUs() {
  return (
    <>
      <CallToAction
        title="Titel"
        intro="Quia illum aut in beatae. Possimus dolores aliquid accusantium aut in ut non assumenda. Enim iusto molestias aut deleniti eos aliquid magnam molestiae. At et non possimus ab. Magni labore molestiae nulla qui."
      >
        <Button type="secondary" text="Online Shop" href="/shop" />
        <Button type="tertiary" text="Kontakt" href="/kontakt" />
      </CallToAction>
      <Container>
        <Projects />
      </Container>
      <Footer />
    </>
  )
}
