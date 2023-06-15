import { GetStaticProps, NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { Button } from '../../components/Button'
import { CallToAction } from '../../components/CallToAction'
import { Footer } from '../../components/Footer'
import { LogoCloud } from '../../components/LogoCloud'
import { PageContainer } from '../../components/PageContainer'
import { ProjectsTeaserRow } from '../../components/ProjectsTeaserRow'
import { TitleSection } from '../../components/TitleSection'
import { livingRoomLight } from '../../data/livingRoomLight'
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
      <NextSeo
        title={livingRoomLight.title}
        description={offerItems[3].description}
      />
      <CallToAction
        title={livingRoomLight.title}
        intro={offerItems[3].description}
      >
        <Button
          type="secondary"
          text={livingRoomLight.primaryButton.text}
          href={livingRoomLight.primaryButton.link}
        />
        <Button
          type="tertiary"
          text={livingRoomLight.secondaryButton.text}
          href={livingRoomLight.secondaryButton.text}
        />
      </CallToAction>
      <PageContainer>
        <div className="mb-20 grid gap-4 md:grid-cols-2">
          <div>
            <h2 className="mb-2 font-bold">
              Hochwertige Leuchten für ein stimmungsvolles Zuhause
            </h2>
            <p>
              Licht spielt eine entscheidende Rolle beim Schaffen einer
              angenehmen Wohnatmosphäre. Es unterstützt und betont die
              vorherrschenden Materialien und die Einrichtung von Wohnräumen. Um
              das perfekte Lichtkonzept zu verwirklichen, bieten wir in unserem
              Showroom eine breite Auswahl an hochwertigen Leuchten europäischer Hersteller.
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-bold">
              Bequem online einkaufen – grosse Auswahl an Wohnraumleuchten
            </h2>
            <p>
              Besuchen Sie unseren Online-Shop und entdecken Sie eine grosse
              Auswahl an stilvollen Wohnraumleuchten. Unsere hochwertigen
              Produkte setzen Ihr Zuhause gekonnt in Szene und verleihen jedem
              Raum eine besondere Atmosphäre.
            </p>
            <div className="my-4">
              <Button type="primary" text="Zum Online Shop" href="/shop" />
            </div>
          </div>
        </div>

        <LogoCloud />
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
