import { NextPage } from 'next'
import { Button } from '../../components/Button'
import { CallToAction } from '../../components/CallToAction'
import { Footer } from '../../components/Footer'
import { PageContainer } from '../../components/PageContainer'
import { lightplanning } from '../../data/lightplanning'

const LightPlanningPage: NextPage = () => {
  return (
    <>
      <CallToAction title={lightplanning.title} intro={lightplanning.intro}>
        <Button
          type="secondary"
          text={lightplanning.primaryButton.text}
          href={lightplanning.primaryButton.link}
        />
        <Button
          type="tertiary"
          text={lightplanning.secondaryButton.text}
          href={lightplanning.secondaryButton.text}
        />
      </CallToAction>
      <PageContainer>
        <div className="mb-16 text-center">text</div>
      </PageContainer>
      <Footer />
    </>
  )
}

export default LightPlanningPage
