import { GetStaticProps, NextPage } from 'next'
import { Button } from '../../components/Button'
import { CallToAction } from '../../components/CallToAction'
import { Footer } from '../../components/Footer'
import { PageContainer } from '../../components/PageContainer'
import { ProjectsTeaserRow } from '../../components/ProjectsTeaserRow'
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
        <TitleSection title="Unser Service" />
        <div className="mb-16">
          <div className="mb-5">{showRoom.text1}</div>
          <div>{showRoom.text2}</div>
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

export const getStaticProps: GetStaticProps<ShowRoomPageProps> = () => ({
  props: {
    projectsWithHeaderImages: getAllProjectsWithHeaderImages(),
  },
})

export default ShowRoomPage
