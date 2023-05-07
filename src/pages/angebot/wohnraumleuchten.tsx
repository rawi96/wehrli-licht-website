import { GetStaticProps, NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { Button } from '../../components/Button'
import { CallToAction } from '../../components/CallToAction'
import { Footer } from '../../components/Footer'
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
        <TitleSection title="Unser Service" />
        <div className="mb-16">
          <div className="mb-5">{livingRoomLight.text1}</div>
          <div>{livingRoomLight.text2}</div>
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

export const getStaticProps: GetStaticProps<LightPlaningPageProps> = () => ({
  props: {
    projectsWithHeaderImages: getAllProjectsWithHeaderImages(),
  },
})

export default LightPlanningPage
