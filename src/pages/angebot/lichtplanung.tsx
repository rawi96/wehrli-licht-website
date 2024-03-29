import { GetStaticProps, NextPage } from 'next'
import { NextSeo } from 'next-seo'
import Image from 'next/image'
import { Button } from '../../components/Button'
import { CallToAction } from '../../components/CallToAction'
import { Footer } from '../../components/Footer'
import { PageContainer } from '../../components/PageContainer'
import { ProjectsTeaserRow } from '../../components/ProjectsTeaserRow'
import { ServiceTeaser } from '../../components/ServiceTeaser'
import { TitleSection } from '../../components/TitleSection'
import { lightPlanning } from '../../data/lightPlanning'
import { getAllProjectsWithHeaderImages } from '../../helpers/getAllProjectsWithHeaderImages'
import { ProjectWithHeaderImage } from '../../types/ProjectWithHeaderImage'

type LightPlaningPageProps = {
  projectsWithHeaderImages: ProjectWithHeaderImage[]
}

const LightPlanningPage: NextPage<LightPlaningPageProps> = ({
  projectsWithHeaderImages,
}) => {
  return (
    <>
      <NextSeo title="Lichtplanung" description={lightPlanning.intro} />
      <CallToAction title={lightPlanning.title} intro={lightPlanning.intro}>
        <Button
          type="secondary"
          text={lightPlanning.primaryButton.text}
          href={lightPlanning.primaryButton.link}
        />
        <Button
          type="tertiary"
          text={lightPlanning.secondaryButton.text}
          href={lightPlanning.secondaryButton.text}
        />
      </CallToAction>

      <PageContainer>
        <div className="mb-20 grid gap-4 md:grid-cols-2">
          <Image
            src={'/images/angebote/lichtplanung/lichtplanung_1.jpg'}
            width={1000}
            height={1000}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="full-width rounded-lg"
            alt="Lichtplanung"
          />
          <Image
            src={'/images/angebote/lichtplanung/lichtplanung_2.jpg'}
            width={1000}
            height={1000}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="full-width rounded-lg"
            alt="Lichtplanung"
          />
        </div>

        <div className="mb-20 grid gap-4 md:grid-cols-2">
          <div>
            <h2 className="mb-2 font-bold">
              Lichtplanung für energieeffiziente Beleuchtung in allen Räumen
            </h2>
            <p>
              Unsere Lichtplanungsdienstleistungen sind für alle Arten von
              Räumen geeignet, einschließlich Wohnräume, Arbeitsumgebungen und
              öffentliche Gebäude. Wir helfen Ihnen, die richtigen
              LED-Beleuchtungen, Einsatzorte und Steuerungsmöglichkeiten zu
              finden, um den Energieverbrauch zu minimieren und gleichzeitig
              eine hervorragende Beleuchtung zu gewährleisten.
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-bold">
              Kontaktieren Sie uns für eine massgeschneiderte Lichtplanung
            </h2>
            <p>
              Kontaktieren Sie uns heute, um mehr über unsere
              Lichtplanungsdienstleistungen zu erfahren und Ihre
              Beleuchtungsanforderungen zu besprechen.
            </p>
            <div className="my-4">
              <Button
                type="primary"
                text="Kontakt"
                href="/kontakt"
              />
            </div>
          </div>
        </div>

        <ServiceTeaser
          title={'Lichtplanung auf einem Blick'}
          imageUrl="/images/angebote/lichtplanung/lichtplanung_2.jpg"
          items={[
            'Situation erfassen (vor Ort, gemäss Fotos, gemäss Bauplänen)',
            'Ganzheitliches Beleuchtungskonzept erarbeiten',
            'Lichttechnische Berechnungen gemäss Normen und Richtlinien',
            'Lampenstellen definieren',
            'Beratung allfälliger Lichtsteuerung',
            'Herstellung und/oder Beschaffung der Leuchten',
          ]}
        />

        <TitleSection title="Lichtprojekte" />
        <ProjectsTeaserRow
          projectsWithHeaderImages={projectsWithHeaderImages.slice(0, 5)}
        />
      </PageContainer>
      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps<LightPlaningPageProps> = () => ({
  props: {
    projectsWithHeaderImages: getAllProjectsWithHeaderImages(),
  },
})

export default LightPlanningPage
