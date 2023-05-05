import { GetStaticProps, NextPage } from 'next'
import { Button } from '../../components/Button'
import { CallToAction } from '../../components/CallToAction'
import { Footer } from '../../components/Footer'
import { ImageGallery } from '../../components/ImageGallery/ImageGallery'
import { PageContainer } from '../../components/PageContainer'
import { ProjectsTeaserRow } from '../../components/ProjectsTeaserRow'
import { TitleSection } from '../../components/TitleSection'
import { offerItems } from '../../data/offerItems'
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
      <CallToAction
        title={lightPlanning.title}
        intro={offerItems[0].description}
      >
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
      <TitleSection title="Unser Service" />
      <PageContainer>
        <div className="mb-16">
          <ul className="list-inside list-disc text-center">
            <li>
              Situation erfassen (vor Ort, gemäss Fotos, gemäss Bauplänen)
            </li>
            <li>Ganzheitliches Beleuchtungskonzept erarbeiten</li>
            <li>Lichttechnische Berechnungen gemäss Normen und Richtlinien</li>
            <li>Leuchtenstellen definieren</li>
            <li>Beratung allfälliger Lichtsteuerung</li>
            <li>Herstellung und/oder Beschaffung der Leuchten</li>
          </ul>
        </div>
        <div className="mb-16">
          <ImageGallery
            images={[
              {
                src: '/images/angebote/lichtplanung/lichtplanung_1.jpg',
                altText: 'Lichtplanung',
              },
              {
                src: '/images/angebote/lichtplanung/lichtplanung_2.jpg',
                altText: 'Lichtplanung',
              },
              {
                src: '/images/angebote/lichtplanung/lichtplanung_3.jpg',
                altText: 'Lichtplanung',
              },
              {
                src: '/images/angebote/lichtplanung/lichtplanung_4.jpg',
                altText: 'Lichtplanung',
              },
            ]}
          />
        </div>
        <TitleSection title="Lichtplanung Projekte" />
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
