import Image from 'next/image'

const logos = [
  {
    name: 'Gottardo',
    imageSrc: '/images/angebote/wohnraumleuchten/logos/gottardo.jpg',
    url: 'https://www.gottardo-led.swiss/?gad=1',
  },
  {
    name: 'Fluora',
    imageSrc: '/images/angebote/wohnraumleuchten/logos/fluora.jpg',
    url: 'https://www.fluora.ch/fluora/produktfinder',
  },
  {
    name: 'Lupia Licht',
    imageSrc: '/images/angebote/wohnraumleuchten/logos/lupialicht.jpg',
    url: 'xhttps://www.lupialicht.de/',
  },
  {
    name: 'Molto Luce',
    imageSrc: '/images/angebote/wohnraumleuchten/logos/moltoluce.jpg',
    url: 'https://www.moltoluce.com/de-CH/',
  },
  {
    name: 'orion',
    imageSrc: '/images/angebote/wohnraumleuchten/logos/orion.jpg',
    url: 'https://www.orionlightings.com/de/',
  },
  {
    name: 'regent',
    imageSrc: '/images/angebote/wohnraumleuchten/logos/regent.jpg',
    url: 'https://www.regent.ch/',
  },
  {
    name: 'canginituzzi',
    imageSrc: '/images/angebote/wohnraumleuchten/logos/canginituzzi.jpg',
    url: 'https://www.canginietucci.com/?lang=de',
  },
  {
    name: 'casablanca',
    imageSrc: '/images/angebote/wohnraumleuchten/logos/casablanca.jpg',
    url: 'https://casablanca.de/de',
  },
  {
    name: 'elesiluce',
    imageSrc: '/images/angebote/wohnraumleuchten/logos/elesiluce.jpg',
    url: 'https://www.elesi-luce.com/en/',
  },
  {
    name: 'karman',
    imageSrc: '/images/angebote/wohnraumleuchten/logos/karman.jpg',
    url: 'https://karmanitalia.it/en/',
  },
  {
    name: 'terzani',
    imageSrc: '/images/angebote/wohnraumleuchten/logos/terzani.jpg',
    url: 'https://www.terzani.com/en/home',
  },
  {
    name: 'holtkötter',
    imageSrc: '/images/angebote/wohnraumleuchten/logos/holtkoetter.jpg',
    url: 'https://www.holtkoetter.de/index.php/',
  },
]

export const LogoCloud = () => {
  return (
    <div className="pb-20">
      <h2 className="mb-2 font-bold">Unsere Partner</h2>
      <div className="mx-auto mt-10 grid grid-cols-4 items-start gap-x-8 gap-y-10 sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:grid-cols-5">
        {logos.map((logo) => (
          <a href={logo.url} key={logo.name}>
            <Image
              className="col-span-2 max-h-12 w-full object-contain object-left lg:col-span-1"
              src={logo.imageSrc}
              alt={logo.name}
              width={200}
              height={200}
            />
          </a>
        ))}
      </div>
    </div>
  )
}
