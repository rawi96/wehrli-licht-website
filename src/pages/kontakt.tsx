import { NextSeo } from 'next-seo'
import Image from 'next/image'
import { Address } from '../components/Address'
import { Button } from '../components/Button'
import { CallToAction } from '../components/CallToAction'
import { Footer } from '../components/Footer'
import { Map } from '../components/Map'
import { OpeningHours } from '../components/OpeningHours'
import { PageContainer } from '../components/PageContainer'
import { TitleSection } from '../components/TitleSection'
import { contact } from '../data/contact'
import { global } from '../data/global'

export default function Contact() {
  return (
    <>
      <NextSeo title={contact.title} description={contact.intro} />
      <CallToAction  intro={contact.intro}>
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
          {global.showHolidays && (
            <>
              <TitleSection title="Wir machen Ferien" />
              <Image
                className="mb-6 inline-block w-96"
                src="/images/vacation/ferien.jpg"
                width={1000}
                height={1000}
                alt="Ferien"
              />
              <div className="text-md mb-20">
                <div>
                  Vom{' '}
                  <strong>{`${global.holidaysStart} bis ${global.holidaysEnd}`}</strong>{' '}
                  bleibt das Geschäft geschlossen.
                </div>
                <div className="mt-2">
                  Nach Voranmeldung sind wir natürlich sehr gerne für Sie da!
                </div>
              </div>
            </>
          )}
          <TitleSection title="Öffnungszeiten" />
          <div className="mb-20">
            <OpeningHours size="l" />
          </div>
          <Map />
          <TitleSection title="Adresse" />
          <div className="mb-20">
            <Address size="l" />
          </div>
        </div>
      </PageContainer>
      <Footer />
    </>
  )
}
