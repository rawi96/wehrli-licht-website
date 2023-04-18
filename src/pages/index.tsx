import { GetStaticProps, NextPage } from 'next'
import { AllOffersGallery } from '../components/AllOffersGallery'
import { Feedback } from '../components/Feedback'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { PageContainer } from '../components/PageContainer'
import { ProjectsTeaserRow } from '../components/ProjectsTeaserRow'
import { Testimonial } from '../components/Testimonial'
import { TitleSection } from '../components/TitleSection'
import { home } from '../data/home'
import { getAllProjectsWithHeaderImages } from '../helpers/getAllProjectsWithHeaderImages'
import { ProjectWithHeaderImage } from '../types/ProjectWithHeaderImage'

type HomePageProps = {
  projectsWithHeaderImages: ProjectWithHeaderImage[]
}

const HomePage: NextPage<HomePageProps> = ({ projectsWithHeaderImages }) => {
  return (
    <>
      <Hero
        image={{
          src: '/images/essbereich.jpg',
          altText: 'Essbereich Beleuchtung',
        }}
        title={home.title}
        intro={home.intro}
        primaryButton={home.primaryButton}
        secondaryButton={home.secondaryButton}
      />
      <PageContainer>
        <TitleSection title={home.offerSubTitle} />
        <AllOffersGallery />

        <TitleSection title={home.projectsSubTitle} />
        <ProjectsTeaserRow
          projectsWithHeaderImages={projectsWithHeaderImages}
        />

        <TitleSection title={home.testimonialsSubTitle} />
        <Testimonial />
        <Testimonial />

        <Feedback />
      </PageContainer>
      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps<HomePageProps> = () => ({
  props: {
    projectsWithHeaderImages: getAllProjectsWithHeaderImages(),
  },
})

export default HomePage
