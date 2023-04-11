import { AllOffersGallery } from '../components/AllOffersGallery'
import { Feedback } from '../components/Feedback'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { PageContainer } from '../components/PageContainer'
import { ProjectsTeaserRow } from '../components/ProjectsTeaserRow'
import { Testimonial } from '../components/Testimonial'
import { TitleSection } from '../components/TitleSection'

export default function Home() {
  return (
    <>
      <Hero />
      <PageContainer>
        <TitleSection title="Unser Angebot" />
        <AllOffersGallery />

        <TitleSection title="Aktuelle Lichtprojekte" />
        <ProjectsTeaserRow />
        <TitleSection title="Was unsere Kund*innen sagen" />

        <Testimonial />
        <Testimonial />
        <Feedback />
      </PageContainer>
      <Footer />
    </>
  )
}
