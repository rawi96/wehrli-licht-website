import { GetStaticProps, NextPage } from 'next'
import { Button } from '../../components/Button'
import { CallToAction } from '../../components/CallToAction'
import { Footer } from '../../components/Footer'
import { ImageGallery } from '../../components/ImageGallery/ImageGallery'
import { PageContainer } from '../../components/PageContainer'
import { ProjectsTeaserRow } from '../../components/ProjectsTeaserRow'
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
          <TitleSection title="Unser Service" />
          <div className="mb-5">{lampShades.text1}</div>
          <div>{lampShades.text2}</div>
        </div>
        <div className="mb-16">
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
