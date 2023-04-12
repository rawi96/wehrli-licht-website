import { AllProjectsGallery as ProjectComponent } from '../../components/AllProjectsGallery'
import { Button } from '../../components/Button'
import { CallToAction } from '../../components/CallToAction'
import { Footer } from '../../components/Footer'
import { PageContainer } from '../../components/PageContainer'
import { projects } from '../../data/projects'

export default function Projects() {
  return (
    <>
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
        <ProjectComponent />
      </PageContainer>
      <Footer />
    </>
  )
}
