import { GetStaticProps, NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { Button } from '../../components/Button'
import { CallToAction } from '../../components/CallToAction'
import { Footer } from '../../components/Footer'
import { PageContainer } from '../../components/PageContainer'
import { ProjectsTeaserRow } from '../../components/ProjectsTeaserRow'
import { StreetView } from '../../components/StreetView'
import { TitleSection } from '../../components/TitleSection'
import { offerItems } from '../../data/offerItems'
import { showRoom } from '../../data/showRoom'
import { getAllProjectsWithHeaderImages } from '../../helpers/getAllProjectsWithHeaderImages'
import { ProjectWithHeaderImage } from '../../types/ProjectWithHeaderImage'

type ShowRoomPageProps = {
  projectsWithHeaderImages: ProjectWithHeaderImage[]
}

const ShowRoomPage: NextPage<ShowRoomPageProps> = ({
  projectsWithHeaderImages,
}) => {
  return (
    <>
      <NextSeo title={showRoom.title} description={offerItems[5].description} />
      <CallToAction title={showRoom.title} intro={offerItems[5].description}>
        <Button
          type="secondary"
          text={showRoom.primaryButton.text}
          href={showRoom.primaryButton.link}
        />
        <Button
          type="tertiary"
          text={showRoom.secondaryButton.text}
          href={showRoom.secondaryButton.text}
        />
      </CallToAction>
      <PageContainer>
        <div className="mb-20 grid gap-4 md:grid-cols-2">
          <div>
            <h2 className="mb-2 font-bold">
              Exklusive Wohnraumleuchten in unserem Showroom
            </h2>
            <p>
              Entdecken Sie in unserem Showroom exklusive Wohnraumleuchten.
              Hochwertige Qualität und ansprechendes Design – von klassischen
              Kristalllustern bis hin zu filigranem Minimalismus.
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-bold">
              Inspirierende Vielfalt für jeden Geschmack
            </h2>
            <p>
              Besuchen Sie unseren Showroom und lassen Sie sich inspirieren.
              Vielfältige Auswahl für jeden Geschmack. Finden Sie die perfekte
              Beleuchtungslösung.
            </p>
            <div className="my-4">
              <Button type="primary" text="Anfahrt" href="/kontakt" />
            </div>
          </div>
        </div>

        <StreetView />

        <TitleSection title="Lichtprojekte" />
        <ProjectsTeaserRow
          projectsWithHeaderImages={projectsWithHeaderImages.slice(0, 5)}
        />
      </PageContainer>
      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps<ShowRoomPageProps> = () => ({
  props: {
    projectsWithHeaderImages: getAllProjectsWithHeaderImages(),
  },
})

export default ShowRoomPage
