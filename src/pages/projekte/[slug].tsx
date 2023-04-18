import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { Footer } from '../../components/Footer'
import { Hero } from '../../components/Hero'
import { ImageGallery } from '../../components/ImageGallery/ImageGallery'
import { PageContainer } from '../../components/PageContainer'
import { projectItems } from '../../data/projectItems'
import { getHeaderImageByProject } from '../../helpers/getHeaderImageByProject'
import { getImagesByProject } from '../../helpers/getImagesByProject'
import { getProjectByUrlParams } from '../../helpers/getProjectByUrlParams'
import { Project } from '../../types/Project'

type ProjectPageProps = {
  project: Project
  headerImage: { src: string; altText: string }
  images: { src: string; altText: string }[]
}

const ProjectPage: NextPage<ProjectPageProps> = ({
  project,
  headerImage,
  images,
}) => {
  return (
    <>
      <Hero
        image={headerImage}
        title={project.title}
        intro={project.intro}
        primaryButton={{
          text: 'Projekte anschauen',
          link: '/projekte',
        }}
        secondaryButton={{
          text: 'Kontakt',
          link: '/kontakt',
        }}
      />
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

        <ImageGallery images={images} />
      </PageContainer>
      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps<ProjectPageProps> = ({
  params,
}) => {
  const project = getProjectByUrlParams(params)

  if (!project) {
    return { notFound: true }
  }

  const headerImage = getHeaderImageByProject(project)
  const images = [headerImage, ...getImagesByProject(project)]

  return { props: { project, headerImage, images } }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: projectItems.map(({ slug }) => ({ params: { slug } })),
    fallback: 'blocking',
  }
}

export default ProjectPage
