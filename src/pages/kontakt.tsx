import { Button } from '../components/Button'
import { CallToAction } from '../components/CallToAction'
import { Container } from '../components/Container'
import { Footer } from '../components/Footer'
import { TitleSection } from '../components/TitleSection'

export default function AboutUs() {
  return (
    <>
      <CallToAction
        title="So finden Sie uns am schnellsten"
        intro="Wir freuen uns, wenn Sie vorbei kommen."
      >
        <Button type="secondary" text="Anfahrt anzeigen" href="/shop" />
        <Button type="tertiary" text="Anrufen" href="/kontakt" />
      </CallToAction>
      <Container>
        <div className="text-center">
          <TitleSection title="Unsere Adresse" />
          <p className="font-semibold">Wehrli Licht GmbH</p>

          <p className="mb-20">
            Blumenstrasse 66 <br />
            9403 Goldach <br />
            +41 71 841 23 68 <br />
            info@wehrli-licht.ch
          </p>

          <TitleSection title="Unsere Öffnungszeiten" />
          <p className="mb-20">
            Montag – Samstag: 09.00 – 12.00 & 14.00 – 18.00 <br />
            Mittwoch- & Samstagnachmittag geschlossen
          </p>
        </div>
      </Container>
      <Footer />
    </>
  )
}
