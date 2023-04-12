import { Button } from '../components/Button'
import { CallToAction } from '../components/CallToAction'
import { Footer } from '../components/Footer'
import { History } from '../components/History'
import { PageContainer } from '../components/PageContainer'
import { Team as TeamComponent } from '../components/Team'
import { TitleSection } from '../components/TitleSection'
import { aboutUs } from '../data/aboutUs'

export default function AboutUs() {
  return (
    <>
      <CallToAction title={aboutUs.title} intro={aboutUs.intro}>
        <Button
          type="secondary"
          text={aboutUs.primaryButton.text}
          href={aboutUs.primaryButton.link}
        />
        <Button
          type="tertiary"
          text={aboutUs.secondaryButton.text}
          href={aboutUs.secondaryButton.link}
        />
      </CallToAction>
      <PageContainer>
        <TitleSection title={aboutUs.teamSubtitle} />
        <TeamComponent />
        <TitleSection title={aboutUs.historySubtitle} />
        <History />
      </PageContainer>
      <Footer />
    </>
  )
}
