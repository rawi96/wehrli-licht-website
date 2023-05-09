import { NextSeo } from 'next-seo'
import { Address } from '../components/Address'
import { Button } from '../components/Button'
import { CallToAction } from '../components/CallToAction'
import { Footer } from '../components/Footer'
import { GoogleMap } from '../components/GoogleMap'
import { OpeningHours } from '../components/OpeningHours'
import { PageContainer } from '../components/PageContainer'
import { TitleSection } from '../components/TitleSection'
import { contact } from '../data/contact'

export default function AboutUs() {
  return (
    <>
      <NextSeo title={contact.title} description={contact.intro} />
      <CallToAction title={contact.title} intro={contact.intro}>
        <Button
          type="secondary"
          text={contact.primaryButton.text}
          href={contact.primaryButton.link}
        />
        <Button
          type="tertiary"
          text={contact.secondaryButton.text}
          href={contact.secondaryButton.link}
        />
      </CallToAction>
      <PageContainer>
        <div className="text-center">
          <TitleSection title="Unsere Öffnungszeiten" />
          <div className="mb-20">
            <OpeningHours size="l" />
          </div>
          <TitleSection title="Unsere Adresse" />
          <div className="mb-20">
            <Address size="l" />
          </div>
          <GoogleMap />
        </div>
      </PageContainer>
      <Footer />
    </>
  )
}
