import { home } from '../../data/home'
import { Button } from '../Button'

export const Feedback = () => {
  return (
    <>
      <div className="text-center">
        <h3 className="text-2xl font-bold tracking-tight text-wehrli">
          {home.feedbackSubTitle}
        </h3>
        <div className="mb-20 mt-10 flex items-center justify-center gap-x-4">
          <Button
            type="primary"
            text={home.feedbackPrimaryButton.text}
            href={home.feedbackPrimaryButton.link}
          />
          <Button
            type="quaternary"
            text={home.feedbackSecondaryButton.text}
            href={home.feedbackSecondaryButton.link}
          />
        </div>
      </div>
    </>
  )
}
