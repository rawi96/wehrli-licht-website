import { GetStaticProps, NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { Button } from '../../components/Button'
import { CallToAction } from '../../components/CallToAction'
import { Footer } from '../../components/Footer'
import { PageContainer } from '../../components/PageContainer'
import { ProjectsTeaserRow } from '../../components/ProjectsTeaserRow'
import { ServiceTeaser } from '../../components/ServiceTeaser'
import { TitleSection } from '../../components/TitleSection'
import { lightConsulting } from '../../data/lightConsulting'
import { offerItems } from '../../data/offerItems'
import { getAllProjectsWithHeaderImages } from '../../helpers/getAllProjectsWithHeaderImages'
import { ProjectWithHeaderImage } from '../../types/ProjectWithHeaderImage'

type LightConsultingPageProps = {
  projectsWithHeaderImages: ProjectWithHeaderImage[]
}

const LightConsultingPage: NextPage<LightConsultingPageProps> = ({
  projectsWithHeaderImages,
}) => {
  return (
    <>
      <NextSeo
        title={lightConsulting.title}
        description={offerItems[1].description}
      />
      <CallToAction
        title={lightConsulting.title}
        intro={offerItems[1].description}
      >
        <Button
          type="secondary"
          text={lightConsulting.primaryButton.text}
          href={lightConsulting.primaryButton.link}
        />
        <Button
          type="tertiary"
          text={lightConsulting.secondaryButton.text}
          href={lightConsulting.secondaryButton.text}
        />
      </CallToAction>
      <PageContainer>
        <div className="mb-20 grid gap-4 md:grid-cols-2">
          <div>
            <h2 className="mb-2 font-bold">Ins rechte Licht gerückt</h2>
            <p>
              Besondere Projekte verdienen eine besondere Beleuchtung und die
              entsprechenden Leuchten dazu. Unsere aussergewöhnlichen
              Designerleuchten versprechen ein gelungenes Ergebnis. Um sich eine
              noch nicht realisierte Beleuchtungssituation vorstellen zu können
              benötigt es ein grossen Vorstellungsvermögen.
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-bold">
              Professionelle Unterstützung und Beratung
            </h2>
            <p>
              Wir unterstützen und beraten Sie dabei gerne mit unserem
              Fachwissen und unserer Erfahrung. In unserem Showroom oder bei
              Ihnen vor Ort stehen wir Ihnen mit Rat und Tat zu Seite.
            </p>
            <div className="my-4">
              <Button
                type="primary"
                text="Vereinbaren Sie jetzt einen Termin"
                href="/kontakt"
              />
            </div>
          </div>
        </div>
        <ServiceTeaser
          title={'Wobei wir Sie unterstützen können'}
          imageUrl="/images/angebote/lichtberatung/Mariella_Wirth_Lichtberatung.jpg"
          items={[
            'Architektonisch anspruchsvolle Räume',
            'Unsicherheit bei der Leuchtenauswahl',
            'Beratung bezüglich Lichtleistung, -verteilung & -wirkung',
            'Individuelle Wünsche bezüglich Leuchten oder Licht',
            'Unterstützung zur besseren Visualisierung',
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

export const getStaticProps: GetStaticProps<LightConsultingPageProps> = () => ({
  props: {
    projectsWithHeaderImages: getAllProjectsWithHeaderImages(),
  },
})

export default LightConsultingPage
