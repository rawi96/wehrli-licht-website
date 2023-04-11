import { AllProjectsGallery as ProjectComponent } from '../../components/AllProjectsGallery'
import { Button } from '../../components/Button'
import { CallToAction } from '../../components/CallToAction'
import { Footer } from '../../components/Footer'
import { PageContainer } from '../../components/PageContainer'

export default function Projects() {
  return (
    <>
      <CallToAction
        title="Titel"
        intro="Quia illum aut in beatae. Possimus dolores aliquid accusantium aut in ut non assumenda. Enim iusto molestias aut deleniti eos aliquid magnam molestiae. At et non possimus ab. Magni labore molestiae nulla qui."
      >
        <Button type="secondary" text="Online Shop" href="/shop" />
        <Button type="tertiary" text="Kontakt" href="/kontakt" />
      </CallToAction>
      <PageContainer>
        <ProjectComponent />
      </PageContainer>
      <Footer />
    </>
  )
}
