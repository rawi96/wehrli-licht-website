import React from 'react'
import { Navigation } from './Navigation'

export function CallToAction() {
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
            <a
              href="#"
              className="rounded-md bg-white px-3.5 py-1.5 text-base font-semibold leading-7 text-wehrli shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Zum Online Shop
            </a>
            <a
              href="#"
              className="text-base font-semibold leading-7 text-white"
            >
              Kontakt <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
