import { GetStaticProps, NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { Button } from '../../components/Button'
import { CallToAction } from '../../components/CallToAction'
import { Footer } from '../../components/Footer'
import { ImageGallery } from '../../components/ImageGallery/ImageGallery'
import { ImageGalleryWithSubtitles } from '../../components/ImageGalleryWithSubtitles/ImageGalleryWithSubtitles'
import { PageContainer } from '../../components/PageContainer'
import { ProjectsTeaserRow } from '../../components/ProjectsTeaserRow'
import { ServiceTeaser } from '../../components/ServiceTeaser'
import { TitleSection } from '../../components/TitleSection'
import { lampShades } from '../../data/lampShades'
import { offerItems } from '../../data/offerItems'
import { getAllProjectsWithHeaderImages } from '../../helpers/getAllProjectsWithHeaderImages'
import { ProjectWithHeaderImage } from '../../types/ProjectWithHeaderImage'

type LampShadePageProps = {
  projectsWithHeaderImages: ProjectWithHeaderImage[]
}

const LampShadePage: NextPage<LampShadePageProps> = ({
  projectsWithHeaderImages,
}) => {
  return (
    <>
      <NextSeo
        title={lampShades.title}
        description={offerItems[2].description}
      />

      <CallToAction title={lampShades.title} intro={offerItems[2].description}>
        <Button
          type="secondary"
          text={lampShades.primaryButton.text}
          href={lampShades.primaryButton.link}
        />
        <Button
          type="tertiary"
          text={lampShades.secondaryButton.text}
          href={lampShades.secondaryButton.text}
        />
      </CallToAction>
      <PageContainer>
        <div className="mb-16">
          <div className="mb-20 grid gap-4 md:grid-cols-2">
            <div>
              <h2 className="mb-2 font-bold">
                Tradition und Qualität seit über 70 Jahren
              </h2>
              <p>
                Jeder Lampenschirm wird gemäss Wunsch des Kunden angefertigt. Um
                ein perfektes Ergebnis zu erreichen, wird jede Komponente
                individuell zusammengestellt. Die Produktion sowie die Reparatur
                von Lampenschirmen wird vollumfänglich in unseren Atelierräumen
                in Goldach vorgenommen. Unser starkes Team fertigt täglich mit
                viel Herz und Leidenschaft jeden Lampenschirm in Handarbeit an.
                Perfektion ist unser oberstes Gebot.
              </p>
            </div>
            <div>
              <h2 className="mb-2 font-bold">
                Massgeschneiderte Lampenschirme für perfekte Ergebnisse
              </h2>
              <p>
                In unserer über 70-jährigen Firmengeschichte ist die Entwicklung
                und Herstellung von Lampenschirmen eine starke Konstante.
                Material sowie Arbeitsabläufe werden laufend verbessert. In der
                Herstellung sind uns beinahe keine Grenzen gesetzt.
              </p>
              <div className="my-4">
                <Button
                  type="primary"
                  text="Jetzt unverbindliche Beratung anfordern"
                  href="/kontakt"
                />
              </div>
            </div>
          </div>
          <ServiceTeaser
            title={'Lampenschirme nach Mass'}
            imageUrl="/images/angebote/lampenschirme/diverse_lampenschirme.jpg"
            items={[
              'Anfrage telefonisch, per E-Mail oder persönlich bei uns im Showroom',
              'Soll ein neuer Lampenschirm kreiert oder ein bestehender Lampenschirm neu überzogen werden?',
              'Allenfalls Form und Masse bereithalten',
              'Auswahl der Stoffart und -farbe',
              'Individuelle Wünsche bezüglich Leuchten oder Licht',
              'Allfällige zusätzliche Details wie Bordüre, Spezialfolien oder Applikationen besprechen',
              'Uns Zeit geben um Ihr Meisterwerk anzufertigen und sich darauf freuen.',
            ]}
          />
        </div>
        <div className="mb-16">
          <TitleSection title="Lampenschirmformen" />
          <div className="mt-10">
            <ImageGalleryWithSubtitles images={lampShades.shapeImages} />
          </div>
        </div>
        <TitleSection title="Lampenschirm Beispiele" />
        <div className="mt-10">
          <ImageGallery images={lampShades.images} />
        </div>

        <TitleSection title="Lichtprojekte" />
        <ProjectsTeaserRow
          projectsWithHeaderImages={projectsWithHeaderImages.slice(0, 5)}
        />
      </PageContainer>
      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps<LampShadePageProps> = () => ({
  props: {
    projectsWithHeaderImages: getAllProjectsWithHeaderImages(),
  },
})

export default LampShadePage
