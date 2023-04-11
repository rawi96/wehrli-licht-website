import { Button } from '../components/Button'
import { CallToAction } from '../components/CallToAction'
import { Footer } from '../components/Footer'
import { History } from '../components/History'
import { PageContainer } from '../components/PageContainer'
import { Team as TeamComponent } from '../components/Team'
import { TitleSection } from '../components/TitleSection'

export default function AboutUs() {
  return (
    <>
      <CallToAction
        title="Über Wehrli Licht"
        intro="Quia illum aut in beatae. Possimus dolores aliquid accusantium aut in ut non assumenda. Enim iusto molestias aut deleniti eos aliquid magnam molestiae. At et non possimus ab. Magni labore molestiae nulla qui."
      >
        <Button type="secondary" text="Online Shop" href="/shop" />
        <Button type="tertiary" text="Kontakt" href="/kontakt" />
      </CallToAction>
      <PageContainer>
        <TitleSection title="Unser Team" />
        <TeamComponent />
        <TitleSection title="Unsere Geschichte" />
        <History />
      </PageContainer>
      <Footer />
    </>
  )
}
