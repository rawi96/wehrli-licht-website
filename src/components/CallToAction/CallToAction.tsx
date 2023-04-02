import { Button } from '../Button'
import { Navigation } from '../Navigation'

export const CallToAction = () => {
  return (
    <div className="bg-wehrli">
      <div className="px-6 lg:px-8">
        <Navigation />
      </div>
      <div className="py-24 px-6 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white">
            Unser Angebot
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-200">
            Incididunt sint fugiat pariatur cupidatat consectetur sit cillum
            anim id veniam aliqua proident excepteur commodo do ea.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button type="primary" text="Online Shop" href="/shop" />
            <Button type="secondary" text="Kontakt" href="/kontakt" />
          </div>
        </div>
      </div>
    </div>
  )
}
