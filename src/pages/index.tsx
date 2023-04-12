import { AllOffersGallery } from '../components/AllOffersGallery'
import { Feedback } from '../components/Feedback'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { PageContainer } from '../components/PageContainer'
import { ProjectsTeaserRow } from '../components/ProjectsTeaserRow'
import { Testimonial } from '../components/Testimonial'
import { TitleSection } from '../components/TitleSection'
import { home } from '../data/home'

export default function Home() {
  return (
    <>
      <Hero />
      <PageContainer>
        <TitleSection title={home.offerSubTitle} />
        <AllOffersGallery />

        <TitleSection title={home.projectsSubTitle} />
        <ProjectsTeaserRow />

        <TitleSection title={home.testimonialsSubTitle} />
        <Testimonial />
        <Testimonial />

        <Feedback />
      </PageContainer>
      <Footer />
    </>
  )
}
