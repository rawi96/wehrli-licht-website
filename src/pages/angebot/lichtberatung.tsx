import { GetStaticProps, NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { Button } from '../../components/Button'
import { CallToAction } from '../../components/CallToAction'
import { Footer } from '../../components/Footer'
import { PageContainer } from '../../components/PageContainer'
import { ProjectsTeaserRow } from '../../components/ProjectsTeaserRow'
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
        <TitleSection title="Unser Service" />
        <div className="mb-16">
          <div className="mb-5">{lightConsulting.text1}</div>
          <div>{lightConsulting.text2}</div>
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

export const getStaticProps: GetStaticProps<LightConsultingPageProps> = () => ({
  props: {
    projectsWithHeaderImages: getAllProjectsWithHeaderImages(),
  },
})

export default LightConsultingPage
