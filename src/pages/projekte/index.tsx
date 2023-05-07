import { GetStaticProps, NextPage } from 'next'
import { AllProjectsGallery as ProjectComponent } from '../../components/AllProjectsGallery'
import { Button } from '../../components/Button'
import { CallToAction } from '../../components/CallToAction'
import { Footer } from '../../components/Footer'
import { PageContainer } from '../../components/PageContainer'
import { projects } from '../../data/projects'
import { getAllProjectsWithHeaderImages } from '../../helpers/getAllProjectsWithHeaderImages'
import { ProjectWithHeaderImage } from '../../types/ProjectWithHeaderImage'
import { NextSeo } from 'next-seo'

type ProjectPageProps = {
  projectsWithHeaderImages: ProjectWithHeaderImage[]
}

const ProjectsPage: NextPage<ProjectPageProps> = ({
  projectsWithHeaderImages,
}) => {
  return (
    <>
      <NextSeo title={projects.title} description={projects.intro} />
      <CallToAction title={projects.title} intro={projects.intro}>
        <Button
          type="secondary"
          text={projects.primaryButton.text}
          href={projects.primaryButton.link}
        />
        <Button
          type="tertiary"
          text={projects.secondaryButton.text}
          href={projects.secondaryButton.link}
        />
      </CallToAction>
      <PageContainer>
        <ProjectComponent projectsWithHeaderImages={projectsWithHeaderImages} />
      </PageContainer>
      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps<ProjectPageProps> = () => ({
  props: {
    projectsWithHeaderImages: getAllProjectsWithHeaderImages(),
  },
})

export default ProjectsPage
