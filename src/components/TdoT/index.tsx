import { CheckCircleIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import Link from 'next/link'

const benefits = [
  'Handgefertigte Lampenschirme aus eigener Produktion',
  'Sofortiger Versand',
  'Weitere Farben und Grössen nach Wunsch',
]

export default function TdoT() {
  return (
    <div className='sm:mx-auto sm:max-w-7xl sm:px-6 lg:px-8'>
    <div className="bg-wehrli sm:rounded-2xl mb-20">
      <div className="relative isolate">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto flex max-w-2xl flex-col gap-16 px-16 py-16 sm:rounded-3xl lg:mx-0 lg:max-w-none lg:flex-row lg:items-center xl:gap-x-20 xl:px-20">
            <Image
              className="h-60 sm:h-96 w-full flex-none rounded-2xl object-cover shadow-xl lg:aspect-square lg:h-auto lg:max-w-sm"
              src="/images/angebote/lampenschirme/diverse_lampenschirme.jpg"
              width={1000}
              height={1000}
              alt="Lampenschirme"
            />
            <div className="w-full flex-auto">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Neu: Lampenschirme im Online Shop</h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Wir präsentieren neu eine Auswahl an Lampenschirmen in unserem Online Shop. Alle weiteren Grössen und Formen fertigen wir gerne nach Mass an.
              </p>
              <ul
                role="list"
                className="mt-10 grid grid-cols-1 gap-x-8 gap-y-3 text-base leading-7 text-white sm:grid-cols-2"
              >
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-x-3">
                    <CheckCircleIcon className="h-7 w-5 flex-none" aria-hidden="true" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-col gap-5">
                <Link href="/angebot/lampenschirme" className="text-md font-semibold leading-6 text-white">
                  Mehr über Lampenschirme <span aria-hidden="true">&rarr;</span>
                </Link>
                <Link href="/shop/kategorien/lampenschirme" className="text-md font-semibold leading-6 text-white">
                  Zum Shop <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-x-0 -top-16 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
          aria-hidden="true"
        >
          <div
            className="aspect-[1318/752] w-[82.375rem] flex-none bg-gradient-to-r from-[#ffffff] to-[#ffffff] opacity-25"
            style={{
              clipPath:
                'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
            }}
          />
        </div>
      </div>
    </div>
    </div>
  )
}
