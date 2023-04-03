import { Navigation } from '../Navigation'
import { CallToActionProps } from './types'

export const CallToAction = ({ title, intro, children }: CallToActionProps) => {
  return (
    <div className="bg-wehrli">
      <div className="px-6 lg:px-8">
        <Navigation />
      </div>
      <div className="py-24 px-6 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white">
            {title}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-200">
            {intro}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
