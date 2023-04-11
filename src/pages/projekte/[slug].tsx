import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { Project } from '../../components/AllProjectsGallery/types'
import { Button } from '../../components/Button'
import { CallToAction } from '../../components/CallToAction'
import { Footer } from '../../components/Footer'
import { ImageGallery } from '../../components/ImageGallery/ImageGallery'
import { PageContainer } from '../../components/PageContainer'
import { projectItems } from '../../data/projectItems'

interface ProjectPageProps {
  project: Project
}

const ProjectPage: NextPage<ProjectPageProps> = ({ project }) => {
  return (
    <>
      <CallToAction title={project.title} intro={project.intro}>
        <Button type="secondary" text="Projekte anschauen" href="/shop" />
        <Button type="tertiary" text="Kontakt" href="/kontakt" />
      </CallToAction>
      <PageContainer>
        <div className="mb-16 text-center">
          {project.lines.map((line) => (
            <p
              key={line}
              className="text-lg font-semibold leading-8 tracking-tight text-gray-900"
            >
              {line}
            </p>
          ))}
        </div>

        <ImageGallery />
      </PageContainer>
      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps<ProjectPageProps> = ({
  params,
}) => {
  if (!params || !params.slug) {
    return {
      notFound: true,
    }
  }

  const { slug } = params
  const project = projectItems.find((project) => project.slug === slug)

  if (!project) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      project,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: projectItems.map(({ slug }) => ({ params: { slug } })),
    fallback: 'blocking',
  }
}

export default ProjectPage
