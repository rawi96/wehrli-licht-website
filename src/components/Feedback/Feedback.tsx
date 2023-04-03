import { Button } from '../Button'

export const Feedback = () => {
  return (
    <>
      <div className="text-center">
        <h3 className="text-2xl font-bold tracking-tight text-wehrli">
          Wir freuen uns über euer Feedback
        </h3>
        <div className="mt-10 mb-20 flex items-center justify-center gap-x-4">
          <Button
            type="primary"
            text="Bewertung abgeben"
            href="/testimonials"
          />
          <Button type="quaternary" text="Bewertungen lesen" href="/kontakt" />
        </div>
      </div>
    </>
  )
}
